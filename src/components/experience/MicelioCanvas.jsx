import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import MicelioScene from './MicelioScene';

export default function MicelioCanvas({
  connections,
  currentPhaseId,
  highlightedNodeId,
  isFreeRotationEnabled,
  nodes,
  onNodeAction,
  showFullMap,
  visibleNodeIdSet,
}) {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 42 }} dpr={[1, 1.5]} style={{ width: '100%', height: '100%' }}>
      <fog attach="fog" args={['#090b16', 8, 18]} />
      <ambientLight intensity={1.4} />
      <pointLight position={[2.5, 4, 5]} intensity={18} color="#ffe0b5" />
      <pointLight position={[-4, -3, 2]} intensity={10} color="#8ec5ff" />
      <MicelioScene
        connections={connections}
        currentPhaseId={currentPhaseId}
        highlightedNodeId={highlightedNodeId}
        nodes={nodes}
        onNodeAction={onNodeAction}
        showFullMap={showFullMap}
        visibleNodeIdSet={visibleNodeIdSet}
      />
      <OrbitControls
        autoRotate
        autoRotateSpeed={showFullMap ? 0.28 : 0.18}
        enablePan={false}
        enableRotate={isFreeRotationEnabled}
        enableZoom={false}
      />
    </Canvas>
  );
}
