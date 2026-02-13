const STORAGE_KEY = 'flux_action_webhooks';

export interface WebhookConfig {
  name: string;
  url: string;
  method: string;
  bodyTemplate: string | null;
}

export const DEFAULT_WEBHOOKS: Record<string, WebhookConfig> = {
  list: {
    name: 'list',
    url: '',
    method: 'GET',
    bodyTemplate: null,
  },
  activate: {
    name: 'activate',
    url: '',
    method: 'POST',
    bodyTemplate: '[{"workflow_id": "{{id}}"}]',
  },
  deactivate: {
    name: 'deactivate',
    url: '',
    method: 'POST',
    bodyTemplate: '[{"workflow_id": "{{id}}"}]',
  },
  download: {
    name: 'download',
    url: '',
    method: 'POST',
    bodyTemplate: '[{"workflow_id": "{{id}}"}]',
  },
};

class Storage {
  getWebhook(name: string): WebhookConfig | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const webhooks = data ? JSON.parse(data) : {};
      return webhooks[name] || DEFAULT_WEBHOOKS[name] || null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return DEFAULT_WEBHOOKS[name] || null;
    }
  }

  getAllWebhooks(): WebhookConfig[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const webhooks = data ? JSON.parse(data) : {};

      return Object.keys(DEFAULT_WEBHOOKS).map((key) => {
        return webhooks[key] || DEFAULT_WEBHOOKS[key];
      });
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return Object.values(DEFAULT_WEBHOOKS);
    }
  }

  updateWebhook(config: WebhookConfig): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const webhooks = data ? JSON.parse(data) : {};
      webhooks[config.name] = config;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(webhooks));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  clearDatabase(): Promise<void> {
    this.clear();
    return Promise.resolve();
  }

  isInitialized(): boolean {
    return true;
  }

  init(): Promise<void> {
    return Promise.resolve();
  }
}

export const database = new Storage();
