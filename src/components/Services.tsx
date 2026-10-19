import { motion } from 'motion/react';
import { 
  Layers, 
  ClipboardCheck, 
  Calculator, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Home,
  Box,
  Sun,
  Building2,
  Warehouse,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const services = [
  {
    id: 'design-construction',
    title: 'Design & Construction Module',
    category: 'Modular & Pre-Engineered Portfolio',
    description: 'A comprehensive catalog of 45 climate-resilient designs pre-engineered specifically for Papua New Guinea.',
    icon: Layers,
    features: [
      'Residential Kit Homes (20 Models, #01–#20)',
      'Tiny & Container Living (9 Concepts • Coming Soon)',
      'Garden Pergola Systems (6 Systems)',
      'Commercial Designs & Warehouses (10 Solutions • Coming Soon)'
    ],
    color: 'bg-amber-500/10 text-amber-600',
    hoverBg: 'hover:bg-amber-500/5',
    link: '/products',
    linkText: 'Explore 45 Products',
    badge: '45 Modular Designs'
  },
  {
    id: 'project-management',
    title: 'Project Management',
    category: 'End-to-End Delivery & Oversight',
    description: 'Professional superintendence ensuring projects finish on schedule and on budget across all 22 PNG provinces.',
    icon: ClipboardCheck,
    features: [
      'Turnkey Contract Administration (FIDIC/AS2124)',
      'Live Cloud Milestone & Schedule Tracking',
      'On-Site Superintendent QA/QC Inspections',
      'Remote Provincial Freight & Logistics'
    ],
    color: 'bg-blue-500/10 text-blue-600',
    hoverBg: 'hover:bg-blue-500/5',
    link: '/services#project-management',
    linkText: 'Learn About PM',
    badge: 'Full Lifecycle PM'
  },
  {
    id: 'quantity-surveying',
    title: 'Quantity Surveying & Commercial',
    category: 'Cost Control & Feasibility',
    description: 'Certified financial engineering and bill of quantities management powered by our QuantyPros technology platform.',
    icon: Calculator,
    features: [
      'Detailed Bills of Quantities (BOQ & BOM)',
      'Pre-Construction Feasibility & Capex Modeling',
      'Tender Documentation & Contractor Bid Audits',
      'Value Engineering & Sourcing Optimization'
    ],
    color: 'bg-emerald-500/10 text-emerald-600',
    hoverBg: 'hover:bg-emerald-500/5',
    link: '/services#quantity-surveying',
    linkText: 'Explore Commercial QS',
    badge: 'QuantyPros Powered'
  },
  {
    id: 'safety-compliance',
    title: 'Safety & Compliance',
    category: 'PNG Statutory & Engineering Codes',
    description: 'Complete regulatory compliance with the PNG National Building Board, council approvals, and cyclone/seismic engineering.',
    icon: ShieldCheck,
    features: [
      'PNG National Building Board (NBB) Approvals',
      'Cyclone & Seismic Structural Certifications',
      'Workplace Health, Safety & Environmental (HSE)',
      'Geotechnical & Sub-floor Foundation Audits'
    ],
    color: 'bg-purple-500/10 text-purple-600',
    hoverBg: 'hover:bg-purple-500/5',
    link: '/services#safety-compliance',
    linkText: 'View Certifications',
    badge: 'NBB & AS/NZS Certified'
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-muted/30 scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3"
          >
            Core Capabilities
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-heading font-bold mb-4 text-foreground"
          >
            Integrated Services &amp; Solutions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base sm:text-lg leading-relaxed"
          >
            We provide a unified "All-in-One Design to Construction Solution" tailored specifically for homeowners, commercial developers, and institutions across Papua New Guinea.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                "h-full border border-border/80 shadow-xs hover:shadow-md transition-all duration-300 group flex flex-col justify-between",
                service.hoverBg
              )}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <service.icon size={22} />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {service.badge}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    {service.category}
                  </span>
                  <CardTitle className="text-xl font-heading text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground mt-1">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2.5 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={service.link}>
                    <Button variant="outline" size="sm" className="w-full justify-between rounded-xl group/btn hover:bg-primary hover:text-primary-foreground text-xs">
                      <span>{service.linkText}</span>
                      <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Hub CTA */}
        <div className="mt-12 text-center">
          <Link to="/services">
            <Button size="lg" className="rounded-xl gap-2 font-bold px-8 shadow-sm">
              <span>Explore Complete Services &amp; Solutions Hub</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
