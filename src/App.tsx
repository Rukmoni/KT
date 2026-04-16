import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Footer } from './sections/Footer';
import { Home } from './pages/Home';
import { DemoPage } from './pages/DemoPage';
import { DemoListPage } from './pages/DemoListPage';
import { Note2TaskPage } from './pages/Note2Task/Note2TaskPage';
import { AdminLeads } from './pages/AdminLeads';
import { ChatbotDemoPage } from './pages/ChatbotDemoPage';
import { ChatbotWidget } from './components/ChatbotWidget';
import { Navbar } from './components/Navbar';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/demos" element={<DemoListPage />} />
        <Route path="/demo/note2task" element={<Note2TaskPage />} />
        <Route path="/demo/:screenName" element={<DemoPage />} />
        <Route path="/chatbot-demo" element={<ChatbotDemoPage />} />
        <Route path="/admin" element={<AdminLeads />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <AnimatedRoutes />
        <Footer />
        <ChatbotWidget />
      </div>
    </Router>
  );
}

export default App;
