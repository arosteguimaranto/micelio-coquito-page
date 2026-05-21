import { motion } from 'framer-motion';
import { phaseAccentColors } from '../../data/phaseTheme';

export default function PhaseNavigator({ phases, currentPhaseId, onChange }) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Navegación por fases del micelio">
      {phases.map((phase) => {
        const isActive = currentPhaseId === phase.id;
        const accent = phaseAccentColors[phase.id] ?? '#ffffff';

        return (
          <motion.button
            key={phase.id}
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange(phase.id)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Ir a fase ${phase.label}`}
            className={[
              'rounded-full border px-4 py-2 text-sm transition duration-300',
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
    </nav>
  );
}
