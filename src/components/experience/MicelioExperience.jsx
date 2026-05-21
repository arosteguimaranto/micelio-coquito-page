import { useCallback, useEffect, useRef } from 'react';
import MicelioCanvas from './MicelioCanvas';
import MicelioMapPanel from '../ui/MicelioMapPanel';
import MicelioStoryRail from './MicelioStoryRail';
import PhaseNavigator from '../ui/PhaseNavigator';
import { phaseAccentColors, phaseAuraColors } from '../../data/phaseTheme';
import { phases } from '../../data/phases';

export default function MicelioExperience({
  activeStoryStep,
  connectionCount,
  currentPhase,
  currentPhaseId,
  currentPhaseLabel,
  graph,
  handleActiveStoryStepChange,
  handleResetExperience,
  handleSelectNode,
  highlightedNode,
  highlightedNodeId,
  isClosureStep,
  nodeProgress,
  nodeStepTargets,
  phaseSections,
  phaseStepTargets,
  revealedNodeIdSet,
  selectedNode,
  selectedNodePhaseLabel,
  storyProgress,
  storySteps,
  totalNodes,
}) {
  const storySectionRefs = useRef(new Map());
  const currentAccent = phaseAccentColors[currentPhaseId] ?? '#ffffff';

  const registerStepRef = useCallback(
    (stepId) => (element) => {
      if (element) {
        storySectionRefs.current.set(stepId, element);
        return;
      }

      storySectionRefs.current.delete(stepId);
    },
    [],
  );

  useEffect(() => {
    const observedElements = Array.from(storySectionRefs.current.values());

    if (!observedElements.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);

        if (!visibleEntries.length) {
          return;
        }

        const focusLine = window.innerHeight * 0.45;
        const nextEntry = visibleEntries.sort((entryA, entryB) => {
          const centerA = entryA.boundingClientRect.top + entryA.boundingClientRect.height / 2;
          const centerB = entryB.boundingClientRect.top + entryB.boundingClientRect.height / 2;

          return Math.abs(centerA - focusLine) - Math.abs(centerB - focusLine);
        })[0];

        const nextStepId = nextEntry.target.getAttribute('data-step-id');

        if (nextStepId) {
          handleActiveStoryStepChange(nextStepId);
        }
      },
      {
        rootMargin: '-16% 0px -22% 0px',
        threshold: [0.18, 0.4, 0.66],
      },
    );

    observedElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [handleActiveStoryStepChange]);

  const scrollToStep = useCallback(
    (stepId) => {
      const targetElement = stepId ? storySectionRefs.current.get(stepId) : null;

      if (!targetElement) {
        return;
      }

      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      handleActiveStoryStepChange(stepId);
    },
    [handleActiveStoryStepChange],
  );

  const handlePhaseJump = useCallback(
    (phaseId) => {
      scrollToStep(phaseStepTargets[phaseId]);
    },
    [phaseStepTargets, scrollToStep],
  );

  const handleNodeAction = useCallback(
    (nodeId) => {
      if (isClosureStep) {
        handleSelectNode(nodeId);
        return;
      }

      scrollToStep(nodeStepTargets[nodeId]);
    },
    [handleSelectNode, isClosureStep, nodeStepTargets, scrollToStep],
  );

  const canvasOverlayBody = isClosureStep
    ? 'La red completa ya quedó desplegada. Ahora sí podés tocar cualquier nodo para enfocarlo, releerlo y compararlo con el resto del mapa.'
    : highlightedNode?.excerpt ?? 'Cada estación del scroll prende un punto más del micelio.';

  return (
    <section className="mx-auto flex min-h-screen max-w-[1500px] flex-col gap-5 px-4 py-4 md:px-6 lg:px-8 lg:py-6">
      <header className="panel flex flex-col gap-6 p-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs uppercase tracking-[0.45em] text-white/[0.55]">Cartografía emocional</p>
          <h1 className="text-3xl font-semibold leading-tight text-white md:text-4xl">{currentPhase.headline}</h1>
          <p className="text-sm leading-7 text-white/[0.78] md:text-base">{currentPhase.description}</p>
          <p className="text-sm italic leading-7 text-white/[0.62]">“{currentPhase.supportingQuote}”</p>
        </div>

        <div className="space-y-3 lg:max-w-md lg:text-right">
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <div className="rounded-full border border-white/[0.1] bg-white/[0.08] px-4 py-2 text-sm text-white/[0.7]">
              Fase: <span className="font-semibold text-white">{currentPhaseLabel}</span>
            </div>
            <div className="rounded-full border border-white/[0.1] bg-white/[0.08] px-4 py-2 text-sm text-white/[0.7]">
              Nodos: <span className="font-semibold text-white">{nodeProgress}</span>
            </div>
            <div className="rounded-full border border-white/[0.1] bg-white/[0.08] px-4 py-2 text-sm text-white/[0.7]">
              Secuencia: <span className="font-semibold text-white">{storyProgress}</span>
            </div>
          </div>
          <p className="text-sm leading-6 text-white/[0.58]">
            Tenías razón: el fondo estaba cortando demasiado brusco y el rail todavía no respetaba un 2x2 real por fase.
            Ahora cada bloque del día agrupa sus puntos dentro de esa grilla y el cambio de atmósfera hace crossfade.
          </p>
        </div>
      </header>

      <PhaseNavigator phases={phases} currentPhaseId={currentPhaseId} onChange={handlePhaseJump} />

      <div className="grid flex-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.92fr)] xl:items-start">
        <div className="xl:sticky xl:top-5">
          <div className="panel relative min-h-[62vh] overflow-hidden p-3 md:min-h-[70vh] xl:min-h-[calc(100vh-8rem)]">
            {phases.map((phase) => (
              <div
                key={`canvas-aura-${phase.id}`}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 blur-3xl transition-opacity duration-[1400ms] ease-out"
                style={{
                  background: `radial-gradient(circle at 30% 35%, ${phaseAuraColors[phase.id]} 0%, transparent 42%)`,
                  opacity: phase.id === currentPhaseId ? 0.8 : 0,
                }}
              />
            ))}
            <div aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-[1.5rem] micelio-canvas-grid" />

            <div className="pointer-events-none absolute left-5 top-5 z-10 max-w-sm rounded-2xl border border-white/[0.1] bg-black/[0.18] px-4 py-3 text-xs leading-6 text-white/[0.62] backdrop-blur-md">
              {isClosureStep
                ? 'Mapa completo activo. Ahora sí podés tocar los nodos para enfocarlos libremente.'
                : 'Deslizá o tocá un nodo ya revelado: cada bloque del relato prende un punto nuevo y te deja saltar a su estación sin perder el hilo.'}
            </div>

            <div className="pointer-events-none absolute bottom-5 left-5 right-5 z-10 rounded-3xl border border-white/[0.1] bg-black/[0.22] p-4 backdrop-blur-md md:p-5">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/45">{currentPhaseLabel}</p>
                  <h2 className="text-2xl font-semibold text-white">
                    {isClosureStep ? 'Mapa completo' : highlightedNode?.label ?? activeStoryStep.title}
                  </h2>
                </div>
                <span
                  className="rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/72"
                  style={{ borderColor: `${currentAccent}44`, backgroundColor: `${currentAccent}18` }}
                >
                  {nodeProgress}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-white/[0.72]">{canvasOverlayBody}</p>
            </div>

            <div aria-hidden="true" className="h-[58vh] md:h-[66vh] xl:h-[calc(100vh-11rem)]">
              <MicelioCanvas
                connections={graph.visibleConnections}
                currentPhaseId={currentPhaseId}
                highlightedNodeId={highlightedNodeId}
                isFreeRotationEnabled={isClosureStep}
                nodes={graph.nodes}
                onNodeAction={handleNodeAction}
                showFullMap={isClosureStep}
                visibleNodeIdSet={revealedNodeIdSet}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <MicelioStoryRail
            activeStepId={activeStoryStep.id}
            registerStepRef={registerStepRef}
            revealedNodeIdSet={revealedNodeIdSet}
            storySteps={storySteps}
          />

          <MicelioMapPanel
            canExploreFullMap={isClosureStep}
            connectionCount={connectionCount}
            currentPhaseId={currentPhaseId}
            handleResetExperience={handleResetExperience}
            onNodeAction={handleNodeAction}
            phaseSections={phaseSections}
            revealedNodeIdSet={revealedNodeIdSet}
            selectedNode={selectedNode}
            selectedNodeId={selectedNode?.id ?? null}
            selectedNodePhaseLabel={selectedNodePhaseLabel}
            storyProgress={storyProgress}
            totalNodes={totalNodes}
          />
        </div>
      </div>
    </section>
  );
}
