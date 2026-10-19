import * as React from 'react';
import { motion } from 'motion/react';
import { projects, ProjectCard } from '@/components/Portfolio';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function ProjectsPage() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <Link to="/">
            <Button variant="ghost" className="gap-2 mb-8 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={18} />
              Back to Home
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-heading font-bold mb-6 tracking-tight">Full Portfolio</h1>
            <p className="text-muted-foreground text-xl max-w-3xl leading-relaxed">
              Explore our complete collection of architectural and engineering excellence across Papua New Guinea. From modern commercial hubs to sustainable residential designs.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
