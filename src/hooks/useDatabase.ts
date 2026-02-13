import { useState, useCallback } from 'react';
import { database, WebhookConfig } from '@/db';

export function useDatabase() {
  const [initialized] = useState(true);
  const [loading] = useState(false);

  const getWebhook = useCallback(
    (name: string): WebhookConfig | null => {
      return database.getWebhook(name);
    },
    []
  );

  const getAllWebhooks = useCallback((): WebhookConfig[] => {
    return database.getAllWebhooks();
  }, []);

  return {
    initialized,
    loading,
    getWebhook,
    getAllWebhooks,
  };
}
