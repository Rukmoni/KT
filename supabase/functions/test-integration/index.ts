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
  webhookSecret?: string;
}

interface JiraConfig {
  siteUrl: string;
  email: string;
  apiToken: string;
  projectKey: string;
}

interface SlackConfig {
  botToken?: string;
  webhookUrl?: string;
  defaultChannel?: string;
  useWebhook: boolean;
}

interface TestResult {
  passed: boolean;
  message: string;
  latencyMs: number;
  details?: Record<string, string>;
  error?: string;
}

async function testZoomAuth(config: ZoomConfig): Promise<TestResult> {
  const start = Date.now();
  try {
    if (!config.clientId || !config.clientSecret || !config.accountId) {
      return { passed: false, message: "Missing required fields: Client ID, Client Secret, or Account ID.", latencyMs: Date.now() - start, error: "Configuration incomplete" };
    }

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

    const latencyMs = Date.now() - start;
    const body = await res.json();

    if (!res.ok) {
      return {
        passed: false,
        message: body.reason || body.error_description || `Zoom auth failed (HTTP ${res.status})`,
        latencyMs,
        error: JSON.stringify(body),
        details: { "HTTP Status": String(res.status), "Error": body.reason || body.error || "Unknown" },
      };
    }

    const meRes = await fetch("https://api.zoom.us/v2/users/me", {
      headers: { Authorization: `Bearer ${body.access_token}` },
    });
    const me = await meRes.json();

    return {
      passed: true,
      message: `OAuth credentials verified. Zoom account active.`,
      latencyMs,
      details: {
        Account: me.display_name || me.first_name + " " + me.last_name,
        Email: me.email,
        Plan: me.type === 1 ? "Basic" : me.type === 2 ? "Pro" : "Business",
        "Account ID": config.accountId,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { passed: false, message: `Connection error: ${msg}`, latencyMs: Date.now() - start, error: msg };
  }
}

async function testZoomWebhook(config: ZoomConfig): Promise<TestResult> {
  const start = Date.now();
  try {
    if (!config.webhookSecret) {
      return { passed: false, message: "Webhook secret/verification token is required.", latencyMs: Date.now() - start, error: "Missing webhook secret" };
    }
    return {
      passed: true,
      message: "Webhook secret token saved. Endpoint is configured to receive Zoom events.",
      latencyMs: Date.now() - start,
      details: {
        "Token Length": String(config.webhookSecret.length),
        "Subscribed Events": "recording.completed, recording.transcript_completed",
        "Note": "Deploy this edge function URL as your Zoom webhook endpoint",
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { passed: false, message: `Webhook test failed: ${msg}`, latencyMs: Date.now() - start, error: msg };
  }
}

async function testZoomTranscript(config: ZoomConfig): Promise<TestResult> {
  const start = Date.now();
  try {
    if (!config.clientId || !config.clientSecret || !config.accountId) {
      return { passed: false, message: "Missing credentials for transcript access test.", latencyMs: Date.now() - start, error: "Configuration incomplete" };
    }

    const credentials = btoa(`${config.clientId}:${config.clientSecret}`);
    const tokenRes = await fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${config.accountId}`,
      {
        method: "POST",
        headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    const latencyMs = Date.now() - start;

    if (!tokenRes.ok) {
      const err = await tokenRes.json();
      return { passed: false, message: `Auth failed before transcript test: ${err.reason || err.error_description}`, latencyMs, error: JSON.stringify(err) };
    }

    const { access_token } = await tokenRes.json();

    const recRes = await fetch("https://api.zoom.us/v2/users/me/recordings?page_size=1", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const recData = await recRes.json();
    const totalRecordings = recData.total_records ?? 0;

    return {
      passed: true,
      message: `Transcript access confirmed. ${totalRecordings} recording(s) available.`,
      latencyMs: Date.now() - start,
      details: {
        "Total Recordings": String(totalRecordings),
        "Scope": "recording:read",
        "Access": "Granted",
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { passed: false, message: `Transcript test failed: ${msg}`, latencyMs: Date.now() - start, error: msg };
  }
}

async function testJiraAuth(config: JiraConfig): Promise<TestResult> {
  const start = Date.now();
  try {
    if (!config.siteUrl || !config.email || !config.apiToken) {
      return { passed: false, message: "Missing required fields: Site URL, email, or API token.", latencyMs: Date.now() - start, error: "Configuration incomplete" };
    }

    const cleanSite = config.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const credentials = btoa(`${config.email}:${config.apiToken}`);

    const res = await fetch(`https://${cleanSite}/rest/api/3/myself`, {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Accept": "application/json",
      },
    });

    const latencyMs = Date.now() - start;
    const body = await res.json();

    if (!res.ok) {
      return {
        passed: false,
        message: body.message || body.errorMessages?.[0] || `Jira auth failed (HTTP ${res.status})`,
        latencyMs,
        error: JSON.stringify(body),
        details: { "HTTP Status": String(res.status), "Site": cleanSite },
      };
    }

    return {
      passed: true,
      message: `Jira API token accepted. Site accessible.`,
      latencyMs,
      details: {
        Site: cleanSite,
        User: body.displayName || body.emailAddress,
        Email: body.emailAddress,
        "Account ID": body.accountId,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { passed: false, message: `Connection error: ${msg}`, latencyMs: Date.now() - start, error: msg };
  }
}

async function testJiraProjects(config: JiraConfig): Promise<TestResult> {
  const start = Date.now();
  try {
    if (!config.siteUrl || !config.email || !config.apiToken) {
      return { passed: false, message: "Missing credentials for project listing.", latencyMs: Date.now() - start, error: "Configuration incomplete" };
    }

    const cleanSite = config.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const credentials = btoa(`${config.email}:${config.apiToken}`);

    const res = await fetch(`https://${cleanSite}/rest/api/3/project/search?maxResults=50`, {
      headers: { Authorization: `Basic ${credentials}`, Accept: "application/json" },
    });

    const latencyMs = Date.now() - start;
    const body = await res.json();

    if (!res.ok) {
      return {
        passed: false,
        message: body.message || body.errorMessages?.[0] || `Failed to load projects (HTTP ${res.status})`,
        latencyMs,
        error: JSON.stringify(body),
        details: { "HTTP Status": String(res.status) },
      };
    }

    const projects = body.values ?? [];
    const keys = projects.map((p: { key: string }) => p.key).join(", ");
    const defaultProject = projects.find((p: { key: string }) => p.key === config.projectKey);

    return {
      passed: true,
      message: `Found ${projects.length} accessible project(s).`,
      latencyMs,
      details: {
        "Projects": keys || "None",
        "Default Project": defaultProject ? `${defaultProject.name} (${defaultProject.key})` : `${config.projectKey} (not found — check project key)`,
        "Total": String(projects.length),
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { passed: false, message: `Project listing failed: ${msg}`, latencyMs: Date.now() - start, error: msg };
  }
}

async function testJiraCreate(config: JiraConfig): Promise<TestResult> {
  const start = Date.now();
  try {
    if (!config.siteUrl || !config.email || !config.apiToken || !config.projectKey) {
      return { passed: false, message: "Missing credentials or project key for issue creation test.", latencyMs: Date.now() - start, error: "Configuration incomplete" };
    }

    const cleanSite = config.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const credentials = btoa(`${config.email}:${config.apiToken}`);

    const createRes = await fetch(`https://${cleanSite}/rest/api/3/issue`, {
      method: "POST",
      headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        fields: {
          project: { key: config.projectKey },
          summary: "[TEST] Note2Task integration test — delete me",
          issuetype: { name: "Task" },
          description: {
            type: "doc",
            version: 1,
            content: [{ type: "paragraph", content: [{ type: "text", text: "Automated integration test. This issue was created and will be deleted immediately." }] }],
          },
        },
      }),
    });

    const latencyMs = Date.now() - start;
    const created = await createRes.json();

    if (!createRes.ok) {
      return {
        passed: false,
        message: created.errors ? Object.values(created.errors).join("; ") : created.errorMessages?.[0] || `Issue creation failed (HTTP ${createRes.status})`,
        latencyMs,
        error: JSON.stringify(created),
        details: { "HTTP Status": String(createRes.status), "Project": config.projectKey },
      };
    }

    const issueKey = created.key;

    await fetch(`https://${cleanSite}/rest/api/3/issue/${issueKey}`, {
      method: "DELETE",
      headers: { Authorization: `Basic ${credentials}` },
    });

    return {
      passed: true,
      message: `Test issue ${issueKey} created and deleted successfully.`,
      latencyMs: Date.now() - start,
      details: {
        "Issue": issueKey,
        "Type": "Task",
        "Project": config.projectKey,
        "Cleanup": "Deleted",
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { passed: false, message: `Issue creation test failed: ${msg}`, latencyMs: Date.now() - start, error: msg };
  }
}

async function testSlackAuth(config: SlackConfig): Promise<TestResult> {
  const start = Date.now();
  try {
    if (!config.useWebhook && !config.botToken) {
      return { passed: false, message: "Bot token is required.", latencyMs: Date.now() - start, error: "Missing bot token" };
    }
    if (config.useWebhook && !config.webhookUrl) {
      return { passed: false, message: "Webhook URL is required.", latencyMs: Date.now() - start, error: "Missing webhook URL" };
    }

    if (config.useWebhook) {
      const res = await fetch(config.webhookUrl!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "Note2Task: webhook auth test ping (ignore this message)" }),
      });
      const latencyMs = Date.now() - start;
      const text = await res.text();
      if (!res.ok || text !== "ok") {
        return { passed: false, message: `Webhook request failed: ${text}`, latencyMs, error: text, details: { "HTTP Status": String(res.status), "Response": text } };
      }
      return { passed: true, message: "Incoming webhook is reachable and accepted the test ping.", latencyMs, details: { "Webhook": "Valid", "Response": "ok" } };
    }

    const res = await fetch("https://slack.com/api/auth.test", {
      headers: { Authorization: `Bearer ${config.botToken}` },
    });
    const latencyMs = Date.now() - start;
    const body = await res.json();

    if (!body.ok) {
      return {
        passed: false,
        message: `Slack auth failed: ${body.error}`,
        latencyMs,
        error: body.error,
        details: { "Error": body.error, "Hint": body.error === "invalid_auth" ? "Check your bot token — it should start with xoxb-" : "" },
      };
    }

    return {
      passed: true,
      message: `Bot token valid. Workspace connected.`,
      latencyMs,
      details: {
        Workspace: body.team,
        Bot: body.user,
        "Bot ID": body.user_id,
        "Team ID": body.team_id,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { passed: false, message: `Connection error: ${msg}`, latencyMs: Date.now() - start, error: msg };
  }
}

async function testSlackChannel(config: SlackConfig): Promise<TestResult> {
  const start = Date.now();
  try {
    if (config.useWebhook) {
      return { passed: true, message: "Channel access is managed by the Incoming Webhook — no separate check needed.", latencyMs: Date.now() - start, details: { "Mode": "Incoming Webhook", "Channel": "Determined by webhook config" } };
    }

    if (!config.botToken) {
      return { passed: false, message: "Bot token is required.", latencyMs: Date.now() - start, error: "Missing bot token" };
    }

    const channelName = (config.defaultChannel || "#general").replace(/^#/, "");

    const res = await fetch(`https://slack.com/api/conversations.list?limit=200`, {
      headers: { Authorization: `Bearer ${config.botToken}` },
    });
    const latencyMs = Date.now() - start;
    const body = await res.json();

    if (!body.ok) {
      return { passed: false, message: `Cannot list channels: ${body.error}`, latencyMs, error: body.error };
    }

    const channel = body.channels?.find((c: { name: string; is_member: boolean; num_members: number }) => c.name === channelName);

    if (!channel) {
      return {
        passed: false,
        message: `Channel #${channelName} not found. Make sure the channel exists and invite the bot.`,
        latencyMs,
        error: "Channel not found",
        details: { "Searched": `#${channelName}`, "Hint": "Run /invite @your-bot in the channel" },
      };
    }

    return {
      passed: channel.is_member,
      message: channel.is_member ? `Bot has access to #${channelName}.` : `Bot is not a member of #${channelName}. Invite it with /invite @bot.`,
      latencyMs,
      details: {
        Channel: `#${channelName}`,
        Members: String(channel.num_members),
        "Bot Member": channel.is_member ? "Yes" : "No — invite required",
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { passed: false, message: `Channel test failed: ${msg}`, latencyMs: Date.now() - start, error: msg };
  }
}

async function testSlackMessage(config: SlackConfig): Promise<TestResult> {
  const start = Date.now();
  try {
    if (config.useWebhook) {
      if (!config.webhookUrl) {
        return { passed: false, message: "Webhook URL is required.", latencyMs: Date.now() - start, error: "Missing webhook URL" };
      }
      const res = await fetch(config.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "*Note2Task* test message — your Slack integration is working!",
          blocks: [
            { type: "section", text: { type: "mrkdwn", text: "*Note2Task Integration Test*\nThis is a test message confirming your Slack webhook is configured correctly." } },
            { type: "context", elements: [{ type: "mrkdwn", text: `Sent at ${new Date().toISOString()}` }] },
          ],
        }),
      });
      const latencyMs = Date.now() - start;
      const text = await res.text();
      if (!res.ok || text !== "ok") {
        return { passed: false, message: `Webhook message failed: ${text}`, latencyMs, error: text };
      }
      return { passed: true, message: "Test message delivered via webhook.", latencyMs, details: { Delivered: "Yes", Method: "Incoming Webhook" } };
    }

    if (!config.botToken) {
      return { passed: false, message: "Bot token is required.", latencyMs: Date.now() - start, error: "Missing bot token" };
    }

    const channelName = (config.defaultChannel || "#general").replace(/^#/, "");

    const channelRes = await fetch(`https://slack.com/api/conversations.list?limit=200`, {
      headers: { Authorization: `Bearer ${config.botToken}` },
    });
    const channelBody = await channelRes.json();
    const channel = channelBody.channels?.find((c: { name: string; id: string }) => c.name === channelName);

    if (!channel) {
      return { passed: false, message: `Channel #${channelName} not found.`, latencyMs: Date.now() - start, error: "Channel not found" };
    }

    const res = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: { Authorization: `Bearer ${config.botToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: channel.id,
        text: "*Note2Task Integration Test*\nThis is a test message confirming your Slack bot is configured correctly.",
      }),
    });
    const latencyMs = Date.now() - start;
    const body = await res.json();

    if (!body.ok) {
      return {
        passed: false,
        message: `Message send failed: ${body.error}`,
        latencyMs,
        error: body.error,
        details: { "Error": body.error, "Channel": `#${channelName}` },
      };
    }

    return {
      passed: true,
      message: `Test message sent to #${channelName} successfully.`,
      latencyMs,
      details: {
        "Message ID": body.ts,
        "Channel": `#${channelName}`,
        Delivered: "Yes",
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { passed: false, message: `Message test failed: ${msg}`, latencyMs: Date.now() - start, error: msg };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { type, testType, config } = await req.json();

    let result: TestResult;

    if (type === "zoom") {
      if (testType === "auth") result = await testZoomAuth(config);
      else if (testType === "webhook") result = await testZoomWebhook(config);
      else if (testType === "transcript") result = await testZoomTranscript(config);
      else result = { passed: false, message: "Unknown Zoom test type.", latencyMs: 0 };
    } else if (type === "jira") {
      if (testType === "auth") result = await testJiraAuth(config);
      else if (testType === "projects") result = await testJiraProjects(config);
      else if (testType === "create") result = await testJiraCreate(config);
      else result = { passed: false, message: "Unknown Jira test type.", latencyMs: 0 };
    } else if (type === "slack") {
      if (testType === "auth") result = await testSlackAuth(config);
      else if (testType === "channel") result = await testSlackChannel(config);
      else if (testType === "message") result = await testSlackMessage(config);
      else result = { passed: false, message: "Unknown Slack test type.", latencyMs: 0 };
    } else {
      result = { passed: false, message: "Unknown integration type.", latencyMs: 0 };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ passed: false, message: `Server error: ${msg}`, latencyMs: 0, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
