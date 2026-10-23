import { Student, Task, Submission, NotificationItem, Badge } from '../types';

export const MASTER_BADGES: Record<string, Badge> = {
  mastery_90: {
    id: 'badge_mastery_90',
    title: 'Sultan Nilai 90+',
    description: 'Mencapai skor luar biasa diatas 90% pada evaluasi tugas sekolah (+150 XP Bonus)',
    icon: 'Crown',
    category: 'mastery_90',
    rarity: 'gold'
  },
  speed_runner: {
    id: 'badge_speed_runner',
    title: 'Pelopor Tepat Waktu',
    description: 'Mengumpulkan tugas lebih dari 24 jam sebelum tenggat batas waktu',
    icon: 'Zap',
    category: 'speed',
    rarity: 'silver'
  },
  streak_7: {
    id: 'badge_streak_7',
    title: 'Juara Ketekunan',
    description: 'Konsisten menyelesaikan tugas dan aktif belajar selama 7 hari berturut-turut',
    icon: 'Flame',
    category: 'streak',
    rarity: 'gold'
  },
  perseverance: {
    id: 'badge_perseverance',
    title: 'Pejuang Teladan',
    description: 'Menyelesaikan revisi tugas dan mempertahankan peningkatan nilai signifikan',
    icon: 'Award',
    category: 'perseverance',
    rarity: 'bronze'
  }
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std_arya',
    name: 'Arya Pratama',
    nisn: '0089241512',
    kelas: 'Kelas 8B',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Arya&backgroundColor=1e293b',
    totalXp: 860,
    streakDays: 6,
    badges: [MASTER_BADGES.mastery_90, MASTER_BADGES.speed_runner, MASTER_BADGES.streak_7],
    parentName: 'Bambang Pratama',
    parentPhone: '0812-9844-1200',
    activeStatus: 'aktif'
  },
  {
    id: 'std_siti',
    name: 'Siti Nurhaliza',
    nisn: '0089241513',
    kelas: 'Kelas 8B',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Siti&backgroundColor=0f172a',
    totalXp: 1240,
    streakDays: 14,
    badges: [MASTER_BADGES.mastery_90, MASTER_BADGES.speed_runner, MASTER_BADGES.streak_7],
    parentName: 'Hj. Aminah Nur',
    parentPhone: '0813-8821-3991',
    activeStatus: 'aktif'
  },
  {
    id: 'std_anisa',
    name: 'Anisa Rahmawati',
    nisn: '0089241514',
    kelas: 'Kelas 8B',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Anisa&backgroundColor=1e1b4b',
    totalXp: 980,
    streakDays: 9,
    badges: [MASTER_BADGES.mastery_90, MASTER_BADGES.speed_runner],
    parentName: 'Drs. Hendro Wibowo',
    parentPhone: '0811-2244-6688',
    activeStatus: 'aktif'
  },
  {
    id: 'std_dewi',
    name: 'Dewi Lestari',
    nisn: '0089241515',
    kelas: 'Kelas 8B',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dewi&backgroundColor=134e4a',
    totalXp: 790,
    streakDays: 4,
    badges: [MASTER_BADGES.speed_runner, MASTER_BADGES.perseverance],
    parentName: 'Lestari Suwarno',
    parentPhone: '0857-3311-2200',
    activeStatus: 'aktif'
  },
  {
    id: 'std_budi',
    name: 'Budi Santoso',
    nisn: '0089241516',
    kelas: 'Kelas 8B',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Budi&backgroundColor=3b0764',
    totalXp: 620,
    streakDays: 3,
    badges: [MASTER_BADGES.perseverance],
    parentName: 'M. Santoso',
    parentPhone: '0821-4567-8901',
    activeStatus: 'perlu_perhatian'
  },
  {
    id: 'std_rizky',
    name: 'Rizky Ramadhan',
    nisn: '0089241517',
    kelas: 'Kelas 8B',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rizky&backgroundColor=1e293b',
    totalXp: 510,
    streakDays: 2,
    badges: [MASTER_BADGES.perseverance],
    parentName: 'Haryanto Ramadhan',
    parentPhone: '0819-0123-4567',
    activeStatus: 'perlu_perhatian'
  }
];

