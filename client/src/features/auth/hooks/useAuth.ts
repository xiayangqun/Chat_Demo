import { useCallback, useMemo } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import { GET_CURRENT_USER } from '../graphql/auth.queries';

export interface User {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  title: string | null;
}

interface MeQueryData {
  me: User;
}

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  logout: () => void;
  handleAuthSuccess: (token: string) => void;
}

const TOKEN_KEY = 'access_token';

export function useAuth(): UseAuthReturn {
  const client = useApolloClient();
  const token = useMemo(() => localStorage.getItem(TOKEN_KEY), []);

  const {
    data,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery<MeQueryData>(GET_CURRENT_USER, {
    skip: !token,
  });

  const loading = queryLoading;
  const error = queryError?.message ?? null;
  const user = data?.me ?? null;

  const handleAuthSuccess = useCallback(
    (newToken: string) => {
      localStorage.setItem(TOKEN_KEY, newToken);
      void refetch();
    },
    [refetch],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    void client.resetStore();
  }, [client]);

  return useMemo(
    () => ({ user, loading, error, logout, handleAuthSuccess }),
    [user, loading, error, logout, handleAuthSuccess],
  );
}
