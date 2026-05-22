import { motion } from 'framer-motion';
import { phaseAccentColors } from '../../data/phaseTheme';

export default function MicelioStoryRail({
  activeNodeStep,
  activePhaseNodeSteps,
  closureStep,
  currentPhase,
  currentPhaseId,
  highlightedNodeId,
  isClosureStep,
  onNodeAction,
  phaseProgress,
}) {
  const accent = phaseAccentColors[currentPhaseId] ?? '#ffffff';

  if (isClosureStep && closureStep) {
    return (
      <motion.section
        key={currentPhaseId}
        id={`phase-panel-${currentPhaseId}`}
        role="tabpanel"
        aria-labelledby={`phase-tab-${currentPhaseId}`}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="panel relative overflow-hidden p-5 md:p-6 xl:p-7"
        style={{ boxShadow: `0 24px 80px ${accent}22` }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />

        <div className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.35em] text-white/48">{currentPhase.label}</p>
              <h2 className="text-3xl font-semibold text-white md:text-4xl">{closureStep.title}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-white/80"
                style={{ backgroundColor: `${accent}18`, borderColor: `${accent}66` }}
              >
                {phaseProgress}
              </span>
              <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-white/60">
                Mapa completo
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/[0.16] p-5 md:p-6">
            <p className="text-sm leading-7 text-white/[0.78] md:text-base">{currentPhase.description}</p>
            <p className="mt-3 text-sm italic leading-7 text-white/[0.58]">“{currentPhase.supportingQuote}”</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {closureStep.lines.map((line) => (
              <article key={line} className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 text-sm leading-7 text-white/[0.82] md:text-base">
                {line}
              </article>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/[0.18] p-4 text-sm leading-7 text-white/[0.64] md:p-5">
            {closureStep.footer}
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      key={currentPhaseId}
      id={`phase-panel-${currentPhaseId}`}
      role="tabpanel"
      aria-labelledby={`phase-tab-${currentPhaseId}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="panel relative overflow-hidden p-5 md:p-6 xl:p-7"
      style={{ boxShadow: `0 24px 80px ${accent}22` }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.35em] text-white/48">{currentPhase.label}</p>
            <h2 className="text-2xl font-semibold leading-tight text-white md:text-3xl">{currentPhase.headline}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-white/80"
              style={{ backgroundColor: `${accent}18`, borderColor: `${accent}66` }}
            >
              {phaseProgress}
            </span>
            <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-white/60">
              {activeNodeStep ? `Punto ${activeNodeStep.phaseNodeIndex}/${activeNodeStep.phaseNodeCount}` : 'Sin nodos'}
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/[0.16] p-5 md:p-6">
          <p className="text-sm leading-7 text-white/[0.78] md:text-base">{currentPhase.description}</p>
          <p className="mt-3 text-sm italic leading-7 text-white/[0.58]">“{currentPhase.supportingQuote}”</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {activePhaseNodeSteps.map((step) => {
            const isActive = step.nodeId === highlightedNodeId;

            return (
              <motion.button
                key={step.id}
                type="button"
                whileTap={{ scale: 0.985 }}
                onClick={() => onNodeAction(step.nodeId)}
                className={[
                  'rounded-3xl border p-5 text-left transition duration-300',
                  isActive ? 'border-white/[0.26] bg-white/[0.12]' : 'border-white/[0.1] bg-white/[0.06] hover:bg-white/[0.1]',
                ].join(' ')}
                style={isActive ? { boxShadow: `0 18px 52px ${accent}20` } : undefined}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/36">
                      Punto {step.phaseNodeIndex}/{step.phaseNodeCount}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{step.title}</h3>
                  </div>
                  <span
                    className="rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.22em]"
                    style={{
                      backgroundColor: isActive ? `${accent}1c` : 'rgba(255,255,255,0.05)',
                      borderColor: isActive ? `${accent}55` : 'rgba(255,255,255,0.08)',
                      color: isActive ? 'rgba(255,255,255,0.86)' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {isActive ? 'foco' : 'abrir'}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-white/[0.82]">{step.excerpt}</p>

                <blockquote className="mt-4 rounded-2xl border border-white/8 bg-black/[0.14] p-4 text-sm italic leading-7 text-white/[0.72]">
                  “{step.quote}”
                </blockquote>

                <div className="mt-4 rounded-2xl border border-white/8 bg-black/[0.12] p-4 text-sm leading-7 text-white/[0.6]">
                  {step.note}
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/[0.18] p-4 text-sm leading-7 text-white/[0.64] md:p-5">
          Tocá una carta o un nodo del canvas para cambiar el foco sin mover toda la pantalla. La navegación principal quedó arriba, donde tiene que estar.
        </div>
      </div>
    </motion.section>
  );
}
