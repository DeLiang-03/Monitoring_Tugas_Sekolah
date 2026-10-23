import React, { useState, useEffect } from 'react';
import { Task, Submission, UserRole } from '../types';
import { AlertCircle, Clock, BellRing, ArrowRight, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface DeadlineAlertBannerProps {
  tasks: Task[];
  userSubmissions: Submission[];
  role: UserRole;
  onSelectTask: (task: Task) => void;
  onSendAutomatedReminders?: () => void;
}

export const DeadlineAlertBanner: React.FC<DeadlineAlertBannerProps> = ({
  tasks,
  userSubmissions,
  role,
  onSelectTask,
  onSendAutomatedReminders
}) => {
  const [now, setNow] = useState(Date.now());
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (dismissed) return null;

  // Find unsubmitted tasks with closest deadline
  const pendingTasks = tasks.filter((t) => {
    const sub = userSubmissions.find((s) => s.taskId === t.id);
    return !sub || sub.status === 'belum_kumpul';
  });

  // Sort by deadline
  const sorted = [...pendingTasks].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  const nearestTask = sorted[0];
  if (!nearestTask) return null;

  const deadlineMs = new Date(nearestTask.deadline).getTime();
  const diffMs = deadlineMs - now;

  // If already expired or further than 48 hours, don't show the urgent banner
  if (diffMs > 48 * 3600 * 1000) return null;

  const isOverdue = diffMs <= 0;
  const hoursLeft = Math.floor(Math.abs(diffMs) / (3600 * 1000));
  const minutesLeft = Math.floor((Math.abs(diffMs) % (3600 * 1000)) / (60 * 1000));
  const secondsLeft = Math.floor((Math.abs(diffMs) % (60 * 1000)) / 1000);

  const isCritical = diffMs < 4 * 3600 * 1000 && !isOverdue;

  return (
    <div
      className={`border-b transition-colors px-4 py-3 sm:px-6 ${
        isOverdue
          ? 'bg-rose-950/40 border-rose-900/50 text-rose-200'
          : isCritical
          ? 'bg-amber-950/40 border-amber-900/50 text-amber-200'
          : 'bg-slate-900 border-slate-800 text-slate-300'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Left: Indicator & Description */}
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              isOverdue
                ? 'bg-rose-500/20 text-rose-400'
                : isCritical
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-blue-500/20 text-blue-400'
            }`}
          >
            {isOverdue ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <Clock className="w-4 h-4" />
            )}
          </div>

          <div className="text-xs sm:text-sm">
            <span className="font-semibold text-white">
              {isOverdue
                ? 'Tenggat Waktu Terlewat:'
                : isCritical
                ? 'Peringatan Deadline Mendesak:'
                : 'Pengingat Batas Pengumpulan:'}
            </span>{' '}
            <span className="text-slate-200 font-medium">"{nearestTask.title}"</span>{' '}
            <span className="text-slate-400 hidden md:inline">
              · {nearestTask.subject} ({nearestTask.kelas})
            </span>
          </div>
        </div>

        {/* Right: Tabular Countdown Timer & Action */}
        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
          <div className="text-xs font-mono tabular-nums px-2.5 py-1 rounded bg-black/40 border border-white/10 text-white flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {isOverdue ? 'Terlambat ' : 'Sisa '}
              {hoursLeft.toString().padStart(2, '0')}:
              {minutesLeft.toString().padStart(2, '0')}:
              {secondsLeft.toString().padStart(2, '0')}
            </span>
          </div>

          {role === 'siswa' ? (
            <button
              onClick={() => {
                sound.playClick();
                onSelectTask(nearestTask);
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1 shadow-sm whitespace-nowrap"
            >
              Kerjakan Sekarang
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : role === 'guru' && onSendAutomatedReminders ? (
            <button
              onClick={() => {
                sound.playDeadlineChime();
                onSendAutomatedReminders();
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <BellRing className="w-3.5 h-3.5" />
              Kirim Notifikasi Massal
            </button>
          ) : null}

          <button
            onClick={() => setDismissed(true)}
            className="text-xs text-slate-400 hover:text-white px-2 py-1"
            title="Tutup banner"
          >
            ✕
          </button>
        </div>

      </div>
    </div>
  );
};
