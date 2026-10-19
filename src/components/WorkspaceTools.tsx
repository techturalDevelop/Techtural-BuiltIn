import * as React from 'react';
import { motion } from 'motion/react';
import { 
  Calculator, 
  Box, 
  Map, 
  Clock, 
  ArrowRight,
  Zap,
  Shield,
  Layers,
  Sparkles,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const tools = [
  {
    id: 'products',
    title: 'Design & Construction Products',
    description: 'Explore 38 pre-engineered solutions: 18 Kit Homes, 9 Tiny & Container Pods, 6 Pergolas, 6 Commercial, and 4 Warehouses.',
    icon: Building2,
    color: 'bg-amber-500',
    link: '/products',
    status: '38 Products'
  },
  {
    id: 'design-selector',
    title: 'Design Selector',
    description: 'Interactive AI recommendation tool to find the perfect house design based on your needs.',
    icon: Sparkles,
    color: 'bg-blue-500',
    link: '/design-selector',
    status: 'Active'
  },
  {
    id: 'estimator',
    title: 'Cost Estimator',
    description: 'Real-time construction budgeting tool tailored for PNG material and location factors.',
    icon: Calculator,
    color: 'bg-emerald-500',
    link: '/estimator',
    status: 'Active'
  },
  {
    id: 'timeline',
    title: 'Smart Timeline',
    description: 'Dynamic scheduling tool that adjusts based on local supply chain and weather conditions.',
    icon: Clock,
    color: 'bg-purple-500',
    link: '/timeline',
    status: 'Active'
  },
  {
    id: 'visual-impact',
    title: 'Visual Impact',
    description: 'Experience before-and-after project transformations with our interactive slider.',
    icon: Box,
    color: 'bg-indigo-500',
    link: '/visual-impact',
    status: 'Active'
  }
];

export default function WorkspaceTools() {
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-wider uppercase mb-6">
              <Layers size={14} />
              Digital Construction Workspace
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 tracking-tight">
              Beyond Blueprints: <br />
              <span className="text-primary">Interactive Tools</span> for Smarter Building.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <p className="text-lg text-muted-foreground leading-relaxed flex-1">
                We're transforming the construction experience in PNG. Our digital workspace provides you with the tools to make informed decisions, track progress, and visualize your future project in real-time.
              </p>
              <div className="shrink-0">
                <HashLink smooth to="/#contact">
                  <Button size="lg" className="rounded-xl px-8 h-14 font-bold shadow-lg shadow-primary/20">
                    Request Quote
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </HashLink>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="h-full p-8 rounded-3xl bg-background border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 flex flex-col">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg",
                  tool.color
                )}>
                  <tool.icon size={28} />
                </div>
                
                <div className="mb-4">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                    tool.status === 'Active' ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                  )}>
                    {tool.status}
                  </span>
                </div>

                <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                  {tool.description}
                </p>

                {tool.status === 'Active' ? (
                  <Link to={tool.link}>
                    <Button variant="ghost" className="w-full justify-between group/btn rounded-xl hover:bg-primary hover:text-white transition-all">
                      Open Tool
                      <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Button disabled variant="ghost" className="w-full justify-between rounded-xl opacity-50">
                    Coming Soon
                    <Zap size={16} />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
