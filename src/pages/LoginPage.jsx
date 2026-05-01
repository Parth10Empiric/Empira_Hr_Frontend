import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login, toSession } from '../services/auth';
import { setSession } from '../services/storage';
import { normalizeApiError } from '../services/errors';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => {
    const state = location.state;
    if (state && typeof state === 'object' && 'from' in state) return state.from;
    return '/';
  }, [location.state]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const loginMutation = useMutation({
    mutationFn: (body) => login(body),
    onSuccess: (data) => {
      setFormError('');
      setFieldErrors({});
      setSession(toSession(data));
      try {
        window.localStorage.setItem('empira.remember', remember ? '1' : '0');
      } catch {
        // ignore
      }
      navigate(from, { replace: true });
    },
    onError: (err) => {
      const n = normalizeApiError(err);
      setFormError(n.message);
      setFieldErrors(n.fieldErrors || {});
    },
  });

  const emailError = fieldErrors?.work_email?.[0] || '';
  const passwordError = fieldErrors?.password?.[0] || '';

  const onSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setFieldErrors({});

    const work_email = String(email || '').trim();
    const pw = String(password || '');
    const nextFieldErrors = {};

    if (!work_email) nextFieldErrors.work_email = ['Work email is required.'];
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(work_email))
      nextFieldErrors.work_email = ['Enter a valid email address.'];

    if (!pw) nextFieldErrors.password = ['Password is required.'];
    else if (pw.length < 6) nextFieldErrors.password = ['Password must be at least 6 characters.'];

    if (Object.keys(nextFieldErrors).length) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    loginMutation.mutate({ work_email, password: pw });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Subtle modern background that respects theme */}
      <div
        aria-hidden="true"
        className={cx(
          'pointer-events-none fixed inset-0 -z-10',
          'bg-[radial-gradient(900px_circle_at_20%_10%,hsl(var(--accent-soft)),transparent_55%),radial-gradient(700px_circle_at_80%_20%,hsl(var(--accent-soft)),transparent_60%)]'
        )}
      />

      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-10">
        <div className="w-full">
          <div className="rounded-2xl border border-border/60 bg-card/70 p-7 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            {/* Logo placeholder */}
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft ring-1 ring-accent/25">
                <div className="h-5 w-5 rounded-md bg-accent" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-medium text-muted-foreground">EMPIRA</div>
                <div className="text-base font-semibold tracking-tight">HR Suite</div>
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Sign in to continue to your workspace.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {formError ? (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                >
                  {formError}
                </div>
              ) : null}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  aria-invalid={Boolean(emailError) || undefined}
                  aria-describedby={emailError ? 'login-email-error' : undefined}
                  className={cx(
                    'h-11 w-full rounded-xl border border-input/70 bg-background/50 px-3 text-sm outline-none',
                    'placeholder:text-muted-foreground/70',
                    'shadow-sm shadow-black/5',
                    'focus:border-accent/70 focus:ring-2 focus:ring-accent/35 focus:ring-offset-0'
                  )}
                />
                <div className="min-h-[18px] text-xs text-red-200" id="login-email-error">
                  {emailError || ''}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  aria-invalid={Boolean(passwordError) || undefined}
                  aria-describedby={passwordError ? 'login-password-error' : undefined}
                  className={cx(
                    'h-11 w-full rounded-xl border border-input/70 bg-background/50 px-3 text-sm outline-none',
                    'placeholder:text-muted-foreground/70',
                    'shadow-sm shadow-black/5',
                    'focus:border-accent/70 focus:ring-2 focus:ring-accent/35 focus:ring-offset-0'
                  )}
                />
                <div className="min-h-[18px] text-xs text-red-200" id="login-password-error">
                  {passwordError || ''}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-input bg-background accent-accent"
                  />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className={cx(
                  'mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl',
                  'bg-accent text-accent-foreground',
                  'font-semibold tracking-tight',
                  'shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)]',
                  'transition',
                  'hover:brightness-110 active:brightness-95',
                  'focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-0',
                  loginMutation.isPending ? 'opacity-90' : ''
                )}
              >
                {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By signing in, you agree to our{' '}
            <a className="underline underline-offset-4 hover:text-foreground" href="#">
              Terms
            </a>{' '}
            and{' '}
            <a className="underline underline-offset-4 hover:text-foreground" href="#">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

