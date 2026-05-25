import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Plus, Pencil, Trash2, X, Save, ExternalLink } from 'lucide-react';
import { BLOG_CATEGORIES } from '../hooks/usePosts';

const NAV_TABS = [
  { label: 'Sales & Leads',         path: '/admin' },
  { label: 'Note2Task Credentials', path: '/admin/note2task' },
  { label: 'SEO Dashboard',         path: '/admin/seo' },
  { label: 'Carousel Images',       path: '/admin/carousel-images' },
  { label: 'Blog',                  path: '/admin/blog' },
];

const ADMIN_FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/blog-admin`;
const FN_HEADERS   = {
  'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  'Content-Type':  'application/json',
};

interface DbPost {
  id: number;
  slug: string;
  title: string;
  category: string;
  category_label: string;
  excerpt: string;
  body: string;
  linkedin_url: string;
  author: string;
  author_title: string;
  tags: string[];
  image: string | null;
  video: string | null;
  published: boolean;
  draft: boolean;
  created_at: string;
  updated_at: string;
}

type FormData = Omit<DbPost, 'id' | 'created_at' | 'updated_at'>;

const EMPTY_FORM: FormData = {
  slug: '', title: '', category: 'ai-strategy',
  category_label: '', excerpt: '', body: '',
  linkedin_url: '', author: 'Nagarajan Maheswaran',
  author_title: 'Senior Project & Programme Manager | PMP | PSM I | CSPO',
  tags: [], image: null, video: null, published: false, draft: true,
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function postToForm(p: DbPost): FormData {
  return {
    slug: p.slug, title: p.title, category: p.category,
    category_label: p.category_label, excerpt: p.excerpt, body: p.body,
    linkedin_url: p.linkedin_url, author: p.author, author_title: p.author_title,
    tags: p.tags, image: p.image, video: p.video, published: p.published, draft: p.draft,
  };
}

export function AdminBlog() {
  const navigate = useNavigate();
  const [posts, setPosts]         = useState<DbPost[]>([]);
  const [loading, setLoading]     = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm]           = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('id', { ascending: false });
    if (data) setPosts(data as DbPost[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setIsCreating(true);
  };

  const openEdit = (post: DbPost) => {
    setForm(postToForm(post));
    setEditingId(post.id);
    setIsCreating(false);
  };

  const closeEditor = () => {
    setIsCreating(false);
    setEditingId(null);
    setSaveMsg('');
  };

  const handleFormChange = (field: keyof FormData, value: unknown) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && isCreating) {
        next.slug = slugify(value as string);
      }
      if (field === 'category') {
        next.category_label = BLOG_CATEGORIES[value as string]?.label || '';
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      setSaveMsg('Title and slug are required.');
      return;
    }
    setSaving(true);
    setSaveMsg('');

    const payload = {
      ...form,
      category_label: form.category_label || BLOG_CATEGORIES[form.category]?.label || form.category,
      ...(editingId ? { id: editingId } : {}),
    };

    const res = await fetch(`${ADMIN_FN_URL}?action=${editingId ? 'update' : 'create'}`, {
      method: 'POST',
      headers: FN_HEADERS,
      body: JSON.stringify(payload),
    });
    const json = await res.json();

    setSaving(false);
    if (!res.ok || json.error) {
      setSaveMsg(json.error ?? 'Save failed');
    } else {
      setSaveMsg('Saved!');
      await fetchPosts();
      setTimeout(() => { closeEditor(); }, 800);
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`${ADMIN_FN_URL}?action=delete`, {
      method: 'POST',
      headers: FN_HEADERS,
      body: JSON.stringify({ id }),
    });
    const json = await res.json();
    if (!res.ok || json.error) {
      alert(json.error ?? 'Delete failed');
    } else {
      setDeleteConfirm(null);
      await fetchPosts();
    }
  };

  const editorOpen = isCreating || editingId !== null;

  const s = {
    page:    { padding: '60px 40px', background: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'var(--font-sans, system-ui)' },
    tabBtn:  (active: boolean): React.CSSProperties => ({
      padding: '7px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
      background: active ? '#1e293b' : 'transparent',
      color: active ? '#e2e8f0' : '#64748b',
      border: active ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
      cursor: 'pointer',
    }),
    card: {
      background: '#0f172a', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '12px', padding: '16px 20px',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px',
    } as React.CSSProperties,
    label: { fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' } as React.CSSProperties,
    input: {
      width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px', padding: '8px 12px', color: '#f1f5f9', fontSize: '14px', outline: 'none',
    } as React.CSSProperties,
    textarea: {
      width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px', padding: '8px 12px', color: '#f1f5f9', fontSize: '13px',
      outline: 'none', resize: 'vertical' as const, fontFamily: 'monospace', lineHeight: '1.6',
    },
    btn: (color: string, ghost?: boolean): React.CSSProperties => ({
      display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 16px',
      borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
      border: ghost ? `1px solid ${color}44` : 'none',
      background: ghost ? 'transparent' : color,
      color: ghost ? color : '#fff',
      transition: 'opacity 0.15s',
    }),
    select: {
      width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px', padding: '8px 12px', color: '#f1f5f9', fontSize: '14px', outline: 'none',
    } as React.CSSProperties,
  };

  return (
    <div style={s.page}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Nav */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {NAV_TABS.map(t => (
            <button key={t.path} onClick={() => navigate(t.path)} style={s.tabBtn(t.path === '/admin/blog')}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f5f9' }}>Blog Posts</h1>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{posts.length} posts total</p>
          </div>
          <button onClick={openCreate} style={s.btn('#6366f1')}>
            <Plus size={15} /> New Post
          </button>
        </div>

        {/* Editor panel */}
        {editorOpen && (
          <div style={{ background: '#0a1628', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '16px', padding: '28px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9' }}>
                {isCreating ? 'New Post' : 'Edit Post'}
              </h2>
              <button onClick={closeEditor} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Title */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={s.label}>Title *</label>
                <input
                  style={s.input} value={form.title}
                  onChange={e => handleFormChange('title', e.target.value)}
                  placeholder="Post title..."
                />
              </div>

              {/* Slug */}
              <div>
                <label style={s.label}>Slug *</label>
                <input
                  style={s.input} value={form.slug}
                  onChange={e => handleFormChange('slug', e.target.value)}
                  placeholder="url-friendly-slug"
                />
              </div>

              {/* Category */}
              <div>
                <label style={s.label}>Category</label>
                <select
                  style={s.select} value={form.category}
                  onChange={e => handleFormChange('category', e.target.value)}
                >
                  {Object.entries(BLOG_CATEGORIES).map(([key, cat]) => (
                    <option key={key} value={key} style={{ background: '#0f172a' }}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* LinkedIn URL */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={s.label}>LinkedIn URL</label>
                <input
                  style={s.input} value={form.linkedin_url}
                  onChange={e => handleFormChange('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/..."
                />
              </div>

              {/* Image */}
              <div>
                <label style={s.label}>Image URL (optional)</label>
                <input
                  style={s.input} value={form.image ?? ''}
                  onChange={e => handleFormChange('image', e.target.value || null)}
                  placeholder="https://..."
                />
              </div>

              {/* Video */}
              <div>
                <label style={s.label}>YouTube URL (optional)</label>
                <input
                  style={s.input} value={form.video ?? ''}
                  onChange={e => handleFormChange('video', e.target.value || null)}
                  placeholder="https://youtube.com/..."
                />
              </div>

              {/* Excerpt */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={s.label}>Excerpt</label>
                <textarea
                  style={{ ...s.textarea, height: '80px' }} value={form.excerpt}
                  onChange={e => handleFormChange('excerpt', e.target.value)}
                  placeholder="Short summary shown on the blog index..."
                />
              </div>

              {/* Body */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={s.label}>Body</label>
                <textarea
                  style={{ ...s.textarea, height: '320px' }} value={form.body}
                  onChange={e => handleFormChange('body', e.target.value)}
                  placeholder="Full post content..."
                />
              </div>

              {/* Flags */}
              <div style={{ display: 'flex', gap: '24px', gridColumn: '1 / -1', alignItems: 'center' }}>
                <label style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer', fontSize: '14px', color: '#cbd5e1' }}>
                  <input
                    type="checkbox" checked={form.published}
                    onChange={e => handleFormChange('published', e.target.checked)}
                    style={{ accentColor: '#10b981' }}
                  />
                  Published
                </label>
                <label style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer', fontSize: '14px', color: '#cbd5e1' }}>
                  <input
                    type="checkbox" checked={form.draft}
                    onChange={e => handleFormChange('draft', e.target.checked)}
                    style={{ accentColor: '#f59e0b' }}
                  />
                  Draft
                </label>
              </div>
            </div>

            {/* Save row */}
            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={handleSave} disabled={saving} style={s.btn('#6366f1')}>
                <Save size={14} /> {saving ? 'Saving…' : 'Save Post'}
              </button>
              <button onClick={closeEditor} style={s.btn('#64748b', true)}>Cancel</button>
              {saveMsg && (
                <span style={{ fontSize: '13px', color: saveMsg === 'Saved!' ? '#10b981' : '#f87171' }}>
                  {saveMsg}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Posts list */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #6366f133', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>
            No posts yet. Create your first one.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {posts.map(post => {
              const cat = BLOG_CATEGORIES[post.category];
              return (
                <div key={post.id} style={s.card}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '11px', fontWeight: 600, padding: '2px 8px',
                          borderRadius: '99px', flexShrink: 0,
                          background: `${cat?.color ?? '#6366f1'}22`,
                          color: cat?.color ?? '#6366f1',
                          border: `1px solid ${cat?.color ?? '#6366f1'}44`,
                        }}
                      >
                        {cat?.label ?? post.category}
                      </span>
                      {post.draft && (
                        <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '99px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
                          Draft
                        </span>
                      )}
                      {!post.published && !post.draft && (
                        <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '99px', background: 'rgba(100,116,139,0.15)', color: '#94a3b8' }}>
                          Unpublished
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.title}
                    </p>
                    <p style={{ fontSize: '12px', color: '#475569' }}>/{post.slug}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    {post.published && !post.draft && (
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: '6px', borderRadius: '6px', color: '#64748b', display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        title="View post"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                    <button
                      onClick={() => openEdit(post)}
                      style={{ padding: '6px', borderRadius: '6px', color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer' }}
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    {deleteConfirm === post.id ? (
                      <>
                        <button
                          onClick={() => handleDelete(post.id)}
                          style={{ padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          style={{ padding: '5px 10px', borderRadius: '6px', fontSize: '12px', color: '#64748b', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        style={{ padding: '6px', borderRadius: '6px', color: '#64748b', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p style={{ fontSize: '11px', color: '#334155', marginTop: '32px' }}>
          Posts with published=true and draft=false appear on the public blog.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: #475569; }
        select option { background: #0f172a; color: #f1f5f9; }
      `}</style>
    </div>
  );
}

