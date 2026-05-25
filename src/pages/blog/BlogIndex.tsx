import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Linkedin } from 'lucide-react';
import { usePosts, type Post, type Category } from '../../hooks/usePosts';

// ── Helpers ───────────────────────────────────────────────────────────────────

function cleanExcerpt(text: string): string {
  return text
    .replace(/\n/g, ' ')
    .replace(/^[🚀💡📌🔥✨🎯🔎📘🤖⚡🚨🎉📢🏆🌟⭐🎓🌱💎📈]+\s*/u, '')
    .replace(/[•✔✅☑→👉►▸◆▶🔸🔹🔶]\s*/gu, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/(#\w+)/g, '')
    .trim()
    .slice(0, 200);
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

function PostCard({ post, categoryColor }: { post: Post; categoryColor: string }) {
  const hasMedia = post.image || post.video;

  return (
    <article className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden group transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg focus-within:ring-2 focus-within:ring-[#6366f1] focus-within:ring-offset-2">
      {/* Card media header */}
      {post.image && (
        <div className="h-44 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      {!post.image && post.video && (
        <div className="h-44 bg-slate-100 flex items-center justify-center flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-500 ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`p-5 flex flex-col flex-1 gap-3 ${!hasMedia ? '' : ''}`}>
        <div className="flex items-start justify-between gap-2">
          <CategoryBadge label={post.categoryLabel} color={categoryColor} />
          <a
            href={post.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View "${post.title}" on LinkedIn`}
            className="flex-shrink-0 text-[#0A66C2] hover:opacity-75 transition-opacity mt-0.5"
            tabIndex={0}
          >
            <Linkedin size={17} strokeWidth={1.8} />
          </a>
        </div>

        <h2 className="text-slate-900 font-bold text-base leading-snug group-hover:text-[#6366f1] transition-colors line-clamp-2">
          {post.title}
        </h2>

        <p className="text-slate-500 text-sm leading-relaxed flex-1 line-clamp-3">
          {cleanExcerpt(post.excerpt || post.body)}
        </p>

        <div className="pt-2 border-t border-gray-100 mt-auto">
          <Link
            to={`/blog/${post.slug}`}
            className="text-[#6366f1] text-sm font-semibold hover:underline focus:outline-none focus:underline"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}

function FilterBar({
  categories,
  active,
  onChange,
}: {
  categories: Record<string, Category>;
  active: string;
  onChange: (cat: string) => void;
}) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
      <div className="flex gap-2 min-w-max sm:flex-wrap sm:min-w-0">
        <button
          aria-pressed={active === 'all'}
          onClick={() => onChange('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors duration-200 whitespace-nowrap ${
            active === 'all'
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
          }`}
        >
          All Posts
        </button>
        {Object.entries(categories).map(([key, cat]) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              aria-pressed={isActive}
              onClick={() => onChange(key)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 whitespace-nowrap"
              style={{
                backgroundColor: isActive ? cat.color : 'white',
                color: isActive ? 'white' : '#4b5563',
                borderColor: isActive ? cat.color : '#e5e7eb',
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function BlogIndex() {
  const { posts, data, loading, error } = usePosts();
  const [activeCategory, setActiveCategory] = useState('all');

  const sortedPosts = [...posts].sort((a, b) => b.id - a.id);

  const filtered =
    activeCategory === 'all'
      ? sortedPosts
      : sortedPosts.filter(p => p.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-8 h-8 rounded-full border-2 border-[#6366f1] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <p className="text-slate-500 text-sm">Could not load posts.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Inter',sans-serif]">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 sm:pt-32 sm:pb-16 text-center">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-[#6366f1] flex items-center justify-center text-white text-xl font-bold mx-auto mb-5 shadow-md">
            NM
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Insights &amp; Ideas
          </h1>
          <p className="text-lg text-gray-500 mb-4">
            Thoughts on AI, Project Management, Agile Delivery, and Leadership
          </p>
          <p className="text-sm text-slate-500">
            by{' '}
            <a
              href="https://www.linkedin.com/in/nagarajanmaheswaran/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-700 hover:text-[#6366f1] transition-colors"
            >
              Nagarajan Maheswaran
            </a>
            {' · '}
            <span className="text-slate-400">PMP® PSM I CSPO®</span>
          </p>
        </div>
      </div>

      {/* ── Filter bar (sticky on desktop) ──────────────────────── */}
      <div className="bg-white border-b border-slate-100 sticky top-[72px] z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <FilterBar
            categories={data.categories}
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-slate-600 font-semibold mb-1">No posts in this category yet</p>
            <p className="text-slate-400 text-sm">Check back soon — more content is on its way.</p>
            <button
              onClick={() => setActiveCategory('all')}
              className="mt-6 text-[#6366f1] text-sm font-semibold hover:underline"
            >
              ← View all posts
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(post => (
              <PostCard
                key={post.id}
                post={post}
                categoryColor={data.categories[post.category]?.color ?? '#6366f1'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
