'use client';

import { useCallback, useEffect, useState } from 'react';
import { createDemoHouseholdWorkspace, migrateHouseholdWorkspace } from '@/lib/household';
import { HouseholdWorkspace } from '@/types/household';

export const STORAGE_KEY = 'veloxis.household-workspace.v2';
const LEGACY_STORAGE_KEY = 'veloxis.household-workspace.v1';

function stamp(workspace: HouseholdWorkspace): HouseholdWorkspace {
  return { ...workspace, updatedAt: new Date().toISOString() };
}

export function parseStoredWorkspace(serialized: string | null): HouseholdWorkspace | null {
  if (!serialized) return null;
  try {
    return migrateHouseholdWorkspace(JSON.parse(serialized));
  } catch {
    return null;
  }
}

export function useHouseholdWorkspace() {
  const [workspace, setWorkspace] = useState<HouseholdWorkspace>(() => createDemoHouseholdWorkspace());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
      ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
    const parsed = parseStoredWorkspace(saved);
    if (parsed) {
      // This client-only hydration step intentionally restores the saved workspace after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWorkspace(parsed);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  }, [workspace, hydrated]);

  const updateWorkspace = useCallback((updater: (current: HouseholdWorkspace) => HouseholdWorkspace) => {
    setWorkspace(current => stamp(updater(current)));
  }, []);

  const resetDemo = useCallback(() => setWorkspace(createDemoHouseholdWorkspace()), []);

  return { workspace, hydrated, updateWorkspace, resetDemo };
}
