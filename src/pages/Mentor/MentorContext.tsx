import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './constants';
import type { Conversation } from './types';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface MentorContextValue {
  appUserId: string;
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  refreshConversations: () => void;
  openSidebar: () => void;
}

const MentorContext = createContext<MentorContextValue | null>(null);

export function useMentorContext() {
  const ctx = useContext(MentorContext);
  if (!ctx) throw new Error('useMentorContext must be used within MentorProvider');
  return ctx;
}

interface MentorProviderProps {
  appUserId: string;
  onOpenSidebar: () => void;
  children: ReactNode;
}

export function MentorProvider({ appUserId, onOpenSidebar, children }: MentorProviderProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const refreshConversations = useCallback(async () => {
    const { data } = await supabase
      .from('mentor_conversations')
      .select('*')
      .eq('session_token', appUserId)
      .order('updated_at', { ascending: false });
    setConversations(data ?? []);
  }, [appUserId]);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  return (
    <MentorContext.Provider
      value={{
        appUserId,
        conversations,
        activeConversationId,
        setActiveConversationId,
        refreshConversations,
        openSidebar: onOpenSidebar,
      }}
    >
      {children}
    </MentorContext.Provider>
  );
}
