import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  RefreshCw, 
  X, 
  MessageSquare, 
  HardHat, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ExternalLink,
  ShieldCheck,
  Building2,
  Filter,
  FileText,
  Printer,
  Copy,
  Check,
  ArrowRight,
  Calculator,
  Send,
  Building,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchPortalInquiries, updatePortalInquiryStatus } from '@/lib/firebase';
import { 
  PRIMARY_WHATSAPP_NUMBER, 
  PRIMARY_EMAIL, 
  DISPLAY_PHONE,
  buildWhatsAppLink, 
  buildMailtoLink 
} from '@/lib/communicationLinks';
import { KIT_HOME_MODELS, KitHomeModel } from '@/data/kitHomesData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PortalInquiriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminName?: string;
}

export const PortalInquiriesModal: React.FC<PortalInquiriesModalProps> = ({ 
  isOpen, 
  onClose,
  adminName = 'Gerea George'
}) => {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'whatsapp' | 'consultation' | 'contact'>('all');
  const [activeTab, setActiveTab] = useState<'inbox' | 'quote' | 'invoice' | 'roadmap'>('inbox');

  // Quick Quote Form State
  const [selectedModelId, setSelectedModelId] = useState<string>('tb-spl1b-m1');
  const [quoteClientName, setQuoteClientName] = useState<string>('');
  const [quoteClientPhone, setQuoteClientPhone] = useState<string>('');
  const [quoteClientEmail, setQuoteClientEmail] = useState<string>('');
  const [quoteLocation, setQuoteLocation] = useState<string>('Port Moresby, NCD');
  const [quoteIsTurnkey, setQuoteIsTurnkey] = useState<boolean>(true);
  const [quoteIncludeSolar, setQuoteIncludeSolar] = useState<boolean>(false);
  const [quoteIncludeRainwater, setQuoteIncludeRainwater] = useState<boolean>(false);
  const [quoteIncludeCyclone, setQuoteIncludeCyclone] = useState<boolean>(false);
  const [quoteCopied, setQuoteCopied] = useState<boolean>(false);

  // Invoice State
  const [invoiceClientName, setInvoiceClientName] = useState<string>('');
  const [invoiceProjectTitle, setInvoiceProjectTitle] = useState<string>('Residential Kit Home Construction');
  const [invoiceMilestone, setInvoiceMilestone] = useState<'m1' | 'm2' | 'm3' | 'm4'>('m1');
  const [invoiceTotalAmount, setInvoiceTotalAmount] = useState<number>(246510);
  const [invoiceCopied, setInvoiceCopied] = useState<boolean>(false);

  const selectedModel = KIT_HOME_MODELS.find(m => m.id === selectedModelId) || KIT_HOME_MODELS[0];

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPortalInquiries();
      setInquiries(data);
    } catch (err) {
      toast.error('Could not load portal inquiries.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle status update
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updatePortalInquiryStatus(id, newStatus);
      setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      toast.success(`Inquiry status updated to ${newStatus.toUpperCase()}`);
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handlePreFillQuote = (inq: any) => {
    if (inq.name) setQuoteClientName(inq.name);
    if (inq.phone) setQuoteClientPhone(inq.phone);
    if (inq.email) setQuoteClientEmail(inq.email);
    if (inq.location) setQuoteLocation(inq.location);

    if (inq.modelCode) {
      const found = KIT_HOME_MODELS.find(m => m.code === inq.modelCode);
      if (found) setSelectedModelId(found.id);
    }
    setActiveTab('quote');
    toast.info(`Pre-filled quote for ${inq.name || 'client'}`);
  };

  const filteredInquiries = inquiries.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'whatsapp') return item.type === 'whatsapp_inquiry';
    if (filter === 'consultation') return item.type === 'project_consultation';
    if (filter === 'contact') return item.type === 'contact_message';
    return true;
  });

  // Calculate Quick Quote
  const calculatedQuotePrice = () => {
    let base = quoteIsTurnkey ? selectedModel.fullTurnKeyPrice : selectedModel.kitMaterialBasePrice;
    if (quoteIncludeSolar && selectedModel.addOns?.solarKitPrice) base += selectedModel.addOns.solarKitPrice;
    if (quoteIncludeRainwater && selectedModel.addOns?.rainwaterSystemPrice) base += selectedModel.addOns.rainwaterSystemPrice;
    if (quoteIncludeCyclone && selectedModel.addOns?.cycloneFoundationUpgradePrice) base += selectedModel.addOns.cycloneFoundationUpgradePrice;
    return base;
  };

  const quoteTotal = calculatedQuotePrice();
  const quoteNumber = `TB-QT-${new Date().getFullYear()}-${selectedModel.code.split('-')[1] || '01'}`;

  const generatedQuoteText = `*OFFICIAL QUOTATION — TECHTURAL BUILTIN PNG*
*Quote Ref:* ${quoteNumber}
*Date:* ${new Date().toLocaleDateString('en-GB')} (Valid for 30 days)
*Principal / Managing Director:* Gerea George

*Client:* ${quoteClientName || 'Valued Client'}
*Location:* ${quoteLocation}
*Contact:* ${quoteClientPhone || 'WhatsApp'} ${quoteClientEmail ? `| ${quoteClientEmail}` : ''}

*Proposed Kit Home Model:* ${selectedModel.name} (${selectedModel.code})
*Specs:* ${selectedModel.bedrooms} Bedrooms | ${selectedModel.bathrooms} Bath | ${selectedModel.buildingAreaSqm} m² Floor Area
*Structure:* Engineered C-Section Galvanized Steel Frame with Cyclone Tie-Downs

*Scope of Deliverables:*
• Scope Tier: ${quoteIsTurnkey ? 'Full Turnkey Construction & Installation' : 'Kit Materials & Prefabricated Framing Pack'}
${quoteIncludeSolar ? `• Solar Energy Package (+PGK ${selectedModel.addOns?.solarKitPrice?.toLocaleString()})\n` : ''}${quoteIncludeRainwater ? `• Rainwater Harvesting & Tank System (+PGK ${selectedModel.addOns?.rainwaterSystemPrice?.toLocaleString()})\n` : ''}${quoteIncludeCyclone ? `• Cyclone Foundation Upgrade (+PGK ${selectedModel.addOns?.cycloneFoundationUpgradePrice?.toLocaleString()})\n` : ''}
*TOTAL ESTIMATED INVESTMENT:* PGK ${quoteTotal.toLocaleString()}

*Official Bank Account for Deposits:*
Bank: Bank South Pacific (BSP) / Kina Bank
Account Name: Techtural BuiltIn
Reference: ${quoteNumber}

*Authorized by:* Gerea George
Managing Director & Principal | Techtural BuiltIn PNG
Phone / WhatsApp: +675 8146 4661 | gerea.george@techturalpng.com`;

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(generatedQuoteText);
    setQuoteCopied(true);
    toast.success('Official Quote copied to clipboard! Ready to paste into WhatsApp or Email.');
    setTimeout(() => setQuoteCopied(false), 2500);
  };

  // Milestone invoice calculation
  const milestoneRates = {
    m1: { percent: 30, label: 'Milestone 1 (30%): Mobilization, Site Survey & Architectural Blueprint Approvals' },
    m2: { percent: 40, label: 'Milestone 2 (40%): C-Section Steel Frame & Roof Truss Fabrication Delivery to Site' },
    m3: { percent: 20, label: 'Milestone 3 (20%): Lock-Up, Roofing, External Cladding & Wet Area Rough-In' },
    m4: { percent: 10, label: 'Milestone 4 (10%): Practical Completion, Quality Sign-Off & Official Handover' },
  };

  const activeMilestoneInfo = milestoneRates[invoiceMilestone];
  const milestoneAmount = Math.round((invoiceTotalAmount * activeMilestoneInfo.percent) / 100);
  const invoiceNumber = `TB-INV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

  const generatedInvoiceText = `*PROFORMA TAX INVOICE / PROGRESS CLAIM*
