import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Download, 
  ExternalLink,
  Move,
  DraftingCompass,
  Layers,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface PreviewImageItem {
  title: string;
  subtitle?: string;
  url: string;
  badge?: string;
  type?: '3d-render' | 'floor-plan' | 'detail';
}

interface KitHomeImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: PreviewImageItem[];
  initialIndex?: number;
  modelName: string;
  modelCode: string;
  modelNumber?: number;
}

export function KitHomeImageZoomModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  modelName,
  modelCode,
  modelNumber
}: KitHomeImageZoomModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const currentImage = images[currentIndex] || images[0];

  // Sync initial index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.min(Math.max(0, initialIndex), Math.max(0, images.length - 1)));
      resetView();
    }
  }, [isOpen, initialIndex, images.length]);

  // Reset transformations
  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
  }, []);

  // Reset zoom/pan whenever image changes
  const switchImage = useCallback((index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setRotation(0);
    }
  }, [images.length]);

  const handleNext = useCallback(() => {
    switchImage((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, switchImage]);

  const handlePrev = useCallback(() => {
    switchImage((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, switchImage]);

  // Zoom helpers with bounds [0.5, 4.0]
  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(Number((prev + 0.25).toFixed(2)), 4));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prev => {
      const next = Math.max(Number((prev - 0.25).toFixed(2)), 0.5);
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const setPresetZoom = useCallback((level: number) => {
    setZoom(level);
    if (level <= 1) {
      setPan({ x: 0, y: 0 });
    }
  }, []);

  const rotateClockwise = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, []);

  // Double click to toggle between 1x and 2x
  const handleDoubleClick = useCallback(() => {
    setZoom(prev => {
      if (prev > 1.2) {
        setPan({ x: 0, y: 0 });
        return 1;
      }
      return 2;
    });
  }, []);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }, [zoomIn, zoomOut]);

  // Pan / Drag handlers
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

  // Touch drag support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
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

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen(prev => !prev);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === '+' || e.key === '=') {
        zoomIn();
      } else if (e.key === '-' || e.key === '_') {
        zoomOut();
      } else if (e.key === '0' || e.key.toLowerCase() === 'r') {
        resetView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev, zoomIn, zoomOut, resetView]);

  if (!isOpen || !currentImage) return null;

  return (
    <div
      ref={containerRef}
      id="kit-home-image-zoom-lightbox"
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-xl text-white select-none animate-in fade-in duration-200"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Navigation & Info Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-slate-900/80 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {modelNumber && (
            <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono text-xs font-bold shrink-0">
              #{String(modelNumber).padStart(2, '0')}
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-md bg-primary text-primary-foreground font-mono text-xs font-bold shrink-0">
            {modelCode}
          </span>
          <div className="truncate">
            <h3 className="text-sm sm:text-base font-bold text-white truncate">
              {modelName}
            </h3>
            <p className="text-[11px] text-slate-300 truncate hidden sm:block">
              {currentImage.title} {currentImage.subtitle ? `• ${currentImage.subtitle}` : ''}
            </p>
          </div>
        </div>

        {/* Image Selector Tabs */}
        {images.length > 1 && (
          <div className="hidden md:flex items-center gap-1.5 bg-white/10 p-1 rounded-xl border border-white/10">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => switchImage(idx)}
                className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5",
                  currentIndex === idx
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                )}
              >
                {img.type === 'floor-plan' ? (
                  <DraftingCompass size={13} className="text-blue-300" />
                ) : (
                  <Sparkles size={13} className="text-amber-300" />
                )}
                <span>{img.title}</span>
              </button>
            ))}
          </div>
        )}

        {/* Right Actions: Image counter and Close */}
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="bg-white/5 border-white/15 text-slate-200 font-mono text-xs px-2.5 py-1">
            {currentIndex + 1} / {images.length}
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close Preview"
            className="rounded-xl h-9 w-9 text-slate-300 hover:text-white hover:bg-white/15"
          >
            <X size={20} />
          </Button>
        </div>
      </div>

      {/* Main Interactive Zoom Stage */}
      <div 
        className="relative flex-1 overflow-hidden flex items-center justify-center cursor-default"
        onWheel={handleWheel}
      >
        {/* Previous Image Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Image"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Next Image Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Image"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Image Container with Zoom, Pan, Rotation */}
        <div
          className={cn(
            "w-full h-full flex items-center justify-center p-4 transition-transform duration-75 ease-out select-none",
            zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
          )}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onDoubleClick={handleDoubleClick}
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="max-w-full max-h-full flex items-center justify-center pointer-events-auto"
          >
            <img
              src={currentImage.url}
              alt={`${modelName} - ${currentImage.title}`}
              className="max-w-[90vw] max-h-[75vh] object-contain rounded-xl shadow-2xl pointer-events-none drop-shadow-2xl"
              referrerPolicy="no-referrer"
              draggable={false}
            />
          </div>
        </div>

        {/* Quick Zoom Indicator Overlay */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
          <span className="px-3 py-1 rounded-xl bg-black/75 backdrop-blur-md text-white text-xs font-mono font-bold border border-white/15 flex items-center gap-1.5 shadow-lg">
            <Move size={12} className="text-primary" />
            <span>{Math.round(zoom * 100)}%</span>
            {rotation > 0 && <span className="text-amber-300">({rotation}°)</span>}
          </span>
          {zoom > 1 && (
            <span className="px-2.5 py-1 rounded-xl bg-primary/80 backdrop-blur-md text-white text-[11px] font-medium hidden sm:inline shadow-md">
              Drag image to pan
            </span>
          )}
        </div>

        {/* Blueprint Floor Plan Dimensions Watermark / Disclaimer Banner */}
        {currentImage.type === 'floor-plan' && (
          <div className="absolute top-4 right-16 sm:right-20 z-20 pointer-events-none max-w-[50vw] sm:max-w-md hidden md:block">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-blue-500/30 text-blue-200 text-xs font-sans shadow-lg flex items-center gap-1.5">
              <DraftingCompass size={13} className="text-blue-400 shrink-0" />
              <span>Full certified dimensions &amp; elevations issued upon Blueprint PDF purchase.</span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Control Bar */}
      <div className="p-4 sm:p-5 flex flex-col items-center gap-3 z-10 bg-gradient-to-t from-black/95 via-black/80 to-transparent shrink-0">
        {/* Mobile/Tablet image switch pills */}
        {images.length > 1 && (
          <div className="flex md:hidden items-center gap-2 overflow-x-auto max-w-full py-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => switchImage(idx)}
                className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 flex items-center gap-1.5",
                  currentIndex === idx
                    ? "bg-primary text-white"
                    : "bg-white/10 text-slate-300 hover:text-white"
                )}
              >
                {img.type === 'floor-plan' ? (
                  <DraftingCompass size={12} />
                ) : (
                  <Sparkles size={12} />
                )}
                <span>{img.title}</span>
              </button>
            ))}
          </div>
        )}

        {/* Zoom & Inspection Controls Dock */}
        <div className="flex items-center flex-wrap justify-center gap-1 sm:gap-2 px-3 py-2 rounded-2xl bg-slate-900/90 border border-white/20 backdrop-blur-xl shadow-2xl">
          {/* Zoom Out */}
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomOut}
            disabled={zoom <= 0.5}
            title="Zoom Out (-)"
            className="h-9 px-2.5 text-slate-200 hover:text-white hover:bg-white/15 rounded-xl disabled:opacity-30"
          >
            <ZoomOut size={16} />
            <span className="sr-only">Zoom Out</span>
          </Button>

          {/* Preset Zoom Levels */}
          <div className="flex items-center gap-1 px-1 border-x border-white/15">
            <button
              type="button"
              onClick={() => setPresetZoom(1)}
              className={cn(
                "px-2 py-1 text-xs font-mono font-bold rounded-lg transition-colors",
                zoom === 1 ? "bg-primary text-white" : "text-slate-300 hover:text-white hover:bg-white/10"
              )}
            >
              100%
            </button>
            <button
              type="button"
              onClick={() => setPresetZoom(1.5)}
              className={cn(
                "px-2 py-1 text-xs font-mono font-bold rounded-lg transition-colors hidden sm:inline",
                zoom === 1.5 ? "bg-primary text-white" : "text-slate-300 hover:text-white hover:bg-white/10"
              )}
            >
              150%
            </button>
            <button
              type="button"
              onClick={() => setPresetZoom(2)}
              className={cn(
                "px-2 py-1 text-xs font-mono font-bold rounded-lg transition-colors",
                zoom === 2 ? "bg-primary text-white" : "text-slate-300 hover:text-white hover:bg-white/10"
              )}
            >
              200%
            </button>
            <button
              type="button"
              onClick={() => setPresetZoom(3)}
              className={cn(
                "px-2 py-1 text-xs font-mono font-bold rounded-lg transition-colors hidden sm:inline",
                zoom === 3 ? "bg-primary text-white" : "text-slate-300 hover:text-white hover:bg-white/10"
              )}
            >
              300%
            </button>
          </div>

          {/* Zoom In */}
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomIn}
            disabled={zoom >= 4}
            title="Zoom In (+)"
            className="h-9 px-2.5 text-slate-200 hover:text-white hover:bg-white/15 rounded-xl disabled:opacity-30"
          >
            <ZoomIn size={16} />
            <span className="sr-only">Zoom In</span>
          </Button>

          {/* Reset Zoom */}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetView}
            title="Reset to Default (0 or R)"
            className="h-9 px-2.5 text-slate-200 hover:text-white hover:bg-white/15 rounded-xl text-xs gap-1.5"
          >
            <RotateCcw size={15} />
            <span className="hidden md:inline">Reset</span>
          </Button>

          {/* Rotate 90 deg */}
          <Button
            variant="ghost"
            size="sm"
            onClick={rotateClockwise}
            title="Rotate 90°"
            className="h-9 px-2.5 text-slate-200 hover:text-white hover:bg-white/15 rounded-xl text-xs gap-1.5"
          >
            <RotateCw size={15} />
            <span className="hidden md:inline">Rotate</span>
          </Button>

          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="h-9 px-2.5 text-slate-200 hover:text-white hover:bg-white/15 rounded-xl text-xs"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span className="sr-only">Fullscreen</span>
          </Button>

          {/* Open original in new tab / download */}
          <a
            href={currentImage.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Original Image in New Tab"
            className="h-9 px-2.5 inline-flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/15 rounded-xl text-xs transition-colors"
          >
            <ExternalLink size={15} />
            <span className="sr-only">Open Original</span>
          </a>
        </div>

        {/* Helpful Keyboard / Touch Hint */}
        <p className="text-[11px] text-slate-400 hidden sm:flex items-center gap-3">
          <span>Scroll mouse wheel to zoom</span>
          <span>•</span>
          <span>Click &amp; drag to inspect details</span>
          <span>•</span>
          <span>Double-click to toggle 2× zoom</span>
          <span>•</span>
          <span>Press ESC to close</span>
        </p>
      </div>
    </div>
  );
}
