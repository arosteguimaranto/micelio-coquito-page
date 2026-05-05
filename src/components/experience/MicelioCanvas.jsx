import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import MicelioScene from './MicelioScene';

export default function MicelioCanvas({ currentPhaseId, onSelectNode, selectedNodeId, visitedNodeIds }) {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 42 }} dpr={[1, 1.5]}>
      <fog attach="fog" args={['#090b16', 8, 18]} />
      <ambientLight intensity={1.4} />
      <pointLight position={[2.5, 4, 5]} intensity={18} color="#ffe0b5" />
      <pointLight position={[-4, -3, 2]} intensity={10} color="#8ec5ff" />
      <MicelioScene
        currentPhaseId={currentPhaseId}
        onSelectNode={onSelectNode}
        selectedNodeId={selectedNodeId}
        visitedNodeIds={visitedNodeIds}
      />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.2} />
    </Canvas>
  );
}
