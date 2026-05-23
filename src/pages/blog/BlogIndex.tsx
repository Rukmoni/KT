import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Linkedin } from 'lucide-react';
import { usePosts, type Post, type Category } from '../../hooks/usePosts';

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
  return (
    <article
      className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ borderRadius: 12 }}
    >
      <div className="p-5 flex flex-col flex-1 gap-3">
        <CategoryBadge label={post.categoryLabel} color={categoryColor} />

        <h2 className="text-slate-900 font-bold text-base leading-snug group-hover:text-[#6366f1] transition-colors">
          {post.title}
        </h2>

        <p className="text-slate-500 text-sm leading-relaxed flex-1 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
          <Link
            to={`/blog/${post.slug}`}
            className="text-[#6366f1] text-sm font-semibold hover:underline"
          >
            Read more →
          </Link>
          <a
            href={post.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on LinkedIn"
            className="text-[#0A66C2] hover:opacity-75 transition-opacity"
          >
            <Linkedin size={18} strokeWidth={1.8} />
          </a>
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
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('all')}
        className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors duration-200 ${
          active === 'all'
            ? 'bg-[#6366f1] text-white border-[#6366f1]'
            : 'bg-white text-slate-600 border-slate-200 hover:border-[#6366f1] hover:text-[#6366f1]'
        }`}
      >
        All
      </button>
      {Object.entries(categories).map(([key, cat]) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors duration-200"
            style={{
              backgroundColor: isActive ? cat.color : 'white',
              color: isActive ? 'white' : '#475569',
              borderColor: isActive ? cat.color : '#e2e8f0',
            }}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

export function BlogIndex() {
  const { posts, data, loading, error } = usePosts();
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered =
    activeCategory === 'all'
      ? posts
      : posts.filter(p => p.category === activeCategory);

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
      {/* ── Hero ───────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 sm:pt-32 sm:pb-20">
          <p className="text-[#6366f1] text-sm font-semibold uppercase tracking-widest mb-3">
            Blog
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Insights &amp; Ideas
          </h1>
          <p className="text-slate-500 text-lg max-w-xl">
            Perspectives on delivery leadership, Agile transformation, and AI from 25 years in the field.
          </p>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter bar */}
        <div className="mb-8">
          <FilterBar
            categories={data.categories}
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-20">No posts in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
