import { supabase } from '../../lib/supabase';
import type { SeoKeyword, SeoAction, SeoCheck } from './types';

export async function fetchKeywords(): Promise<SeoKeyword[]> {
  const { data } = await supabase.from('seo_keywords').select('*').order('monthly_volume', { ascending: false });
  return (data ?? []) as SeoKeyword[];
}

export async function updateKeywordPosition(id: string, position: number | null, previousPosition: number | null): Promise<void> {
  await supabase.from('seo_keywords').update({ position, previous_position: previousPosition, last_checked: new Date().toISOString() }).eq('id', id);
}

export async function fetchActions(): Promise<SeoAction[]> {
  const { data } = await supabase.from('seo_actions').select('*').order('priority').order('created_at');
  return (data ?? []) as SeoAction[];
}

export async function toggleAction(id: string, completed: boolean): Promise<void> {
  await supabase.from('seo_actions').update({ is_completed: completed, completed_at: completed ? new Date().toISOString() : null }).eq('id', id);
}

export async function fetchChecks(): Promise<SeoCheck[]> {
  const { data } = await supabase.from('seo_checks').select('*').order('status').order('check_name');
  return (data ?? []) as SeoCheck[];
}

export async function updateCheckStatus(id: string, status: SeoCheck['status'], detail?: string): Promise<void> {
  await supabase.from('seo_checks').update({ status, detail: detail ?? undefined, checked_at: new Date().toISOString() }).eq('id', id);
}
