import { type ReactNode, createContext, useContext, useCallback, useMemo, useState } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import { GET_CURRENT_USER } from '../graphql/auth.queries';
import { AuthPage } from './AuthPage';

const TOKEN_KEY = 'access_token';

interface MeData {
  me: {
    id: string;
    username: string;
    name: string;
    avatarUrl: string | null;
    title: string | null;
  };
}

export interface AuthContextValue {
  user: MeData['me'] | null;
  loading: boolean;
  logout: () => void;
  handleAuthSuccess: (token: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthGate');
  }
  return ctx;
}

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const client = useApolloClient();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

  const { data, loading, refetch } = useQuery<MeData>(GET_CURRENT_USER, {
    skip: !token,
  });

  const user = data?.me ?? null;
  const isReady = !loading && token;

  const handleAuthSuccess = useCallback(
    (newToken: string) => {
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      void refetch();
      window.dispatchEvent(new Event('auth-changed'));
    },
    [refetch],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    void client.resetStore();
    window.dispatchEvent(new Event('auth-changed'));
  }, [client]);

  const contextValue: AuthContextValue = useMemo(
    () => ({
      user,
      loading,
      logout,
      handleAuthSuccess,
    }),
    [user, loading, logout, handleAuthSuccess],
  );

  // Still loading initial auth state
  if (!isReady && token) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-app-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
          <p className="text-sm text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // No token or no user — show auth page
  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // Authenticated — provide context and render children
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
