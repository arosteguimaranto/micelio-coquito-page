export function buildStorySteps({ finalMessage, nodes, phases, steps }) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const phaseMap = new Map(phases.map((phase) => [phase.id, phase]));
  const nodeCountByPhase = nodes.reduce((accumulator, node) => {
    accumulator[node.phaseId] = (accumulator[node.phaseId] ?? 0) + 1;
    return accumulator;
  }, {});
  const nodeProgressByPhase = {};

  let previousPhaseId = null;

  return steps
    .map((step, index) => {
      if (step.type === 'closure') {
        const phase = phaseMap.get(step.phaseId);

        return {
          ...step,
          footer: finalMessage.footer,
          headline: phase?.headline ?? finalMessage.title,
          id: step.id,
          index,
          lines: finalMessage.lines,
          phaseDescription: phase?.description ?? '',
          phaseLabel: phase?.label ?? 'Cierre',
          sequenceLabel: String(index + 1).padStart(2, '0'),
          startsPhase: step.phaseId !== previousPhaseId,
          supportingQuote: phase?.supportingQuote ?? '',
          title: finalMessage.title,
        };
      }

      const node = nodeMap.get(step.nodeId);

      if (!node) {
        return null;
      }

      const phase = phaseMap.get(node.phaseId);
      const phaseNodeIndex = (nodeProgressByPhase[node.phaseId] ?? 0) + 1;

      nodeProgressByPhase[node.phaseId] = phaseNodeIndex;

      const enrichedStep = {
        ...step,
        excerpt: node.excerpt,
        headline: phase?.headline ?? node.label,
        id: step.id,
        index,
        node,
        note: node.note,
        phaseDescription: phase?.description ?? '',
        phaseId: node.phaseId,
        phaseLabel: phase?.label ?? '',
        phaseNodeCount: nodeCountByPhase[node.phaseId] ?? 1,
        phaseNodeIndex,
        quote: node.quote,
        sequenceLabel: String(index + 1).padStart(2, '0'),
        startsPhase: node.phaseId !== previousPhaseId,
        supportingQuote: phase?.supportingQuote ?? '',
        title: node.label,
      };

      previousPhaseId = node.phaseId;

      return enrichedStep;
    })
    .filter(Boolean);
}

export function buildVisibleNodeIds({ activeStepIndex, nodes, steps }) {
  if (activeStepIndex < 0) {
    return [];
  }

  const activeStep = steps[activeStepIndex];

  if (activeStep?.type === 'closure') {
    return nodes.map((node) => node.id);
  }

  return steps
    .slice(0, activeStepIndex + 1)
    .filter((step) => step.type === 'node')
    .map((step) => step.nodeId);
}

export function buildVisibleConnections({ connections, visibleNodeIdSet }) {
  return connections.filter(([fromId, toId]) => visibleNodeIdSet.has(fromId) && visibleNodeIdSet.has(toId));
}

export function buildPhaseStepTargets(steps) {
  return steps.reduce((targets, step) => {
    if (!targets[step.phaseId]) {
      targets[step.phaseId] = step.id;
    }

    return targets;
  }, {});
}

export function buildNodeStepTargets(steps) {
  return steps.reduce((targets, step) => {
    if (step.type === 'node' && step.nodeId) {
      targets[step.nodeId] = step.id;
    }

    return targets;
  }, {});
}
