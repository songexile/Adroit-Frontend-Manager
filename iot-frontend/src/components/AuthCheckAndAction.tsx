import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DynamicMetricData } from '@/types';
// import { showToast } from '@/components/Toast'
import LoadingIndicator from '@/components/LoadingIndicator';

interface AuthCheckAndActionProps {
  children: React.ReactNode;
  data: DynamicMetricData[];
  loading: boolean;
  hasFetchedData: boolean;
  fetchDataAndUpdate: () => void;
}

export function AuthCheckAndAction({
  children,
  loading,
  hasFetchedData,
  fetchDataAndUpdate,
}: AuthCheckAndActionProps) {
  const { status } = useSession();

  useEffect(() => {
    // Only proceed if the user is authenticated
    if (status === 'authenticated' && !hasFetchedData) {
      fetchDataAndUpdate();
    } else if (status == 'unauthenticated') {
      // showToast({ message: 'User not authenticated', type: 'warning' })
    }
  }, [status, hasFetchedData, fetchDataAndUpdate]);

  return (
    <>
      {loading ? <LoadingIndicator size={50} color="blue" message="Loading data..." /> : children}
    </>
  );
}
