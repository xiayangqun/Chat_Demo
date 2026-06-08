import { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { MessageCircle } from 'lucide-react';
import { AuthForm } from './AuthForm';
import type { AuthFormData } from './AuthForm';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '../graphql/auth.mutations';

interface AuthPageProps {
  onAuthSuccess: (token: string) => void;
}

interface AuthPayload {
  token: string;
  user: {
    id: string;
    username: string;
    name: string;
    avatarUrl: string | null;
    title: string | null;
  };
}

interface LoginData {
  login: AuthPayload;
}

interface RegisterData {
  register: AuthPayload;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);

  const [loginMutation, { loading: loginLoading }] = useMutation<LoginData>(LOGIN_MUTATION);
  const [registerMutation, { loading: registerLoading }] = useMutation<RegisterData>(REGISTER_MUTATION);

  const loading = loginLoading || registerLoading;

  const handleSubmit = useCallback(
    async (data: AuthFormData) => {
      setError(null);

      try {
        if (mode === 'login') {
          const result = await loginMutation({
            variables: {
              input: {
                username: data.username,
                password: data.password,
              },
            },
          });

          if (result.data?.login.token) {
            onAuthSuccess(result.data.login.token);
          }
        } else {
          const result = await registerMutation({
            variables: {
              input: {
                username: data.username,
                displayName: data.displayName ?? '',
                password: data.password,
              },
            },
          });

          if (result.data?.register.token) {
            onAuthSuccess(result.data.register.token);
          }
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(message);
      }
    },
    [mode, loginMutation, registerMutation, onAuthSuccess],
  );

  return (
    <div className="flex min-h-dvh items-center justify-center bg-app-bg px-4">
      <div className="flex w-full max-w-[400px] flex-col rounded-lg border border-border bg-panel p-8">
        {/* Logo + brand */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <span className="font-body text-lg font-semibold text-text-primary">
            Gradual Community
          </span>
        </div>

        {/* Mode tabs */}
        <div className="mb-6 flex rounded-lg border border-border bg-input-bg p-1">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === 'login'
                ? 'bg-panel text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === 'register'
                ? 'bg-panel text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            Sign up
          </button>
        </div>

        {/* Form */}
        <AuthForm
          mode={mode}
          onSubmit={handleSubmit}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  );
}
