import MicelioCanvas from './MicelioCanvas';
import ClosureMessage from '../ui/ClosureMessage';
import NodeInfoCard from '../ui/NodeInfoCard';
import PhaseNavigator from '../ui/PhaseNavigator';
import { finalMessage, phases } from '../../data/phases';

export default function MicelioExperience({
  currentPhase,
  currentPhaseId,
  currentPhaseLabel,
  handlePhaseChange,
  handleSelectNode,
  isClosureUnlocked,
  phasesProgress,
  selectedNode,
  visitedCount,
  visitedNodeIds,
  unlockThreshold,
}) {
  return (
    <section className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 px-4 py-4 md:px-6 lg:px-8 lg:py-6">
      <header className="panel flex flex-col gap-6 p-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs uppercase tracking-[0.45em] text-white/[0.55]">Cartografía emocional</p>
          <h1 className="text-3xl font-semibold leading-tight text-white md:text-4xl">
            {currentPhase.headline}
          </h1>
          <p className="text-sm leading-7 text-white/[0.78] md:text-base">{currentPhase.description}</p>
          <p className="text-sm italic leading-7 text-white/[0.62]">“{currentPhase.supportingQuote}”</p>
        </div>

        <div className="space-y-3 lg:max-w-sm lg:text-right">
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <div className="rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm text-white/70">
              Fase: <span className="font-semibold text-white">{currentPhaseLabel}</span>
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm text-white/70">
              Recorrido: <span className="font-semibold text-white">{phasesProgress}</span>
            </div>
          </div>
          <p className="text-sm leading-6 text-white/[0.58]">
            Podés explorar libremente la red. El cierre se desbloquea cuando la experiencia ya tiene un poco de
            trayecto encima.
          </p>
        </div>
      </header>

      <PhaseNavigator
        phases={phases}
        currentPhaseId={currentPhaseId}
        onChange={handlePhaseChange}
        isClosureUnlocked={isClosureUnlocked}
      />

      <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="panel relative min-h-[60vh] overflow-hidden p-3 md:min-h-[68vh]">
          <div className="pointer-events-none absolute left-5 top-5 z-10 max-w-xs rounded-2xl border border-white/10 bg-black/[0.18] px-4 py-3 text-xs leading-6 text-white/[0.62] backdrop-blur-md">
            Hacé click sobre los nodos para iluminar la red y abrir su tarjeta.
          </div>
          <MicelioCanvas
            currentPhaseId={currentPhaseId}
            onSelectNode={handleSelectNode}
            selectedNodeId={selectedNode?.id ?? null}
            visitedNodeIds={visitedNodeIds}
          />
        </div>

        <div className="flex flex-col gap-4">
          <NodeInfoCard
            node={selectedNode}
            phaseLabel={selectedNode ? phases.find((phase) => phase.id === selectedNode.phaseId)?.label : ''}
            visitedCount={visitedCount}
            unlockThreshold={unlockThreshold}
            isClosureUnlocked={isClosureUnlocked}
          />

          <ClosureMessage
            finalMessage={finalMessage}
            isVisible={isClosureUnlocked && currentPhaseId === 'cierre'}
            visitedCount={visitedCount}
          />
        </div>
      </div>
    </section>
  );
}
