import { BotMessageSquare, MonitorSmartphone, Rocket, Palette, Store, AppWindow } from 'lucide-react';

const services = [
  {
    title: 'AI-Powered Solutions',
    description: 'Build intelligent apps with AI chat, automation, and smart recommendations that drive efficiency.',
    icon: <BotMessageSquare className="w-6 h-6 text-[#a78bfa]" />,
    iconBg: 'bg-[#a78bfa]/10',
  },
  {
    title: 'App Development',
    description: 'High-performance mobile and web apps built for scalability, security, and exceptional performance.',
    icon: <MonitorSmartphone className="w-6 h-6 text-[#e879f9]" />,
    iconBg: 'bg-[#e879f9]/10',
  },
  {
    title: 'MVP for Startups',
    description: 'Launch your idea quickly with a strong and scalable foundation tailored to your core user value.',
    icon: <Rocket className="w-6 h-6 text-[#60a5fa]" />,
    iconBg: 'bg-[#60a5fa]/10',
  },
  {
    title: 'UI/UX Design',
    description: 'Modern, user-focused interfaces that drive engagement and provide seamless digital experiences.',
    icon: <Palette className="w-6 h-6 text-[#c084fc]" />,
    iconBg: 'bg-[#c084fc]/10',
  },
  {
    title: 'Business Solutions',
    description: 'E-commerce, booking systems, and SaaS platforms tailored to your specific operational needs.',
    icon: <Store className="w-6 h-6 text-[#f472b6]" />,
    iconBg: 'bg-[#f472b6]/10',
  },
  {
    title: 'App Modernization',
    description: 'Upgrade outdated legacy systems into fast, modern experiences without losing your valuable data.',
    icon: <AppWindow className="w-6 h-6 text-[#38bdf8]" />,
    iconBg: 'bg-[#38bdf8]/10',
  }
];

export const Services = () => {
  return (
    <section id="services" className="relative w-full bg-[#0a0f1e] py-24 px-4 overflow-hidden font-sans">
      <div className="max-w-[72rem] mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="uppercase tracking-widest text-[#a8b8d8] text-[0.65rem] font-bold py-1.5 px-4 bg-white/5 border border-white/10 rounded-full inline-block mb-6">
            WHAT WE DO
          </div>
          <h2 className="text-4xl md:text-[3.25rem] leading-tight font-bold text-white mb-6 tracking-tight">
            Powerful Digital Solutions<br />
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Built for Scale
            </span>
          </h2>
          <p className="text-[#a1a1aa] max-w-2xl mx-auto text-[0.95rem] md:text-base leading-relaxed">
            From AI-driven applications to scalable platforms, we help businesses launch, grow, and innovate.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-[#111424] border border-white/5 hover:border-purple-500/20 rounded-[2rem] p-8 md:p-10 transition-all duration-300 flex flex-col h-full group hover:bg-[#15192b]"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-8 border border-white/5 shadow-inner transition-transform group-hover:scale-110 duration-300 ${service.iconBg}`}>
                {service.icon}
              </div>
              <h3 className="text-white font-semibold text-[1.15rem] mb-3">
                {service.title}
              </h3>
              <p className="text-[#a1a1aa] text-[0.85rem] leading-relaxed flex-grow">
                {service.description}
              </p>
            </div>
          ))}
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
