import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { phaseAccentColors } from '../../data/phaseTheme';

function buildPhaseBlocks(storySteps) {
  const blocks = [];
  const phaseIndex = new Map();

  storySteps.forEach((step) => {
    if (step.type === 'closure') {
      blocks.push({ id: step.phaseId, phaseId: step.phaseId, phaseLabel: step.phaseLabel, step, type: 'closure' });
      return;
    }

    if (!phaseIndex.has(step.phaseId)) {
      phaseIndex.set(step.phaseId, blocks.length);
      blocks.push({
        description: step.phaseDescription,
        headline: step.headline,
        id: step.phaseId,
        phaseId: step.phaseId,
        phaseLabel: step.phaseLabel,
        steps: [],
        supportingQuote: step.supportingQuote,
        type: 'phase',
      });
    }

    blocks[phaseIndex.get(step.phaseId)].steps.push(step);
  });

  return blocks;
}

export default function MicelioStoryRail({ activeStepId, registerStepRef, revealedNodeIdSet, storySteps }) {
  const phaseBlocks = useMemo(() => buildPhaseBlocks(storySteps), [storySteps]);

  return (
    <div className="space-y-8">
      {phaseBlocks.map((block) => {
        const accent = phaseAccentColors[block.phaseId] ?? '#ffffff';

        if (block.type === 'closure') {
          return (
            <section key={block.id} className="relative scroll-mt-24">
              <div className="sticky top-24 py-6">
                <motion.article
                  initial={false}
                  animate={{ opacity: activeStepId === block.step.id ? 1 : 0.84, y: activeStepId === block.step.id ? 0 : 12 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="panel relative overflow-hidden p-5 md:p-6 xl:p-7"
                  style={{ boxShadow: `0 24px 80px ${accent}22` }}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                  />

                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.35em] text-white/50">{block.step.phaseLabel}</p>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/35">Estación {block.step.sequenceLabel}</p>
                      </div>
                      <span
                        className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-white/80"
                        style={{ backgroundColor: `${accent}18`, borderColor: `${accent}66` }}
                      >
                        Mapa completo
                      </span>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                      <h2 className="text-3xl font-semibold text-white md:text-4xl">{block.step.title}</h2>
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {block.step.lines.map((line) => (
                          <p key={line} className="rounded-2xl border border-white/8 bg-black/[0.14] p-4 text-sm leading-7 text-white/[0.8] md:text-base">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/[0.18] p-4 text-sm leading-7 text-white/[0.65] md:p-5">
                      {block.step.footer}
                    </div>
                  </div>
                </motion.article>
              </div>

              <div className="h-[42vh]">
                <div ref={registerStepRef(block.step.id)} data-step-id={block.step.id} className="h-full" />
              </div>
            </section>
          );
        }

        const activeIndex = block.steps.findIndex((step) => step.id === activeStepId);
        const hasActiveStep = activeIndex >= 0;

        return (
          <section key={block.id} className="relative scroll-mt-24">
            <div className="sticky top-24 py-6">
              <article className="panel relative overflow-hidden p-5 md:p-6 xl:p-7" style={{ boxShadow: `0 24px 80px ${accent}22` }}>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                />

                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.35em] text-white/50">{block.phaseLabel}</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/35">{block.steps.length} puntos en esta fase</p>
                    </div>
                    <span
                      className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-white/80"
                      style={{ backgroundColor: `${accent}18`, borderColor: `${accent}66` }}
                    >
                      {hasActiveStep ? `Punto ${(activeIndex + 1).toString().padStart(2, '0')}/${block.steps.length}` : `Fase ${block.phaseLabel}`}
                    </span>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/[0.16] p-4 md:p-5">
                    <h2 className="text-2xl font-semibold leading-tight text-white md:text-3xl">{block.headline}</h2>
                    <p className="mt-3 text-sm leading-7 text-white/[0.78] md:text-base">{block.description}</p>
                    <p className="mt-3 text-sm italic leading-7 text-white/[0.58]">“{block.supportingQuote}”</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {block.steps.map((step) => {
                      const isActive = step.id === activeStepId;
                      const isRevealed = revealedNodeIdSet.has(step.node.id);

                      return (
                        <motion.article
                          key={step.id}
                          initial={false}
                          animate={{ opacity: isRevealed ? 1 : 0.36, y: isActive ? -4 : 0, scale: isActive ? 1.015 : 1 }}
                          transition={{ duration: 0.35, ease: 'easeOut' }}
                          className={[
                            'rounded-3xl border p-5 transition duration-300',
                            isActive
                              ? 'border-white/[0.26] bg-white/[0.12]'
                              : isRevealed
                                ? 'border-white/[0.12] bg-white/[0.06]'
                                : 'border-white/[0.08] bg-black/[0.12]',
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
                                backgroundColor: isRevealed ? `${accent}16` : 'rgba(255,255,255,0.05)',
                                borderColor: isRevealed ? `${accent}55` : 'rgba(255,255,255,0.08)',
                                color: isRevealed ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.45)',
                              }}
                            >
                              {isActive ? 'activo' : isRevealed ? 'visible' : 'pendiente'}
                            </span>
                          </div>

                          <p className="mt-4 text-sm leading-7 text-white/[0.82]">{step.excerpt}</p>

                          <blockquote className="mt-4 rounded-2xl border border-white/8 bg-black/[0.14] p-4 text-sm italic leading-7 text-white/[0.72]">
                            “{step.quote}”
                          </blockquote>

                          <div className="mt-4 rounded-2xl border border-white/8 bg-black/[0.12] p-4 text-sm leading-7 text-white/[0.6]">
                            {step.note}
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                </div>
              </article>
            </div>

            <div className="space-y-[34vh] pb-12 pt-2 md:space-y-[42vh]">
              {block.steps.map((step) => (
                <div key={step.id} ref={registerStepRef(step.id)} data-step-id={step.id} className="h-[20vh]" />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
