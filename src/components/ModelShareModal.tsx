import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  MessageSquare, 
  Facebook, 
  Twitter, 
  Linkedin, 
  ExternalLink, 
  X, 
  Sparkles,
  Bed,
  Bath,
  Maximize2,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { KitHomeModel } from '@/data/kitHomesData';

interface ModelShareModalProps {
  model: KitHomeModel | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ModelShareModal: React.FC<ModelShareModalProps> = ({
  model,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !model) return null;

  // Generate deep-link URL pointing specifically to this kit home model
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://techturalbuiltin.com';
  const shareUrl = `${baseUrl}/kit-homes?model=${encodeURIComponent(model.id)}`;

  const turnkeyText = model.isTurnKeyCostingInProgress
    ? 'Costing in Progress (Custom Quotes Available)'
    : `PGK ${model.fullTurnKeyPrice.toLocaleString()}`;

  const shareTitle = `Techtural Kit Home — ${model.name} (${model.code})`;
  const shareSummary = `${model.name} (${model.code}) | ${model.bedrooms} Bed, ${model.bathrooms} Bath, ${model.buildingAreaSqm} m² | Full Turn-Key: ${turnkeyText}. Engineered for Papua New Guinea.`;

  // WhatsApp formatted text
  const whatsappText = `🏡 *Techtural BuiltIn Kit Home — ${model.name} (${model.code})*
📐 *Area:* ${model.buildingAreaSqm} m² | 🛏️ *Bedrooms:* ${model.bedrooms} | 🚿 *Bathrooms:* ${model.bathrooms}
💰 *Turn-Key Handover:* ${turnkeyText}
📋 *Certified Blueprint CAD:* PGK ${model.blueprintPrice.toLocaleString()}

Check out this modern kit home design engineered for Papua New Guinea:
${shareUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Kit home link copied to clipboard!', {
        description: 'You can now paste and share it anywhere.'
      });
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      toast.error('Could not copy link to clipboard');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareSummary,
          url: shareUrl,
        });
        toast.success('Shared successfully!');
      } catch (err) {
        // User dismissed native share sheet
      }
    } else {
      handleCopyLink();
    }
  };

  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;
    openShareWindow(url);
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    openShareWindow(url);
  };

  const handleTwitterShare = () => {
    const tweetText = `Explore the ${model.name} (${model.code}) Kit Home by Techtural BuiltIn — ${model.bedrooms} Bed, ${model.buildingAreaSqm} m² modern residential architecture in PNG:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
    openShareWindow(url);
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    openShareWindow(url);
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-3xl bg-background border border-border shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Share2 size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Share Kit Home Model
              </h3>
              <p className="text-xs text-muted-foreground">
                Direct social sharing for marketing &amp; client consultations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Model Preview Card */}
        <div className="p-5 space-y-5">
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-muted/40 border border-border/80">
            <img
              src={model.image}
              alt={model.name}
              className="w-20 h-20 rounded-xl object-cover shrink-0 border border-border/60"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                {model.officialNumber && (
                  <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    #{String(model.officialNumber).padStart(2, '0')}
                  </span>
                )}
                <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  {model.code}
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {model.collectionName}
                </span>
              </div>
              <h4 className="text-sm font-bold text-foreground truncate mt-1">
                {model.name}
              </h4>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span className="inline-flex items-center gap-1">
                  <Bed size={12} className="text-primary" /> {model.bedrooms} Bed
                </span>
                <span className="inline-flex items-center gap-1">
                  <Bath size={12} className="text-primary" /> {model.bathrooms} Bath
                </span>
                <span className="inline-flex items-center gap-1">
                  <Maximize2 size={12} className="text-primary" /> {model.buildingAreaSqm} m²
                </span>
              </div>
            </div>
          </div>

          {/* Social Share Grid */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
              Share Directly To:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppShare}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-all hover:scale-102 active:scale-98 cursor-pointer group"
                title="Share on WhatsApp"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <MessageSquare size={18} />
                </div>
                <span className="text-xs font-bold">WhatsApp</span>
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebookShare}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 transition-all hover:scale-102 active:scale-98 cursor-pointer group"
                title="Share on Facebook"
              >
                <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Facebook size={18} />
                </div>
                <span className="text-xs font-bold">Facebook</span>
              </button>

              {/* X / Twitter */}
              <button
                onClick={handleTwitterShare}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-500/10 hover:bg-slate-500/20 text-foreground border border-border/80 transition-all hover:scale-102 active:scale-98 cursor-pointer group"
                title="Share on X"
              >
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Twitter size={18} />
                </div>
                <span className="text-xs font-bold">X (Twitter)</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={handleLinkedInShare}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-500/20 transition-all hover:scale-102 active:scale-98 cursor-pointer group"
                title="Share on LinkedIn"
              >
                <div className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Linkedin size={18} />
                </div>
                <span className="text-xs font-bold">LinkedIn</span>
              </button>
            </div>
          </div>

          {/* Native Share button for Mobile / Android */}
          {hasNativeShare && (
            <Button
              variant="outline"
              onClick={handleNativeShare}
              className="w-full rounded-2xl h-11 gap-2 border-primary/30 text-primary hover:bg-primary/5 font-semibold text-xs cursor-pointer"
            >
              <Smartphone size={16} />
              <span>Share via Android / Device Apps (Instagram, Telegram, SMS)</span>
            </Button>
          )}

          {/* Direct Link Copy Bar */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
              Direct Model Link:
            </label>
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/50 border border-border">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent text-xs text-muted-foreground flex-1 px-2.5 py-1 outline-none font-mono truncate"
              />
              <Button
                size="sm"
                onClick={handleCopyLink}
                className="rounded-xl px-4 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 cursor-pointer"
              >
                {copied ? <Check size={14} className="text-white" /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-muted/20 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Sparkles size={13} className="text-primary" />
            Designed for marketing &amp; customer engagement in PNG
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-xl text-xs"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModelShareModal;
