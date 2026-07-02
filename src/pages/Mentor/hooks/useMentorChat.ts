import { useState, useCallback, useRef } from 'react';
import type { ChatMessage, StudyMode, TokenUsage, SubjectCode } from '../types';
import { MENTOR_FUNCTION_URL, SUPABASE_ANON_KEY } from '../constants';

interface UseMentorChatOptions {
  sessionToken: string;
  subjectCode: SubjectCode | null;
  initialMessages?: ChatMessage[];
  maxApiMessages?: number;
}

export function useMentorChat({
  sessionToken,
  subjectCode,
  initialMessages = [],
  maxApiMessages = 20,
}: UseMentorChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [mode, setMode] = useState<StudyMode>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUsage, setLastUsage] = useState<TokenUsage | null>(null);
  const [totalCost, setTotalCost] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (userText: string, overrideMode?: StudyMode): Promise<ChatMessage | null> => {
      if (!userText.trim()) return null;
      setError(null);

      const userMsg: ChatMessage = { role: 'user', content: userText };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setIsLoading(true);

      abortRef.current = new AbortController();

      // Trim to last N messages for API efficiency
      const apiMessages = updatedMessages.slice(-maxApiMessages);

      try {
        const res = await fetch(MENTOR_FUNCTION_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            Apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            session_token: sessionToken,
            subject_code: subjectCode,
            mode: overrideMode ?? mode,
            messages: apiMessages,
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          const detail = errData.detail ? ` — ${errData.detail}` : '';
          throw new Error((errData.error ?? `Request failed: ${res.status}`) + detail);
        }

        const data = await res.json();
        const assistantMsg: ChatMessage = { role: 'assistant', content: data.message };
        setMessages((prev) => [...prev, assistantMsg]);

        if (data.usage) {
          setLastUsage(data.usage);
          setTotalCost((c) => c + (data.usage.cost_usd_estimate ?? 0));
          setTotalTokens(
            (t) => t + (data.usage.input_tokens ?? 0) + (data.usage.output_tokens ?? 0)
          );
        }
        return assistantMsg;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return null;
        setError((err as Error).message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [messages, mode, sessionToken, subjectCode, maxApiMessages]
  );

  const loadMessages = useCallback((msgs: ChatMessage[]) => {
    setMessages(msgs);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    messages,
    mode,
    setMode,
    isLoading,
    error,
    lastUsage,
    totalCost,
    totalTokens,
    sendMessage,
    loadMessages,
    clearMessages,
    stopGeneration,
  };
}
