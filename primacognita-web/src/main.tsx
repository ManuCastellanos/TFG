import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@/index.css'
import App from '@/App.tsx'

import { DependenciesProvider } from "@/shared/providers/DependenciesProvider";
import Dependencies from "@/shared/providers/Dependencies";

const dependencies = Dependencies.create();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DependenciesProvider dependencies={dependencies}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </DependenciesProvider>
  </StrictMode>,
)
