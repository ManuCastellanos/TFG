import React, { createContext, useContext } from "react";
import type Dependencies from "./Dependencies";

export const DependenciesContext = createContext<Dependencies | null>(null);

type Props = {
  children: React.ReactNode;
  dependencies: Dependencies;
};

export const DependenciesProvider = ({ children, dependencies }: Props) => {
  return React.createElement(
    DependenciesContext.Provider,
    { value: dependencies },
    children
  );
};

export const useDependencies = (): Dependencies => {
  const context = useContext(DependenciesContext);

  if (!context) {
    throw new Error("useDependencies must be used within DependenciesProvider.");
  }

  return context;
};
