import React from 'react';
import { motion } from 'motion/react';
import { Camera, Sparkles, ArrowRight } from 'lucide-react';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function VisualImpactPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-16">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles size={14} />
              <span>Project Transformations</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
              Witness the <span className="text-primary">Evolution</span> of Infrastructure
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              From initial site assessment to final architectural masterpiece. Explore our portfolio of high-impact transformations across Papua New Guinea.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Slider Section */}
      <section className="mb-24">
        <BeforeAfterSlider />
      </section>

      {/* Stats / Info Section */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-muted/50 border border-border">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Camera size={24} />
            </div>
            <h3 className="text-xl font-heading font-bold mb-3">Precision Documentation</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We use advanced drone mapping and high-resolution photography to document every stage of the construction lifecycle.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-muted/50 border border-border">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-heading font-bold mb-3">Impact Analysis</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Our projects are designed to maximize social and economic impact, revitalizing communities through thoughtful urban planning.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-primary text-white">
            <h3 className="text-2xl font-heading font-bold mb-4">Ready to start your transformation?</h3>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              Let's discuss how we can bring your vision to life with our expert engineering and construction services.
            </p>
            <Link 
              to="/estimator" 
              className={cn(buttonVariants({ variant: "secondary" }), "w-full rounded-xl h-12")}
            >
              Get an Estimate <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
