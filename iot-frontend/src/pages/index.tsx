import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import { DataTable } from '@/components/iotTable/data-table';
import { initializeColumns, columns } from '@/components/iotTable/columns';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Footer from '@/components/Footer';
import LoginScreen from './login';
import { getClientsOfflineCount, getTotalDevicesOfflineCount } from '@/utils';
import { DynamicMetricData } from '@/types';
import { useAtom } from 'jotai';
import { hideSelectedAtom } from '@/components/context/toggleAtom';

export default function Home({
  data,
  fetchDataAndUpdate,
}: {
  data?: DynamicMetricData[];
  fetchDataAndUpdate: () => Promise<void>;
}) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<DynamicMetricData[]>([]);
  const [searchByClientName, setSearchByClientName] = useState('');
  const [searchByDeviceKey, setSearchByDeviceKey] = useState('');
  const [hideSelected] = useAtom(hideSelectedAtom);

  const [totalDevicesOfflineCount, setTotalDevicesOfflineCount] = useState(
    data ? getTotalDevicesOfflineCount(data) : 0
  );
  const [clientsOfflineCount, setClientsOfflineCount] = useState(
    data ? getClientsOfflineCount(data) : 0
  );

  const filterData = (
    data: DynamicMetricData[],
    searchByClientName: string,
    searchByDeviceKey: string,
    hideSelected: boolean
  ) => {
    const filteredData = data.filter((item) => {
      const clientNameMatch = (item.client_name + '')
        .toLowerCase()
        .includes(searchByClientName.toLowerCase());
      const deviceKeyMatch = (item.device_key + '')
        .toLowerCase()
        .includes(searchByDeviceKey.toLowerCase());

      // Extract the timestamp from the first available metric
      const timestamp = Object.values(item).find(
        (value): value is { timestamp: number; value: string } =>
          value !== undefined && typeof value === 'object' && 'timestamp' in value
      )?.timestamp;

      const hasTimestamp = hideSelected ? timestamp !== undefined : true;

      return clientNameMatch && deviceKeyMatch && hasTimestamp;
    });
    // console.log('Filtered Data:', filteredData)
    return filteredData;
  };

  useEffect(() => {
    if (data != null) {
      initializeColumns();
      setFilteredData(data);
      setLoading(false);
      console.log(data);
      setTotalDevicesOfflineCount(getTotalDevicesOfflineCount(data));
      setClientsOfflineCount(getClientsOfflineCount(data));
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const filtered = filterData(data, searchByClientName, searchByDeviceKey, hideSelected);
      setFilteredData(filtered);
    }
  }, [searchByClientName, searchByDeviceKey, data, hideSelected]);

  if (session) {
    return (
      <div className=" w-full flex flex-col">
        <Header
          fetchDataAndUpdate={fetchDataAndUpdate}
          searchByClientName={searchByClientName}
          setSearchByClientName={setSearchByClientName}
          searchByDeviceKey={searchByDeviceKey}
          setSearchByDeviceKey={setSearchByDeviceKey}
          totalDevicesOfflineCount={totalDevicesOfflineCount}
          clientsOfflineCount={clientsOfflineCount}
        />
        {loading && (
          <div className=" h-screen mt-64 gap-2 flex flex-col items-center justify-center">
            <div className="h-5/6 w-full"></div> <LoadingSpinner className={'h-32 w-32'} />
            <h1>Loading the data for you.</h1>
          </div>
        )}
        {!loading && (
          <DataTable
            columns={columns}
            data={filteredData || []}
          />
        )}
        {/* provide a default value for data when it's undefined */}
        <Footer />
      </div>
    );
  } else {
    return <LoginScreen />;
  }
}
