import { useCallback, useEffect, useMemo, useState } from 'react';
import { finalMessage, phases } from '../data/phases';
import { connections, nodes } from '../data/nodes';
import { storySteps as rawStorySteps } from '../data/storySteps';
import { clearExperienceState, readExperienceState, writeExperienceState } from '../utils/experienceState';
import { buildNodeMap, buildPhaseSections } from '../utils/micelioGraph';
import {
  buildNodeStepTargets,
  buildPhaseStepTargets,
  buildStorySteps,
  buildVisibleConnections,
  buildVisibleNodeIds,
} from '../utils/micelioStory';
import { getPhaseById } from '../utils/phase';

export function useMicelioExperience() {
  const persistedState = readExperienceState({ nodes });
  const initialStoryStepId = rawStorySteps[0]?.id ?? 'story-cierre';

  const [experienceState, setExperienceState] = useState(() => ({
    hasEntered: persistedState?.hasEntered ?? false,
    selectedNodeId: persistedState?.selectedNodeId ?? null,
  }));
  const [activeStoryStepId, setActiveStoryStepId] = useState(initialStoryStepId);

  const { hasEntered, selectedNodeId } = experienceState;
  const nodeMap = useMemo(() => buildNodeMap(nodes), []);
  const storySteps = useMemo(
    () => buildStorySteps({ finalMessage, nodes, phases, steps: rawStorySteps }),
    [],
  );
  const phaseStepTargets = useMemo(() => buildPhaseStepTargets(storySteps), [storySteps]);
  const nodeStepTargets = useMemo(() => buildNodeStepTargets(storySteps), [storySteps]);
  const activeStoryStep = useMemo(
    () => storySteps.find((step) => step.id === activeStoryStepId) ?? storySteps[0],
    [activeStoryStepId, storySteps],
  );
  const activeStoryStepIndex = activeStoryStep?.index ?? 0;
  const revealedNodeIds = useMemo(
    () => buildVisibleNodeIds({ activeStepIndex: activeStoryStepIndex, nodes, steps: storySteps }),
    [activeStoryStepIndex, storySteps],
  );
  const revealedNodeIdSet = useMemo(() => new Set(revealedNodeIds), [revealedNodeIds]);
  const visibleConnections = useMemo(
    () => buildVisibleConnections({ connections, visibleNodeIdSet: revealedNodeIdSet }),
    [revealedNodeIdSet],
  );
  const isClosureStep = activeStoryStep?.type === 'closure';
  const currentPhaseId = activeStoryStep?.phaseId ?? phases[0]?.id ?? 'amanecer';
  const currentPhase = useMemo(() => getPhaseById(phases, currentPhaseId), [currentPhaseId]);
  const selectedNode = useMemo(() => (selectedNodeId ? nodeMap.get(selectedNodeId) ?? null : null), [nodeMap, selectedNodeId]);
  const phaseSections = useMemo(
    () => buildPhaseSections({ nodes, phases, revealedNodeIdSet }),
    [revealedNodeIdSet],
  );
  const highlightedNodeId = isClosureStep ? selectedNodeId : activeStoryStep?.nodeId ?? null;
  const highlightedNode = isClosureStep ? selectedNode : activeStoryStep?.node ?? null;
  const selectedNodePhaseLabel = useMemo(
    () => (selectedNode ? getPhaseById(phases, selectedNode.phaseId)?.label ?? '' : ''),
    [selectedNode],
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

  const handleActiveStoryStepChange = useCallback(
    (stepId) => {
      if (!storySteps.some((step) => step.id === stepId)) {
        return;
      }

      setActiveStoryStepId(stepId);

      if (stepId !== phaseStepTargets.cierre) {
        setExperienceState((current) => ({
          ...current,
          selectedNodeId: null,
        }));
      }
    },
    [phaseStepTargets.cierre, storySteps],
  );

  const handleSelectNode = useCallback(
    (nodeId) => {
      if (!isClosureStep || !nodeMap.has(nodeId)) {
        return;
      }

      setExperienceState((current) => ({
        ...current,
        selectedNodeId: current.selectedNodeId === nodeId ? null : nodeId,
      }));
    },
    [isClosureStep, nodeMap],
  );

  const handleResetExperience = useCallback(() => {
    clearExperienceState();
    setExperienceState({
      hasEntered: false,
      selectedNodeId: null,
    });
    setActiveStoryStepId(initialStoryStepId);

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [initialStoryStepId]);

  return {
    activeStoryStep,
    connectionCount: connections.length,
    currentPhase,
    currentPhaseId,
    currentPhaseLabel: currentPhase.label,
    graph: {
      nodes,
      visibleConnections,
    },
    handleActiveStoryStepChange,
    handleEnter,
    handleResetExperience,
    handleSelectNode,
    hasEntered,
    highlightedNode,
    highlightedNodeId,
    isClosureStep,
    nodeProgress: `${revealedNodeIds.length}/${nodes.length} nodos revelados`,
    nodeStepTargets,
    phaseSections,
    phaseStepTargets,
    revealedNodeIdSet,
    selectedNode,
    selectedNodePhaseLabel,
    storyProgress: `${activeStoryStepIndex + 1}/${storySteps.length} estaciones`,
    storySteps,
    totalNodes: nodes.length,
  };
}
