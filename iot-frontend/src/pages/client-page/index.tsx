import React from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import LoginScreen from '../login';
import { useAuth } from '@/hooks/useAuth';

const ClientPage = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen mt-64 gap-2 flex flex-col items-center justify-center">
        <div className="h-5/6 w-full"></div>
        <LoadingSpinner className={'h-32 w-32'} />
        <h1>Loading...</h1>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        <Header />
        <div className="bg-gray-50">
          <div className="container mx-auto p-4">
            <h1 className="mb-4 text-4xl font-bold">Client Details</h1>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Auckland Council</h2>
                  <p className="text-gray-500">Client ID: 60</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">Total Devices: 2</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-gray-100 p-4">
                  <h3 className="mb-2 text-xl font-semibold">Metrics</h3>
                  <ul className="list-inside list-disc">
                    <li>Batt Status (1)</li>
                    <li>Reset Count (2)</li>
                    <li>Site (1)</li>
                    <li>MESSAGE (1)</li>
                    <li>Signal Quality (2)</li>
                    <li>Humidity (1)</li>
                    <li>Gas Status (1)</li>
                    <li>PM1 (1)</li>
                    <li>ICCID (1)</li>
                    <li>PM2.5 (1)</li>
                    <li>Sound Status (1)</li>
                  </ul>
                </div>

                <div className="rounded-lg bg-gray-100 p-4">
                  <h3 className="mb-2 text-xl font-semibold">Sites</h3>
                  <ul className="list-inside list-disc">
                    <li>Queen Street (1)</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-bold">Status</h3>
                <ul>
                  <li className="mb-2">
                    Scan:
                    <span className="ml-2 rounded-lg bg-green-100 px-2 py-1 text-green-800">
                      ONLINE (2)
                    </span>
                    <span className="ml-2 rounded-lg bg-red-100 px-2 py-1 text-red-800">
                      ERROR (2)
                    </span>
                  </li>
                  <li className="mb-2">
                    Battery:
                    <span className="ml-2 rounded-lg bg-green-100 px-2 py-1 text-green-800">
                      ONLINE (2)
                    </span>
                    <span className="ml-2 rounded-lg bg-red-100 px-2 py-1 text-red-800">
                      ERROR (5)
                    </span>
                  </li>
                  <li>
                    Insitu:
                    <span className="ml-2 rounded-lg bg-green-100 px-2 py-1 text-green-800">
                      NORMAL (2)
                    </span>
                    <span className="ml-2 rounded-lg bg-green-100 px-2 py-1 text-green-800">
                      NORMAL (3)
                    </span>
                    <span className="ml-2 rounded-lg bg-gray-100 px-2 py-1 text-gray-800">
                      N/A (10)
                    </span>
                  </li>
                </ul>
              </div>

              <div className="my-3">
                <h3 className="mb-4 text-xl font-semibold">Map View</h3>
                {/* Add map component or placeholder here  */}
                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-200 p-4">
                  <p className="text-gray-500">Map View Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  } else {
    return <LoginScreen />;
  }
};

export default ClientPage;
