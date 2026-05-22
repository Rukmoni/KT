import { useEffect, useRef, useState } from 'react';

const METRICS = [
  { value: 20, suffix: 'M+', prefix: '$', label: 'Annual Portfolio', sublabel: 'Managed' },
  { value: 35, suffix: '%', prefix: '', label: 'OTD Improvement', sublabel: 'Delivery Rate' },
  { value: 30, suffix: '%', prefix: '', label: 'Velocity Uplift', sublabel: 'Team Performance' },
  { value: 0, suffix: '', prefix: '', label: 'Audit Findings', sublabel: 'Zero Findings, 3 Years' },
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (target === 0) { setCount(0); return; }
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function MetricCard({ metric, animate }: { metric: typeof METRICS[0]; animate: boolean }) {
  const count = useCountUp(metric.value, 1800, animate);
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-6 flex-1 min-w-0">
      <div className="font-mono text-4xl sm:text-5xl font-bold text-brand-cyan tabular-nums">
        {metric.prefix}{metric.value === 0 && animate ? 'Zero' : count}{metric.suffix}
      </div>
      <div className="text-brand-text text-sm font-semibold text-center">{metric.label}</div>
      <div className="text-brand-muted text-xs text-center">{metric.sublabel}</div>
      <div className="mt-1 flex items-center gap-1 text-brand-cyan/60" aria-hidden="true">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18"/>
        </svg>
      </div>
    </div>
  );
}

export function Metrics() {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimate(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="bg-brand-surface border-y border-brand-border"
      aria-label="Key performance metrics"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-brand-border">
          {METRICS.map((m) => (
            <MetricCard key={m.label} metric={m} animate={animate} />
          ))}
        </div>
      </div>
    </section>
  );
}
