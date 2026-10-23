import React from 'react';
import { NotificationItem } from '../types';
import { 
  X, 
  Bell, 
  Clock, 
  Crown, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  CheckCheck
} from 'lucide-react';
import { sound } from '../utils/audio';

interface NotificationModalProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onNotificationClick?: (notif: NotificationItem) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  notifications,
  onClose,
  onMarkAllAsRead,
  onNotificationClick
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">
              Pusat Notifikasi &amp; Pengingat Realtime
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { sound.playClick(); onMarkAllAsRead(); }}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
              title="Tandai semua dibaca"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tandai Dibaca</span>
            </button>
            <button
              onClick={() => { sound.playClick(); onClose(); }}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-500">
              Belum ada notifikasi baru saat ini.
            </div>
          ) : (
            notifications.map((notif) => {
              const isUrgent = notif.priority === 'kritis';
              const isWarning = notif.priority === 'waspada';
              const isMastery = notif.type === 'appreciation_90';

              return (
                <div
                  key={notif.id}
                  onClick={() => onNotificationClick && onNotificationClick(notif)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    !notif.isRead
                      ? isUrgent
                        ? 'bg-rose-950/30 border-rose-900/50'
                        : isMastery
                        ? 'bg-amber-950/30 border-amber-500/40'
                        : 'bg-slate-900 border-slate-800'
                      : 'bg-slate-950/40 border-slate-900 opacity-70'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isUrgent
                          ? 'bg-rose-500/20 text-rose-400'
                          : isMastery
                          ? 'bg-amber-500/20 text-amber-400'
                          : isWarning
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {isMastery ? (
                        <Crown className="w-3.5 h-3.5" />
                      ) : isUrgent ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-semibold ${isMastery ? 'text-amber-300' : 'text-white'}`}>
                          {notif.title}
                        </span>
                        <span className="font-mono tabular-nums text-[10px] text-slate-500">
                          {new Date(notif.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-500">
          Sistem otomatis memantau batas pengumpulan setiap saat
        </div>

      </div>
    </div>
  );
};
