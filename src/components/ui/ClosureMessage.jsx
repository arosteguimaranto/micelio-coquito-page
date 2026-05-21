import { motion } from 'framer-motion';

export default function ClosureMessage({ finalMessage, isVisible, visitedCount, unlockThreshold }) {
  const remainingNodes = Math.max(unlockThreshold - visitedCount, 0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: isVisible ? 1 : 0.82, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="panel space-y-4 p-5"
      aria-live="polite"
    >
      <p className="text-xs uppercase tracking-[0.35em] text-white/50">Cierre</p>
      <h2 className="text-2xl font-semibold text-white">{isVisible ? finalMessage.title : 'Cierre todavía bloqueado'}</h2>

      {isVisible ? (
        <div className="space-y-3 text-sm leading-7 text-white/80">
          {finalMessage.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ) : (
        <p className="text-sm leading-7 text-white/[0.72]">
          Todavía no muestro el cierre completo porque la experiencia necesita más recorrido encima. Primero hay que
          iluminar suficiente red.
        </p>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-7 text-white/[0.65]">
        {isVisible
          ? finalMessage.footer
          : `Te faltan ${remainingNodes} nodos para desbloquear el cierre. Ya visitaste ${visitedCount} de ${unlockThreshold}.`}
      </div>
    </motion.article>
  );
}
