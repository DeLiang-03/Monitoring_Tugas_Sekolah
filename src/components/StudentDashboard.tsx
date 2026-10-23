import React, { useState } from 'react';
import { Student, Task, Submission } from '../types';
import { 
  Flame, 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  BookOpen,
  Calendar,
  Crown
} from 'lucide-react';
import { sound } from '../utils/audio';

interface StudentDashboardProps {
  student: Student;
  tasks: Task[];
  submissions: Submission[];
  onOpenTask: (task: Task) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  tasks,
  submissions,
  onOpenTask
}) => {
  const [filter, setFilter] = useState<'all' | 'todo' | 'submitted' | 'graded'>('all');

  // Calculate Level based on XP (every 250 XP is 1 Level)
  const level = Math.floor(student.totalXp / 250) + 1;
  const currentLevelBaseXp = (level - 1) * 250;
  const nextLevelXp = level * 250;
  const progressPercent = Math.min(100, Math.round(((student.totalXp - currentLevelBaseXp) / 250) * 100));

  // Count mastery > 90%
  const studentSubmissions = submissions.filter((s) => s.studentId === student.id);
  const masteryCount = studentSubmissions.filter((s) => (s.score || 0) >= 90).length;

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const sub = studentSubmissions.find((s) => s.taskId === task.id);
    if (filter === 'todo') {
      return !sub || sub.status === 'belum_kumpul';
    }
    if (filter === 'submitted') {
      return sub && sub.status === 'menunggu_nilai';
    }
    if (filter === 'graded') {
      return sub && sub.status === 'sudah_dinilai';
    }
    return true;
  });

  return (
    <div className="space-y-8">
      
      {/* Student Profile & Gamification Stats Strip */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Identity & Level */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={student.avatarUrl}
                alt={student.name}
                className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-emerald-500/50 p-1"
              />
              <span className="absolute -bottom-2 -right-2 bg-emerald-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ring-2 ring-[#0f172a]">
                Lv.{level}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  {student.name}
                </h1>
                <span className="text-xs text-slate-400 font-mono">
                  NISN: {student.nisn}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{student.kelas}</span>
                <span aria-hidden="true">·</span>
                <span>SMP Nasional Indonesia</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-medium">Siswa Aktif</span>
              </div>
            </div>
          </div>

          {/* Gamification Counters */}
          <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
            
            {/* Total XP */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 min-w-[120px]">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Poin Apresiasi</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono tabular-nums">
                {student.totalXp} <span className="text-xs font-normal text-slate-400">XP</span>
              </div>
            </div>

            {/* Streak */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 min-w-[120px]">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Ketekunan</span>
                <Flame className="w-3.5 h-3.5 text-orange-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono tabular-nums">
                {student.streakDays} <span className="text-xs font-normal text-slate-400">Hari</span>
              </div>
            </div>

            {/* Mastery 90+ Count */}
            <div className="bg-slate-900/80 border border-amber-500/30 rounded-xl px-4 py-3 min-w-[120px] bg-gradient-to-br from-amber-950/20 to-transparent">
              <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
                <span>Sultan 90+</span>
                <Crown className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-amber-300 font-mono tabular-nums">
                {masteryCount} <span className="text-xs font-normal text-amber-400/80">Karya</span>
              </div>
            </div>

          </div>

        </div>

        {/* Level Progression Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">
              Kemajuan Menuju Level {level + 1}
            </span>
            <span className="text-slate-400 font-mono tabular-nums">
              {student.totalXp} / {nextLevelXp} XP ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Student Badges Strip */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 mr-2">Koleksi Lencana:</span>
          {student.badges.map((b) => (
            <div
              key={b.id}
              className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 border transition-all ${
                b.category === 'mastery_90'
                  ? 'bg-amber-950/50 border-amber-500/50 text-amber-200 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
              title={b.description}
            >
              {b.category === 'mastery_90' ? (
                <Crown className="w-3.5 h-3.5 text-amber-400" />
              ) : b.category === 'streak' ? (
                <Flame className="w-3.5 h-3.5 text-orange-400" />
              ) : (
                <Award className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="font-medium">{b.title}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Task Filters & Interactive List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Tugas &amp; Lembar Kerja Pembelajaran
            </h2>
            <p className="text-xs text-slate-400">
              Selesaikan sebelum batas waktu untuk mendapatkan apresiasi penuh
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => { sound.playClick(); setFilter('all'); }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({tasks.length})
            </button>
            <button
              onClick={() => { sound.playClick(); setFilter('todo'); }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === 'todo' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Perlu Dikerjakan
            </button>
            <button
              onClick={() => { sound.playClick(); setFilter('submitted'); }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === 'submitted' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Menunggu Review
            </button>
            <button
              onClick={() => { sound.playClick(); setFilter('graded'); }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === 'graded' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Selesai Dinilai
            </button>
          </div>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-slate-900/30 rounded-2xl border border-slate-800/60">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-60" />
              <h3 className="text-sm font-semibold text-white">Tidak ada tugas dalam kategori ini</h3>
              <p className="text-xs text-slate-400 mt-1">
                Semua tugas telah diselesaikan atau periksa kategori filter lainnya.
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const sub = studentSubmissions.find((s) => s.taskId === task.id);
              const isGraded = sub?.status === 'sudah_dinilai';
              const isPendingReview = sub?.status === 'menunggu_nilai';
              const isNotSubmitted = !sub || sub.status === 'belum_kumpul';

              const deadlineDate = new Date(task.deadline);
              const msDiff = deadlineDate.getTime() - Date.now();
              const isOverdue = msDiff < 0 && isNotSubmitted;
              const isUrgent = msDiff > 0 && msDiff < 24 * 3600 * 1000 && isNotSubmitted;
              const isMasteryScore = isGraded && (sub?.score || 0) >= 90;

              return (
                <div
                  key={task.id}
                  onClick={() => { sound.playClick(); onOpenTask(task); }}
                  className={`group relative bg-[#0f172a] border rounded-2xl p-5 cursor-pointer transition-all hover:border-slate-600 hover:shadow-lg ${
                    isMasteryScore
                      ? 'border-amber-500/40 bg-gradient-to-br from-amber-950/10 to-[#0f172a]'
                      : isUrgent
                      ? 'border-amber-500/50'
                      : isOverdue
                      ? 'border-rose-500/50'
                      : 'border-slate-800'
                  }`}
                >
                  {/* Top unboxed metadata */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-emerald-400">{task.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span>{task.kelas}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{task.rubric.length} Indikator</span>
                    </div>

                    {/* Status Text (Clean without pill) */}
                    <div>
                      {isGraded ? (
                        <span className={`font-semibold font-mono tabular-nums ${isMasteryScore ? 'text-amber-400' : 'text-emerald-400'}`}>
                          Nilai: {sub?.score}/100
                        </span>
                      ) : isPendingReview ? (
                        <span className="text-blue-400 font-medium">Menunggu Nilai</span>
                      ) : isOverdue ? (
                        <span className="text-rose-400 font-medium">Lewat Tenggat</span>
                      ) : isUrgent ? (
                        <span className="text-amber-400 font-medium">Deadline &lt;24 Jam</span>
                      ) : (
                        <span className="text-slate-400">Aktif</span>
                      )}
                    </div>
                  </div>

                  {/* Task Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
                    {task.title}
                  </h3>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>

                  {/* Mastery Special Note if > 90% */}
                  {isMasteryScore && (
                    <div className="mt-3 py-1.5 px-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        Peraih Apresiasi Nilai Maksimal!
                      </span>
                      <span className="font-mono font-bold text-amber-400">+150 XP</span>
                    </div>
                  )}

                  {/* Footer with deadline date & Action */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        Tenggat: {deadlineDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} WIB
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                      <span>{isGraded ? 'Lihat Evaluasi' : isPendingReview ? 'Lihat Draf' : 'Kerjakan'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};
