"use client";

import { useSyncExternalStore } from "react";

const AMBIENT_STORAGE_KEY = "gym_ambient_mode";
const AMBIENT_EVENT = "ambient-mode-change";

function getAmbientSnapshot(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem(AMBIENT_STORAGE_KEY);
    return stored !== "false";
  } catch {
    return true;
  }
}

function getAmbientServerSnapshot(): boolean {
  return true;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handler = () => callback();
  window.addEventListener(AMBIENT_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(AMBIENT_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function setAmbientMode(enabled: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AMBIENT_STORAGE_KEY, String(enabled));
  } catch {
    // Ignore storage quota errors
  }
  window.dispatchEvent(
    new CustomEvent(AMBIENT_EVENT, { detail: { enabled } })
  );
}

export function useAmbientMode() {
  const isAmbient = useSyncExternalStore(
    subscribe,
    getAmbientSnapshot,
    getAmbientServerSnapshot
  );

  const toggleAmbient = () => {
    setAmbientMode(!isAmbient);
  };

  return {
    isAmbient,
    toggleAmbient,
    setAmbient: setAmbientMode,
  };
}
