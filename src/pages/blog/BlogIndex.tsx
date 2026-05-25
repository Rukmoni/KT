import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Search } from 'lucide-react';
import { usePosts, type Post, type Category } from '../../hooks/usePosts';

function cleanExcerpt(text: string): string {
  return text
    .replace(/\n/g, ' ')
    .replace(/^[🚀💡📌🔥✨🎯🔎📘🤖⚡🚨🎉📢🏆🌟⭐🎓🌱💎📈]+\s*/u, '')
    .replace(/[•✔✅☑→👉►▸◆▶🔸🔹🔶]\s*/gu, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/(#\w+)/g, '')
    .trim()
    .slice(0, 180);
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

function PostCard({ post, categoryColor }: { post: Post; categoryColor: string }) {
  const hasImage = Boolean(post.image);

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ background: '#0f172a', borderColor: 'rgba(255,255,255,0.07)' }}
    >
      {hasImage ? (
        <div className="h-44 overflow-hidden flex-shrink-0">
          <img
            src={post.image!}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className="h-1.5 w-full flex-shrink-0"
          style={{ background: `linear-gradient(90deg, ${categoryColor}, transparent)` }}
        />
      )}

      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <CategoryBadge label={post.categoryLabel} color={categoryColor} />
          <a
            href={post.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View "${post.title}" on LinkedIn`}
            className="flex-shrink-0 transition-opacity hover:opacity-70 mt-0.5"
            style={{ color: '#0A66C2' }}
          >
            <Linkedin size={16} strokeWidth={1.8} />
          </a>
        </div>

        <h2
          className="font-bold text-base leading-snug line-clamp-2"
          style={{ color: '#f1f5f9' }}
        >
          {post.title}
        </h2>

        <p className="text-sm leading-relaxed flex-1 line-clamp-3" style={{ color: '#94a3b8' }}>
          {cleanExcerpt(post.excerpt || post.body)}
        </p>

        <div className="pt-3 mt-auto border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <Link
            to={`/blog/${post.slug}`}
            className="text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ color: categoryColor }}
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
          className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 whitespace-nowrap"
          style={{
            background: active === 'all' ? '#f1f5f9' : 'transparent',
            color: active === 'all' ? '#020617' : '#64748b',
            borderColor: active === 'all' ? '#f1f5f9' : 'rgba(255,255,255,0.1)',
          }}
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
                background: isActive ? cat.color : 'transparent',
                color: isActive ? '#fff' : '#64748b',
                borderColor: isActive ? cat.color : 'rgba(255,255,255,0.1)',
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

export function BlogIndex() {
  const { posts, data, loading, error } = usePosts();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const sorted = [...posts].sort((a, b) => b.id - a.id);

  const filtered = sorted.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: '#6366f133', borderTopColor: '#6366f1' }}
        />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <p style={{ color: '#64748b' }} className="text-sm">Could not load posts.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-['Inter',sans-serif]" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* Hero */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 sm:pt-32 sm:pb-14 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-5 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            NM
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3" style={{ color: '#f1f5f9' }}>
            Insights &amp; Ideas
          </h1>
          <p className="text-lg mb-4" style={{ color: '#94a3b8' }}>
            Thoughts on AI, Project Management, Agile Delivery, and Leadership
          </p>
          <p className="text-sm" style={{ color: '#64748b' }}>
            by{' '}
            <a
              href="https://www.linkedin.com/in/nagarajanmaheswaran/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold transition-colors hover:opacity-80"
              style={{ color: '#cbd5e1' }}
            >
              Nagarajan Maheswaran
            </a>
            {' · '}
            <span style={{ color: '#475569' }}>PMP® PSM I CSPO®</span>
          </p>

          {/* Search */}
          <div className="relative mt-7 max-w-md mx-auto">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-1"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f1f5f9',
              }}
            />
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div
        className="sticky z-20"
        style={{
          top: '72px',
          background: 'rgba(2,6,23,0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <FilterBar categories={data.categories} active={activeCategory} onChange={setActiveCategory} />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-semibold mb-1" style={{ color: '#cbd5e1' }}>No posts found</p>
            <p className="text-sm" style={{ color: '#475569' }}>Try a different filter or search term.</p>
            <button
              onClick={() => { setActiveCategory('all'); setSearch(''); }}
              className="mt-6 text-sm font-semibold hover:opacity-80 transition-opacity"
              style={{ color: '#6366f1' }}
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
