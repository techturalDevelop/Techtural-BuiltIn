import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    quote: "Working with Techtural BuiltIn on our Digital and Static Billboards was a seamless experience. Their technical expertise ensured our infrastructure was both modern and robust.",
    author: "Ruben Kautu",
    role: "Managing Director",
    company: "AD Effects Ltd",
    initials: "RK",
    color: "bg-blue-500",
  },
  {
    quote: "The Air Niugini Projects managed by Techtural BuiltIn have been handled with utmost professionalism. Their ability to deliver integrated solutions for complex properties is commendable.",
    author: "Air Niugini Properties",
    role: "Property Management",
    company: "Air Niugini",
    initials: "AN",
    color: "bg-red-600",
  },
  {
    quote: "Partnering with Techtural on the Structural Design and Documentation of the Air Niugini Aircraft Storage Warehouse Project was highly productive. Their commitment to excellence is evident.",
    author: "Mr. Voro Alu",
    role: "Structural Engineer Consultant",
    company: "Consultancy",
    initials: "VA",
    color: "bg-primary",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-heading font-bold mb-4"
          >
            Client Testimonials
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Hear from the leaders and organizations we've partnered with across the nation.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background p-8 rounded-3xl shadow-sm border border-border/50 relative group"
            >
              <Quote size={40} className="text-primary/10 absolute top-6 right-8 group-hover:text-primary/20 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-primary text-primary" />
                ))}
              </div>

              <p className="text-lg mb-8 italic text-muted-foreground leading-relaxed">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0",
                  t.color
                )}>
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-bold leading-tight">{t.author}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{t.role}</p>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
