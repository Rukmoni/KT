import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Linkedin } from 'lucide-react';
import { usePosts, type Post } from '../../hooks/usePosts';

// ── SEO helper ─────────────────────────────────────────────────────────────────

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

// ── YouTube helper ─────────────────────────────────────────────────────────────

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

// ── Body formatter (returns HTML string) ──────────────────────────────────────

const BULLET_RE    = /^([•✔✅☑→👉►▸◆▶🔸🔹🔶⚡📌🚨])\s+(.+)/u;
const NUMBERED_RE  = /^([0-9]+[.):])\s*(.+)/u;
const DIVIDER_RE   = /^[─—⸻\-=~]{3,}$/;
const QUOTE_RE     = /^[""](.+)[""]$/;
const TAG_RE       = /(#[A-Za-z][A-Za-z0-9_]+)/g;
const HEADING_EMOJI = /^[🚀💡📱🎨🌐💰🤖🔥✨🎯🧭📊📘🔑🧠💼🏆🌟🎉📢🔎🛠️⭐🌍🚦⚙️🎓🌱⚖️🔐💎📈🔮🧩]/u;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function applyInline(text: string): string {
  let s = escapeHtml(text);
  // Bold
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Hashtags
  s = s.replace(TAG_RE, '<span class="hashtag">$1</span>');
  return s;
}

function formatBody(raw: string): string {
  const lines = raw.split('\n');
  const parts: string[] = [];

  let paraBuffer: string[] = [];
  let ulBuffer: string[] = [];
  let olBuffer: string[] = [];

  const flushPara = () => {
    if (paraBuffer.length) {
      parts.push(`<p>${paraBuffer.join(' ')}</p>`);
      paraBuffer = [];
    }
  };

  const flushUl = () => {
    if (ulBuffer.length) {
      parts.push(`<ul>${ulBuffer.join('')}</ul>`);
      ulBuffer = [];
    }
  };

  const flushOl = () => {
    if (olBuffer.length) {
      parts.push(`<ol class="list-decimal ml-5">${olBuffer.join('')}</ol>`);
      olBuffer = [];
    }
  };

  const flushAll = () => {
    flushPara();
    flushUl();
    flushOl();
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Blank line
    if (trimmed === '') {
      flushAll();
      continue;
    }

    // Divider
    if (trimmed === '⸻' || trimmed === '—') {
      flushAll();
      parts.push('<div class="section-divider">· · ·</div>');
      continue;
    }

    if (DIVIDER_RE.test(trimmed)) {
      flushAll();
      parts.push('<hr>');
      continue;
    }

    // Quote / callout
    const quoteMatch = trimmed.match(QUOTE_RE);
    if (quoteMatch) {
      flushAll();
      parts.push(`<div class="callout-block">${applyInline(quoteMatch[1])}</div>`);
      continue;
    }

    // Bullet
    const bulletMatch = trimmed.match(BULLET_RE);
    if (bulletMatch) {
      flushPara();
      flushOl();
      const icon = bulletMatch[1];
      const text = applyInline(bulletMatch[2]);
      ulBuffer.push(
        `<li><div class="bullet-item"><span class="bullet-icon">${escapeHtml(icon)}</span><span class="bullet-text">${text}</span></div></li>`
      );
      continue;
    }

    // Numbered list
    const numberedMatch = trimmed.match(NUMBERED_RE);
    if (numberedMatch) {
      flushPara();
      flushUl();
      const text = applyInline(numberedMatch[2]);
      olBuffer.push(`<li>${text}</li>`);
      continue;
    }

    // Heading (emoji start, short line, no trailing punctuation)
    if (
      HEADING_EMOJI.test(trimmed) &&
      trimmed.length < 90 &&
      !trimmed.endsWith('.') &&
      !trimmed.endsWith(',')
    ) {
      flushAll();
      parts.push(`<h3>${applyInline(trimmed)}</h3>`);
      continue;
    }

    // Regular paragraph line — accumulate
    flushUl();
    flushOl();
    paraBuffer.push(applyInline(trimmed));
  }

  flushAll();
  return parts.join('\n');
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function CategoryBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: color }}
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
        style={{ backgroundColor: categoryColor }}
      >
        NM
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-900 font-bold text-sm">{post.author}</span>
          <a
            href="https://www.linkedin.com/in/nagarajanmaheswaran/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0A66C2] hover:opacity-75 transition-opacity"
          >
            <Linkedin size={13} strokeWidth={2} />
            Follow
          </a>
        </div>
        <p className="text-gray-400 text-xs leading-snug mt-0.5 truncate max-w-xs sm:max-w-sm">
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
      className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-2 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2"
    >
      <span
        className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold text-white w-fit"
        style={{ backgroundColor: categoryColor }}
      >
        {post.categoryLabel}
      </span>
      <p className="text-slate-800 font-semibold text-sm leading-snug group-hover:text-[#6366f1] transition-colors line-clamp-2">
        {post.title}
      </p>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { allPosts, data, loading } = usePosts();

  const post = allPosts.find(p => p.slug === slug);
  const categoryColor = post && data ? (data.categories[post.category]?.color ?? '#6366f1') : '#6366f1';

  // SEO
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
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-8 h-8 rounded-full border-2 border-[#6366f1] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!post || !data) {
    return <Navigate to="/blog" replace />;
  }

  const youtubeId = post.video ? getYouTubeId(post.video) : null;
  const bodyHtml = formatBody(post.body);

  const related = allPosts
    .filter(p => p.published && !p.draft && p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Inter',sans-serif]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-10 sm:pt-32 sm:pb-16">

        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-slate-500 text-sm hover:text-[#6366f1] transition-colors mb-8 focus:outline-none focus:underline"
        >
          <ArrowLeft size={15} />
          Back to Blog
        </Link>

        {/* Draft banner */}
        {post.draft && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm font-semibold">
            <span>⚠️</span>
            <span>Draft — this post is not yet published</span>
          </div>
        )}

        {/* Header */}
        <div className="mb-7">
          <CategoryBadge label={post.categoryLabel} color={categoryColor} />
          <h1 className="text-3xl font-extrabold text-slate-900 mt-3 mb-5 leading-tight">
            {post.title}
          </h1>
          <AuthorBlock post={post} categoryColor={categoryColor} />
        </div>

        {/* Image */}
        {post.image && (
          <div className="mb-8 rounded-2xl overflow-hidden border border-slate-200">
            <img
              src={post.image}
              alt={post.title}
              className="w-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Video */}
        {youtubeId && (
          <div className="mb-8 rounded-2xl overflow-hidden border border-slate-200 aspect-video">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
              title={post.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Body */}
        <div
          className="post-body bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        {/* LinkedIn CTA */}
        <div className="mb-10 bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Linkedin size={22} className="text-[#0A66C2] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-800 font-semibold text-sm">Originally shared on LinkedIn</p>
              <p className="text-slate-500 text-xs mt-0.5">Join the conversation and share your thoughts.</p>
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

        {/* Related posts */}
        {related.length > 0 && (
          <div>
            <h2 className="text-slate-900 font-bold text-base mb-4">More in this category</h2>
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
    </div>
  );
}
