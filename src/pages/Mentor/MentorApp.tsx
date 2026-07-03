import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MentorLanding } from './pages/MentorLanding';
import { SessionPage } from './pages/SessionPage';
import { TelemetryPage } from './pages/TelemetryPage';
import { MentorConfigPage } from './pages/MentorConfigPage';
import { ConversationSidebar } from './components/ConversationSidebar';
import { MentorProvider } from './MentorContext';
import { useSession } from './hooks/useSession';

export function MentorApp() {
  const { sessionToken } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <MentorProvider appUserId={sessionToken} onOpenSidebar={() => setSidebarOpen(true)}>
      <div className="flex h-screen overflow-hidden font-sans bg-mentor-cream">
        <ConversationSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Routes>
            <Route path="/" element={<MentorLanding />} />
            <Route path="/session" element={<SessionPage />} />
            <Route path="/session/:subjectCode" element={<SessionPage />} />
            <Route path="/telemetry" element={<TelemetryPage />} />
            <Route path="/config" element={<MentorConfigPage />} />
            <Route path="/history" element={<Navigate to="/mentor" replace />} />
            <Route path="*" element={<Navigate to="/mentor" replace />} />
          </Routes>
        </div>
      </div>
    </MentorProvider>
  );
}
