import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import MicelioConnections from './MicelioConnections';
import MicelioNode from './MicelioNode';

export default function MicelioScene({
  connections,
  currentPhaseId,
  highlightedNodeId,
  nodes,
  onNodeAction,
  showFullMap,
  visibleNodeIdSet,
}) {
  const { camera, size } = useThree();
  const graphBounds = useMemo(() => {
    const xs = nodes.map((node) => node.position[0]);
    const ys = nodes.map((node) => node.position[1]);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
      height: maxY - minY,
      width: maxX - minX,
    };
  }, [nodes]);

  const graphScale = useMemo(() => {
    const cameraDistance = Math.abs(camera.position.z);
    const verticalFov = 'fov' in camera ? (camera.fov * Math.PI) / 180 : Math.PI / 4;
    const viewportHeight = 2 * cameraDistance * Math.tan(verticalFov / 2);
    const viewportWidth = viewportHeight * (size.width / Math.max(size.height, 1));

    const scaleByWidth = (viewportWidth * 0.72) / graphBounds.width;
    const scaleByHeight = (viewportHeight * 0.84) / graphBounds.height;

    return Math.min(scaleByWidth, scaleByHeight);
  }, [camera, graphBounds.height, graphBounds.width, size.height, size.width]);

  const graphPosition = useMemo(
    () => [
      (-graphBounds.centerX + graphBounds.width * 0.02) * graphScale,
      (-graphBounds.centerY - graphBounds.height * 0.04) * graphScale,
      0,
    ],
    [graphBounds.centerX, graphBounds.centerY, graphBounds.height, graphBounds.width, graphScale],
  );

  return (
    <>
      <Sparkles count={42} scale={[9, 7, 5]} size={1.8} speed={0.18} color="#f8d7ff" opacity={0.45} />
      <group position={graphPosition} scale={[graphScale, graphScale, graphScale]}>
        <MicelioConnections
          connections={connections}
          currentPhaseId={currentPhaseId}
          highlightedNodeId={highlightedNodeId}
          nodes={nodes}
          showFullMap={showFullMap}
          visibleNodeIdSet={visibleNodeIdSet}
        />
        {nodes.map((node) => (
          <MicelioNode
            key={node.id}
            currentPhaseId={currentPhaseId}
            isHighlighted={highlightedNodeId === node.id}
            isVisible={visibleNodeIdSet.has(node.id)}
            node={node}
            onAction={onNodeAction}
            showFullMap={showFullMap}
          />
        ))}
      </group>
    </>
  );
}
