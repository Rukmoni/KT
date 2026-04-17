import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ZoomConfig {
  clientId: string;
  clientSecret: string;
  accountId: string;
}

interface LiveMeeting {
  id: string;
  title: string;
  host: string;
  attendees: string[];
  date: string;
  duration: number;
  source: "zoom_api";
  status: "transcript_fetched";
  jiraCount?: number;
  recordingId?: string;
}

async function getAccessToken(config: ZoomConfig): Promise<{ token: string; error?: string }> {
  const credentials = btoa(`${config.clientId}:${config.clientSecret}`);
  const res = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${config.accountId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  if (!res.ok) {
    const body = await res.json();
    return { token: "", error: body.reason || body.error_description || `Auth failed (HTTP ${res.status})` };
  }
  const body = await res.json();
  return { token: body.access_token };
}

async function listMeetings(config: ZoomConfig): Promise<{ ok: boolean; data?: LiveMeeting[]; error?: string }> {
  const { token, error } = await getAccessToken(config);
  if (error) return { ok: false, error };

  const recRes = await fetch(
    "https://api.zoom.us/v2/users/me/recordings?page_size=20&from=" +
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!recRes.ok) {
    const body = await recRes.json();
    return { ok: false, error: body.message || `Failed to fetch recordings (HTTP ${recRes.status})` };
  }

  const recData = await recRes.json();
  const meetings: LiveMeeting[] = (recData.meetings ?? []).map((m: {
    uuid: string;
    topic: string;
    host_email: string;
    start_time: string;
    duration: number;
    recording_files?: Array<{ file_type: string; id: string }>;
  }) => ({
    id: m.uuid,
    title: m.topic || "Untitled Meeting",
    host: m.host_email || "Unknown",
    attendees: [],
    date: m.start_time,
    duration: m.duration ?? 0,
    source: "zoom_api" as const,
    status: "transcript_fetched" as const,
    recordingId: m.recording_files?.find((f) => f.file_type === "TRANSCRIPT")?.id ?? m.uuid,
  }));

  return { ok: true, data: meetings };
}

async function getTranscript(config: ZoomConfig, recordingId: string): Promise<{ ok: boolean; data?: string; error?: string }> {
  const { token, error } = await getAccessToken(config);
  if (error) return { ok: false, error };

  const recRes = await fetch(
    `https://api.zoom.us/v2/users/me/recordings?page_size=20&from=` +
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!recRes.ok) {
    return { ok: false, error: "Failed to retrieve recordings list" };
  }

  const recData = await recRes.json();
  let transcriptDownloadUrl: string | null = null;

  for (const meeting of recData.meetings ?? []) {
    if (meeting.uuid === recordingId || meeting.id === recordingId) {
      const transcriptFile = (meeting.recording_files ?? []).find(
        (f: { file_type: string; download_url: string }) => f.file_type === "TRANSCRIPT"
      );
      if (transcriptFile) {
        transcriptDownloadUrl = transcriptFile.download_url;
      }
      break;
    }
    const transcriptFile = (meeting.recording_files ?? []).find(
      (f: { id: string; file_type: string; download_url: string }) =>
        f.id === recordingId && f.file_type === "TRANSCRIPT"
    );
    if (transcriptFile) {
      transcriptDownloadUrl = transcriptFile.download_url;
      break;
    }
  }

  if (!transcriptDownloadUrl) {
    return { ok: false, error: "No VTT transcript found for this recording. Make sure cloud recording with transcription is enabled." };
  }

  const dlRes = await fetch(`${transcriptDownloadUrl}?access_token=${token}`);
  if (!dlRes.ok) {
    return { ok: false, error: `Failed to download transcript (HTTP ${dlRes.status})` };
  }

  const vtt = await dlRes.text();
  const lines = vtt.split("\n");
  const textLines: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === "WEBVTT" || /^\d{2}:\d{2}/.test(trimmed) || /^-->/.test(trimmed)) continue;
    textLines.push(trimmed);
  }

  return { ok: true, data: textLines.join("\n") };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { action, config, recordingId } = await req.json();

    let result;
    if (action === "list_meetings") {
      result = await listMeetings(config);
    } else if (action === "get_transcript") {
      result = await getTranscript(config, recordingId);
    } else {
      result = { ok: false, error: "Unknown action" };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ ok: false, error: `Server error: ${msg}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
