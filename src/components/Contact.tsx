import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { submitContactMessage } from '@/lib/firebase';
import { 
  PRIMARY_WHATSAPP_NUMBER, 
  SECONDARY_WHATSAPP_NUMBER,
  TERTIARY_WHATSAPP_NUMBER,
  DISPLAY_WHATSAPP,
  PRIMARY_EMAIL,
  SECONDARY_EMAIL,
  buildWhatsAppLink, 
  buildMailtoLink, 
  formatGeneralContactWhatsAppMessage 
} from '@/lib/communicationLinks';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field as user types
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError("Please correct the highlighted errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitContactMessage(formData);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.error("Contact submission error:", err);
      try {
        const errorDetails = JSON.parse(err.message);
        setError(`Failed to send message: ${errorDetails.error}`);
      } catch {
        setError("Failed to send message. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-heading font-bold mb-6">Let's Build Something <br /><span className="text-primary">Great Together</span></h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Ready to start your next project or have questions about our tech-driven solutions? Reach out for a free consultation.
            </p>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Office Location</h4>
                  <p className="text-muted-foreground">PO Box 1585 | PORT MORESBY | National Capital District 121</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Phone size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-lg">Phone &amp; WhatsApp</h4>
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 font-semibold border border-emerald-500/20">
                      <MessageSquare size={11} />
                      WhatsApp Active
                    </span>
                  </div>
                  <p className="text-muted-foreground font-medium mt-0.5">
                    WhatsApp: <span className="font-bold text-foreground">{DISPLAY_WHATSAPP}</span> | Phone: (675) 7061 9746 / 7313 9744
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    <a
                      href={buildWhatsAppLink("Hi Techtural BuiltIn team, I'd like to inquire about your architectural & construction services.", PRIMARY_WHATSAPP_NUMBER)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      <MessageSquare size={13} />
                      <span>Main WhatsApp ({DISPLAY_WHATSAPP})</span>
                    </a>
                    <a
                      href={buildWhatsAppLink("Hi Techtural BuiltIn team, I would like to make an inquiry.", SECONDARY_WHATSAPP_NUMBER)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-medium border border-border transition-colors"
                    >
                      <span>Alt (+675 7061 9746)</span>
                    </a>
                    <a
                      href={buildWhatsAppLink("Hi Techtural BuiltIn team, I would like to make an inquiry.", TERTIARY_WHATSAPP_NUMBER)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-medium border border-border transition-colors"
                    >
                      <span>Line 3 (+675 7313 9744)</span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Mail size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg">Email</h4>
                  <div className="flex flex-col text-sm mt-0.5 gap-0.5">
                    <a 
                      href={buildMailtoLink("General Inquiry - Techtural BuiltIn", "Hello Techtural BuiltIn Team,\n\nI would like to inquire about your services:\n\n", PRIMARY_EMAIL)}
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      <span>techtural782@gmail.com</span>
                      <ExternalLink size={12} className="opacity-60" />
                    </a>
                    <a 
                      href={buildMailtoLink("General Inquiry - Techtural BuiltIn", "Hello Techtural BuiltIn Team,\n\nI would like to inquire about your services:\n\n", SECONDARY_EMAIL)}
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      <span>gerea.george@techturalpng.com</span>
                      <ExternalLink size={12} className="opacity-60" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Working Hours</h4>
                  <p className="text-muted-foreground">Mon - Fri: 8:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-muted p-8 md:p-12 rounded-3xl border border-border/50 overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-center py-12"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                    className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"
                  >
                    <CheckCircle2 className="text-primary w-12 h-12" />
                  </motion.div>
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl font-heading font-bold mb-4"
                  >
                    Message Sent!
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-muted-foreground mb-10 text-lg max-w-sm mx-auto"
                  >
                    Thank you for reaching out. We've received your inquiry and will get back to you shortly.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="rounded-xl px-8"
                      onClick={() => setIsSuccess(false)}
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6" 
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20"
                    >
                      {error}
                    </motion.div>
                  )}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                      <Input 
                        placeholder="John Doe" 
                        className={cn(
                          "bg-background border-none h-12 rounded-xl transition-all",
                          fieldErrors.name && "ring-2 ring-destructive/50"
                        )} 
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                      />
                      {fieldErrors.name && (
                        <p className="text-xs text-destructive font-medium ml-1">{fieldErrors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                      <Input 
                        type="email" 
                        placeholder="john@example.com" 
                        className={cn(
                          "bg-background border-none h-12 rounded-xl transition-all",
                          fieldErrors.email && "ring-2 ring-destructive/50"
                        )} 
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                      />
                      {fieldErrors.email && (
                        <p className="text-xs text-destructive font-medium ml-1">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Subject</label>
                    <Input 
                      placeholder="Project Inquiry" 
                      className={cn(
                        "bg-background border-none h-12 rounded-xl transition-all",
                        fieldErrors.subject && "ring-2 ring-destructive/50"
                      )} 
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                    />
                    {fieldErrors.subject && (
                      <p className="text-xs text-destructive font-medium ml-1">{fieldErrors.subject}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Message</label>
                    <Textarea 
                      placeholder="Tell us about your project..." 
                      className={cn(
                        "bg-background border-none min-h-[150px] rounded-xl transition-all",
                        fieldErrors.message && "ring-2 ring-destructive/50"
                      )} 
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                    />
                    {fieldErrors.message && (
                      <p className="text-xs text-destructive font-medium ml-1">{fieldErrors.message}</p>
                    )}
                  </div>
                  <div className="space-y-3 pt-1">
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-6 text-base rounded-xl group relative overflow-hidden"
                    >
                      <span className={cn("flex items-center justify-center transition-all duration-300", isSubmitting ? "opacity-0" : "opacity-100")}>
                        Send Message (Portal Inbox)
                        <Send className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={17} />
                      </span>
                      {isSubmitting && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                          />
                        </div>
                      )}
                    </Button>

                    <div className="relative my-2 text-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/80"></div>
                      </div>
                      <span className="relative px-3 bg-muted text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Or Send Directly Via
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <a
                        href={buildWhatsAppLink(
                          formatGeneralContactWhatsAppMessage({
                            name: formData.name || 'Website Visitor',
                            email: formData.email || 'Not provided',
                            subject: formData.subject || 'General Inquiry',
                            message: formData.message || 'Hi, I would like to get in touch regarding a project.'
                          }),
                          PRIMARY_WHATSAPP_NUMBER
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
                      >
                        <MessageSquare size={16} />
                        <span>Send to WhatsApp</span>
                      </a>

                      <a
                        href={buildMailtoLink(
                          `Inquiry: ${formData.subject || 'Architectural / Construction Inquiry'}`,
                          `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`,
                          PRIMARY_EMAIL
                        )}
                        className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-background hover:bg-muted text-foreground text-xs sm:text-sm font-bold border border-border transition-colors shadow-xs"
                      >
                        <Mail size={16} className="text-primary" />
                        <span>Open in Email App</span>
                      </a>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
