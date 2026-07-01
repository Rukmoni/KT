export type SubjectCode = '042' | '043' | '041' | '083' | '301';

export type StudyMode =
  | 'chat'
  | 'teach'
  | 'test'
  | 'flashcard'
  | 'rapidfire'
  | 'revise'
  | 'strengthen'
  | 'pyq'
  | 'research'
  | 'innovation'
  | 'grade_long_answer';

export interface Subject {
  code: SubjectCode;
  name: string;
  shortName: string;
  theoryMarks: number;
  practicalMarks: number;
  color: string;
  bgColor: string;
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface TokenUsage {
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  cache_creation_tokens: number;
  cache_hit: boolean;
  cost_usd_estimate: number;
}

export interface MentorResponse {
  message: string;
  model: string;
  usage: TokenUsage;
}

export interface SessionState {
  sessionToken: string;
  subjectCode: SubjectCode | null;
  mode: StudyMode;
  messages: ChatMessage[];
  totalTokensUsed: number;
  totalCostUsd: number;
  sessionStarted: string;
}

export interface ActivityEvent {
  event_type: string;
  subject_code: SubjectCode | null;
  topic?: string;
  score?: number;
  metadata?: Record<string, unknown>;
}
