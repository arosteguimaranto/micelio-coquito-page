import { motion } from 'framer-motion';
import { appRoutes } from '../../data/appRoutes';

export default function RoutePlaceholderPage({ route, onNavigate }) {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-8 md:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        className="panel w-full space-y-8 p-6 md:p-10"
      >
        <div className="space-y-4">
          <span className="inline-flex rounded-full border border-white/12 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/68">
            {route.badge}
          </span>
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.42em] text-white/42">{route.path}</p>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">{route.title}</h1>
            <p className="max-w-3xl text-base leading-8 text-white/76 md:text-lg">{route.description}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-black/[0.14] p-5">
            <h2 className="text-lg font-semibold text-white">Qué sigue acá</h2>
            <p className="mt-3 text-sm leading-7 text-white/68">
              Por ahora esta ruta quedó lista como destino real dentro del sitio, pero su contenido todavía está en fase
              de armado. Ya podés navegar hasta acá desde el home sin pelearte con el layout principal.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-black/[0.14] p-5">
            <h2 className="text-lg font-semibold text-white">Accesos rápidos</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" className="primary-button" onClick={() => onNavigate(appRoutes.home.path)}>
                Volver al home
              </button>
              {route.path !== appRoutes.micelio.path ? (
                <button
                  type="button"
                  onClick={() => onNavigate(appRoutes.micelio.path)}
                  className="rounded-full border border-white/[0.15] bg-white/[0.08] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.14]"
                >
                  Ir al micelio
                </button>
              ) : null}
            </div>
          </article>
        </div>
      </motion.div>
    </section>
  );
}
