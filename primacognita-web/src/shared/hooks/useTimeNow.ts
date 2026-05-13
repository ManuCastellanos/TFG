import { useState } from 'react';

export function useTimeNow(): number {
  const [now] = useState(() => Date.now());
  return now;
}
