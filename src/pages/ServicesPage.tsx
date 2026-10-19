import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Home, 
  Box, 
  Sun, 
  Warehouse, 
  ClipboardCheck, 
  Calculator, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  FileText, 
  HardHat, 
  Compass, 
  Award,
  Check,
  ChevronRight,
  TrendingUp,
  Cpu,
  PhoneCall,
  Clock,
  MapPin,
  Package,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link, useSearchParams } from 'react-router-dom';
import ProjectDiscoveryModal from '@/components/ProjectDiscoveryModal';

export default function ServicesPage() {
  const [searchParams] = useSearchParams();
  const initialSection = searchParams.get('section') || 'all';
  const [activeFilter, setActiveFilter] = useState<string>(initialSection);
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);

  const designProducts = [
    {
      title: 'Residential Kit Homes',
      count: '20 Official Models',
      desc: 'Pre-engineered 1 to 4 bedroom modular homes (#01–#20) across Collections A to E with turnkey and blueprint procurement options.',
      icon: Home,
      link: '/products?tab=residential-kit-homes',
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      badge: '20 Models (Col A–E)'
    },
    {
      title: 'Tiny Home Concepts',
      count: 'Coming Soon',
      desc: 'Architectural micro-living pods and off-grid eco retreats. Complete costings and drawings are in development — check back soon.',
      icon: Box,
      link: '/products?tab=tiny-homes',
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
      badge: 'Coming Soon'
    },
    {
      title: 'Container Home Solutions',
      count: 'Coming Soon',
      desc: 'High-Cube Corten shipping container conversions and stacked modular residences. Complete costings and drawings are in development — check back soon.',
      icon: Package,
      link: '/products?tab=container-homes',
      color: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
      badge: 'Coming Soon'
    },
    {
      title: 'Garden Pergola Systems',
      count: '6 Canopy Systems',
      desc: 'Architectural timber, motorized bioclimatic louvered, and solar-roof canopy pergolas for PNG outdoor living and hospitality.',
      icon: Sun,
      link: '/products?tab=garden-pergolas',
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      badge: '6 Systems'
    },
    {
      title: 'Commercial Designs',
      count: 'Coming Soon',
      desc: 'Commercial strip malls, medical clinics, co-working offices and eco-resorts. Complete costings and drawings are in development — check back soon.',
      icon: Building2,
      link: '/products?tab=commercial-designs',
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      badge: 'Coming Soon'
    },
    {
      title: 'Education & Aid Post Infrastructure',
      count: '4 Designs',
      desc: 'Administration buildings, 2-storey 8-in-1 classroom blocks, modular STEM science labs, and low-post dual classrooms engineered to PNG educational standards.',
      icon: GraduationCap,
      link: '/products?tab=education-aid-post',
      color: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
      badge: '4 Designs'
    },
    {
      title: 'Commercial Warehouses',
      count: 'Coming Soon',
      desc: 'Clear-span industrial steel warehouses and logistics depots. Complete costings and drawings are in development — check back soon.',
      icon: Warehouse,
      link: '/products?tab=commercial-warehouses',
      color: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      badge: 'Coming Soon'
    }
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      {/* Hero Header */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-b border-border bg-radial from-primary/5 via-background to-background">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles size={14} />
            <span>Integrated All-in-One Solutions</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
            Our Services &amp; Solutions
          </h1>

          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From pre-engineered <strong>Design &amp; Construction Products</strong> to full-spectrum <strong>Project Management</strong>, 
            <strong>Quantity Surveying &amp; Commercial Advisory</strong>, and statutory <strong>Safety &amp; Compliance</strong> for Papua New Guinea.
          </p>

          {/* Quick Pillar Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-10 max-w-4xl mx-auto">
            <a 
              href="#design-construction"
              className="p-3.5 rounded-2xl border border-border bg-card hover:border-primary/50 hover:bg-muted/30 transition-all text-left flex items-center gap-3 group"
            >
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 group-hover:scale-110 transition-transform">
                <Layers size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">Design &amp; Construction</p>
                <p className="text-[11px] text-muted-foreground">38 Modular Products</p>
              </div>
            </a>

            <a 
              href="#project-management"
              className="p-3.5 rounded-2xl border border-border bg-card hover:border-primary/50 hover:bg-muted/30 transition-all text-left flex items-center gap-3 group"
            >
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 group-hover:scale-110 transition-transform">
                <ClipboardCheck size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">Project Management</p>
                <p className="text-[11px] text-muted-foreground">Lifecycle Delivery</p>
              </div>
            </a>

            <a 
              href="#quantity-surveying"
              className="p-3.5 rounded-2xl border border-border bg-card hover:border-primary/50 hover:bg-muted/30 transition-all text-left flex items-center gap-3 group"
            >
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform">
                <Calculator size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">Quantity Surveying</p>
                <p className="text-[11px] text-muted-foreground">BOQ &amp; Cost Control</p>
              </div>
            </a>

            <a 
              href="#safety-compliance"
              className="p-3.5 rounded-2xl border border-border bg-card hover:border-primary/50 hover:bg-muted/30 transition-all text-left flex items-center gap-3 group"
            >
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 group-hover:scale-110 transition-transform">
                <ShieldCheck size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">Safety &amp; Compliance</p>
                <p className="text-[11px] text-muted-foreground">PNG NBB Certified</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* PILLAR 1: DESIGN & CONSTRUCTION MODULE */}
      <section id="design-construction" className="py-16 max-w-7xl mx-auto px-6 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Layers size={14} />
              <span>Core Module</span>
            </div>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Design &amp; Construction Module
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-1 max-w-2xl">
              Our pre-engineered and architectural product portfolio spanning 38 standardized, climate-responsive designs engineered for Papua New Guinea conditions.
            </p>
          </div>
          <Link to="/products">
            <Button className="rounded-xl gap-2">
              <span>View All 38 Products</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        {/* 5 Sub-Modules Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {designProducts.map((prod) => {
            const Icon = prod.icon;
            return (
              <Card key={prod.title} className="border border-border/80 shadow-xs hover:shadow-md transition-all hover:border-primary/50 group flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`w-12 h-12 rounded-xl ${prod.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-muted text-muted-foreground">
                      {prod.badge}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {prod.title}
                  </CardTitle>
                  <CardDescription className="text-xs font-medium text-primary/80">
                    {prod.count}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    {prod.desc}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link to={prod.link}>
                    <Button variant="outline" size="sm" className="w-full justify-between rounded-xl group/btn hover:bg-primary hover:text-primary-foreground">
                      <span>Explore Category</span>
                      <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}

          {/* Custom Architectural Design Card */}
          <Card className="border border-dashed border-primary/40 bg-primary/5 shadow-xs flex flex-col justify-between">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Sparkles size={22} />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                Bespoke Custom Architectural
              </CardTitle>
              <CardDescription className="text-xs font-medium text-primary">
                Tailored to Your Exact Allotment
              </CardDescription>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                Need a completely customized design? Our registered architects design custom residential estates, institutional masterplans, and commercial developments from scratch.
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                onClick={() => setIsDiscoveryOpen(true)}
                className="w-full rounded-xl"
              >
                Request Custom Brief
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* PILLAR 2: PROJECT MANAGEMENT */}
      <section id="project-management" className="py-16 bg-muted/30 border-y border-border scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 text-xs font-bold uppercase tracking-wider mb-3">
                <ClipboardCheck size={14} />
                <span>Professional Oversight</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Project Management Services
              </h2>
              <p className="text-muted-foreground mt-3 text-base leading-relaxed">
                We bridge the gap between architectural blueprints and on-site delivery. Our project managers oversee time, cost, quality, and risk across Papua New Guinea's challenging logistical environments.
              </p>

              <div className="space-y-4 mt-6">
                {[
                  {
                    title: 'Turnkey Contract Administration',
                    desc: 'Management of FIDIC, AS2124, and PNG standard building contracts from tender to final handover.'
                  },
                  {
                    title: 'Live Scheduling & Milestone Tracking',
                    desc: 'Digital Gantt charts, critical path method (CPM), and real-time site milestone reporting using modern cloud tools.'
                  },
                  {
                    title: 'On-Site Quality Assurance (QA/QC)',
                    desc: 'Daily superintendent inspections, structural steel weld audits, concrete batch testing, and compliance documentation.'
                  },
                  {
                    title: 'Remote Logistics & Provincial Supply Chain',
                    desc: 'Seamless coordination of container sea freight, coastal barge charters, and road transport across all 22 PNG provinces.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-background border border-border">
                    <CheckCircle2 size={18} className="text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button onClick={() => setIsDiscoveryOpen(true)} className="rounded-xl">
                  Consult with a Project Manager
                </Button>
                <Link to="/timeline">
                  <Button variant="outline" className="rounded-xl gap-2">
                    <Clock size={16} />
                    <span>View Interactive Timeline</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="p-6 rounded-3xl bg-background border border-border shadow-xl relative z-10 space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Digital Supervision</span>
                    <h3 className="text-lg font-bold text-foreground">Project Management Deliverables</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold">
                    PMBOK &amp; ISO 9001
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                    <span className="text-2xl font-extrabold text-foreground">100%</span>
                    <p className="text-xs font-medium text-muted-foreground mt-1">Budget Transparency</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                    <span className="text-2xl font-extrabold text-foreground">22</span>
                    <p className="text-xs font-medium text-muted-foreground mt-1">PNG Provinces Reached</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                    <span className="text-2xl font-extrabold text-foreground">0</span>
                    <p className="text-xs font-medium text-muted-foreground mt-1">Uncertified Hand-offs</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                    <span className="text-2xl font-extrabold text-foreground">24/7</span>
                    <p className="text-xs font-medium text-muted-foreground mt-1">Cloud Client Dashboard</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                  <p className="text-xs font-semibold text-foreground">Integrated Tech Foundation:</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Powered by QuantyPros, our digital infrastructure links estimation, procurement, site logs, and invoicing in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILLAR 3: QUANTITY SURVEYING & COMMERCIAL */}
      <section id="quantity-surveying" className="py-16 max-w-7xl mx-auto px-6 scroll-mt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="p-6 rounded-3xl bg-card border border-border shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Financial Engineering</span>
                  <h3 className="text-lg font-bold text-foreground">Commercial &amp; QS Framework</h3>
                </div>
                <Calculator size={20} className="text-emerald-500" />
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Bills of Quantities (BOQ)', desc: 'Standard Method of Measurement (SMM) compliant itemized trade breakdowns.' },
                  { label: 'Bill of Materials (BOM)', desc: 'Exact piece-by-piece hardware, steel section, and fastener counts.' },
                  { label: 'Feasibility & Capex Modeling', desc: 'Pre-construction cost planning to validate return on investment.' },
                  { label: 'Progress Claim Valuations', desc: 'Independent verification of contractor claims before payment approvals.' },
                ].map((row, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-muted/30 border border-border/70 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-foreground">{row.label}</p>
                      <p className="text-[11px] text-muted-foreground">{row.desc}</p>
                    </div>
                    <Check size={14} className="text-emerald-500 shrink-0 ml-2" />
                  </div>
                ))}
              </div>

              <Link to="/estimator">
                <Button variant="outline" className="w-full rounded-xl gap-2">
                  <TrendingUp size={16} />
                  <span>Launch Cost Estimator Tool</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-3">
              <Calculator size={14} />
              <span>Cost Engineering</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Quantity Surveying &amp; Commercial
            </h2>
            <p className="text-muted-foreground mt-3 text-base leading-relaxed">
              Eliminate cost blowouts and hidden contractor variations. Our certified quantity surveyors ensure every kina spent is accounted for through rigorous cost planning, procurement analysis, and contract administration.
            </p>

            <div className="space-y-4 mt-6">
              {[
                {
                  title: 'Comprehensive QuantyPros BOQ Preparation',
                  desc: 'Itemized material quantities, labour hours, equipment plant hire, and logistical tariffs structured by standard trade divisions.'
                },
                {
                  title: 'Tender Documentation & Bid Evaluation',
                  desc: 'Preparation of tender packages, objective contractor comparison matrixes, and risk-weighted recommendation reports.'
                },
                {
                  title: 'Value Engineering & Alternative Sourcing',
                  desc: 'Identification of equivalent high-performance materials to lower capital expenditure without sacrificing structural integrity.'
                }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-card border border-border">
                  <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button onClick={() => setIsDiscoveryOpen(true)} className="rounded-xl">
                Request Commercial Review / BOQ
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* PILLAR 4: SAFETY & COMPLIANCE */}
      <section id="safety-compliance" className="py-16 bg-muted/30 border-t border-border scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/10 text-purple-600 text-xs font-bold uppercase tracking-wider mb-3">
                <ShieldCheck size={14} />
                <span>Statutory Standards</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Safety &amp; Compliance Advisory
              </h2>
              <p className="text-muted-foreground mt-3 text-base leading-relaxed">
                Building in Papua New Guinea requires adherence to unique seismic, cyclonic, and statutory requirements. We ensure full compliance with the PNG National Building Board, local municipal councils, and international engineering standards.
              </p>

              <div className="space-y-4 mt-6">
                {[
                  {
                    title: 'National Building Board (NBB) Approvals',
                    desc: 'Full documentation packaging, physical council submissions, and liaison with building inspectors in NCD and provincial capitals.'
                  },
                  {
                    title: 'Cyclone & Seismic Engineering Certifications',
                    desc: 'Structural engineering sign-offs adhering to PNGS 1001 (Earthquake Actions) and AS/NZS 1170 wind cyclonic loading codes.'
                  },
                  {
                    title: 'Workplace Health, Safety & Environmental (HSE)',
                    desc: 'Site-specific safety management plans (SMP), job safety analyses (JSA), hazard mitigation, and worker PPE compliance.'
                  },
                  {
                    title: 'Geotechnical & Sub-floor Stability Verification',
                    desc: 'Soil bearing capacity testing, elevated pier foundation engineering, and flood plain elevation certifications.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-background border border-border">
                    <CheckCircle2 size={18} className="text-purple-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button onClick={() => setIsDiscoveryOpen(true)} className="rounded-xl">
                  Consult Safety &amp; Compliance Team
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="p-6 rounded-3xl bg-background border border-border shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Accreditations</span>
                    <h3 className="text-lg font-bold text-foreground">Statutory Sign-Offs &amp; Codes</h3>
                  </div>
                  <Award size={22} className="text-purple-500" />
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20">
                    <p className="font-bold text-purple-700 dark:text-purple-300">PNG National Building Code</p>
                    <p className="text-muted-foreground mt-0.5">Compliant with all structural fire safety, ventilation, and sanitary provisions.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                    <p className="font-bold text-blue-700 dark:text-blue-300">AS/NZS 1170 &amp; PNGS 1001</p>
                    <p className="text-muted-foreground mt-0.5">Wind cyclonic rating Region C/D and high seismic zone 1-4 ductility detailing.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <p className="font-bold text-emerald-700 dark:text-emerald-300">Certified Structural Blueprints</p>
                    <p className="text-muted-foreground mt-0.5">Stamped by registered Professional Engineers of PNG (PEB PNG).</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border text-center">
                  <p className="text-xs font-bold text-foreground">Need Council or Building Board Clearance?</p>
                  <p className="text-[11px] text-muted-foreground mt-1">We handle NCDC, Lae City Authority, and provincial planning board submissions end-to-end.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="rounded-3xl p-8 sm:p-12 bg-linear-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md inline-block mb-3">
              Ready to Build in PNG?
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Start Your Project with Integrated Professional Confidence
            </h2>
            <p className="text-primary-foreground/90 text-sm sm:text-base mt-2">
              Speak directly with our architectural designers, quantity surveyors, and project superintendents today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Button 
              size="lg" 
              variant="secondary"
              className="rounded-xl font-bold shadow-lg"
              onClick={() => setIsDiscoveryOpen(true)}
            >
              Book Discovery Session
            </Button>
            <Link to="/products">
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-xl font-bold bg-white/10 hover:bg-white/20 border-white/30 text-white w-full"
              >
                Browse Catalog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <ProjectDiscoveryModal 
        isOpen={isDiscoveryOpen} 
        onClose={() => setIsDiscoveryOpen(false)} 
      />
    </div>
  );
}
