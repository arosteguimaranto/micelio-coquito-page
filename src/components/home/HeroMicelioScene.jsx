import { Sparkles } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import HeroMicelioMushroom from './HeroMicelioMushroom';
import HeroMyceliumNetwork from './HeroMyceliumNetwork';
import { heroMushrooms, heroMyceliumConnections } from '../../data/homeHero';

export default function HeroMicelioScene({ onNavigate }) {
  const groupRef = useRef();
  const { mouse } = useThree();
  const [hoveredMushroomId, setHoveredMushroomId] = useState(null);

  const backgroundOrbs = useMemo(
    () => [
      { key: 'left', position: [-4.2, 0.25, -4.8], scale: [2.2, 2.2, 2.2], color: '#7c5338', opacity: 0.1 },
      { key: 'center', position: [1.25, -1.28, -5.1], scale: [2.5, 2.5, 2.5], color: '#fff1d8', opacity: 0.16 },
      { key: 'right', position: [4.35, 1.02, -4.4], scale: [3.1, 3.1, 3.1], color: '#9f6f58', opacity: 0.13 },
    ],
    [],
  );

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.14, 0.04);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.06, 0.04);
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.28) * 0.1;
  });

  return (
    <>
      <Sparkles count={48} scale={[12, 8, 6]} size={1.65} speed={0.2} color="#fff1d8" opacity={0.38} />
      {backgroundOrbs.map((orb) => (
        <mesh key={orb.key} position={orb.position} scale={orb.scale}>
          <sphereGeometry args={[1, 26, 26]} />
          <meshBasicMaterial color={orb.color} transparent opacity={orb.opacity} toneMapped={false} />
        </mesh>
      ))}

      <group ref={groupRef} position={[0.3, -0.08, 0]}>
        <HeroMyceliumNetwork
          connections={heroMyceliumConnections}
          hoveredMushroomId={hoveredMushroomId}
          mushrooms={heroMushrooms}
        />

        {heroMushrooms.map((mushroom) => (
          <HeroMicelioMushroom
            key={mushroom.id}
            isHovered={hoveredMushroomId === mushroom.id}
            mushroom={mushroom}
            onHoverChange={setHoveredMushroomId}
            onNavigate={onNavigate}
          />
        ))}
      </group>
    </>
  );
}
