import React, { useState } from 'react';
import { Task, SubjectCategory } from '../types';
import { X, Plus, Trash2, Calendar, Award } from 'lucide-react';
import { sound } from '../utils/audio';

interface CreateTaskModalProps {
  onClose: () => void;
  onCreateTask: (newTask: Omit<Task, 'id' | 'createdAt'>) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  onClose,
  onCreateTask
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<SubjectCategory>('Informatika');
  const [kelas, setKelas] = useState('Kelas 8B');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState<string[]>([
    'Kerjakan secara mandiri dan cermat.',
    'Sertakan referensi atau langkah analisis pendukung.'
  ]);
  const [newInstruction, setNewInstruction] = useState('');
  
  // Tomorrow afternoon default
  const defaultDeadline = new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16);
  const [deadline, setDeadline] = useState(defaultDeadline);

  const [rubrics, setRubrics] = useState([
    { id: 'r1', criteria: 'Kesesuaian Konsep & Teori', weight: 40, description: 'Penguasaan materi pokok' },
    { id: 'r2', criteria: 'Sistematika & Ketepatan Analisis', weight: 35, description: 'Langkah pemecahan masalah' },
    { id: 'r3', criteria: 'Kreativitas & Kerapian Dokumen', weight: 25, description: 'Presentasi dan orisinalitas ide' }
  ]);

  const handleAddInstruction = () => {
    if (!newInstruction.trim()) return;
    setInstructions([...instructions, newInstruction.trim()]);
    setNewInstruction('');
  };

  const handleRemoveInstruction = (idx: number) => {
    setInstructions(instructions.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    sound.playDeadlineChime();
    onCreateTask({
      title,
      subject,
      kelas,
      description,
      instructions,
      rubric: rubrics,
      maxScore: 100,
      deadline: new Date(deadline).toISOString(),
      createdBy: 'Pak Salman, M.Pd (Mentor Kurikulum)',
      rewardXpBase: 100,
      rewardXpMasteryBonus: 150
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <h2 className="text-base font-bold text-white">Buat Tugas Pembelajaran Baru</h2>
            <p className="text-xs text-slate-400">Atur instruksi, bobot rubrik, dan tenggat waktu otomatis</p>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Judul Tugas / Proyek
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Eksperimen Dinamika Fluida Sederhana"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Subject & Class */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Mata Pelajaran
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectCategory)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Informatika">Informatika</option>
                <option value="Matematika">Matematika</option>
                <option value="IPA Terpadu">IPA Terpadu</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="Bahasa Inggris">Bahasa Inggris</option>
                <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Sasaran Kelas
              </label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Kelas 8B">Kelas 8B (Bimbingan)</option>
                <option value="Kelas 8A">Kelas 8A</option>
                <option value="Kelas 9A">Kelas 9A</option>
              </select>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Tenggat Waktu Pengumpulan (Deadline Otomatis)
            </label>
            <input
              type="datetime-local"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Deskripsi Materi &amp; Konteks Tugas
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan tujuan pembelajaran dan latar belakang tugas..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Instructions List */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Poin-Poin Instruksi Pengerjaan
            </label>
            <div className="space-y-1.5 mb-2">
              {instructions.map((inst, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-200">· {inst}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInstruction(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)}
                placeholder="Tambahkan langkah instruksi baru..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddInstruction}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Gamification Incentives Box */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <span className="font-semibold text-white block">Skema Apresiasi Siswa:</span>
                <span className="text-slate-400">100 XP Dasar + 150 XP Bonus &amp; Lencana jika nilai &gt;90%</span>
              </div>
            </div>
            <span className="font-mono tabular-nums text-emerald-400 font-bold bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/40">
              Maks 250 XP
            </span>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => { sound.playClick(); onClose(); }}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Publikasikan Tugas
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
