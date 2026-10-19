import { motion } from 'motion/react';
import { Cloud, LayoutDashboard, BarChart3, Share2, Database, ShieldCheck } from 'lucide-react';

const techFeatures = [
  {
    title: 'Cloud-Based Collaboration',
    description: 'Real-time design and project data access for all stakeholders, anywhere in PNG.',
    icon: Cloud,
  },
  {
    title: 'Project Dashboards',
    description: 'Live visibility into project progress, budgets, and timelines with data-driven insights.',
    icon: LayoutDashboard,
  },
  {
    title: 'Data-Driven Workflows',
    description: 'Automated processes that reduce human error and optimize resource allocation.',
    icon: BarChart3,
  },
  {
    title: 'Integrated Systems',
    description: 'Seamless connection between design software and site management tools.',
    icon: Share2,
  },
  {
    title: 'Secure Data Management',
    description: 'Enterprise-grade security for all project documentation and client data.',
    icon: Database,
  },
  {
    title: 'Quality Control Tech',
    description: 'Digital site inspections and automated reporting for superior quality assurance.',
    icon: ShieldCheck,
  },
];

export default function Technology() {
  return (
    <section id="technology" className="py-24 bg-primary text-primary-foreground overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold tracking-wider uppercase mb-6">
              Digital Transformation
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 leading-tight">
              The Tech-Enabled <br />
              Advantage
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-10 leading-relaxed max-w-xl">
              We don't just build structures; we build with intelligence. Our cloud-based workflows ensure that every project is transparent, efficient, and future-ready.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8 mb-12">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <h3 className="text-4xl font-bold mb-2">30%</h3>
                <p className="text-sm text-primary-foreground/60 uppercase tracking-widest">Efficiency Gain</p>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <h3 className="text-4xl font-bold mb-2">Real-Time</h3>
                <p className="text-sm text-primary-foreground/60 uppercase tracking-widest">Project Tracking</p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-8 bg-white rounded-3xl text-primary shadow-2xl relative overflow-hidden group"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="https://pub-3a05e821f38849e6bfc8d19b810721c6.r2.dev/QuantyPros%20logo%20icons%20on%20transparent%20background1.png" 
                    alt="QuantyPros Logo" 
                    className="h-10 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <h3 className="text-2xl font-bold font-heading">QuantyPros</h3>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Our proprietary BOQ Management Application streamlines construction project estimation and cost control with professional-grade precision.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Professional BOQ Management', 'Streamlined Cost Estimation', 'Real-time Project Tracking', 'Cloud-based Collaboration'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a 
                  href="https://quantypros.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
                >
                  Explore QuantyPros <Share2 size={18} />
                </a>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            </motion.div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {techFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/15 transition-colors group"
              >
                <feature.icon size={32} className="mb-4 text-white group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                <p className="text-sm text-primary-foreground/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
