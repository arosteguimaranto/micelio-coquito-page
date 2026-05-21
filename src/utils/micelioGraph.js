export function buildNodeMap(nodes) {
  return new Map(nodes.map((node) => [node.id, node]));
}

export function buildPhaseSections({ nodes, phases, revealedNodeIdSet }) {
  return phases.map((phase) => {
    const phaseNodes = nodes.filter((node) => node.phaseId === phase.id);
    const revealedNodes = phaseNodes.filter((node) => revealedNodeIdSet.has(node.id)).length;

    return {
      ...phase,
      nodes: phaseNodes,
      revealedNodes,
      totalNodes: phaseNodes.length,
    };
  });
}
