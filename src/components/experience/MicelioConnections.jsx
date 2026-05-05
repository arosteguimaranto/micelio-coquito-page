import { Line } from '@react-three/drei';

export default function MicelioConnections({ connections, currentPhaseId, nodes, selectedNodeId, visitedNodeIds }) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  return connections.map(([fromId, toId]) => {
    const fromNode = nodeMap.get(fromId);
    const toNode = nodeMap.get(toId);

    if (!fromNode || !toNode) {
      return null;
    }

    const isActive = fromId === selectedNodeId || toId === selectedNodeId;
    const isVisited = visitedNodeIds.includes(fromId) && visitedNodeIds.includes(toId);
    const isCurrentPhase = fromNode.phaseId === currentPhaseId || toNode.phaseId === currentPhaseId;

    const color = isActive ? '#ffe7bf' : isVisited ? '#f7cfe4' : isCurrentPhase ? '#c3b2ff' : '#6d7088';
    const opacity = isActive ? 0.95 : isVisited ? 0.72 : isCurrentPhase ? 0.42 : 0.2;

    return (
      <Line
        key={`${fromId}-${toId}`}
        points={[fromNode.position, toNode.position]}
        color={color}
        lineWidth={isActive ? 2.2 : 1.2}
        transparent
        opacity={opacity}
      />
    );
  });
}
