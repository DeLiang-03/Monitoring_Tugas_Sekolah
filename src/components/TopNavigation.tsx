import React from 'react';
import { UserRole, Student, NotificationItem } from '../types';
import { 
  Bell, 
  GraduationCap, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { sound } from '../utils/audio';

interface TopNavigationProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeStudent: Student;
  onStudentChange: (studentId: string) => void;
  allStudents: Student[];
  activeTab: 'dashboard' | 'tugas' | 'leaderboard' | 'analitik';
  onTabChange: (tab: 'dashboard' | 'tugas' | 'leaderboard' | 'analitik') => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  unreadCount: number;
  onResetData: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentRole,
  onRoleChange,
  activeStudent,
  onStudentChange,
  allStudents,
  activeTab,
  onTabChange,
  unreadCount,
  onOpenNotifications,
  onResetData,
  soundEnabled,
  onToggleSound
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Single text element wordmark with brand identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight whitespace-nowrap block leading-tight">
                EduTask AI
              </span>
              <span className="text-[11px] text-slate-400 block tracking-normal">
                Sistem Monitoring Belajar Nasional
              </span>
            </div>
          </div>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <button
              onClick={() => { sound.playClick(); onTabChange('dashboard'); }}
              className={`transition-colors whitespace-nowrap py-1 cursor-pointer border-b-2 ${
                activeTab === 'dashboard'
                  ? 'text-white border-emerald-400 font-semibold'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => { sound.playClick(); onTabChange('tugas'); }}
              className={`transition-colors whitespace-nowrap py-1 cursor-pointer border-b-2 ${
                activeTab === 'tugas'
                  ? 'text-white border-emerald-400 font-semibold'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              {currentRole === 'guru' ? 'Kelola Tugas' : 'Daftar Tugas'}
            </button>
            <button
              onClick={() => { sound.playClick(); onTabChange('leaderboard'); }}
              className={`transition-colors whitespace-nowrap py-1 cursor-pointer border-b-2 ${
                activeTab === 'leaderboard'
                  ? 'text-white border-emerald-400 font-semibold'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              Leaderboard &amp; Prestasi
            </button>
            <button
              onClick={() => { sound.playClick(); onTabChange('analitik'); }}
              className={`transition-colors whitespace-nowrap py-1 cursor-pointer border-b-2 ${
                activeTab === 'analitik'
                  ? 'text-white border-emerald-400 font-semibold'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              {currentRole === 'orang_tua' ? 'Rapor Orang Tua' : 'Analitik Performa'}
            </button>
          </nav>

          {/* Zone 3: Role Switcher & User Profile Context */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Suara Aktif' : 'Suara Dimatikan'}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Notification Bell with Badge */}
            <button
              onClick={() => { sound.playClick(); onOpenNotifications(); }}
              className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
              title="Notifikasi Tenggat & Nilai"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-[#0f172a]" />
              )}
            </button>

            {/* Role Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => { sound.playClick(); onRoleChange('guru'); }}
                className={`px-2.5 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                  currentRole === 'guru'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Guru/Mentor
              </button>
              <button
                onClick={() => { sound.playClick(); onRoleChange('siswa'); }}
                className={`px-2.5 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                  currentRole === 'siswa'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Siswa
              </button>
              <button
                onClick={() => { sound.playClick(); onRoleChange('orang_tua'); }}
                className={`px-2.5 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                  currentRole === 'orang_tua'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Orang Tua
              </button>
            </div>

            {/* Student Picker if in Siswa or Orang Tua mode */}
            {currentRole !== 'guru' && (
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-700">
                <img
                  src={activeStudent.avatarUrl}
                  alt={activeStudent.name}
                  className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700"
                />
                <select
                  value={activeStudent.id}
                  onChange={(e) => onStudentChange(e.target.value)}
                  className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer max-w-[120px] truncate"
                >
                  {allStudents.map((s) => (
                    <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                      {s.name} ({s.kelas})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Reset Demo button for tester ease */}
            <button
              onClick={onResetData}
              title="Reset data demo ke awal"
              className="text-slate-500 hover:text-slate-300 p-1.5 rounded-md hover:bg-slate-800/40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
