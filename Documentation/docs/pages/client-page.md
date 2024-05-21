# Client Page

The client page of the Adroit Manager Frontend is located at `iot-frontend/src/pages/client-page/[clientPage].tsx`. It displays detailed information about a specific client.

## Fetching Client ID

The client page fetches the client ID from the URL using the `fetchIdAndType` function:

```ts
function fetchIdAndType() {
  // Fetches ID from URL
  const pathname = usePathname();
  const parts = pathname ? pathname.split('/') : [];
  const id = parts[parts.length - 1]
    ? parseInt(parts[parts.length - 1] as string)
    : 0;

  // Determine the ID type based on the URL path
  const isClientId = parts.includes('client-page');
  const isDeviceId = parts.includes('device-info');
  const idType = isClientId ? 'client' : isDeviceId ? 'device' : '';

  return { id, type: idType };
}
```

This function extracts the ID from the URL and determines the ID type based on the URL path. If the URL includes "client-page", it sets the ID type as "client". If the URL includes "device-info", it sets the ID type as "device". Otherwise, the ID type is an empty string.

## Authentication Check

The client page requires authentication. It checks the authentication status using the `isLoading` and `isAuthenticated` variables.

```tsx
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
      {/* Client page content */}
    </>
  );
} else {
  return <LoginScreen />;
}
```

If `isLoading` is `true`, a `LoadingIndicator` component is rendered to indicate that the page is loading.

If `isAuthenticated` is `true`, the client page content is rendered, including the `SEO` component for setting the page title and description, and the `Header` component.

If `isAuthenticated` is `false`, the `LoginScreen` component is rendered, prompting the user to log in.

## Client Page Content

The client page displays various information about the client, such as:

- Client name
- Client ID
- Total devices associated with the client
- Metrics related to the client
- Sites where the client's IoT devices are deployed
- Basic client details

The specific implementation of rendering this information depends on the structure and data available in your application.
