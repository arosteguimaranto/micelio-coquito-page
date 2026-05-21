import { motion } from 'framer-motion';
import { phaseAccentColors } from '../../data/phaseTheme';

export default function MicelioStoryRail({ activeStepId, registerStepRef, storySteps }) {
  return (
    <div className="space-y-0">
      {storySteps.map((step) => {
        const isActive = step.id === activeStepId;
        const accent = phaseAccentColors[step.phaseId] ?? '#ffffff';

        return (
          <section
            key={step.id}
            ref={registerStepRef(step.id)}
            data-step-id={step.id}
            className="relative flex min-h-[68vh] scroll-mt-24 items-center py-6 md:min-h-[74vh] xl:min-h-[80vh]"
          >
            <motion.article
              initial={false}
              animate={{ opacity: isActive ? 1 : 0.72, y: isActive ? 0 : 24, scale: isActive ? 1 : 0.985 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className={[
                'panel relative w-full overflow-hidden p-5 md:p-6 xl:p-7',
                isActive ? 'border-white/[0.24] bg-white/[0.14]' : 'border-white/[0.08] bg-black/[0.12]',
              ].join(' ')}
              style={{ boxShadow: isActive ? `0 24px 80px ${accent}22` : undefined }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
              />

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.95fr)] xl:gap-5">
                <div className="space-y-4 lg:col-span-2">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.35em] text-white/50">{step.phaseLabel}</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/35">Estación {step.sequenceLabel}</p>
                    </div>
                    <span
                      className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-white/80"
                      style={{ backgroundColor: `${accent}18`, borderColor: `${accent}66` }}
                    >
                      {step.type === 'closure' ? 'Mapa completo' : `Punto ${step.phaseNodeIndex}/${step.phaseNodeCount}`}
                    </span>
                  </div>

                  {step.startsPhase && (
                    <div className="rounded-3xl border border-white/10 bg-black/[0.16] p-4 md:p-5">
                      <h2 className="text-2xl font-semibold leading-tight text-white md:text-3xl">{step.headline}</h2>
                      <p className="mt-3 text-sm leading-7 text-white/[0.78] md:text-base">{step.phaseDescription}</p>
                      <p className="mt-3 text-sm italic leading-7 text-white/[0.58]">“{step.supportingQuote}”</p>
                    </div>
                  )}
                </div>

                {step.type === 'closure' ? (
                  <>
                    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 lg:col-span-2">
                      <h3 className="text-3xl font-semibold text-white md:text-4xl">{step.title}</h3>
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {step.lines.map((line) => (
                          <p key={line} className="rounded-2xl border border-white/8 bg-black/[0.14] p-4 text-sm leading-7 text-white/[0.8] md:text-base">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/[0.18] p-4 text-sm leading-7 text-white/[0.65] lg:col-span-2 md:p-5">
                      {step.footer}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                      <p className="text-xs uppercase tracking-[0.28em] text-white/38">Punto activo</p>
                      <h3 className="mt-3 text-3xl font-semibold text-white md:text-4xl">{step.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-white/[0.82] md:text-base">{step.excerpt}</p>
                    </div>

                    <blockquote className="rounded-3xl border border-white/10 bg-white/[0.08] p-5 text-sm italic leading-7 text-white/[0.74]">
                      “{step.quote}”
                    </blockquote>

                    <div className="rounded-3xl border border-white/10 bg-black/[0.16] p-5 text-sm leading-7 text-white/[0.64] lg:col-span-2">
                      <p className="text-xs uppercase tracking-[0.28em] text-white/36">Lectura del nodo</p>
                      <p className="mt-3">{step.note}</p>
                    </div>
                  </>
                )}
              </div>
            </motion.article>
          </section>
        );
      })}
    </div>
  );
}
