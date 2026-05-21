import { Sparkles } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import HeroMicelioMushroom from './HeroMicelioMushroom';
import HeroMyceliumNetwork from './HeroMyceliumNetwork';
import { heroHomePalette, heroMushrooms, heroMyceliumConnections } from '../../data/homeHero';

export default function HeroMicelioScene({ onNavigate }) {
  const groupRef = useRef();
  const { mouse } = useThree();
  const [hoveredMushroomId, setHoveredMushroomId] = useState(null);

  const backgroundOrbs = useMemo(
    () => [
      { key: 'left', position: [-4.8, 0.15, -5.1], scale: [2.7, 2.7, 2.7], color: heroHomePalette.moss, opacity: 0.16 },
      { key: 'center', position: [0.1, -1.48, -5.3], scale: [2.8, 2.8, 2.8], color: heroHomePalette.wine, opacity: 0.11 },
      { key: 'right', position: [4.85, 0.08, -4.9], scale: [2.8, 2.8, 2.8], color: heroHomePalette.crimson, opacity: 0.16 },
    ],
    [],
  );

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.03, 0.028);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.018, 0.028);
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.22) * 0.04;
  });

  return (
    <>
      <Sparkles count={38} scale={[13, 8, 6]} size={1.35} speed={0.18} color={heroHomePalette.lime} opacity={0.28} />
      {backgroundOrbs.map((orb) => (
        <mesh key={orb.key} position={orb.position} scale={orb.scale}>
          <sphereGeometry args={[1, 26, 26]} />
          <meshBasicMaterial color={orb.color} transparent opacity={orb.opacity} toneMapped={false} />
        </mesh>
      ))}

      <group ref={groupRef} position={[0, -0.18, 0]}>
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
