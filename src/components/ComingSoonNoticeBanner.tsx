import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Calculator, 
  FileCheck2, 
  ShieldCheck, 
  CheckCircle2,
  Box,
  Package,
  Building2,
  Warehouse,
  BellRing,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRIMARY_WHATSAPP_NUMBER, DISPLAY_WHATSAPP, buildWhatsAppLink } from '@/lib/communicationLinks';

export interface ComingSoonCategoryMeta {
  title: string;
  categoryLabel: string;
  icon: React.ElementType;
  colorScheme: {
    accent: string;
    border: string;
    bg: string;
    badge: string;
  };
  description: string;
  upcomingDeliverables: string[];
}

export const COMING_SOON_CATEGORIES_INFO: Record<string, ComingSoonCategoryMeta> = {
  'tiny-homes': {
    title: 'Tiny Home Concepts',
    categoryLabel: 'Micro-Living & Eco Pods',
    icon: Box,
    colorScheme: {
      accent: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-500/25',
      bg: 'bg-indigo-500/5',
      badge: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
    },
    description: 'Architectural micro-living pods, mobile cabins, and compact eco-living spaces optimized for sustainable, minimal-footprint lifestyle in Papua New Guinea.',
    upcomingDeliverables: [
      'Certified Architectural & Mezzanine Floor Plans',
      'Off-Grid Solar & Rainwater Integration Schedules',
      'Complete Itemized BOQ & Timber/Light Steel Schedules',
      'Provincial Turn-Key Prefab & Logistics Costings'
    ]
  },
  'container-homes': {
    title: 'Container Home Solutions',
    categoryLabel: '20ft & 40ft High-Cube Conversions',
    icon: Package,
    colorScheme: {
      accent: 'text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-500/25',
      bg: 'bg-cyan-500/5',
      badge: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    },
    description: 'Engineered Corten steel shipping container conversions, multi-unit stacked configurations, and modular container homes engineered for rapid deployment and durability in PNG.',
    upcomingDeliverables: [
      'Certified Corten Steel Structural Modification & Reinforcement Plans',
      'Overhead Tropical Fly-Roof & Solar Heat Deflection Frames',
      'R-3.5 Spray-Applied Thermal Insulation & Acoustic Drywall Schedules',
      'Turnkey Foundation Footing Piers, Crane Placement & Provincial Delivery Rates'
    ]
  },
  'commercial-designs': {
    title: 'Commercial Designs',
    categoryLabel: 'Retail, Clinics & Corporate Hubs',
    icon: Building2,
    colorScheme: {
      accent: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-500/25',
      bg: 'bg-blue-500/5',
      badge: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
    },
    description: 'Turnkey commercial developments including retail shopping plazas, medical clinics, corporate office buildings, and coastal eco-resort hospitality suites.',
    upcomingDeliverables: [
      'NBB-Compliant Architectural & Structural Stamped Blueprints',
      'Complete Master Bill of Quantities (BOQ) with Unit Rates',
      'MEP (Mechanical, Electrical, Plumbing) Engineering Documentation',
      'Tender Documentation & Cashflow Feasibility Projections'
    ]
  },
  'education-aid-post': {
    title: 'Education & Aid Post Infrastructure Designs',
    categoryLabel: 'Admin Centers, 2-Storey Blocks, STEM Labs & Classrooms',
    icon: GraduationCap,
    colorScheme: {
      accent: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-500/25',
      bg: 'bg-rose-500/5',
      badge: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
    },
    description: 'Turnkey educational infrastructure: Administration Buildings & Resource Centers, 2-Storey 8-in-1 Classroom Blocks, Modular STEM Science Labs, and Low Post 1-in-2 Classrooms for PNG institutions.',
    upcomingDeliverables: [
      'PNG Department of Education Compliant Floor Plans',
      'Cyclone & Seismic-Rated 2-Storey Steel Structural Stamping',
      'STEM Laboratory Wet/Dry Bench Plumbing & Solar Integration',
      'Provincial Flat-Pack Kitset Transport & Turnkey Assembly BOQ'
    ]
  },
  'commercial-warehouses': {
    title: 'Commercial Warehouse Designs',
    categoryLabel: 'Clear-Span Industrial & Logistics',
    icon: Warehouse,
    colorScheme: {
      accent: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500/25',
      bg: 'bg-amber-500/5',
      badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    },
    description: 'Heavy-duty industrial warehouses, high-clearance logistics depots, temperature-controlled cold chains, and multi-bay SME industrial business parks.',
    upcomingDeliverables: [
      'Portal Frame & Heavy Structural Steel Engineering Drawings',
      'Certified Foundation, Slab & Heavy Vehicle Apron Details',
      'Comprehensive Material Take-Off & Steel Schedule BOQ',
      'Cyclone Category & Seismic Zone PNG Compliance Stamping'
    ]
  }
};

