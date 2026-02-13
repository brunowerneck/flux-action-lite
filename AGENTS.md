# AGENTS.md

Guidelines for AI agents working on this codebase.

## Project Overview

- **Stack**: React 18 + TypeScript + Vite + Tailwind CSS v3
- **UI**: ShadcnUI components with Radix UI primitives
- **Icons**: Lucide React
- **Database**: sql.js (client-side SQLite)
- **PWA**: vite-plugin-pwa configured
- **Language**: Portuguese (pt-BR) for UI text
- **Environment**: Windows host, Docker for development

## Build Commands

```bash
# Development (with HMR via Docker)
docker-compose up -d

# Local development (without Docker)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Generate PWA icons
npm run generate-icons
```

## Docker Development (Windows)

- **node_modules is NOT shared** between host and container (Windows/Linux compatibility)
- Container runs on port 5173
- HMR enabled with polling (CHOKIDAR_USEPOLLING=true)
- Source files mounted as read-only (:ro)

```bash
# Start container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop container
docker-compose down

# Rebuild after package.json changes
docker-compose down && docker-compose up -d --build
```

## Code Style Guidelines

### TypeScript

- Strict mode enabled (`strict: true`)
- No unused locals or parameters (`noUnusedLocals`, `noUnusedParameters`)
- Target: ES2020
- Module: ESNext with bundler resolution

### Imports

- Use path alias `@/` for imports from `src/`
- Group imports: React, external libs, internal (@/), types
- Example:
  ```typescript
  import { useState } from 'react';
  import { Search } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import { Workflow } from '@/types/workflow';
  ```

### Naming Conventions

- **Components**: PascalCase (e.g., `WorkflowCard.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useWorkflows.ts`)
- **Types/Interfaces**: PascalCase (e.g., `Workflow`, `ButtonProps`)
- **Functions**: camelCase (e.g., `fetchWorkflows`, `handleToggle`)
- **Constants**: UPPER_SNAKE_CASE for true constants

### Component Structure

- Use functional components with hooks
- Props interface named with `Props` suffix (e.g., `ButtonProps`)
- Forward refs when needed using `React.forwardRef`
- Export component as default for page components
- Named exports for shared components

### Styling

- Use Tailwind CSS utility classes
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Follow ShadcnUI color system (CSS variables in `hsl()` format)
- Support dark mode via `dark` class
- Mobile-first responsive design

### Error Handling

- Use try/catch for async operations
- Set user-friendly error messages in Portuguese
- Log errors to console for debugging
- Example:
  ```typescript
  try {
    await operation();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erro ao processar');
    console.error('Operation failed:', err);
  }
  ```

### State Management

- Use React hooks: `useState`, `useEffect`, `useMemo`
- Custom hooks for complex logic (e.g., `useWorkflows`)
- Database operations via `@/db` module

### File Organization

```
src/
  components/       # React components
    ui/            # ShadcnUI components
  hooks/           # Custom React hooks
  types/           # TypeScript types/interfaces
  db/              # Database module (sql.js)
  lib/             # Utility functions
```

## Testing

No test framework configured. To add tests, consider:
- Vitest (Vite-native)
- React Testing Library
- Playwright for E2E

## Important Notes

- UI text must be in Portuguese (pt-BR)
- All dates formatted with `toLocaleDateString('pt-BR')`
- PWA manifest in `/public/manifest.json`
- Webhook configurations stored in local SQLite database
- Icons generated via Sharp in `scripts/generate-pwa-icons.cjs`
