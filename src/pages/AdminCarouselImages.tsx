import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Upload, CheckCircle, AlertCircle, Image, Trash2, RefreshCw } from 'lucide-react';

const SLIDE_META: { id: number; service: string; title: string; fallback: string }[] = [
  { id: 1,  service: 'PM Advisory',     title: 'Strategic Product Leadership, On Demand',              fallback: '/carousel-images/C_img1 copy.png' },
  { id: 2,  service: 'PM Advisory',     title: 'Fractional PM — Senior Expertise, Zero Overhead',      fallback: '/carousel-images/C_img2 copy.png' },
  { id: 3,  service: 'PM Advisory',     title: 'Agile Delivery That Ships on Time, Every Sprint',       fallback: '/carousel-images/C_img3 copy.png' },
  { id: 4,  service: 'PM Advisory',     title: 'Enterprise Waterfall & SAFe Frameworks That Work',      fallback: '/carousel-images/C_img4 copy.png' },
  { id: 5,  service: 'PM Advisory',     title: 'Delivery Governance Built to Withstand Scrutiny',       fallback: '' },
  { id: 6,  service: 'PM Advisory',     title: 'Stakeholder Alignment & Risk Visibility, Always On',    fallback: '' },
  { id: 7,  service: 'PM Advisory',     title: 'AI-Augmented PM: Smarter Delivery, Half the Admin',     fallback: '' },
  { id: 8,  service: 'App Development', title: 'Native Mobile Apps That Users Love',                    fallback: '' },
  { id: 9,  service: 'App Development', title: 'Built to Scale From Day One',                           fallback: '' },
  { id: 10, service: 'App Development', title: 'Deploy AI Support Agents in Days, Not Months',          fallback: '' },
  { id: 11, service: 'App Development', title: 'Voice AI Agents That Sound and Think Human',            fallback: '/carousel-images/C_img11 copy.jpg' },
  { id: 12, service: 'App Development', title: 'KuvantaOmniHub — One Platform, Every Channel',          fallback: '' },
  { id: 13, service: 'Web Development', title: 'Web Experiences That Actually Convert',                  fallback: '' },
  { id: 14, service: 'Web Development', title: 'Full-Stack. End-to-End. Ship Ready.',                   fallback: '' },
  { id: 15, service: 'AI Consulting',   title: 'Turn AI Hype Into Real Business Outcomes',              fallback: '' },
  { id: 16, service: 'AI Consulting',   title: 'Intelligent Automation at Scale',                       fallback: '' },
  { id: 17, service: 'AI Consulting',   title: 'Note2Task — Meeting Notes Into Jira in Seconds',        fallback: '' },
  { id: 18, service: 'AI Consulting',   title: 'Smart Analytics — AI-Powered Business Intelligence',    fallback: '' },
  { id: 19, service: 'AI Consulting',   title: 'AI Workflow Automation — End Repetitive Work Forever',  fallback: '' },
];

const SERVICE_COLORS: Record<string, string> = {
  'PM Advisory':     '#6366f1',
  'App Development': '#06b6d4',
  'Web Development': '#10b981',
  'AI Consulting':   '#ec4899',
};

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

interface SlideImage {
  slide_id: number;
  image_url: string;
}

