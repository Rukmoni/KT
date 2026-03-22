import { Bot, Twitter, Linkedin, Github } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-12" style={{ borderTop: '1px solid var(--glass-border)' }}>
      <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Bot className="text-primary" size={28} />
          <span className="font-bold text-xl">Kuavanta</span>
        </div>
        
        <div className="flex gap-6 text-sm font-medium">
          <a href="#services" className="text-secondary hover:text-primary transition-colors">Services</a>
          <a href="#portfolio" className="text-secondary hover:text-primary transition-colors">Portfolio</a>
          <a href="#pricing" className="text-secondary hover:text-primary transition-colors">Pricing</a>
          <a href="#contact" className="text-secondary hover:text-primary transition-colors">Contact</a>
        </div>
        
        <div className="flex gap-4">
          <a href="#" className="p-2 border border-transparent hover:border-primary rounded-full transition-all text-secondary hover:text-primary">
            <Twitter size={20} />
          </a>
          <a href="#" className="p-2 border border-transparent hover:border-primary rounded-full transition-all text-secondary hover:text-primary">
            <Linkedin size={20} />
          </a>
          <a href="#" className="p-2 border border-transparent hover:border-primary rounded-full transition-all text-secondary hover:text-primary">
            <Github size={20} />
          </a>
        </div>
      </div>
      
      <div className="container text-center mt-8 pt-8 text-sm text-secondary" style={{ borderTop: '1px solid var(--glass-border)' }}>
        © {new Date().getFullYear()} Kuavanta. All rights reserved.
      </div>
    </footer>
  );
};
