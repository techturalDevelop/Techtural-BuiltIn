import React from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div 
      role="status" 
      aria-live="polite"
      className="fixed bottom-5 left-5 z-50 flex items-center gap-2.5 rounded-2xl bg-amber-600/95 dark:bg-amber-600/95 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white shadow-2xl border border-amber-400/30 animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      <WifiOff size={15} className="animate-pulse text-amber-100" />
      <span>Offline Mode — Cached data and offline kit home catalog active.</span>
    </div>
  );
};

export default OfflineIndicator;
