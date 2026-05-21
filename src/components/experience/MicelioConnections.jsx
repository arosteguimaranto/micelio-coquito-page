import { useMemo } from 'react';
import { Line } from '@react-three/drei';

export default function MicelioConnections({
  connections,
  currentPhaseId,
  highlightedNodeId,
  nodes,
  showFullMap,
  visibleNodeIdSet,
}) {
  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);

  return connections.map(([fromId, toId]) => {
    const fromNode = nodeMap.get(fromId);
    const toNode = nodeMap.get(toId);

    if (!fromNode || !toNode) {
      return null;
    }

    const isRevealed = showFullMap || (visibleNodeIdSet.has(fromId) && visibleNodeIdSet.has(toId));

    if (!isRevealed) {
      return null;
    }

    const isActive = fromId === highlightedNodeId || toId === highlightedNodeId;
    const isCurrentPhase = fromNode.phaseId === currentPhaseId || toNode.phaseId === currentPhaseId;

    const color = isActive ? '#ffe7bf' : showFullMap ? '#f7cfe4' : isCurrentPhase ? '#c3b2ff' : '#6d7088';
    const opacity = isActive ? 0.95 : showFullMap ? 0.58 : isCurrentPhase ? 0.42 : 0.22;

    return (
      <Line
        key={`${fromId}-${toId}`}
        color={color}
        lineWidth={isActive ? 2.2 : showFullMap ? 1.5 : 1.2}
        opacity={opacity}
        points={[fromNode.position, toNode.position]}
        transparent
      />
    );
  });
}
