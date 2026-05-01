import React, { useMemo, useState } from 'react';
import {
  Cake,
  Clock,
  Gift,
  LaptopMinimal,
  PartyPopper,
  Plus,
  Sparkles,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import DashboardEvents from './dashboard/DashboardEvents';
import ProfilePreviewModal from './organization/components/ProfilePreviewModal';
import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '../services/dashboard';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function ProgressRing({ label, value = 0.45 }) {
  const pct = Math.max(0, Math.min(1, value));
  const deg = Math.round(pct * 360);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cx(
          'relative grid h-20 w-20 place-items-center rounded-full',
          'bg-[conic-gradient(from_180deg,hsl(173_80%_40%)_0deg,hsl(173_80%_40%)_var(--deg),rgba(148,163,184,0.18)_var(--deg),rgba(148,163,184,0.18)_360deg)]'
        )}
        style={{ ['--deg']: `${deg}deg` }}
      >
        <div className="grid h-[64px] w-[64px] place-items-center rounded-full bg-slate-900">
          <div className="text-xs font-semibold text-slate-100">{Math.round(pct * 100)}%</div>
        </div>
      </div>
      <div className="text-xs font-medium text-slate-200">{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState('organization');
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
  });

  const displayName = dashboardData?.employee?.display_name || '—';

  const treeSvg = useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="1200" viewBox="0 0 520 1200">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#0b1220" stop-opacity="0.0"/>
      <stop offset="0.55" stop-color="#0b1220" stop-opacity="0.7"/>
      <stop offset="1" stop-color="#0b1220" stop-opacity="0.0"/>
    </linearGradient>
  </defs>
  <rect width="520" height="1200" fill="url(#g)"/>
  <g fill="none" stroke="#94a3b8" stroke-opacity="0.12" stroke-width="10" stroke-linecap="round">
    <path d="M330 1120 C 330 980, 310 890, 270 810 C 235 740, 220 690, 210 640" />
    <path d="M270 810 C 305 775, 345 745, 388 720" />
    <path d="M255 765 C 225 735, 190 710, 150 690" />
    <path d="M210 640 C 245 600, 295 565, 360 535" />
    <path d="M220 690 C 200 660, 175 640, 145 625" />
  </g>
  <g fill="#94a3b8" fill-opacity="0.06">
    <circle cx="388" cy="720" r="34"/>
    <circle cx="150" cy="690" r="28"/>
    <circle cx="360" cy="535" r="46"/>
    <circle cx="145" cy="625" r="30"/>
  </g>
</svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, []);

  return (
    <div className="relative">
      {/* Global page styling: deep slate background + watermark */}
      <div className="absolute inset-0 -z-10 bg-slate-900" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-[38%] opacity-40"
        style={{
          backgroundImage: `url("${treeSvg}")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
          backgroundSize: 'cover',
        }}
      />

      {/* In-page header tabs: Dashboard / Welcome */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-slate-700 bg-slate-800 p-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cx(
                'rounded-md px-4 py-2 text-sm font-semibold',
                isActive
                  ? 'bg-slate-900 text-slate-50 shadow-sm'
                  : 'text-slate-300 hover:text-slate-50'
              )
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/welcome"
            className={({ isActive }) =>
              cx(
                'rounded-md px-4 py-2 text-sm font-semibold',
                isActive
                  ? 'bg-slate-900 text-slate-50 shadow-sm'
                  : 'text-slate-300 hover:text-slate-50'
              )
            }
          >
            Welcome
          </NavLink>
        </div>
      </div>

      {/* Top Banner */}
      <section
        className={cx(
          'w-full overflow-hidden rounded-2xl border border-slate-800',
          'bg-[radial-gradient(1200px_circle_at_0%_0%,rgba(168,85,247,0.22),transparent_55%),radial-gradient(900px_circle_at_90%_20%,rgba(59,130,246,0.14),transparent_55%),linear-gradient(135deg,rgba(15,23,42,1),rgba(2,6,23,1))]'
        )}
      >
        <div className="flex items-center justify-between gap-6 px-6 py-6 sm:px-7">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300/80">
              Dashboard
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50">
              Welcome <span className="inline-block min-w-[8ch]">{displayName}</span>!
            </h1>
            <p className="mt-1 text-sm text-slate-300/80">
              Here’s what’s happening in your organization today.
            </p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="rounded-xl border border-slate-700/70 bg-slate-950/30 px-3 py-2 text-xs text-slate-300">
              Last updated: Just now
            </div>
          </div>
        </div>
      </section>

      {/* Layout: 2-column grid (30% / remaining) */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(280px,30%)_1fr]">
        {/* Left column: Quick Access */}
        <aside className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-100">Quick Access</div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-800/60 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800"
            >
              <Plus className="h-4 w-4 text-slate-300" />
              Add
            </button>
          </div>

          {/* Holidays (purple-themed card) */}
          <div className="rounded-lg border border-slate-700 bg-purple-900/50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-purple-200/80">
                  Holiday
                </div>
                <div className="mt-1 text-base font-semibold text-slate-50">Rakshabandhan</div>
                <div className="mt-1 text-sm text-purple-100/80">Mon, 31 Aug 2026</div>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-purple-500/15 ring-1 ring-purple-400/30">
                <Gift className="h-5 w-5 text-purple-200" />
              </div>
            </div>
          </div>

          {/* On Leave */}
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950/30 ring-1 ring-slate-700/70">
                <PartyPopper className="h-5 w-5 text-slate-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-100">On Leave</div>
                <div className="mt-0.5 text-sm text-slate-400">Everyone is working today!</div>
              </div>
            </div>
          </div>

          {/* Working Remotely */}
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950/30 ring-1 ring-slate-700/70">
                <LaptopMinimal className="h-5 w-5 text-slate-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-100">Working Remotely</div>
                <div className="mt-0.5 text-sm text-slate-400">Everyone is at office!</div>
              </div>
            </div>
          </div>

          {/* Time Today */}
          <div className="rounded-lg border border-purple-400/20 bg-purple-600 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-purple-100/90">
                  Time Today
                </div>
                <div className="mt-2 text-3xl font-semibold tracking-tight text-white">12:34 PM</div>
                <div className="mt-1 text-sm text-purple-100/90">Thu, 23 Apr 2026</div>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 ring-1 ring-white/15">
                <Clock className="h-5 w-5 text-white/90" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-xs text-purple-100/80">
                You’re currently clocked in.
              </div>
              <button
                type="button"
                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-500"
              >
                Clock-out
              </button>
            </div>
          </div>

          {/* Leave Balances */}
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-100">Leave Balances</div>
                <div className="mt-0.5 text-sm text-slate-400">Overview of your leave types</div>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-950/30 ring-1 ring-slate-700/70">
                <Sparkles className="h-4 w-4 text-slate-300" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <ProgressRing label="Unpaid" value={0.22} />
              <ProgressRing label="Sick" value={0.58} />
              <ProgressRing label="Paid" value={0.75} />
            </div>
          </div>
        </aside>

        {/* Right column */}
        <section className="space-y-4">
          {/* Tabs */}
          <div className="inline-flex rounded-lg border border-slate-700 bg-slate-800 p-1">
            <button
              type="button"
              onClick={() => setTab('organization')}
              className={cx(
                'rounded-md px-4 py-2 text-sm font-semibold',
                tab === 'organization'
                  ? 'bg-slate-900 text-slate-50 shadow-sm'
                  : 'text-slate-300 hover:text-slate-50'
              )}
            >
              Organization
            </button>
            <button
              type="button"
              onClick={() => setTab('web')}
              className={cx(
                'rounded-md px-4 py-2 text-sm font-semibold',
                tab === 'web'
                  ? 'bg-slate-900 text-slate-50 shadow-sm'
                  : 'text-slate-300 hover:text-slate-50'
              )}
            >
              Web
            </button>
          </div>

          {/* Composer */}
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-100"
                >
                  Post
                </button>
                <button
                  type="button"
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900/60 hover:text-slate-100"
                >
                  Poll
                </button>
                <button
                  type="button"
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900/60 hover:text-slate-100"
                >
                  Praise
                </button>
              </div>
              <button
                type="button"
                className="rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground hover:brightness-110"
              >
                Publish
              </button>
            </div>

            <div className="mt-3">
              <textarea
                rows={4}
                placeholder="Write your post here..."
                className={cx(
                  'w-full resize-none rounded-lg border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-100',
                  'placeholder:text-slate-400',
                  'focus:outline-none focus:ring-2 focus:ring-accent/35'
                )}
              />
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <div>Share updates, announcements, or praise.</div>
                <div>0/500</div>
              </div>
            </div>
          </div>

          {/* Birthdays / Anniversaries */}
          <DashboardEvents onOpenProfile={(id) => setSelectedUserId(id)} />
        </section>
      </div>

      <ProfilePreviewModal
        open={selectedUserId != null}
        employeeId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />
    </div>
  );
}

