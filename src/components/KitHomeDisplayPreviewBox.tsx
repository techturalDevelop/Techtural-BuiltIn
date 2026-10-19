import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  RotateCw, 
  Maximize2, 
  Move, 
  DraftingCompass, 
  Sparkles, 
  Layers, 
  Ruler, 
  Check,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { KitHomeModel } from '@/data/kitHomesData';

interface KitHomeDisplayPreviewBoxProps {
  model: KitHomeModel;
  onOpenFullscreen: (initialIndex: number) => void;
  className?: string;
}

export function KitHomeDisplayPreviewBox({
  model,
  onOpenFullscreen,
  className
}: KitHomeDisplayPreviewBoxProps) {
  // Active view: 'render' (3D Exterior) or 'blueprint' (Architectural Floor Plan)
  const [activeView, setActiveView] = useState<'render' | 'blueprint'>('render');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Active image source
  const currentImageUrl = activeView === 'blueprint' 
    ? (model.floorPlanImage || model.image) 
    : model.image;

  const currentTitle = activeView === 'blueprint' 
    ? 'Architectural Floor Plan Blueprint' 
    : '3D Exterior Architectural Perspective';

  // Reset transformations when switching views or models
  const resetTransform = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
  }, []);

  useEffect(() => {
    resetTransform();
  }, [activeView, model.id, resetTransform]);

  // Zoom controls with safe scale bounds [0.8x to 3.5x]
  const handleZoomIn = () => {
    setZoom(prev => Math.min(Number((prev + 0.25).toFixed(2)), 3.5));
  };

  const handleZoomOut = () => {
    setZoom(prev => {
      const next = Math.max(Number((prev - 0.25).toFixed(2)), 0.8);
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleSetPresetZoom = (level: number) => {
    setZoom(level);
    if (level <= 1) {
      setPan({ x: 0, y: 0 });
    }
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Double click toggles between 1x and 2x
  const handleDoubleClick = () => {
    setZoom(prev => {
      if (prev > 1.2) {
        setPan({ x: 0, y: 0 });
        return 1;
      }
      return 2;
    });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey || zoom > 1) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  };

  // Drag / Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1 && pan.x === 0 && pan.y === 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && zoom > 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPan({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className={cn("flex flex-col bg-card rounded-2xl border border-border overflow-hidden shadow-sm", className)}>
      {/* Top Controls Bar: View Selector & Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-muted/50 border-b border-border">
        {/* Left: View Switcher (3D Render vs Blueprint) */}
        <div className="flex items-center gap-1.5 p-1 bg-background rounded-xl border border-border shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveView('render')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
              activeView === 'render'
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Sparkles size={13} className={activeView === 'render' ? "text-amber-300" : "text-amber-500"} />
            <span>3D Perspective Render</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('blueprint')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
              activeView === 'blueprint'
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <DraftingCompass size={13} className={activeView === 'blueprint' ? "text-blue-300" : "text-blue-500"} />
            <span>Architectural Blueprint</span>
          </button>
        </div>

        {/* Right: Technical Dimensional Indicator */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground bg-background px-3 py-1.5 rounded-xl border border-border">
            <span className="flex items-center gap-1">
              <Ruler size={12} className="text-primary" />
              <strong>Footprint:</strong> {model.dimensions}
            </span>
            <span className="text-border">|</span>
            <span>
              <strong>Living:</strong> {model.buildingAreaSqm} m²
            </span>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onOpenFullscreen(activeView === 'blueprint' ? 1 : 0)}
            className="h-8 rounded-xl text-xs gap-1.5 border-border hover:bg-background font-semibold"
            title="Open Fullscreen Lightbox for In-Depth Inspection"
          >
            <Maximize2 size={13} />
            <span className="hidden sm:inline">Fullscreen Lightbox</span>
          </Button>
        </div>
      </div>

      {/* Main Preview Stage Container */}
      <div 
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={cn(
          "relative w-full h-[360px] sm:h-[440px] md:h-[480px] bg-slate-950 overflow-hidden flex items-center justify-center select-none",
          zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
        )}
        style={{
          // Subtle architectural drafting grid background
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      >
        {/* Top Info Overlay Badge */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 pointer-events-none max-w-[calc(100%-120px)]">
          <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white font-mono text-[11px] font-bold border border-white/15 flex items-center gap-1.5 shadow-md">
            {activeView === 'blueprint' ? (
              <>
                <DraftingCompass size={12} className="text-blue-400" />
                <span>Certified Blueprint Layout</span>
              </>
            ) : (
              <>
                <Sparkles size={12} className="text-amber-400" />
                <span>3D Exterior Architectural Perspective</span>
              </>
            )}
          </span>

          {activeView === 'blueprint' && (
            <span className="px-2.5 py-1 rounded-lg bg-blue-950/80 backdrop-blur-md text-blue-200 font-sans text-[10px] font-medium border border-blue-500/30 flex items-center gap-1 shadow-md">
              <span>Full dimensions issued with Blueprint PDF (K{model.blueprintPrice.toLocaleString()})</span>
            </span>
          )}

          {model.isHighset && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-700/80 text-white font-semibold text-[10px] hidden sm:inline">
              Highset Structure
            </span>
          )}
        </div>

        {/* Current Scale & Drag Feedback Indicator */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2 pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-[11px] font-mono font-bold border border-white/15 flex items-center gap-1 shadow-md">
            <Move size={11} className="text-primary" />
            <span>Scale: {Math.round(zoom * 100)}%</span>
            {rotation > 0 && <span className="text-amber-300">({rotation}°)</span>}
          </span>
        </div>

        {/* Image Display Surface with Pan, Zoom & Rotation */}
        <div
          onDoubleClick={handleDoubleClick}
          className="w-full h-full flex items-center justify-center p-3 sm:p-6"
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="max-w-full max-h-full flex items-center justify-center"
          >
            <img
              src={currentImageUrl}
              alt={`${model.name} - ${currentTitle}`}
              className="max-w-full max-h-[330px] sm:max-h-[400px] md:max-h-[440px] object-contain rounded-lg shadow-2xl pointer-events-none select-none drop-shadow-2xl"
              referrerPolicy="no-referrer"
              draggable={false}
            />
          </div>
        </div>

        {/* Floating Dock: In-Box Zoom & Scale Toolbars */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900/90 border border-white/20 backdrop-blur-xl shadow-2xl">
          {/* Zoom Out */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 0.8}
            title="Zoom Out (-)"
            className="h-8 w-8 p-0 text-slate-200 hover:text-white hover:bg-white/15 rounded-xl disabled:opacity-30"
          >
            <ZoomOut size={15} />
            <span className="sr-only">Zoom Out</span>
          </Button>

          {/* Scale Presets */}
          <div className="flex items-center gap-1 px-1 border-x border-white/15">
            <button
              type="button"
              onClick={() => handleSetPresetZoom(1)}
              className={cn(
                "px-2 py-0.5 text-xs font-mono font-bold rounded-lg transition-colors",
                zoom === 1 ? "bg-primary text-white" : "text-slate-300 hover:text-white hover:bg-white/10"
              )}
            >
              Fit
            </button>
            <button
              type="button"
              onClick={() => handleSetPresetZoom(1.5)}
              className={cn(
                "px-2 py-0.5 text-xs font-mono font-bold rounded-lg transition-colors hidden sm:inline",
                zoom === 1.5 ? "bg-primary text-white" : "text-slate-300 hover:text-white hover:bg-white/10"
              )}
            >
              150%
            </button>
            <button
              type="button"
              onClick={() => handleSetPresetZoom(2)}
              className={cn(
                "px-2 py-0.5 text-xs font-mono font-bold rounded-lg transition-colors",
                zoom === 2 ? "bg-primary text-white" : "text-slate-300 hover:text-white hover:bg-white/10"
              )}
            >
              200%
            </button>
          </div>

          {/* Zoom In */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 3.5}
            title="Zoom In (+)"
            className="h-8 w-8 p-0 text-slate-200 hover:text-white hover:bg-white/15 rounded-xl disabled:opacity-30"
          >
            <ZoomIn size={15} />
            <span className="sr-only">Zoom In</span>
          </Button>

          {/* Reset Zoom & Pan */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetTransform}
            title="Reset to Fit"
            className="h-8 px-2 text-slate-200 hover:text-white hover:bg-white/15 rounded-xl text-xs gap-1"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reset</span>
          </Button>

          {/* Rotate 90° */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRotate}
            title="Rotate 90°"
            className="h-8 px-2 text-slate-200 hover:text-white hover:bg-white/15 rounded-xl text-xs gap-1"
          >
            <RotateCw size={13} />
            <span className="hidden sm:inline">Rotate</span>
          </Button>

          {/* Fullscreen Modal trigger */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenFullscreen(activeView === 'blueprint' ? 1 : 0)}
            title="Expand Fullscreen"
            className="h-8 w-8 p-0 text-slate-200 hover:text-white hover:bg-white/15 rounded-xl"
          >
            <Maximize2 size={14} />
            <span className="sr-only">Fullscreen</span>
          </Button>
        </div>

        {/* Thumbnail Mini-Switch in bottom right */}
        <div className="absolute bottom-3 right-3 z-10 hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/15">
          <button
            type="button"
            onClick={() => setActiveView('render')}
            title="Switch to 3D Render"
            className={cn(
              "w-12 h-9 rounded-lg overflow-hidden border transition-all",
              activeView === 'render' ? "border-primary ring-2 ring-primary/40" : "border-white/20 opacity-70 hover:opacity-100"
            )}
          >
            <img src={model.image} alt="3D Thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </button>
          <button
            type="button"
            onClick={() => setActiveView('blueprint')}
            title="Switch to Architectural Blueprint"
            className={cn(
              "w-12 h-9 rounded-lg overflow-hidden border transition-all",
              activeView === 'blueprint' ? "border-primary ring-2 ring-primary/40" : "border-white/20 opacity-70 hover:opacity-100"
            )}
          >
            <img src={model.floorPlanImage || model.image} alt="Blueprint Thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover bg-slate-900" />
          </button>
        </div>
      </div>

      {/* Bottom Visual Helper & Subtitle */}
      <div className="px-4 py-2.5 bg-muted/30 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-foreground">{currentTitle}</span>
          <span className="hidden sm:inline">•</span>
          {activeView === 'blueprint' ? (
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              Note: Full floor plan dimensions, CAD drafting &amp; elevations are issued when customers purchase the Blueprint PDF Copy (K{model.blueprintPrice.toLocaleString()}).
            </span>
          ) : (
            <span className="hidden sm:inline">Use mouse wheel or drag to inspect architectural details</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground">Double-click to toggle 2× zoom</span>
        </div>
      </div>
    </div>
  );
}
