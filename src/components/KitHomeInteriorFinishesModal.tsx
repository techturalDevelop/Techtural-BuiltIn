import React from 'react';
import { 
  X, 
  Sparkles, 
  Utensils, 
  Check, 
  Plus, 
  CheckCircle2, 
  Info, 
  ZoomIn,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { KIT_HOME_FINISH_OPTIONS, FinishOption, getFinishOptionsForModel } from '@/data/kitHomesFinishesData';
import { KitHomeModel } from '@/data/kitHomesData';

interface KitHomeInteriorFinishesModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: KitHomeModel | null;
  selectedFinishIds: string[];
  onToggleFinish: (finishId: string) => void;
  onOpenZoom?: (imageUrl: string, title: string, subtitle: string) => void;
  onProceedToQuote?: () => void;
}

export function KitHomeInteriorFinishesModal({
  isOpen,
  onClose,
  model,
  selectedFinishIds,
  onToggleFinish,
  onOpenZoom,
  onProceedToQuote
}: KitHomeInteriorFinishesModalProps) {
  if (!isOpen || !model) return null;

  const currentOptions = getFinishOptionsForModel(model);
  const kitchens = currentOptions.filter(f => f.category === 'kitchen');
  const wardrobesAndLiving = currentOptions.filter(f => f.category !== 'kitchen');

  const selectedCount = selectedFinishIds.length;
  const finishesTotal = currentOptions
    .filter(f => selectedFinishIds.includes(f.id))
    .reduce((sum, f) => sum + f.price, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-mono font-bold tracking-wider">
                OPTIONAL FITOUT SELECTIONS
              </span>
              <span className="text-xs text-slate-300 hidden sm:inline">
                • {model.code} ({model.name})
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 mt-1">
              <Sparkles className="text-amber-400 shrink-0" size={24} />
              <span>Kitchen Display &amp; Bedroom Wardrobe Fitout Options</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Select optional designer cabinetry packages to include in your personalized quotation.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-8 text-foreground">
          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span>Selected Interior Options:</span>
                <Badge className="bg-amber-600 text-white text-xs">{selectedCount} Item{selectedCount !== 1 ? 's' : ''} Selected</Badge>
              </h4>
              <p className="text-xs text-muted-foreground">
                All cabinetry is manufactured with high-grade moisture-resistant core materials, heavy-duty soft-close European hardware, and pre-fitted for rapid installation.
              </p>
            </div>
            <div className="shrink-0 text-left sm:text-right w-full sm:w-auto">
              <span className="text-[11px] font-semibold text-muted-foreground block">Fitout Add-on Total</span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                +PGK {finishesTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Section 1: Kitchen Display Samples */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Utensils size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-foreground">Kitchen Display Samples (2 Options)</h3>
                  <p className="text-xs text-muted-foreground">Choose an architectural kitchen layout configured for your home</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-primary">Custom Modular Joinery</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {kitchens.map((kitchen) => {
                const isSelected = selectedFinishIds.includes(kitchen.id);
                return (
                  <div
                    key={kitchen.id}
                    className={cn(
                      "group rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between bg-card",
                      isSelected 
                        ? "border-primary ring-2 ring-primary/20 shadow-lg bg-primary/[0.02]" 
                        : "border-border hover:border-primary/40 hover:shadow-md"
                    )}
                  >
                    <div>
                      {/* Image Thumbnail with Zoom Button */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                        <img 
                          src={kitchen.image} 
                          alt={kitchen.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                        
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-lg bg-black/70 text-white text-[10px] font-mono font-bold backdrop-blur-xs">
                            {kitchen.code}
                          </span>
                        </div>

                        {onOpenZoom && (
                          <button
                            type="button"
                            onClick={() => onOpenZoom(kitchen.image, kitchen.name, kitchen.subtitle)}
                            className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white text-xs backdrop-blur-md border border-white/20 transition-all flex items-center gap-1 shadow-sm"
                            title="Zoom sample image"
                          >
                            <ZoomIn size={14} className="text-primary" />
                            <span className="text-[10px] font-semibold pr-1">Zoom</span>
                          </button>
                        )}

                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                          <span className="text-white text-xs font-bold drop-shadow-md">
                            {kitchen.name}
                          </span>
                          <span className="text-amber-300 text-sm font-black drop-shadow-md">
                            +K{kitchen.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {kitchen.subtitle}
                        </p>

                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-bold text-foreground uppercase tracking-wider block">
                            Key Specifications:
                          </span>
                          {kitchen.features.map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                              <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                              <span className="text-[11px] leading-tight">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-4 pt-0">
                      <Button
                        type="button"
                        onClick={() => onToggleFinish(kitchen.id)}
                        variant={isSelected ? "default" : "outline"}
                        className={cn(
                          "w-full rounded-xl text-xs font-bold gap-2 h-10 transition-all",
                          isSelected 
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                            : "hover:border-primary hover:text-primary"
                        )}
                      >
                        {isSelected ? (
                          <>
                            <Check size={14} />
                            <span>Included in Quotation (+K{kitchen.price.toLocaleString()})</span>
                          </>
                        ) : (
                          <>
                            <Plus size={14} />
                            <span>Add to Quote (+K{kitchen.price.toLocaleString()})</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Custom Wardrobe & TV Wall Unit Fitouts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-foreground">Wardrobe &amp; Custom TV Wall Unit (2 Options)</h3>
                  <p className="text-xs text-muted-foreground">Custom integrated master wardrobe dressing suite and living entertainment wall unit</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-purple-600">Built-in Architectural Joinery</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wardrobesAndLiving.map((wardrobe) => {
                const isSelected = selectedFinishIds.includes(wardrobe.id);
                return (
                  <div
                    key={wardrobe.id}
                    className={cn(
                      "group rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between bg-card",
                      isSelected 
                        ? "border-purple-500 ring-2 ring-purple-500/20 shadow-lg bg-purple-500/[0.02]" 
                        : "border-border hover:border-purple-500/40 hover:shadow-md"
                    )}
                  >
                    <div>
                      {/* Image Thumbnail with Zoom Button */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                        <img 
                          src={wardrobe.image} 
                          alt={wardrobe.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                        
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-lg bg-black/70 text-white text-[10px] font-mono font-bold backdrop-blur-xs">
                            {wardrobe.code}
                          </span>
                        </div>

                        {onOpenZoom && (
                          <button
                            type="button"
                            onClick={() => onOpenZoom(wardrobe.image, wardrobe.name, wardrobe.subtitle)}
                            className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white text-xs backdrop-blur-md border border-white/20 transition-all flex items-center gap-1 shadow-sm"
                            title="Zoom sample image"
                          >
                            <ZoomIn size={14} className="text-purple-400" />
                            <span className="text-[10px] font-semibold pr-1">Zoom</span>
                          </button>
                        )}

                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                          <span className="text-white text-xs font-bold drop-shadow-md">
                            {wardrobe.name}
                          </span>
                          <span className="text-purple-300 text-sm font-black drop-shadow-md">
                            +K{wardrobe.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {wardrobe.subtitle}
                        </p>

                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-bold text-foreground uppercase tracking-wider block">
                            Key Specifications:
                          </span>
                          {wardrobe.features.map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                              <CheckCircle2 size={13} className="text-purple-600 shrink-0 mt-0.5" />
                              <span className="text-[11px] leading-tight">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-4 pt-0">
                      <Button
                        type="button"
                        onClick={() => onToggleFinish(wardrobe.id)}
                        variant={isSelected ? "default" : "outline"}
                        className={cn(
                          "w-full rounded-xl text-xs font-bold gap-2 h-10 transition-all",
                          isSelected 
                            ? "bg-purple-600 hover:bg-purple-700 text-white" 
                            : "hover:border-purple-500 hover:text-purple-600"
                        )}
                      >
                        {isSelected ? (
                          <>
                            <Check size={14} />
                            <span>Included in Quotation (+K{wardrobe.price.toLocaleString()})</span>
                          </>
                        ) : (
                          <>
                            <Plus size={14} />
                            <span>Add to Quote (+K{wardrobe.price.toLocaleString()})</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            {selectedCount > 0 ? (
              <span>Selected <strong>{selectedCount} fitout option{selectedCount !== 1 ? 's' : ''}</strong> totaling <strong className="text-foreground font-mono">PGK {finishesTotal.toLocaleString()}</strong></span>
            ) : (
              <span>No interior options selected yet. Click &quot;Add to Quote&quot; to include samples.</span>
            )}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs font-semibold px-4 w-full sm:w-auto"
            >
              Back to Model
            </Button>
            {onProceedToQuote && (
              <Button
                onClick={() => {
                  onClose();
                  onProceedToQuote();
                }}
                className="rounded-xl text-xs font-bold bg-primary text-primary-foreground gap-1.5 px-5 w-full sm:w-auto"
              >
                <span>Apply &amp; Open Quote Builder</span>
                <ArrowRight size={13} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
