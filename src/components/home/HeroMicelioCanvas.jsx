import { Canvas } from '@react-three/fiber';
import HeroMicelioScene from './HeroMicelioScene';

export default function HeroMicelioCanvas({ onNavigate }) {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, -0.05, 12.8], fov: 34.5 }} dpr={[1, 1.5]}>
        <color attach="background" args={['#071003']} />
        <fog attach="fog" args={['#081104', 11, 25]} />
        <ambientLight intensity={0.92} color="#dbe8ca" />
        <directionalLight position={[-4.5, 4.2, 5]} intensity={1.8} color="#8db600" />
        <pointLight position={[4.9, 3.2, 5.4]} intensity={22} color="#9c0720" />
        <pointLight position={[-5.2, -1.4, 4.1]} intensity={18} color="#588100" />
        <pointLight position={[0, 1.1, 5.8]} intensity={10} color="#f3e7cf" />
        <HeroMicelioScene onNavigate={onNavigate} />
      </Canvas>
    </div>
  );
}
