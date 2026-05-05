import { motion } from 'framer-motion';

export default function IntroScreen({ content, onEnter }) {
  return (
    <section className="flex min-h-screen items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="panel max-w-3xl space-y-8 p-8 md:p-10"
      >
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.45em] text-white/60">Coquito · micelio</p>
          <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-white md:text-5xl">
            {content.title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/80 md:text-lg">{content.body}</p>
          <p className="max-w-2xl text-sm leading-7 text-white/[0.65] md:text-base">
            {content.secondaryBody}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button type="button" onClick={onEnter} className="primary-button">
            {content.buttonLabel}
          </button>
          <p className="max-w-md text-sm leading-6 text-white/[0.55]">{content.caption}</p>
        </div>
      </motion.div>
    </section>
  );
}
