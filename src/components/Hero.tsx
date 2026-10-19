import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shield, Zap, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProjectDiscoveryModal from './ProjectDiscoveryModal';

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} 
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block max-w-md ml-auto lg:mt-16"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-border/50 aspect-square">
              <img 
                src="https://pub-d244eff0ad524eccbaae907a70af6b3d.r2.dev/techtural-builtin/techtural%20builtin_logo25.png" 
                alt="Modern Architecture" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <Shield size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Quality Guaranteed</h4>
                    <p className="text-[10px] text-white/70">International standards, local expertise.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
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
