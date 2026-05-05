import { motion } from 'framer-motion';

export default function PhaseNavigator({ phases, currentPhaseId, onChange, isClosureUnlocked }) {
  return (
    <nav className="flex flex-wrap gap-2">
      {phases.map((phase) => {
        const isActive = currentPhaseId === phase.id;
        const isLocked = phase.id === 'cierre' && !isClosureUnlocked;

        return (
          <motion.button
            key={phase.id}
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange(phase.id)}
            disabled={isLocked}
            className={[
              'rounded-full border px-4 py-2 text-sm transition duration-300',
              isActive
                ? 'border-white/50 bg-white/[0.18] text-white shadow-glow'
                : 'border-white/15 bg-white/[0.08] text-white/70 hover:bg-white/[0.12] hover:text-white',
              isLocked ? 'cursor-not-allowed opacity-40' : '',
            ].join(' ')}
          >
            {phase.label}
          </motion.button>
        );
      })}
    </nav>
  );
}
