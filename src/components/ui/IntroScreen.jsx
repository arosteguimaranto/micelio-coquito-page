import { motion } from 'framer-motion';
import HeroMicelioCanvas from '../home/HeroMicelioCanvas';
import { appRoutes } from '../../data/appRoutes';
import { heroNavigationTargets } from '../../data/homeHero';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function IntroScreen({ content, onEnter, onNavigate }) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl gap-5 px-4 py-4 md:px-6 lg:grid-cols-[minmax(320px,390px)_minmax(0,1fr)] lg:items-stretch lg:px-8 lg:py-6">
        <motion.aside
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="order-2 flex flex-col gap-4 lg:order-1"
        >
          <motion.div variants={itemVariants} className="hero-copy-shell hero-copy-panel">
            <p className="hero-eyebrow hero-eyebrow-left">{content.eyebrow}</p>

            <h1 className="hero-title mt-5 text-4xl font-semibold leading-[1.05] text-[#4f382b] md:text-5xl">
              {content.title}
            </h1>

            <p className="mt-5 text-base leading-8 text-[#664d3e] md:text-lg md:leading-9">{content.body}</p>
            <p className="mt-4 text-sm leading-7 text-[#7a6354]/92 md:text-base">{content.secondaryBody}</p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button type="button" onClick={onEnter} className="hero-enter-button">
                {content.buttonLabel}
              </button>
              <button
                type="button"
                onClick={() => onNavigate(appRoutes.playlist.path)}
                className="hero-secondary-button"
              >
                Ir a playlist
              </button>
            </div>

            <p className="mt-5 text-sm leading-6 text-[#6f5848]">{content.caption}</p>
          </motion.div>

          <motion.div variants={itemVariants} className="hero-route-list">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/52">Hongos interactivos</p>
              <p className="text-sm leading-6 text-white/66">
                Tenés las dos cosas a la vez: explicación al costado y escenario libre para pasar por los hongos y entrar a cada ruta.
              </p>
            </div>

            <div className="space-y-3">
              {heroNavigationTargets.map((target) => (
                <button
                  key={target.id}
                  type="button"
                  onClick={() => onNavigate(target.route)}
                  className="hero-route-card"
                >
                  <span className="hero-route-badge">{target.label}</span>
                  <strong className="block text-lg font-semibold text-white">{target.title}</strong>
                  <span className="mt-2 block text-sm leading-6 text-white/64">{target.description}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="hero-stage-shell order-1 lg:order-2"
        >
          <HeroMicelioCanvas onNavigate={onNavigate} />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(251,244,235,0.08)_0%,_transparent_58%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,_rgba(18,12,9,0.16)_0%,_rgba(18,12,9,0)_24%,_rgba(18,12,9,0.1)_70%,_rgba(18,12,9,0.28)_100%)]" />

          <div className="pointer-events-none hero-stage-hint left-4 top-4 md:left-6 md:top-6">
            Pasá por los hongos iluminados y hacé click para entrar a cada ruta.
          </div>

          <div className="pointer-events-none hero-stage-hint bottom-4 right-4 max-w-xs text-right md:bottom-6 md:right-6">
            El centro quedó libre a propósito: ahora el canvas manda y el texto acompaña, no tapa.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
