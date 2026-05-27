import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Linkedin } from 'lucide-react';
import { usePosts, type Post } from '../../hooks/usePosts';

function setMeta(name: string, content: string, prop = false) {
  const attr = prop ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

const BULLET_RE     = /^([•✔✅☑→👉►▸◆▶🔸🔹🔶⚡📌🚨])\s+(.+)/u;
const NUMBERED_RE   = /^([0-9]+[.):])\s*(.+)/u;
const DIVIDER_RE    = /^[─—⸻\-=~]{3,}$/;
const QUOTE_RE      = /^[""](.+)[""]$/;
const TAG_RE        = /(#[A-Za-z][A-Za-z0-9_]+)/g;
const HEADING_EMOJI = /^[🚀💡📱🎨🌐💰🤖🔥✨🎯🧭📊📘🔑🧠💼🏆🌟🎉📢🔎🛠️⭐🌍🚦⚙️🎓🌱⚖️🔐💎📈🔮🧩]/u;

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function applyInline(text: string): string {
  let s = escapeHtml(text);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(TAG_RE, '<span class="blog-hashtag">$1</span>');
  return s;
}

function formatBody(raw: string): string {
  const lines = raw.split('\n');
  const parts: string[] = [];
  let paraBuffer: string[] = [];
  let ulBuffer:   string[] = [];
  let olBuffer:   string[] = [];

  const flushPara = () => { if (paraBuffer.length) { parts.push(`<p>${paraBuffer.join(' ')}</p>`); paraBuffer = []; } };
  const flushUl   = () => { if (ulBuffer.length)   { parts.push(`<ul>${ulBuffer.join('')}</ul>`); ulBuffer = []; } };
  const flushOl   = () => { if (olBuffer.length)   { parts.push(`<ol>${olBuffer.join('')}</ol>`); olBuffer = []; } };
  const flushAll  = () => { flushPara(); flushUl(); flushOl(); };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') { flushAll(); continue; }
    if (trimmed === '⸻' || trimmed === '—') { flushAll(); parts.push('<div class="blog-divider">· · ·</div>'); continue; }
    if (DIVIDER_RE.test(trimmed)) { flushAll(); parts.push('<hr class="blog-hr">'); continue; }

    const quoteMatch = trimmed.match(QUOTE_RE);
    if (quoteMatch) { flushAll(); parts.push(`<div class="blog-callout">${applyInline(quoteMatch[1])}</div>`); continue; }

    const bulletMatch = trimmed.match(BULLET_RE);
    if (bulletMatch) {
      flushPara(); flushOl();
      ulBuffer.push(`<li><span class="blog-bullet-icon">${escapeHtml(bulletMatch[1])}</span><span>${applyInline(bulletMatch[2])}</span></li>`);
      continue;
    }

    const numberedMatch = trimmed.match(NUMBERED_RE);
    if (numberedMatch) { flushPara(); flushUl(); olBuffer.push(`<li>${applyInline(numberedMatch[2])}</li>`); continue; }

    if (HEADING_EMOJI.test(trimmed) && trimmed.length < 90 && !trimmed.endsWith('.') && !trimmed.endsWith(',')) {
      flushAll();
      parts.push(`<h3 class="blog-h3">${applyInline(trimmed)}</h3>`);
      continue;
    }

    flushUl(); flushOl();
    paraBuffer.push(applyInline(trimmed));
  }

  flushAll();
  return parts.join('\n');
}

function CategoryBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {label}
    </span>
  );
}

