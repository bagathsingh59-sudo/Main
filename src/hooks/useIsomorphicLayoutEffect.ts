import { useEffect, useLayoutEffect } from "react";

/**
 * Safe SSR-friendly drop-in for useLayoutEffect.
 * On the server it falls back to useEffect to avoid hydration warnings.
 */
export const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
