import React, { useState } from 'react';
import { Task, Submission } from '../types';
import { 
  X, 
  Check, 
  Sparkles, 
  Crown, 
  Paperclip, 
  ExternalLink, 
  Clock, 
  Award,
  AlertCircle
} from 'lucide-react';
import { generateTeacherFeedbackSuggestion } from '../utils/geminiAi';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

interface GradingModalProps {
  submission: Submission;
  task: Task;
  onClose: () => void;
  onSaveGrade: (gradedData: {
    submissionId: string;
    score: number;
    feedback: string;
    awardedXp: number;
    appreciationBonusAwarded: boolean;
  }) => void;
}

export const GradingModal: React.FC<GradingModalProps> = ({
  submission,
  task,
  onClose,
  onSaveGrade
}) => {
  const [score, setScore] = useState<number>(submission.score !== null ? submission.score : 85);
  const [feedback, setFeedback] = useState<string>(submission.teacherFeedback || '');
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  const isMastery = score >= 90;
  const baseReward = task.rewardXpBase || 100;
  const masteryBonus = isMastery ? (task.rewardXpMasteryBonus || 150) : 0;
  const totalXpToAward = baseReward + masteryBonus;

  const handleGenerateAiFeedback = async () => {
    setIsGeneratingFeedback(true);
    sound.playClick();
    try {
      const generated = await generateTeacherFeedbackSuggestion(task, submission, score);
      setFeedback(generated);
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const handleSave = () => {
    if (isMastery) {
      sound.playVictoryFanfare();
      triggerConfetti(3000);
    } else {
      sound.playDeadlineChime();
    }

    onSaveGrade({
      submissionId: submission.id,
      score,
      feedback,
      awardedXp: totalXpToAward,
      appreciationBonusAwarded: isMastery
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <img
              src={submission.studentAvatar}
              alt={submission.studentName}
              className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800"
            />
            <div>
              <h2 className="text-base font-bold text-white">
                Penilaian Tugas: {submission.studentName}
              </h2>
              <div className="text-xs text-slate-400">
                <span>{submission.studentKelas}</span>
                <span className="mx-1.5">·</span>
                <span>Tugas: {task.title}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Submission Preview */}
          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Hasil Pekerjaan Siswa</span>
              <span className="font-mono tabular-nums">
                Waktu Kumpul: {new Date(submission.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} WIB
              </span>
            </div>

            <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto bg-slate-900/50 p-3 rounded-lg border border-slate-800/80 font-mono">
              {submission.contentText}
            </div>

            {/* Attachments */}
            {(submission.attachmentName || submission.attachmentUrl) && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
                {submission.attachmentName && (
                  <span className="inline-flex items-center gap-1.5 text-slate-300 bg-slate-800 px-2.5 py-1 rounded">
                    <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                    {submission.attachmentName}
                  </span>
                )}
                {submission.attachmentUrl && (
                  <a
                    href={submission.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Buka Dokumen Siswa
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Scoring Control */}
          <div className="space-y-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-white block">
                  Nilai Akhir (Skala 0 - 100)
                </label>
                <span className="text-xs text-slate-400">
                  Target Nilai Apresiasi Spesial: &gt; 90%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className="w-20 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-center font-mono font-bold text-xl text-white focus:outline-none focus:border-emerald-500 tabular-nums"
                />
                <span className="text-slate-400 text-sm font-bold">/ 100</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />

            {/* Dynamic 90%+ Appreciation Card */}
            {isMastery ? (
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 flex items-start gap-3 text-amber-200">
                <Crown className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <span>APRESIASI NILAI MAKSIMAL AKTIF (&gt;90%)</span>
                    <span className="font-mono tabular-nums text-emerald-400 font-bold">+150 XP BONUS</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Siswa ini memenuhi syarat lencana kehormatan <span className="font-semibold text-amber-300">"Sultan Nilai 90+"</span>. Sistem otomatis menambahkan total <span className="font-mono font-bold text-white tabular-nums">{totalXpToAward} XP</span> ke profil siswa dan memajang medali di Leaderboard.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Poin Normal Tugas:</span>
                <span className="font-mono text-slate-300">{baseReward} XP (Tingkatkan ke &gt;90 untuk bonus +150 XP)</span>
              </div>
            )}
          </div>

          {/* Feedback Form */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Ulasan &amp; Catatan Motivasi Guru
              </label>
              <button
                type="button"
                onClick={handleGenerateAiFeedback}
                disabled={isGeneratingFeedback}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isGeneratingFeedback ? (
                  <>
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    Menyusun Feedback AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Bantu Susun Feedback AI
                  </>
                )}
              </button>
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              placeholder="Berikan catatan konstruktif dan kalimat penyemangat untuk siswa..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => { sound.playClick(); onClose(); }}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/30"
            >
              <Check className="w-3.5 h-3.5" />
              Simpan &amp; Terbitkan Nilai
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
