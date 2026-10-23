import { GoogleGenAI } from '@google/genai';
import { Task, Submission, Student } from '../types';

// Safe retrieval of API key from client environment if set
const apiKey = typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_GEMINI_API_KEY : '';
const aiClient = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function analyzeStudentDraft(task: Task, draftContent: string): Promise<{
  scoreEstimate: string;
  strengths: string[];
  recommendations: string[];
  readinessPercentage: number;
}> {
  if (aiClient) {
    try {
      const prompt = `Anda adalah asisten guru sekolah nasional yang ramah dan suportif (EduTask AI).
Tugas: "${task.title}"
Mata Pelajaran: "${task.subject}"
Petunjuk Tugas: ${task.instructions.join(', ')}
Rubrik: ${task.rubric.map(r => `${r.criteria} (${r.weight}%)`).join(', ')}

Draf Jawaban Siswa:
"${draftContent}"

Analisis draf ini dan berikan output dalam format JSON valid dengan struktur:
{
  "scoreEstimate": "prediksi rentang nilai, misal 85-92",
  "readinessPercentage": angka 10-100,
  "strengths": ["kelebihan 1", "kelebihan 2"],
  "recommendations": ["saran perbaikan konkret 1", "saran perbaikan konkret 2"]
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text);
        return {
          scoreEstimate: parsed.scoreEstimate || '80-88',
          readinessPercentage: Number(parsed.readinessPercentage) || 82,
          strengths: parsed.strengths || ['Struktur tulisan sudah teratur', 'Menjawab inti instruksi'],
          recommendations: parsed.recommendations || ['Perdalam argumentasi pada bagian kesimpulan'],
        };
      }
    } catch {
      // Fall through to heuristic intelligent analyzer
    }
  }

  // Smart Heuristic Fallback
  const wordCount = draftContent.trim().split(/\s+/).filter(Boolean).length;
  const hasRubricKeyword = task.rubric.some(r => draftContent.toLowerCase().includes(r.criteria.toLowerCase().slice(0, 5)));

  let readiness = 60;
  if (wordCount > 30) readiness += 15;
  if (wordCount > 80) readiness += 15;
  if (hasRubricKeyword) readiness += 10;
  readiness = Math.min(95, Math.max(45, readiness));

  const strengths = [];
  const recommendations = [];

  if (wordCount < 40) {
    strengths.push('Gagasan awal sudah terbentuk dengan ringkas');
    recommendations.push('Perluas uraian penjelasan agar rubrik pemahaman konsep tercapai optimal.');
    recommendations.push('Sertakan contoh kasus atau fakta pendukung.');
  } else {
    strengths.push('Elaborasi jawaban cukup mendalam dan terstruktur');
    strengths.push('Kesesuaian dengan instruksi materi tampak relevan');
    recommendations.push('Periksa kembali kerapian tanda baca dan ejaan bahasa Indonesia');
    if (readiness < 90) {
      recommendations.push('Tambahkan kesimpulan analitis untuk berpeluang meraih nilai >90% (Bonus Apresiasi +150 XP)!');
    }
  }

  return {
    scoreEstimate: readiness >= 90 ? '90-96 (Peluang Bintang Emas!)' : readiness >= 75 ? '78-88' : '65-74',
    readinessPercentage: readiness,
    strengths,
    recommendations,
  };
}

export async function generateTeacherFeedbackSuggestion(
  task: Task,
  submission: Submission,
  score: number
): Promise<string> {
  if (aiClient) {
    try {
      const isSuperMastery = score >= 90;
      const prompt = `Sebagai Guru Pendamping SMP/SMA Nasional yang bijak dan memotivasi, tuliskan 2-3 kalimat catatan feedback untuk siswa bernama ${submission.studentName}.
Mata Pelajaran: ${task.subject}
Tugas: ${task.title}
Nilai Diberikan: ${score}/100 ${isSuperMastery ? '(Meraih Apresiasi Nilai Maksimal >90%)' : ''}
Kutipan Jawaban Siswa: "${submission.contentText.slice(0, 200)}"

Catatan feedback harus hangat, jelas mengenai apa yang bagus, dan dorongan semangat belajar. Gunakan Bahasa Indonesia formal tapi akrab.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch {
      // Fall through to heuristic feedback
    }
  }

  // High quality heuristic generator
  if (score >= 90) {
    return `Luar biasa, ${submission.studentName}! Penguasaan materi pada tugas "${task.title}" sangat komprehensif, terstruktur, dan analitis. Kamu berhak mendapatkan Lencana Bintang Emas dan +150 Poin Apresiasi. Terus pertahankan ketekunan ini!`;
  } else if (score >= 75) {
    return `Bagus sekali, ${submission.studentName}. Sebagian besar indikator dalam tugas "${task.title}" sudah kamu selesaikan dengan baik. Coba eksplorasi lebih dalam pada contoh aplikasinya agar semakin optimal. Semangat terus!`;
  } else {
    return `Kerja yang baik sudah mengumpulkan tepat waktu, ${submission.studentName}. Masih ada beberapa poin pemahaman dasar yang bisa ditingkatkan. Jangan ragu konsultasi di jam bimbingan mentor untuk perbaikan selanjutnya ya!`;
  }
}

export async function generateParentReportSummary(
  student: Student,
  submissions: Submission[],
  allTasks: Task[]
): Promise<string> {
  const completed = submissions.filter(s => s.status === 'sudah_dinilai');
  const scores = completed.map(s => s.score || 0);
  const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const masteryCount = submissions.filter(s => (s.score || 0) >= 90).length;

  if (aiClient) {
    try {
      const prompt = `Tuliskan ringkasan kemajuan belajar formal untuk Orang Tua dari siswa:
Nama Siswa: ${student.name}
Kelas: ${student.kelas}
Rata-rata Nilai Tugas: ${avg}/100
Tugas dengan Nilai Maksimal (>90%): ${masteryCount}
Total Poin Apresiasi (XP): ${student.totalXp}
Streak Keaktifan: ${student.streakDays} hari

Format dalam 3 paragraf singkat Bahasa Indonesia:
1. Apresiasi atas ketekunan dan performa siswa saat ini.
2. Analisis ketepatan pengumpulan dan kualitas tugas.
3. Rekomendasi peran orang tua di rumah untuk terus mendampingi.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch {
      // Fallback
    }
  }

  return `Yth. Bapak/Ibu Wali dari ${student.name},

Kami melaporkan bahwa ananda saat ini menunjukkan perkembangan belajar yang positif di kelas ${student.kelas} dengan capaian rata-rata tugas ${avg}/100 dan telah mengumpulkan ${masteryCount} karya berpredikat istimewa (>90%). Ananda juga mempertahankan keaktifan belajar berturut-turut selama ${student.streakDays} hari.

Ketepatan waktu dan komitmen ananda dalam menyelesaikan instruksi rubrik sangat membanggakan. Pencapaian ${student.totalXp} Poin Apresiasi menempatkan ananda di jajaran siswa berprestasi sekolah.

Kami mengharapkan bimbingan dan apresiasi hangat dari orang tua di rumah agar ananda senantiasa termotivasi menjaga konsistensi belajar dan manajemen waktu sebelum tenggat tugas berikutnya. Terima kasih atas sinergi baik sekolah dan keluarga.`;
}

export async function generateMotivationalNotificationText(hoursLeft: number, taskTitle: string): Promise<string> {
  if (hoursLeft <= 3) {
    return `Pengingat Mendesak: Tugas "${taskTitle}" tersisa ${hoursLeft} jam lagi! Segera kumpulkan untuk mengamankan poin tepat waktu dan hindari penalti keterlambatan.`;
  } else if (hoursLeft <= 24) {
    return `Tenggat Waktu Besok: Tugas "${taskTitle}" jatuh tempo dalam ${hoursLeft} jam. Tuntaskan sekarang dan raih peluang nilai >90% untuk ekstra +150 XP!`;
  } else {
    return `Pengingat Belajar: Tugas "${taskTitle}" dapat kamu cicil hari ini agar hasil pengerjaan lebih matang dan maksimal.`;
  }
}
