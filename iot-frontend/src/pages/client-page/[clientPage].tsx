import React, { useMemo } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import LoginScreen from "../login";
import { useAuth } from "@/hooks/useAuth";
import SEO from "@/components/SEO";
import { usePathname } from "next/navigation";
import { Tooltip } from "react-tooltip";
import {
  flattenNestedData,
  getBatteryStatus,
  getInsituStatus,
  getScanStatus,
  getStatusCounts,
} from "@/utils";

function fetchIdAndType() {
  // Fetches ID from URL
  const pathname = usePathname();
  const parts = pathname ? pathname.split("/") : [];
  const id = parts[parts.length - 1]
    ? parseInt(parts[parts.length - 1] as string)
    : 0; // Parse the ID as an integer, defaulting to 0 if it is undefined

  // Determine the ID type based on the URL path
  const isClientId = parts.includes("client-page");
  const isDeviceId = parts.includes("device-info");
  const idType = isClientId ? "client" : isDeviceId ? "device" : "";

  return { id, type: idType };
}

const ClientPage = (data: any) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { id, type } = fetchIdAndType();

  const getDeviceIdsByStatus = (status: string) => {
    return clientData
      .filter((device) => {
        const scanStatus = getScanStatus(device);
        const batteryStatus = getBatteryStatus(device);
        const insituStatus = getInsituStatus(device);

        if (status === "scanOnline" && scanStatus === "ONLINE") return true;
        if (status === "scanError" && scanStatus === "ERROR") return true;
        if (status === "batteryOnline" && batteryStatus === "ONLINE")
          return true;
        if (status === "batteryOffline" && batteryStatus === "OFFLINE")
          return true;
        if (status === "insituNormal" && insituStatus === "NORMAL") return true;
        if (status === "insituError" && insituStatus === "ERROR") return true;
        if (status === "insituPowerCycled" && insituStatus === "POWER_CYCLED")
          return true;
        if (status === "insituStartup" && insituStatus === "STARTUP")
          return true;
        if (status === "insituAquatroll500" && insituStatus === "AQUATROLL 500")
          return true;

        return false;
      })
      .map((device) => device.device_id);
  };

  const filteredData = useMemo(() => {
    if (type === "client") {
      return flattenNestedData(data, undefined, id);
    } else if (type === "device") {
      return flattenNestedData(data, id);
    } else {
      // Handle the case when neither client ID nor device ID is provided
      return [];
    }
  }, [data, id, type]);

  const clientData = filteredData;

  // console.log(clientData);

  if (!clientData) return null;

  const title = `Client Page | 1 | Adroit Front End Manager`;
  const description = `Client Info Page for Device ID: 1`;

  // Get client name, ID, and total devices
  const clientName =
    clientData.length > 0 ? clientData[0]?.client_name || "" : "";
  const clientId = clientData.length > 0 ? clientData[0]?.client_id || "" : "";
  const totalDevices = clientData.length;

  // Get all metrics and their counts
  const metricCounts = clientData.reduce(
    (counts: { [key: string]: number }, device: any) => {
      for (const key in device) {
        if (key.startsWith("metric_")) {
          const metricName = key.replace("metric_", "");
          counts[metricName] = (counts[metricName] || 0) + 1;
        }
      }
      return counts;
    },
    {}
  );

  // Convert metric counts to an array of objects
  const metricCountsArray = Object.entries(metricCounts).map(
    ([metricName, count]) => ({
      metricName,
      count,
    })
  );

  // Get unique sites and their counts
  const siteCounts = clientData.reduce(
    (counts: { [key: string]: number }, device: any) => {
      for (const key in device) {
        if (key.startsWith("metric_site")) {
          const siteName = device[key].value;
          counts[siteName] = (counts[siteName] || 0) + 1;
        }
      }
      return counts;
    },
    {}
  );

  // Convert site counts to an array of objects
  const siteCountsArray = Object.entries(siteCounts).map(
    ([siteName, count]) => ({
      siteName,
      count,
    })
  );

  // Get status counts
  const statusCounts = getStatusCounts(clientData);

  if (isLoading) {
    return (
      <>
        <LoadingIndicator />
      </>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        <SEO title={title} description={description} />
        <Header />
        <div className="bg-gray-50">
          <div className="container mx-auto p-4">
            <h1 className="mb-4 text-4xl font-bold">Client Details</h1>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Client Name: {clientName}
                  </h2>
                  <p className="text-gray-500">Client ID: {clientId}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    Total Devices: {totalDevices}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-gray-100 p-4">
                  <h3 className="mb-2 text-xl font-semibold">Metrics</h3>
                  <ul className="list-inside list-disc">
                    {metricCountsArray.map(({ metricName, count }) => (
                      <li key={metricName}>
                        {metricName} ({count})
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg bg-gray-100 p-4">
                  <h3 className="mb-2 text-xl font-semibold">Sites</h3>
                  <ul className="list-inside list-disc">
                    {siteCountsArray.map(({ siteName, count }) => (
                      <li key={siteName}>
                        {siteName} ({count})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Statuses */}
              <div>
                <h3 className="mb-4 text-xl font-bold">Status</h3>
                <ul>
                  <li className="mb-2">
                    Scan:
                    <span
                      className="ml-2 rounded-lg bg-green-100 px-2 py-1 text-green-800 cursor-pointer"
                      data-tooltip-id="scanOnlineTooltip"
                      data-tooltip-content={`Device IDs: ${getDeviceIdsByStatus(
                        "scanOnline"
                      ).join(", ")}`}
                    >
                      ONLINE ({statusCounts.scanOnline})
                    </span>
                    <span
                      className="ml-2 rounded-lg bg-red-100 px-2 py-1 text-red-800 cursor-pointer"
                      data-tooltip-id="scanErrorTooltip"
                      data-tooltip-content={`Device IDs: ${getDeviceIdsByStatus(
                        "scanError"
                      ).join(", ")}`}
                    >
                      ERROR ({statusCounts.scanError})
                    </span>
                  </li>
                  <li className="mb-2">
                    Battery:
                    <span
                      className="ml-2 rounded-lg bg-green-100 px-2 py-1 text-green-800 cursor-pointer"
                      data-tooltip-id="batteryOnlineTooltip"
                      data-tooltip-content={`Device IDs: ${getDeviceIdsByStatus(
                        "batteryOnline"
                      ).join(", ")}`}
                    >
                      ONLINE ({statusCounts.batteryOnline})
                    </span>
                    <span
                      className="ml-2 rounded-lg bg-red-100 px-2 py-1 text-red-800 cursor-pointer"
                      data-tooltip-id="batteryOfflineTooltip"
                      data-tooltip-content={`Device IDs: ${getDeviceIdsByStatus(
                        "batteryOffline"
                      ).join(", ")}`}
                    >
                      OFFLINE ({statusCounts.batteryOffline})
                    </span>
                  </li>
                  <li>
                    Insitu:
                    <span
                      className="ml-2 rounded-lg bg-green-100 px-2 py-1 text-green-800 cursor-pointer"
                      data-tooltip-id="insituNormalTooltip"
                      data-tooltip-content={`Device IDs: ${getDeviceIdsByStatus(
                        "insituNormal"
                      ).join(", ")}`}
                    >
                      NORMAL ({statusCounts.insituNormal})
                    </span>
                    <span
                      className="ml-2 rounded-lg bg-red-100 px-2 py-1 text-red-800 cursor-pointer"
                      data-tooltip-id="insituErrorTooltip"
                      data-tooltip-content={`Device IDs: ${getDeviceIdsByStatus(
                        "insituError"
                      ).join(", ")}`}
                    >
                      ERROR ({statusCounts.insituError})
                    </span>
                    <span
                      className="ml-2 rounded-lg bg-yellow-100 px-2 py-1 text-yellow-800 cursor-pointer"
                      data-tooltip-id="insituPowerCycledTooltip"
                      data-tooltip-content={`Device IDs: ${getDeviceIdsByStatus(
                        "insituPowerCycled"
                      ).join(", ")}`}
                    >
                      POWER_CYCLED ({statusCounts.insituPowerCycled})
                    </span>
                    <span
                      className="ml-2 rounded-lg bg-yellow-100 px-2 py-1 text-yellow-800 cursor-pointer"
                      data-tooltip-id="insituStartupTooltip"
                      data-tooltip-content={`Device IDs: ${getDeviceIdsByStatus(
                        "insituStartup"
                      ).join(", ")}`}
                    >
                      STARTUP ({statusCounts.insituStartup})
                    </span>
                    <span
                      className="ml-2 rounded-lg bg-yellow-100 px-2 py-1 text-yellow-800 cursor-pointer"
                      data-tooltip-id="insituAquatroll500Tooltip"
                      data-tooltip-content={`Device IDs: ${getDeviceIdsByStatus(
                        "insituAquatroll500"
                      ).join(", ")}`}
                    >
                      AQUATROLL 500 ({statusCounts.insituAquatroll500})
                    </span>
                    <span
                      className="ml-2 rounded-lg bg-gray-100 px-2 py-1 text-gray-800 cursor-pointer"
                      data-tooltip-id="insituNATooltip"
                      data-tooltip-content={`Device IDs: ${getDeviceIdsByStatus(
                        "insituNA"
                      ).join(", ")}`}
                    >
                      N/A (
                      {clientData.length -
                        (statusCounts.insituNormal +
                          statusCounts.insituError +
                          statusCounts.insituPowerCycled +
                          statusCounts.insituStartup +
                          statusCounts.insituAquatroll500)}
                      )
                    </span>
                  </li>
                </ul>
                <Tooltip place="top" id="scanOnlineTooltip" />
                <Tooltip place="top" id="scanErrorTooltip" />
                <Tooltip place="top" id="batteryOnlineTooltip" />
                <Tooltip place="top" id="batteryOfflineTooltip" />
                <Tooltip place="top" id="insituNormalTooltip" />
                <Tooltip place="top" id="insituErrorTooltip" />
                <Tooltip place="top" id="insituPowerCycledTooltip" />
                <Tooltip place="top" id="insituStartupTooltip" />
                <Tooltip place="top" id="insituAquatroll500Tooltip" />
                <Tooltip place="top" id="insituNATooltip" />
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
