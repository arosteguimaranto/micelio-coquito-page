import { useMemo, useRef } from 'react';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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
      <sphereGeometry args={[0.052, 14, 14]} />
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
  const baseColor = isHovered ? '#fff4db' : '#f4e2ca';
  const glowColor = isHovered ? '#fff8ea' : '#ffe7bf';
  const opacity = isHovered ? 0.92 : 0.48;

  return (
    <group>
      <Line points={points} color="#8f7560" transparent opacity={0.18} lineWidth={1.2} />
      <Line points={points} color={baseColor} transparent opacity={opacity} lineWidth={isHovered ? 2.2 : 1.3} />
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
            <sphereGeometry args={[isHovered ? 0.11 : 0.085, 16, 16]} />
            <meshBasicMaterial
              color={isHovered ? '#fff7ec' : '#f8e7d3'}
              transparent
              opacity={isHovered ? 0.95 : 0.65}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}
