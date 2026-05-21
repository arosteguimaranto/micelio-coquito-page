export default function NodeInfoCard({ node, phaseLabel, visitedCount, unlockThreshold, isClosureUnlocked }) {
  if (!node) {
    return (
      <article className="panel space-y-4 p-5" aria-live="polite">
        <p className="text-xs uppercase tracking-[0.35em] text-white/50">Nodo seleccionado</p>
        <h2 className="text-2xl font-semibold text-white">Elegí un nodo para abrir la cartografía.</h2>
        <p className="text-sm leading-7 text-white/70">
          Cada click ilumina una parte de la red, marca el nodo como visitado y te deja ver una frase breve sobre esa
          percepción. Si preferís teclado, usá la navegación accesible de más abajo.
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm text-white/60">
          <p>
            Visitados: <span className="font-semibold text-white">{visitedCount}</span>
          </p>
          <p>
            Desbloqueo del cierre:{' '}
            <span className="font-semibold text-white">{isClosureUnlocked ? 'listo' : `${unlockThreshold} nodos`}</span>
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="panel space-y-4 p-5" aria-live="polite">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-white/50">{phaseLabel}</p>
        <h2 className="text-2xl font-semibold text-white">{node.label}</h2>
      </div>

      <p className="text-sm leading-7 text-white/80">{node.excerpt}</p>

      <blockquote className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm italic leading-7 text-white/70">
        “{node.quote}”
      </blockquote>

      <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm leading-7 text-white/60">
        <p>{node.note}</p>
      </div>
    </article>
  );
}
