import type { AnyRouteMatch } from '@tanstack/react-router';
import type { AppRouteHeaderComponent } from '@/router/types';

export function getActiveHeader(matches: AnyRouteMatch[]): AppRouteHeaderComponent | undefined {
  return [...matches]
    .reverse()
    .find((match) => match.staticData?.header)
    ?.staticData?.header;
}
