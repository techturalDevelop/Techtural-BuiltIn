import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  MessageSquare, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Layers, 
  Calendar, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { KitHomeModel, PACKAGE_TIERS_INFO } from '@/data/kitHomesData';
import { 
  buildWhatsAppLink, 
  formatScopeOfWorksInquiryWhatsAppMessage, 
  buildMailtoLink,
  PRIMARY_EMAIL, 
  SECONDARY_EMAIL,
  DISPLAY_WHATSAPP, 
  DISPLAY_PHONE,
  PRIMARY_WHATSAPP_NUMBER 
} from '@/lib/communicationLinks';

interface KitHomeScopeOfWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: KitHomeModel | null;
  initialPackageTier?: string;
}

export function KitHomeScopeOfWorksModal({
  isOpen,
  onClose,
  model,
  initialPackageTier = 'Full Turn-Key Building Construction'
}: KitHomeScopeOfWorksModalProps) {
  const [selectedTier, setSelectedTier] = useState<string>(initialPackageTier);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [plotLocation, setPlotLocation] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !model) return null;

  const currentYear = new Date().getFullYear();
  const documentRefNumber = `TB-SOW-${model.code}-REV${model.officialNumber ? String(model.officialNumber).padStart(2, '0') : 'B'}`;

  // Generate WhatsApp link prefilled with Scope of Works request
  const sowWhatsAppMessage = formatScopeOfWorksInquiryWhatsAppMessage({
    modelName: model.name,
    modelCode: model.code,
    officialNumber: model.officialNumber,
    areaSqm: model.buildingAreaSqm,
    clientName,
    clientPhone,
    clientEmail,
    plotLocation,
    requestedPackageTier: selectedTier
  });
  const whatsappUrl = buildWhatsAppLink(sowWhatsAppMessage, PRIMARY_WHATSAPP_NUMBER);

  // Mailto link for official Scope of Works PDF document dispatch
  const mailSubject = `Official Scope of Works (SOW) PDF Request - ${model.name} (${model.code})`;
  const mailBody = `Dear Techtural BuiltIn Contracts & Technical Team,\n\nI am requesting the complete official Scope of Works (SOW) and Technical Specification PDF Document for:\n• Model: ${model.name} (${model.code})\n• Package: ${selectedTier}\n• Building Area: ${model.buildingAreaSqm} m²\n• Plot Location / Province: ${plotLocation || 'Papua New Guinea'}\n\nClient Contact:\n• Name: ${clientName || 'Prospective Homeowner'}\n• Phone: ${clientPhone || 'Not provided'}\n• Email: ${clientEmail || 'Not provided'}\n\nPlease issue the official signed specification document with technical schedules.\n\nThank you,\n${clientName || 'Client'}`;
  const mailtoUrl = buildMailtoLink(mailSubject, mailBody, PRIMARY_EMAIL);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-mono font-bold tracking-wider">
                {documentRefNumber}
              </span>
              <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                • AS/NZS Structural Standard Specification
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <FileText className="text-primary shrink-0" size={24} />
              <span>Scope of Works (SOW) &amp; Deliverables</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {model.name} ({model.code}) • {model.buildingAreaSqm} m² • {model.typeLabel}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-foreground">
          {/* SOW Overview Notice */}
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" />
                <h4 className="text-sm font-bold text-foreground">
                  Official Techtural BuiltIn Engineering Deliverables
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                Every Techtural Kit Home is backed by certified engineering, itemized material take-offs, and clear construction milestones. Read the itemized scope below, or contact our engineering desk to receive the complete signed PDF package file for this model.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto">
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1.5 shadow-sm">
                  <Download size={14} />
                  Request PDF Document
                </Button>
              </a>
            </div>
          </div>

          {/* Model Specification Snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Area</span>
              <span className="text-base sm:text-lg font-black text-foreground">{model.buildingAreaSqm} m²</span>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Dimensions</span>
              <span className="text-base sm:text-lg font-black text-foreground">{model.dimensions}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Configuration</span>
              <span className="text-base sm:text-lg font-black text-foreground">{model.bedrooms} Bed / {model.bathrooms} Bath</span>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Foundation Type</span>
              <span className="text-base sm:text-lg font-black text-foreground">{model.isHighset ? 'Elevated Steel Piers' : 'Ground Slab / Lowset'}</span>
            </div>
          </div>

          {/* Key Deliverables & Scope Checklist */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Layers size={16} className="text-primary" />
                Comprehensive Scope of Works Breakdown
              </h3>
              <span className="text-xs text-primary font-medium">Standards: AS/NZS 4600 &amp; PNG Building Code</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Section 1: Architectural & Engineering */}
              <div className="p-4 rounded-2xl bg-card border border-border space-y-2.5">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground uppercase">1. Architectural &amp; Engineering</h4>
                    <span className="text-[10px] text-muted-foreground">Certified drawings ready for municipal submission</span>
                  </div>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Complete architectural dimensioned floor plans (1:50 scale)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>North, South, East, West structural elevations &amp; cross-sections</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Structural steel engineering calculations certified to cyclonic wind zones</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Plumbing, drainage &amp; electrical schematic layouts</span>
                  </li>
                </ul>
              </div>

              {/* Section 2: Structural Framing & Subfloor */}
              <div className="p-4 rounded-2xl bg-card border border-border space-y-2.5">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground uppercase">2. Structural Framing &amp; Subfloor</h4>
                    <span className="text-[10px] text-muted-foreground">Termite-proof precision roll-formed steel</span>
                  </div>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>G550 high-tensile galvanized light gauge steel wall frames</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Pre-engineered roof trusses, battens, and bracing system</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{model.isHighset ? 'Galvanized high-durability steel stump columns & subfloor joists' : 'Engineered slab hold-downs & anchor brackets'}</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Pre-punched service holes for rapid electrical conduit &amp; plumbing runs</span>
                  </li>
                </ul>
              </div>

              {/* Section 3: Roof, Envelope & Cladding */}
              <div className="p-4 rounded-2xl bg-card border border-border space-y-2.5">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground uppercase">3. Roof, Envelope &amp; Cladding</h4>
                    <span className="text-[10px] text-muted-foreground">Tropical weather tightness &amp; thermal defense</span>
                  </div>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Colorbond corrugated or trimclad roofing iron sheets (0.42 BMT)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Double-sided thermal reflective foil sarking with R2.5 ceiling blanket</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Weather-resistant architectural exterior cladding boards</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Gutters, downpipes, barge caps, flashing, and cyclonic fastener screws</span>
                  </li>
                </ul>
              </div>

              {/* Section 4: Fitouts, Windows & Milestone Handover */}
              <div className="p-4 rounded-2xl bg-card border border-border space-y-2.5">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xs">
                    04
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground uppercase">4. Windows, Doors &amp; Finishes</h4>
                    <span className="text-[10px] text-muted-foreground">Turnkey &amp; fitout supply standards</span>
                  </div>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Heavy-duty powder-coated aluminum sliding windows with insect screens</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Solid core external entry door with deadbolt security hardware</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Optional interior cabinetry fitout (Island Kitchens &amp; Bedroom Wardrobes)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Itemized Bill of Quantities (BOQ) &amp; Bill of Materials (BOM) schedule</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Download & Dispatch Request Form Section */}
          <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles size={15} className="text-primary" />
                  Request Official Signed Scope of Works PDF
                </h4>
                <p className="text-xs text-muted-foreground">
                  Fill in your details below for immediate dispatch to your email or WhatsApp:
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock size={13} className="text-emerald-600" />
                <span>Immediate digital dispatch</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">Your Full Name</label>
                <Input
                  placeholder="e.g. Samuel Kopi"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="rounded-xl h-10 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">Phone / WhatsApp Number</label>
                <Input
                  placeholder="e.g. +675 7061 9746"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="rounded-xl h-10 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">Email Address</label>
                <Input
                  placeholder="e.g. samuel@example.com"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="rounded-xl h-10 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">Building Plot Location / Province</label>
                <Input
                  placeholder="e.g. Port Moresby, Morobe, Kokopo"
                  value={plotLocation}
                  onChange={(e) => setPlotLocation(e.target.value)}
                  className="rounded-xl h-10 text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex-1 sm:flex-initial"
              >
                <Button className="w-full sm:w-auto rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-2 h-11 px-5 shadow-sm">
                  <MessageSquare size={15} />
                  <span>Request PDF via WhatsApp ({DISPLAY_WHATSAPP})</span>
                </Button>
              </a>

              <a 
                href={mailtoUrl} 
                className="flex-1 sm:flex-initial"
              >
                <Button variant="outline" className="w-full sm:w-auto rounded-xl border-border text-xs font-bold gap-2 h-11 px-5">
                  <Mail size={15} className="text-primary" />
                  <span>Email Techtural BuiltIn</span>
                </Button>
              </a>
            </div>
          </div>

          {/* Contact Techtural BuiltIn Footer Info */}
          <div className="p-4 rounded-xl bg-slate-900 text-slate-300 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="font-bold text-white block">Techtural BuiltIn Contracts &amp; Technical Support</span>
              <span className="text-[11px] text-slate-400">Section 38, Lot 14, Waigani Commercial Centre, Port Moresby, PNG</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <span>Direct: <strong className="text-white">{DISPLAY_PHONE}</strong></span>
              <span>Email: <strong className="text-white">{PRIMARY_EMAIL}</strong></span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Document ID: {documentRefNumber} • Updated {currentYear}
          </span>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="rounded-xl text-xs font-semibold px-4"
          >
            Close Scope Window
          </Button>
        </div>
      </div>
    </div>
  );
}
