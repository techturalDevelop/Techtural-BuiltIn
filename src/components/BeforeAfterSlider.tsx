import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectTransformation {
  id: string;
  title: string;
  location: string;
  description: string;
  beforeImage: string;
  afterImage: string;
}

const PROJECTS: ProjectTransformation[] = [
  {
    id: '1',
    title: 'Modern Residential Complex',
    location: 'Port Moresby, PNG',
    description: 'Transformation of an abandoned industrial site into a sustainable 50-unit residential complex with green spaces and community hubs.',
    beforeImage: 'https://images.unsplash.com/photo-1590019223936-3f67a8d0216a?auto=format&fit=crop&q=80&w=1600',
    afterImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: '2',
    title: 'Urban Waterfront Plaza',
    location: 'Lae, PNG',
    description: 'Revitalization of the historic waterfront district, creating a vibrant public plaza with commercial retail and leisure facilities.',
    beforeImage: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?auto=format&fit=crop&q=80&w=1600',
    afterImage: 'https://images.unsplash.com/photo-1449156001935-d2863fb72690?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: '3',
    title: 'Sustainable Office Tower',
    location: 'Mount Hagen, PNG',
    description: 'A state-of-the-art LEED Platinum certified office building featuring vertical gardens and advanced energy-saving technologies.',
    beforeImage: 'https://images.unsplash.com/photo-1503387762-592dee58c160?auto=format&fit=crop&q=80&w=1600',
    afterImage: 'https://images.unsplash.com/photo-1470075801209-17f9ec0cada6?auto=format&fit=crop&q=80&w=1600',
  }
];

export default function BeforeAfterSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const project = PROJECTS[currentIndex];

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % PROJECTS.length);
    setSliderPosition(50);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
    setSliderPosition(50);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-heading font-bold text-foreground">Visual Impact</h2>
            <p className="text-muted-foreground">Witness the transformation of our key projects</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prevProject}
              className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
              aria-label="Previous project"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextProject}
              className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
              aria-label="Next project"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="relative group overflow-hidden rounded-3xl border border-border shadow-2xl bg-muted aspect-[16/9]">
          <div
            ref={containerRef}
            className="relative w-full h-full cursor-ew-resize select-none overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
          >
            {/* After Image (Background) */}
            <img
              src={project.afterImage}
              alt="After transformation"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Before Image (Clipped) */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={project.beforeImage}
                alt="Before transformation"
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Slider Handle */}
            <div
              className="absolute inset-y-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] z-10"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-primary/20">
                <div className="flex gap-0.5">
                  <ChevronLeft size={16} className="text-primary" />
                  <ChevronRight size={16} className="text-primary" />
                </div>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-6 left-6 z-20 pointer-events-none">
              <span className="px-4 py-2 bg-black/50 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest rounded-full border border-white/20">
                Before
              </span>
            </div>
            <div className="absolute top-6 right-6 z-20 pointer-events-none">
              <span className="px-4 py-2 bg-primary/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest rounded-full border border-white/20">
                After
              </span>
            </div>

            {/* Project Info Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20 pointer-events-none">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-primary font-bold text-sm uppercase tracking-wider">{project.location}</span>
                </div>
                <h3 className="text-2xl font-heading font-bold text-white mb-2">{project.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed line-clamp-2">
                  {project.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnails / Indicators */}
        <div className="flex justify-center gap-2">
          {PROJECTS.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setSliderPosition(50);
              }}
              className={cn(
                "w-12 h-1.5 rounded-full transition-all duration-300",
                currentIndex === index ? "bg-primary w-24" : "bg-border hover:bg-muted-foreground/30"
              )}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
