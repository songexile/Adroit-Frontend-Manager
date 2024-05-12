# Navbar

## Header Component

The `Header` component is a reusable component that provides a navigation bar with search functionality and displays offline device counts.

## File Path

The `Header` component is located at the following path: 
<br>
`iot-frontend/src/components/Header.tsx`

## Props

The `Header` component accepts the following props:

| Prop                     | Type                      | Description                                                           |
|--------------------------|---------------------------|-----------------------------------------------------------------------|
| `fetchDataAndUpdate?`     | `() => Promise<void>`     | Function to fetch data and update the component.                      |
| `searchByClientName?`     | `string`                  | Current value of the client name search input.                        |
| `setSearchByClientName?`  | `(value: string) => void` | Function to update the client name search input value.                |
| `searchByDeviceKey?`      | `string`                  | Current value of the device key search input.                         |
| `setSearchByDeviceKey?`   | `(value: string) => void` | Function to update the device key search input value.                 |
| `totalDevicesOfflineCount?` | `number`                | Total count of offline devices.                                       |
| `clientsOfflineCount?`    | `number`                  | Count of offline clients.                                             |

## Usage

To use the `Header` component, import it into your React component and pass the required props:

```jsx
import Header from '@/components/Header';

const MyComponent = () => {
  // ...

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
      {/* Other components */}
    </div>
  );
};