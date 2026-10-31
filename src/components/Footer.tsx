import { useState } from 'react';
import { Facebook, Twitter, Linkedin, Instagram, MessageSquare, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import PWAInstallButton from '@/components/PWAInstallButton';
import PortalInquiriesModal from '@/components/PortalInquiriesModal';
import { PRIMARY_WHATSAPP_NUMBER, DISPLAY_WHATSAPP, DISPLAY_PHONE, buildWhatsAppLink, buildMailtoLink, PRIMARY_EMAIL, SECONDARY_EMAIL } from '@/lib/communicationLinks';

export default function Footer() {
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1">
            <div className="flex flex-col gap-4 mb-6">
              <Link to="/" className="flex items-center">
                <img 
                  src="https://pub-d244eff0ad524eccbaae907a70af6b3d.r2.dev/techtural-builtin/techtural_logo_transparent.png" 
                  alt="Techtural Logo" 
                  className="h-20 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </Link>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-primary tracking-[0.2em] uppercase leading-tight">
                  Driven by Design
                </span>
                <span className="text-[11px] font-medium text-muted-foreground tracking-[0.1em] uppercase">
                  Defined by Technology
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              A modern, tech-enabled building design and project management company delivering integrated solutions in PNG.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-sm">Services &amp; Solutions</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/services" className="text-foreground font-semibold hover:text-primary transition-colors">Services Overview</Link></li>
              <li><Link to="/products" className="text-muted-foreground hover:text-primary transition-colors font-medium">Design &amp; Construction Module (45)</Link></li>
              <li><Link to="/products?tab=residential-kit-homes" className="text-muted-foreground hover:text-primary transition-colors pl-2 text-xs">&bull; Residential Kit Homes (20)</Link></li>
              <li><Link to="/products?tab=tiny-homes" className="text-muted-foreground hover:text-primary transition-colors pl-2 text-xs">&bull; Tiny Home Concepts <span className="text-[10px] text-amber-500 font-semibold">(Coming Soon)</span></Link></li>
              <li><Link to="/products?tab=container-homes" className="text-muted-foreground hover:text-primary transition-colors pl-2 text-xs">&bull; Container Home Solutions <span className="text-[10px] text-amber-500 font-semibold">(Coming Soon)</span></Link></li>
              <li><Link to="/products?tab=garden-pergolas" className="text-muted-foreground hover:text-primary transition-colors pl-2 text-xs">&bull; Garden Pergola Systems (6)</Link></li>
              <li><Link to="/products?tab=commercial-designs" className="text-muted-foreground hover:text-primary transition-colors pl-2 text-xs">&bull; Commercial Designs <span className="text-[10px] text-amber-500 font-semibold">(Coming Soon)</span></Link></li>
              <li><Link to="/products?tab=commercial-warehouses" className="text-muted-foreground hover:text-primary transition-colors pl-2 text-xs">&bull; Commercial Warehouses <span className="text-[10px] text-amber-500 font-semibold">(Coming Soon)</span></Link></li>
              <li><Link to="/services#project-management" className="text-muted-foreground hover:text-primary transition-colors">Project Management</Link></li>
              <li><Link to="/services#quantity-surveying" className="text-muted-foreground hover:text-primary transition-colors">Quantity Surveying &amp; Commercial</Link></li>
              <li><Link to="/services#safety-compliance" className="text-muted-foreground hover:text-primary transition-colors">Safety &amp; Compliance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-sm">Contact Us</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex flex-col">
                <span className="font-bold text-foreground mb-1">Address:</span>
                PO Box 1585 | PORT MORESBY | National Capital District 121
              </li>
              <li className="flex flex-col">
                <span className="font-bold text-foreground mb-1">Phone &amp; WhatsApp:</span>
                <span className="text-xs text-muted-foreground">WhatsApp: <strong className="text-foreground">{DISPLAY_WHATSAPP}</strong></span>
                <span className="text-xs text-muted-foreground">Phone: {DISPLAY_PHONE}</span>
                <a
                  href={buildWhatsAppLink("Hi Techtural BuiltIn, I would like to inquire about your smart construction and architectural services.", PRIMARY_WHATSAPP_NUMBER)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline mt-1.5"
                >
                  <MessageSquare size={13} />
                  <span>Chat on WhatsApp ({DISPLAY_WHATSAPP})</span>
                </a>
              </li>
              <li className="flex flex-col">
                <span className="font-bold text-foreground mb-1">Email:</span>
                <a href={buildMailtoLink("General Inquiry - Techtural BuiltIn", "", PRIMARY_EMAIL)} className="hover:text-primary transition-colors">
                  techtural782@gmail.com
                </a>
                <a href={buildMailtoLink("General Inquiry - Techtural BuiltIn", "", SECONDARY_EMAIL)} className="hover:text-primary transition-colors">
                  gerea.george@techturalpng.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-sm">Legal &amp; App</h4>
            <ul className="space-y-4 mb-6">
              <li><Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-use" className="text-muted-foreground hover:text-primary transition-colors">Terms of Use</Link></li>
              <li><Link to="/cookie-policy" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsPortalModalOpen(true)}
                  className="text-primary hover:underline font-semibold flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Inbox size={13} />
                  <span>Portal Desk &amp; Inquiries</span>
                </button>
              </li>
            </ul>
            <div className="pt-2">
              <PWAInstallButton variant="footer" />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col lg:flex-row justify-between items-center gap-4 text-xs md:text-sm text-muted-foreground">
          <p className="text-center lg:text-left">
            © {new Date().getFullYear()} Techtural BuiltIn – Smart Construction Solutions. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1">
              Crafted with Care by{' '}
              <a
                href="https://launchbyts.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                Launchbyts
              </a>
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="inline-flex items-center gap-1">
              Powered by{' '}
              <a
                href="https://quantypros.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                QuantyPros
              </a>
            </span>
          </div>

          <p className="text-xs md:text-sm text-center lg:text-right">
            100% Papua New Guinea Owned 🇵🇬
          </p>
        </div>
      </div>

      <PortalInquiriesModal
        isOpen={isPortalModalOpen}
        onClose={() => setIsPortalModalOpen(false)}
      />
    </footer>
  );
}
