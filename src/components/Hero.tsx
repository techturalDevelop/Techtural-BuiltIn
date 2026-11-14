import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Calculator, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProjectDiscoveryModal from './ProjectDiscoveryModal';
import { HeroBackgroundGeometry } from './HeroArchitecturalAnimation';
import TechturalArchitecturalStage from './three/TechturalArchitecturalStage';

interface HeroProps {
  onReturnToWelcome?: () => void;
}

export default function Hero({ onReturnToWelcome }: HeroProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 pb-14 lg:py-20 overflow-hidden bg-background">
      {/* Background Architectural & Geometric Animations */}
      <HeroBackgroundGeometry />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[0.95fr_1.15fr] gap-10 lg:gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2
                }
              }
            }}
          >
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wider uppercase mb-6"
            >
              <Zap size={14} />
              The Future of PNG Construction
            </motion.div>
            
            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-7xl font-heading font-bold leading-[1.1] tracking-tight mb-6"
            >
              Innovative Design. <br />
              <span className="text-primary">Tech-Driven</span> <br />
              Construction.
            </motion.h1>
            
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
            >
              Techtural BuiltIn is a 100% PNG-owned firm delivering integrated, cloud-based architectural and construction solutions with over 15 years of local expertise.
            </motion.p>

            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="flex flex-wrap gap-4"
            >
              <Button 
                size="lg" 
                className="rounded-full px-8 py-7 text-lg group"
                onClick={() => setIsModalOpen(true)}
              >
                Start Your Project
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Link to="/estimator">
                <Button size="lg" variant="outline" className="rounded-full px-8 py-7 text-lg group">
                  Try Cost Estimator
                  <Calculator className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            {onReturnToWelcome && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="mt-5"
              >
                <button
                  type="button"
                  onClick={onReturnToWelcome}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg border border-border/80 bg-card/60 hover:bg-card hover:border-primary/40 text-sm font-medium text-foreground/80 hover:text-primary transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <RotateCcw size={15} />
                  <span>Return to Welcome Screen · 10 Flagship Kit Homes</span>
                </button>
              </motion.div>
            )}

            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
              className="mt-12 flex items-center gap-8 pt-8 border-t border-border/50"
            >
              <div className="flex flex-col">
                <span className="text-3xl font-bold font-heading">15+</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">Years Exp</span>
              </div>
              <div className="w-px h-10 bg-border/50" />
              <div className="flex flex-col">
                <span className="text-3xl font-bold font-heading">100%</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">PNG Owned</span>
              </div>
              <div className="w-px h-10 bg-border/50" />
              <div className="flex flex-col">
                <span className="text-3xl font-bold font-heading">50+</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">Projects</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15 }}
            className="relative w-full"
          >
            <TechturalArchitecturalStage />
          </motion.div>
        </div>
      </div>

      <ProjectDiscoveryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
}
