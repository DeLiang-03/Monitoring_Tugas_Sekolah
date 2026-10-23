import React, { useState } from 'react';
import { Task, Submission, Student } from '../types';
import { 
  X, 
  Send, 
  Sparkles, 
  CheckCircle, 
  Paperclip, 
  Link as LinkIcon, 
  Clock, 
  Award,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { analyzeStudentDraft } from '../utils/geminiAi';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

interface SubmissionModalProps {
  task: Task;
  student: Student;
  existingSubmission?: Submission;
  onClose: () => void;
  onSubmitWork: (submissionData: {
    taskId: string;
    studentId: string;
    contentText: string;
    attachmentName?: string;
    attachmentUrl?: string;
  }) => void;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  task,
  student,
  existingSubmission,
  onClose,
  onSubmitWork
}) => {
  const [contentText, setContentText] = useState(existingSubmission?.contentText || '');
  const [attachmentUrl, setAttachmentUrl] = useState(existingSubmission?.attachmentUrl || '');
  const [attachmentName, setAttachmentName] = useState(existingSubmission?.attachmentName || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    scoreEstimate: string;
    strengths: string[];
    recommendations: string[];
    readinessPercentage: number;
  } | null>(null);

  const isGraded = existingSubmission?.status === 'sudah_dinilai';
  const isSubmitted = existingSubmission?.status === 'menunggu_nilai';

  const handleRunAiCheck = async () => {
    if (!contentText.trim()) return;
    setIsAnalyzing(true);
    sound.playClick();
    try {
      const result = await analyzeStudentDraft(task, contentText);
      setAiAnalysis(result);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentText.trim()) return;

    sound.playDeadlineChime();
    triggerConfetti(2000);

    onSubmitWork({
      taskId: task.id,
      studentId: student.id,
      contentText,
      attachmentName: attachmentName || 'Dokumen_Tugas.pdf',
      attachmentUrl
    });

    onClose();
  };

  const deadlineDate = new Date(task.deadline);
  const isPastDeadline = deadlineDate.getTime() < Date.now();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>{task.subject}</span>
              <span aria-hidden="true">·</span>
              <span>{task.kelas}</span>
              <span aria-hidden="true">·</span>
              <span className={isPastDeadline ? 'text-rose-400 font-medium' : 'text-amber-400 font-medium'}>
                Tenggat: {deadlineDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} WIB
              </span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">
              {task.title}
            </h2>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Status Alert if Graded with Appreciation > 90% */}
          {isGraded && (
            <div className={`p-4 rounded-xl border ${
              (existingSubmission.score || 0) >= 90
                ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Award className="w-6 h-6 text-amber-400" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Nilai Resmi: <span className="text-xl font-bold font-mono tabular-nums text-amber-400">{existingSubmission.score}</span> / 100
                    </h4>
                    {(existingSubmission.score || 0) >= 90 && (
                      <span className="text-xs text-amber-300 font-medium">
                        ★ Peraih Apresiasi Nilai Maksimal &gt;90% (+150 XP Bonus Diterima)
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {existingSubmission.teacherFeedback && (
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-300">
                  <span className="font-semibold text-slate-200">Catatan Guru:</span> "{existingSubmission.teacherFeedback}"
                </div>
              )}
            </div>
          )}

          {/* Instructions & Rubrics Preview */}
          <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Instruksi Pengerjaan &amp; Rubrik
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {task.description}
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
              {task.instructions.map((inst, idx) => (
                <li key={idx}>{inst}</li>
              ))}
            </ul>

            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-300">Indikator Penilaian:</span>
              {task.rubric.map((r) => (
                <span key={r.id} className="text-slate-400">
                  {r.criteria} ({r.weight}%)
                </span>
              ))}
            </div>
          </div>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-slate-300">
                  Uraian Jawaban / Analisis Siswa
                </label>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  {contentText.trim().split(/\s+/).filter(Boolean).length} kata
                </span>
              </div>
              <textarea
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                disabled={isGraded}
                rows={6}
                placeholder="Tuliskan uraian hasil analisis, temuan, atau kode pemrogramanmu di sini secara terstruktur..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none disabled:opacity-70"
              />
            </div>

            {/* Attachments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                  Nama Lampiran File (Simulasi)
                </label>
                <input
                  type="text"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  disabled={isGraded}
                  placeholder="Misal: praktikum_algoritma_arya.py"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                  Tautan Lampiran (Google Drive / GitHub)
                </label>
                <input
                  type="text"
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  disabled={isGraded}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* AI Draft Checker Assistant */}
            {!isGraded && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/20 via-blue-950/20 to-indigo-950/20 border border-emerald-500/20">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-white">
                      Asisten AI Draf Evaluator
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRunAiCheck}
                    disabled={isAnalyzing || !contentText.trim()}
                    className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 disabled:opacity-50 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isAnalyzing ? (
                      <>
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        Menganalisis Draf...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Cek Kesiapan Draf Sekarang
                      </>
                    )}
                  </button>
                </div>

                {aiAnalysis && (
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Perkiraan Kesiapan Rubrik:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {aiAnalysis.readinessPercentage}% ({aiAnalysis.scoreEstimate})
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 font-medium">Kelebihan Draf Saat Ini:</span>
                      <ul className="text-slate-300 list-disc pl-4 space-y-0.5">
                        {aiAnalysis.strengths.map((str, idx) => (
                          <li key={idx}>{str}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1">
                      <span className="text-amber-400 font-medium">Tips Lolos Nilai &gt;90% (Bonus +150 XP):</span>
                      <ul className="text-amber-200/90 list-disc pl-4 space-y-0.5">
                        {aiAnalysis.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => { sound.playClick(); onClose(); }}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Tutup
              </button>

              {!isGraded && (
                <button
                  type="submit"
                  disabled={!contentText.trim()}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitted ? 'Perbarui Pengumpulan' : 'Kumpulkan Tugas'}
                </button>
              )}
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
