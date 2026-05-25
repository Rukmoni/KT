import { useState, useEffect } from 'react';

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

export function usePosts() {
  const [data, setData] = useState<PostsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/posts.json')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load posts');
        return r.json() as Promise<PostsData>;
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const publishedPosts = data?.posts.filter(p => p.published && !p.draft) ?? [];
  const allPosts = data?.posts ?? [];

  return { data, posts: publishedPosts, allPosts, loading, error };
}
