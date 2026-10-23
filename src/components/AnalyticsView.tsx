import React, { useState } from 'react';
import { Student, Task, Submission, UserRole } from '../types';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Clock, 
  Crown, 
  Sparkles, 
  Printer, 
  FileCheck, 
  AlertCircle,
  CheckCircle2,
  Phone,
  UserCheck
} from 'lucide-react';
import { generateParentReportSummary } from '../utils/geminiAi';
import { sound } from '../utils/audio';

interface AnalyticsViewProps {
  students: Student[];
  tasks: Task[];
  submissions: Submission[];
  role: UserRole;
  activeStudent: Student;
  onSelectStudent: (student: Student) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  students,
  tasks,
  submissions,
  role,
  activeStudent,
  onSelectStudent
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(activeStudent.id);
  const [parentSummaryText, setParentSummaryText] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  const currentFocusStudent = students.find((s) => s.id === selectedStudentId) || activeStudent;

  // Grade distributions
  const gradedSubs = submissions.filter((s) => s.status === 'sudah_dinilai');
  const scores = gradedSubs.map((s) => s.score || 0);

  const tierMahir = scores.filter((s) => s >= 90).length; // >90
  const tierCakap = scores.filter((s) => s >= 75 && s < 90).length; // 75-89
  const tierDasar = scores.filter((s) => s >= 60 && s < 75).length; // 60-74
  const tierBimbingan = scores.filter((s) => s < 60).length; // <60

  const totalGraded = scores.length || 1;
  const pctMahir = Math.round((tierMahir / totalGraded) * 100);
  const pctCakap = Math.round((tierCakap / totalGraded) * 100);
  const pctDasar = Math.round((tierDasar / totalGraded) * 100);
  const pctBimbingan = Math.round((tierBimbingan / totalGraded) * 100);

  // Subject averages
  const subjects = ['Informatika', 'Matematika', 'IPA Terpadu', 'Bahasa Indonesia', 'Bahasa Inggris'] as const;
  const subjectAverages = subjects.map((subj) => {
    const subjTasks = tasks.filter((t) => t.subject === subj).map((t) => t.id);
    const subjSubs = gradedSubs.filter((s) => subjTasks.includes(s.taskId));
    const avg = subjSubs.length > 0
      ? Math.round(subjSubs.reduce((a, b) => a + (b.score || 0), 0) / subjSubs.length)
      : 84; // contextual baseline
    return { subject: subj, avg, count: subjSubs.length };
  });

  // Focus Student Specific Data
  const studentSubs = submissions.filter((s) => s.studentId === currentFocusStudent.id);
  const studentGraded = studentSubs.filter((s) => s.status === 'sudah_dinilai');
  const studentAvg = studentGraded.length > 0
    ? Math.round(studentGraded.reduce((a, b) => a + (b.score || 0), 0) / studentGraded.length)
    : 0;
  const studentMasteryCount = studentSubs.filter((s) => (s.score || 0) >= 90).length;

