import { useState, useEffect, useCallback, useRef } from 'react';
import { testConnection } from './integrationService';

export type IntegrationId = 'zoom' | 'jira' | 'slack';
export type StatusKind = 'not_configured' | 'checking' | 'connected' | 'error';

export interface LiveStatus {
  status: StatusKind;
  message: string;
  errorDetail?: string;
  lastChecked?: Date;
  latencyMs?: number;
}

export interface StoredConfig {
  zoom: {
    accountId: string;
    clientId: string;
    clientSecret: string;
    webhookSecret: string;
  };
  jira: {
    siteUrl: string;
    email: string;
    apiToken: string;
    projectKey: string;
  };
  slack: {
    botToken: string;
    webhookUrl: string;
    defaultChannel: string;
    useWebhook: boolean;
  };
}

const STORAGE_KEY = 'n2t_integration_config';
const POLL_INTERVAL_MS = 60_000;

function loadStoredConfig(): StoredConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoredConfig;
  } catch {
  }
  return {
    zoom: { accountId: '', clientId: '', clientSecret: '', webhookSecret: '' },
    jira: { siteUrl: '', email: '', apiToken: '', projectKey: '' },
    slack: { botToken: '', webhookUrl: '', defaultChannel: '#jira-updates', useWebhook: false },
  };
}

export function saveIntegrationConfig(config: StoredConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

function isConfigured(id: IntegrationId, config: StoredConfig): boolean {
  if (id === 'zoom') return !!(config.zoom.accountId && config.zoom.clientId && config.zoom.clientSecret);
  if (id === 'jira') return !!(config.jira.siteUrl && config.jira.email && config.jira.apiToken);
  if (id === 'slack') return config.slack.useWebhook ? !!config.slack.webhookUrl : !!config.slack.botToken;
  return false;
}

async function checkIntegration(id: IntegrationId, config: StoredConfig): Promise<LiveStatus> {
  if (!isConfigured(id, config)) {
    return { status: 'not_configured', message: 'Not configured — enter credentials to connect.' };
  }

  const cfg =
    id === 'zoom' ? config.zoom :
    id === 'jira' ? config.jira :
    config.slack;

  const testType = id === 'zoom' ? 'auth' : id === 'jira' ? 'auth' : 'auth';

  try {
    const result = await testConnection(id, testType, cfg as Parameters<typeof testConnection>[2]);
    if (result.passed) {
      return {
        status: 'connected',
        message: result.message,
        lastChecked: new Date(),
        latencyMs: result.latencyMs,
      };
    }
    return {
      status: 'error',
      message: result.message,
      errorDetail: result.error,
      lastChecked: new Date(),
      latencyMs: result.latencyMs,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { status: 'error', message: `Check failed: ${msg}`, errorDetail: msg, lastChecked: new Date() };
  }
}

const INTEGRATIONS: IntegrationId[] = ['zoom', 'jira', 'slack'];

export function useIntegrationStatus() {
  const [config, setConfig] = useState<StoredConfig>(loadStoredConfig);
  const [statuses, setStatuses] = useState<Record<IntegrationId, LiveStatus>>({
    zoom: { status: 'not_configured', message: 'Not configured' },
    jira: { status: 'not_configured', message: 'Not configured' },
    slack: { status: 'not_configured', message: 'Not configured' },
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkAll = useCallback(async (cfg: StoredConfig) => {
    setStatuses(prev => {
      const next = { ...prev };
      for (const id of INTEGRATIONS) {
        if (isConfigured(id, cfg)) {
          next[id] = { ...prev[id], status: 'checking', message: 'Checking…' };
        }
      }
      return next;
    });

    await Promise.all(
      INTEGRATIONS.map(async (id) => {
        const status = await checkIntegration(id, cfg);
        setStatuses(prev => ({ ...prev, [id]: status }));
      })
    );
  }, []);

  const checkSingle = useCallback(async (id: IntegrationId) => {
    const cfg = loadStoredConfig();
    setStatuses(prev => ({ ...prev, [id]: { ...prev[id], status: 'checking', message: 'Checking…' } }));
    const status = await checkIntegration(id, cfg);
    setStatuses(prev => ({ ...prev, [id]: status }));
    return status;
  }, []);

  const updateConfig = useCallback((newConfig: StoredConfig) => {
    saveIntegrationConfig(newConfig);
    setConfig(newConfig);
    checkAll(newConfig);
  }, [checkAll]);

  useEffect(() => {
    const initial = loadStoredConfig();
    setConfig(initial);
    checkAll(initial);

    timerRef.current = setInterval(() => {
      const current = loadStoredConfig();
      checkAll(current);
    }, POLL_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [checkAll]);

  const isIntegrationReady = useCallback((id: IntegrationId) => {
    return statuses[id].status === 'connected';
  }, [statuses]);

  return { statuses, config, updateConfig, checkSingle, isIntegrationReady, checkAll: () => checkAll(loadStoredConfig()) };
}
