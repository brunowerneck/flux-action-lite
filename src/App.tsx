import { useState } from 'react';
import {
  Search,
  RefreshCw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Archive,
  Zap,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Save,
  Settings,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkflows } from '@/hooks/useWorkflows';
import { useTheme } from '@/hooks/useTheme';
import { Workflow } from '@/types/workflow';
import { SettingsModal } from '@/components/SettingsModal';
import { LoadingModal } from '@/components/LoadingModal';

function WorkflowCard({
  workflow,
  onToggle,
  onDownload
}: {
  workflow: Workflow;
  onToggle: (id: string, active: boolean) => void;
  onDownload: (workflow: Workflow) => void;
}) {
  const isArchived = workflow.archived === true || workflow.isArchived === true;

  return (
    <div className={`p-4 border-b last:border-b-0 ${isArchived ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium truncate">{workflow.name || 'Sem nome'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            {workflow.active ? (
              <Badge variant="success" className="gap-1 text-xs">
                <Play className="h-3 w-3" />
                Ativo
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1 text-xs">
                <Pause className="h-3 w-3" />
                Inativo
              </Badge>
            )}
            {isArchived && (
              <Badge variant="outline" className="gap-1 text-xs">
                <Archive className="h-3 w-3" />
                Arquivado
              </Badge>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            {workflow.publishedAt
              ? new Date(workflow.publishedAt).toLocaleDateString('pt-BR')
              : workflow.createdAt
                ? new Date(workflow.createdAt).toLocaleDateString('pt-BR')
                : '-'
            }
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDownload(workflow)}
            className="h-8 w-8"
            title="Baixar workflow"
          >
            <Save className="h-4 w-4" />
          </Button>
          <Switch
            checked={workflow.active}
            onCheckedChange={() => onToggle(workflow.id, workflow.active)}
            disabled={isArchived}
            aria-label={workflow.active ? 'Desativar workflow' : 'Ativar workflow'}
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processando...');

  const {
    workflows,

    loading,
    error,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    toggleWorkflow,
    downloadWorkflow,
    refresh,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
  } = useWorkflows();

  const handleSort = (field: 'name' | 'date') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: 'name' | 'date' }) => {
    if (sortBy !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const itemsPerPageOptions = [5, 10, 20, 50, 100];

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setLoadingMessage(currentStatus ? 'Desativando workflow...' : 'Ativando workflow...');
    setIsLoadingModalOpen(true);

    try {
      await toggleWorkflow(id, currentStatus);
    } finally {
      setIsLoadingModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-800 to-neutral-900 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src="/favicon.svg" alt="Flux Action Logo" className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0" />
                <div>
                  <CardTitle className="text-xl sm:text-2xl">Flux Action Lite</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 hidden sm:block">
                    Gerencie seus workflows de forma simples e rápida
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  className="flex-shrink-0"
                  title={theme === 'light' ? 'Tema escuro' : 'Tema claro'}
                >
                  {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex-shrink-0"
                  title="Configurações"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={refresh}
                  disabled={loading}
                  className="flex-shrink-0"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Mobile-first controls */}
            <div className="space-y-3 mb-4">
              {/* Search - full width on mobile */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              {/* Sort and items per page - horizontal scroll on mobile */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Ordenar:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('name')}
                  className="gap-1 whitespace-nowrap"
                >
                  Nome
                  <SortIcon field="name" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('date')}
                  className="gap-1 whitespace-nowrap"
                >
                  Data
                  <SortIcon field="date" />
                </Button>

                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Por página:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="h-9 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {itemsPerPageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 mb-4">
                <p className="text-sm text-destructive">Erro: {error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : workflows.length === 0 ? (
              <div className="text-center py-12">
                <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm
                    ? 'Nenhum workflow encontrado para esta pesquisa.'
                    : 'Nenhum workflow encontrado.'}
                </p>
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="sm:hidden border rounded-lg divide-y">
                  {workflows.map((workflow) => (
                    <WorkflowCard
                      key={workflow.id}
                      workflow={workflow}
                      onToggle={handleToggle}
                      onDownload={downloadWorkflow}
                    />
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nome</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Data</th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {workflows.map((workflow) => {
                        const isArchived = workflow.archived === true || workflow.isArchived === true;
                        return (
                          <tr key={workflow.id} className={`border-b transition-colors hover:bg-muted/50 ${isArchived ? 'opacity-60' : ''}`}>
                            <td className="p-4 align-middle font-medium">
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-muted-foreground" />
                                <span>{workflow.name || 'Sem nome'}</span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                {workflow.active ? (
                                  <Badge variant="success" className="gap-1">
                                    <Play className="h-3 w-3" />
                                    Ativo
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="gap-1">
                                    <Pause className="h-3 w-3" />
                                    Inativo
                                  </Badge>
                                )}
                                {isArchived && (
                                  <Badge variant="outline" className="gap-1">
                                    <Archive className="h-3 w-3" />
                                    Arquivado
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              {workflow.publishedAt
                                ? new Date(workflow.publishedAt).toLocaleDateString('pt-BR')
                                : workflow.createdAt
                                  ? new Date(workflow.createdAt).toLocaleDateString('pt-BR')
                                  : '-'
                              }
                            </td>
                            <td className="p-4 align-middle text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => downloadWorkflow(workflow)}
                                  className="h-8 w-8"
                                  title="Baixar workflow"
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Switch
                                  checked={workflow.active}
                                  onCheckedChange={() => handleToggle(workflow.id, workflow.active)}
                                  disabled={isArchived}
                                  aria-label={workflow.active ? 'Desativar workflow' : 'Ativar workflow'}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination - Mobile optimized */}
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground text-center sm:text-left">
                    {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems}
                    {searchTerm && <span className="hidden sm:inline"> (filtrado)</span>}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="h-8 w-8 hidden sm:flex"
                      >
                        <span className="text-xs">«</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-8 w-8"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center gap-1 px-2">
                        <span className="text-sm">
                          {currentPage} / {totalPages}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 hidden sm:flex"
                      >
                        <span className="text-xs">»</span>
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={() => {
          refresh();
        }}
      />

      {/* Loading Modal */}
      <LoadingModal
        isOpen={isLoadingModalOpen}
        message={loadingMessage}
      />
    </div>
  );
}

export default App;
