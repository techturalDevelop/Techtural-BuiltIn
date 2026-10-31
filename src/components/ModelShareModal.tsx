import React, { useState, useEffect } from 'react';
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
  Smartphone,
  Download,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { KitHomeModel } from '@/data/kitHomesData';
import { updateSocialMetaTags } from '@/lib/seoMeta';

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
  const [isDownloading, setIsDownloading] = useState(false);

  // Generate dedicated static share URL pointing specifically to this kit home model's 3D OpenGraph card
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://techturalbuiltin.com';
  const shareUrl = model ? `${baseUrl}/share/model-${model.officialNumber}` : baseUrl;
  const thumbnailShareUrl = model ? `${baseUrl}/share-thumbnails/model-${model.officialNumber}.jpg` : '';

  // Whenever the modal opens for a model, update document head meta tags so client DOM has this 3D image
  useEffect(() => {
    if (isOpen && model) {
      updateSocialMetaTags({
        title: `Techtural Kit Home — ${model.name} (${model.code})`,
        description: `${model.name} (${model.code}) | ${model.bedrooms} Bed, ${model.bathrooms} Bath, ${model.buildingAreaSqm} m². Engineered for Papua New Guinea.`,
        imageUrl: thumbnailShareUrl || model.image,
        url: shareUrl,
        imageAlt: `${model.name} 3D Artist Impression Perspective`,
      });
    }
  }, [isOpen, model, shareUrl, thumbnailShareUrl]);

  if (!isOpen || !model) return null;

  const turnkeyText = model.isTurnKeyCostingInProgress
    ? 'Costing in Progress (Custom Quotes Available)'
    : `PGK ${model.fullTurnKeyPrice.toLocaleString()}`;

  const shareTitle = `Techtural Kit Home — ${model.name} (${model.code})`;
  const shareSummary = `${model.name} (${model.code}) | ${model.bedrooms} Bed, ${model.bathrooms} Bath, ${model.buildingAreaSqm} m² | Full Turn-Key: ${turnkeyText}. Engineered for Papua New Guinea.`;

  // WhatsApp formatted text with 3D thumbnail pointer
  const whatsappText = `🏡 *Techtural BuiltIn Kit Home — ${model.name} (${model.code})*
📐 *Area:* ${model.buildingAreaSqm} m² | 🛏️ *Bedrooms:* ${model.bedrooms} | 🚿 *Bathrooms:* ${model.bathrooms}
💰 *Turn-Key Handover:* ${turnkeyText}
📋 *Certified Blueprint CAD:* PGK ${model.blueprintPrice.toLocaleString()}

🖼️ *3D Artist Impression Preview & Specifications:*
${shareUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Kit home link copied to clipboard!', {
        description: 'When pasted into WhatsApp or Facebook, this model’s 3D artist impression will load as the thumbnail preview.'
      });
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      toast.error('Could not copy link to clipboard');
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator === 'undefined' || !navigator.share) {
      handleCopyLink();
      return;
    }

    try {
      // Try to fetch image as a File to attach thumbnail directly in Android / iOS share sheet
      let sharedWithFile = false;
      if (navigator.canShare) {
        try {
          const fetchTarget = thumbnailShareUrl || model.image;
          const response = await fetch(fetchTarget, { mode: 'cors' });
          const blob = await response.blob();
          const file = new File([blob], `${model.code}-3D-Artist-Impression.jpg`, { type: 'image/jpeg' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: shareTitle,
              text: shareSummary,
              url: shareUrl,
              files: [file],
            });
            sharedWithFile = true;
            toast.success('3D artist render shared successfully!');
          }
        } catch (_fileErr) {
          // Fall back to link share
        }
      }

      if (!sharedWithFile) {
        await navigator.share({
          title: shareTitle,
          text: shareSummary,
          url: shareUrl,
        });
        toast.success('Shared successfully!');
      }
    } catch (err) {
      // User dismissed native share sheet
    }
  };

  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(model.image);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `Techtural_${model.code}_3D_Artist_Impression.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success('3D Artist Impression Image downloaded!', {
        description: 'You can now upload or attach this high-res 3D render to social media posts or client proposals.'
      });
    } catch (err) {
      // If direct blob download is blocked by CORS, open in new tab
      window.open(model.image, '_blank');
      toast.info('Opened 3D render image in a new tab for saving.');
    } finally {
      setIsDownloading(false);
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
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-background border border-border shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 p-5 border-b border-border flex items-center justify-between bg-background/95 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Share2 size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Share Kit Home Model
              </h3>
              <p className="text-xs text-muted-foreground">
                Direct social sharing with verified 3D artist impression thumbnail
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

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* 3D Artist Impression Visual Showcase Card */}
          <div className="overflow-hidden rounded-2xl bg-muted/40 border border-border shadow-xs">
            <div className="relative aspect-16/9 w-full bg-slate-950 overflow-hidden group">
              <img
                src={model.image}
                alt={`${model.name} 3D Artist Impression`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Badges on Thumbnail */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                  <ImageIcon size={11} />
                  <span>3D Artist Impression Thumbnail</span>
                </span>
                {model.officialNumber && (
                  <span className="text-[10px] font-mono font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20">
                    Model #{String(model.officialNumber).padStart(2, '0')}
                  </span>
                )}
              </div>

              {/* Model details over image banner */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-mono font-bold text-amber-300">
                  {model.code} • {model.collectionName}
                </span>
                <h4 className="text-base font-black truncate text-white drop-shadow-xs">
                  {model.name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-200 mt-1">
                  <span className="inline-flex items-center gap-1">
                    <Bed size={13} className="text-amber-400" /> {model.bedrooms} Bed
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Bath size={13} className="text-amber-400" /> {model.bathrooms} Bath
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Maximize2 size={13} className="text-amber-400" /> {model.buildingAreaSqm} m²
                  </span>
                  <span className="font-semibold text-emerald-400 ml-auto">
                    {turnkeyText}
                  </span>
                </div>
              </div>
            </div>

            {/* Thumbnail verification note */}
            <div className="p-3 bg-muted/70 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground text-[11px] leading-tight">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                <span>
                  This high-resolution 3D perspective thumbnail will automatically display when shared on social networks.
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="h-7 px-2.5 rounded-lg text-[11px] gap-1 shrink-0 font-medium hover:bg-background"
                title="Download 3D render file"
              >
                <Download size={12} />
                <span>{isDownloading ? 'Saving...' : 'Save 3D Photo'}</span>
              </Button>
            </div>
          </div>

          {/* Social Share Grid */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
              Share With Thumbnail Directly To:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppShare}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-all hover:scale-102 active:scale-98 cursor-pointer group shadow-2xs"
                title="Share on WhatsApp with 3D Preview"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <MessageSquare size={18} />
                </div>
                <span className="text-xs font-bold">WhatsApp</span>
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebookShare}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 transition-all hover:scale-102 active:scale-98 cursor-pointer group shadow-2xs"
                title="Share on Facebook with 3D Thumbnail"
              >
                <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Facebook size={18} />
                </div>
                <span className="text-xs font-bold">Facebook</span>
              </button>

              {/* X / Twitter */}
              <button
                onClick={handleTwitterShare}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-500/10 hover:bg-slate-500/20 text-foreground border border-border/80 transition-all hover:scale-102 active:scale-98 cursor-pointer group shadow-2xs"
                title="Share on X with 3D Card"
              >
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Twitter size={18} />
                </div>
                <span className="text-xs font-bold">X (Twitter)</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={handleLinkedInShare}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-500/20 transition-all hover:scale-102 active:scale-98 cursor-pointer group shadow-2xs"
                title="Share on LinkedIn with 3D Preview"
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
              className="w-full rounded-2xl h-11 gap-2 border-primary/30 text-primary hover:bg-primary/5 font-semibold text-xs cursor-pointer shadow-2xs"
            >
              <Smartphone size={16} />
              <span>Share via Android / Device Apps (Instagram, Telegram, SMS)</span>
            </Button>
          )}

          {/* Direct Link Copy Bar */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
              Direct Kit Home Model Link:
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
                className="rounded-xl px-4 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 cursor-pointer shadow-xs"
              >
                {copied ? <Check size={14} className="text-white" /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 p-4 bg-muted/20 border-t border-border flex justify-between items-center text-xs text-muted-foreground backdrop-blur-md">
          <span className="flex items-center gap-1">
            <Sparkles size={13} className="text-primary" />
            Verified 3D perspective thumbnail attached
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
