const STORAGE_KEY = 'coquitos:micelio:experience';

export function readExperienceState({ nodes }) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY);

    if (!rawState) {
      return null;
    }

    const parsedState = JSON.parse(rawState);
    const validNodeIds = new Set(nodes.map((node) => node.id));

    return {
      hasEntered: Boolean(parsedState.hasEntered),
      selectedNodeId:
        typeof parsedState.selectedNodeId === 'string' && validNodeIds.has(parsedState.selectedNodeId)
          ? parsedState.selectedNodeId
          : null,
    };
  } catch {
    return null;
  }
}

export function writeExperienceState(state) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearExperienceState() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
