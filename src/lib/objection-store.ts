"use client";

import { useCallback, useEffect, useState } from "react";
import type { LoggedObjection } from "@/types/types";

const STORAGE_KEY = "ascend:objection-lab:v1";
const DEFAULTS_KEY = "ascend:objection-lab:defaults:v1";

type ContextDefaults = {
  product: string;
  icp: string;
};

type StorageListener = () => void;
const listeners = new Set<StorageListener>();

function readAll(): LoggedObjection[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LoggedObjection[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(list: LoggedObjection[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* storage full or blocked — ignore */
  }
  listeners.forEach((fn) => fn());
}

export function useLoggedObjections() {
  const [list, setList] = useState<LoggedObjection[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setList(readAll());
    setHydrated(true);
    const onChange = () => setList(readAll());
    listeners.add(onChange);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) onChange();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const upsert = useCallback((next: LoggedObjection) => {
    const current = readAll();
    const idx = current.findIndex((o) => o.id === next.id);
    const now = new Date().toISOString();
    if (idx >= 0) {
      current[idx] = { ...next, updatedAt: now };
    } else {
      current.unshift({ ...next, createdAt: now, updatedAt: now });
    }
    writeAll(current);
  }, []);

  const remove = useCallback((id: string) => {
    const current = readAll().filter((o) => o.id !== id);
    writeAll(current);
  }, []);

  const clear = useCallback(() => {
    writeAll([]);
  }, []);

  const incrementRoleplay = useCallback((id: string) => {
    const current = readAll();
    const idx = current.findIndex((o) => o.id === id);
    if (idx < 0) return;
    const now = new Date().toISOString();
    const tests = current[idx].roleplayTestsPassed + 1;
    const status: LoggedObjection["status"] =
      tests >= 3 ? "mastered" : tests >= 1 ? "practicing" : "draft";
    current[idx] = {
      ...current[idx],
      roleplayTestsPassed: tests,
      status,
      updatedAt: now,
    };
    writeAll(current);
  }, []);

  return { list, hydrated, upsert, remove, clear, incrementRoleplay };
}

export function useContextDefaults() {
  const [defaults, setDefaults] = useState<ContextDefaults>({
    product: "",
    icp: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(DEFAULTS_KEY);
      if (raw) setDefaults(JSON.parse(raw) as ContextDefaults);
    } catch {
      /* ignore */
    }
  }, []);

  const save = useCallback((next: ContextDefaults) => {
    setDefaults(next);
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(DEFAULTS_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  return { defaults, save };
}

export function newObjectionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `obj_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