export const AdminCarouselImages = () => {
  const navigate = useNavigate();
  const [savedImages, setSavedImages] = useState<Record<number, string>>({});
  const [uploadStates, setUploadStates] = useState<Record<number, UploadState>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [previews, setPreviews] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const fetchImages = async () => {
    setLoading(true);
    const { data } = await supabase.from('carousel_images').select('slide_id, image_url');
    if (data) {
      const map: Record<number, string> = {};
      (data as SlideImage[]).forEach(row => { map[row.slide_id] = row.image_url; });
      setSavedImages(map);
    }
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, []);

  const handleFileChange = async (slideId: number, file: File) => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviews(p => ({ ...p, [slideId]: objectUrl }));
    setUploadStates(s => ({ ...s, [slideId]: 'uploading' }));
    setErrors(e => { const next = { ...e }; delete next[slideId]; return next; });

    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `C_img${slideId}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('carousel-images')
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      setUploadStates(s => ({ ...s, [slideId]: 'error' }));
      setErrors(e => ({ ...e, [slideId]: uploadError.message }));
      return;
    }

    const { data: urlData } = supabase.storage.from('carousel-images').getPublicUrl(path);
    const publicUrl = urlData.publicUrl;

    const { error: dbError } = await supabase.from('carousel_images').upsert(
      { slide_id: slideId, image_url: publicUrl, updated_at: new Date().toISOString() },
      { onConflict: 'slide_id' }
    );

    if (dbError) {
      setUploadStates(s => ({ ...s, [slideId]: 'error' }));
      setErrors(e => ({ ...e, [slideId]: dbError.message }));
      return;
    }

    setSavedImages(prev => ({ ...prev, [slideId]: publicUrl }));
    setUploadStates(s => ({ ...s, [slideId]: 'success' }));
    setTimeout(() => setUploadStates(s => ({ ...s, [slideId]: 'idle' })), 3000);
  };

  const handleRemove = async (slideId: number) => {
    setUploadStates(s => ({ ...s, [slideId]: 'uploading' }));
    await supabase.from('carousel_images').delete().eq('slide_id', slideId);
    setSavedImages(prev => { const next = { ...prev }; delete next[slideId]; return next; });
    setPreviews(prev => { const next = { ...prev }; delete next[slideId]; return next; });
    setUploadStates(s => ({ ...s, [slideId]: 'idle' }));
  };

  const grouped = SLIDE_META.reduce<Record<string, typeof SLIDE_META>>((acc, slide) => {
    acc[slide.service] = acc[slide.service] ?? [];
    acc[slide.service].push(slide);
    return acc;
  }, {});

  const activeImageUrl = (slideId: number) =>
    previews[slideId] ?? savedImages[slideId] ?? SLIDE_META.find(s => s.id === slideId)?.fallback ?? '';

  return (
    <div style={{ padding: '60px 40px', background: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Nav tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {[
            { label: 'Sales & Leads',         path: '/admin' },
            { label: 'Note2Task Credentials', path: '/admin/note2task' },
            { label: 'SEO Dashboard',         path: '/admin/seo' },
            { label: 'Carousel Images',       path: '/admin/carousel-images' },
          ].map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                padding: '7px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                background: path === '/admin/carousel-images' ? '#1e293b' : 'transparent',
                color: path === '/admin/carousel-images' ? '#e2e8f0' : '#64748b',
                border: `1px solid ${path === '/admin/carousel-images' ? '#334155' : '#1e293b'}`,
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>Carousel Images</h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '6px 0 0' }}>
              Upload images for each slide. Falls back to the default animated visual if no image is set.
            </p>
          </div>
          <button
            onClick={fetchImages}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', background: '#0f172a', border: '1px solid #1e293b', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#334155' }}>Loading…</div>
        ) : (
          Object.entries(grouped).map(([service, slides]) => (
            <div key={service} style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '4px', height: '20px', borderRadius: '2px', background: SERVICE_COLORS[service] ?? '#334155' }} />
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: SERVICE_COLORS[service] ?? '#94a3b8', margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {service}
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {slides.map(slide => {
                  const state = uploadStates[slide.id] ?? 'idle';
                  const imgUrl = activeImageUrl(slide.id);
                  const hasSaved = !!savedImages[slide.id];
                  const hasFallback = !!slide.fallback;
                  const accentColor = SERVICE_COLORS[slide.service] ?? '#334155';

                  return (
                    <div
                      key={slide.id}
                      style={{
                        background: '#0a0f1a',
                        border: `1px solid ${hasSaved ? `${accentColor}40` : '#1e293b'}`,
                        borderRadius: '12px',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Preview area */}
                      <div
                        style={{
                          position: 'relative',
                          height: '160px',
                          background: '#0d1117',
                          cursor: 'pointer',
                          overflow: 'hidden',
                        }}
                        onClick={() => fileInputRefs.current[slide.id]?.click()}
                      >
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={slide.title}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '8px' }}>
                            <Image size={28} style={{ color: '#1e293b' }} />
                            <span style={{ color: '#334155', fontSize: '12px' }}>No image — uses animated visual</span>
                          </div>
                        )}

                        {/* Upload overlay on hover */}
                        <div style={{
                          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          opacity: 0, transition: 'opacity 0.2s',
                        }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                          onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                        >
                          <Upload size={20} style={{ color: '#fff', marginRight: '6px' }} />
                          <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>Click to upload</span>
                        </div>

                        {/* State indicators */}
                        {state === 'uploading' && (
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '24px', height: '24px', border: `2px solid ${accentColor}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                          </div>
                        )}
                        {state === 'success' && (
                          <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                            <CheckCircle size={18} style={{ color: '#22c55e' }} />
                          </div>
                        )}

                        {/* Slide ID badge */}
                        <div style={{
                          position: 'absolute', top: '8px', left: '8px',
                          background: `${accentColor}20`, border: `1px solid ${accentColor}40`,
                          borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 700, color: accentColor,
                        }}>
                          Slide {slide.id}
                        </div>
                      </div>

                      {/* Info row */}
                      <div style={{ padding: '12px 14px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', margin: '0 0 4px', lineHeight: 1.4 }}>{slide.title}</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                          <div style={{ fontSize: '11px', color: '#475569' }}>
                            {hasSaved
                              ? <span style={{ color: '#22c55e' }}>Custom image active</span>
                              : hasFallback
                              ? <span style={{ color: '#f59e0b' }}>Using local fallback</span>
                              : <span>Using animated visual</span>
                            }
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => fileInputRefs.current[slide.id]?.click()}
                              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', background: `${accentColor}15`, border: `1px solid ${accentColor}30`, color: accentColor, cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}
                            >
                              <Upload size={11} /> Upload
                            </button>
                            {hasSaved && (
                              <button
                                onClick={() => handleRemove(slide.id)}
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', background: '#ef444415', border: '1px solid #ef444430', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}
                              >
                                <Trash2 size={11} /> Remove
                              </button>
                            )}
                          </div>
                        </div>
                        {errors[slide.id] && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', padding: '6px 10px', background: '#ef444410', border: '1px solid #ef444430', borderRadius: '6px' }}>
                            <AlertCircle size={12} style={{ color: '#ef4444', flexShrink: 0 }} />
                            <span style={{ color: '#ef4444', fontSize: '11px' }}>{errors[slide.id]}</span>
                          </div>
                        )}
                      </div>

                      <input
                        ref={el => { fileInputRefs.current[slide.id] = el; }}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleFileChange(slide.id, f); e.target.value = ''; }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
