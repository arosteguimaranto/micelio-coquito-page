import AppShell from '../components/layout/AppShell';
import MicelioExperience from '../components/experience/MicelioExperience';
import IntroScreen from '../components/ui/IntroScreen';
import { introContent } from '../data/phases';
import { useMicelioExperience } from '../hooks/useMicelioExperience';

export default function App() {
  const experience = useMicelioExperience();

  return (
    <AppShell phaseId={experience.currentPhaseId}>
      {experience.hasEntered ? (
        <MicelioExperience {...experience} />
      ) : (
        <IntroScreen content={introContent} onEnter={experience.handleEnter} />
      )}
    </AppShell>
  );
}
