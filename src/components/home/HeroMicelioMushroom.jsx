import { useEffect, useMemo, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function shiftColor(hex, lightnessOffset = 0, saturationOffset = 0) {
  const color = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };

  color.getHSL(hsl);
  color.setHSL(hsl.h, clamp(hsl.s + saturationOffset, 0, 1), clamp(hsl.l + lightnessOffset, 0, 1));

  return color;
}

function colorToRgba(color, alpha = 1) {
  return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${alpha})`;
}

function buildCapSpots({ count = 12, radius = 0.7, height = 0.28 }) {
  return Array.from({ length: count }, (_, index) => {
    const normalized = index / Math.max(count, 1);
    const angle = normalized * Math.PI * 2 + Math.sin((index + 1) * 3.17) * 0.18;
    const distance = radius * (0.18 + ((Math.cos((index + 1) * 5.31) + 1) / 2) * 0.72);
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    const y = 0.06 + (1 - distance / radius) * height;
    const scale = 0.05 + ((Math.sin((index + 1) * 4.19) + 1) / 2) * 0.05;

    return {
      key: `${index}-${angle.toFixed(3)}`,
      position: [x, y, z],
      scale,
    };
  });
}

function createCanvasTexture(width, height, painter, options = {}) {
  if (typeof document === 'undefined') {
    return null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');

  if (!context) {
    return null;
  }

  painter(context, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = options.wrapS ?? THREE.ClampToEdgeWrapping;
  texture.wrapT = options.wrapT ?? THREE.ClampToEdgeWrapping;
  texture.colorSpace = options.colorSpace ?? THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  if (options.repeat) {
    texture.repeat.set(options.repeat[0], options.repeat[1]);
  }

  return texture;
}

function buildMushroomTextures(mushroom) {
  const capBase = shiftColor(mushroom.capColor, 0, 0);
  const capEdge = shiftColor(mushroom.capColor, -0.18, 0.02);
  const capHighlight = shiftColor(mushroom.capColor, 0.16, -0.04);
  const capShadow = shiftColor(mushroom.capColor, -0.28, 0.04);
  const stemBase = shiftColor(mushroom.stemColor, 0.02, -0.04);
  const stemShadow = shiftColor(mushroom.stemColor, -0.16, -0.02);
  const gillBase = shiftColor(mushroom.gillColor, 0.04, -0.08);
  const gillShadow = shiftColor(mushroom.gillColor, -0.18, 0);

  const capMap = createCanvasTexture(768, 768, (ctx, width, height) => {
    const radial = ctx.createRadialGradient(width * 0.46, height * 0.34, width * 0.08, width * 0.5, height * 0.52, width * 0.48);
    radial.addColorStop(0, colorToRgba(capHighlight, 1));
    radial.addColorStop(0.28, colorToRgba(capBase, 1));
    radial.addColorStop(0.72, colorToRgba(capEdge, 1));
    radial.addColorStop(1, colorToRgba(capShadow, 1));
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);

    for (let index = 0; index < 220; index += 1) {
      const angle = (index / 220) * Math.PI * 2;
      const startRadius = width * 0.05 + Math.random() * width * 0.09;
      const endRadius = width * (0.28 + Math.random() * 0.2);
      const startX = width * 0.5 + Math.cos(angle) * startRadius;
      const startY = height * 0.42 + Math.sin(angle) * startRadius * 0.72;
      const endX = width * 0.5 + Math.cos(angle) * endRadius;
      const endY = height * 0.56 + Math.sin(angle) * endRadius * 0.66;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.lineWidth = 0.8 + Math.random() * 1.2;
      ctx.strokeStyle = colorToRgba(capShadow, 0.05 + Math.random() * 0.08);
      ctx.stroke();
    }

    for (let index = 0; index < 180; index += 1) {
      const radius = width * (0.08 + Math.random() * 0.36);
      const angle = Math.random() * Math.PI * 2;
      const x = width * 0.5 + Math.cos(angle) * radius;
      const y = height * 0.48 + Math.sin(angle) * radius * 0.7;
      const size = 1.2 + Math.random() * 3.4;

      ctx.fillStyle = colorToRgba(capHighlight, 0.05 + Math.random() * 0.08);
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    if (mushroom.spots) {
      const spotColor = shiftColor(mushroom.spots.color, 0.04, -0.02);

      for (let index = 0; index < mushroom.spots.count; index += 1) {
        const radius = width * (0.08 + Math.random() * 0.26);
        const angle = Math.random() * Math.PI * 2;
        const x = width * 0.5 + Math.cos(angle) * radius;
        const y = height * 0.45 + Math.sin(angle) * radius * 0.65;
        const size = width * (0.02 + Math.random() * 0.026);

        ctx.beginPath();
        ctx.fillStyle = colorToRgba(spotColor, 0.92);
        ctx.shadowColor = colorToRgba(capShadow, 0.18);
        ctx.shadowBlur = 10;
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.fillStyle = colorToRgba(shiftColor(mushroom.spots.color, -0.08, 0), 0.22);
        ctx.arc(x + size * 0.16, y + size * 0.12, size * 0.72, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });

  const capBumpMap = createCanvasTexture(
    768,
    768,
    (ctx, width, height) => {
      ctx.fillStyle = 'rgb(128,128,128)';
      ctx.fillRect(0, 0, width, height);

      for (let index = 0; index < 260; index += 1) {
        const angle = (index / 260) * Math.PI * 2;
        const startRadius = width * 0.05;
        const endRadius = width * (0.28 + Math.random() * 0.22);
        const startX = width * 0.5 + Math.cos(angle) * startRadius;
        const startY = height * 0.43 + Math.sin(angle) * startRadius * 0.72;
        const endX = width * 0.5 + Math.cos(angle) * endRadius;
        const endY = height * 0.56 + Math.sin(angle) * endRadius * 0.66;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        const intensity = 120 + Math.random() * 90;
        ctx.strokeStyle = `rgba(${intensity},${intensity},${intensity},${0.06 + Math.random() * 0.12})`;
        ctx.lineWidth = 1 + Math.random() * 1.1;
        ctx.stroke();
      }

      for (let index = 0; index < 220; index += 1) {
        const radius = width * (0.06 + Math.random() * 0.4);
        const angle = Math.random() * Math.PI * 2;
        const x = width * 0.5 + Math.cos(angle) * radius;
        const y = height * 0.48 + Math.sin(angle) * radius * 0.72;
        const size = 1 + Math.random() * 2.6;
        const value = 106 + Math.random() * 56;

        ctx.fillStyle = `rgba(${value},${value},${value},0.14)`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    { colorSpace: THREE.NoColorSpace },
  );

  const stemMap = createCanvasTexture(256, 768, (ctx, width, height) => {
    const gradient = ctx.createLinearGradient(width * 0.25, 0, width * 0.7, height);
    gradient.addColorStop(0, colorToRgba(shiftColor(stemBase, 0.1, -0.04), 1));
    gradient.addColorStop(0.46, colorToRgba(stemBase, 1));
    gradient.addColorStop(1, colorToRgba(stemShadow, 1));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    for (let index = 0; index < 90; index += 1) {
      const startX = width * (0.18 + Math.random() * 0.64);
      const endX = startX + (Math.random() - 0.5) * 22;
      const controlX = startX + (Math.random() - 0.5) * 18;
      const controlY = height * (0.3 + Math.random() * 0.4);

      ctx.beginPath();
      ctx.moveTo(startX, 0);
      ctx.quadraticCurveTo(controlX, controlY, endX, height);
      ctx.strokeStyle = colorToRgba(stemShadow, 0.07 + Math.random() * 0.08);
      ctx.lineWidth = 1 + Math.random() * 1.6;
      ctx.stroke();
    }

    for (let index = 0; index < 140; index += 1) {
      const x = width * (0.14 + Math.random() * 0.72);
      const y = Math.random() * height;
      const sizeX = 2 + Math.random() * 6;
      const sizeY = 8 + Math.random() * 18;
      ctx.fillStyle = colorToRgba(shiftColor(stemBase, 0.08, -0.04), 0.03 + Math.random() * 0.05);
      ctx.fillRect(x, y, sizeX, sizeY);
    }
  });

  const stemBumpMap = createCanvasTexture(
    256,
    768,
    (ctx, width, height) => {
      ctx.fillStyle = 'rgb(128,128,128)';
      ctx.fillRect(0, 0, width, height);

      for (let index = 0; index < 110; index += 1) {
        const x = width * (0.16 + Math.random() * 0.68);
        const controlX = x + (Math.random() - 0.5) * 18;
        const endX = x + (Math.random() - 0.5) * 12;
        const brightness = 118 + Math.random() * 70;

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.quadraticCurveTo(controlX, height * 0.5, endX, height);
        ctx.strokeStyle = `rgba(${brightness},${brightness},${brightness},${0.1 + Math.random() * 0.1})`;
        ctx.lineWidth = 1 + Math.random() * 1.8;
        ctx.stroke();
      }
    },
    { colorSpace: THREE.NoColorSpace },
  );

  const gillMap = createCanvasTexture(768, 768, (ctx, width, height) => {
    const gradient = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.04, width * 0.5, height * 0.5, width * 0.5);
    gradient.addColorStop(0, colorToRgba(shiftColor(gillBase, 0.08, -0.06), 1));
    gradient.addColorStop(0.6, colorToRgba(gillBase, 1));
    gradient.addColorStop(1, colorToRgba(gillShadow, 1));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    for (let index = 0; index < 220; index += 1) {
      const angle = (index / 220) * Math.PI * 2;
      const startRadius = width * 0.08;
      const endRadius = width * 0.46;
      const startX = width * 0.5 + Math.cos(angle) * startRadius;
      const startY = height * 0.5 + Math.sin(angle) * startRadius;
      const endX = width * 0.5 + Math.cos(angle) * endRadius;
      const endY = height * 0.5 + Math.sin(angle) * endRadius;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.lineWidth = 1.2 + Math.random() * 1.4;
      ctx.strokeStyle = colorToRgba(gillShadow, 0.1 + Math.random() * 0.12);
      ctx.stroke();
    }

    for (let ring = 0; ring < 5; ring += 1) {
      ctx.beginPath();
      ctx.arc(width * 0.5, height * 0.5, width * (0.12 + ring * 0.07), 0, Math.PI * 2);
      ctx.strokeStyle = colorToRgba(gillShadow, 0.04);
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  });

  return {
    capBumpMap,
    capMap,
    gillMap,
    stemBumpMap,
    stemMap,
  };
}

function buildCapGeometry() {
  const geometry = new THREE.SphereGeometry(1, 46, 30, 0, Math.PI * 2, 0, Math.PI / 2);
  const positions = geometry.attributes.position;
  const vector = new THREE.Vector3();

  for (let index = 0; index < positions.count; index += 1) {
    vector.fromBufferAttribute(positions, index);

    const angle = Math.atan2(vector.z, vector.x);
    const radius = Math.sqrt(vector.x * vector.x + vector.z * vector.z);
    const rimFactor = THREE.MathUtils.smoothstep(radius, 0.22, 1);
    const wave = Math.sin(angle * 6 + radius * 7.5) * 0.05 * rimFactor;

    vector.y += wave * 0.42;
    vector.x *= 1 + wave * 0.08;
    vector.z *= 1 + wave * 0.08;

    positions.setXYZ(index, vector.x, vector.y, vector.z);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();

  return geometry;
}

function buildStemGeometry() {
  const geometry = new THREE.CylinderGeometry(0.15, 0.26, 1.62, 28, 24);
  const positions = geometry.attributes.position;
  const vector = new THREE.Vector3();

  for (let index = 0; index < positions.count; index += 1) {
    vector.fromBufferAttribute(positions, index);

    const normalizedY = (vector.y + 0.81) / 1.62;
    const angle = Math.atan2(vector.z, vector.x);
    const wobble = Math.sin(normalizedY * Math.PI * 3.2 + angle * 2.4) * 0.035;
    const bulge = Math.sin(normalizedY * Math.PI) * 0.12;

    vector.x *= 1 + bulge * 0.1 + wobble;
    vector.z *= 1 + bulge * 0.08 - wobble * 0.8;
    vector.x += Math.sin(normalizedY * Math.PI * 2.4) * 0.015;

    positions.setXYZ(index, vector.x, vector.y, vector.z);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();

  return geometry;
}

export default function HeroMicelioMushroom({ isHovered, mushroom, onHoverChange, onNavigate }) {
  const groupRef = useRef();
  const scaleTargetRef = useRef(new THREE.Vector3(mushroom.scale, mushroom.scale, mushroom.scale));
  const rootGlowRef = useRef();
  const capMaterialRef = useRef();
  const labelRef = useRef();
  const labelOpacityRef = useRef(0);
  const isInteractive = Boolean(mushroom.route);
  const capScale = mushroom.capScale ?? [1, 1, 1];
  const stemScale = mushroom.stemScale ?? [1, 1, 1];
  const gillScale = mushroom.gillScale ?? [1.02, 0.5, 1.02];
  const ringScale = mushroom.ringScale ?? [1.04, 1.04, 0.42];
  const stemOffset = mushroom.stemOffset ?? [0, 0, 0];
  const annulusColor = useMemo(
    () => shiftColor(mushroom.ringColor ?? mushroom.stemColor, -0.04, -0.03),
    [mushroom.ringColor, mushroom.stemColor],
  );

  const capSpots = useMemo(() => (mushroom.spots ? buildCapSpots(mushroom.spots) : []), [mushroom.spots]);
  const textures = useMemo(() => buildMushroomTextures(mushroom), [mushroom]);
  const capGeometry = useMemo(() => buildCapGeometry(), []);
  const stemGeometry = useMemo(() => buildStemGeometry(), []);

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default';
    };
  }, []);

  useEffect(
    () => () => {
      Object.values(textures).forEach((texture) => texture?.dispose?.());
      capGeometry.dispose();
      stemGeometry.dispose();
    },
    [capGeometry, stemGeometry, textures],
  );

  useFrame((state, delta) => {
    if (!groupRef.current || !rootGlowRef.current || !capMaterialRef.current) {
      return;
    }

    const pulse = Math.sin(state.clock.elapsedTime * 1.1 + mushroom.anchor[0]) * 0.02;
    const hoverScale = isHovered ? (isInteractive ? 1.14 : 1.08) : 1;
    const nextScale = mushroom.scale * (hoverScale + pulse);

    scaleTargetRef.current.setScalar(nextScale);
    groupRef.current.scale.lerp(scaleTargetRef.current, 0.1);

    const tiltTarget = mushroom.tilt + Math.sin(state.clock.elapsedTime * 0.45 + mushroom.anchor[1]) * 0.035;
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      (mushroom.upsideDown ? Math.PI : 0) + tiltTarget,
      0.06,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      Math.sin(state.clock.elapsedTime * 0.35 + mushroom.anchor[2]) * 0.06,
      0.04,
    );

    const rootPulse = isHovered ? 1.18 : isInteractive ? 0.94 : 0.82;
    rootGlowRef.current.material.opacity = THREE.MathUtils.lerp(
      rootGlowRef.current.material.opacity,
      isHovered ? 0.42 : isInteractive ? 0.3 : 0.2,
      0.08,
    );
    rootGlowRef.current.scale.setScalar(rootPulse + Math.sin(state.clock.elapsedTime * 2.6 + mushroom.anchor[0]) * 0.08);

    capMaterialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
      capMaterialRef.current.emissiveIntensity,
      isHovered ? 0.92 : isInteractive ? 0.5 : 0.26,
      0.08,
    );

    labelOpacityRef.current = THREE.MathUtils.damp(
      labelOpacityRef.current,
      isHovered ? 1 : isInteractive ? 0.64 : 0,
      4,
      delta,
    );

    if (labelRef.current) {
      labelRef.current.style.opacity = labelOpacityRef.current.toFixed(3);
      labelRef.current.style.transform = `translate3d(0, ${((1 - labelOpacityRef.current) * 6).toFixed(2)}px, 0)`;
    }
  });

  const handleActivate = (event) => {
    if (!isInteractive || !onNavigate) {
      return;
    }

    event.stopPropagation();
    onNavigate(mushroom.route);
  };

  return (
    <group
      ref={groupRef}
      position={mushroom.anchor}
      rotation={[0, 0, (mushroom.upsideDown ? Math.PI : 0) + mushroom.tilt]}
      scale={[mushroom.scale, mushroom.scale, mushroom.scale]}
    >
      <mesh ref={rootGlowRef} position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.16, 18, 18]} />
        <meshBasicMaterial color={mushroom.glowColor} transparent opacity={isInteractive ? 0.3 : 0.24} toneMapped={false} />
      </mesh>

      <mesh position={[0, 0.08, 0]} scale={[1.55, 0.7, 1.55]}>
        <sphereGeometry args={[0.18, 18, 18]} />
        <meshStandardMaterial
          color={mushroom.stemColor}
          map={textures.stemMap}
          bumpMap={textures.stemBumpMap}
          bumpScale={0.045}
          roughness={0.88}
          emissive={mushroom.glowColor}
          emissiveIntensity={isInteractive ? 0.2 : 0.14}
        />
      </mesh>

      <mesh position={[stemOffset[0], 0.82 + stemOffset[1], stemOffset[2]]} scale={stemScale} geometry={stemGeometry}>
        <meshStandardMaterial
          color={mushroom.stemColor}
          map={textures.stemMap}
          bumpMap={textures.stemBumpMap}
          bumpScale={0.08}
          roughness={0.92}
          emissive={mushroom.glowColor}
          emissiveIntensity={isInteractive ? 0.09 : 0.05}
        />
      </mesh>

      <mesh
        position={[stemOffset[0], 1.08 + stemOffset[1], stemOffset[2]]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={ringScale}
      >
        <torusGeometry args={[0.26, 0.075, 14, 28]} />
        <meshStandardMaterial
          color={annulusColor}
          roughness={0.94}
          emissive={mushroom.glowColor}
          emissiveIntensity={0.04}
        />
      </mesh>

      <mesh position={[0, 1.61, 0]} scale={gillScale}>
        <sphereGeometry args={[0.84, 30, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={mushroom.gillColor}
          map={textures.gillMap}
          roughness={0.95}
          emissive={mushroom.glowColor}
          emissiveIntensity={0.05}
        />
      </mesh>

      <mesh
        geometry={capGeometry}
        position={[0, 1.76, 0]}
        scale={capScale}
        onClick={handleActivate}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHoverChange(mushroom.id);
          document.body.style.cursor = isInteractive ? 'pointer' : 'default';
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          onHoverChange(null);
          document.body.style.cursor = 'default';
        }}
      >
        <meshPhysicalMaterial
          ref={capMaterialRef}
          color={mushroom.capColor}
          map={textures.capMap}
          bumpMap={textures.capBumpMap}
          bumpScale={0.085}
          roughness={0.8}
          metalness={0.02}
          clearcoat={0.06}
          sheen={0.22}
          sheenRoughness={0.78}
          emissive={mushroom.glowColor}
          emissiveIntensity={isInteractive ? 0.5 : 0.26}
        />
      </mesh>

      {isInteractive ? (
        <mesh
          position={[0, 1.75, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[Math.max(0.96, capScale[0]), 1, Math.max(0.96, capScale[2])]}
          onClick={handleActivate}
        >
          <ringGeometry args={[1.06, 1.18, 42]} />
          <meshBasicMaterial
            color={mushroom.glowColor}
            transparent
            opacity={isHovered ? 0.6 : 0.28}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ) : null}

      {capSpots.map((spot) => (
        <mesh
          key={spot.key}
          position={[
            spot.position[0] * capScale[0],
            1.95 + spot.position[1] * capScale[1],
            spot.position[2] * capScale[2],
          ]}
          scale={[spot.scale, spot.scale, spot.scale]}
        >
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial
            color={mushroom.spots.color}
            roughness={0.92}
            emissive={mushroom.spots.color}
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}

      <mesh position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={gillScale}>
        <circleGeometry args={[0.76, 44]} />
        <meshStandardMaterial map={textures.gillMap} color={mushroom.gillColor} transparent opacity={0.86} side={THREE.DoubleSide} />
      </mesh>

      <Html center position={[0, mushroom.upsideDown ? -3.18 : 3.18, 0]} distanceFactor={10}>
        <div
          ref={labelRef}
          className={[
            'pointer-events-none rounded-2xl border px-3 py-2 text-center shadow-[0_12px_30px_rgba(7,16,3,0.22)] backdrop-blur-md transition',
            isInteractive ? 'border-[#8db600]/22 bg-[#071003]/72 text-[#f4efe4]' : 'border-[#588100]/15 bg-[#071003]/48 text-[#dfe9ca]',
          ].join(' ')}
          style={{ opacity: isInteractive ? 1 : 0 }}
        >
          <strong className="block text-[11px] uppercase tracking-[0.32em]">{mushroom.label}</strong>
          {isInteractive ? <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-[#c9d9a8]">click para entrar</span> : null}
        </div>
      </Html>
    </group>
  );
}
