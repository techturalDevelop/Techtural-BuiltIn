import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ExternalLink,
} from 'lucide-react';
import { FLAGSHIP_SHOWCASE_MODELS } from '@/data/flagshipShowcaseData';
import { KitHomeModel } from '@/data/kitHomesData';

interface FlagshipIntroSlideshowProps {
  onComplete: () => void;
}

const SLIDE_DURATION_MS = 5500;

export default function FlagshipIntroSlideshow({ onComplete }: FlagshipIntroSlideshowProps) {
  const models: KitHomeModel[] = FLAGSHIP_SHOWCASE_MODELS;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();

  const totalSlides = models.length;
  const activeModel = models[activeIndex] || models[0];

  const handleProceedToSite = useCallback(
    (targetPath?: string) => {
      if (isExiting) return;
      setIsExiting(true);
      setTimeout(() => {
        onComplete();
        if (targetPath) {
          navigate(targetPath);
        }
      }, prefersReducedMotion ? 50 : 350);
    },
    [isExiting, onComplete, navigate, prefersReducedMotion]
  );

  const goToSlide = useCallback(
    (index: number) => {
      const next = (index + totalSlides) % totalSlides;
      setActiveIndex(next);
      setProgressKey((k) => k + 1);
    },
    [totalSlides]
  );

  const handleNext = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const handlePrev = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  // Lock body scroll while welcome showcase is mounted
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying || isExiting || totalSlides <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
      setProgressKey((k) => k + 1);
    }, SLIDE_DURATION_MS);

    return () => window.clearInterval(timer);
  }, [isPlaying, isExiting, totalSlides, activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleProceedToSite();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleNext, handlePrev, handleProceedToSite]);

  if (!activeModel) return null;

  const formattedIndex = String(activeIndex + 1).padStart(2, '0');
  const formattedTotal = String(totalSlides).padStart(2, '0');

  const formattedTurnkey = activeModel.isTurnKeyCostingInProgress
    ? activeModel.turnKeyPriceLabel || 'Costing in Progress'
    : `K${activeModel.fullTurnKeyPrice.toLocaleString()}`;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Flagship Kit Home Designs Introduction"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: prefersReducedMotion ? 0.05 : 0.35, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] h-[100dvh] w-full overflow-hidden bg-slate-950 text-white select-none flex flex-col justify-between"
    >
      {/* Background Architectural Render Stage */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={activeModel.id}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img
              src={activeModel.image}
              alt={`${activeModel.name} (${activeModel.code}) architectural 3D render`}
              className="h-full w-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        {/* Directional dark scrims for guaranteed WCAG AA readability */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/65 to-slate-950/25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-slate-950/50"
        />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 flex items-center justify-between px-5 sm:px-8 lg:px-12 pt-5 sm:pt-7">
        <div className="flex items-center gap-4">
          <img
            src="https://pub-d244eff0ad524eccbaae907a70af6b3d.r2.dev/techtural-builtin/techtural_logo_transparent.png"
            alt="Techtural BuiltIn"
            className="h-11 sm:h-13 w-auto object-contain brightness-0 invert"
            referrerPolicy="no-referrer"
          />
          <div className="hidden sm:flex flex-col border-l border-white/20 pl-4">
            <span className="text-xs font-semibold text-white tracking-wide">
              Flagship Kit Home Collection
            </span>
            <span className="text-xs text-slate-300">
              Engineered Tropical Residences · Papua New Guinea
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden xs:flex items-center gap-1.5 text-sm font-mono tabular-nums text-slate-300">
            <span className="text-white font-semibold">{formattedIndex}</span>
            <span aria-hidden="true">/</span>
            <span>{formattedTotal}</span>
          </div>

          <button
            type="button"
            onClick={() => handleProceedToSite()}
            className="min-h-[44px] px-4 py-2 text-sm font-medium text-slate-200 hover:text-white border border-white/25 hover:border-white/50 bg-slate-950/50 hover:bg-slate-900/80 rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Skip to Website
          </button>
        </div>
      </header>

      {/* Center / Lower-Left Editorial Model Showcase */}
      <div className="relative z-20 flex-1 flex flex-col justify-end px-5 sm:px-8 lg:px-12 pb-5 sm:pb-7 min-h-0">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModel.id}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: prefersReducedMotion ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Clean unboxed editorial metadata line */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-slate-300 mb-3">
                <span className="font-mono tabular-nums text-sky-300 font-semibold">
                  Flagship {formattedIndex} of {formattedTotal}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeModel.collectionName}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-slate-200">{activeModel.code}</span>
              </div>

              {/* Balanced Display Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-white leading-[1.08] text-balance">
                {activeModel.name}
              </h1>

              {/* Architectural Tagline */}
              <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-200 leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-none">
                {activeModel.tagline}
              </p>

              {/* Clean Specification Strip with Hairline Dividers */}
              <dl className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 max-w-2xl">
                <div>
                  <dt className="text-xs text-slate-400">Configuration</dt>
                  <dd className="text-sm sm:text-base font-semibold text-white tabular-nums mt-0.5">
                    {activeModel.bedrooms} Bed · {activeModel.bathrooms} Bath
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Floor Area</dt>
                  <dd className="text-sm sm:text-base font-semibold text-white font-mono tabular-nums mt-0.5">
                    {activeModel.buildingAreaSqm} m²
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Footprint</dt>
                  <dd className="text-sm sm:text-base font-semibold text-white font-mono tabular-nums mt-0.5">
                    {activeModel.dimensions}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Turnkey Guide</dt>
                  <dd className="text-sm sm:text-base font-semibold text-sky-300 font-mono tabular-nums mt-0.5">
                    {formattedTurnkey}
                  </dd>
                </div>
              </dl>
            </motion.div>
          </AnimatePresence>

          {/* Primary & Secondary Actions */}
          <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleProceedToSite()}
              className="min-h-[44px] px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold text-sm sm:text-base rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-slate-950/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span>Proceed to Website</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => handleProceedToSite(`/kit-homes?model=${encodeURIComponent(activeModel.id)}`)}
              className="min-h-[44px] px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-medium text-sm sm:text-base rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span>Inspect {activeModel.code}</span>
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Interactive 10-Model Selector & Playback Controls */}
      <footer className="relative z-20 px-5 sm:px-8 lg:px-12 pb-5 sm:pb-7 pt-3 border-t border-white/10 bg-slate-950/75 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* 10 Flagship Thumbnails / Index Tabs */}
          <div
            role="tablist"
            aria-label="Select flagship kit home slide"
            className="grid grid-cols-5 lg:grid-cols-10 gap-1.5 sm:gap-2 flex-1"
          >
            {models.map((model, idx) => {
              const isSelected = idx === activeIndex;
              const numLabel = String(idx + 1).padStart(2, '0');
              return (
                <button
                  key={model.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`Slide ${numLabel}: ${model.name}`}
                  onClick={() => goToSlide(idx)}
                  className={`group relative overflow-hidden rounded-lg text-left transition-all cursor-pointer min-h-[44px] border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    isSelected
                      ? 'border-sky-400 bg-white/15'
                      : 'border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2">
                    <img
                      src={model.image}
                      alt=""
                      className="hidden xl:block w-8 h-7 rounded object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-mono tabular-nums text-slate-300 leading-tight">
                        {numLabel}
                      </div>
                      <div className="text-[11px] sm:text-xs font-medium text-white truncate">
                        Model {model.officialNumber}
                      </div>
                    </div>
                  </div>

                  {/* Animated Auto-Advance Progress Indicator */}
                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                      {isPlaying && !prefersReducedMotion ? (
                        <motion.div
                          key={`${activeIndex}-${progressKey}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: SLIDE_DURATION_MS / 1000, ease: 'linear' }}
                          style={{ transformOrigin: 'left' }}
                          className="h-full w-full bg-sky-400"
                        />
                      ) : (
                        <div className="h-full w-full bg-sky-400" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Playback & Stepping Controls */}
          <div className="flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous flagship design"
              className="w-11 h-11 rounded-lg border border-white/20 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              className="w-11 h-11 rounded-lg border border-white/20 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next flagship design"
              className="w-11 h-11 rounded-lg border border-white/20 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
