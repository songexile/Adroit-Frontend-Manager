import { useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession()

  return {
    session,
    status,
    isAuthenticated: status === 'authenticated',
    isUnauthenticated: status === 'unauthenticated',
    isLoading: status === 'loading',
  };
}
