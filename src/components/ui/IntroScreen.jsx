import { motion } from 'framer-motion';
import HeroMicelioStage from '../home/HeroMicelioStage';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.16,
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.82, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function IntroScreen({ content, onEnter, onNavigate }) {
  return (
    <section className="home-hero-section relative min-h-screen overflow-hidden">
      <div className="home-hero-shell px-4 py-6 md:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="home-hero-copy-region"
        >
          <motion.div variants={itemVariants} className="home-hero-copy-shell">
            <p className="home-hero-eyebrow">{content.eyebrow}</p>
            <h1 className="home-hero-wordmark">MICELIO</h1>

            <p className="home-hero-title">{content.title}</p>
            <p className="home-hero-body">{content.body}</p>
            <p className="home-hero-secondary">{content.secondaryBody}</p>

            <div className="pointer-events-auto mt-8 flex justify-center">
              <button type="button" onClick={onEnter} className="home-hero-primary-button">
                {content.buttonLabel}
              </button>
            </div>
          </motion.div>

          <motion.p variants={itemVariants} className="home-hero-footnote">
            {content.caption}
          </motion.p>
        </motion.div>

        <HeroMicelioStage onNavigate={onNavigate} />
      </div>
    </section>
  );
}
