import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Footer } from './sections/Footer';
import { Home } from './pages/Home';
import { DemoPage } from './pages/DemoPage';
import { DemoListPage } from './pages/DemoListPage';
import { Note2TaskGuard } from './pages/Note2Task/Note2TaskGuard';
import { OmniHubGuard } from './pages/OmniHub/OmniHubGuard';
import { AdminLeads } from './pages/AdminLeads';
import { AdminNote2Task } from './pages/AdminNote2Task';
import { AdminSEO } from './pages/AdminSEO/AdminSEO';
import { ChatbotDemoPage } from './pages/ChatbotDemoPage';
import { ChatbotWidget } from './components/ChatbotWidget';
import { Navbar } from './components/Navbar';
import { PMAdvisory } from './pages/PMAdvisory/PMAdvisory';

const FULLSCREEN_PATHS = ['/demo/note2task', '/demo/KT_omnichannel_demo'];

const AnimatedRoutes = () => {
  const location = useLocation();

  if (location.pathname === '/demo/KT_omnichannel_demo') {
    return <OmniHubGuard />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/demos" element={<DemoListPage />} />
        <Route path="/demo/note2task" element={<Note2TaskGuard />} />
        <Route path="/demo/:screenName" element={<DemoPage />} />
        <Route path="/chatbot-demo" element={<ChatbotDemoPage />} />
        <Route path="/admin" element={<AdminLeads />} />
        <Route path="/admin/note2task" element={<AdminNote2Task />} />
        <Route path="/admin/seo" element={<AdminSEO />} />
        <Route path="/pm-advisory" element={<PMAdvisory />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppShell = () => {
  const location = useLocation();
  const isFullscreen = FULLSCREEN_PATHS.includes(location.pathname);

  if (isFullscreen) {
    return <AnimatedRoutes />;
  }

  return (
    <div className="app-container">
      <Navbar />
      <AnimatedRoutes />
      <Footer />
      <ChatbotWidget />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
