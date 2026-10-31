import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Cpu, 
  LogIn, 
  LogOut, 
  User, 
  Home, 
  Box, 
  Sun, 
  Building2, 
  Warehouse, 
  Sparkles,
  Package,
  Layers,
  ClipboardCheck,
  Calculator,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ProjectDiscoveryModal from './ProjectDiscoveryModal';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { auth, signInWithGoogle, logout } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { toast } from 'sonner';
import PWAInstallButton from '@/components/PWAInstallButton';

import { Link, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

const designConstructionLinks = [
  {
    name: 'Residential Kit Homes',
    href: '/products?tab=residential-kit-homes',
    badge: '20 Models',
    description: '20 pre-engineered 1 to 4 bedroom modular homes (#01 - #20) with turnkey & blueprint pricing',
    icon: Home,
    color: 'text-amber-500 bg-amber-500/10'
  },
  {
    name: 'Tiny Home Concepts',
    href: '/products?tab=tiny-homes',
    badge: 'Coming Soon',
    description: 'Micro-pods & eco-living concepts — complete costings & drawings coming soon',
    icon: Box,
    color: 'text-indigo-500 bg-indigo-500/10'
  },
  {
    name: 'Container Home Solutions',
    href: '/products?tab=container-homes',
    badge: 'Coming Soon',
    description: 'High-Cube container living concepts — complete costings & drawings coming soon',
    icon: Package,
    color: 'text-cyan-500 bg-cyan-500/10'
  },
  {
    name: 'Garden Pergola Systems',
    href: '/products?tab=garden-pergolas',
    badge: '6 Systems',
    description: '6 Architectural timber, bioclimatic louvered, and solar-roof canopy pergolas',
    icon: Sun,
    color: 'text-emerald-500 bg-emerald-500/10'
  },
  {
    name: 'Commercial Designs',
    href: '/products?tab=commercial-designs',
    badge: 'Coming Soon',
    description: 'Retail plazas, medical clinics & hubs — complete costings & drawings coming soon',
    icon: Building2,
    color: 'text-blue-500 bg-blue-500/10'
  },
  {
    name: 'Education & Aid Post Infrastructure',
    href: '/products?tab=education-aid-post',
    badge: '4 Designs',
    description: 'Admin centers, 2-storey 8-in-1 blocks, STEM science labs & classrooms',
    icon: GraduationCap,
    color: 'text-rose-500 bg-rose-500/10'
  },
  {
    name: 'Commercial Warehouse Designs',
    href: '/products?tab=commercial-warehouses',
    badge: 'Coming Soon',
    description: 'Industrial storage & logistics depots — complete costings & drawings coming soon',
    icon: Warehouse,
    color: 'text-orange-500 bg-orange-500/10'
  },
];

const professionalServiceLinks = [
  {
    name: 'Project Management',
    href: '/services#project-management',
    badge: 'Full Lifecycle',
    description: 'Cloud milestone tracking, QuantyPros BOQ control, superintendent QA/QC, and 22-province freight logistics',
    icon: ClipboardCheck,
    color: 'text-blue-500 bg-blue-500/10'
  },
  {
    name: 'Quantity Surveying & Commercial',
    href: '/services#quantity-surveying',
    badge: 'Cost Control',
    description: 'Itemized BOQ & BOM preparation, tender evaluation, Capex feasibility, and value engineering',
    icon: Calculator,
    color: 'text-emerald-500 bg-emerald-500/10'
  },
  {
    name: 'Safety & Compliance',
    href: '/services#safety-compliance',
    badge: 'PNG NBB Certified',
    description: 'National Building Board approvals, cyclone/seismic engineering sign-offs, and site HSE protocols',
    icon: ShieldCheck,
    color: 'text-purple-500 bg-purple-500/10'
  },
];

const techLinks: { name: string; href: string; description: string; badge?: string }[] = [
  { name: 'Design Selector', href: '/design-selector', description: 'AI-driven house design recommendations', badge: 'Coming Soon' },
  { name: 'Estimator', href: '/estimator', description: 'Project cost & material calculator' },
  { name: 'Timeline', href: '/timeline', description: 'Interactive project scheduling' },
  { name: 'Tech Stack', href: '/#technology', description: 'Our core technological foundation' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isTechMenuOpen, setIsTechMenuOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    toast.info('Sign In is temporarily frozen while backend functions and security rules are being deployed & verified.', {
      description: 'All public estimation tools, kit home specifications, blueprints, and quote submissions remain fully operational.'
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isServicesActive = location.pathname.startsWith('/services') || 
                           location.pathname.startsWith('/products') || 
                           location.pathname.startsWith('/kit-homes') ||
                           (location.pathname === '/' && location.hash.startsWith('#services'));

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <img 
            src="https://pub-d244eff0ad524eccbaae907a70af6b3d.r2.dev/techtural-builtin/techtural_logo_transparent.png" 
            alt="Techtural Logo" 
            className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="hidden lg:flex flex-col border-l border-border pl-4">
            <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase leading-tight">
              Driven by Design
            </span>
            <span className="text-[10px] font-medium text-muted-foreground tracking-[0.1em] uppercase">
              Defined by Technology
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-7">
          <HashLink
            smooth
            to="/#"
            className={cn(
              "text-sm font-medium transition-colors",
              location.pathname === '/' && !location.hash
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            Home
          </HashLink>

          <HashLink
            smooth
            to="/#about"
            className={cn(
              "text-sm font-medium transition-colors",
              location.pathname === '/' && location.hash === '#about'
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            About
          </HashLink>

          {/* Unified Services Dropdown (Design & Construction Module + PM + QS + Safety) */}
          <Popover open={isServicesMenuOpen} onOpenChange={setIsServicesMenuOpen}>
            <PopoverTrigger className={cn(
              "flex items-center gap-1 text-sm font-medium transition-colors outline-none cursor-pointer",
              isServicesActive
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-primary"
            )}>
              Services
              <ChevronDown size={14} />
            </PopoverTrigger>
            <PopoverContent className="w-[720px] p-4 rounded-2xl border-border/50 bg-background/95 backdrop-blur-md shadow-2xl" align="center">
              <div className="grid grid-cols-12 gap-5">
                {/* Column 1: Design & Construction Module */}
                <div className="col-span-7 pr-3 border-r border-border/50 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                    <div>
                      <p className="text-[10px] font-bold text-amber-500 tracking-widest uppercase flex items-center gap-1.5">
                        <Layers size={12} />
                        <span>Design &amp; Construction Module</span>
                      </p>
                      <p className="text-xs font-bold text-foreground">Modular &amp; Architectural Catalog</p>
                    </div>
                    <Link 
                      to="/products"
                      onClick={() => setIsServicesMenuOpen(false)}
                      className="text-[11px] text-primary hover:underline font-semibold"
                    >
                      All 38 &rarr;
                    </Link>
                  </div>

                  <div className="grid gap-1">
                    {designConstructionLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.name}
                          to={link.href}
                          className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-muted transition-all group"
                          onClick={() => setIsServicesMenuOpen(false)}
                        >
                          <div className={cn("mt-0.5 p-1.5 rounded-lg shrink-0 transition-colors", link.color)}>
                            <Icon size={15} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                {link.name}
                              </p>
                              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-muted text-muted-foreground shrink-0">
                                {link.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground leading-tight line-clamp-1 mt-0.5">
                              {link.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Column 2: Professional & Specialized Services */}
                <div className="col-span-5 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="pb-2 border-b border-border/40 mb-2">
                      <p className="text-[10px] font-bold text-primary tracking-widest uppercase">Professional Services</p>
                      <p className="text-xs font-bold text-foreground">Supervision &amp; Engineering</p>
                    </div>

                    <div className="grid gap-1">
                      {professionalServiceLinks.map((service) => {
                        const Icon = service.icon;
                        return (
                          <HashLink
                            smooth
                            key={service.name}
                            to={service.href}
                            className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-muted transition-all group"
                            onClick={() => setIsServicesMenuOpen(false)}
                          >
                            <div className={cn("mt-0.5 p-1.5 rounded-lg shrink-0 transition-colors", service.color)}>
                              <Icon size={15} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                                {service.name}
                              </p>
                              <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2 mt-0.5">
                                {service.description}
                              </p>
                            </div>
                          </HashLink>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/40">
                    <Link
                      to="/services"
                      onClick={() => setIsServicesMenuOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-colors group"
                    >
                      <span className="text-xs font-bold">Services Overview Hub</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Technology Dropdown */}
          <Popover open={isTechMenuOpen} onOpenChange={setIsTechMenuOpen}>
            <PopoverTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors outline-none cursor-pointer">
              Technology
              <ChevronDown size={14} />
            </PopoverTrigger>
            <PopoverContent className="w-80 p-2 rounded-2xl border-border/50 bg-background/95 backdrop-blur-md shadow-2xl" align="center">
              <div className="grid gap-1">
                <div className="px-3 py-2 mb-1">
                  <p className="text-[10px] font-bold text-primary tracking-widest uppercase">Innovation Hub</p>
                </div>
                {techLinks.map((link) => (
                  <HashLink
                    smooth
                    key={link.name}
                    to={link.href}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition-all group"
                    onClick={() => setIsTechMenuOpen(false)}
                  >
                    <div className="mt-0.5 p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Cpu size={14} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-foreground">{link.name}</p>
                        {link.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-tight">{link.description}</p>
                    </div>
                  </HashLink>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <HashLink
            smooth
            to="/#portfolio"
            className={cn(
              "text-sm font-medium transition-colors",
              location.pathname === '/' && location.hash === '#portfolio'
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            Portfolio
          </HashLink>

          <HashLink
            smooth
            to="/#contact"
            className={cn(
              "text-sm font-medium transition-colors",
              location.pathname === '/' && location.hash === '#contact'
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            Contact
          </HashLink>

          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border/50">
            {user ? (
              <Popover>
                <PopoverTrigger className="flex items-center gap-2 outline-none group">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20 group-hover:border-primary transition-colors">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                        <User size={16} />
                      </div>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 rounded-2xl shadow-2xl border-border/50" align="end">
                  <div className="px-3 py-2 mb-2 border-b border-border/50">
                    <p className="text-sm font-bold truncate">{user.displayName || 'User'}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </Button>
                </PopoverContent>
              </Popover>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full gap-1.5 text-muted-foreground hover:text-foreground border border-border/60 bg-muted/40 hover:bg-muted/70 transition-all text-xs font-semibold cursor-pointer shadow-2xs"
                onClick={handleLogin}
                title="Sign In is temporarily frozen while backend functions and security rules are being deployed."
              >
                <Lock size={13} className="text-amber-500" />
                <span>Sign In</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                  Frozen
                </span>
              </Button>
            )}
            <PWAInstallButton variant="nav" />
            <Button 
              size="sm" 
              className="rounded-full px-6"
              onClick={() => setIsDiscoveryOpen(true)}
            >
              Get Consultation
            </Button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background border-b border-border p-6 md:hidden shadow-xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-2">
              <HashLink
                smooth
                to="/#"
                className="text-base font-semibold py-2 border-b border-border/50 flex items-center justify-between"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
                <ChevronRight size={18} className="text-muted-foreground" />
              </HashLink>

              <HashLink
                smooth
                to="/#about"
                className="text-base font-semibold py-2 border-b border-border/50 flex items-center justify-between"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
                <ChevronRight size={18} className="text-muted-foreground" />
              </HashLink>

              {/* Mobile Services Section with Design & Construction Module */}
              <div className="py-3 border-b border-border/50">
                <div className="flex items-center justify-between mb-3 px-1">
                  <p className="text-[11px] font-bold text-primary tracking-widest uppercase">
                    Services &amp; Solutions
                  </p>
                  <Link
                    to="/services"
                    className="text-xs font-semibold text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Services Hub &rarr;
                  </Link>
                </div>

                {/* Design & Construction Module */}
                <div className="mb-3">
                  <div className="flex items-center justify-between px-1 mb-2">
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                      <Layers size={12} />
                      <span>Design &amp; Construction Module</span>
                    </p>
                    <Link
                      to="/products"
                      className="text-[10px] font-semibold text-muted-foreground hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      38 Products
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {designConstructionLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.name}
                          to={link.href}
                          className="flex items-center gap-3 p-2 rounded-xl bg-muted/40 border border-border/50"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className={cn("p-1.5 rounded-lg shrink-0", link.color)}>
                            <Icon size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-foreground truncate">{link.name}</p>
                              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-muted text-muted-foreground">
                                {link.badge}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Professional Services */}
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1 mb-2">
                    Specialized Technical Services
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {professionalServiceLinks.map((service) => {
                      const Icon = service.icon;
                      return (
                        <HashLink
                          smooth
                          key={service.name}
                          to={service.href}
                          className="flex items-center gap-3 p-2 rounded-xl bg-muted/40 border border-border/50"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className={cn("p-1.5 rounded-lg shrink-0", service.color)}>
                            <Icon size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">{service.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{service.description}</p>
                          </div>
                        </HashLink>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Technology & Tools */}
              <div className="py-3 border-b border-border/50">
                <p className="text-[11px] font-bold text-primary tracking-widest uppercase mb-3 px-1">Technology &amp; Tools</p>
                <div className="grid grid-cols-1 gap-2">
                  {techLinks.map((link) => (
                    <HashLink
                      smooth
                      key={link.name}
                      to={link.href}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40 border border-border/50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <Cpu size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold">{link.name}</p>
                          {link.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                              {link.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground">{link.description}</p>
                      </div>
                    </HashLink>
                  ))}
                </div>
              </div>

              <HashLink
                smooth
                to="/#portfolio"
                className="text-base font-semibold py-2 border-b border-border/50 flex items-center justify-between"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Portfolio
                <ChevronRight size={18} className="text-muted-foreground" />
              </HashLink>

              <HashLink
                smooth
                to="/#contact"
                className="text-base font-semibold py-2 border-b border-border/50 flex items-center justify-between"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
                <ChevronRight size={18} className="text-muted-foreground" />
              </HashLink>

              <button
                type="button"
                onClick={handleLogin}
                className="w-full mt-3 flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Lock size={14} className="text-amber-500" />
                  <span className="font-semibold text-foreground">Sign In</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                  Frozen
                </span>
              </button>

              <div className="mt-3">
                <PWAInstallButton variant="banner" />
              </div>

              <Button 
                className="w-full mt-3 rounded-xl py-6 text-base font-bold"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsDiscoveryOpen(true);
                }}
              >
                Get Consultation
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProjectDiscoveryModal 
        isOpen={isDiscoveryOpen} 
        onClose={() => setIsDiscoveryOpen(false)} 
      />
    </nav>
  );
}
