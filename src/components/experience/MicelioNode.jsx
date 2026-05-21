import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { phaseAccentColors } from '../../data/phaseTheme';

export default function MicelioNode({ currentPhaseId, isHighlighted, isVisible, node, onAction, showFullMap }) {
  const groupRef = useRef();
  const coreMaterialRef = useRef();
  const haloMaterialRef = useRef();
  const nextScaleRef = useRef(new THREE.Vector3(1, 1, 1));
  const revealStrengthRef = useRef(isVisible ? 1 : 0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default';
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    revealStrengthRef.current = THREE.MathUtils.lerp(revealStrengthRef.current, isVisible ? 1 : 0, 0.08);

    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5 + node.pulseOffset) * 0.05;
    const emphasis = isHighlighted ? 1.36 : showFullMap ? 1.03 : node.phaseId === currentPhaseId ? 1.06 : 0.96;
    const revealScale = Math.max(0.001, revealStrengthRef.current);
    const nextScale = pulse * emphasis * revealScale;

    nextScaleRef.current.setScalar(nextScale);
    groupRef.current.visible = revealStrengthRef.current > 0.015 || isVisible;
    groupRef.current.scale.lerp(nextScaleRef.current, 0.1);

    const coreOpacity = revealStrengthRef.current * (isHighlighted ? 1 : showFullMap || node.phaseId === currentPhaseId ? 0.95 : 0.74);
    const haloOpacity = revealStrengthRef.current * (isHighlighted ? 0.18 : 0.08);

    if (coreMaterialRef.current) {
      coreMaterialRef.current.opacity = coreOpacity;
    }

    if (haloMaterialRef.current) {
      haloMaterialRef.current.opacity = haloOpacity;
    }
  });

  const color = isHighlighted ? '#fff1d9' : phaseAccentColors[node.phaseId] ?? '#d9d9ff';
  const emissive = isHighlighted ? '#ffd7a8' : color;
  const isClickable = isVisible && typeof onAction === 'function';

  return (
    <group ref={groupRef} position={node.position}>
      <mesh
        onClick={(event) => {
          if (!isClickable) {
            return;
          }

          event.stopPropagation();
          onAction(node.id);
        }}
        onPointerOut={() => {
          setIsHovered(false);
          document.body.style.cursor = 'default';
        }}
        onPointerOver={(event) => {
          if (!isClickable) {
            return;
          }

          event.stopPropagation();
          setIsHovered(true);
          document.body.style.cursor = 'pointer';
        }}
      >
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial
          ref={coreMaterialRef}
          color={color}
          emissive={emissive}
          emissiveIntensity={0.9}
          opacity={0}
          transparent
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshBasicMaterial ref={haloMaterialRef} color={color} opacity={0} transparent />
      </mesh>

      {isVisible && (isHovered || isHighlighted) && (
        <Html center distanceFactor={10} position={[0, 0.42, 0]}>
          <div className="pointer-events-none rounded-full border border-white/10 bg-black/[0.35] px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/80 backdrop-blur-md">
            {node.label}
          </div>
        </Html>
      )}
    </group>
  );
}
