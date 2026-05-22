import { useCallback, useEffect, useMemo, useState } from 'react';
import { finalMessage, phases } from '../data/phases';
import { connections, nodes } from '../data/nodes';
import { storySteps as rawStorySteps } from '../data/storySteps';
import { clearExperienceState, readExperienceState, writeExperienceState } from '../utils/experienceState';
import { buildNodeMap, buildPhaseSections } from '../utils/micelioGraph';
import { buildStorySteps, buildVisibleConnections } from '../utils/micelioStory';
import { getPhaseById } from '../utils/phase';

const initialPhaseId = phases[0]?.id ?? 'amanecer';
const initialPhaseNodeId = nodes.find((node) => node.phaseId === initialPhaseId)?.id ?? null;

function getPhaseNodeSteps(storySteps, phaseId) {
  return storySteps.filter((step) => step.type === 'node' && step.phaseId === phaseId);
}

export function useMicelioExperience() {
  const persistedState = readExperienceState({ nodes });
  const persistedNode = persistedState?.selectedNodeId ? nodes.find((node) => node.id === persistedState.selectedNodeId) ?? null : null;

  const [experienceState, setExperienceState] = useState(() => ({
    activePhaseId: initialPhaseId,
    hasEntered: persistedState?.hasEntered ?? false,
    selectedNodeId: persistedNode?.phaseId === initialPhaseId ? persistedNode.id : initialPhaseNodeId,
  }));

  const { activePhaseId, hasEntered, selectedNodeId } = experienceState;
  const nodeMap = useMemo(() => buildNodeMap(nodes), []);
  const storySteps = useMemo(
    () => buildStorySteps({ finalMessage, nodes, phases, steps: rawStorySteps }),
    [],
  );
  const currentPhase = useMemo(() => getPhaseById(phases, activePhaseId), [activePhaseId]);
  const activePhaseIndex = useMemo(
    () => phases.findIndex((phase) => phase.id === activePhaseId),
    [activePhaseId],
  );
  const isClosureStep = activePhaseId === 'cierre';
  const activePhaseNodeSteps = useMemo(
    () => getPhaseNodeSteps(storySteps, activePhaseId),
    [activePhaseId, storySteps],
  );
  const closureStep = useMemo(
    () => storySteps.find((step) => step.type === 'closure' && step.phaseId === 'cierre') ?? null,
    [storySteps],
  );
  const visibleNodeIds = useMemo(
    () => (isClosureStep ? nodes.map((node) => node.id) : activePhaseNodeSteps.map((step) => step.nodeId)),
    [activePhaseNodeSteps, isClosureStep],
  );
  const revealedNodeIdSet = useMemo(() => new Set(visibleNodeIds), [visibleNodeIds]);
  const visibleConnections = useMemo(
    () => buildVisibleConnections({ connections, visibleNodeIdSet: revealedNodeIdSet }),
    [revealedNodeIdSet],
  );
  const selectedNode = useMemo(() => (selectedNodeId ? nodeMap.get(selectedNodeId) ?? null : null), [nodeMap, selectedNodeId]);
  const selectedNodeBelongsToPhase = Boolean(selectedNode && (isClosureStep || selectedNode.phaseId === activePhaseId));
  const highlightedNode = useMemo(() => {
    if (isClosureStep) {
      return selectedNode;
    }

    if (selectedNodeBelongsToPhase) {
      return selectedNode;
    }

    return activePhaseNodeSteps[0]?.node ?? null;
  }, [activePhaseNodeSteps, isClosureStep, selectedNode, selectedNodeBelongsToPhase]);
  const highlightedNodeId = highlightedNode?.id ?? null;
  const activeNodeStep = useMemo(
    () => activePhaseNodeSteps.find((step) => step.nodeId === highlightedNodeId) ?? activePhaseNodeSteps[0] ?? null,
    [activePhaseNodeSteps, highlightedNodeId],
  );
  const phaseSections = useMemo(
    () => buildPhaseSections({ nodes, phases, revealedNodeIdSet }),
    [revealedNodeIdSet],
  );
  const highlightedNodePhaseLabel = useMemo(
    () => (highlightedNode ? getPhaseById(phases, highlightedNode.phaseId)?.label ?? '' : ''),
    [highlightedNode],
  );

  useEffect(() => {
    writeExperienceState({
      hasEntered,
      selectedNodeId,
    });
  }, [hasEntered, selectedNodeId]);

  const handleEnter = useCallback(() => {
    setExperienceState((current) => ({
      ...current,
      hasEntered: true,
    }));
  }, []);

  const handlePhaseChange = useCallback(
    (phaseId, nextNodeId = null) => {
      if (!phases.some((phase) => phase.id === phaseId)) {
        return;
      }

      const phaseNodes = nodes.filter((node) => node.phaseId === phaseId);

      setExperienceState((current) => {
        const currentSelection = current.selectedNodeId ? nodeMap.get(current.selectedNodeId) ?? null : null;
        const selectionStillBelongsToPhase = currentSelection && currentSelection.phaseId === phaseId;
        const fallbackNodeId = phaseNodes[0]?.id ?? null;
        const resolvedNodeId =
          phaseId === 'cierre'
            ? current.selectedNodeId
            : nextNodeId && phaseNodes.some((node) => node.id === nextNodeId)
              ? nextNodeId
              : selectionStillBelongsToPhase
                ? current.selectedNodeId
                : fallbackNodeId;

        return {
          ...current,
          activePhaseId: phaseId,
          selectedNodeId: resolvedNodeId,
        };
      });
    },
    [nodeMap],
  );

  const handleSelectNode = useCallback(
    (nodeId) => {
      const node = nodeMap.get(nodeId);

      if (!node) {
        return;
      }

      setExperienceState((current) => {
        if (current.activePhaseId !== 'cierre' && node.phaseId !== current.activePhaseId) {
          return current;
        }

        return {
          ...current,
          selectedNodeId:
            current.activePhaseId === 'cierre' && current.selectedNodeId === nodeId ? null : nodeId,
        };
      });
    },
    [nodeMap],
  );

  const handleInspectNode = useCallback(
    (nodeId) => {
      const node = nodeMap.get(nodeId);

      if (!node) {
        return;
      }

      handlePhaseChange(node.phaseId, node.id);
    },
    [handlePhaseChange, nodeMap],
  );

  const handleResetExperience = useCallback(() => {
    clearExperienceState();
    setExperienceState({
      activePhaseId: initialPhaseId,
      hasEntered: false,
      selectedNodeId: initialPhaseNodeId,
    });

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return {
    activeNodeStep,
    activePhaseId,
    activePhaseIndex,
    activePhaseNodeSteps,
    closureStep,
    connectionCount: connections.length,
    currentPhase,
    currentPhaseId: activePhaseId,
    currentPhaseLabel: currentPhase.label,
    graph: {
      nodes,
      visibleConnections,
    },
    handleEnter,
    handleInspectNode,
    handlePhaseChange,
    handleResetExperience,
    handleSelectNode,
    hasEntered,
    highlightedNode,
    highlightedNodeId,
    isClosureStep,
    nodeProgress: `${visibleNodeIds.length}/${nodes.length} nodos visibles`,
    phaseProgress: `${Math.max(activePhaseIndex + 1, 1)}/${phases.length} fases`,
    phaseSections,
    revealedNodeIdSet,
    selectedNode,
    highlightedNodePhaseLabel,
    totalNodes: nodes.length,
  };
}
