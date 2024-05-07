import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { DataTable } from '@/components/iotTable/data-table';
import { initializeColumns, columns } from '@/components/iotTable/columns';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Footer from '@/components/Footer';
import LoginScreen from './login';
import { getClientsOfflineCount, getTotalDevicesOfflineCount } from '@/utils';
import { DynamicMetricData } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export default function Home({
  data,
  fetchDataAndUpdate,
}: {
  data?: DynamicMetricData[];
  fetchDataAndUpdate: () => Promise<void>;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const [filteredData, setFilteredData] = useState<DynamicMetricData[]>([]);
  const [searchByClientName, setSearchByClientName] = useState('');
  const [searchByDeviceKey, setSearchByDeviceKey] = useState('');
  const [totalDevicesOfflineCount, setTotalDevicesOfflineCount] = useState(
    data ? getTotalDevicesOfflineCount(data) : 0
  );
  const [clientsOfflineCount, setClientsOfflineCount] = useState(
    data ? getClientsOfflineCount(data) : 0
  );

  useEffect(() => {
    if (data != null) {
      initializeColumns();
      setFilteredData(data);
      console.log(data);
      setTotalDevicesOfflineCount(getTotalDevicesOfflineCount(data));
      setClientsOfflineCount(getClientsOfflineCount(data));
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const filtered = filterData(data, searchByClientName, searchByDeviceKey);
      setFilteredData(filtered);
    }
  }, [searchByClientName, searchByDeviceKey, data]);

  const filterData = (
    data: DynamicMetricData[],
    searchByClientName: string,
    searchByDeviceKey: string
  ) => {
    return data.filter((item) => {
      const clientNameMatch = (item.client_name + '')
        .toLowerCase()
        .includes(searchByClientName.toLowerCase());
      const deviceKeyMatch = (item.device_key + '')
        .toLowerCase()
        .includes(searchByDeviceKey.toLowerCase());
      return clientNameMatch && deviceKeyMatch;
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen mt-64 gap-2 flex flex-col items-center justify-center">
        <div className="h-5/6 w-full"></div>
        <LoadingSpinner className={'h-32 w-32'} />
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="w-full flex flex-col">
      <Header
        fetchDataAndUpdate={fetchDataAndUpdate}
        searchByClientName={searchByClientName}
        setSearchByClientName={setSearchByClientName}
        searchByDeviceKey={searchByDeviceKey}
        setSearchByDeviceKey={setSearchByDeviceKey}
        totalDevicesOfflineCount={totalDevicesOfflineCount}
        clientsOfflineCount={clientsOfflineCount}
      />
      <DataTable
        columns={columns}
        data={filteredData || []}
      />
      <Footer />
    </div>
  );
}
