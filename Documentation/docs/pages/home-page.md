# Home Page

The homepage of the Adroit Frontend Manager is located at `iot-frontend/src/pages/index.tsx`. It serves as the main entry point for the application.

## Authentication Check

The homepage first checks the authentication status of the user using the `isLoading` and `isAuthenticated` variables.

- If `isLoading` is `true`, it means the authentication status is still being determined. In this case, a `LoadingIndicator` component is rendered to indicate that the page is loading.

```ts
if (isLoading) {
  return (
    <>
      <LoadingIndicator />
    </>
  );
}
```

- If `isAuthenticated` is `false`, it means the user is not `authenticated`. In this case, the `LandingPage` component is rendered, which represents the landing page of the application. For more information about the landing page, refer to the Landing Page Documentation.

```ts
if (!isAuthenticated) {
  return <LandingPage />;
}
```

## Main Content

If the user is authenticated (`isAuthenticated` is `true`), the main content of the homepage is rendered.

```ts
return (
  <div className='w-full flex flex-col'>
    <Header
      fetchDataAndUpdate={fetchDataAndUpdate}
      searchByClientName={searchByClientName}
      setSearchByClientName={setSearchByClientName}
      searchByDeviceKey={searchByDeviceKey}
      setSearchByDeviceKey={setSearchByDeviceKey}
      totalDevicesOfflineCount={totalDevicesOfflineCount}
      clientsOfflineCount={clientsOfflineCount}
    />
    <DataTable columns={columns} data={filteredData || []} />
    <Footer />
  </div>
);
```

The main content consists of the following components:

1. `Header`: The header component of the application. It receives several props for data fetching, searching, and displaying offline device counts. For more information about the header component, refer to the Header Component Documentation.

2. `DataTable`: The data table component that displays the main data of the application. It receives the `columns` and `data` props, which define the structure and content of the table. The `data` prop is populated with `filteredData` if available, otherwise an empty array is used.

3. `Footer`: The footer component of the application.

# Data Fetching and Filtering

The homepage performs data fetching and filtering based on the `fetchDataAndUpdate` function and the search inputs (`searchByClientName` and `searchByDeviceKey`).

- The `fetchDataAndUpdate` function is responsible for fetching the latest data from the server and updating the application state accordingly.
- The `searchByClientName` and `searchByDeviceKey` variables hold the current search input values for filtering the data based on client name and device key, respectively.
- The `setSearchByClientName` and `setSearchByDeviceKey` functions are used to update the search input values when the user types in the search fields.
- The `totalDevicesOfflineCount` and `clientsOfflineCount` variables hold the counts of offline devices and clients, respectively, which are displayed in the header component.

The fetched data is stored in the `filteredData` variable, which is passed to the `DataTable` component for rendering.
