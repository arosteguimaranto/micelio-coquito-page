import { motion } from 'framer-motion';

export default function ClosureMessage({ finalMessage, isVisible, visitedCount }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: isVisible ? 1 : 0.82, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="panel space-y-4 p-5"
    >
      <p className="text-xs uppercase tracking-[0.35em] text-white/50">Cierre</p>
      <h2 className="text-2xl font-semibold text-white">{finalMessage.title}</h2>

      <div className="space-y-3 text-sm leading-7 text-white/80">
        {finalMessage.lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-7 text-white/[0.65]">
        {isVisible ? finalMessage.footer : `Te faltan algunos nodos por recorrer. Ya visitaste ${visitedCount}.`}
      </div>
    </motion.article>
  );
}
