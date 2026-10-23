import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  Student, 
  Task, 
  Submission, 
  NotificationItem, 
  Badge 
} from './types';
import { 
  loadStoredData, 
  saveStoredData, 
  resetDemoData, 
  MASTER_BADGES 
} from './data/initialData';
import { sound } from './utils/audio';
import { triggerConfetti } from './utils/confetti';
import { TopNavigation } from './components/TopNavigation';
import { DeadlineAlertBanner } from './components/DeadlineAlertBanner';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { LeaderboardView } from './components/LeaderboardView';
import { AnalyticsView } from './components/AnalyticsView';
import { SubmissionModal } from './components/SubmissionModal';
import { GradingModal } from './components/GradingModal';
import { CreateTaskModal } from './components/CreateTaskModal';
import { NotificationModal } from './components/NotificationModal';
import { 
  Sparkles, 
  Crown, 
  CheckCircle, 
  BellRing, 
  Award, 
  X,
  Volume2
} from 'lucide-react';

export default function App() {
  // Load persisted initial data with explicit type
  const [data, setData] = useState<{
    students: Student[];
    tasks: Task[];
    submissions: Submission[];
    notifications: NotificationItem[];
  }>(() => loadStoredData());
  const [currentRole, setCurrentRole] = useState<UserRole>('guru');
  const [activeStudentId, setActiveStudentId] = useState<string>('std_arya');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tugas' | 'leaderboard' | 'analitik'>('dashboard');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals
  const [selectedTaskForSubmission, setSelectedTaskForSubmission] = useState<Task | null>(null);
  const [gradingPayload, setGradingPayload] = useState<{ submission: Submission; task: Task } | null>(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  
  // Celebration Popup for >90% appreciation
  const [celebrationModalData, setCelebrationModalData] = useState<{
    studentName: string;
    taskTitle: string;
    score: number;
    awardedXp: number;
  } | null>(null);

  // Toast banner for actions
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Keep sound helper in sync
  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  // Persist data on changes
  useEffect(() => {
    saveStoredData(data);
  }, [data]);

  // Active student object
  const activeStudent = data.students.find((s) => s.id === activeStudentId) || data.students[0];

  // Automated Deadline Alert background prober
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let hasNewNotification = false;
      const updatedNotifs = [...data.notifications];

      data.tasks.forEach((task) => {
        const deadlineMs = new Date(task.deadline).getTime();
        const diffMs = deadlineMs - now;

        // Check if student has pending submission
        const studentSub = data.submissions.find((s) => s.taskId === task.id && s.studentId === activeStudent.id);
        const isNotDone = !studentSub || studentSub.status === 'belum_kumpul';

        if (isNotDone && diffMs > 0 && diffMs <= 4 * 3600 * 1000) {
          // Check if not already notified
          const exists = updatedNotifs.some((n) => n.taskId === task.id && n.priority === 'kritis');
          if (!exists) {
            hasNewNotification = true;
            updatedNotifs.unshift({
              id: `notif_${Date.now()}_${task.id}`,
              type: 'deadline_warning',
              title: 'Tenggat Waktu Kritis (< 4 Jam)!',
              message: `Tugas "${task.title}" tersisa kurang dari 4 jam lagi. Kumpulkan segera untuk mengamankan poin apresiasi!`,
              recipientId: activeStudent.id,
              taskId: task.id,
              timestamp: new Date().toISOString(),
              isRead: false,
              priority: 'kritis'
            });
          }
        }
      });

      if (hasNewNotification) {
        sound.playDeadlineChime();
        setData((prev) => ({ ...prev, notifications: updatedNotifs }));
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [data.tasks, data.submissions, activeStudent.id]);

  // Handler: Student Submits Work
  const handleSubmitWork = (subData: {
    taskId: string;
    studentId: string;
    contentText: string;
    attachmentName?: string;
    attachmentUrl?: string;
  }) => {
    const task = data.tasks.find((t) => t.id === subData.taskId);
    if (!task) return;

    const isOverdue = new Date(task.deadline).getTime() < Date.now();
    const existingIndex = data.submissions.findIndex(
      (s) => s.taskId === subData.taskId && s.studentId === subData.studentId
    );

    const newSub: Submission = {
      id: existingIndex >= 0 ? data.submissions[existingIndex].id : `sub_${Date.now()}`,
      taskId: subData.taskId,
      studentId: subData.studentId,
      studentName: activeStudent.name,
      studentAvatar: activeStudent.avatarUrl,
      studentKelas: activeStudent.kelas,
      submittedAt: new Date().toISOString(),
      status: 'menunggu_nilai',
      contentText: subData.contentText,
      attachmentName: subData.attachmentName,
      attachmentUrl: subData.attachmentUrl,
      score: null,
      isOverdue,
      appreciationBonusAwarded: false,
      awardedXp: 0
    };

    let updatedSubmissions = [...data.submissions];
    if (existingIndex >= 0) {
      updatedSubmissions[existingIndex] = newSub;
    } else {
      updatedSubmissions.push(newSub);
    }

    // Add notification for teacher
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      type: 'system_broadcast',
      title: 'Tugas Baru Masuk untuk Diperiksa',
      message: `${activeStudent.name} telah mengumpulkan tugas "${task.title}".`,
      recipientId: 'all',
      taskId: task.id,
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: 'info'
    };

    setData((prev) => ({
      ...prev,
      submissions: updatedSubmissions,
      notifications: [newNotif, ...prev.notifications]
    }));

    showToast(`Tugas "${task.title}" berhasil dikumpulkan! Menunggu evaluasi guru.`);
  };

  // Handler: Teacher Grades Work (Triggers >90% Appreciation Award)
  const handleSaveGrade = (gradeData: {
    submissionId: string;
    score: number;
    feedback: string;
    awardedXp: number;
    appreciationBonusAwarded: boolean;
  }) => {
    const sub = data.submissions.find((s) => s.id === gradeData.submissionId);
    if (!sub) return;

    const task = data.tasks.find((t) => t.id === sub.taskId);
    const student = data.students.find((s) => s.id === sub.studentId);
    if (!task || !student) return;

    const updatedSubmissions = data.submissions.map((item) => {
      if (item.id === gradeData.submissionId) {
        return {
          ...item,
          status: 'sudah_dinilai' as const,
          score: gradeData.score,
          teacherFeedback: gradeData.feedback,
          awardedXp: gradeData.awardedXp,
          appreciationBonusAwarded: gradeData.appreciationBonusAwarded
        };
      }
      return item;
    });

    // Update student's XP and badges if score >= 90%
    const updatedStudents = data.students.map((std) => {
      if (std.id === sub.studentId) {
        let newXp = std.totalXp + gradeData.awardedXp;
        let badges = [...std.badges];

        if (gradeData.appreciationBonusAwarded) {
          const hasBadge = badges.some((b) => b.id === 'badge_mastery_90');
          if (!hasBadge) {
            badges.push({
              ...MASTER_BADGES.mastery_90,
              earnedAt: new Date().toISOString()
            });
          }
        }

        return {
          ...std,
          totalXp: newXp,
          badges
        };
      }
      return std;
    });

    // Notification for the student
    const isMastery = gradeData.score >= 90;
    const notifTitle = isMastery
      ? 'Luar Biasa! Bonus Apresiasi Nilai Maksimal >90%'
      : 'Tugas Selesai Dinilai';
    const notifMsg = isMastery
      ? `Selamat! Kamu meraih nilai istimewa ${gradeData.score}/100 pada "${task.title}". Bonus +150 XP & Lencana Sultan Nilai 90+ berhasil ditambahkan!`
      : `Nilai untuk tugas "${task.title}" adalah ${gradeData.score}/100. Periksa catatan evaluasi dari guru.`;

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      type: isMastery ? 'appreciation_90' : 'graded',
      title: notifTitle,
      message: notifMsg,
      recipientId: student.id,
      taskId: task.id,
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: isMastery ? 'waspada' : 'info'
    };

    setData((prev) => ({
      ...prev,
      submissions: updatedSubmissions,
      students: updatedStudents,
      notifications: [newNotif, ...prev.notifications]
    }));

    if (isMastery) {
      setCelebrationModalData({
        studentName: student.name,
        taskTitle: task.title,
        score: gradeData.score,
        awardedXp: gradeData.awardedXp
      });
    } else {
      showToast(`Nilai ${gradeData.score} untuk ${student.name} berhasil disimpan.`);
    }
  };

  // Handler: Teacher Creates Task
  const handleCreateTask = (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `tsk_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    // Broadcast notification to all students
    const broadcastNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      type: 'deadline_warning',
      title: `Tugas Baru: ${newTask.title}`,
      message: `Tugas "${newTask.subject}" baru diterbitkan. Tenggat waktu pengumpulan: ${new Date(newTask.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} WIB.`,
      recipientId: 'all',
      taskId: newTask.id,
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: 'info'
    };

    setData((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
      notifications: [broadcastNotif, ...prev.notifications]
    }));

    showToast(`Tugas "${newTask.title}" berhasil diterbitkan untuk ${newTask.kelas}!`);
  };

  // Handler: Teacher Automated Reminder Broadcast
  const handleSendAutomatedReminders = () => {
    const pendingTasks = data.tasks.filter((t) => new Date(t.deadline).getTime() > Date.now());
    if (pendingTasks.length === 0) {
      showToast('Tidak ada tugas aktif dengan tenggat waktu saat ini.');
      return;
    }

    const newNotifs: NotificationItem[] = pendingTasks.map((task) => ({
      id: `notif_${Date.now()}_${task.id}`,
      type: 'deadline_warning',
      title: 'Pengingat Deadline Otomatis dari Guru',
      message: `Segera tuntaskan tugas "${task.title}" (${task.subject}) sebelum batas waktu. Dapatkan kesempatan meraih nilai maksimal >90% dan bonus apresiasi +150 XP!`,
      recipientId: 'all',
      taskId: task.id,
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: 'waspada'
    }));

    setData((prev) => ({
      ...prev,
      notifications: [...newNotifs, ...prev.notifications]
    }));

    showToast(`Notifikasi pengingat otomatis telah dikirim ke seluruh siswa ${data.students.length} orang!`);
  };

  // Reset Demo Data
  const handleResetData = () => {
    resetDemoData();
    const fresh = loadStoredData();
    setData(fresh);
    sound.playClick();
    showToast('Data demo berhasil direset ke pengaturan awal.');
  };

  const unreadNotifsCount = data.notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30">
      
      {/* Top Bar Contract (Wordmark - Navigation - Role Switcher) */}
      <TopNavigation
        currentRole={currentRole}
        onRoleChange={(r) => {
          setCurrentRole(r);
          setActiveTab('dashboard');
        }}
        activeStudent={activeStudent}
        onStudentChange={setActiveStudentId}
        allStudents={data.students}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        notifications={data.notifications}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        unreadCount={unreadNotifsCount}
        onResetData={handleResetData}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Realtime Urgent Deadline Alert Banner */}
      <DeadlineAlertBanner
        tasks={data.tasks}
        userSubmissions={data.submissions.filter((s) => s.studentId === activeStudent.id)}
        role={currentRole}
        onSelectTask={(task) => setSelectedTaskForSubmission(task)}
        onSendAutomatedReminders={handleSendAutomatedReminders}
      />

      {/* Main Responsive Viewport (Desktop baseline 1440px max-width container) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tab 1: Beranda / Dashboard depending on role */}
        {activeTab === 'dashboard' && (
          <>
            {currentRole === 'siswa' && (
              <StudentDashboard
                student={activeStudent}
                tasks={data.tasks}
                submissions={data.submissions}
                onOpenTask={(task) => setSelectedTaskForSubmission(task)}
              />
            )}

            {currentRole === 'guru' && (
              <TeacherDashboard
                tasks={data.tasks}
                submissions={data.submissions}
                students={data.students}
                onOpenCreateTask={() => setIsCreateTaskModalOpen(true)}
                onGradeSubmission={(sub, task) => setGradingPayload({ submission: sub, task })}
                onSendAutomatedReminders={handleSendAutomatedReminders}
              />
            )}

            {currentRole === 'orang_tua' && (
              <AnalyticsView
                students={data.students}
                tasks={data.tasks}
                submissions={data.submissions}
                role="orang_tua"
                activeStudent={activeStudent}
                onSelectStudent={(s) => setActiveStudentId(s.id)}
              />
            )}
          </>
        )}

        {/* Tab 2: Tugas (Student view of tasks or Teacher management) */}
        {activeTab === 'tugas' && (
          <div className="space-y-6">
            {currentRole === 'guru' ? (
              <TeacherDashboard
                tasks={data.tasks}
                submissions={data.submissions}
                students={data.students}
                onOpenCreateTask={() => setIsCreateTaskModalOpen(true)}
                onGradeSubmission={(sub, task) => setGradingPayload({ submission: sub, task })}
                onSendAutomatedReminders={handleSendAutomatedReminders}
              />
            ) : (
              <StudentDashboard
                student={activeStudent}
                tasks={data.tasks}
                submissions={data.submissions}
                onOpenTask={(task) => setSelectedTaskForSubmission(task)}
              />
            )}
          </div>
        )}

        {/* Tab 3: Leaderboard & Prestasi */}
        {activeTab === 'leaderboard' && (
          <LeaderboardView
            students={data.students}
            submissions={data.submissions}
            activeStudentId={currentRole === 'siswa' ? activeStudent.id : undefined}
          />
        )}

        {/* Tab 4: Analitik & Rapor Orang Tua */}
        {activeTab === 'analitik' && (
          <AnalyticsView
            students={data.students}
            tasks={data.tasks}
            submissions={data.submissions}
            role={currentRole}
            activeStudent={activeStudent}
            onSelectStudent={(s) => setActiveStudentId(s.id)}
          />
        )}

      </main>

      {/* Modals */}
      {selectedTaskForSubmission && (
        <SubmissionModal
          task={selectedTaskForSubmission}
          student={activeStudent}
          existingSubmission={data.submissions.find(
            (s) => s.taskId === selectedTaskForSubmission.id && s.studentId === activeStudent.id
          )}
          onClose={() => setSelectedTaskForSubmission(null)}
          onSubmitWork={handleSubmitWork}
        />
      )}

      {gradingPayload && (
        <GradingModal
          submission={gradingPayload.submission}
          task={gradingPayload.task}
          onClose={() => setGradingPayload(null)}
          onSaveGrade={handleSaveGrade}
        />
      )}

      {isCreateTaskModalOpen && (
        <CreateTaskModal
          onClose={() => setIsCreateTaskModalOpen(false)}
          onCreateTask={handleCreateTask}
        />
      )}

      {isNotificationModalOpen && (
        <NotificationModal
          notifications={data.notifications}
          onClose={() => setIsNotificationModalOpen(false)}
          onMarkAllAsRead={() => {
            setData((prev) => ({
              ...prev,
              notifications: prev.notifications.map((n) => ({ ...n, isRead: true }))
            }));
            showToast('Semua notifikasi telah ditandai dibaca.');
          }}
          onNotificationClick={(notif) => {
            if (notif.taskId) {
              const task = data.tasks.find((t) => t.id === notif.taskId);
              if (task) {
                setIsNotificationModalOpen(false);
                setSelectedTaskForSubmission(task);
              }
            }
          }}
        />
      )}

      {/* Special Gamification Modal for >90% Appreciation Celebration */}
      {celebrationModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#1e1b4b] to-[#0f172a] border-2 border-amber-400 rounded-3xl p-6 text-center shadow-2xl space-y-4">
            
            <button
              onClick={() => setCelebrationModalData(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Gold Emblem Image generated with generate_image */}
            <div className="mx-auto w-28 h-28 rounded-full border-4 border-amber-400/80 shadow-2xl p-1 bg-amber-950/40 relative">
              <img
                src="/src/assets/images/badge_mastery_gold_1792734942350.jpg"
                alt="Medali Apresiasi Nilai >90%"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                SULTAN 90+
              </span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
                Pencapaian Prestasi Istimewa
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Selamat, {celebrationModalData.studentName}!
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Tugas: <strong className="text-white">"{celebrationModalData.taskTitle}"</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2">
              <div className="text-3xl font-extrabold font-mono tabular-nums text-amber-300">
                {celebrationModalData.score} <span className="text-base text-slate-400">/ 100</span>
              </div>
              <div className="text-xs text-amber-200 font-semibold flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Bonus Apresiasi Nilai Maksimal: +150 XP Ditambahkan!</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Lencana emas disematkan ke profil siswa dan mendongkrak peringkat di papan leaderboard kelas.
              </p>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setCelebrationModalData(null);
              }}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-lg cursor-pointer"
            >
              Mantap, Lanjutkan Semangat Belajar!
            </button>

          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 border border-emerald-500/50 text-white text-xs px-4 py-3 rounded-xl shadow-2xl">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#080c14] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">EduTask AI</span>
            <span aria-hidden="true">·</span>
            <span>Kurikulum Merdeka Belajar Nasional</span>
          </div>
          <div className="text-[11px]">
            Otomatisasi Monitoring Tugas &amp; Evaluasi Performa Siswa Realtime
          </div>
        </div>
      </footer>

    </div>
  );
}
