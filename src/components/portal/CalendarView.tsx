"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/icons";

export type CalendarMilestone = {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "complete";
  engagement_id: string;
  engagement_title: string;
  due_date: string; // "YYYY-MM-DD"
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const STATUS_STYLES = {
  complete: "bg-emerald-50 text-emerald-700 border-emerald-200",
  in_progress: "bg-amber-50 text-amber-700 border-amber-200",
  pending: "bg-[#f0f8fd] text-[#1a3347]/60 border-[#1a3347]/10",
};

const STATUS_DOT = {
  complete: "bg-emerald-500",
  in_progress: "bg-amber-400",
  pending: "bg-[#1a3347]/25",
};

function buildGrid(year: number, month: number): (number | null)[] {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function isSameDay(due: string, year: number, month: number, day: number): boolean {
  const [y, m, d] = due.split("-").map(Number);
  return y === year && m === month + 1 && d === day;
}

export function CalendarView({ milestones }: { milestones: CalendarMilestone[] }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const grid = buildGrid(year, month);

  const noDate = milestones.filter((m) => !m.due_date);

  function prev() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }
  function next() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  return (
    <div>
      {/* Month nav */}
      <div className="mb-6 flex items-center justify-between">
        <button onClick={prev} className="flex size-9 items-center justify-center rounded-full border border-border text-text-secondary hover:border-primary/30 hover:text-text-primary transition-colors">
          <ChevronRightIcon className="size-4 rotate-180" />
        </button>
        <h2 className="font-heading text-2xl font-medium text-text-primary">
          {MONTHS[month]} {year}
        </h2>
        <button onClick={next} className="flex size-9 items-center justify-center rounded-full border border-border text-text-secondary hover:border-primary/30 hover:text-text-primary transition-colors">
          <ChevronRightIcon className="size-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="mb-1 grid grid-cols-7 gap-px">
        {DAYS.map((d) => (
          <div key={d} className="py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px rounded-lg overflow-hidden border border-border bg-border">
        {grid.map((day, i) => {
          const dayMilestones = day ? milestones.filter((m) => m.due_date && isSameDay(m.due_date, year, month, day)) : [];
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          return (
            <div
              key={i}
              className="min-h-[90px] bg-surface p-2"
            >
              {day && (
                <>
                  <span
                    className={`mb-1 flex size-6 items-center justify-center rounded-full text-xs font-medium ${
                      isToday ? "bg-primary text-white" : "text-text-secondary"
                    }`}
                  >
                    {day}
                  </span>
                  <div className="space-y-1">
                    {dayMilestones.map((m) => (
                      <Link
                        key={m.id}
                        href={`/portal/engagements/${m.engagement_id}`}
                        className={`flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium leading-tight transition-opacity hover:opacity-70 ${STATUS_STYLES[m.status]}`}
                      >
                        <span className={`size-1.5 shrink-0 rounded-full ${STATUS_DOT[m.status]}`} />
                        <span className="truncate">{m.title}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        {(["complete", "in_progress", "pending"] as const).map((s) => (
          <div key={s} className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span className={`size-2 rounded-full ${STATUS_DOT[s]}`} />
            {s === "in_progress" ? "In progress" : s.charAt(0).toUpperCase() + s.slice(1)}
          </div>
        ))}
      </div>

      {/* Milestones without a due date */}
      {noDate.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">No due date set</h3>
          <div className="space-y-2">
            {noDate.map((m) => (
              <Link
                key={m.id}
                href={`/portal/engagements/${m.engagement_id}`}
                className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`size-2 rounded-full ${STATUS_DOT[m.status]}`} />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{m.title}</p>
                    <p className="text-xs text-text-secondary">{m.engagement_title}</p>
                  </div>
                </div>
                <ChevronRightIcon className="size-4 text-text-secondary" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
