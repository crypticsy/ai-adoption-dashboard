import { useState, useEffect } from 'react';
import type { PrecomputedData } from '../types';

export function useDataLoader() {
  const [precomputedData, setPrecomputedData] = useState<PrecomputedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch('/precomputed_data.json');
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.statusText}`);
        }
        const data: PrecomputedData = await response.json();
        setPrecomputedData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return {
    data: precomputedData?.rawData || [],
    precomputedData,
    loading,
    error
  };
}
