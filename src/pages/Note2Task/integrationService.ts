import type { TestResult } from './mockServices';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export interface ZoomTestConfig {
  clientId: string;
  clientSecret: string;
  accountId: string;
  webhookSecret?: string;
}

export interface JiraTestConfig {
  siteUrl: string;
  email: string;
  apiToken: string;
  projectKey: string;
}

export interface SlackTestConfig {
  botToken?: string;
  webhookUrl?: string;
  defaultChannel?: string;
  useWebhook: boolean;
}

export interface LiveMeeting {
  id: string;
  title: string;
  host: string;
  attendees: string[];
  date: string;
  duration: number;
  source: 'zoom_api';
  status: 'transcript_fetched';
  jiraCount?: number;
  recordingId?: string;
}

export interface FetchResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export async function fetchZoomMeetings(config: ZoomTestConfig): Promise<FetchResult<LiveMeeting[]>> {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/zoom-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ action: 'list_meetings', config }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Server error (HTTP ${res.status}): ${text}` };
    }
    const json = await res.json();
    return json;
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function fetchZoomTranscript(config: ZoomTestConfig, recordingId: string): Promise<FetchResult<string>> {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/zoom-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ action: 'get_transcript', config, recordingId }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Server error (HTTP ${res.status}): ${text}` };
    }
    const json = await res.json();
    return json;
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function testConnection(
  type: 'zoom' | 'jira' | 'slack',
  testType: string,
  config: ZoomTestConfig | JiraTestConfig | SlackTestConfig
): Promise<TestResult> {
  const start = Date.now();
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/test-integration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ type, testType, config }),
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        passed: false,
        message: `Server error (HTTP ${res.status}): ${text}`,
        latencyMs: Date.now() - start,
        error: text,
      };
    }

    return await res.json() as TestResult;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      passed: false,
      message: `Network error: ${msg}`,
      latencyMs: Date.now() - start,
      error: msg,
    };
  }
}
