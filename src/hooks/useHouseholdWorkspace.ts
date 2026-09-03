'use client';

import { useCallback, useEffect, useState } from 'react';
import { createDemoHouseholdWorkspace, validateHouseholdWorkspace } from '@/lib/household';
import { HouseholdWorkspace } from '@/types/household';

const STORAGE_KEY = 'veloxis.household-workspace.v1';

function stamp(workspace: HouseholdWorkspace): HouseholdWorkspace {
  return { ...workspace, updatedAt: new Date().toISOString() };
}

export function useHouseholdWorkspace() {
  const [workspace, setWorkspace] = useState<HouseholdWorkspace>(() => createDemoHouseholdWorkspace());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? validateHouseholdWorkspace(JSON.parse(saved)) : null;
    if (parsed) setWorkspace(parsed);
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
