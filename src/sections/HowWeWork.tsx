import { ClipboardCheck } from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'Understand & Define',
    desc: 'We analyze your idea, goals, and requirements to create a clear roadmap.',
    bullets: ['Requirement gathering', 'Business understanding', 'Scope definition'],
    active: true,
  },
  {
    num: '02',
    title: 'Design & Prototype',
    desc: 'We design modern UI/UX and interactive prototypes before development.',
    bullets: ['Wireframes', 'UI design', 'Feedback iterations'],
    active: false,
  },
  {
    num: '03',
    title: 'Build & Iterate',
    desc: 'Agile development with regular updates and scalable architecture.',
    bullets: ['Weekly updates', 'Clean code', 'Scalable structure'],
    active: false,
  },
  {
    num: '04',
    title: 'Launch & Support',
    desc: 'Deploy your product and provide ongoing support for growth.',
    bullets: ['Deployment', 'Testing', 'Maintenance'],
    active: false,
  },
];

export const HowWeWork = () => {
  return (
    <section className="relative w-full bg-[#0a0f1e] py-24 px-4 overflow-hidden font-sans border-y border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="uppercase tracking-widest text-[#a8b8d8] text-[0.65rem] font-bold py-1.5 px-4 bg-white/5 border border-white/10 rounded-full inline-block mb-6">
            HOW WE WORK
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            A Clear, Proven Process<br />
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              from Idea to Launch
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-[0.95rem] md:text-base leading-relaxed">
            We employ a structured project management methodology that ensures transparency, velocity, and high-fidelity results at every stage.
          </p>
        </div>

        {/* Timeline Line & Circles */}
        <div className="hidden md:block max-w-[62rem] mx-auto relative mb-12">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-purple-900/40 -translate-y-1/2 z-0" />
          
          <div className="flex justify-between relative z-10 px-4">
            {steps.map((step, i) => (
              <div key={i} className="relative flex justify-center items-center">
                <div className={`w-14 h-14 rounded-full border-[3px] flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  step.active 
                    ? 'border-purple-400 text-white bg-[#0a0f1e]' 
                    : 'border-[#301c4d] text-white bg-[#0a0f1e]'
                }`}>
                  {step.num}
                </div>
                {step.active && (
                  <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.7)] bg-purple-500/10 -z-10" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-[68rem] mx-auto mb-16">
          {steps.map((step, i) => (
            <div key={i} className="bg-[#111424] border border-white/5 rounded-2xl p-7 hover:bg-[#15192b] hover:border-purple-500/20 transition-all duration-300 flex flex-col h-full group">
              <h3 className="text-white font-semibold text-[1.1rem] mb-3 group-hover:text-purple-300 transition-colors">{step.title}</h3>
              <p className="text-[#a1a1aa] text-[0.85rem] leading-relaxed mb-6 flex-grow">{step.desc}</p>
              
              <ul className="space-y-3">
                {step.bullets.map((bullet, j) => (
                  <li key={j} className="flex items-center text-[#d4d4d8] text-[0.75rem]">
                    <div className="w-[5px] h-[5px] rounded-full bg-purple-500 mr-3 shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Managed Precision Block */}
        <div className="max-w-[50rem] mx-auto relative group">
          {/* Glow effect behind */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 rounded-[2rem] blur-xl opacity-60 group-hover:opacity-100 transition duration-500 -z-10"></div>
          
          <div className="bg-[#111424] border border-white/5 group-hover:border-purple-500/20 transition-all duration-300 rounded-[1.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-[#202237] flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
              <ClipboardCheck className="text-[#a78bfa] w-7 h-7" />
            </div>
            
            <div className="text-center md:text-left">
              <h3 className="text-white font-semibold text-xl mb-2">Managed with Precision</h3>
              <p className="text-[#a1a1aa] text-sm md:text-[0.95rem] leading-relaxed">
                Our team utilizes high-end project tracking tools and provides you with a live dashboard to monitor every task, bug, and milestone in real-time. Experience development without the black box.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-16 flex justify-center">
          <button className="bg-gradient-to-r from-[#a855f7] to-[#d946ef] text-white font-medium px-10 py-3.5 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-[1.03] transition-all duration-300 flex items-center gap-2">
            Start Your Project
          </button>
        </div>

      </div>
    </section>
  );
};
