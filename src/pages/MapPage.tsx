import React from 'react';
import { motion } from 'motion/react';
import { Map as MapIcon, Globe, Layers, Navigation } from 'lucide-react';
import ProjectMap from '@/components/ProjectMap';

export default function MapPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      {/* Header */}
      <section className="container mx-auto px-6 mb-12">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <Globe size={14} />
              <span>Interactive Project Map</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
              Our Footprint Across <span className="text-primary">PNG</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Explore our diverse portfolio of engineering and construction projects. From the bustling capital of Port Moresby to the remote highlands, we are building the future of Papua New Guinea.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="container mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ProjectMap />
        </motion.div>
      </section>

      {/* Info Grid */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-muted/30 border border-border hover:border-primary/30 transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <Layers size={24} />
            </div>
            <h3 className="text-xl font-heading font-bold mb-3">Regional Coverage</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Our strategic presence in key provinces allows us to mobilize resources quickly and efficiently across the country.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-muted/30 border border-border hover:border-primary/30 transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <Navigation size={24} />
            </div>
            <h3 className="text-xl font-heading font-bold mb-3">Real-time Updates</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The map is updated weekly with project milestones, providing transparency and progress tracking for our stakeholders.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-muted/30 border border-border hover:border-primary/30 transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <MapIcon size={24} />
            </div>
            <h3 className="text-xl font-heading font-bold mb-3">Interactive Discovery</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Click on any pin to view detailed project specifications, high-resolution imagery, and current construction status.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