interface ComingSoonNoticeBannerProps {
  categoryKey: 'tiny-homes' | 'container-homes' | 'commercial-designs' | 'education-aid-post' | 'commercial-warehouses';
  compact?: boolean;
  onRegisterInterest?: () => void;
}

export function ComingSoonNoticeBanner({
  categoryKey,
  compact = false,
  onRegisterInterest
}: ComingSoonNoticeBannerProps) {
  const meta = COMING_SOON_CATEGORIES_INFO[categoryKey];
  if (!meta) return null;

  const Icon = meta.icon;
  const whatsappMsg = `Hi Techtural BuiltIn, I am inquiring about your upcoming ${meta.title}. Please notify me once full blueprints and complete costings are released.`;

  if (compact) {
    return (
      <div className={`p-4 rounded-2xl border ${meta.colorScheme.border} ${meta.colorScheme.bg} shadow-xs`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${meta.colorScheme.badge}`}>
              <Clock size={18} className={meta.colorScheme.accent} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-bold text-sm text-foreground">{meta.title}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${meta.colorScheme.badge}`}>
                  Coming Soon • Costing in Progress
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                These designs are still being developed with complete costings and certified engineering documentation. Customers are advised to check back again soon.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {onRegisterInterest && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRegisterInterest}
                className="text-xs rounded-xl h-8 border-primary/30 hover:border-primary gap-1.5"
              >
                <BellRing size={13} className="text-primary" />
                <span>Register Interest</span>
              </Button>
            )}
            <Link to="/kit-homes">
              <Button size="sm" variant="default" className="text-xs rounded-xl h-8 bg-primary text-primary-foreground gap-1">
                <span>View Kit Homes</span>
                <ArrowRight size={13} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl border ${meta.colorScheme.border} ${meta.colorScheme.bg} p-6 sm:p-8 shadow-sm backdrop-blur-xs my-6`}>
      {/* Decorative background grid and glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top Badges & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Clock size={13} className="animate-pulse" />
              <span>Coming Soon</span>
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${meta.colorScheme.badge}`}>
              <Icon size={13} />
              <span>{meta.categoryLabel}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/80 text-muted-foreground text-xs font-mono">
              <ShieldCheck size={12} className="text-emerald-500" />
              <span>Costing &amp; Engineering in Progress</span>
            </span>
          </div>

          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
            <Sparkles size={13} className="text-amber-500" />
            <span>Papua New Guinea Standards (PNG NBB)</span>
          </span>
        </div>

        {/* Headline & User Notice */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${meta.colorScheme.badge} shrink-0`}>
              <Icon size={26} className={meta.colorScheme.accent} />
            </div>
            <span>{meta.title} — Under Development</span>
          </h2>

          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25">
            <p className="text-sm sm:text-base font-semibold text-amber-900 dark:text-amber-200 leading-relaxed">
              &ldquo;These designs are still being developed with complete costings and certified engineering documentation. Customers are advised to check back again soon.&rdquo;
            </p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Our architectural and quantity surveying teams are currently finalizing certified structural engineering packages, local material lists, supplier schedules, and turnkey build rates tailored for Papua New Guinea provinces.
            </p>
          </div>
        </div>

        {/* Deliverables in progress checklist */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <FileCheck2 size={14} className="text-primary" />
            <span>What Is Currently Being Finalized for This Category:</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {meta.upcomingDeliverables.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-card/70 border border-border/70 text-xs shadow-2xs"
              >
                <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                <span className="text-foreground/90 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls & Alternatives */}
        <div className="pt-2 border-t border-border/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {onRegisterInterest && (
              <Button
                onClick={onRegisterInterest}
                className="rounded-xl text-xs sm:text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-xs"
              >
                <BellRing size={15} />
                <span>Register for Early Notification</span>
              </Button>
            )}

            <a
              href={buildWhatsAppLink(whatsappMsg, PRIMARY_WHATSAPP_NUMBER)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
            >
              <MessageSquare size={15} />
              <span>Direct WhatsApp Inquiry ({DISPLAY_WHATSAPP})</span>
            </a>
          </div>

          <div className="flex items-center gap-2 sm:justify-end">
            <span className="text-xs text-muted-foreground hidden lg:inline">Ready to build now?</span>
            <Link to="/kit-homes">
              <Button
                variant="outline"
                className="rounded-xl text-xs sm:text-sm font-semibold border-primary/30 hover:border-primary text-foreground gap-1.5 w-full sm:w-auto"
              >
                <Calculator size={14} className="text-primary" />
                <span>Explore 20 Certified Kit Homes (M1–M20)</span>
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
