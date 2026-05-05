import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

const phaseColors = {
  amanecer: '#ffd8a8',
  tarde: '#8ed2ff',
  atardecer: '#ff9ab2',
  noche: '#a39bff',
  cierre: '#f0d4ff',
};

export default function MicelioNode({ currentPhaseId, isSelected, isVisited, node, onSelect }) {
  const groupRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5 + node.pulseOffset) * 0.05;
    const emphasis = isSelected ? 1.35 : isVisited ? 1.18 : node.phaseId === currentPhaseId ? 1.04 : 0.92;
    const nextScale = pulse * emphasis;

    groupRef.current.scale.lerp(new THREE.Vector3(nextScale, nextScale, nextScale), 0.08);
  });

  const color = isSelected
    ? '#fff1d9'
    : isVisited
      ? '#f7c5ff'
      : phaseColors[node.phaseId] ?? '#d9d9ff';

  const emissive = isSelected ? '#ffd7a8' : isVisited ? '#bb87ff' : color;
  const opacity = isSelected ? 1 : node.phaseId === currentPhaseId || isVisited ? 0.95 : 0.55;

  return (
    <group ref={groupRef} position={node.position}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect(node.id);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setIsHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setIsHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.85} transparent opacity={opacity} />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={isSelected ? 0.16 : 0.08} />
      </mesh>

      {(isHovered || isSelected) && (
        <Html center position={[0, 0.42, 0]} distanceFactor={10}>
          <div className="pointer-events-none rounded-full border border-white/10 bg-black/[0.35] px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/80 backdrop-blur-md">
            {node.label}
          </div>
        </Html>
      )}
    </group>
  );
}
