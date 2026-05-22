import { phaseAccentColors } from '../../data/phaseTheme';

export default function MicelioMapPanel({
  canExploreFullMap,
  connectionCount,
  currentPhaseId,
  focusedNode,
  focusedNodePhaseLabel,
  handleResetExperience,
  onInspectNode,
  phaseProgress,
  phaseSections,
  totalNodes,
}) {
  return (
    <section className="panel space-y-5 p-5" aria-labelledby="micelio-map-panel-title">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">Panel secundario</p>
          <h2 id="micelio-map-panel-title" className="text-2xl font-semibold text-white">
            Clasificación general del micelio
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-white/68">
            Acá quedó lo exploratorio. Sirve para entender qué nodo vive en cada fase y para saltar entre bloques sin mover todo el viewport.
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
          <dt className="text-[11px] uppercase tracking-[0.28em] text-white/[0.45]">Jerarquía</dt>
          <dd className="mt-2 text-sm font-semibold text-white">{phaseProgress}</dd>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
          <dt className="text-[11px] uppercase tracking-[0.28em] text-white/[0.45]">Estado</dt>
          <dd className="mt-2 text-sm font-semibold text-white">{canExploreFullMap ? 'mapa completo' : 'fase enfocada'}</dd>
        </div>
      </dl>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)] xl:items-start">
        <article className="rounded-3xl border border-white/10 bg-black/[0.14] p-4 md:p-5" aria-live="polite">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Foco actual</p>
            {focusedNode ? (
              <>
                <h3 className="text-2xl font-semibold text-white">{focusedNode.label}</h3>
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">{focusedNodePhaseLabel}</p>
                <p className="pt-2 text-sm leading-7 text-white/[0.8]">{focusedNode.excerpt}</p>
                <blockquote className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm italic leading-7 text-white/[0.72]">
                  “{focusedNode.quote}”
                </blockquote>
                <p className="text-sm leading-7 text-white/[0.62]">{focusedNode.note}</p>
              </>
            ) : (
              <p className="text-sm leading-7 text-white/[0.64]">
                En cierre podés dejar el foco vacío para mirar la red completa sin quedarte con un nodo solo.
              </p>
            )}
          </div>
        </article>

        <div className="space-y-4" aria-labelledby="micelio-node-navigation-title">
          <div className="space-y-1">
            <h3
              id="micelio-node-navigation-title"
              className="text-sm font-semibold uppercase tracking-[0.28em] text-white/[0.55]"
            >
              Qué nodo pertenece a cada fase
            </h3>
            <p className="text-sm leading-6 text-white/60">
              Los chips de abajo ya no dependen del scroll. Si tocás uno, cambio la fase correspondiente y enfoco ese nodo directo.
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
                        {isClosure ? 'Esta pestaña muestra la red completa.' : `${phase.revealedNodes}/${phase.totalNodes} nodos activos ahora`}
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.24em] text-white/[0.45]">{isActive ? 'activa' : 'fase'}</span>
                  </div>

                  {isClosure ? (
                    <p className="text-sm leading-6 text-white/62">
                      El cierre ya no funciona como final del scroll: es una pestaña más, dedicada a comparar todos los nodos con el mapa completo iluminado.
                    </p>
                  ) : (
                    <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                      {phase.nodes.map((node) => {
                        const isFocused = focusedNode?.id === node.id;

                        return (
                          <li key={node.id}>
                            <button
                              type="button"
                              onClick={() => onInspectNode(node.id)}
                              className={[
                                'flex h-full w-full items-center justify-between rounded-2xl border px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.18em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70',
                                isFocused
                                  ? 'border-white/[0.4] bg-white/[0.2] text-white'
                                  : 'text-white/82 hover:bg-white/[0.12]',
                              ].join(' ')}
                              style={{
                                backgroundColor: isFocused ? `${accent}28` : `${accent}14`,
                                borderColor: isFocused ? `${accent}66` : 'rgba(255,255,255,0.08)',
                              }}
                            >
                              <span>{node.label}</span>
                              <span className="text-[10px] tracking-[0.24em] text-white/40">ir</span>
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
      </div>
    </section>
  );
}
