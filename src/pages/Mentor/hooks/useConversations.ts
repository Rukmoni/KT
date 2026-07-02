import { useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';
import type { Conversation, ChatMessage } from '../types';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function useConversations(sessionToken: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('mentor_conversations')
      .select('*')
      .eq('session_token', sessionToken)
      .order('updated_at', { ascending: false });
    setConversations(data ?? []);
    setLoading(false);
  }, [sessionToken]);

  const createConversation = useCallback(
    async (title: string, subjectCode: string | null, mode: string): Promise<string | null> => {
      const { data, error } = await supabase
        .from('mentor_conversations')
        .insert({ session_token: sessionToken, title, subject_code: subjectCode, last_mode: mode })
        .select('id')
        .single();
      if (error || !data) return null;
      return data.id;
    },
    [sessionToken]
  );

  const updateConversation = useCallback(
    async (id: string, updates: Partial<Pick<Conversation, 'title' | 'last_mode' | 'message_count'>>) => {
      await supabase
        .from('mentor_conversations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
    },
    []
  );

  const deleteConversation = useCallback(async (id: string) => {
    await supabase.from('mentor_conversations').delete().eq('id', id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const saveMessages = useCallback(async (conversationId: string, msgs: ChatMessage[]) => {
    if (!msgs.length) return;
    await supabase.from('mentor_messages').insert(
      msgs.map((m) => ({ conversation_id: conversationId, role: m.role, content: m.content }))
    );
  }, []);

  const loadMessages = useCallback(async (conversationId: string): Promise<ChatMessage[]> => {
    const { data } = await supabase
      .from('mentor_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    return (data ?? []) as ChatMessage[];
  }, []);

  return {
    conversations,
    loading,
    loadConversations,
    createConversation,
    updateConversation,
    deleteConversation,
    saveMessages,
    loadMessages,
  };
}