  const handleGenerateSummary = async () => {
    setIsGeneratingAi(true);
    sound.playClick();
    try {
      const summary = await generateParentReportSummary(currentFocusStudent, studentSubs, tasks);
      setParentSummaryText(summary);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="space-y-8">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Dashboard Analitik Pembelajaran &amp; Rapor Orang Tua</span>
            <BarChart3 className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluasi komprehensif ketepatan waktu pengumpulan dan penguasaan materi siswa secara terintegrasi
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center gap-2 border border-slate-700 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak / Ekspor Rapor PDF
          </button>
        </div>
      </div>

      {/* Classroom Big Picture (For Guru & General Overview) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Grade Distribution Breakdown */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Distribusi Mutu Hasil Tugas</h3>
              <p className="text-xs text-slate-400">Klasifikasi ketercapaian rubrik di Kelas 8B</p>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-400">
              {gradedSubs.length} Tugas Dinilai
            </span>
          </div>

          <div className="space-y-3 pt-2">
            
            {/* Mahir >90 */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  Mahir / Istimewa (&gt;90% - Bonus Apresiasi)
                </span>
                <span className="font-mono tabular-nums text-white">
                  {tierMahir} siswa ({pctMahir}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pctMahir}%` }} />
              </div>
            </div>

            {/* Cakap 75-89 */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-emerald-300 font-medium">
                  Cakap / Memenuhi Standar (75 - 89%)
                </span>
                <span className="font-mono tabular-nums text-white">
                  {tierCakap} siswa ({pctCakap}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pctCakap}%` }} />
              </div>
            </div>

            {/* Dasar 60-74 */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-blue-300 font-medium">
                  Dasar / Perlu Penguatan (60 - 74%)
                </span>
                <span className="font-mono tabular-nums text-white">
                  {tierDasar} siswa ({pctDasar}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pctDasar}%` }} />
              </div>
            </div>

            {/* Perlu Bimbingan <60 */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-rose-300 font-medium">
                  Perlu Pendampingan Khusus (&lt;60%)
                </span>
                <span className="font-mono tabular-nums text-white">
                  {tierBimbingan} siswa ({pctBimbingan}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${pctBimbingan}%` }} />
              </div>
            </div>

          </div>
        </div>

        {/* Subject Performance Bars */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Performa Rata-Rata per Mata Pelajaran</h3>
              <p className="text-xs text-slate-400">Komparasi nilai rata-rata kelas</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-3 pt-2">
            {subjectAverages.map((subj) => (
              <div key={subj.subject}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">{subj.subject}</span>
                  <span className="font-mono tabular-nums font-semibold text-white">
                    {subj.avg} / 100
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      subj.avg >= 90
                        ? 'bg-amber-400'
                        : subj.avg >= 75
                        ? 'bg-emerald-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${subj.avg}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Parental Monitoring & Individual Progress Section */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        
        {/* Section Header & Student Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Rapor Monitoring Belajar Siswa untuk Orang Tua / Wali</span>
            </h2>
            <p className="text-xs text-slate-400">
              Laporan terstruktur yang siap dibagikan kepada wali murid setiap periode pengerjaan tugas
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-400">Pilih Siswa:</label>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                setParentSummaryText('');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.kelas})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Student Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
          
          <div className="flex items-center gap-3 md:col-span-1">
            <img
              src={currentFocusStudent.avatarUrl}
              alt={currentFocusStudent.name}
              className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700"
            />
            <div>
              <h4 className="text-sm font-bold text-white">{currentFocusStudent.name}</h4>
              <div className="text-xs text-slate-400">
                <span>{currentFocusStudent.kelas}</span> · NISN: {currentFocusStudent.nisn}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3" />
                <span>Wali: {currentFocusStudent.parentName}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block">Rata-Rata Nilai</span>
            <span className="text-xl font-bold font-mono tabular-nums text-white">
              {studentAvg > 0 ? studentAvg : '-'} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </span>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block">Apresiasi Nilai &gt;90%</span>
            <span className="text-xl font-bold font-mono tabular-nums text-amber-400 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-400" />
              {studentMasteryCount} <span className="text-xs font-normal text-slate-400">Lencana</span>
            </span>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block">Ketekunan Harian</span>
            <span className="text-xl font-bold font-mono tabular-nums text-orange-400">
              {currentFocusStudent.streakDays} <span className="text-xs font-normal text-slate-400">Hari Beruntun</span>
            </span>
          </div>

        </div>

        {/* AI Parent Summary Section */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Catatan Narasi Kemajuan Belajar untuk Orang Tua (AI Assistant)
              </h4>
            </div>

            <button
              onClick={handleGenerateSummary}
              disabled={isGeneratingAi}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/90 hover:bg-emerald-600 disabled:opacity-50 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isGeneratingAi ? 'Menyusun Catatan...' : 'Susun Catatan Otomatis dengan AI'}
            </button>
          </div>

          {parentSummaryText ? (
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {parentSummaryText}
            </div>
          ) : (
            <div className="p-4 text-center rounded-lg bg-slate-900/40 border border-slate-800/40 text-xs text-slate-400">
              Klik "Susun Catatan Otomatis dengan AI" untuk menghasilkan pesan laporan kemajuan belajar yang ramah dan siap dikirim via WhatsApp / pesan wali murid.
            </div>
          )}
        </div>

        {/* Detailed Submission History for Student */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Riwayat Evaluasi Tugas Siswa
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Tugas &amp; Mapel</th>
                  <th className="py-2.5 px-3 font-semibold">Waktu Pengumpulan</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Nilai</th>
                  <th className="py-2.5 px-3 font-semibold">Catatan Mentor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {studentSubs.map((sub) => {
                  const t = tasks.find((item) => item.id === sub.taskId);
                  if (!t) return null;
                  const isMastery = (sub.score || 0) >= 90;

                  return (
                    <tr key={sub.id} className="hover:bg-slate-950/40">
                      <td className="py-3 px-3">
                        <span className="font-semibold text-white block">{t.title}</span>
                        <span className="text-[11px] text-emerald-400">{t.subject}</span>
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums text-slate-400">
                        {new Date(sub.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        <span className="text-[11px] text-slate-500 block">
                          {sub.isOverdue ? 'Terlambat' : 'Tepat Waktu'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold tabular-nums">
                        {sub.score !== null ? (
                          <span className={isMastery ? 'text-amber-400 font-bold' : 'text-white'}>
                            {sub.score} / 100
                            {isMastery && <span className="block text-[10px] text-amber-300">★ &gt;90%</span>}
                          </span>
                        ) : (
                          <span className="text-slate-500">Menunggu</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-300 text-xs italic">
                        {sub.teacherFeedback ? `"${sub.teacherFeedback}"` : '-'}
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
