import { motion } from 'framer-motion';
import { phaseAccentColors } from '../../data/phaseTheme';

export default function PhaseNavigator({ phases, currentPhaseId, onChange }) {
  const focusTab = (phaseId) => {
    onChange(phaseId);

    if (typeof document === 'undefined') {
      return;
    }

    window.requestAnimationFrame(() => {
      document.getElementById(`phase-tab-${phaseId}`)?.focus();
    });
  };

  return (
    <section className="panel p-3" aria-labelledby="micelio-phase-tabs-title">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p id="micelio-phase-tabs-title" className="text-xs uppercase tracking-[0.35em] text-white/48">
            Fases del día
          </p>
          <p className="text-sm leading-6 text-white/62">
            Ahora sí están tratadas como navegación principal: cambian el contenido y el mapa, pero no te revolean la página.
          </p>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Fases del día del micelio">
          {phases.map((phase, index) => {
            const isActive = currentPhaseId === phase.id;
            const accent = phaseAccentColors[phase.id] ?? '#ffffff';

            return (
              <motion.button
                key={phase.id}
                id={`phase-tab-${phase.id}`}
                type="button"
                role="tab"
                whileTap={{ scale: 0.97 }}
                aria-controls={`phase-panel-${phase.id}`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onChange(phase.id)}
                onKeyDown={(event) => {
                  let nextPhaseId = null;

                  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                    nextPhaseId = phases[(index + 1) % phases.length]?.id ?? phase.id;
                  }

                  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                    nextPhaseId = phases[(index - 1 + phases.length) % phases.length]?.id ?? phase.id;
                  }

                  if (event.key === 'Home') {
                    nextPhaseId = phases[0]?.id ?? phase.id;
                  }

                  if (event.key === 'End') {
                    nextPhaseId = phases[phases.length - 1]?.id ?? phase.id;
                  }

                  if (!nextPhaseId) {
                    return;
                  }

                  event.preventDefault();
                  focusTab(nextPhaseId);
                }}
                className={[
                  'rounded-full border px-4 py-2 text-sm font-medium transition duration-300',
                  isActive
                    ? 'bg-white/[0.18] text-white shadow-glow'
                    : 'border-white/[0.15] bg-white/[0.08] text-white/70 hover:bg-white/[0.12] hover:text-white',
                ].join(' ')}
                style={isActive ? { borderColor: `${accent}88`, boxShadow: `0 0 0 1px ${accent}44` } : undefined}
              >
                {phase.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
