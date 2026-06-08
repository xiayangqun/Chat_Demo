import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';

export interface AuthFormData {
  username: string;
  displayName?: string;
  password: string;
}

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: AuthFormData) => Promise<void>;
  error: string | null;
  loading: boolean;
}

interface ValidationErrors {
  username?: string;
  displayName?: string;
  password?: string;
}

function validate(
  mode: 'login' | 'register',
  fields: AuthFormData,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!fields.username || fields.username.length < 3 || fields.username.length > 32) {
    errors.username = 'Username must be 3-32 characters';
  }

  if (mode === 'register') {
    if (!fields.displayName || fields.displayName.length < 1 || fields.displayName.length > 40) {
      errors.displayName = 'Display name must be 1-40 characters';
    }
  }

  if (!fields.password || fields.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
}

export function AuthForm({ mode, onSubmit, error, loading }: AuthFormProps) {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const fields: AuthFormData = {
      username: username.trim(),
      password,
      ...(mode === 'register' ? { displayName: displayName.trim() } : {}),
    };

    const errors = validate(mode, fields);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return;

    await onSubmit(fields);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Username */}
      <div className="flex flex-col gap-1.5">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          disabled={loading}
          className="h-11 rounded-lg border border-border bg-input-bg px-4 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent"
        />
        {submitted && validationErrors.username && (
          <p className="text-xs text-unread">{validationErrors.username}</p>
        )}
      </div>

      {/* Display Name (register only) */}
      {mode === 'register' && (
        <div className="flex flex-col gap-1.5">
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoComplete="name"
            disabled={loading}
            className="h-11 rounded-lg border border-border bg-input-bg px-4 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent"
          />
          {submitted && validationErrors.displayName && (
            <p className="text-xs text-unread">{validationErrors.displayName}</p>
          )}
        </div>
      )}

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          disabled={loading}
          className="h-11 rounded-lg border border-border bg-input-bg px-4 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent"
        />
        {submitted && validationErrors.password && (
          <p className="text-xs text-unread">{validationErrors.password}</p>
        )}
      </div>

      {/* Server error */}
      {error && (
        <p className="text-center text-sm text-unread">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="mt-1 flex h-11 items-center justify-center rounded-lg bg-accent font-body text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : mode === 'login' ? (
          'Log in'
        ) : (
          'Sign up'
        )}
      </button>
    </form>
  );
}
