import { phaseAccentColors } from '../../data/phaseTheme';

export default function MicelioMapPanel({
  canExploreFullMap,
  connectionCount,
  currentPhaseId,
  handleResetExperience,
  onNodeAction,
  phaseSections,
  revealedNodeIdSet,
  selectedNode,
  selectedNodeId,
  selectedNodePhaseLabel,
  storyProgress,
  totalNodes,
}) {
  return (
    <section className="panel space-y-5 p-5" aria-labelledby="micelio-map-panel-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">Clasificación del micelio</p>
          <h2 id="micelio-map-panel-title" className="text-2xl font-semibold text-white">
            Fases, nodos y cierre narrativo
          </h2>
          <p className="text-sm leading-7 text-white/70">
            Ahora sí está ordenado en grid: primero se pinta la historia, después el mapa completo queda disponible para
            explorarlo sin perder la clasificación por fase.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetExperience}
          className="rounded-full border border-white/[0.15] bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/75 transition hover:bg-white/[0.12] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70"
        >
          Reiniciar recorrido
        </button>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-live="polite">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
          <dt className="text-[11px] uppercase tracking-[0.28em] text-white/[0.45]">Nodos</dt>
          <dd className="mt-2 text-xl font-semibold text-white">{totalNodes}</dd>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
          <dt className="text-[11px] uppercase tracking-[0.28em] text-white/[0.45]">Conexiones</dt>
          <dd className="mt-2 text-xl font-semibold text-white">{connectionCount}</dd>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
          <dt className="text-[11px] uppercase tracking-[0.28em] text-white/[0.45]">Ritmo</dt>
          <dd className="mt-2 text-sm font-semibold text-white">{storyProgress}</dd>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
          <dt className="text-[11px] uppercase tracking-[0.28em] text-white/[0.45]">Estado</dt>
          <dd className="mt-2 text-sm font-semibold text-white">{canExploreFullMap ? 'mapa completo' : 'revelando nodos'}</dd>
        </div>
      </dl>

      <div className="space-y-3" aria-live="polite">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-white/[0.55]">Detalle seleccionado</h3>
          <p className="text-sm leading-6 text-white/60">
            {canExploreFullMap
              ? 'Elegí un nodo del mapa final para volver a leer su percepción con la red completa enfrente.'
              : 'Mientras no llegues al cierre, tocar un nodo revelado te lleva directo a su estación dentro del scroll.'}
          </p>
        </div>

        <article className="rounded-3xl border border-white/10 bg-black/[0.14] p-4 md:p-5">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">{selectedNodePhaseLabel}</p>
                <h4 className="text-2xl font-semibold text-white">{selectedNode.label}</h4>
              </div>
              <p className="text-sm leading-7 text-white/[0.8]">{selectedNode.excerpt}</p>
              <blockquote className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm italic leading-7 text-white/[0.72]">
                “{selectedNode.quote}”
              </blockquote>
              <p className="text-sm leading-7 text-white/[0.62]">{selectedNode.note}</p>
            </div>
          ) : (
            <div className="space-y-3 text-sm leading-7 text-white/[0.65]">
              <p>
                {canExploreFullMap
                  ? 'Todavía no hay un nodo libre seleccionado. Tocá cualquiera de los chips o del mapa para enfocarlo.'
                  : 'Todavía estamos pintando el recorrido. Si tocás un nodo ya revelado, te llevo a su estación para que no te pierdas.'}
              </p>
              <p className="text-white/[0.48]">
                Fase activa ahora mismo: {phaseSections.find((phase) => phase.id === currentPhaseId)?.label ?? 'Micelio'}
              </p>
            </div>
          )}
        </article>
      </div>

      <div className="space-y-3" aria-labelledby="micelio-node-navigation-title">
        <div className="space-y-1">
          <h3
            id="micelio-node-navigation-title"
            className="text-sm font-semibold uppercase tracking-[0.28em] text-white/[0.55]"
          >
            Qué nodo pertenece a cada fase
          </h3>
          <p className="text-sm leading-6 text-white/60">
            La fase “cierre” no agrega nodos nuevos: junta todos los anteriores y prende la red completa. Antes de eso,
            cada chip revelado también sirve para saltar al bloque correcto del relato.
          </p>
        </div>

        <div className="space-y-4">
          {phaseSections.map((phase) => {
            const accent = phaseAccentColors[phase.id] ?? '#ffffff';
            const isActive = phase.id === currentPhaseId;
            const isClosure = phase.id === 'cierre';

            return (
              <section
                key={phase.id}
                className={[
                  'space-y-3 rounded-3xl border p-4 transition md:p-5',
                  isActive ? 'bg-white/[0.1] text-white' : 'bg-black/[0.12] text-white/76',
                ].join(' ')}
                style={{ borderColor: isActive ? `${accent}88` : 'rgba(255,255,255,0.08)' }}
                aria-labelledby={`phase-section-${phase.id}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 id={`phase-section-${phase.id}`} className="text-sm font-semibold text-white">
                      {phase.label}
                    </h4>
                    <p className="text-xs text-white/50">
                      {isClosure ? 'Acá se abre la red completa.' : `${phase.revealedNodes}/${phase.totalNodes} nodos ya pintados`}
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.24em] text-white/[0.45]">{isActive ? 'activa' : 'fase'}</span>
                </div>

                {isClosure ? (
                  <p className="text-sm leading-6 text-white/62">
                    El cierre junta todos los puntos anteriores, sube la intensidad de las conexiones y te deja ver el mapa
                    completo de una sola vez.
                  </p>
                ) : (
                  <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {phase.nodes.map((node) => {
                      const isSelected = selectedNodeId === node.id;
                      const isRevealed = revealedNodeIdSet.has(node.id);

                      return (
                        <li key={node.id}>
                          <button
                            type="button"
                            onClick={() => onNodeAction(node.id)}
                            disabled={!isRevealed}
                            className={[
                              'flex h-full w-full items-center justify-between rounded-2xl border px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.18em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70',
                              isSelected
                                ? 'border-white/[0.4] bg-white/[0.2] text-white'
                                : isRevealed
                                  ? 'text-white/82 hover:bg-white/[0.12]'
                                  : 'cursor-not-allowed text-white/42',
                            ].join(' ')}
                            style={{
                              backgroundColor: isSelected ? `${accent}28` : isRevealed ? `${accent}14` : 'rgba(255,255,255,0.04)',
                              borderColor: isSelected || isRevealed ? `${accent}66` : 'rgba(255,255,255,0.08)',
                            }}
                          >
                            <span>{node.label}</span>
                            <span className="text-[10px] tracking-[0.24em] text-white/40">{isRevealed ? 'ver' : 'espera'}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
