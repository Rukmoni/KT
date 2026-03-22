import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';

export const DemoPage = () => {
  const { screenName } = useParams();
  const navigate = useNavigate();

  return (
    <motion.main 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{ paddingTop: '120px', minHeight: '80vh' }}
      className="container flex flex-col items-center"
    >
      <Button variant="outline" onClick={() => navigate(-1)} className="self-start mb-8">
        <ArrowLeft size={18} /> Back to Showcase
      </Button>
      
      <div className="text-center mb-12">
        <span className="text-secondary font-semibold uppercase tracking-wider text-sm mb-2 block">Interactive Preview</span>
        <h1 className="text-gradient" style={{ fontSize: '3.5rem', textTransform: 'capitalize' }}>
          {screenName} Module
        </h1>
      </div>
      
      <div 
        className="glass flex items-center justify-center p-12 relative overflow-hidden" 
        style={{ width: '100%', maxWidth: '900px', borderRadius: '32px', minHeight: '500px', boxShadow: 'var(--shadow-glow)' }}
      >
         <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
         <div className="relative z-10 text-center flex flex-col items-center gap-6">
           <div className="w-20 h-20 rounded-full bg-primary/20 flex flex-col justify-center items-center mb-4">
             <div className="w-10 h-10 rounded-full bg-primary animate-pulse"></div>
           </div>
           <h3 className="text-2xl font-bold">App Environment Initializing</h3>
           <p className="text-secondary text-lg max-w-md">
             The interactive {screenName} demo environment is a standalone app that will load shortly. 
             This showcases our seamless routing transitions!
           </p>
         </div>
      </div>
    </motion.main>
  );
};
