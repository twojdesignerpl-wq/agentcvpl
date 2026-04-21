"use client";

import { useMediaQuery } from "./use-media-query";

const MOBILE_QUERY = "(max-width: 1023px)";

export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_QUERY, false);
}
