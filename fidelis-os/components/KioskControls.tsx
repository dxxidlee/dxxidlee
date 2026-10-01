"use client";

import { useEffect } from "react";

/**
 * Exhibition helpers: a click anywhere toggles fullscreen, and the screen is
 * kept awake where the browser allows it. Renders nothing.
 */
export function KioskControls() {
  useEffect(() => {
    function toggleFullscreen() {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      else document.documentElement.requestFullscreen().catch(() => {});
    }

    let lock: WakeLockSentinel | null = null;
    async function keepAwake() {
      if (document.visibilityState !== "visible" || !("wakeLock" in navigator)) return;
      try {
        lock = await navigator.wakeLock.request("screen");
      } catch {
        // Not allowed here (no user gesture yet, or unsupported). Fine.
      }
    }

    document.addEventListener("click", toggleFullscreen);
    document.addEventListener("visibilitychange", keepAwake);
    keepAwake();
    return () => {
      document.removeEventListener("click", toggleFullscreen);
      document.removeEventListener("visibilitychange", keepAwake);
      lock?.release().catch(() => {});
    };
  }, []);

  return null;
}
