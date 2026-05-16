import type { ComponentType } from 'react';

export type AppRouteHeaderComponent = ComponentType<Record<string, never>>;

export type AppRouteStaticData = {
  header?: AppRouteHeaderComponent;
};

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption extends AppRouteStaticData {}
}
