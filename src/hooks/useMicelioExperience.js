import { useMemo, useState } from 'react';
import { phases } from '../data/phases';
import { nodes, unlockThreshold } from '../data/nodes';
import { getPhaseById } from '../utils/phase';

export function useMicelioExperience() {
  const [hasEntered, setHasEntered] = useState(false);
  const [currentPhaseId, setCurrentPhaseId] = useState('amanecer');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [visitedNodeIds, setVisitedNodeIds] = useState([]);

  const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId) ?? null, [selectedNodeId]);
  const currentPhase = useMemo(() => getPhaseById(phases, currentPhaseId), [currentPhaseId]);
  const visitedCount = visitedNodeIds.length;
  const isClosureUnlocked = visitedCount >= unlockThreshold;

  const handleEnter = () => {
    setHasEntered(true);
  };

  const handleSelectNode = (nodeId) => {
    const node = nodes.find((item) => item.id === nodeId);

    if (!node) {
      return;
    }

    setSelectedNodeId(nodeId);
    setVisitedNodeIds((current) => (current.includes(nodeId) ? current : [...current, nodeId]));

    if (node.phaseId !== currentPhaseId) {
      setCurrentPhaseId(node.phaseId);
    }
  };

  const handlePhaseChange = (phaseId) => {
    if (phaseId === 'cierre' && !isClosureUnlocked) {
      return;
    }

    setCurrentPhaseId(phaseId);

    if (phaseId === 'cierre') {
      setSelectedNodeId(null);
    }
  };

  return {
    currentPhase,
    currentPhaseId,
    currentPhaseLabel: currentPhase.label,
    handleEnter,
    handlePhaseChange,
    handleSelectNode,
    hasEntered,
    isClosureUnlocked,
    phasesProgress: `${visitedCount}/${nodes.length} nodos visitados`,
    selectedNode,
    unlockThreshold,
    visitedCount,
    visitedNodeIds,
  };
}
