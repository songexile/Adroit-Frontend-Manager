import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { DynamicMetricData } from '@/types';
import { fetchDataAndSetData } from '@/utils';
import { showToast } from '@/components/Toast';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import { initializeColumns } from '../iotTable/columns';

interface DataContextType {
  data: DynamicMetricData[];
  loading: boolean;
  fetchDataAndUpdate: () => Promise<void>;
}

interface DataFetchWrapperProps {
  children: ReactNode;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataFetchWrapper: React.FC<DataFetchWrapperProps> = ({ children }) => {
  const { status } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<DynamicMetricData[]>(() => {
    if (typeof window !== 'undefined') {
      // Load data from local storage on initial load
      const storedData = localStorage.getItem('fetchedData');
      return storedData ? JSON.parse(storedData) : [];
    }
    return [];
  });

  // Function to fetch data and update state
  const fetchDataAndUpdate = async () => {
    try {
      setLoading(true);
      const fetchedData = await fetchDataAndSetData();
      setData(fetchedData);
      setLoading(false);

      // Save data to local storage if in browser environment
      if (typeof window !== 'undefined') {
        localStorage.setItem('fetchedData', JSON.stringify(fetchedData));
        localStorage.setItem('hasDataFetched', 'true');
      }

      // Initialize columns with dynamic metrics
      initializeColumns();

      showToast({ message: 'Data fetched successfully!', type: 'success' });
    } catch (error) {
      showToast({ message: `Failed to fetch data: ${error}`, type: 'error' });
      setLoading(false);
    }
  };

  // useEffect hook to handle data fetching and local storage interactions
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasDataFetched = localStorage.getItem('hasDataFetched') === 'true';
      const fetchedDataFromStorage = localStorage.getItem('fetchedData');

      if (status === 'authenticated') {
        if (!hasDataFetched) {
          fetchDataAndUpdate();
        } else if (fetchedDataFromStorage) {
          setData(JSON.parse(fetchedDataFromStorage));
          setLoading(false);
        }
      } else {
        // User is not authenticated
        setData([]);
        setLoading(false);
      }
    }
  }, [status]);

  // Create context value for DataContext provider
  const contextValue: DataContextType = {
    data,
    loading,
    fetchDataAndUpdate,
  };

  // Return the DataContext provider with either loading indicator or children components
  return (
    <DataContext.Provider value={contextValue}>
      {loading ? <LoadingIndicator /> : children}
    </DataContext.Provider>
  );
};

// Custom hook to use the DataContext
export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataFetchWrapper');
  }
  return context;
};
