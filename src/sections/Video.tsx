import { Play } from 'lucide-react';
import './Video.css';

export const Video = () => {
  return (
    <section className="py-20 container">
      <div className="text-center mb-12">
        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          See Our Apps in Action
        </h2>
        <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem' }}>
          Watch how we bring beautiful, fluent mobile experiences directly to your screen.
        </p>
      </div>

      <div className="video-container relative mx-auto group">
        <div className="video-placeholder glass flex items-center justify-center">
          {/* Animated Play Button */}
          <button className="play-button flex items-center justify-center animate-pulse">
            <Play size={40} className="text-white ml-2" fill="white" />
          </button>
        </div>
        
        {/* Decorative elements representing app UI */}
        <div className="absolute -left-12 top-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
        <div className="absolute -right-12 bottom-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
      </div>
    </section>
  );
};
