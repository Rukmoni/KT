import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Upload, Trash2, RefreshCw, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Image as ImageIcon } from 'lucide-react';

interface SlideMeta {
  id: number;
  service: string;
  title: string;
  fallback: string; // local public path, empty string if none
}

const SLIDE_META: SlideMeta[] = [
  { id: 1,  service: 'PM Advisory',     title: 'Strategic Product Leadership, On Demand',             fallback: '/carousel-images/C_img1.png' },
  { id: 2,  service: 'PM Advisory',     title: 'Fractional PM — Senior Expertise, Zero Overhead',     fallback: '/carousel-images/C_img2.png' },
  { id: 3,  service: 'PM Advisory',     title: 'Agile Delivery That Ships on Time, Every Sprint',      fallback: '/carousel-images/C_img3.png' },
  { id: 4,  service: 'PM Advisory',     title: 'Enterprise Waterfall & SAFe Frameworks That Work',     fallback: '/carousel-images/C_img4.png' },
  { id: 5,  service: 'PM Advisory',     title: 'Delivery Governance Built to Withstand Scrutiny',      fallback: '/carousel-images/C_img5.png' },
  { id: 6,  service: 'PM Advisory',     title: 'Stakeholder Alignment & Risk Visibility, Always On',   fallback: '/carousel-images/C_img6.png' },
  { id: 7,  service: 'PM Advisory',     title: 'AI-Augmented PM: Smarter Delivery, Half the Admin',    fallback: '/carousel-images/C_img7.png' },
  { id: 8,  service: 'App Development', title: 'Native Mobile Apps That Users Love',                   fallback: '/carousel-images/C_img8.png' },
  { id: 9,  service: 'App Development', title: 'Built to Scale From Day One',                          fallback: '/carousel-images/C_img9.png' },
  { id: 10, service: 'App Development', title: 'Deploy AI Support Agents in Days, Not Months',         fallback: '/carousel-images/C_img10.png' },
  { id: 11, service: 'App Development', title: 'Voice AI Agents That Sound and Think Human',           fallback: '/carousel-images/C_img11.png' },
  { id: 12, service: 'App Development', title: 'KuvantaOmniHub — One Platform, Every Channel',         fallback: '/carousel-images/C_img12.png' },
  { id: 13, service: 'Web Development', title: 'Web Experiences That Actually Convert',                 fallback: '/carousel-images/C_img13.png' },
  { id: 14, service: 'Web Development', title: 'Full-Stack. End-to-End. Ship Ready.',                  fallback: '/carousel-images/C_img14.png' },
  { id: 15, service: 'AI Consulting',   title: 'Turn AI Hype Into Real Business Outcomes',             fallback: '/carousel-images/C_img15.png' },
  { id: 16, service: 'AI Consulting',   title: 'Intelligent Automation at Scale',                      fallback: '/carousel-images/C_img16.png' },
  { id: 17, service: 'AI Consulting',   title: 'Note2Task — Meeting Notes Into Jira in Seconds',       fallback: '/carousel-images/C_img17.png' },
  { id: 18, service: 'AI Consulting',   title: 'Smart Analytics — AI-Powered Business Intelligence',   fallback: '/carousel-images/C_img18.png' },
  { id: 19, service: 'AI Consulting',   title: 'AI Workflow Automation — End Repetitive Work Forever', fallback: '/carousel-images/C_img19.png' },
];

const SERVICE_ACCENT: Record<string, string> = {
  'PM Advisory':     '#6366f1',
  'App Development': '#06b6d4',
  'Web Development': '#10b981',
  'AI Consulting':   '#ec4899',
};

type SlotState = 'idle' | 'uploading' | 'success' | 'error';

