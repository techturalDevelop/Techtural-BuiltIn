import React from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react';

interface WatermarkOverlayProps {
  /**
   * Display mode:
   * - 'badge': subtle corner and center stamp for cards/thumbnails
   * - 'full': repeating diagonal grid + center stamp + corner seal (ideal for blueprints & high-res 3D zoom)
   * - 'compact': minimal corner watermark for small cards
   */
  variant?: 'badge' | 'full' | 'compact';
  className?: string;
  isBlueprint?: boolean;
}

/**
 * Universal architectural watermark overlay for Techtural BuiltIn 3D perspectives and floor plans.
 * Completely non-destructive, responsive, and pointer-events-free.
 */
export const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({
  variant = 'badge',
  className,
  isBlueprint = false,
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 pointer-events-none select-none overflow-hidden z-10 flex items-center justify-center",
        className
      )}
    >
      {/* Repeating Diagonal Watermark Grid (for full/blueprint & zoom modes) */}
      {variant === 'full' && (
        <div className="absolute inset-0 opacity-[0.14] dark:opacity-[0.18] flex items-center justify-center pointer-events-none select-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id={`tech-watermark-pattern-${isBlueprint ? 'bp' : '3d'}`}
                width="280"
                height="140"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(-25)"
              >
                <text
                  x="20"
                  y="45"
                  fill="currentColor"
                  className={cn(
                    "font-mono font-black tracking-[0.25em] text-[13px] uppercase",
                    isBlueprint ? "text-cyan-300" : "text-white"
                  )}
                >
                  TECHTURAL BUILTIN
                </text>
                <text
                  x="50"
                  y="110"
                  fill="currentColor"
                  className="font-mono font-bold tracking-[0.2em] text-[10px] text-white/70 uppercase"
                >
                  ARCHITECTURAL DESIGN
                </text>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#tech-watermark-pattern-${isBlueprint ? 'bp' : '3d'})`} />
          </svg>
        </div>
      )}

      {/* Central Architectural Stamp */}
      {(variant === 'badge' || variant === 'full') && (
        <div 
          className={cn(
            "flex flex-col items-center justify-center text-center pointer-events-none select-none transition-transform",
            variant === 'full' 
              ? "p-3.5 rounded-2xl bg-black/35 backdrop-blur-[2px] border border-white/15 shadow-2xl scale-95 sm:scale-105" 
              : "p-2 rounded-xl bg-black/25 backdrop-blur-[1px] border border-white/10 scale-90"
          )}
        >
          <div className="flex items-center gap-1.5 text-white/80">
            <ShieldCheck size={variant === 'full' ? 16 : 13} className="text-amber-400/90 shrink-0" />
            <span className="font-heading font-black tracking-[0.22em] text-xs sm:text-sm uppercase text-white drop-shadow-md">
              TECHTURAL BUILTIN
            </span>
          </div>
          <span className="text-[9px] font-mono font-semibold tracking-[0.16em] uppercase text-white/60 mt-0.5">
            {isBlueprint ? 'Official Architectural Specification • PNG' : 'Architectural 3D Perspective • PNG'}
          </span>
        </div>
      )}

      {/* Bottom Corner Brand Stamp */}
      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs border border-white/10 text-white/75 text-[10px] font-mono tracking-wider uppercase shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-pulse" />
        <span>© Techtural BuiltIn</span>
      </div>
    </div>
  );
};

export default WatermarkOverlay;
