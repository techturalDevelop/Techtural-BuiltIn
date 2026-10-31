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
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchPortalInquiries } from '@/lib/firebase';
import { 
  PRIMARY_WHATSAPP_NUMBER, 
  PRIMARY_EMAIL, 
  buildWhatsAppLink, 
  buildMailtoLink 
} from '@/lib/communicationLinks';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PortalInquiriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortalInquiriesModal: React.FC<PortalInquiriesModalProps> = ({ isOpen, onClose }) => {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'consultation' | 'contact'>('all');
  const [activeTab, setActiveTab] = useState<'inbox' | 'workflow'>('inbox');

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

  const filteredInquiries = inquiries.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'consultation') return item.type === 'project_consultation';
    if (filter === 'contact') return item.type === 'contact_message';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-background border border-border shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Inbox size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">
                  Portal Desk &amp; Inquiries Tracker
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
                  Live Dispatch
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Overview of client consultation requests and contact messages submitted via portal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={isLoading}
              className="rounded-xl h-9 text-xs gap-1.5"
            >
              <RefreshCw size={13} className={cn(isLoading && "animate-spin")} />
              <span>Refresh</span>
            </Button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-border bg-background flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
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
              <span>Received Inquiries ({inquiries.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('workflow')}
              className={cn(
                "py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5",
                activeTab === 'workflow' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <ShieldCheck size={15} />
              <span>How Submission Features Work</span>
            </button>
          </div>

          {activeTab === 'inbox' && (
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground mr-1">Filter:</span>
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                  filter === 'all' ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                All
              </button>
              <button
                onClick={() => setFilter('consultation')}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                  filter === 'consultation' ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                Consultations
              </button>
              <button
                onClick={() => setFilter('contact')}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                  filter === 'contact' ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                Messages
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {activeTab === 'workflow' ? (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building2 size={16} className="text-primary" />
                  Dual-Pipeline Architecture: How Customer Requests Are Processed
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Techtural BuiltIn provides an integrated, resilient intake architecture ensuring no client inquiry is ever dropped, even across varying PNG network connections:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Client Submission
                  </h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Clients submit either through <strong>"Send Message (Portal Inbox)"</strong> on the Contact Form or the 4-step <strong>"Get Consultation"</strong> project discovery wizard.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Database &amp; Server Logging
                  </h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Submissions are authenticated and stored in Firebase Firestore (<code>projectRequests</code> and <code>contactMessages</code>), with synchronized logging to the Express dispatch API.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Direct Channel Escalation
                  </h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Every form includes immediate 1-click fallback buttons to forward the structured brief directly to Techtural's WhatsApp desk or corporate email.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Direct Contact Desk Channels
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-background border border-border">
                    <MessageSquare size={16} className="text-emerald-500" />
                    <div>
                      <div className="font-semibold text-foreground">Official WhatsApp Desk</div>
                      <div className="text-muted-foreground font-mono">+675 7061 9746 / +675 7380 9706</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-background border border-border">
                    <Mail size={16} className="text-blue-500" />
                    <div>
                      <div className="font-semibold text-foreground">Corporate Email</div>
                      <div className="text-muted-foreground font-mono">techtural782@gmail.com</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {filteredInquiries.length === 0 ? (
                <div className="text-center py-16 bg-muted/20 rounded-2xl border border-dashed border-border">
                  <Inbox className="mx-auto text-muted-foreground mb-3" size={40} />
                  <h4 className="text-sm font-bold text-foreground">No inquiries found</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try switching filters or submit a new test message from the Contact form.
                  </p>
                </div>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <div 
                    key={inquiry.id}
                    className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-2.5">
                      <div className="flex items-center gap-2">
                        {inquiry.type === 'project_consultation' ? (
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase font-bold">
                            <HardHat size={11} className="mr-1" /> Consultation Request
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px] uppercase font-bold">
                            <MessageSquare size={11} className="mr-1" /> Portal Message
                          </Badge>
                        )}
                        <span className="text-xs font-mono text-muted-foreground">ID: {inquiry.id}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Clock size={12} />
                        <span>{new Date(inquiry.receivedAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-muted-foreground font-medium block text-[11px]">Client Name:</span>
                        <span className="font-bold text-foreground text-sm">{inquiry.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-medium block text-[11px]">Email &amp; Phone:</span>
                        <div className="font-medium text-foreground">
                          <a href={`mailto:${inquiry.email}`} className="text-primary hover:underline">{inquiry.email}</a>
                          {inquiry.phone && inquiry.phone !== 'Not provided' && (
                            <span className="text-muted-foreground ml-2">({inquiry.phone})</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {inquiry.type === 'project_consultation' ? (
                      <div className="p-3 rounded-xl bg-muted/40 border border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase font-bold">Type</span>
                          <span className="font-semibold text-foreground capitalize">{inquiry.projectType}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase font-bold">Service</span>
                          <span className="font-semibold text-foreground">{inquiry.service}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase font-bold">Location</span>
                          <span className="font-semibold text-foreground">{inquiry.location}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase font-bold">Budget</span>
                          <span className="font-semibold text-primary">{inquiry.budget}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1">
                        <div className="font-bold text-foreground">Subject: {inquiry.subject}</div>
                        <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{inquiry.message}</p>
                      </div>
                    )}

                    {/* Action row */}
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-border/40">
                      <a
                        href={buildWhatsAppLink(
                          `Hi ${inquiry.name}, thank you for contacting Techtural BuiltIn regarding your ${inquiry.type === 'project_consultation' ? 'consultation request' : 'inquiry'}. How can we assist you with your project?`,
                          inquiry.phone && inquiry.phone.replace(/[^0-9]/g, '').length >= 8 ? inquiry.phone : PRIMARY_WHATSAPP_NUMBER
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                      >
                        <MessageSquare size={13} />
                        <span>Reply on WhatsApp</span>
                      </a>
                      <a
                        href={buildMailtoLink(
                          `Re: Techtural BuiltIn - ${inquiry.type === 'project_consultation' ? 'Project Consultation' : inquiry.subject || 'Inquiry'}`,
                          `Dear ${inquiry.name},\n\nThank you for reaching out to Techtural BuiltIn. We have reviewed your submission:\n\n`,
                          inquiry.email
                        )}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground border border-border text-xs font-semibold transition-colors"
                      >
                        <Mail size={13} />
                        <span>Reply via Email</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
          <span>Connected to Firestore database: <code className="font-mono text-primary">ai-studio-d0738c41-5d62-4df7-b251-b76e18bf36df</code></span>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PortalInquiriesModal;
