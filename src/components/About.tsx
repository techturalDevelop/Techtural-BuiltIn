import { motion } from 'motion/react';
import { Users, Target, Eye, Award, ShieldCheck, Briefcase, Compass, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface FlipCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  variant: 'primary' | 'secondary';
}

function FlipCard({ icon, title, subtitle, description, variant }: FlipCardProps) {
  const isPrimary = variant === 'primary';
  
  return (
    <div className="group h-[280px] [perspective:1000px]">
      <motion.div 
        className="relative h-full w-full rounded-3xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
      >
        {/* Front Face */}
        <div className={cn(
          "absolute inset-0 h-full w-full rounded-3xl p-10 [backface-visibility:hidden] flex flex-col items-start justify-center shadow-xl",
          isPrimary 
            ? "bg-primary text-white shadow-primary/20" 
            : "bg-secondary text-secondary-foreground shadow-black/5"
        )}>
          <div className="mb-6">{icon}</div>
          <h3 className="text-4xl font-bold font-heading mb-2">{title}</h3>
          <p className={cn("text-lg", isPrimary ? "text-white/80" : "text-muted-foreground")}>{subtitle}</p>
        </div>

        {/* Back Face */}
        <div className={cn(
          "absolute inset-0 h-full w-full rounded-3xl p-10 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-start justify-center shadow-xl",
          isPrimary 
            ? "bg-primary text-white shadow-primary/20" 
            : "bg-secondary text-secondary-foreground shadow-black/5"
        )}>
          <h4 className="font-bold text-xl mb-4">About Our {subtitle}</h4>
          <p className={cn("text-sm leading-relaxed", isPrimary ? "text-white/90" : "text-muted-foreground/90")}>
            {description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Main Grid: Mission, Vision & Highlights */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck size={14} />
              <span>Certified Professional Standards</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-6 tracking-tight">
              100% PNG Owned. <br />
              <span className="text-primary">Globally Aligned.</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
              Techtural BuiltIn is a premier technology-driven design, engineering, and project management firm based in Papua New Guinea. With over 15 years of industry experience, we bridge traditional construction craft with certified structural engineering and digital BIM workflows.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 p-4 rounded-2xl bg-card/60 border border-border/60">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Target size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-foreground">Our Mission</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Deliver innovative, cost-efficient, and technology-driven architectural design and structural engineering solutions that adhere to international standards and PNG National Building Board codes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-card/60 border border-border/60">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Eye size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-foreground">Our Vision</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    To be Papua New Guinea’s most trusted and preferred multidisciplinary partner for integrated architectural, structural engineering, and cloud-governed construction project management.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FlipCard 
                variant="primary"
                icon={<Award size={40} />}
                title="15+"
                subtitle="Years of Excellence"
                description="Over a decade and a half of delivering high-quality architectural, structural, and construction solutions across Papua New Guinea, bridging traditional methods with modern digital workflows."
              />
              <FlipCard 
                variant="secondary"
                icon={<Users size={40} />}
                title="100%"
                subtitle="Local Ownership"
                description="Proudly 100% PNG owned and operated. We are committed to building the future of our nation by leveraging certified local engineering expertise and a deep understanding of the PNG landscape."
              />
            </div>
            
            {/* Background decoration */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[100px]" />
          </motion.div>
        </div>

        {/* Key Leadership & Engineering Personnel Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-16 sm:mt-20 pt-12 border-t border-border/80"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
                <Users size={14} />
                <span>Core Leadership &amp; Engineering</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                Key Leadership &amp; Technical Personnel
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
              Combining registered professional structural engineering, architectural design excellence, and hybrid project coordination across Papua New Guinea.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Staff 1: Mr. Gerea George */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 hover:border-primary/50 transition-all flex flex-col justify-between shadow-sm hover:shadow-md group relative overflow-hidden">
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-5">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-primary/10 shrink-0 border-2 border-border shadow-md group-hover:border-primary/50 group-hover:scale-[1.02] transition-all duration-300">
                    <img 
                      src="https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Portfolio%20ID%26%20About%20Info/GV_Professional%20Passport%20Portrait.png" 
                      alt="Mr. Gerea George" 
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 text-[10px] font-mono uppercase tracking-wider font-semibold">
                        CAD &amp; AI Automation Specialist
                      </Badge>
                      <span className="text-[11px] font-mono text-muted-foreground">15+ Yrs Industry Exp</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
                      Mr. Gerea George
                    </h4>
                    <p className="text-xs sm:text-sm font-semibold text-primary mt-1">
                      Lead Structural &amp; Architectural Cad Designer • AI Automation &amp; Agent Specialist
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Lead Structural &amp; Architectural Cad Designer and AI Automation &amp; Agent Specialist, driving digital BIM workflows, QuantyPros project controls, and end-to-end turnkey construction coordination across PNG. Specializes in balancing Papua New Guinean cultural context with modern structural durability and strict budgetary governance.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-border/60 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground/80 font-mono text-[11px] font-medium">
                  Lead Structural &amp; Architectural Cad Designer
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground/80 font-mono text-[11px] font-medium">
                  AI Automation &amp; Agent Specialist
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground/80 font-mono text-[11px] font-medium">
                  Project Management Lead
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground/80 font-mono text-[11px] font-medium">
                  QuantyPros Cost Governance
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground/80 font-mono text-[11px] font-medium">
                  Turnkey Provincial Delivery
                </span>
              </div>
            </div>

            {/* Staff 2: Mr. Neil Maino */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 hover:border-primary/50 transition-all flex flex-col justify-between shadow-sm hover:shadow-md group relative overflow-hidden">
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-5">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-primary/10 shrink-0 border-2 border-border shadow-md group-hover:border-primary/50 group-hover:scale-[1.02] transition-all duration-300">
                    <img 
                      src="https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Portfolio%20ID%26%20About%20Info/NM_Professional%20Passport%20Portrait.jpg" 
                      alt="Mr. Neil Maino" 
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25 text-[10px] font-mono uppercase tracking-wider font-semibold">
                        Registered PE • Structural
                      </Badge>
                      <span className="text-[11px] font-mono text-muted-foreground">IEPNG Registered</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
                      Mr. Neil Maino
                    </h4>
                    <p className="text-xs sm:text-sm font-semibold text-primary mt-1">
                      Registered Structural Engineer &amp; Project Coordinator (Hybrid)
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Certified structural engineering lead specializing in seismic and cyclone-rated structural designs, concrete and heavy steel calculations as a Registered Structural Engineer with IEPNG. Acts as hybrid technical coordinator aligning structural engineering design directly with on-site contractor operations.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-border/60 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground/80 font-mono text-[11px] font-medium">
                  Registered Structural Engineer with IEPNG
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground/80 font-mono text-[11px] font-medium">
                  Hybrid Project Coordinator
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground/80 font-mono text-[11px] font-medium">
                  Seismic &amp; Cyclone Analysis
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground/80 font-mono text-[11px] font-medium">
                  IEPNG Professional Accreditation
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