*Invoice No:* ${invoiceNumber}
*Date:* ${new Date().toLocaleDateString('en-GB')}
*Due Date:* 14 Days from issuance

*Billed To:* ${invoiceClientName || 'Project Client'}
*Project:* ${invoiceProjectTitle}

*Claim Details:*
${activeMilestoneInfo.label}
• Total Contract Value: PGK ${invoiceTotalAmount.toLocaleString()}
• Milestone Proportion: ${activeMilestoneInfo.percent}%
*AMOUNT DUE THIS CLAIM:* PGK ${milestoneAmount.toLocaleString()}

*Payment Details:*
Bank South Pacific (BSP) PNG / Kina Bank
Account Name: Techtural BuiltIn
Account Type: Business Cheque Account
Reference: ${invoiceNumber}

*Authorized Approval:* Gerea George
Managing Director & Principal | Techtural BuiltIn PNG`;

  const handleCopyInvoice = () => {
    navigator.clipboard.writeText(generatedInvoiceText);
    setInvoiceCopied(true);
    toast.success('Invoice text copied to clipboard!');
    setTimeout(() => setInvoiceCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl max-h-[92vh] rounded-3xl bg-background border border-border shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-border bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center shadow-inner shrink-0">
              <Building2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Admin &amp; Engineering Desk
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold border border-emerald-500/30">
                  {adminName} • ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Central backend for reviewing live inquiries, generating quick quotes, and issuing milestone progress claims.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={isLoading}
              className="rounded-xl h-9 text-xs gap-1.5 bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <RefreshCw size={13} className={cn(isLoading && "animate-spin")} />
              <span>Refresh</span>
            </Button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-border bg-muted/40 flex items-center justify-between overflow-x-auto gap-4">
          <div className="flex items-center gap-2 sm:gap-6 shrink-0">
            <button
              onClick={() => setActiveTab('inbox')}
              className={cn(
                "py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5",
                activeTab === 'inbox' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Inbox size={15} />
              <span>Inquiries Feed ({inquiries.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('quote')}
              className={cn(
                "py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5",
                activeTab === 'quote' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Calculator size={15} />
              <span>Quick Quote System</span>
            </button>
            <button
              onClick={() => setActiveTab('invoice')}
              className={cn(
                "py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5",
                activeTab === 'invoice' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <FileText size={15} />
              <span>Proforma Invoicing</span>
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={cn(
                "py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5",
                activeTab === 'roadmap' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <ShieldCheck size={15} />
              <span>Backend Architecture Ideas</span>
            </button>
          </div>

          {activeTab === 'inbox' && (
            <div className="hidden md:flex items-center gap-1.5 shrink-0 py-2">
              <span className="text-[11px] font-semibold text-muted-foreground mr-1">Filter:</span>
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  filter === 'all' ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                All
              </button>
              <button
                onClick={() => setFilter('whatsapp')}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  filter === 'whatsapp' ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                WhatsApp Leads
              </button>
              <button
                onClick={() => setFilter('consultation')}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  filter === 'consultation' ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                Project Requests
              </button>
              <button
                onClick={() => setFilter('contact')}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  filter === 'contact' ? "bg-slate-700 text-white" : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                Contact Msgs
              </button>
            </div>
          )}
        </div>

        {/* Tab 1: Inquiries Feed */}
        {activeTab === 'inbox' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {filteredInquiries.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                  <Inbox size={28} />
                </div>
                <h4 className="font-bold text-base text-foreground">No Inquiries Found</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                  Inquiries submitted through the contact form, project requests, or WhatsApp triggers are captured here automatically.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {filteredInquiries.map((inq) => {
                  const isWhatsApp = inq.type === 'whatsapp_inquiry';
                  const isConsultation = inq.type === 'project_consultation';

                  return (
                    <div 
                      key={inq.id}
                      className="p-4 sm:p-5 rounded-2xl border border-border bg-card/60 hover:bg-card hover:border-primary/40 transition-all shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {isWhatsApp ? (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                              <MessageSquare size={12} />
                              <span>WhatsApp Lead</span>
                            </span>
                          ) : isConsultation ? (
                            <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold border border-blue-500/30 flex items-center gap-1">
                              <HardHat size={12} />
                              <span>Project Consultation</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg bg-slate-500/15 text-slate-600 dark:text-slate-400 font-mono text-xs font-bold border border-slate-500/30 flex items-center gap-1">
                              <Mail size={12} />
                              <span>Contact Message</span>
                            </span>
                          )}

                          <span className="text-xs font-bold text-foreground">
                            {inq.name || 'Anonymous Client'}
                          </span>

                          {inq.location && (
                            <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                              <MapPin size={11} />
                              <span>{inq.location}</span>
                            </span>
                          )}
                        </div>

                        {/* Status Switcher */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">Status:</span>
                          <select
                            value={inq.status || 'new'}
                            onChange={(e) => handleUpdateStatus(inq.id, e.target.value)}
                            className="text-xs font-bold px-2.5 py-1 rounded-lg border border-border bg-background focus:border-primary outline-none cursor-pointer"
                          >
                            <option value="new">🟡 New</option>
                            <option value="reviewed">🔵 Reviewed</option>
                            <option value="quoted">🟣 Quoted</option>
                            <option value="contacted">🟢 Contacted</option>
                            <option value="archived">⚪ Archived</option>
                          </select>
                          <span className="text-[11px] text-muted-foreground ml-2">
                            {new Date(inq.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(inq.receivedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="space-y-1.5 text-xs text-foreground/90">
                        {inq.subject && (
                          <div className="font-semibold text-primary">
                            {inq.subject}
                          </div>
                        )}
                        <p className="bg-muted/40 p-3 rounded-xl border border-border/40 font-mono text-[11px] whitespace-pre-wrap leading-relaxed text-muted-foreground">
                          {inq.message}
                        </p>

                        {inq.budget && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                            <DollarSign size={13} />
                            <span>Estimated / Budget Range: {inq.budget}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {inq.phone && (
                            <span className="flex items-center gap-1 font-mono font-medium">
                              <Phone size={12} className="text-primary" />
                              <span>{inq.phone}</span>
                            </span>
                          )}
                          {inq.email && (
                            <span className="flex items-center gap-1 font-mono">
                              <Mail size={12} className="text-primary" />
                              <span>{inq.email}</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePreFillQuote(inq)}
                            className="rounded-xl h-8 px-2.5 text-xs font-bold gap-1 border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
                          >
                            <Calculator size={12} />
                            <span>Create Quote</span>
                          </Button>

                          {inq.phone && (
                            <a
                              href={buildWhatsAppLink(
                                `Halo ${inq.name || 'there'}, this is Gerea George from Techtural BuiltIn following up on your inquiry regarding: "${inq.subject || 'construction services'}". How can we assist with your project?`,
                                inq.phone
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                            >
                              <MessageSquare size={12} />
                              <span>Reply via WhatsApp</span>
                            </a>
                          )}

                          {inq.email && (
                            <a
                              href={buildMailtoLink(
                                `Techtural BuiltIn Response: ${inq.subject || 'Project Inquiry'}`,
                                `Dear ${inq.name},\n\nThank you for reaching out to Techtural BuiltIn PNG. We have received your inquiry and would be pleased to assist with your construction drawings, kit home, or structural requirements.\n\nWarm regards,\nGerea George\nManaging Director & Principal\nTechtural BuiltIn PNG`,
                                inq.email
                              )}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold transition-colors"
                            >
                              <Mail size={12} />
                              <span>Email</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Quick Quote System */}
        {activeTab === 'quote' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Calculator size={15} className="text-primary" />
                  <span>Configure Official Quotation</span>
                </h4>
                <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  Ref: {quoteNumber}
                </span>
              </div>

              {/* Model Select */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Select Kit Home Model</Label>
                <select
                  value={selectedModelId}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-border bg-background text-xs font-semibold focus:border-primary outline-none"
                >
                  {KIT_HOME_MODELS.map(m => (
                    <option key={m.id} value={m.id}>
                      #{String(m.officialNumber).padStart(2, '0')} {m.code} — {m.name} ({m.bedrooms} Bed, {m.buildingAreaSqm} m²)
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <Label className="text-xs">Client Name</Label>
                  <Input 
                    value={quoteClientName} 
                    onChange={e => setQuoteClientName(e.target.value)}
                    placeholder="e.g. John Kuman" 
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Client Phone / WhatsApp</Label>
                  <Input 
                    value={quoteClientPhone} 
                    onChange={e => setQuoteClientPhone(e.target.value)}
                    placeholder="+675 7..." 
                    className="h-10 text-xs rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <Label className="text-xs">Client Email</Label>
                  <Input 
                    value={quoteClientEmail} 
                    onChange={e => setQuoteClientEmail(e.target.value)}
                    placeholder="client@gmail.com" 
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Site / Allotment Location</Label>
                  <Input 
                    value={quoteLocation} 
                    onChange={e => setQuoteLocation(e.target.value)}
                    placeholder="e.g. Waigani, Port Moresby" 
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
              </div>

              {/* Scope Toggles */}
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2.5 text-xs">
                <span className="font-bold text-foreground block">Scope &amp; Turnkey Package:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setQuoteIsTurnkey(true)}
                    className={cn(
                      "p-2.5 rounded-xl border text-left cursor-pointer transition-all",
                      quoteIsTurnkey 
                        ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs" 
                        : "bg-background border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="font-bold text-xs">Full Turnkey</div>
                    <div className="text-[10px] opacity-80">PGK {selectedModel.fullTurnKeyPrice.toLocaleString()}</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuoteIsTurnkey(false)}
                    className={cn(
                      "p-2.5 rounded-xl border text-left cursor-pointer transition-all",
                      !quoteIsTurnkey 
                        ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs" 
                        : "bg-background border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="font-bold text-xs">Kit Materials Only</div>
                    <div className="text-[10px] opacity-80">PGK {selectedModel.kitMaterialBasePrice.toLocaleString()}</div>
                  </button>
                </div>

                <div className="pt-2 space-y-1.5 border-t border-border/60">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={quoteIncludeSolar} 
                      onChange={e => setQuoteIncludeSolar(e.target.checked)}
                      className="rounded" 
                    />
                    <span>Add Solar Power Off-Grid Package (+PGK {selectedModel.addOns?.solarKitPrice?.toLocaleString()})</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={quoteIncludeRainwater} 
                      onChange={e => setQuoteIncludeRainwater(e.target.checked)}
                      className="rounded" 
                    />
                    <span>Add Rainwater Harvesting System (+PGK {selectedModel.addOns?.rainwaterSystemPrice?.toLocaleString()})</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={quoteIncludeCyclone} 
                      onChange={e => setQuoteIncludeCyclone(e.target.checked)}
                      className="rounded" 
                    />
                    <span>Add Cyclone Engineering Tie-Down Foundation (+PGK {selectedModel.addOns?.cycloneFoundationUpgradePrice?.toLocaleString()})</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Live Quote Preview */}
            <div className="flex flex-col rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h5 className="font-extrabold text-sm text-foreground">Official Quotation Preview</h5>
                    <span className="text-[10px] text-muted-foreground font-mono">Techtural BuiltIn PNG Letterhead</span>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    PGK {quoteTotal.toLocaleString()}
                  </Badge>
                </div>

                <pre className="mt-3 p-3.5 rounded-xl bg-muted/60 border border-border/60 font-mono text-[11px] text-foreground/90 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                  {generatedQuoteText}
                </pre>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border mt-4">
                <Button
                  onClick={handleCopyQuote}
                  className="flex-1 rounded-xl h-11 text-xs font-bold gap-2 cursor-pointer shadow-md"
                >
                  {quoteCopied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{quoteCopied ? 'Copied to Clipboard!' : 'Copy Quote for WhatsApp'}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="rounded-xl h-11 px-4 text-xs font-bold gap-1.5 cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print Quote</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Proforma Invoicing & Milestone Progress Claims */}
        {activeTab === 'invoice' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <FileText size={15} className="text-primary" />
                  <span>Milestone Progress Claim</span>
                </h4>
                <span className="text-xs font-mono font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                  Inv: {invoiceNumber}
                </span>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Client Full Name</Label>
                <Input 
                  value={invoiceClientName} 
                  onChange={e => setInvoiceClientName(e.target.value)}
                  placeholder="e.g. Neil Maino" 
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Project Description</Label>
                <Input 
                  value={invoiceProjectTitle} 
                  onChange={e => setInvoiceProjectTitle(e.target.value)}
                  placeholder="e.g. Model 01 Kit Home Construction - Boroko Allotment" 
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Total Project Contract Sum (PGK)</Label>
                <Input 
                  type="number"
                  value={invoiceTotalAmount} 
                  onChange={e => setInvoiceTotalAmount(Number(e.target.value) || 0)}
                  placeholder="246510" 
                  className="h-10 text-xs rounded-xl font-mono font-bold"
                />
              </div>

              {/* Milestone Selector */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Select Claim Milestone</Label>
                <div className="grid grid-cols-1 gap-2">
                  {(['m1', 'm2', 'm3', 'm4'] as const).map((key) => {
                    const item = milestoneRates[key];
                    const isSelected = invoiceMilestone === key;
                    const calculated = Math.round((invoiceTotalAmount * item.percent) / 100);

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setInvoiceMilestone(key)}
                        className={cn(
                          "p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between",
                          isSelected 
                            ? "bg-primary/10 border-primary text-foreground shadow-xs font-semibold" 
                            : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <div>
                          <div className="font-bold text-xs">{item.label}</div>
                          <div className="text-[11px] opacity-75 font-mono">Claim Amount: PGK {calculated.toLocaleString()}</div>
                        </div>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-background border">
                          {item.percent}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Invoice Preview */}
            <div className="flex flex-col rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h5 className="font-extrabold text-sm text-foreground">Proforma Invoice Preview</h5>
                    <span className="text-[10px] text-muted-foreground font-mono">Techtural BuiltIn Official Claim</span>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    Due: PGK {milestoneAmount.toLocaleString()}
                  </Badge>
                </div>

                <pre className="mt-3 p-3.5 rounded-xl bg-muted/60 border border-border/60 font-mono text-[11px] text-foreground/90 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                  {generatedInvoiceText}
                </pre>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border mt-4">
                <Button
                  onClick={handleCopyInvoice}
                  className="flex-1 rounded-xl h-11 text-xs font-bold gap-2 cursor-pointer shadow-md"
                >
                  {invoiceCopied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{invoiceCopied ? 'Copied to Clipboard!' : 'Copy Invoice for WhatsApp'}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="rounded-xl h-11 px-4 text-xs font-bold gap-1.5 cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print Invoice</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Backend Roadmap & Ideas Guide */}
        {activeTab === 'roadmap' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div>
              <h4 className="text-base font-bold text-foreground">
                Techtural BuiltIn Backend Architecture Roadmap
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Recommended systems to scale construction operations, quote pipelines, and client project delivery in Papua New Guinea.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="p-4 rounded-2xl border border-border bg-card/60 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <MessageSquare size={18} />
                </div>
                <h5 className="font-bold text-sm text-foreground">1. WhatsApp 2-Way Bot &amp; Webhook Synchronization</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Connect Twilio or WhatsApp Business Cloud API to receive incoming messages directly back into Firestore, alerting Gerea George via SMS or push notification whenever a customer requests a quote.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-4 rounded-2xl border border-border bg-card/60 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Calculator size={18} />
                </div>
                <h5 className="font-bold text-sm text-foreground">2. Automated Bill of Quantities (BOQ) Generator</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Automatically calculate linear meters of C-section framing, screws, anchor bolts, and sheet counts for any model so Gerea George can send precise material procurement orders to hardware suppliers.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-4 rounded-2xl border border-border bg-card/60 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Building size={18} />
                </div>
                <h5 className="font-bold text-sm text-foreground">3. Client Construction Milestone Tracker</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Provide homeowners with a private tracking link where Gerea George's engineering crew uploads site progress photos from Boroko, Waigani, or Lae, tracking completion against milestone invoices.
                </p>
              </div>

              {/* Card 4 */}
              <div className="p-4 rounded-2xl border border-border bg-card/60 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <FileText size={18} />
                </div>
                <h5 className="font-bold text-sm text-foreground">4. Contract &amp; PNG Building Board Documentation</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Auto-generate standard PNG Master Builders Association contracts and Department of Works structural compliance certificates stamped with Gerea George's engineering approval.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Connected to Techtural Backend Desk • Authorized Session: {adminName}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="rounded-xl h-8 px-4 text-xs font-semibold"
          >
            Close Desk
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PortalInquiriesModal;
