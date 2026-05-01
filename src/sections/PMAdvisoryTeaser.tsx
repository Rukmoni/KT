import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CircleCheck as CheckCircle, TrendingUp, Shield, Zap } from 'lucide-react';

const highlights = [
  { icon: <TrendingUp className="w-4 h-4" />, color: '#60a5fa', text: '35% on-time delivery uplift' },
  { icon: <Zap className="w-4 h-4" />, color: '#34d399', text: '30% velocity improvement' },
  { icon: <Shield className="w-4 h-4" />, color: '#fbbf24', text: '$18M+ portfolio managed' },
];

const pillars = [
  'Delivery Governance',
  'Agile & SAFe Coaching',
  'Risk Monitoring',
  'Stakeholder Management',
  'AI-Assisted Workflows',
  'Capability Transfer',
];

export const PMAdvisoryTeaser = () => {
  const navigate = useNavigate();

  return (
    <section id="pm-advisory" className="relative w-full bg-[#080c18] py-24 px-4 overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#3b82f6]/8 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-[72rem] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left — text content */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55 }}
          >
            <div className="uppercase tracking-widest text-[#60a5fa] text-[0.62rem] font-bold py-1.5 px-4 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-full inline-block mb-5">
              PM Advisory
            </div>

            <h2 className="text-4xl md:text-[3rem] leading-[1.1] font-bold text-white mb-5 tracking-tight">
              Enterprise delivery discipline<br />
              <span className="text-[#93c5fd] font-normal italic">for technology teams.</span>
            </h2>

            <p className="text-[#a1a1aa] text-[0.95rem] leading-relaxed mb-6 max-w-[50ch]">
              Independent PM advisory grounded in 15+ years of regulated enterprise programme delivery across Telecom, BFSI, and Energy. Hands-on governance setup, Agile & SAFe coaching, and AI workflow integration.
            </p>

            {/* Highlights */}
            <div className="flex flex-col gap-3 mb-7">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${h.color}18`, color: h.color }}>
                    {h.icon}
                  </div>
                  <span className="text-[0.85rem] text-[#d1d5db]">{h.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/pm-advisory')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-white font-medium px-6 py-3 rounded-full shadow-[0_0_20px_rgba(96,165,250,0.3)] hover:shadow-[0_0_30px_rgba(96,165,250,0.5)] hover:scale-[1.02] transition-all duration-300 text-sm"
            >
              Explore PM Advisory <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Right — visual card grid */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative"
          >
            {/* Main card */}
            <div className="bg-[#111424] border border-white/8 rounded-[1.75rem] p-7 mb-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#3b82f6]/8 blur-[40px] rounded-full" />
              <div className="text-[0.65rem] font-bold uppercase tracking-widest text-[#6b7280] mb-4">Advisory Pillars</div>
              <div className="grid grid-cols-2 gap-2.5">
                {pillars.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/3 border border-white/5 rounded-xl px-3 py-2.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#34d399] flex-shrink-0" />
                    <span className="text-[0.72rem] text-[#c4c4cf]">{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { num: '15+', label: 'Years PM Leadership' },
                { num: 'SAFe', label: 'Certified Delivery' },
                { num: '0', label: 'Audit Findings' },
              ].map((s, i) => (
                <div key={i} className="bg-[#111424] border border-white/8 rounded-xl p-4 text-center hover:border-[#3b82f6]/25 hover:bg-[#15192b] transition-all duration-200">
                  <div className="text-lg font-bold text-white mb-1">{s.num}</div>
                  <div className="text-[0.65rem] text-[#6b7280] leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
