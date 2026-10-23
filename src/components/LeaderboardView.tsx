import React, { useState } from 'react';
import { Student, Submission } from '../types';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Medal, 
  Award, 
  Sparkles, 
  TrendingUp,
  Search,
  CheckCircle2
} from 'lucide-react';
import { sound } from '../utils/audio';

interface LeaderboardViewProps {
  students: Student[];
  submissions: Submission[];
  activeStudentId?: string;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  students,
  submissions,
  activeStudentId
}) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'allTime'>('allTime');
  const [search, setSearch] = useState('');

  // Calculate mastery 90+ count for each student
  const studentStats = students.map((std) => {
    const stdSubs = submissions.filter((s) => s.studentId === std.id);
    const masteryCount = stdSubs.filter((s) => (s.score || 0) >= 90).length;
    const graded = stdSubs.filter((s) => s.status === 'sudah_dinilai');
    const avgScore = graded.length > 0
      ? Math.round(graded.reduce((acc, s) => acc + (s.score || 0), 0) / graded.length)
      : 0;

    // Adjust score based on timeframe for realism
    let calculatedXp = std.totalXp;
    if (timeframe === 'weekly') {
      calculatedXp = Math.round(std.totalXp * 0.35);
    } else if (timeframe === 'monthly') {
      calculatedXp = Math.round(std.totalXp * 0.75);
    }

    return {
      ...std,
      calculatedXp,
      masteryCount,
      avgScore,
      completedCount: graded.length
    };
  });

  // Sort descending by calculated XP
  const sortedStudents = [...studentStats].sort((a, b) => b.calculatedXp - a.calculatedXp);

  const top1 = sortedStudents[0];
  const top2 = sortedStudents[1];
  const top3 = sortedStudents[2];

  const filteredList = sortedStudents.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.kelas.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Title & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Papan Peringkat Prestasi &amp; Apresiasi Siswa</span>
            <Trophy className="w-5 h-5 text-amber-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Motivasi belajar realtime berbasis ketepatan pengumpulan dan penguasaan nilai maksimal (&gt;90%)
          </p>
        </div>

        {/* Timeframe Tabs */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => { sound.playClick(); setTimeframe('weekly'); }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              timeframe === 'weekly' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Minggu Ini
          </button>
          <button
            onClick={() => { sound.playClick(); setTimeframe('monthly'); }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              timeframe === 'monthly' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bulan Ini
          </button>
          <button
            onClick={() => { sound.playClick(); setTimeframe('allTime'); }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              timeframe === 'allTime' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sepanjang Waktu
          </button>
        </div>
      </div>

      {/* Podium Top 3 (1st in center, 2nd on left, 3rd on right) */}
      <div className="grid grid-cols-3 gap-3 md:gap-6 items-end pt-8 pb-4 max-w-2xl mx-auto">
        
        {/* Rank 2 (Silver) */}
        {top2 && (
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-2">
              <img
                src={top2.avatarUrl}
                alt={top2.name}
                className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-800 border-2 border-slate-300 p-1"
              />
              <span className="absolute -top-2.5 -right-2 bg-slate-300 text-slate-900 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md font-mono">
                #2
              </span>
            </div>
            <h4 className="text-xs md:text-sm font-bold text-white truncate max-w-[110px]">
              {top2.name}
            </h4>
            <span className="text-[11px] text-slate-400">{top2.kelas}</span>
            <div className="mt-2 w-full bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
              <span className="text-xs font-mono font-bold text-white tabular-nums">
                {top2.calculatedXp} <span className="text-[10px] text-slate-400 font-normal">XP</span>
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" />
                {top2.masteryCount}x 90+
              </span>
            </div>
          </div>
        )}

        {/* Rank 1 (Gold Champion) */}
        {top1 && (
          <div className="flex flex-col items-center text-center -translate-y-3">
            <div className="relative mb-2">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-400 animate-bounce">
                <Crown className="w-6 h-6 fill-amber-400" />
              </div>
              <img
                src={top1.avatarUrl}
                alt={top1.name}
                className="w-18 h-18 md:w-20 md:h-20 rounded-2xl bg-slate-800 border-2 border-amber-400 p-1 ring-4 ring-amber-400/20"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-md font-mono">
                JUARA 1
              </span>
            </div>
            <h4 className="text-sm md:text-base font-bold text-white truncate max-w-[130px] mt-2">
              {top1.name}
            </h4>
            <span className="text-xs text-amber-400 font-medium">{top1.kelas}</span>
            <div className="mt-2 w-full bg-gradient-to-b from-amber-950/40 to-slate-900 border border-amber-500/40 rounded-xl p-3.5 flex flex-col items-center shadow-lg">
              <span className="text-sm md:text-base font-mono font-bold text-amber-300 tabular-nums">
                {top1.calculatedXp} <span className="text-xs text-amber-400/80 font-normal">XP</span>
              </span>
              <span className="text-xs text-amber-200 mt-1 flex items-center gap-1 font-semibold">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                {top1.masteryCount}x Nilai 90+
              </span>
            </div>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {top3 && (
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-2">
              <img
                src={top3.avatarUrl}
                alt={top3.name}
                className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-800 border-2 border-amber-700 p-1"
              />
              <span className="absolute -top-2.5 -right-2 bg-amber-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md font-mono">
                #3
              </span>
            </div>
            <h4 className="text-xs md:text-sm font-bold text-white truncate max-w-[110px]">
              {top3.name}
            </h4>
            <span className="text-[11px] text-slate-400">{top3.kelas}</span>
            <div className="mt-2 w-full bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
              <span className="text-xs font-mono font-bold text-white tabular-nums">
                {top3.calculatedXp} <span className="text-[10px] text-slate-400 font-normal">XP</span>
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" />
                {top3.masteryCount}x 90+
              </span>
            </div>
          </div>
        )}

      </div>

      {/* Appreciation Rewards Guide Strip */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-white block">Aturan Poin Apresiasi EduTask AI</span>
            <span className="text-slate-400">
              Tugas Selesai Tepat Waktu: <strong className="text-slate-200">+100 XP</strong> · Nilai &gt;90%: <strong className="text-amber-400">+150 XP Bonus &amp; Lencana</strong> · Ketekunan Harian: <strong className="text-orange-400">+20 XP/hari</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Table Search Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <span className="text-xs font-semibold text-white">
            Peringkat Keseluruhan Siswa ({filteredList.length})
          </span>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari siswa atau kelas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold text-center w-12">Posisi</th>
                <th className="py-3 px-4 font-semibold">Nama Siswa</th>
                <th className="py-3 px-4 font-semibold">Kelas</th>
                <th className="py-3 px-4 font-semibold text-center">Ketekunan</th>
                <th className="py-3 px-4 font-semibold text-center">Apresiasi Nilai &gt;90%</th>
                <th className="py-3 px-4 font-semibold text-center">Rata-Rata Nilai</th>
                <th className="py-3 px-4 font-semibold text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredList.map((std, idx) => {
                const rank = idx + 1;
                const isCurrentActive = activeStudentId === std.id;

                return (
                  <tr
                    key={std.id}
                    className={`transition-colors ${
                      isCurrentActive
                        ? 'bg-emerald-950/20 font-semibold'
                        : 'hover:bg-slate-900/40'
                    }`}
                  >
                    <td className="py-3 px-4 text-center font-mono font-bold tabular-nums">
                      {rank === 1 ? (
                        <span className="text-amber-400 font-bold">1 👑</span>
                      ) : rank === 2 ? (
                        <span className="text-slate-300 font-bold">2 🥈</span>
                      ) : rank === 3 ? (
                        <span className="text-amber-700 font-bold">3 🥉</span>
                      ) : (
                        <span className="text-slate-500">{rank}</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={std.avatarUrl}
                          alt={std.name}
                          className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"
                        />
                        <div>
                          <div className="text-white font-semibold flex items-center gap-1.5">
                            {std.name}
                            {isCurrentActive && (
                              <span className="text-[10px] text-emerald-400 font-normal">
                                (Anda)
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            NISN: {std.nisn}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-300 font-medium">
                      {std.kelas}
                    </td>

                    <td className="py-3 px-4 text-center font-mono tabular-nums">
                      <span className="inline-flex items-center gap-1 text-orange-400">
                        <Flame className="w-3.5 h-3.5" />
                        {std.streakDays} hari
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center font-mono tabular-nums">
                      {std.masteryCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-amber-300 font-semibold bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
                          <Crown className="w-3 h-3 text-amber-400" />
                          {std.masteryCount} kali
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center font-mono tabular-nums">
                      {std.avgScore > 0 ? (
                        <span className={std.avgScore >= 90 ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                          {std.avgScore}
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-white tabular-nums">
                      {std.calculatedXp} <span className="text-xs text-slate-500 font-normal">XP</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
