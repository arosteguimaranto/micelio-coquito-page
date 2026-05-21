import { useMemo, useRef } from 'react';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { heroHomePalette } from '../../data/homeHero';

function MyceliumPulse({ color, curve, offset, speed }) {
  const pulseRef = useRef();

  useFrame((state) => {
    if (!pulseRef.current) {
      return;
    }

    const progress = (state.clock.elapsedTime * speed + offset) % 1;
    const position = curve.getPointAt(progress);

    pulseRef.current.position.copy(position);
    pulseRef.current.scale.setScalar(0.85 + Math.sin(state.clock.elapsedTime * 6 + offset * Math.PI * 2) * 0.18);
  });

  return (
    <mesh ref={pulseRef}>
      <sphereGeometry args={[0.045, 14, 14]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

function MyceliumConnection({ anchorMap, connection, hoveredMushroomId }) {
  const { curve, points } = useMemo(() => {
    const start = anchorMap.get(connection.from);
    const end = anchorMap.get(connection.to);

    if (!start || !end) {
      return { curve: null, points: [] };
    }

    const rawPoints = [start, ...(connection.via ?? []), end].map(
      ([x, y, z]) => new THREE.Vector3(x, y, z),
    );
    const curvePath = new THREE.CatmullRomCurve3(rawPoints, false, 'centripetal', 0.42);

    return {
      curve: curvePath,
      points: curvePath.getPoints(72),
    };
  }, [anchorMap, connection]);

  if (!curve || points.length === 0) {
    return null;
  }

  const isHovered = hoveredMushroomId && (hoveredMushroomId === connection.from || hoveredMushroomId === connection.to);
  const baseColor = isHovered ? heroHomePalette.crimson : heroHomePalette.lime;
  const glowColor = isHovered ? '#d73f58' : heroHomePalette.moss;
  const opacity = isHovered ? 0.88 : 0.42;

  return (
    <group>
      <Line points={points} color={heroHomePalette.forest} transparent opacity={0.24} lineWidth={1.1} />
      <Line points={points} color={baseColor} transparent opacity={opacity} lineWidth={isHovered ? 1.8 : 1.05} />
      {Array.from({ length: connection.pulseCount ?? 2 }, (_, index) => (
        <MyceliumPulse
          key={`${connection.id}-pulse-${index}`}
          color={glowColor}
          curve={curve}
          offset={index / Math.max(connection.pulseCount ?? 2, 1)}
          speed={connection.speed ?? 0.12}
        />
      ))}
    </group>
  );
}

export default function HeroMyceliumNetwork({ connections, hoveredMushroomId, mushrooms }) {
  const anchorMap = useMemo(
    () => new Map(mushrooms.map((mushroom) => [mushroom.id, mushroom.anchor])),
    [mushrooms],
  );

  return (
    <group>
      {connections.map((connection) => (
        <MyceliumConnection
          key={connection.id}
          anchorMap={anchorMap}
          connection={connection}
          hoveredMushroomId={hoveredMushroomId}
        />
      ))}
      {mushrooms.map((mushroom) => {
        const isHovered = hoveredMushroomId === mushroom.id;

        return (
          <mesh key={`${mushroom.id}-node`} position={mushroom.anchor}>
            <sphereGeometry args={[isHovered ? 0.09 : 0.068, 16, 16]} />
            <meshBasicMaterial
              color={isHovered ? heroHomePalette.paper : heroHomePalette.lime}
              transparent
              opacity={isHovered ? 0.92 : 0.62}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}
