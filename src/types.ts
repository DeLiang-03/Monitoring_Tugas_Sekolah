export type UserRole = 'guru' | 'siswa' | 'orang_tua';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'mastery_90' | 'speed' | 'streak' | 'perseverance';
  earnedAt?: string;
  rarity: 'gold' | 'silver' | 'bronze';
}

export interface Student {
  id: string;
  name: string;
  nisn: string;
  kelas: string;
  avatarUrl: string;
  totalXp: number;
  streakDays: number;
  badges: Badge[];
  parentName: string;
  parentPhone: string;
  activeStatus: 'aktif' | 'perlu_perhatian';
}

export type SubjectCategory = 
  | 'Informatika'
  | 'Matematika'
  | 'IPA Terpadu'
  | 'Bahasa Indonesia'
  | 'Bahasa Inggris'
  | 'Pendidikan Pancasila';

export interface RubricItem {
  id: string;
  criteria: string;
  weight: number; // percentage
  description: string;
}

export interface Task {
  id: string;
  title: string;
  subject: SubjectCategory;
  kelas: string;
  description: string;
  instructions: string[];
  rubric: RubricItem[];
  maxScore: number;
  deadline: string; // ISO String
  createdAt: string;
  createdBy: string;
  rewardXpBase: number;
  rewardXpMasteryBonus: number; // For score >= 90%
}

export type SubmissionStatus = 'belum_kumpul' | 'menunggu_nilai' | 'sudah_dinilai';

export interface Submission {
  id: string;
  taskId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentKelas: string;
  submittedAt: string; // ISO String
  status: SubmissionStatus;
  contentText: string;
  attachmentName?: string;
  attachmentUrl?: string;
  score: number | null; // 0-100
  teacherFeedback?: string;
  rubricScores?: Record<string, number>;
  isOverdue: boolean;
  appreciationBonusAwarded: boolean; // Awarded if score >= 90
  awardedXp: number;
}

export type NotificationType = 
  | 'deadline_warning' 
  | 'deadline_overdue' 
  | 'appreciation_90' 
  | 'graded' 
  | 'system_broadcast';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  recipientId: string; // studentId or 'all'
  taskId?: string;
  timestamp: string;
  isRead: boolean;
  priority: 'kritis' | 'waspada' | 'info';
}
