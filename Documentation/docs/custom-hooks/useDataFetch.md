# useDataFetch

## Custom Hook

The `useDataFetch` custom hook is a utility hook that provides data fetching functionality and manages the fetched data state. It also handles loading state and persists the fetched data in local storage.

## File Path

The `useDataFetch` custom hook is located at the following path:
<br>
`iot-frontend/src/hooks/useDataFetch.ts`

## Usage

To use the `useDataFetch` custom hook, import it into your React component and call it within your component's body:

```tsx
import { useDataFetch } from './useDataFetch';

const MyComponent = () => {
  const { data, loading, hasFetchedData, fetchDataAndUpdate } = useDataFetch();

  // Use the fetched data, loading state, and fetchDataAndUpdate function as needed
  // ...

  return <div>{/* Component JSX */}</div>;
};

export default MyComponent;
```
