import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App.tsx'

import { DependenciesProvider } from "@/shared/providers/DependenciesProvider";
import Dependencies from "@/shared/providers/Dependencies";

const dependencies = Dependencies.create();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DependenciesProvider dependencies={dependencies}>
      <App />
    </DependenciesProvider>
  </StrictMode>,
)
