import AppShell from '../components/layout/AppShell';
import MicelioExperience from '../components/experience/MicelioExperience';
import RoutePlaceholderPage from '../components/ui/RoutePlaceholderPage';
import IntroScreen from '../components/ui/IntroScreen';
import { appRoutes, getAppRouteByPath } from '../data/appRoutes';
import { introContent } from '../data/phases';
import { useAppRoute } from '../hooks/useAppRoute';
import { useMicelioExperience } from '../hooks/useMicelioExperience';

export default function App() {
  const experience = useMicelioExperience();
  const { navigate, pathname } = useAppRoute();
  const activeRoute = getAppRouteByPath(pathname);

  const handleNavigate = (nextPath) => {
    if (nextPath === appRoutes.micelio.path) {
      experience.handleEnter();
    }

    navigate(nextPath);
  };

  if (pathname === appRoutes.micelio.path) {
    return (
      <AppShell phaseId={experience.currentPhaseId}>
        <MicelioExperience {...experience} />
      </AppShell>
    );
  }

  if (pathname === appRoutes.playlist.path || pathname === appRoutes.prueba.path) {
    return (
      <AppShell phaseId={activeRoute.phaseId}>
        <RoutePlaceholderPage route={activeRoute} onNavigate={handleNavigate} />
      </AppShell>
    );
  }

  return (
    <AppShell phaseId={appRoutes.home.phaseId}>
      <IntroScreen content={introContent} onEnter={() => handleNavigate(appRoutes.micelio.path)} onNavigate={handleNavigate} />
    </AppShell>
  );
}
