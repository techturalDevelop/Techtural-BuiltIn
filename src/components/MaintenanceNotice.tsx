import React, { useState } from 'react';
import { 
  Wrench, 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  AlertTriangle,
  Building2,
  HardHat,
  ArrowRight,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MAINTENANCE_CONFIG, setMaintenanceBypass } from '@/config/maintenanceConfig';
import { submitContactMessage } from '@/lib/firebase';
import { 
  PRIMARY_WHATSAPP_NUMBER, 
  SECONDARY_WHATSAPP_NUMBER,
  DISPLAY_WHATSAPP, 
  DISPLAY_PHONE, 
  PRIMARY_EMAIL, 
  SECONDARY_EMAIL, 
  buildWhatsAppLink, 
  buildMailtoLink 
} from '@/lib/communicationLinks';
import { toast } from 'sonner';

interface MaintenanceNoticeProps {
  onBypass?: () => void;
}

export const MaintenanceNotice: React.FC<MaintenanceNoticeProps> = ({ onBypass }) => {
  const [copied, setCopied] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminError, setAdminError] = useState('');

  // Maintenance Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: 'General Construction Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const config = MAINTENANCE_CONFIG;

  const handleCopyAllContacts = async () => {
    const contactText = `Techtural BuiltIn - Smart Construction Solutions (PNG)
WhatsApp: ${config.contactChannels.displayWhatsApp}
Direct Phone: ${config.contactChannels.displayPhone}
Emails: ${config.contactChannels.primaryEmail} | ${config.contactChannels.secondaryEmail}
Office: ${config.contactChannels.officeAddress}
Hours: ${config.contactChannels.workingHours}`;

    try {
      await navigator.clipboard.writeText(contactText);
      setCopied(true);
      toast.success('Official contact details copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error('Could not copy contact details');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormError('Please enter your name, email, and inquiry message.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await submitContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || 'Not specified',
        subject: `[Maintenance Inquiry] ${formData.projectType} - ${formData.name}`,
        message: formData.message.trim()
      });

      setIsSubmitted(true);
      toast.success('Inquiry logged with Project Desk. Our team will contact you shortly.');
      setFormData({
        name: '',
        phone: '',
        email: '',
        projectType: 'General Construction Inquiry',
        message: ''
      });
    } catch (err: any) {
      console.error('Maintenance form error:', err);
      setFormError('Inquiry submission encountered an issue. Please use the direct WhatsApp or Phone links below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminBypassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow owner bypass with passcode 'techtural' or 'admin2026' or 'techturalpng'
    const code = adminPasscode.trim().toLowerCase();
    if (code === 'techtural' || code === 'techtural2026' || code === 'admin' || code === 'png') {
      setMaintenanceBypass(true);
      toast.success('Admin preview mode enabled.');
      if (onBypass) onBypass();
      else window.location.reload();
    } else {
      setAdminError('Invalid passcode. Contact techtural782@gmail.com for admin access.');
    }
  };

  const urgentWhatsAppText = `*🏛️ TECHTURAL BUILTIN - MAINTENANCE PERIOD INQUIRY*\n----------------------------------------\n*Client Name:* ${formData.name || 'Website Visitor'}\n*Phone:* ${formData.phone || 'Not provided'}\n*Email:* ${formData.email || 'Not provided'}\n*Topic:* ${formData.projectType}\n\n*Inquiry:* ${formData.message || 'I would like to inquire about architectural and kit home construction services during your maintenance period.'}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-amber-500/20 selection:text-amber-900 font-sans relative overflow-x-hidden">
      {/* Background Architectural Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Subtle Luminous Light Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-gradient-to-b from-amber-100/60 via-slate-100/40 to-transparent blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 border-b border-slate-200/90 bg-white/90 backdrop-blur-md px-6 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://pub-d244eff0ad524eccbaae907a70af6b3d.r2.dev/techtural-builtin/techtural_logo_transparent.png" 
              alt="Techtural BuiltIn Logo" 
              className="h-12 sm:h-14 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="hidden sm:flex flex-col border-l border-slate-200 pl-3">
              <span className="text-[10px] font-bold text-amber-600 tracking-[0.2em] uppercase leading-tight">
                Driven by Design
              </span>
              <span className="text-[10px] font-semibold text-slate-500 tracking-[0.1em] uppercase">
                Defined by Technology
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300/80 text-amber-800 text-xs font-bold tracking-wide shadow-xs">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span>{config.badge}</span>
            </span>

            <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 shadow-2xs">
              100% PNG Owned 🇵🇬
            </span>
          </div>
        </div>
      </header>

      {/* Main Notice Body */}
      <main className="relative z-10 flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full flex flex-col justify-center">
        {/* Notice Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mb-5 shadow-sm">
            <Wrench size={32} className="animate-bounce" />
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            {config.title}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {config.subtitle}
          </p>

          <div className="mt-5 p-5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed text-left sm:text-center shadow-xs">
            <p>{config.detailedMessage}</p>
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-amber-700">
              <Clock size={14} className="text-amber-600" />
              <span>{config.estimatedReturn}</span>
            </div>
          </div>
        </div>

        {/* Access Restrict Banner: Customer Contact Hub Only */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/90 via-white to-emerald-50/90 border border-amber-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Customer Direct Contact Channels Fully Operational
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Automated calculation modules are temporarily paused for maintenance, but our project management and consultation desks remain actively available.
              </p>
            </div>
          </div>

          <Button
            onClick={handleCopyAllContacts}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs gap-1.5 bg-white border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shrink-0 cursor-pointer shadow-2xs"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? 'Copied Details' : 'Copy All Contact Info'}</span>
          </Button>
        </div>

        {/* Customer Contact & Communications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto w-full">
          {/* Left Column: Direct Phone, WhatsApp & Office Details (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-1">
                  Immediate Inquiries
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Direct Customer Contact Channels
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Connect immediately with our Senior Project Managers &amp; Quantity Surveyors for active projects, quotes, and technical blueprints.
                </p>
              </div>

              {/* 1. Official WhatsApp Desk */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        WhatsApp Project Desk
                      </h4>
                      <p className="text-xs text-emerald-700 font-mono font-bold">
                        {config.contactChannels.displayWhatsApp}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                    Live Chat
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Instant response for kit home inquiries, pricing schedules, and site consultations.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href={buildWhatsAppLink("Hi Techtural BuiltIn, I am contacting you regarding a project inquiry while your website is undergoing maintenance.", PRIMARY_WHATSAPP_NUMBER)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <MessageSquare size={14} />
                    <span>Chat on WhatsApp ({config.contactChannels.displayWhatsApp})</span>
                  </a>

                  <a
                    href={buildWhatsAppLink("Hi Techtural BuiltIn, I would like to inquire about project management and construction.", SECONDARY_WHATSAPP_NUMBER)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors shadow-2xs"
                  >
                    <span>Alt WhatsApp ({config.contactChannels.displaySecondaryWhatsApp})</span>
                  </a>
                </div>
              </div>

              {/* 2. Direct Telephone Support */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Telephone Helpline
                    </h4>
                    <a 
                      href={`tel:${config.contactChannels.primaryPhone.replace(/[^0-9]/g, '')}`}
                      className="text-base font-bold text-slate-900 hover:text-amber-600 transition-colors font-mono"
                    >
                      {config.contactChannels.displayPhone}
                    </a>
                  </div>
                </div>

                <a 
                  href={`tel:${config.contactChannels.primaryPhone.replace(/[^0-9]/g, '')}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-300 shadow-2xs"
                >
                  <Phone size={12} />
                  <span>Call Now</span>
                </a>
              </div>

              {/* 3. Official Email Desks */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Mail size={15} className="text-amber-600" />
                  <span>Official Email Desks</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <a 
                    href={buildMailtoLink("Inquiry During Maintenance - Techtural BuiltIn", "Dear Techtural BuiltIn Team,\n\nI am contacting you regarding a project inquiry during your maintenance period:\n\n", PRIMARY_EMAIL)}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 text-slate-700 hover:text-slate-900 transition-all flex items-center justify-between shadow-2xs group"
                  >
                    <span className="font-mono truncate">{config.contactChannels.primaryEmail}</span>
                    <ExternalLink size={12} className="text-slate-400 group-hover:text-slate-700 shrink-0 ml-1" />
                  </a>

                  <a 
                    href={buildMailtoLink("Inquiry During Maintenance - Techtural BuiltIn", "Dear Techtural BuiltIn Team,\n\nI am contacting you regarding a project inquiry during your maintenance period:\n\n", SECONDARY_EMAIL)}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 text-slate-700 hover:text-slate-900 transition-all flex items-center justify-between shadow-2xs group"
                  >
                    <span className="font-mono truncate">{config.contactChannels.secondaryEmail}</span>
                    <ExternalLink size={12} className="text-slate-400 group-hover:text-slate-700 shrink-0 ml-1" />
                  </a>
                </div>
              </div>

              {/* 4. Physical Office & Working Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <MapPin size={14} className="text-amber-600 shrink-0" />
                    <span>Office Address</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    PO Box 1585 | PORT MORESBY | National Capital District 121, Papua New Guinea
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Clock size={14} className="text-amber-600 shrink-0" />
                    <span>Working Hours</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Mon - Fri: 8:00 AM - 5:00 PM (PNG Time)<br />
                    WhatsApp inquiries monitored daily
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Maintenance Inquiry Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                    Direct Intake
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 font-semibold">
                    Priority Queue
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Send Message to Project Desk
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Leave your project details below. Submissions are dispatched directly to our intake team during this maintenance period.
                </p>

                {isSubmitted ? (
                  <div className="my-8 text-center p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                      <CheckCircle2 size={24} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Inquiry Received Successfully!
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Thank you for contacting Techtural BuiltIn. Our project team will review your message and reply via phone or email shortly.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsSubmitted(false)}
                      className="mt-2 rounded-xl text-xs bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="mt-5 space-y-3">
                    {formError && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                        {formError}
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700">Your Full Name *</label>
                      <Input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-10 bg-slate-50/80 border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 rounded-xl focus:bg-white focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700">Phone / WhatsApp</label>
                        <Input
                          type="tel"
                          placeholder="+675 7..."
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="h-10 bg-slate-50/80 border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 rounded-xl focus:bg-white focus:border-amber-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700">Email Address *</label>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="h-10 bg-slate-50/80 border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 rounded-xl focus:bg-white focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700">Project / Scope of Interest</label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full h-10 px-3 bg-slate-50/80 border border-slate-300 text-xs text-slate-900 rounded-xl focus:outline-hidden focus:bg-white focus:border-amber-500"
                      >
                        <option value="Residential Kit Homes (Models 01-20)">Residential Kit Homes (Models #01 - #20)</option>
                        <option value="Full Turn-Key Building Construction">Full Turn-Key Building Construction</option>
                        <option value="Certified Architectural Blueprints">Certified Architectural Blueprints</option>
                        <option value="BOQ & BOM Quantity Surveying">BOQ &amp; BOM Quantity Surveying</option>
                        <option value="Commercial / Warehouse Project">Commercial / Warehouse Project</option>
                        <option value="Custom Consultation / Other">Custom Consultation / Other</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700">Urgent Message / Site Details *</label>
                      <Textarea
                        rows={3}
                        placeholder="Provide details about your project, land location, or inquiry..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="bg-slate-50/80 border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 rounded-xl focus:bg-white focus:border-amber-500 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <Send size={14} className="mr-1.5" />
                      <span>{isSubmitting ? 'Logging Inquiry...' : 'Submit Priority Inquiry'}</span>
                    </Button>
                  </form>
                )}
              </div>

              {/* Instant WhatsApp Link Fallback */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <a
                  href={buildWhatsAppLink(urgentWhatsAppText, PRIMARY_WHATSAPP_NUMBER)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors"
                >
                  <MessageSquare size={13} className="text-emerald-600" />
                  <span>Send Directly to WhatsApp Desk</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white py-8 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} Techtural BuiltIn – Smart Construction Solutions. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span>Crafted with Care by Launchbyts</span>
            <span>•</span>
            <span>Powered by QuantyPros</span>
            <span>•</span>
            <span className="text-slate-700 font-semibold">100% Papua New Guinea Owned 🇵🇬</span>
          </div>

          {/* Discreet Admin Preview Access Button */}
          <button
            type="button"
            onClick={() => setIsAdminModalOpen(true)}
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            title="Administrator / Team Preview Bypass"
          >
            <Lock size={11} />
            <span>Admin Access</span>
          </button>
        </div>
      </footer>

      {/* Admin Passcode Modal for Site Preview */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Unlock size={16} className="text-amber-600" />
              <span>Admin Preview Bypass</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter authorized administrator passcode to preview the full site while general public remains on the maintenance notice.
            </p>

            <form onSubmit={handleAdminBypassSubmit} className="mt-4 space-y-3">
              {adminError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {adminError}
                </div>
              )}
              <Input
                type="password"
                placeholder="Passcode..."
                value={adminPasscode}
                onChange={(e) => {
                  setAdminPasscode(e.target.value);
                  setAdminError('');
                }}
                className="h-10 bg-slate-50 border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 rounded-xl"
                autoFocus
              />
              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="flex-1 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="flex-1 rounded-xl text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-xs"
                >
                  Unlock Preview
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceNotice;
