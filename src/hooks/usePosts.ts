import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Category {
  label: string;
  color: string;
  description: string;
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  excerpt: string;
  body: string;
  linkedinUrl: string;
  author: string;
  authorTitle: string;
  tags: string[];
  image: string | null;
  video: string | null;
  published: boolean;
  draft: boolean;
}

export interface PostsData {
  categories: Record<string, Category>;
  posts: Post[];
}

export const BLOG_CATEGORIES: Record<string, Category> = {
  'ai-strategy':    { label: 'AI Strategy',                 color: '#6366f1', description: 'Enterprise AI adoption, AI ROI, and the future of AI-driven work' },
  'ai-tools':       { label: 'AI Tools and Reviews',        color: '#0ea5e9', description: 'Hands-on reviews of AI platforms, voice agents, and productivity tools' },
  'agile-delivery': { label: 'Agile and DevOps',            color: '#10b981', description: 'Project delivery, Agile methodologies, Scrum practices, and DevOps' },
  'leadership':     { label: 'Leadership',                  color: '#f59e0b', description: 'Team management, stakeholder communication, and senior PM perspectives' },
  'kuvanta':        { label: 'Kuvanta',                     color: '#8b5cf6', description: 'Updates from Kuvanta Tech — AI and mobile app development studio' },
  'consulting':     { label: 'Consulting and Career',       color: '#ec4899', description: 'Consulting services, career milestones, and professional journey' },
  'learning':       { label: 'Learning and Certifications', color: '#14b8a6', description: 'Professional development, certifications, and continuous learning' },
  'milestones':     { label: 'Milestones',                  color: '#f97316', description: 'Community achievements, network milestones, and reflections' },
};

function rowToPost(row: Record<string, unknown>): Post {
  const cat = row.category as string;
  return {
    id:            row.id as number,
    slug:          row.slug as string,
    title:         row.title as string,
    category:      cat,
    categoryLabel: (row.category_label as string) || BLOG_CATEGORIES[cat]?.label || cat,
    excerpt:       row.excerpt as string,
    body:          row.body as string,
    linkedinUrl:   (row.linkedin_url as string) || '',
    author:        row.author as string,
    authorTitle:   row.author_title as string,
    tags:          (row.tags as string[]) || [],
    image:         (row.image as string | null) ?? null,
    video:         (row.video as string | null) ?? null,
    published:     row.published as boolean,
    draft:         row.draft as boolean,
  };
}

export function usePosts() {
  const [data, setData] = useState<PostsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const query = supabase
          .from('blog_posts')
          .select('*')
          .order('id', { ascending: false });

        const { data: rows, error: dbErr } = await query;

        if (dbErr) throw dbErr;

        if (rows && rows.length > 0) {
          const posts = (rows as Record<string, unknown>[]).map(rowToPost);
          if (!cancelled) {
            setData({ categories: BLOG_CATEGORIES, posts });
            setLoading(false);
          }
          return;
        }

        // Fall back to static JSON when DB is empty
        const res = await fetch('/data/posts.json');
        if (!res.ok) throw new Error('Failed to load posts');
        const json = await res.json() as PostsData;
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Unknown error');
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const publishedPosts = data?.posts.filter(p => p.published && !p.draft) ?? [];
  const allPosts       = data?.posts ?? [];

  return { data, posts: publishedPosts, allPosts, loading, error };
}
