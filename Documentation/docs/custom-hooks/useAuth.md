# useAuth

## Custom Hook

The `useAuth` custom hook is a utility hook that provides authentication-related information and status based on the `useSession` hook from the `next-auth/react` library.

## File Path

The `useAuth` custom hook is located at the following path:
<br>
`iot-frontend/src/hooks/useAuth.ts`

```tsx
import { useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    session,
    status,
    isAuthenticated: status === 'authenticated',
    isUnauthenticated: status === 'unauthenticated',
    isLoading: status === 'loading',
  };
}
```

## Usage

To use the `useAuth` custom hook, import it into your React component and call it within your component's body:

```tsx
import { useAuth } from './useAuth';

const MyComponent = () => {
  const { session, status, isAuthenticated, isUnauthenticated, isLoading } =
    useAuth();

  // Use the authentication information and status as needed
  // ...

  return <div>{/* Component JSX */}</div>;
};

export default MyComponent;
```
