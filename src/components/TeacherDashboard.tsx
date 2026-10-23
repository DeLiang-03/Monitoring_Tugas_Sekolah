import React, { useState } from 'react';
import { Task, Submission, Student } from '../types';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Crown, 
  Plus, 
  BellRing, 
  FileText, 
  CheckCheck, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Search
} from 'lucide-react';
import { sound } from '../utils/audio';

interface TeacherDashboardProps {
  tasks: Task[];
  submissions: Submission[];
  students: Student[];
  onOpenCreateTask: () => void;
  onGradeSubmission: (submission: Submission, task: Task) => void;
  onSendAutomatedReminders: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  tasks,
  submissions,
  students,
  onOpenCreateTask,
  onGradeSubmission,
  onSendAutomatedReminders
}) => {
  const [taskFilter, setTaskFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Metrics Calculations
  const gradedSubmissions = submissions.filter((s) => s.status === 'sudah_dinilai');
  const pendingGradingSubmissions = submissions.filter((s) => s.status === 'menunggu_nilai');
  
  const avgGrade = gradedSubmissions.length > 0
    ? Math.round(gradedSubmissions.reduce((acc, s) => acc + (s.score || 0), 0) / gradedSubmissions.length)
    : 0;

  const mastery90Count = submissions.filter((s) => (s.score || 0) >= 90).length;

  const onTimeCount = submissions.filter((s) => !s.isOverdue).length;
  const onTimePercentage = submissions.length > 0
    ? Math.round((onTimeCount / submissions.length) * 100)
    : 100;

  return (
    <div className="space-y-8">
      
      {/* Header & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Dashboard Guru Pendamping &amp; Mentor
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitoring otomatis kepatuhan tenggat waktu, verifikasi evaluasi, dan apresiasi capaian &gt;90%
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playDeadlineChime();
              onSendAutomatedReminders();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600/90 hover:bg-amber-600 text-white transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap cursor-pointer"
            title="Kirim pengingat otomatis ke semua siswa dengan tenggat waktu mendekati"
          >
            <BellRing className="w-3.5 h-3.5" />
            Kirim Notifikasi Deadline Massal
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenCreateTask();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-2 shadow-md shadow-emerald-900/30 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Buat Tugas Baru
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (Follows Single-Elevation flat standard) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* On-Time Rate */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Kepatuhan Deadline</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {onTimePercentage}%
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="text-emerald-400 font-semibold">{onTimeCount} tugas</span> tepat waktu
          </div>
        </div>

        {/* Average Class Grade */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Rata-Rata Nilai Kelas</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {avgGrade} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {gradedSubmissions.length} karya telah dievaluasi
          </div>
        </div>

        {/* 90%+ Mastery Count */}
        <div className="bg-[#0f172a] border border-amber-500/30 rounded-2xl p-5 shadow-sm bg-gradient-to-br from-amber-950/20 to-[#0f172a]">
          <div className="flex items-center justify-between text-xs text-amber-400 mb-2">
            <span>Apresiasi Nilai &gt;90%</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-300">
            {mastery90Count} <span className="text-xs font-normal text-amber-400/80">Karya</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Otomatis bonus +150 XP diberikan
          </div>
        </div>

        {/* Pending Grading Queue */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Menunggu Penilaian</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {pendingGradingSubmissions.length} <span className="text-xs font-normal text-slate-400">Pengumpulan</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {pendingGradingSubmissions.length > 0 ? 'Perlu tindakan review segera' : 'Semua sudah dinilai'}
          </div>
        </div>

      </div>

      {/* Section 1: Antrean Penilaian Tugas (Grading Queue) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Antrean Penilaian &amp; Evaluasi Tugas</span>
              {pendingGradingSubmissions.length > 0 && (
                <span className="text-xs font-mono font-semibold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
                  {pendingGradingSubmissions.length} antrean
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Periksa lembar kerja siswa, tentukan nilai, dan picu apresiasi nilai maksimal
            </p>
          </div>
        </div>

        {pendingGradingSubmissions.length === 0 ? (
          <div className="py-8 px-6 text-center bg-[#0f172a] border border-slate-800 rounded-2xl">
            <CheckCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-70" />
            <h4 className="text-sm font-semibold text-white">Antrean Penilaian Kosong</h4>
            <p className="text-xs text-slate-400 mt-1">
              Semua tugas yang telah dikumpulkan siswa sudah selesai Anda evaluasi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingGradingSubmissions.map((sub) => {
              const matchedTask = tasks.find((t) => t.id === sub.taskId);
              if (!matchedTask) return null;

              return (
                <div
                  key={sub.id}
                  className="bg-[#0f172a] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={sub.studentAvatar}
                        alt={sub.studentName}
                        className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">{sub.studentName}</h4>
                        <div className="text-xs text-slate-400">
                          <span>{sub.studentKelas}</span>
                          <span className="mx-1.5">·</span>
                          <span className="text-emerald-400">{matchedTask.subject}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-slate-400">
                      {new Date(sub.submittedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 block font-medium">Judul Tugas:</span>
                    <p className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {matchedTask.title}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-2 italic bg-slate-950 p-2 rounded-lg border border-slate-800/60 font-mono">
                      "{sub.contentText.slice(0, 140)}..."
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Potensi: <span className="text-amber-400 font-semibold">&gt;90% (+150 XP)</span>
                    </span>
                    <button
                      onClick={() => {
                        sound.playClick();
                        onGradeSubmission(sub, matchedTask);
                      }}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      Beri Penilaian &amp; Ulasan
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Manajemen Daftar Tugas Kelas */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Manajemen Tugas &amp; Tenggat Waktu Aktif
            </h2>
            <p className="text-xs text-slate-400">
              Pantau status pengumpulan seluruh tugas di kelas Anda
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari tugas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={taskFilter}
              onChange={(e) => setTaskFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Semua Mata Pelajaran</option>
              <option value="Informatika">Informatika</option>
              <option value="Matematika">Matematika</option>
              <option value="IPA Terpadu">IPA Terpadu</option>
              <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              <option value="Bahasa Inggris">Bahasa Inggris</option>
            </select>
          </div>
        </div>

        {/* Task Table */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Mata Pelajaran &amp; Tugas</th>
                  <th className="py-3 px-4 font-semibold">Sasaran Kelas</th>
                  <th className="py-3 px-4 font-semibold">Tenggat Waktu</th>
                  <th className="py-3 px-4 font-semibold text-center">Status Pengumpulan</th>
                  <th className="py-3 px-4 font-semibold text-right">Rata-Rata Nilai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {tasks
                  .filter((t) => taskFilter === 'all' || t.subject === taskFilter)
                  .filter((t) => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((task) => {
                    const taskSubs = submissions.filter((s) => s.taskId === task.id);
                    const gradedSubs = taskSubs.filter((s) => s.status === 'sudah_dinilai');
                    const taskAvg = gradedSubs.length > 0
                      ? Math.round(gradedSubs.reduce((a, b) => a + (b.score || 0), 0) / gradedSubs.length)
                      : null;

                    const deadlineDate = new Date(task.deadline);
                    const isPassed = deadlineDate.getTime() < Date.now();
                    const hoursLeft = Math.round((deadlineDate.getTime() - Date.now()) / (3600 * 1000));

                    return (
                      <tr key={task.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{task.title}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="text-emerald-400">{task.subject}</span>
                            <span aria-hidden="true">·</span>
                            <span>{task.rubric.length} Indikator Rubrik</span>
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-400">Maks +150 XP Apresiasi</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-300">
                          {task.kelas}
                        </td>
                        <td className="py-3.5 px-4 font-mono tabular-nums">
                          <div>
                            {deadlineDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} WIB
                          </div>
                          <div className="text-[11px]">
                            {isPassed ? (
                              <span className="text-slate-500">Tenggat Selesai</span>
                            ) : hoursLeft < 24 ? (
                              <span className="text-amber-400 font-semibold">Tersisa {hoursLeft} Jam (Mendesak)</span>
                            ) : (
                              <span className="text-slate-400">Tersisa {Math.round(hoursLeft / 24)} hari</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono tabular-nums">
                          <span className="font-semibold text-emerald-400">{taskSubs.length}</span>
                          <span className="text-slate-500"> / {students.length} Siswa</span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                          {taskAvg !== null ? (
                            <span className={`font-bold ${taskAvg >= 90 ? 'text-amber-400' : 'text-white'}`}>
                              {taskAvg}
                            </span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
