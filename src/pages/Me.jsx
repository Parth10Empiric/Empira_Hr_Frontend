import React, { useEffect, useMemo, useState } from 'react';
import {
  Coffee,
  FileText,
  Home,
  Info,
  User,
  Users,
} from 'lucide-react';
import LogsRequests from './me/LogsRequests.jsx';
import LeaveSummary from './me/LeaveSummary.jsx';
import MeSectionTabBar from './me/MeSectionTabBar.jsx';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

const TABS = [
  { id: 'attendance', label: 'ATTENDANCE' },
  { id: 'leave', label: 'LEAVE' },
  { id: 'performance', label: 'PERFORMANCE' },
  { id: 'expenses', label: 'EXPENSES & TRAVEL' },
  { id: 'apps', label: 'APPS' },
];

function MetricCard({ children, className }) {
  return (
    <div
      className={cx(
        'relative rounded-xl border border-[#2a3447] bg-[#1b2333] font-sans text-gray-100',
        className
      )}
    >
      {children}
    </div>
  );
}

function AttendanceStatic() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const activeDayIndex = useMemo(() => {
    const js = now.getDay();
    return js === 0 ? 6 : js - 1;
  }, [now]);

  const timeStr = useMemo(() => {
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }, [now]);

  const dateStr = useMemo(() => {
    return now.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }, [now]);

  const rows = useMemo(
    () => [
      {
        id: '1',
        date: 'Wed, 29 Apr',
        badge: null,
        spanText: null,
        segmentCount: 3,
        effective: '0h 7m',
        gross: '0h 7m',
        effectiveDot: 'hollow',
        arrival: 'On Time',
        logKind: 'warning',
      },
      {
        id: '2',
        date: 'Tue, 28 Apr',
        badge: null,
        spanText: null,
        segmentCount: 8,
        effective: '3h 57m',
        gross: '4h 28m',
        effectiveDot: 'hollow',
        arrival: 'On Time',
        logKind: 'check',
      },
      {
        id: '3',
        date: 'Mon, 27 Apr',
        badge: null,
        spanText: null,
        segmentCount: 10,
        effective: '8h 28m',
        gross: '9h 03m',
        effectiveDot: 'solid',
        arrival: 'On Time',
        logKind: 'check',
      },
      {
        id: '4',
        date: 'Sun, 26 Apr',
        badge: 'W-OFF',
        spanText: 'Full day Weekly-off',
        logKind: 'dots',
      },
      {
        id: '5',
        date: 'Sat, 25 Apr',
        badge: 'W-OFF',
        spanText: 'Full day Weekly-off',
        logKind: 'dots',
      },
      {
        id: '6',
        date: 'Fri, 24 Apr',
        badge: 'LEAVE',
        spanText: 'Paid Leave',
        logKind: 'dots',
      },
    ],
    []
  );

  return (
    <div className="space-y-6 rounded-b-xl rounded-t-none bg-[#151b2b] px-0 pb-4 pt-0 font-sans antialiased sm:pb-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <MetricCard className="p-5">
          <button
            type="button"
            className="absolute right-4 top-4 rounded p-0.5 text-gray-400 transition-colors hover:text-gray-200"
            aria-label="Info"
          >
            <Info className="h-4 w-4" strokeWidth={1.75} />
          </button>

          <div className="flex items-start justify-between gap-3 pr-8">
            <div className="text-sm font-semibold tracking-tight text-gray-100">Attendance Stats</div>
            <button
              type="button"
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-[#2a3447] bg-[#151b2b] px-3 text-xs font-medium text-gray-300 transition-colors hover:bg-[#20293c] hover:text-gray-100"
            >
              Last Week
              <span className="text-[10px] text-gray-400">▾</span>
            </button>
          </div>

          <div className="mt-5 space-y-0 divide-y divide-[#2a3447]">
            {[
              {
                label: 'Me',
                hours: '8h 34m',
                pct: '100%',
                icon: User,
                iconWrap: 'bg-yellow-500/20 text-yellow-500',
              },
              {
                label: 'My Team',
                hours: '8h 25m',
                pct: '100%',
                icon: Users,
                iconWrap: 'bg-blue-500/20 text-blue-500',
              },
            ].map((x) => {
              const RowIcon = x.icon;
              return (
                <div key={x.label} className="flex items-center justify-between gap-4 py-4 first:pt-0">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cx(
                      'grid h-10 w-10 shrink-0 place-items-center rounded-full',
                      x.iconWrap
                    )}
                  >
                    <RowIcon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </div>
                  <span className="truncate text-sm font-semibold text-gray-100">{x.label}</span>
                </div>

                <div className="flex shrink-0 items-start gap-8 text-right sm:gap-10">
                  <div>
                    <div className="text-[10px] font-medium uppercase leading-tight tracking-wide text-gray-400">
                      AVG HRS / DAY
                    </div>
                    <div className="mt-1 text-sm font-bold tabular-nums tracking-tight text-gray-100">
                      {x.hours}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-medium uppercase leading-tight tracking-wide text-gray-400">
                      ON TIME ARRIVAL
                    </div>
                    <div className="mt-1 text-sm font-bold tabular-nums tracking-tight text-gray-100">
                      {x.pct}
                    </div>
                  </div>
                </div>
                </div>
              );
            })}
          </div>
        </MetricCard>

        <MetricCard className="flex flex-col p-5">
          <div className="text-sm font-semibold tracking-tight text-gray-100">Timings</div>

          <div className="mt-4 flex justify-center gap-1.5 sm:justify-start">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
              const active = i === activeDayIndex;
              return (
                <div
                  key={`${d}-${i}`}
                  className={cx(
                    'grid h-7 w-7 place-items-center rounded-full text-xs font-semibold transition-colors',
                    active ? 'bg-[#2dd4bf] text-black' : 'text-gray-400'
                  )}
                >
                  {d}
                </div>
              );
            })}
          </div>

          <div className="mt-5">
            <div className="text-xs font-medium text-gray-400">Today (Flexible Timings)</div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-[#2a3447]">
              <div className="h-full w-[72%] rounded-full bg-[#2dd4bf]" />
            </div>
            <div className="mt-3 flex items-end justify-between gap-3">
              <span className="text-xs tabular-nums text-gray-400">Duration: 23h 52m</span>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Coffee className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
                <span>60 min</span>
              </div>
            </div>
          </div>
        </MetricCard>

        <MetricCard className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 shrink">
              <div className="inline-block rounded-lg border border-[#2a3447] bg-[#151b2b] px-3 py-2">
                <div className="text-sm font-semibold tabular-nums tracking-tight text-gray-100">{timeStr}</div>
                <div className="mt-0.5 text-xs text-gray-400">{dateStr}</div>
              </div>
            </div>
            <div className="flex min-w-0 flex-col items-end gap-1.5">
              <button
                type="button"
                className="shrink-0 rounded-lg bg-[#fb7185] px-4 py-2 text-xs font-semibold text-white shadow-none transition-opacity hover:opacity-90"
              >
                Web Clock-out
              </button>
              <a
                href="#"
                className="group flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-gray-100"
                onClick={(e) => e.preventDefault()}
              >
                <span className="grid h-5 w-5 place-items-center rounded border border-purple-400/70 text-purple-300">
                  <Home className="h-3 w-3" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="whitespace-nowrap border-b border-transparent group-hover:border-gray-500">
                  Work From Home
                </span>
              </a>
              <a
                href="#"
                className="group flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-gray-100"
                onClick={(e) => e.preventDefault()}
              >
                <span className="grid h-5 w-5 place-items-center rounded border border-purple-400/70 text-purple-300">
                  <FileText className="h-3 w-3" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="whitespace-nowrap border-b border-transparent group-hover:border-gray-500">
                  Attendance Policy
                </span>
              </a>
            </div>
          </div>

          <div className="mt-4 border-t border-[#2a3447] pt-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <span>TOTAL HOURS</span>
              <Info className="h-3.5 w-3.5 text-gray-500" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="mt-2 space-y-1 text-sm">
              <div className="tabular-nums text-gray-100">
                <span className="text-gray-400">Effective: </span>
                <span className="font-semibold">0h 7m</span>
              </div>
              <div className="tabular-nums text-gray-100">
                <span className="text-gray-400">Gross: </span>
                <span className="font-semibold">0h 7m</span>
              </div>
            </div>
          </div>
        </MetricCard>
      </div>

      <LogsRequests rows={rows} />
    </div>
  );
}

export default function Me() {
  const [tab, setTab] = useState('attendance');

  return (
    <div className="-mx-4 -mt-4 md:-mx-6 md:-mt-6 lg:-mx-8 lg:-mt-8">
      <MeSectionTabBar tabs={TABS} activeId={tab} onChange={setTab} />

      <div className="px-4 md:px-6 lg:px-8">
        {tab === 'attendance' && <AttendanceStatic />}
        {tab === 'leave' && <LeaveSummary />}
        {tab !== 'attendance' && tab !== 'leave' && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            This section is coming soon.
          </div>
        )}
      </div>
    </div>
  );
}