function AuthorBlock({ post, categoryColor }: { post: Post; categoryColor: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}99)` }}
      >
        NM
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-sm" style={{ color: '#f1f5f9' }}>{post.author}</span>
          <a
            href="https://www.linkedin.com/in/nagarajanmaheswaran/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-75"
            style={{ color: '#0A66C2' }}
          >
            <Linkedin size={13} strokeWidth={2} />
            Follow
          </a>
        </div>
        <p className="text-xs leading-snug mt-0.5 truncate max-w-xs sm:max-w-sm" style={{ color: '#64748b' }}>
          {post.authorTitle}
        </p>
      </div>
    </div>
  );
}

function RelatedCard({ post, categoryColor }: { post: Post; categoryColor: string }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="rounded-xl p-4 flex flex-col gap-2 transition-all duration-200 hover:-translate-y-0.5 border"
      style={{ background: '#0f172a', borderColor: 'rgba(255,255,255,0.07)' }}
    >
      <span
        className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold w-fit"
        style={{ backgroundColor: `${categoryColor}22`, color: categoryColor }}
      >
        {post.categoryLabel}
      </span>
      <p className="font-semibold text-sm leading-snug line-clamp-2" style={{ color: '#cbd5e1' }}>
        {post.title}
      </p>
    </Link>
  );
}

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { allPosts, data, loading } = usePosts();

  const post = allPosts.find(p => p.slug === slug);
  const categoryColor = post && data ? (data.categories[post.category]?.color ?? '#6366f1') : '#6366f1';

  useEffect(() => {
    if (!post) return;
    const prev = document.title;
    document.title = `${post.title} | Nagarajan Maheswaran`;
    setMeta('description', post.excerpt);
    setMeta('og:title', post.title, true);
    setMeta('og:description', post.excerpt, true);
    return () => { document.title = prev; };
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#6366f133', borderTopColor: '#6366f1' }} />
      </div>
    );
  }

  if (!post || !data) return <Navigate to="/blog" replace />;

  const youtubeId   = post.video ? getYouTubeId(post.video) : null;
  const isDirectVid = post.video && !youtubeId;
  const bodyHtml    = formatBody(post.body);

  const related = allPosts
    .filter(p => p.published && !p.draft && p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen font-['Inter',sans-serif]" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* Accent stripe */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${categoryColor}, transparent)` }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-16">

        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: '#64748b' }}
        >
          <ArrowLeft size={15} />
          Back to Blog
        </Link>

        {post.draft && (
          <div
            className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border"
            style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.25)', color: '#f59e0b' }}
          >
            Draft — this post is not yet published
          </div>
        )}

        <div className="mb-7">
          <CategoryBadge label={post.categoryLabel} color={categoryColor} />
          <h1 className="text-3xl font-extrabold mt-3 mb-5 leading-tight" style={{ color: '#f1f5f9' }}>
            {post.title}
          </h1>
          <AuthorBlock post={post} categoryColor={categoryColor} />
        </div>

        {post.image && (
          <div className="mb-8 rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <img src={post.image} alt={post.title} className="w-full object-cover" loading="lazy" />
          </div>
        )}

        {youtubeId && (
          <div className="mb-8 rounded-2xl overflow-hidden border aspect-video" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
              title={post.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {isDirectVid && (
          <div className="mb-8 rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <video
              src={post.video!}
              controls
              className="w-full"
              style={{ display: 'block', maxHeight: '480px', background: '#000' }}
            />
          </div>
        )}

        <div
          className="blog-post-body rounded-2xl border p-6 sm:p-8 mb-8"
          style={{ background: '#0f172a', borderColor: 'rgba(255,255,255,0.07)' }}
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        <div
          className="mb-10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border"
          style={{ background: 'rgba(10,102,194,0.08)', borderColor: 'rgba(10,102,194,0.2)' }}
        >
          <div className="flex items-start gap-3">
            <Linkedin size={22} className="flex-shrink-0 mt-0.5" style={{ color: '#0A66C2' }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>Originally shared on LinkedIn</p>
              <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Join the conversation and share your thoughts.</p>
            </div>
          </div>
          <a
            href={post.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 flex-shrink-0"
            style={{ backgroundColor: '#0A66C2' }}
          >
            <Linkedin size={15} />
            View on LinkedIn →
          </a>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="font-bold text-base mb-4" style={{ color: '#94a3b8' }}>More in this category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(r => (
                <RelatedCard
                  key={r.id}
                  post={r}
                  categoryColor={data.categories[r.category]?.color ?? '#6366f1'}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .blog-post-body { color: #cbd5e1; line-height: 1.75; font-size: 0.95rem; }
        .blog-post-body p { margin-bottom: 1rem; }
        .blog-post-body strong { color: #f1f5f9; font-weight: 600; }
        .blog-post-body ul { list-style: none; padding: 0; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .blog-post-body ul li { display: flex; gap: 0.6rem; align-items: flex-start; }
        .blog-bullet-icon { flex-shrink: 0; margin-top: 0.1rem; }
        .blog-post-body ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.4rem; }
        .blog-h3 { color: #f1f5f9; font-size: 1.05rem; font-weight: 700; margin: 1.5rem 0 0.75rem; }
        .blog-divider { text-align: center; color: #334155; letter-spacing: 0.5rem; margin: 2rem 0; font-size: 0.9rem; }
        .blog-hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 2rem 0; }
        .blog-callout { border-left: 3px solid #6366f1; padding: 0.75rem 1rem; margin: 1.25rem 0; background: rgba(99,102,241,0.08); border-radius: 0 0.5rem 0.5rem 0; color: #c7d2fe; font-style: italic; }
        .blog-hashtag { color: #6366f1; font-weight: 500; }
      `}</style>
    </div>
  );
}
