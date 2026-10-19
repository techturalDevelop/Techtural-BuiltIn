import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Building2, 
  Home, 
  Factory, 
  Landmark,
  PenTool,
  HardHat,
  CheckCircle2,
  MapPin,
  DollarSign,
  Calendar,
  RefreshCcw,
  Store,
  Warehouse,
  School
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { submitProjectRequest } from '@/lib/firebase';
import { 
  PRIMARY_WHATSAPP_NUMBER, 
  PRIMARY_EMAIL, 
  buildWhatsAppLink, 
  buildMailtoLink 
} from '@/lib/communicationLinks';
import { MessageSquare, Mail } from 'lucide-react';

interface StepProps {
  onNext: () => void;
  onBack?: () => void;
  data: any;
  updateData: (key: string, value: any) => void;
}

const ProjectType = ({ onNext, data, updateData }: StepProps) => {
  const types = [
    { id: 'residential', label: 'Residential', icon: Home, desc: 'Villas, Apartments' },
    { id: 'commercial', label: 'Commercial', icon: Store, desc: 'Offices, Retail, Malls' },
    { id: 'industrial', label: 'Industrial', icon: Warehouse, desc: 'Warehouses, Hangars' },
    { id: 'public', label: 'Public', icon: School, desc: 'Civic, Education, Health' },
    { id: 'renovation', label: 'Renovation', icon: RefreshCcw, desc: 'Remodeling, Extensions' },
    { id: 'other', label: 'Other', icon: Building2, desc: 'Custom Projects' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-heading font-bold mb-2">What are you building?</h3>
        <p className="text-muted-foreground">Select the category that best fits your vision.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => {
              updateData('projectType', type.id);
              onNext();
            }}
            className={cn(
              "p-6 rounded-2xl border-2 text-left transition-all group hover:border-primary",
              data.projectType === type.id ? "border-primary bg-primary/5" : "border-border bg-muted/50"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all",
              data.projectType === type.id ? "bg-primary text-white" : "bg-background text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            )}>
              <type.icon size={24} />
            </div>
            <div className="font-bold mb-1">{type.label}</div>
            <div className="text-xs text-muted-foreground line-clamp-1">{type.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

const ServiceScope = ({ onNext, onBack, data, updateData }: StepProps) => {
  const services = [
    { id: 'design', label: 'Design Only', icon: PenTool, desc: 'Architectural & Engineering' },
    { id: 'construction', label: 'Construction', icon: HardHat, desc: 'Building & Project Management' },
    { id: 'turnkey', label: 'Full Turnkey', icon: CheckCircle2, desc: 'From Concept to Completion' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-heading font-bold mb-2">How can we help?</h3>
        <p className="text-muted-foreground">Choose the level of involvement you need.</p>
      </div>
      <div className="space-y-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => {
              updateData('service', service.id);
              onNext();
            }}
            className={cn(
              "w-full p-5 rounded-2xl border-2 text-left flex items-center gap-4 transition-all group hover:border-primary",
              data.service === service.id ? "border-primary bg-primary/5" : "border-border bg-muted/50"
            )}
          >
            <div className={cn(
              "p-3 rounded-xl transition-colors",
              data.service === service.id ? "bg-primary text-white" : "bg-background text-muted-foreground group-hover:text-primary"
            )}>
              <service.icon size={24} />
            </div>
            <div>
              <div className="font-bold">{service.label}</div>
              <div className="text-xs text-muted-foreground">{service.desc}</div>
            </div>
            <ChevronRight className="ml-auto text-muted-foreground/30 group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>
      <Button variant="ghost" onClick={onBack} className="w-full mt-4">Back</Button>
    </div>
  );
};

const ProjectLogistics = ({ onNext, onBack, data, updateData }: StepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-heading font-bold mb-2">Project Details</h3>
        <p className="text-muted-foreground">Help us understand the scale of your project.</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-bold flex items-center gap-2">
            <MapPin size={16} className="text-primary" />
            Project Location
          </label>
          <select 
            className="w-full p-4 rounded-xl border-2 border-border bg-muted/50 focus:border-primary outline-none transition-all"
            value={data.location || ''}
            onChange={(e) => updateData('location', e.target.value)}
          >
            <option value="">Select Location</option>
            <option value="pom">Port Moresby</option>
            <option value="lae">Lae</option>
            <option value="hagan">Mount Hagen</option>
            <option value="goroka">Goroka</option>
            <option value="madang">Madang</option>
            <option value="other">Other PNG Location</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold flex items-center gap-2">
            <DollarSign size={16} className="text-primary" />
            Estimated Budget
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['< K500k', 'K500k - K2M', 'K2M - K10M', 'K10M+'].map((range) => (
              <button
                key={range}
                onClick={() => updateData('budget', range)}
                className={cn(
                  "p-3 rounded-xl border-2 text-xs font-bold transition-all",
                  data.budget === range ? "border-primary bg-primary text-white" : "border-border bg-muted/50 hover:border-primary/50"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Button variant="outline" onClick={onBack} className="flex-1 rounded-xl py-6">Back</Button>
        <Button 
          disabled={!data.location || !data.budget} 
          onClick={onNext} 
          className="flex-[2] rounded-xl py-6"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

const ContactDetails = ({ onNext, onBack, data, updateData }: StepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await submitProjectRequest(data);
      onNext();
    } catch (err: any) {
      console.error("Submission error:", err);
      try {
        const errorDetails = JSON.parse(err.message);
        setError(`Submission failed: ${errorDetails.error}`);
      } catch {
        setError("Something went wrong. Please try again or contact us directly.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-heading font-bold mb-2">Final Step</h3>
        <p className="text-muted-foreground">How should we reach you to discuss your vision?</p>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-lg border border-destructive/20">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-bold">Full Name</label>
          <input 
            type="text" 
            placeholder="John Doe"
            className="w-full p-4 rounded-xl border-2 border-border bg-muted/50 focus:border-primary outline-none transition-all"
            value={data.name || ''}
            onChange={(e) => updateData('name', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold">Email Address</label>
          <input 
            type="email" 
            placeholder="john@example.com"
            className="w-full p-4 rounded-xl border-2 border-border bg-muted/50 focus:border-primary outline-none transition-all"
            value={data.email || ''}
            onChange={(e) => updateData('email', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold">Phone Number</label>
          <input 
            type="tel" 
            placeholder="+675 ..."
            className="w-full p-4 rounded-xl border-2 border-border bg-muted/50 focus:border-primary outline-none transition-all"
            value={data.phone || ''}
            onChange={(e) => updateData('phone', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3 mt-8">
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1 rounded-xl py-6">Back</Button>
          <Button 
            disabled={!data.name || !data.email || isSubmitting} 
            onClick={handleSubmit} 
            className="flex-[2] rounded-xl py-6"
          >
            {isSubmitting ? "Sending..." : "Request Consultation"}
          </Button>
        </div>

        <div className="relative my-2 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <span className="relative px-2 bg-background text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Or Send Direct To Project Desk
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <a
            href={buildWhatsAppLink(
              `*🏛️ TECHTURAL BUILTIN - PROJECT CONSULTATION REQUEST*\n----------------------------------------\n*Type:* ${data.projectType || 'General'}\n*Service:* ${data.service || 'Design & Build'}\n*Scope/Budget:* ${data.budget || 'Custom'}\n*Timeline:* ${data.timeline || 'Flexible'}\n\n*Client Details:*\n• Name: ${data.name || 'Not provided'}\n• Email: ${data.email || 'Not provided'}\n• Phone: ${data.phone || 'Not provided'}\n• Notes: ${data.description || 'None provided'}`,
              PRIMARY_WHATSAPP_NUMBER
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <MessageSquare size={14} />
            <span>Send to WhatsApp</span>
          </a>

          <a
            href={buildMailtoLink(
              `Project Consultation Request: ${data.name || 'New Client'} (${data.projectType || 'Construction'})`,
              `Project Type: ${data.projectType}\nService: ${data.service}\nBudget: ${data.budget}\nTimeline: ${data.timeline}\n\nClient Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n\nDescription:\n${data.description || 'N/A'}`,
              PRIMARY_EMAIL
            )}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold border border-border shadow-xs transition-colors"
          >
            <Mail size={14} className="text-primary" />
            <span>Send via Email App</span>
          </a>
        </div>
      </div>
    </div>
  );
};

const SuccessStep = ({ onClose }: { onClose: () => void }) => (
  <div className="text-center py-8">
    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <CheckCircle2 className="text-primary w-10 h-10" />
    </div>
    <h3 className="text-3xl font-heading font-bold mb-4">Request Received!</h3>
    <p className="text-muted-foreground mb-8 leading-relaxed">
      Thank you for choosing Techtural BuiltIn. Our project management team will review your details and contact you within 24 hours to schedule your initial discovery session.
    </p>
    <Button onClick={onClose} className="w-full rounded-xl py-6">Got it, thanks!</Button>
  </div>
);

export default function ProjectDiscoveryModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void 
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: 'residential',
    service: '',
    location: '',
    budget: '',
    name: '',
    email: '',
    phone: ''
  });

  const updateData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const reset = () => {
    setStep(1);
    setFormData({
      projectType: 'residential',
      service: '',
      location: '',
      budget: '',
      name: '',
      email: '',
      phone: ''
    });
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-8 bg-background border-none rounded-3xl shadow-2xl overflow-hidden">
        <DialogTitle className="sr-only">Start Your Project</DialogTitle>
        <DialogDescription className="sr-only">Multi-step project discovery form</DialogDescription>
        
        <div className="relative">
          {step < 5 && (
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4].map((s) => (
                <div 
                  key={s} 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    s === step ? "w-8 bg-primary" : s < step ? "w-4 bg-primary/40" : "w-4 bg-muted"
                  )} 
                />
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && <ProjectType onNext={nextStep} data={formData} updateData={updateData} />}
              {step === 2 && <ServiceScope onNext={nextStep} onBack={prevStep} data={formData} updateData={updateData} />}
              {step === 3 && <ProjectLogistics onNext={nextStep} onBack={prevStep} data={formData} updateData={updateData} />}
              {step === 4 && <ContactDetails onNext={nextStep} onBack={prevStep} data={formData} updateData={updateData} />}
              {step === 5 && <SuccessStep onClose={handleClose} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
