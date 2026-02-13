import { useState, useEffect, useMemo } from 'react';
import { Workflow } from '@/types/workflow';
import { database } from '@/db';

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Carregar workflows na montagem
  useEffect(() => {
    fetchWorkflows();
  }, []);

  // Reset para página 1 quando mudar busca ou itens por página
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const getWebhookUrl = (name: string) => {
    const config = database.getWebhook(name);
    return config?.url || '';
  };

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const webhookUrl = getWebhookUrl('list');
      if (!webhookUrl) {
        throw new Error('Webhook de listagem não configurado');
      }
      
      const response = await fetch(webhookUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Verifica se é um array ou um objeto único ou um objeto com propriedade data/workflows
      let workflowsData: Workflow[];
      if (Array.isArray(data)) {
        workflowsData = data;
      } else if (data.workflows && Array.isArray(data.workflows)) {
        workflowsData = data.workflows;
      } else if (data.data && Array.isArray(data.data)) {
        workflowsData = data.data;
      } else if (data.id && data.name) {
        // É um único workflow, converte para array
        workflowsData = [data];
      } else {
        workflowsData = [];
      }
      
      setWorkflows(workflowsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar workflows');
      console.error('Erro ao buscar workflows:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWorkflow = async (id: string, currentStatus: boolean) => {
    const webhookName = currentStatus ? 'deactivate' : 'activate';
    const webhookConfig = database.getWebhook(webhookName);
    
    if (!webhookConfig) {
      setError(`Webhook de ${currentStatus ? 'desativação' : 'ativação'} não configurado`);
      return;
    }
    
    const action = currentStatus ? 'desativar' : 'ativar';
    
    try {
      setError(null);
      
      let body: string | undefined;
      if (webhookConfig.bodyTemplate) {
        body = webhookConfig.bodyTemplate.replace(/\{\{id\}\}/g, id);
      }
      
      const response = await fetch(webhookConfig.url, {
        method: webhookConfig.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: body,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Tenta fazer parse do JSON, mas aceita resposta vazia
      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        data = null;
      }
      console.log(`Workflow ${action}do:`, data || 'sem resposta');
      
      // Atualiza o estado local
      setWorkflows(prev => 
        prev.map(wf => 
          wf.id === id ? { ...wf, active: !currentStatus } : wf
        )
      );
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Erro ao ${action} workflow`;
      setError(errorMessage);
      console.error(`Erro ao ${action} workflow:`, err);
      throw err;
    }
  };

  const downloadWorkflow = async (workflow: Workflow) => {
    const webhookConfig = database.getWebhook('download');
    
    if (!webhookConfig) {
      alert('Webhook de download não configurado');
      return;
    }
    
    try {
      let body: string | undefined;
      if (webhookConfig.bodyTemplate) {
        body = webhookConfig.bodyTemplate.replace(/\{\{id\}\}/g, workflow.id);
      }
      
      const response = await fetch(webhookConfig.url, {
        method: webhookConfig.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: body,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cria o arquivo JSON para download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${workflow.name || 'workflow'}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao baixar workflow:', err);
      alert('Erro ao baixar workflow');
    }
  };

  const filteredAndSortedWorkflows = useMemo(() => {
    let result = [...workflows];

    // Filtro por nome
    if (searchTerm) {
      result = result.filter(wf => 
        wf.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenação
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = (a.name || '').localeCompare(b.name || '');
      } else if (sortBy === 'date') {
        const dateA = new Date(a.publishedAt || a.createdAt || 0);
        const dateB = new Date(b.publishedAt || b.createdAt || 0);
        comparison = dateA.getTime() - dateB.getTime();
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [workflows, searchTerm, sortBy, sortOrder]);

  // Paginação
  const totalItems = filteredAndSortedWorkflows.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedWorkflows = filteredAndSortedWorkflows.slice(startIndex, endIndex);

  return {
    workflows: paginatedWorkflows,
    allWorkflows: filteredAndSortedWorkflows,
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
    refresh: fetchWorkflows,
    // Paginação
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
  };
}
