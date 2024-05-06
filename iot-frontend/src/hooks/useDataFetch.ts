import { useState, useCallback } from 'react';
import { DynamicMetricData } from '@/types';
import { fetchDataAndSetData } from '@/utils';
import { initializeColumns } from '@/components/iotTable/columns';
import { showToast } from '@/components/Toast';

export function useDataFetch() {
  const [data, setData] = useState<DynamicMetricData[]>(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('fetchedData');
      return storedData ? JSON.parse(storedData) : [];
    }
    return [];
  });

  const [loading, setLoading] = useState(false);
  const [hasFetchedData, setHasFetchedData] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedHasFetchedData = localStorage.getItem('hasDataFetched');
      return storedHasFetchedData === 'true';
    }
    return false;
  });

  // useCallback to ensure the function reference remains stable
  const fetchDataAndUpdate = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedData = await fetchDataAndSetData();
      setData(fetchedData);
      setLoading(false);

      // Save the fetched data and set the flag in local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem('fetchedData', JSON.stringify(fetchedData));
        localStorage.setItem('hasDataFetched', 'true');
      }

      // Initialize columns with dynamic metrics
      initializeColumns();

      if (!hasFetchedData) {
        setHasFetchedData(true);
      }

      showToast({ message: 'Data Fetched!', type: 'success' });
    } catch (error) {
      showToast({
        message: 'Failed to fetch data: ' + error,
        type: 'error',
      });
    }
  }, [setData, setLoading, hasFetchedData]);

  // Return data, loading state, and the function for fetching and updating data
  return {
    data,
    loading,
    hasFetchedData,
    fetchDataAndUpdate,
  };
}
