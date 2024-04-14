import { useSession } from 'next-auth/react';

export function useAuth() {
  const { status } = useSession();

  return {
    isAuthenticated: status === 'authenticated',
    isUnauthenticated: status === 'unauthenticated',
  };
}
