import React, { useState } from 'react';
import { AlertCircle, Check, CheckCircle2, MapPin, MoreHorizontal } from 'lucide-react';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SUB_TABS = [
  { id: 'attendance_log', label: 'Attendance Log' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'attendance_requests', label: 'Attendance Requests' },
  { id: 'overtime_requests', label: 'Overtime Requests' },
];

const MONTHS = ['30 DAYS', 'MAR', 'FEB', 'JAN', 'DEC', 'NOV', 'OCT'];

function AttendanceSegments({ count }) {
  const n = Math.min(Math.max(count ?? 0, 0), 12);
  return (
    <div className="flex items-center">
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className="mr-1 inline-block h-1 w-4 shrink-0 rounded-sm bg-[#2dd4bf]" />
      ))}
      <MapPin className="ml-0.5 h-3.5 w-3.5 shrink-0 text-gray-500" strokeWidth={1.75} aria-hidden />
    </div>
  );
}

function EffectiveDot({ variant }) {
  if (variant === 'solid') {
    return <span className="mr-2 inline-block h-2 w-2 shrink-0 rounded-full bg-[#2dd4bf]" aria-hidden />;
  }
  if (variant === 'hollow') {
    return (
      <span
        className="mr-2 inline-block h-2 w-2 shrink-0 rounded-full border border-gray-500 bg-transparent"
        aria-hidden
      />
    );
  }
  return null;
}

function LogCell({ kind }) {
  if (kind === 'warning') {
    return (
      <div className="flex justify-end pr-1">
        <AlertCircle className="h-5 w-5 text-yellow-400" strokeWidth={1.75} aria-label="In progress" />
      </div>
    );
  }
  if (kind === 'check') {
    return (
      <div className="flex justify-end pr-1">
        <CheckCircle2 className="h-5 w-5 text-green-500" strokeWidth={1.75} aria-label="Complete" />
      </div>
    );
  }
  return (
    <div className="flex justify-end pr-2 text-gray-600">
      <MoreHorizontal className="h-5 w-5" strokeWidth={2} aria-label="No log" />
    </div>
  );
}

export default function LogsRequests({ rows }) {
  const [subTab, setSubTab] = useState('attendance_log');
  const [monthIdx, setMonthIdx] = useState(0);
  const [hour24, setHour24] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-[#2a3447] bg-[#1b2333] font-sans text-gray-100">
      <div className="border-b border-[#2a3447] px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-1">
            {SUB_TABS.map((t) => {
              const active = subTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSubTab(t.id)}
                  className={cx(
                    'whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-[#2d2a4a] text-white'
                      : 'text-gray-400 hover:bg-[#20293c] hover:text-gray-200'
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="text-sm text-gray-400">24 hour format</span>
            <button
              type="button"
              role="switch"
              aria-checked={hour24}
              onClick={() => setHour24((v) => !v)}
              className={cx(
                'inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border border-[#2a3447] p-0.5 transition-colors',
                hour24 ? 'justify-end bg-gray-500' : 'justify-start bg-[#2a3447]'
              )}
            >
              <span className="inline-block h-5 w-5 rounded-full bg-white shadow" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold tracking-tight text-gray-100">Last 30 Days</div>
          <div className="flex flex-wrap items-center gap-2">
            {MONTHS.map((x, idx) => (
              <button
                key={x}
                type="button"
                onClick={() => setMonthIdx(idx)}
                className={cx(
                  'h-8 rounded-md px-3 text-xs font-semibold uppercase tracking-wide transition-colors',
                  monthIdx === idx
                    ? 'bg-[#6b21a8] text-white'
                    : 'border border-[#2a3447] bg-transparent text-gray-400 hover:bg-[#2a3447]'
                )}
              >
                {x}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 w-full overflow-x-auto">
          <table className="w-full min-w-[920px] table-fixed border-collapse font-sans tabular-nums">
            <colgroup>
              <col className="w-[16%]" />
              <col className="w-[20%]" />
              <col className="w-[16%]" />
              <col className="w-[14%]" />
              <col className="w-[22%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-[#2a3447] text-left">
                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Attendance Visual
                </th>
                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Effective Hours
                </th>
                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Gross Hours
                </th>
                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Arrival
                </th>
                <th className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Log
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-300">
              {rows.map((r) => {
                const isSpan = Boolean(r.spanText);

                return (
                  <tr
                    key={r.id}
                    className="border-b border-[#2a3447] transition-colors hover:bg-[#20293c]"
                  >
                    <td className="px-3 py-3 align-middle">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-gray-100">{r.date}</span>
                        {r.badge === 'W-OFF' && (
                          <span className="rounded px-1.5 py-0.5 text-[10px] font-medium leading-none text-gray-300 bg-gray-700">
                            W-OFF
                          </span>
                        )}
                        {r.badge === 'LEAVE' && (
                          <span className="rounded border border-purple-700 bg-purple-900/50 px-1.5 py-0.5 text-[10px] font-medium leading-none text-purple-300">
                            LEAVE
                          </span>
                        )}
                      </div>
                    </td>

                    {isSpan ? (
                      <>
                        <td colSpan={4} className="px-3 py-3 align-middle text-gray-400">
                          {r.spanText}
                        </td>
                        <td className="px-3 py-3 align-middle">
                          <LogCell kind={r.logKind} />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-3 py-3 align-middle">
                          <AttendanceSegments count={r.segmentCount} />
                        </td>
                        <td className="px-3 py-3 align-middle">
                          <div className="flex items-center">
                            <EffectiveDot variant={r.effectiveDot} />
                            <span className="text-gray-200">{r.effective}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 align-middle text-gray-300">{r.gross}</td>
                        <td className="px-3 py-3 align-middle">
                          <div className="flex items-center gap-1.5 text-gray-300">
                            <Check className="h-3.5 w-3.5 shrink-0 text-green-500" strokeWidth={3} aria-hidden />
                            <span>{r.arrival}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 align-middle">
                          <LogCell kind={r.logKind} />
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
