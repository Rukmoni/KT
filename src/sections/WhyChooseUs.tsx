import { Code2, Zap, Palette, Network, Layers } from 'lucide-react';

const features = [
  {
    title: 'Clean, Scalable Code',
    description: 'Enterprise-grade architecture that grows with your business.',
    icon: <Code2 className="w-[18px] h-[18px] text-[#a8b8d8]" />,
    iconBg: 'bg-[#a8b8d8]/10',
  },
  {
    title: 'Lightning Fast Delivery',
    description: 'Optimized workflows matching startup speeds without technical debt.',
    icon: <Zap className="w-[18px] h-[18px] text-[#c084fc]" />,
    iconBg: 'bg-[#c084fc]/10',
  },
  {
    title: 'Modern UI/UX',
    description: 'Premium, glassmorphic interfaces that captivate users immediately.',
    icon: <Palette className="w-[18px] h-[18px] text-[#818cf8]" />,
    iconBg: 'bg-[#818cf8]/10',
  },
  {
    title: 'AI-Ready Apps',
    description: 'Built flexibly to integrate any AI models (OpenAI, Gemini, Anthropic).',
    icon: <Network className="w-[18px] h-[18px] text-[#e879f9]" />,
    iconBg: 'bg-[#e879f9]/10',
  },
  {
    title: 'Cross-Platform',
    description: 'Deploy to both iOS and Android simultaneously with one codebase.',
    icon: <Layers className="w-[18px] h-[18px] text-[#38bdf8]" />,
    iconBg: 'bg-[#38bdf8]/10',
  }
];

export const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="relative w-full bg-[#0a0f1e] py-28 px-4 overflow-hidden font-sans">
      <div className="max-w-[72rem] mx-auto relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Header Block takes the first cell position */}
          <div className="flex flex-col justify-center pr-4 md:pr-8 mb-8 lg:mb-0">
            <div className="uppercase tracking-widest text-[#a855f7] text-[0.6rem] font-bold py-1.5 px-3.5 bg-[#a855f7]/10 border border-[#a855f7]/20 rounded-full inline-flex self-start mb-6 align-middle">
              OUR EDGE
            </div>
            <h2 className="text-4xl md:text-[3rem] leading-[1.05] font-bold text-white mb-6 tracking-tight">
              Why Choose <br />
              <span className="bg-gradient-to-r from-[#a78bfa] to-[#c084fc] bg-clip-text text-transparent">
                Kuavanta?
              </span>
            </h2>
            <p className="text-[#a1a1aa] text-[0.95rem] leading-relaxed">
              We don't just write code, we engineer solutions. Our development approach bridges the gap between stunning design, AI innovation, and rock-solid performance.
            </p>
          </div>

          {/* Feature Cards map to the remaining 5 cells */}
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-[#111424] border border-white/5 hover:border-purple-500/20 rounded-[1.25rem] p-7 transition-all duration-300 flex flex-col h-full group hover:bg-[#15192b]"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-5 border border-white/5 shadow-inner transition-transform group-hover:scale-110 duration-300 ${feature.iconBg}`}>
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold text-[1.05rem] mb-2 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-[#8f8f9d] text-[0.8rem] leading-[1.6] flex-grow pr-2">
                {feature.description}
              </p>
            </div>
          ))}
          
        </div>
        
      </div>
    </section>
  );
};
