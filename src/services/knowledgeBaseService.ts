import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

export interface KnowledgeBaseRecord {
  id: string;
  content: string;
  filename: string;
  word_count: number;
  updated_at: string;
}

export async function fetchKnowledgeBase(): Promise<KnowledgeBaseRecord | null> {
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .eq('id', 'default')
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch knowledge base:', error.message);
    return null;
  }
  return data;
}

export async function saveKnowledgeBase(content: string, filename: string): Promise<boolean> {
  const word_count = content.trim().split(/\s+/).filter(Boolean).length;

  const { error } = await supabase
    .from('knowledge_base')
    .upsert({
      id: 'default',
      content,
      filename,
      word_count,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Failed to save knowledge base:', error.message);
    return false;
  }
  return true;
}
