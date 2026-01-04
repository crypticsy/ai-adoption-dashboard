import { useState, useEffect } from 'react';
import type { AIAdoptionData } from '../types';
import { parseCSVData } from '../utils/dataParser';

export function useDataLoader() {
  const [data, setData] = useState<AIAdoptionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const csvData = await parseCSVData('/dataset/ai_adoption_dataset.csv');
        setData(csvData);
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

  return { data, loading, error };
}
