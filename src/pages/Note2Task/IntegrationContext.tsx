import { createContext, useContext } from 'react';
import type { LiveStatus, IntegrationId, StoredConfig } from './useIntegrationStatus';

interface IntegrationContextValue {
  statuses: Record<IntegrationId, LiveStatus>;
  config: StoredConfig;
  updateConfig: (cfg: StoredConfig) => void;
  checkSingle: (id: IntegrationId) => Promise<LiveStatus>;
  isIntegrationReady: (id: IntegrationId) => boolean;
  checkAll: () => void;
}

export const IntegrationContext = createContext<IntegrationContextValue | null>(null);

export function useIntegrations() {
  const ctx = useContext(IntegrationContext);
  if (!ctx) throw new Error('useIntegrations must be used within IntegrationContext.Provider');
  return ctx;
}
