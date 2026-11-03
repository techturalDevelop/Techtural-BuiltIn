import React, { useState } from 'react';
import { 
  KeyRound, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Lock, 
  X, 
  ArrowRight, 
  HelpCircle,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { verifyPasskey, PasskeyUser } from '@/lib/passkeyAuth';

interface PasskeySignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: PasskeyUser) => void;
}

export const PasskeySignInModal: React.FC<PasskeySignInModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [passkey, setPasskey] = useState('');
  const [showPasskey, setShowPasskey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey.trim()) {
      setErrorMessage('Please enter your authorized passkey.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await verifyPasskey(passkey.trim());
      if (result.success && result.user) {
        toast.success(`Welcome back, ${result.user.displayName}!`, {
          description: `Signed in as ${result.user.role.toUpperCase()} • Engineering & Admin Access Granted.`
        });
        setPasskey('');
        onSuccess(result.user);
        onClose();
      } else {
        setErrorMessage(result.message || 'Invalid passkey. Access denied.');
        toast.error('Authentication Failed', {
          description: result.message || 'The passkey entered was not recognized.'
        });
      }
    } catch (err: any) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-slate-950 text-white p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center shadow-inner">
                <KeyRound size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Portal Sign In
                </h3>
                <span className="text-xs text-slate-400 font-mono tracking-wider uppercase">
                  Techtural BuiltIn PNG
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <p className="text-xs text-slate-300 mt-4 leading-relaxed">
            Authorized personnel access. Enter your official passkey to access project management, structural specifications, and client inquiries.
          </p>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-start gap-2.5 text-xs text-destructive">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">
                {errorMessage}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="passkey-input" 
                className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5"
              >
                <Lock size={12} className="text-primary" />
                <span>Personnel Passkey</span>
              </label>
              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors cursor-pointer"
              >
                <HelpCircle size={12} />
                <span>Passkey Help</span>
              </button>
            </div>

            <div className="relative">
              <Input
                id="passkey-input"
                type={showPasskey ? 'text' : 'password'}
                value={passkey}
                onChange={(e) => {
                  setPasskey(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Enter authorized passkey..."
                autoFocus
                disabled={isLoading}
                className="h-12 pl-4 pr-11 rounded-2xl font-mono text-sm tracking-widest bg-muted/50 border-border focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPasskey(!showPasskey)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label={showPasskey ? "Hide passkey" : "Show passkey"}
              >
                {showPasskey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Quick Firestore Guide Drawer */}
          {showHelp && (
            <div className="p-4 rounded-2xl bg-muted/60 border border-border/80 text-xs text-muted-foreground space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Firestore Passkey Management</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                Authorized passkeys can be issued or revoked directly in your Firestore database collection: <code className="px-1.5 py-0.5 rounded bg-background border font-mono font-bold text-primary">authorized_passkeys</code>.
              </p>
              <div className="text-[11px] bg-background/80 p-2.5 rounded-xl border font-mono space-y-1">
                <div>Document: <span className="text-amber-500">tb-admin-gerea-george</span></div>
                <div>Fields:</div>
                <div className="pl-3 text-muted-foreground">displayName: <span className="text-primary">"Gerea George"</span></div>
                <div className="pl-3 text-muted-foreground">role: <span className="text-blue-500">"admin"</span></div>
                <div className="pl-3 text-muted-foreground">active: <span className="text-emerald-500">true</span></div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border/50 text-muted-foreground text-[11px]">
            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            <span>Google OAuth bypassed. Direct passkey token authentication active.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-2xl h-11 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !passkey.trim()}
              className="flex-1 rounded-2xl h-11 text-xs font-bold gap-2 cursor-pointer shadow-md"
            >
              {isLoading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>Unlock Portal</span>
                  <ArrowRight size={14} />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasskeySignInModal;
