export function getPhaseById(items, phaseId) {
  return items.find((phase) => phase.id === phaseId) ?? items[0];
}
