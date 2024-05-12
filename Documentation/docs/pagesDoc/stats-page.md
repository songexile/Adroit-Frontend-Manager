# Stats Page

`pages/device-info/[DeviceID]`

The Stats Page displays detailed information about a specific device, including device information, current status, important metrics, and the ability to create a ticket for the device.

This page can be accessed through the dashboard (root link) by clicking on the three dots on the left side and then clicking `View device stats`. This will then open up page.

<h3>Device Information:</h3>
The Device Information section provides key details about the device, including its ID, key, client name, last online status, and location.

<h3>Create Ticket:</h3>
The Create Ticket button allows users to create a ticket for the device, redirecting them to the Create Ticket page where they can fill out the necessary details.

<h3>Current Status:</h3>
The Current Status section displays the current status of the device, including its scan status, battery status, and insitu status. Each status is represented by a corresponding icon and color for easy identification.

<h3>Gauge Chart:</h3>
The Gauge Chart provides a visual representation of some important metrics for the device. These metrics are crucial for monitoring the device's performance and health.

<h3>Fault Identification:</h3>
The Fault Identification section lists important metrics that can help identify potential issues with the device. These metrics are highlighted in red for easy identification.

<h3>All Metrics:</h3>
The All Metrics section displays all available metrics for the device. Each metric is listed with its corresponding value.


## Functions

### Main rendering function
```js
function DeviceID(data: any) {
  const { isAuthenticated, isLoading } = useAuth();

  const deviceId = fetchDeviceId();

  const filteredData = useMemo(() => flattenNestedData(data, deviceId), [data, deviceId]);
  const deviceData = filteredData[0];

  // console.log(deviceData); // Returns the array of the device.

  const title = `Check Device | ${deviceId} | Adroit Front End Manager`;
  const description = `Device Info Page for Device ID: ${deviceId}`;

  // Breadcrumb items
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: `Device ${deviceData?.device_id}`, path: `/device-info/${deviceData?.device_id}` }, // Adjusted path to include device_id
  ];

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
        <SEO
          title={title}
          description={description}
        />
        <Header />
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <div className="flex mx-8 md:mx-32 min-h-screen py-6 flex-col ">
          {deviceData && debugMetrics(deviceData)}
        </div>
        <Footer />
      </>
    );
  } else {
    return <LoginScreen />;
  }
}
```

This function checks if the user is authenticated, it grabs the device ID and then passes in the flattened data for that device.