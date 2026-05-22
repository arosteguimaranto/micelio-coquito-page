import MicelioCanvas from './MicelioCanvas';
import MicelioMapPanel from '../ui/MicelioMapPanel';
import MicelioStoryRail from './MicelioStoryRail';
import PhaseNavigator from '../ui/PhaseNavigator';
import { phaseAccentColors, phaseAuraColors } from '../../data/phaseTheme';
import { phases } from '../../data/phases';

export default function MicelioExperience({
  activeNodeStep,
  activePhaseId,
  activePhaseNodeSteps,
  closureStep,
  connectionCount,
  currentPhase,
  currentPhaseLabel,
  graph,
  handleInspectNode,
  handlePhaseChange,
  handleResetExperience,
  handleSelectNode,
  highlightedNode,
  highlightedNodeId,
  highlightedNodePhaseLabel,
  isClosureStep,
  nodeProgress,
  phaseProgress,
  phaseSections,
  revealedNodeIdSet,
  totalNodes,
}) {
  const currentAccent = phaseAccentColors[activePhaseId] ?? '#ffffff';

  const canvasOverlayBody = isClosureStep
    ? 'La pestaña de cierre ya no te obliga a seguir scrolleando: deja la red completa visible para comparar nodos, conexiones y tonos sin perder estabilidad.'
    : highlightedNode?.excerpt ?? 'Cada fase ahora vive como un bloque propio: elegís arriba, enfocás adentro y listo.';

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
              Red visible: <span className="font-semibold text-white">{nodeProgress}</span>
            </div>
            <div className="rounded-full border border-white/[0.1] bg-white/[0.08] px-4 py-2 text-sm text-white/[0.7]">
              Navegación: <span className="font-semibold text-white">{phaseProgress}</span>
            </div>
          </div>
          <p className="text-sm leading-6 text-white/[0.58]">
            Ahora la jerarquía quedó sana: primero elegís la fase del día, después enfocás sus nodos dentro del bloque activo. Nada de usar el viewport entero como state machine, porque eso era una locura cósmica.
          </p>
        </div>
      </header>

      <PhaseNavigator phases={phases} currentPhaseId={activePhaseId} onChange={handlePhaseChange} />

      <div className="grid flex-1 gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] xl:items-start">
        <div className="xl:sticky xl:top-5">
          <div className="panel relative min-h-[62vh] overflow-hidden p-3 md:min-h-[70vh] xl:min-h-[calc(100vh-8rem)]">
            {phases.map((phase) => (
              <div
                key={`canvas-aura-${phase.id}`}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 blur-3xl transition-opacity duration-[1400ms] ease-out"
                style={{
                  background: `radial-gradient(circle at 30% 35%, ${phaseAuraColors[phase.id]} 0%, transparent 42%)`,
                  opacity: phase.id === activePhaseId ? 0.8 : 0,
                }}
              />
            ))}
            <div aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-[1.5rem] micelio-canvas-grid" />

            <div className="pointer-events-none absolute left-5 top-5 z-10 max-w-sm rounded-2xl border border-white/[0.1] bg-black/[0.18] px-4 py-3 text-xs leading-6 text-white/[0.62] backdrop-blur-md">
              {isClosureStep
                ? 'Cierre activo. El mapa entero queda disponible para comparar nodos libremente desde el canvas o desde el panel secundario.'
                : 'Fase activa estable. Tocá un nodo visible o una carta del bloque derecho para cambiar el foco sin que la página pegue saltos.'}
            </div>

            <div className="pointer-events-none absolute bottom-5 left-5 right-5 z-10 rounded-3xl border border-white/[0.1] bg-black/[0.22] p-4 backdrop-blur-md md:p-5">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/45">{currentPhaseLabel}</p>
                  <h2 className="text-2xl font-semibold text-white">
                    {isClosureStep ? closureStep?.title ?? 'Mapa completo' : highlightedNode?.label ?? activeNodeStep?.title ?? currentPhase.headline}
                  </h2>
                </div>
                <span
                  className="rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/72"
                  style={{ borderColor: `${currentAccent}44`, backgroundColor: `${currentAccent}18` }}
                >
                  {isClosureStep ? `${totalNodes} nodos activos` : `${activePhaseNodeSteps.length} puntos en foco`}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-white/[0.72]">{canvasOverlayBody}</p>
            </div>

            <div aria-hidden="true" className="h-[58vh] md:h-[66vh] xl:h-[calc(100vh-11rem)]">
              <MicelioCanvas
                connections={graph.visibleConnections}
                currentPhaseId={activePhaseId}
                highlightedNodeId={highlightedNodeId}
                isFreeRotationEnabled={isClosureStep}
                nodes={graph.nodes}
                onNodeAction={handleSelectNode}
                showFullMap={isClosureStep}
                visibleNodeIdSet={revealedNodeIdSet}
              />
            </div>
          </div>
        </div>

        <MicelioStoryRail
          activeNodeStep={activeNodeStep}
          activePhaseNodeSteps={activePhaseNodeSteps}
          closureStep={closureStep}
          currentPhase={currentPhase}
          currentPhaseId={activePhaseId}
          highlightedNodeId={highlightedNodeId}
          isClosureStep={isClosureStep}
          onNodeAction={handleSelectNode}
          phaseProgress={phaseProgress}
        />
      </div>

      <MicelioMapPanel
        canExploreFullMap={isClosureStep}
        connectionCount={connectionCount}
        currentPhaseId={activePhaseId}
        focusedNode={highlightedNode}
        focusedNodePhaseLabel={highlightedNodePhaseLabel}
        handleResetExperience={handleResetExperience}
        onInspectNode={handleInspectNode}
        phaseProgress={phaseProgress}
        phaseSections={phaseSections}
        totalNodes={totalNodes}
      />
    </section>
  );
}
