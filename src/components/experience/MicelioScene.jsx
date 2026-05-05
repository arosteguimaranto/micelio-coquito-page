import { Sparkles } from '@react-three/drei';
import { nodes, connections } from '../../data/nodes';
import MicelioConnections from './MicelioConnections';
import MicelioNode from './MicelioNode';

export default function MicelioScene({ currentPhaseId, onSelectNode, selectedNodeId, visitedNodeIds }) {
  return (
    <group>
      <Sparkles count={42} scale={[9, 7, 5]} size={1.8} speed={0.18} color="#f8d7ff" opacity={0.45} />
      <MicelioConnections
        connections={connections}
        currentPhaseId={currentPhaseId}
        nodes={nodes}
        selectedNodeId={selectedNodeId}
        visitedNodeIds={visitedNodeIds}
      />
      {nodes.map((node) => (
        <MicelioNode
          key={node.id}
          currentPhaseId={currentPhaseId}
          isSelected={selectedNodeId === node.id}
          isVisited={visitedNodeIds.includes(node.id)}
          node={node}
          onSelect={onSelectNode}
        />
      ))}
    </group>
  );
}
