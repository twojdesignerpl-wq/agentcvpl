"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Returns `true` after hydration on the client, `false` during SSR and the
 * first client render. Safe alternative to `useState(false) + useEffect(() => setState(true))`
 * that avoids the `react-hooks/set-state-in-effect` rule.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