// Helper to make deadlines relative to current time
const now = new Date();
const inHours = (h: number) => new Date(now.getTime() + h * 3600 * 1000).toISOString();
const pastDays = (d: number) => new Date(now.getTime() - d * 86400 * 1000).toISOString();

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk_01',
    title: 'Praktikum Algoritma Pemrograman: Struktur Percabangan & Loop',
    subject: 'Informatika',
    kelas: 'Kelas 8B',
    description: 'Membuat program sederhana simulasi kalkulator konversi suhu dan deteksi bilangan prima menggunakan logika percabangan kondisional (if-else) dan loop (while/for). Sertakan alur flowchart dan penjelasan kode.',
    instructions: [
      'Tulis kode program Python atau blok Scratch yang dapat berjalan tanpa bug.',
      'Jelaskan logika percabangan dan perulangan minimal 2 paragraf.',
      'Sertakan tangkapan layar eksekusi program atau link repository/simulasi.',
      'Format pengerjaan rapi dan cantumkan kesimpulan uji coba.'
    ],
    rubric: [
      { id: 'r1', criteria: 'Kebenaran Logika Algoritma & Bebas Bug', weight: 40, description: 'Kode berjalan sesuai spesifikasi dan menangani input variatif' },
      { id: 'r2', criteria: 'Dokumentasi Flowchart & Penjelasan', weight: 35, description: 'Uraian langkah komputasi jelas dan runut' },
      { id: 'r3', criteria: 'Kreativitas & Kerapian Kode', weight: 25, description: 'Struktur kode terbaca dengan komentar keterangan' }
    ],
    maxScore: 100,
    deadline: inHours(3.5), // URGENT! Less than 4 hours
    createdAt: pastDays(3),
    createdBy: 'Pak Salman, M.Pd (Mentor Informatika)',
    rewardXpBase: 100,
    rewardXpMasteryBonus: 150
  },
  {
    id: 'tsk_02',
    title: 'Laporan Eksperimen Mandiri: Penerapan Hukum III Newton di Kehidupan',
    subject: 'IPA Terpadu',
    kelas: 'Kelas 8B',
    description: 'Mengamati dan mendokumentasikan fenomena gaya aksi-reaksi (Hukum III Newton) di lingkungan sekitar rumah atau sekolah (misal roket air, pantulan bola, atau gerakan perenang).',
    instructions: [
      'Ambil foto/video dokumentasi eksperimen nyata.',
      'Tuliskan tabel perbandingan besaran gaya aksi dan reaksi.',
      'Analisis hubungan vektor arah dan penyebab terjadinya gerak balasan.'
    ],
    rubric: [
      { id: 'r1', criteria: 'Kesesuaian Konsep Fisika Newton', weight: 40, description: 'Memahami prinsip aksi-reaksi dengan benar' },
      { id: 'r2', criteria: 'Kelengkapan Bukti Eksperimen', weight: 30, description: 'Foto/data kuantitatif tercantum valid' },
      { id: 'r3', criteria: 'Sistematika Laporan Ilmiah', weight: 30, description: 'Format laporan sesuai standar laboratorium' }
    ],
    maxScore: 100,
    deadline: inHours(22), // Deadline tomorrow
    createdAt: pastDays(2),
    createdBy: 'Ibu Ratna Dewi, S.Si',
    rewardXpBase: 100,
    rewardXpMasteryBonus: 150
  },
  {
    id: 'tsk_03',
    title: 'Analisis Diksi & Makna Konotatif Puisi Karya Chairil Anwar',
    subject: 'Bahasa Indonesia',
    kelas: 'Kelas 8B',
    description: 'Melakukan telaah kritis terhadap salah satu puisi Chairil Anwar (misal "Aku" atau "Krawang-Bekasi") dari aspek rima, imaji rasa, pilihan kata konotatif, dan pesan moral kebangsaan.',
    instructions: [
      'Pilih salah satu puisi Chairil Anwar dan kutip teks lengkapnya.',
      'Bongkar minimal 5 kata bermakna konotasi beserta tafsir maknanya.',
      'Tuliskan refleksi 150 kata tentang relevansi pesan puisi di zaman sekarang.'
    ],
    rubric: [
      { id: 'r1', criteria: 'Ketajaman Analisis Semantik', weight: 45, description: 'Ketepatan membedakan denotasi dan konotasi' },
      { id: 'r2', criteria: 'Kedalaman Refleksi Kebangsaan', weight: 35, description: 'Mampu menghubungkan pesan dengan realitas kini' },
      { id: 'r3', criteria: 'Penggunaan Bahasa Indonesia Baku & EYD', weight: 20, description: 'Kaidah tata tulis sesuai EYD V' }
    ],
    maxScore: 100,
    deadline: inHours(72), // 3 days
    createdAt: pastDays(1),
    createdBy: 'Pak Salman, M.Pd',
    rewardXpBase: 90,
    rewardXpMasteryBonus: 150
  },
  {
    id: 'tsk_04',
    title: 'Survei Statistika Lingkungan: Pola Pengelolaan Sampah Sekolah',
    subject: 'Matematika',
    kelas: 'Kelas 8B',
    description: 'Mengumpulkan data berat sampah harian per kelas, menyajikannya ke dalam diagram batang & lingkaran, serta menghitung nilai rata-rata (mean), median, dan modus.',
    instructions: [
      'Gunakan minimal 5 sampel kelas.',
      'Sajikan tabel frekuensi dan dua jenis diagram grafik.',
      'Hitung mean, median, dan modus dengan rumus matematis yang tepat.'
    ],
    rubric: [
      { id: 'r1', criteria: 'Akurasi Perhitungan Statistik', weight: 50, description: 'Nilai mean, median, dan modus dihitung tanpa kesalahan' },
      { id: 'r2', criteria: 'Penyajian Diagram & Visualisasi Data', weight: 30, description: 'Diagram rapi dengan label sumbu yang jelas' },
      { id: 'r3', criteria: 'Interpretasi Hasil Temuan', weight: 20, description: 'Kesimpulan logis dan relevan' }
    ],
    maxScore: 100,
    deadline: inHours(120), // 5 days
    createdAt: pastDays(1),
    createdBy: 'Pak Salman, M.Pd',
    rewardXpBase: 110,
    rewardXpMasteryBonus: 150
  },
  {
    id: 'tsk_05',
    title: 'Essay: The Role of Artificial Intelligence in Sustainable Future',
    subject: 'Bahasa Inggris',
    kelas: 'Kelas 8B',
    description: 'Write an argumentative short essay (300-400 words) discussing how AI can assist climate change mitigation and renewable energy optimization.',
    instructions: [
      'Include clear Thesis statement in introduction paragraph.',
      'Provide at least two concrete body examples (e.g. smart electric grids, deforestation tracking).',
      'Conclude with summary outlook.'
    ],
    rubric: [
      { id: 'r1', criteria: 'Grammar, Syntax & Academic Vocabulary', weight: 40, description: 'High precision of English tenses and vocabulary' },
      { id: 'r2', criteria: 'Argumentative Flow & Coherence', weight: 35, description: 'Logical transition words and strong arguments' },
      { id: 'r3', criteria: 'Originality & Depth', weight: 25, description: 'Unique viewpoints and critical thinking' }
    ],
    maxScore: 100,
    deadline: pastDays(1), // already ended & graded!
    createdAt: pastDays(7),
    createdBy: 'Mr. David Wilson, M.Ed',
    rewardXpBase: 100,
    rewardXpMasteryBonus: 150
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  // Completed submission for Arya with score 96 (Mastery >90% awarded!)
  {
    id: 'sub_05_arya',
    taskId: 'tsk_05',
    studentId: 'std_arya',
    studentName: 'Arya Pratama',
    studentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Arya&backgroundColor=1e293b',
    studentKelas: 'Kelas 8B',
    submittedAt: pastDays(2),
    status: 'sudah_dinilai',
    contentText: 'Artificial intelligence serves as a transformative catalyst for climate sustainability. By analyzing petabytes of satellite imagery, automated computer vision algorithms detect illegal deforestation in the Amazon basin within minutes rather than weeks. Furthermore, predictive machine learning models optimize smart power grid distribution across municipal solar arrays, reducing energy dissipation by up to 23%. In conclusion, while AI requires substantial computational energy, its strategic implementation delivers an overwhelmingly net-positive balance for global decarbonization.',
    attachmentName: 'Essay_AI_Sustainability_Arya.pdf',
    score: 96,
    teacherFeedback: 'Outstanding analytical essay, Arya! Your vocabulary and cohesive transitions are exemplary. The specific data on solar grid optimization demonstrates commendable depth. +150 XP Mastery Bonus and Sultan 90+ Badge awarded!',
    rubricScores: { r1: 39, r2: 34, r3: 23 },
    isOverdue: false,
    appreciationBonusAwarded: true,
    awardedXp: 250 // 100 base + 150 bonus!
  },
  // Completed submission for Siti with score 94 (Mastery >90% awarded!)
  {
    id: 'sub_05_siti',
    taskId: 'tsk_05',
    studentId: 'std_siti',
    studentName: 'Siti Nurhaliza',
    studentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Siti&backgroundColor=0f172a',
    studentKelas: 'Kelas 8B',
    submittedAt: pastDays(2),
    status: 'sudah_dinilai',
    contentText: 'Modern environmental challenges necessitate technological symbiosis. Artificial Intelligence plays an indispensable role in ecological restoration through precision agriculture, where autonomous sensor networks evaluate soil moisture and minimize synthetic fertilizer runoff. Concurrently, machine learning models accelerate material science research to develop next-generation biodegradable polymers.',
    attachmentName: 'Siti_Essay_Climate_AI.docx',
    score: 94,
    teacherFeedback: 'Karya esai yang sangat matang dan bernas, Siti. Pemilihan diksi ilmiah dalam Bahasa Inggris luar biasa bagus! Selamat atas perolehan nilai maksimal >90%.',
    rubricScores: { r1: 38, r2: 33, r3: 23 },
    isOverdue: false,
    appreciationBonusAwarded: true,
    awardedXp: 250
  },
  // Siti already submitted task 1 (waiting for grading)
  {
    id: 'sub_01_siti',
    taskId: 'tsk_01',
    studentId: 'std_siti',
    studentName: 'Siti Nurhaliza',
    studentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Siti&backgroundColor=0f172a',
    studentKelas: 'Kelas 8B',
    submittedAt: pastDays(0.5),
    status: 'menunggu_nilai',
    contentText: '# Program Python Konversi Suhu & Bilangan Prima\n\ndef cek_prima(n):\n    if n <= 1: return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0: return False\n    return True\n\n# Flowchart dan dokumentasi terlampir dalam file link GitHub',
    attachmentName: 'algoritma_siti_v2.py',
    attachmentUrl: 'https://github.com/siti-school/python-lab',
    score: null,
    isOverdue: false,
    appreciationBonusAwarded: false,
    awardedXp: 0
  },
  // Budi submitted task 5 with score 78
  {
    id: 'sub_05_budi',
    taskId: 'tsk_05',
    studentId: 'std_budi',
    studentName: 'Budi Santoso',
    studentAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Budi&backgroundColor=3b0764',
    studentKelas: 'Kelas 8B',
    submittedAt: pastDays(1.5),
    status: 'sudah_dinilai',
    contentText: 'AI is very good for future nature. It helps farmers to know when rain is coming and plant rice correctly. Also AI helps robot to clean river plastic. In my opinion AI is good.',
    attachmentName: 'Budi_Essay_Draft.docx',
    score: 78,
    teacherFeedback: 'Ide dasar sudah bagus, Budi. Namun perlu penambahan contoh detail dan ragam tenses agar argumenmu lebih kokoh. Tetap semangat, tingkatkan di tugas selanjutnya!',
    rubricScores: { r1: 30, r2: 28, r3: 20 },
    isOverdue: false,
    appreciationBonusAwarded: false,
    awardedXp: 100
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    type: 'deadline_warning',
    title: 'Tenggat Waktu Mendesak (< 4 Jam)',
    message: 'Tugas "Praktikum Algoritma Pemrograman" jatuh tempo pukul 23:59 WIB hari ini! Segera kumpulkan untuk mencegah pengurangan poin tepat waktu.',
    recipientId: 'all',
    taskId: 'tsk_01',
    timestamp: new Date(now.getTime() - 25 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'kritis'
  },
  {
    id: 'notif_02',
    type: 'appreciation_90',
    title: 'Selamat! Poin Apresiasi Nilai Maksimal >90%',
    message: 'Arya Pratama meraih skor 96 pada tugas Bahasa Inggris. Bonus +150 XP & Lencana Sultan Nilai 90+ berhasil ditambahkan ke profil!',
    recipientId: 'std_arya',
    taskId: 'tsk_05',
    timestamp: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(),
    isRead: false,
    priority: 'info'
  },
  {
    id: 'notif_03',
    type: 'deadline_warning',
    title: 'Tenggat Waktu Besok',
    message: 'Tugas "Laporan Eksperimen Mandiri Hukum Newton" jatuh tempo besok sore. Jangan lupa cek draf dengan asisten AI sebelum kumpul.',
    recipientId: 'all',
    taskId: 'tsk_02',
    timestamp: new Date(now.getTime() - 5 * 3600 * 1000).toISOString(),
    isRead: true,
    priority: 'waspada'
  }
];

// Storage Keys
const STORAGE_KEY_STUDENTS = 'edutask_students_v1';
const STORAGE_KEY_TASKS = 'edutask_tasks_v1';
const STORAGE_KEY_SUBMISSIONS = 'edutask_submissions_v1';
const STORAGE_KEY_NOTIFS = 'edutask_notifications_v1';

export function loadStoredData(): {
  students: Student[];
  tasks: Task[];
  submissions: Submission[];
  notifications: NotificationItem[];
} {
  if (typeof window === 'undefined') {
    return {
      students: INITIAL_STUDENTS,
      tasks: INITIAL_TASKS,
      submissions: INITIAL_SUBMISSIONS,
      notifications: INITIAL_NOTIFICATIONS,
    };
  }

  try {
    const s = localStorage.getItem(STORAGE_KEY_STUDENTS);
    const t = localStorage.getItem(STORAGE_KEY_TASKS);
    const sub = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
    const n = localStorage.getItem(STORAGE_KEY_NOTIFS);

    return {
      students: s ? JSON.parse(s) : INITIAL_STUDENTS,
      tasks: t ? JSON.parse(t) : INITIAL_TASKS,
      submissions: sub ? JSON.parse(sub) : INITIAL_SUBMISSIONS,
      notifications: n ? JSON.parse(n) : INITIAL_NOTIFICATIONS,
    };
  } catch {
    return {
      students: INITIAL_STUDENTS,
      tasks: INITIAL_TASKS,
      submissions: INITIAL_SUBMISSIONS,
      notifications: INITIAL_NOTIFICATIONS,
    };
  }
}

export function saveStoredData(data: {
  students: Student[];
  tasks: Task[];
  submissions: Submission[];
  notifications: NotificationItem[];
}) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(data.students));
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(data.tasks));
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(data.submissions));
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(data.notifications));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export function resetDemoData() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_STUDENTS);
  localStorage.removeItem(STORAGE_KEY_TASKS);
  localStorage.removeItem(STORAGE_KEY_SUBMISSIONS);
  localStorage.removeItem(STORAGE_KEY_NOTIFS);
}
