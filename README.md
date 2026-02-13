# Flux Action Lite

Microsserviço frontend para gerenciamento de workflows n8n com interface intuitiva e responsiva.

## Sobre o Projeto

O Flux Action Lite é uma aplicação PWA (Progressive Web App) que permite gerenciar workflows do n8n de forma simples e eficiente. Com suporte a temas claro/escuro, paginação, busca e ordenação, a aplicação oferece uma experiência completa para ativar, desativar e baixar workflows.

## Tecnologias

- **React 18** - Biblioteca UI com hooks
- **TypeScript** - Tipagem estática
- **Vite** - Build tool rápida com HMR
- **Tailwind CSS v3** - Framework CSS utilitário
- **ShadcnUI** - Componentes acessíveis baseados em Radix UI
- **Lucide React** - Ícones modernos
- **sql.js** - Banco de dados SQLite no cliente
- **PWA** - Suporte offline com vite-plugin-pwa

## Pré-requisitos

- Docker e Docker Compose
- Node.js 20+ (para desenvolvimento local sem Docker)

## Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd flux-action-lite
```

1. Inicie o container Docker:

```bash
docker-compose up -d
```

1. Acesse a aplicação em `http://localhost:5173`

## Comandos Disponíveis

### Desenvolvimento

```bash
# Iniciar com Docker (recomendado)
docker-compose up -d

# Desenvolvimento local (sem Docker)
npm install
npm run dev

# Visualizar logs do container
docker-compose logs -f

# Parar o container
docker-compose down

# Rebuild após alterações no package.json
docker-compose down && docker-compose up -d --build
```

### Build e Produção

```bash
# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Lint do código
npm run lint

# Gerar ícones PWA
npm run generate-icons
```

## Arquitetura

### Estrutura de Diretórios

```
flux-action-lite/
├── src/
│   ├── components/      # Componentes React
│   │   └── ui/         # Componentes ShadcnUI
│   ├── hooks/          # Custom hooks
│   ├── types/          # Tipos TypeScript
│   ├── db/             # Módulo de banco de dados
│   ├── lib/            # Utilitários
│   ├── App.tsx         # Componente principal
│   ├── main.tsx        # Entry point
│   └── index.css       # Estilos globais
├── public/             # Arquivos estáticos
├── scripts/            # Scripts de build
├── docker-compose.yml  # Configuração Docker
├── Dockerfile          # Imagem Docker
├── nixpacks.toml       # Configuração de deploy (VPS)
├── LICENSE.md          # Licença MIT
├── README.md           # Documentação
└── AGENTS.md           # Guidelines para desenvolvedores
```

### Configuração de Webhooks

A aplicação utiliza webhooks configuráveis para comunicação com o n8n:

- **List** - Listar todos os workflows
- **Activate** - Ativar um workflow
- **Deactivate** - Desativar um workflow
- **Download** - Baixar workflow como JSON

As configurações são armazenadas no banco de dados local (sql.js) e podem ser editadas através do modal de configurações na interface.

## Desenvolvimento

### Configuração do Ambiente Docker

O projeto utiliza Docker com as seguintes características:

- **node_modules** não é compartilhado entre host e container (compatibilidade Windows/Linux)
- **HMR** (Hot Module Replacement) habilitado com polling
- **Porta 5173** exposta para acesso local
- Arquivos de código montados como read-only no container

### Variáveis de Ambiente

O container Docker utiliza as seguintes variáveis:

- `NODE_ENV=development`
- `CHOKIDAR_USEPOLLING=true`
- `CHOKIDAR_INTERVAL=1000`
- `WATCHPACK_POLLING=true`

### Guidelines de Código

Consulte o arquivo [AGENTS.md](./AGENTS.md) para diretrizes detalhadas sobre:

- Convenções de código
- Estrutura de componentes
- Estilo e formatação
- Tratamento de erros

## Funcionalidades

- **Listagem de Workflows** - Visualize todos os workflows com paginação
- **Busca** - Filtre workflows por nome
- **Ordenação** - Ordene por nome ou data (ascendente/descendente)
- **Ativar/Desativar** - Controle o estado dos workflows com um clique
- **Download** - Exporte workflows como arquivos JSON
- **Temas** - Suporte a tema claro e escuro
- **PWA** - Instale como aplicativo no desktop/mobile
- **Responsivo** - Interface adaptada para desktop e mobile

## Deploy em VPS (Easypanel/Railway)

O projeto inclui um arquivo `nixpacks.toml` para facilitar o deploy em VPS usando Nixpacks (Easypanel, Railway, etc.).

### Configuração do Nixpacks

O arquivo `nixpacks.toml` já está configurado com:
- **Node.js 20** - Versão compatível com todas as dependências
- **Build correto** - Usa `npm run build` ao invés de `npm build`
- **Preview server** - Inicia o servidor de preview na porta correta

### Deploy no Easypanel

1. Conecte seu repositório GitHub no Easypanel
2. O Easypanel detectará automaticamente o arquivo `nixpacks.toml`
3. Configure a porta (geralmente 3000 ou deixe o `$PORT` automático)
4. Deploy!

### Troubleshooting

Se encontrar o erro `Unknown command: "build"`, verifique se o arquivo `nixpacks.toml` está presente no repositório.

Se houver erros de versão do Node.js, o `nixpacks.toml` já especifica Node.js 20 para evitar conflitos com pacotes como `workbox-build`.

## Melhorias Sugeridas (Roadmap)

Ideias para evoluir o projeto após o MVP:

### 🎯 Experiência do Usuário

- **Página 404 personalizada** - Criar uma página amigável para rotas não encontradas, mantendo o design do aplicativo
- **Toast notifications** - Substituir os alertas do navegador por notificações elegantes (ex: biblioteca Sonner ou React Hot Toast)
- **Skeleton loading** - Mostrar esqueletos animados durante o carregamento em vez de spinner simples
- **Empty states ilustrados** - Adicionar ilustrações e ações sugeridas quando não houver workflows

### 🔒 Qualidade e Segurança

- **Testes automatizados** - Adicionar testes unitários com Vitest e testes de integração com React Testing Library
- **Validação de URLs** - Verificar se as URLs dos webhooks são válidas antes de salvar
- **Retry automático** - Tentar novamente automaticamente quando requisições falharem (ex: 3 tentativas com backoff)

### 📱 Recursos Adicionais

- **Cache offline** - Permitir visualizar workflows mesmo sem internet (usando service worker)
- **Filtros avançados** - Filtrar por status (ativo/inativo), data de criação, tags
- **Modo de seleção múltipla** - Ativar/desativar vários workflows de uma vez
- **Importação de workflows** - Upload de arquivos JSON para criar workflows no n8n

### 💡 Contribuições são bem-vindas

Tem uma ideia? Abra uma issue ou envie um pull request!

## Scripts Úteis

```bash
# Verificar status do container
docker-compose ps

# Reiniciar container
docker-compose restart

# Limpar volumes e rebuild
docker-compose down -v && docker-compose up -d --build
```

## Contribuição

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE.md](./LICENSE.md) para detalhes.

## Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

**Nota**: Este projeto foi desenvolvido para ambiente Windows com Docker. Para outros sistemas operacionais, podem ser necessárias adaptações na configuração do Docker.
