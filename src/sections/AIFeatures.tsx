import { Search, MessageSquare, ThumbsUp, Mic, Wand2, Zap } from 'lucide-react';

const aiFeatures = [
  {
    title: 'Smart Search',
    description: 'AI-driven suggestions and typo-tolerant rapid search abilities.',
    icon: <Search className="w-6 h-6 text-[#a78bfa]" />,
    iconBg: 'bg-[#a78bfa]/10',
  },
  {
    title: 'Chatbot Assistant',
    description: 'Intelligent conversational agents to handle support and FAQs.',
    icon: <MessageSquare className="w-6 h-6 text-[#e879f9]" />,
    iconBg: 'bg-[#e879f9]/10',
  },
  {
    title: 'Personalized Recommendations',
    description: 'Tailored content feeds based on user activity and behavior models.',
    icon: <ThumbsUp className="w-6 h-6 text-[#60a5fa]" />,
    iconBg: 'bg-[#60a5fa]/10',
  },
  {
    title: 'Voice Search',
    description: 'Accurate speech-to-text integration for hands-free app navigation.',
    icon: <Mic className="w-6 h-6 text-[#c084fc]" />,
    iconBg: 'bg-[#c084fc]/10',
  },
  {
    title: 'Predictive UI',
    description: 'Interfaces that adapt locally depending on user context and time of day.',
    icon: <Wand2 className="w-6 h-6 text-[#f472b6]" />,
    iconBg: 'bg-[#f472b6]/10',
  },
  {
    title: 'Dynamic Content',
    description: 'Real-time generation of text and image assets using GenAI APIs.',
    icon: <Zap className="w-6 h-6 text-[#38bdf8]" />,
    iconBg: 'bg-[#38bdf8]/10',
  }
];

export const AIFeatures = () => {
  return (
    <section id="ai-features" className="relative w-full bg-[#0a0f1e] py-24 px-4 overflow-hidden font-sans border-y border-white/5">
      <div className="max-w-[72rem] mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="uppercase tracking-widest text-[#a8b8d8] text-[0.65rem] font-bold py-1.5 px-4 bg-white/5 border border-white/10 rounded-full inline-block mb-6">
            AI FEATURES
          </div>
          <h2 className="text-4xl md:text-[3.25rem] leading-tight font-bold text-white mb-6 tracking-tight">
            Next-Gen AI <br className="md:hidden" />
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Capabilities
            </span>
          </h2>
          <p className="text-[#a1a1aa] max-w-2xl mx-auto text-[0.95rem] md:text-base leading-relaxed">
            We don't just build apps. We build intelligent platforms that predict, automate, and delight your users.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiFeatures.map((feat, index) => (
            <div 
              key={index} 
              className="bg-[#111424] border border-white/5 hover:border-purple-500/20 rounded-[2rem] p-8 md:p-10 transition-all duration-300 flex flex-col h-full group hover:bg-[#15192b]"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-8 border border-white/5 shadow-inner transition-transform group-hover:scale-110 duration-300 ${feat.iconBg}`}>
                {feat.icon}
              </div>
              <h3 className="text-white font-semibold text-[1.15rem] mb-3 tracking-tight">
                {feat.title}
              </h3>
              <p className="text-[#a1a1aa] text-[0.85rem] leading-relaxed flex-grow">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};
