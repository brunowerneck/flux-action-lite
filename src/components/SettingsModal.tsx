import { useState, useEffect } from 'react';
import { X, Settings, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { database, DEFAULT_WEBHOOKS } from '@/db';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface SimpleWebhook {
  name: string;
  url: string;
}

export function SettingsModal({ isOpen, onClose, onSave }: SettingsModalProps) {
  const [webhooks, setWebhooks] = useState<SimpleWebhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadWebhooks();
    }
  }, [isOpen]);

  const loadWebhooks = () => {
    setLoading(true);
    setError(null);
    
    try {
      const configs = database.getAllWebhooks();
      setWebhooks(configs.map(c => ({ name: c.name, url: c.url })));
    } catch (err) {
      console.error('[SettingsModal] Error loading webhooks:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar configurações');
      
      // Fallback: use default values
      setWebhooks(Object.values(DEFAULT_WEBHOOKS).map(c => ({ name: c.name, url: c.url })));
    } finally {
      setLoading(false);
    }
  };

  const updateUrl = (name: string, url: string) => {
    setWebhooks((prev) =>
      prev.map((w) => w.name === name ? { ...w, url } : w)
    );
  };

  const handleSave = () => {
    try {
      for (const webhook of webhooks) {
        const fullConfig = database.getWebhook(webhook.name);
        if (fullConfig) {
          database.updateWebhook({
            ...fullConfig,
            url: webhook.url,
          });
        }
      }
      onSave();
      onClose();
    } catch (err) {
      console.error('[SettingsModal] Error saving webhooks:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar configurações');
    }
  };

  const handleReset = () => {
    try {
      database.clearDatabase();
      loadWebhooks();
    } catch (err) {
      console.error('[SettingsModal] Error resetting database:', err);
      setError(err instanceof Error ? err.message : 'Erro ao limpar configurações');
    }
  };

  if (!isOpen) return null;

  const getWebhookLabel = (name: string) => {
    const labels: Record<string, string> = {
      list: 'Webhook para Listar Workflows',
      activate: 'Webhook para Ativar Workflow',
      deactivate: 'Webhook para Desativar Workflow',
      download: 'Webhook para Download',
    };
    return labels[name] || name;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle className="text-lg">Configurações de Webhooks</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
              Erro: {error}
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              Carregando...
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma configuração encontrada. Clique em "Limpar Configurações" para restaurar os padrões.
                </div>
              ) : (
                webhooks.map((webhook) => (
                  <div key={webhook.name}>
                    <label className="text-sm font-medium mb-1.5 block">
                      {getWebhookLabel(webhook.name)}
                    </label>
                    <Input
                      value={webhook.url}
                      onChange={(e) => updateUrl(webhook.name, e.target.value)}
                      placeholder="https://..."
                      className="text-sm"
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>

        <div className="border-t p-4 flex justify-between">
          <Button
            variant="outline"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Limpar Configurações
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              Salvar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
