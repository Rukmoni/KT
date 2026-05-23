import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Linkedin } from 'lucide-react';
import { usePosts, type Post, type Category } from '../../hooks/usePosts';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

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

function AuthorBlock({
  author,
  authorTitle,
  linkedinUrl,
}: {
  author: string;
  authorTitle: string;
  linkedinUrl: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-[#6366f1] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
        NM
      </div>
      <div className="min-w-0">
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-900 font-semibold text-sm hover:text-[#6366f1] transition-colors"
        >
          {author}
        </a>
        <p className="text-slate-500 text-xs leading-snug mt-0.5 truncate max-w-xs sm:max-w-sm">
          {authorTitle}
        </p>
      </div>
    </div>
  );
}

// ── Body renderer ─────────────────────────────────────────────────────────────

function renderBody(body: string) {
  const lines = body.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed === '') {
      elements.push(<div key={idx} className="h-3" />);
      return;
    }

    // Bullet line: starts with • or -
    if (/^[•\-]\s/.test(trimmed)) {
      elements.push(
        <li key={idx} className="text-slate-700 text-base leading-relaxed list-disc ml-5">
          {renderInline(trimmed.replace(/^[•\-]\s/, ''))}
        </li>
      );
      return;
    }

    elements.push(
      <p key={idx} className="text-slate-700 text-base leading-relaxed">
        {renderInline(trimmed)}
      </p>
    );
  });

  return <div className="flex flex-col gap-1">{elements}</div>;
}

function renderInline(text: string): React.ReactNode[] {
  // Split on #hashtags and bold **text**
  const parts = text.split(/(#\w+|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (/^#\w+$/.test(part)) {
      return (
        <span
          key={i}
          className="inline-block px-1.5 py-0.5 rounded text-xs font-semibold mx-0.5"
          style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}
        >
          {part}
        </span>
      );
    }
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ── Related posts ─────────────────────────────────────────────────────────────

function RelatedCard({
  post,
  categoryColor,
}: {
  post: Post;
  categoryColor: string;
}) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-2 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group"
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
  const { posts, data, loading } = usePosts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-8 h-8 rounded-full border-2 border-[#6366f1] border-t-transparent animate-spin" />
      </div>
    );
  }

  const post = posts.find(p => p.slug === slug);

  if (!post || !data) {
    return <Navigate to="/blog" replace />;
  }

  const categoryColor = data.categories[post.category]?.color ?? '#6366f1';
  const youtubeId = post.video ? getYouTubeId(post.video) : null;

  const related = posts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Inter',sans-serif]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* ── Back link ── */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-slate-500 text-sm hover:text-[#6366f1] transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          Back to Insights
        </Link>

        {/* ── Header ── */}
        <div className="mb-6">
          <CategoryBadge label={post.categoryLabel} color={categoryColor} />
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 mb-5 leading-tight">
            {post.title}
          </h1>
          <AuthorBlock
            author={post.author}
            authorTitle={post.authorTitle}
            linkedinUrl={post.linkedinUrl}
          />
        </div>

        {/* ── Image ── */}
        {post.image && (
          <div className="mb-8 rounded-xl overflow-hidden border border-slate-200">
            <img
              src={post.image}
              alt={post.title}
              className="w-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* ── Video ── */}
        {youtubeId && (
          <div className="mb-8 rounded-xl overflow-hidden border border-slate-200 aspect-video">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
              title={post.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* ── Body ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 mb-8">
          {renderBody(post.body)}
        </div>

        {/* ── LinkedIn attribution ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <Linkedin size={22} className="text-[#0A66C2] flex-shrink-0" />
            <div>
              <p className="text-slate-800 font-semibold text-sm">Originally posted on LinkedIn</p>
              <p className="text-slate-500 text-xs mt-0.5">{post.author}</p>
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

        {/* ── Related posts ── */}
        {related.length > 0 && (
          <div>
            <h2 className="text-slate-900 font-bold text-lg mb-4">More in {post.categoryLabel}</h2>
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
