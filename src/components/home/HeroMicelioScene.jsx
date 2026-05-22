import { Sparkles } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import HeroMicelioMushroom from './HeroMicelioMushroom';
import HeroMyceliumNetwork from './HeroMyceliumNetwork';
import { heroHomePalette, heroSceneLayouts } from '../../data/homeHero';

export default function HeroMicelioScene({ onNavigate }) {
  const groupRef = useRef();
  const { mouse, size } = useThree();
  const [hoveredMushroomId, setHoveredMushroomId] = useState(null);
  const isMobile = size.width < 768;
  const sceneLayout = isMobile ? heroSceneLayouts.mobile : heroSceneLayouts.desktop;
  const {
    backgroundOrbs,
    connections,
    groupPosition,
    mushrooms,
    sparkles,
  } = sceneLayout;

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const baseY = groupPosition[1];

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * (isMobile ? 0.012 : 0.03), 0.028);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * (isMobile ? 0.008 : 0.018), 0.028);
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      baseY + Math.sin(state.clock.elapsedTime * 0.22) * (isMobile ? 0.022 : 0.04),
      0.08,
    );
  });

  return (
    <>
      <Sparkles
        count={sparkles.count}
        scale={sparkles.scale}
        size={sparkles.size}
        speed={sparkles.speed}
        color={heroHomePalette.lime}
        opacity={sparkles.opacity}
      />
      {backgroundOrbs.map((orb) => (
        <mesh key={orb.key} position={orb.position} scale={orb.scale}>
          <sphereGeometry args={[1, 26, 26]} />
          <meshBasicMaterial color={orb.color} transparent opacity={orb.opacity} toneMapped={false} />
        </mesh>
      ))}

      <group ref={groupRef} position={groupPosition}>
        <HeroMyceliumNetwork
          connections={connections}
          hoveredMushroomId={hoveredMushroomId}
          mushrooms={mushrooms}
        />

        {mushrooms.map((mushroom) => (
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
