import { createContext, use, useState, type ReactNode } from 'react';

type Ctx = { node: ReactNode; set: (n: ReactNode) => void };

const PageHeaderContext = createContext<Ctx>({ node: null, set: () => {} });

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [node, set] = useState<ReactNode>(null);
  return (
    <PageHeaderContext.Provider value={{ node, set }}>
      {children}
    </PageHeaderContext.Provider>
  );
}

export const usePageHeader = () => use(PageHeaderContext);