export const AdminCarouselImages = () => {
  const navigate = useNavigate();
  const [savedUrls, setSavedUrls]       = useState<Record<number, string>>({});
  const [slotState, setSlotState]       = useState<Record<number, SlotState>>({});
  const [slotError, setSlotError]       = useState<Record<number, string>>({});
  const [localPreview, setLocalPreview] = useState<Record<number, string>>({});
  const [loading, setLoading]           = useState(true);
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const fetchAll = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('carousel_images')
      .select('slide_id, image_url');
    if (data) {
      const map: Record<number, string> = {};
      (data as { slide_id: number; image_url: string }[]).forEach(r => {
        map[r.slide_id] = r.image_url;
      });
      setSavedUrls(map);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const setSlot = (id: number, s: SlotState) =>
    setSlotState(p => ({ ...p, [id]: s }));

  const handleUpload = async (slideId: number, file: File) => {
    // show local preview immediately
    const objUrl = URL.createObjectURL(file);
    setLocalPreview(p => ({ ...p, [slideId]: objUrl }));
    setSlot(slideId, 'uploading');
    setSlotError(e => { const n = { ...e }; delete n[slideId]; return n; });

    const ext  = file.name.split('.').pop() ?? 'png';
    const path = `slide-${slideId}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from('carousel-images')
      .upload(path, file, { upsert: true, contentType: file.type });

    if (upErr) {
      setSlot(slideId, 'error');
      setSlotError(e => ({ ...e, [slideId]: upErr.message }));
      return;
    }

    const { data: urlData } = supabase.storage
      .from('carousel-images')
      .getPublicUrl(path);

    // bust cache with timestamp query param
    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    const { error: dbErr } = await supabase
      .from('carousel_images')
      .upsert(
        { slide_id: slideId, image_url: publicUrl, updated_at: new Date().toISOString() },
        { onConflict: 'slide_id' }
      );

    if (dbErr) {
      setSlot(slideId, 'error');
      setSlotError(e => ({ ...e, [slideId]: dbErr.message }));
      return;
    }

    setSavedUrls(p => ({ ...p, [slideId]: publicUrl }));
    setSlot(slideId, 'success');
    setTimeout(() => setSlot(slideId, 'idle'), 3000);
  };

  const handleRemove = async (slideId: number) => {
    setSlot(slideId, 'uploading');
    await supabase.from('carousel_images').delete().eq('slide_id', slideId);
    setSavedUrls(p => { const n = { ...p }; delete n[slideId]; return n; });
    setLocalPreview(p => { const n = { ...p }; delete n[slideId]; return n; });
    setSlot(slideId, 'idle');
  };

  const grouped = SLIDE_META.reduce<Record<string, SlideMeta[]>>((acc, s) => {
    (acc[s.service] ??= []).push(s);
    return acc;
  }, {});

  // resolve preview url: local blob > saved remote > nothing (will show placeholder)
  const previewUrl = (s: SlideMeta) =>
    localPreview[s.id] ?? savedUrls[s.id] ?? '';

  const NAV_TABS = [
    { label: 'Sales & Leads',         path: '/admin' },
    { label: 'Note2Task Credentials', path: '/admin/note2task' },
    { label: 'SEO Dashboard',         path: '/admin/seo' },
    { label: 'Carousel Images',       path: '/admin/carousel-images' },
  ];

  return (
    <div style={{ padding: '60px 40px', background: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'var(--font-sans, system-ui)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Top nav */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {NAV_TABS.map(t => {
            const active = t.path === '/admin/carousel-images';
            return (
              <button key={t.path} onClick={() => navigate(t.path)} style={{
                padding: '7px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                background: active ? '#1e293b' : 'transparent',
                color: active ? '#e2e8f0' : '#64748b',
                border: `1px solid ${active ? '#334155' : '#1e293b'}`,
                cursor: 'pointer',
              }}>
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 6px' }}>Carousel Images</h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
              Upload a custom image for each slide. Falls back to <code style={{ background: '#0f172a', padding: '1px 5px', borderRadius: '4px', fontSize: '12px' }}>C_img&#123;n&#125;.png</code> in <code style={{ background: '#0f172a', padding: '1px 5px', borderRadius: '4px', fontSize: '12px' }}>/public/carousel-images/</code>, then the animated visual.
            </p>
          </div>
          <button onClick={fetchAll} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', background: '#0f172a', border: '1px solid #1e293b', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', flexShrink: 0 }}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#334155', fontSize: '14px' }}>Loading…</div>
        ) : (
          Object.entries(grouped).map(([service, slideList]) => {
            const accent = SERVICE_ACCENT[service] ?? '#64748b';
            return (
              <div key={service} style={{ marginBottom: '48px' }}>
                {/* Service heading */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                  <div style={{ width: 4, height: 20, borderRadius: 2, background: accent, flexShrink: 0 }} />
                  <h2 style={{ margin: 0, fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: accent }}>
                    {service}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '16px' }}>
                  {slideList.map(slide => {
                    const state   = slotState[slide.id] ?? 'idle';
                    const imgUrl  = previewUrl(slide);
                    const hasSaved = !!savedUrls[slide.id];
                    const busy = state === 'uploading';

                    return (
                      <div key={slide.id} style={{
                        background: '#0a0f1a',
                        border: `1px solid ${hasSaved ? `${accent}35` : '#1a2234'}`,
                        borderRadius: '14px',
                        overflow: 'hidden',
                        transition: 'border-color 0.2s',
                      }}>
                        {/* Preview */}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => !busy && inputRefs.current[slide.id]?.click()}
                          onKeyDown={e => e.key === 'Enter' && !busy && inputRefs.current[slide.id]?.click()}
                          style={{ position: 'relative', height: '170px', cursor: busy ? 'wait' : 'pointer', background: '#060b14', overflow: 'hidden' }}
                        >
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={slide.title}
                              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#1e293b' }}>
                              <ImageIcon size={32} />
                              <span style={{ fontSize: '11px', color: '#334155' }}>No image — uses animated visual</span>
                            </div>
                          )}

                          {/* Hover overlay */}
                          <div className="carousel-admin-hover-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: 0, transition: 'opacity 0.18s' }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                          >
                            <Upload size={16} color="#fff" />
                            <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>Click to upload</span>
                          </div>

                          {/* Busy spinner */}
                          {busy && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <div style={{ width: 26, height: 26, border: `2px solid ${accent}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'ci-spin 0.65s linear infinite' }} />
                            </div>
                          )}

                          {/* Success tick */}
                          {state === 'success' && (
                            <div style={{ position: 'absolute', top: 8, right: 8 }}>
                              <CheckCircle size={18} color="#22c55e" />
                            </div>
                          )}

                          {/* Slide ID badge */}
                          <div style={{ position: 'absolute', top: 8, left: 8, padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: `${accent}20`, border: `1px solid ${accent}35`, color: accent }}>
                            #{slide.id}
                          </div>
                        </div>

                        {/* Info row */}
                        <div style={{ padding: '12px 14px' }}>
                          <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', lineHeight: 1.4 }}>{slide.title}</p>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <span style={{ fontSize: '11px', color: hasSaved ? '#22c55e' : '#475569' }}>
                              {hasSaved ? 'Custom image active' : 'Using fallback / animated visual'}
                            </span>
                            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                              <button onClick={() => inputRefs.current[slide.id]?.click()} disabled={busy}
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', background: `${accent}15`, border: `1px solid ${accent}30`, color: accent, cursor: busy ? 'wait' : 'pointer', fontSize: '11px', fontWeight: 600 }}>
                                <Upload size={11} /> Upload
                              </button>
                              {hasSaved && (
                                <button onClick={() => handleRemove(slide.id)} disabled={busy}
                                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', background: '#ef444415', border: '1px solid #ef444430', color: '#ef4444', cursor: busy ? 'wait' : 'pointer', fontSize: '11px', fontWeight: 600 }}>
                                  <Trash2 size={11} /> Remove
                                </button>
                              )}
                            </div>
                          </div>

                          {slotError[slide.id] && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginTop: '8px', padding: '7px 10px', background: '#ef444410', border: '1px solid #ef444325', borderRadius: '6px' }}>
                              <AlertCircle size={13} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                              <span style={{ color: '#f87171', fontSize: '11px', lineHeight: 1.4 }}>{slotError[slide.id]}</span>
                            </div>
                          )}
                        </div>

                        <input
                          ref={el => { inputRefs.current[slide.id] = el; }}
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={e => {
                            const f = e.target.files?.[0];
                            if (f) handleUpload(slide.id, f);
                            e.target.value = '';
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`@keyframes ci-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
