import { Routes, Route, Navigate } from 'react-router-dom';
import { MentorLanding } from './pages/MentorLanding';
import { SessionPage } from './pages/SessionPage';
import { TelemetryPage } from './pages/TelemetryPage';
import { HistoryPage } from './pages/HistoryPage';
import { MentorConfigPage } from './pages/MentorConfigPage';
import { useSession } from './hooks/useSession';

export function MentorApp() {
  const { sessionToken } = useSession();

  return (
    <div className="min-h-screen bg-mentor-cream font-sans">
      <Routes>
        <Route path="/" element={<MentorLanding sessionToken={sessionToken} />} />
        <Route path="/session" element={<SessionPage sessionToken={sessionToken} />} />
        <Route path="/session/:subjectCode" element={<SessionPage sessionToken={sessionToken} />} />
        <Route path="/history" element={<HistoryPage sessionToken={sessionToken} />} />
        <Route path="/telemetry" element={<TelemetryPage sessionToken={sessionToken} />} />
        <Route path="/config" element={<MentorConfigPage />} />
        <Route path="*" element={<Navigate to="/mentor" replace />} />
      </Routes>
    </div>
  );
}
