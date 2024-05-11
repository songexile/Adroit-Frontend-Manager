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

  const getDeviceIdsByMetric = (metricName: string) => {
    return clientData
      .filter((device) => {
        return device[`metric_${metricName}`] !== undefined;
      })
      .map((device) => device.device_id);
  };

  const getDeviceIdsBySite = (siteName: string) => {
    return clientData
      .filter((device) => {
        const siteValue = device.metric_SITE;
        if (typeof siteValue === "string") {
          return siteValue === siteName;
        } else if (typeof siteValue === "object" && "value" in siteValue) {
          return siteValue.value === siteName;
        }
        return false;
      })
      .map((device) => device.device_id);
  };

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
        if (insituStatus === status) return true;

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

  console.log(clientData);

  if (!clientData) return null;

  // Get client name, ID, and total devices
  const clientName =
    clientData.length > 0 ? clientData[0]?.client_name || "" : "";
  const clientId = clientData.length > 0 ? clientData[0]?.client_id || "" : "";
  const totalDevices = clientData.length;
  const title = `Client Info | ${clientId} | Adroit Front End Manager`;
  const description = `Client Info Page for Device ID: ${clientId}`;

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
              {/* Client Normal Detail */}
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

              {/* Metrics */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-gray-100 p-4">
                  <h3 className="mb-2 text-xl font-semibold">Metrics</h3>
                  <ul className="list-inside list-disc">
                    {metricCountsArray.map(({ metricName, count }) => (
                      <li
                        key={metricName}
                        className="cursor-pointer"
                        data-tooltip-id={`metric-${metricName}-tooltip`}
                        data-tooltip-content={`Devices with ${metricName}: ${getDeviceIdsByMetric(
                          metricName
                        ).join(", ")}`}
                      >
                        {metricName} ({count})
                      </li>
                    ))}
                  </ul>
                  {metricCountsArray.map(({ metricName }) => (
                    <Tooltip
                      key={metricName}
                      place="top"
                      id={`metric-${metricName}-tooltip`}
                    />
                  ))}
                </div>

                {/* Sites */}
                <div className="rounded-lg bg-gray-100 p-4">
                  <h3 className="mb-2 text-xl font-semibold">Sites</h3>
                  <ul className="list-inside list-disc">
                    {siteCountsArray.map(({ siteName, count }) => (
                      <li
                        key={siteName}
                        className="cursor-pointer"
                        data-tooltip-id={`site-${siteName}-tooltip`}
                        data-tooltip-content={`Devices at ${siteName}: ${getDeviceIdsBySite(
                          siteName
                        ).join(", ")}`}
                      >
                        {siteName} ({count})
                      </li>
                    ))}
                  </ul>
                  {siteCountsArray.map(({ siteName }) => (
                    <Tooltip
                      key={siteName}
                      place="top"
                      id={`site-${siteName}-tooltip`}
                    />
                  ))}
                </div>
              </div>

              {/* Statuses */}
              <div>
                <h3 className="mb-4 text-xl font-bold">Status</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {/* Scan Status */}
                  <li>
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
                    {Object.entries(statusCounts)
                      .filter(
                        ([status]) =>
                          status.startsWith("metric_scanStatus") &&
                          status !== "scanOnline" &&
                          status !== "scanError"
                      )
                      .map(([status, count]) => (
                        <span
                          key={status}
                          className="ml-2 rounded-lg bg-yellow-100 px-2 py-1 text-yellow-800 cursor-pointer"
                          data-tooltip-id={`${status}Tooltip`}
                          data-tooltip-content={`Device IDs: ${getDeviceIdsByStatus(
                            status
                          ).join(", ")}`}
                        >
                          {status.replace("scan", "")} ({count})
                        </span>
                      ))}
                    <span
                      className="ml-2 rounded-lg bg-gray-100 px-2 py-1 text-gray-800 cursor-pointer"
                      data-tooltip-id="scanNATooltip"
                      data-tooltip-content={`Device IDs: ${getDeviceIdsByStatus(
                        "N/A"
                      ).join(", ")}`}
                    >
                      N/A ({getDeviceIdsByStatus("N/A").length})
                    </span>
                  </li>
                  {/* Battery Status */}
                  <li>
                    Battery:
                    <span
                      className="ml-2 rounded-lg bg-green-100 px-2 py-1 text-green-800 cursor-pointer"
                      data-tooltip-id="batteryOnlineTooltip"
                      data-tooltip-content={`Device IDs: ${getDeviceIdsByStatus(
                        "batteryOnline"
                      ).join(", ")}`}
                    >
                      ONLINE ({getDeviceIdsByStatus("batteryOnline").length})
                    </span>
                    <span
                      className="ml-2 rounded-lg bg-red-100 px-2 py-1 text-red-800 cursor-pointer"
                      data-tooltip-id="batteryOfflineTooltip"
                      data-tooltip-content={`Device IDs: ${getDeviceIdsByStatus(
                        "batteryOffline"
                      ).join(", ")}`}
                    >
                      OFFLINE ({getDeviceIdsByStatus("batteryOffline").length})
                    </span>
                    {Object.entries(statusCounts)
                      .filter(
                        ([status]) =>
                          status.startsWith("metric_batt status") &&
                          status !== "batteryOnline" &&
                          status !== "batteryOffline"
                      )
                      .map(([status, count]) => (
                        <span
                          key={status}
                          className="ml-2 rounded-lg bg-yellow-100 px-2 py-1 text-yellow-800 cursor-pointer"
                          data-tooltip-id={`${status}Tooltip`}
                          data-tooltip-content={`Device IDs: ${getDeviceIdsByStatus(
                            status
                          ).join(", ")}`}
                        >
                          {status.replace("battery", "")} ({count})
                        </span>
                      ))}
                    <span
                      className="ml-2 rounded-lg bg-gray-100 px-2 py-1 text-gray-800 cursor-pointer"
                      data-tooltip-id="batteryNATooltip"
                      data-tooltip-content={`Device IDs: ${getDeviceIdsByStatus(
                        "N/A"
                      ).join(", ")}`}
                    >
                      N/A ({getDeviceIdsByStatus("N/A").length})
                    </span>
                  </li>
                  {/* Insitu Status */}
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
                    {Object.entries(statusCounts)
                      .filter(
                        ([status]) =>
                          status !== "scanOnline" &&
                          status !== "scanError" &&
                          status !== "batteryOnline" &&
                          status !== "batteryOffline" &&
                          status !== "insituNormal" &&
                          status !== "insituError" &&
                          status !== "N/A"
                      )
                      .map(([status, count]) => (
                        <span
                          key={status}
                          className="ml-2 rounded-lg bg-yellow-100 px-2 py-1 text-yellow-800 cursor-pointer"
                          data-tooltip-id={`${status}Tooltip`}
                          data-tooltip-content={`Device IDs: ${getDeviceIdsByStatus(
                            status
                          ).join(", ")}`}
                        >
                          {status} ({count})
                        </span>
                      ))}
                    <span
                      className="ml-2 rounded-lg bg-gray-100 px-2 py-1 text-gray-800 cursor-pointer"
                      data-tooltip-id="insituNATooltip"
                      data-tooltip-content={`Device IDs: ${getDeviceIdsByStatus(
                        "N/A"
                      ).join(", ")}`}
                    >
                      N/A ({getDeviceIdsByStatus("N/A").length})
                    </span>
                  </li>
                </ul>

                <Tooltip place="top" id="scanOnlineTooltip" />
                <Tooltip place="top" id="scanErrorTooltip" />
                {Object.entries(statusCounts)
                  .filter(
                    ([status]) =>
                      status.startsWith("metric_scanStatus") &&
                      status !== "scanOnline" &&
                      status !== "scanError" &&
                      status !== "N/A"
                  )
                  .map(([status]) => (
                    <Tooltip key={status} place="top" id={`${status}Tooltip`} />
                  ))}
                <Tooltip place="top" id="scanNATooltip" />

                <Tooltip place="top" id="batteryOnlineTooltip" />
                <Tooltip place="top" id="batteryOfflineTooltip" />
                {Object.entries(statusCounts)
                  .filter(
                    ([status]) =>
                      status.startsWith("metric_batt status") &&
                      status !== "batteryOnline" &&
                      status !== "batteryOffline" &&
                      status !== "N/A"
                  )
                  .map(([status]) => (
                    <Tooltip key={status} place="top" id={`${status}Tooltip`} />
                  ))}
                <Tooltip place="top" id="batteryNATooltip" />

                <Tooltip place="top" id="insituNormalTooltip" />
                <Tooltip place="top" id="insituErrorTooltip" />
                {Object.entries(statusCounts)
                  .filter(
                    ([status]) =>
                      status !== "scanOnline" &&
                      status !== "scanError" &&
                      status !== "batteryOnline" &&
                      status !== "batteryOffline" &&
                      status !== "insituNormal" &&
                      status !== "insituError" &&
                      status !== "N/A"
                  )
                  .map(([status]) => (
                    <Tooltip key={status} place="top" id={`${status}Tooltip`} />
                  ))}
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
