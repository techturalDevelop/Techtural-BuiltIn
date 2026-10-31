import React, { useState } from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Download, Check, Share, PlusSquare, Monitor, Smartphone, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PWAInstallButtonProps {
  variant?: 'nav' | 'footer' | 'banner' | 'card';
  className?: string;
  showText?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'nav',
  className,
  showText = true,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already installed in standalone mode
  if (isInstalled) {
    if (variant === 'nav') {
      return null;
    }
    return (
      <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold", className)}>
        <Check size={13} />
        <span>App Installed</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      try {
        setIsInstalling(true);
        const success = await install();
        if (success) {
          toast.success('Techtural BuiltIn App installed successfully!');
        }
      } catch (err) {
        toast.error('Installation could not be completed.');
      } finally {
        setIsInstalling(false);
      }
    } else {
      // Show platform guide (iOS Safari or desktop instructions)
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {variant === 'nav' ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleInstallClick}
          disabled={isInstalling}
          className={cn(
            "rounded-full gap-1.5 text-xs font-semibold border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-all cursor-pointer shadow-2xs",
            className
          )}
          title="Install Techtural BuiltIn on your device for instant offline access"
        >
          <Download size={13} className="text-primary animate-pulse" />
          {showText && <span>Install App</span>}
        </Button>
      ) : variant === 'footer' ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={handleInstallClick}
          className={cn("rounded-xl gap-2 text-xs font-medium bg-muted/80 hover:bg-muted text-foreground border border-border/80", className)}
        >
          <Download size={14} className="text-primary" />
          <span>Download &amp; Install App</span>
        </Button>
      ) : variant === 'banner' ? (
        <div className={cn("p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", className)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <Smartphone size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                Install Techtural App
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-primary/15 text-primary uppercase font-bold">PWA</span>
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Fast offline access to kit homes, BOQ calculators, and digital specifications on desktop &amp; Android.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleInstallClick}
            className="rounded-xl px-5 gap-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
          >
            <Download size={14} />
            <span>Install Now</span>
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleInstallClick}
          className={cn("rounded-xl gap-2", className)}
        >
          <Download size={16} />
          {showText && <span>Install Techtural App</span>}
        </Button>
      )}

      {/* Installation Guide Modal (iOS Safari or Manual Browser instructions) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-background border border-border p-6 shadow-2xl relative">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Download size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Install Techtural BuiltIn
                </h3>
                <p className="text-xs text-muted-foreground">
                  Enjoy native app speed, full offline kit home access, and instant launching.
                </p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-4 my-4 p-4 rounded-2xl bg-muted/40 border border-border/80">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider">
                  <Smartphone size={14} className="text-primary" />
                  <span>How to install on iPhone &amp; iPad:</span>
                </div>
                <ol className="space-y-3 text-xs text-muted-foreground pl-1">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <span>Tap the <strong className="text-foreground inline-flex items-center gap-1"><Share size={12} className="inline text-blue-500" /> Share button</strong> in the Safari bottom toolbar.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <span>Scroll down the action sheet and select <strong className="text-foreground inline-flex items-center gap-1"><PlusSquare size={12} className="inline text-emerald-500" /> Add to Home Screen</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <span>Tap <strong className="text-foreground">Add</strong> in the top-right corner to launch directly from your home screen.</span>
                  </li>
                </ol>
              </div>
            ) : (
              <div className="space-y-4 my-4 p-4 rounded-2xl bg-muted/40 border border-border/80">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider">
                  <Monitor size={14} className="text-primary" />
                  <span>How to install on Chrome, Edge &amp; Android:</span>
                </div>
                <ol className="space-y-3 text-xs text-muted-foreground pl-1">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <span>Look for the <strong className="text-foreground inline-flex items-center gap-1"><Download size={12} className="inline text-primary" /> Install icon</strong> in the right side of your browser address bar.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <span>Or click the browser menu (<strong className="text-foreground">⋮</strong>) and click <strong className="text-foreground">"Install Techtural BuiltIn"</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <span>Confirm installation to run as a standalone, standalone desktop/mobile app.</span>
                  </li>
                </ol>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="outline"
                className="rounded-xl w-full"
                onClick={() => setShowGuideModal(false)}
              >
                Got It
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallButton;
