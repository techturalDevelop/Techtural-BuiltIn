import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Home, 
  Box, 
  Sparkles, 
  Warehouse, 
  Sun, 
  Search, 
  ArrowRight, 
  Check, 
  FileText, 
  Download, 
  Layers, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  Maximize2, 
  X, 
  Send, 
  Compass, 
  CheckCircle2, 
  Calculator,
  ChevronRight,
  Filter,
  Package,
  Wrench,
  HelpCircle,
  Truck,
  BellRing,
  FileCheck2,
  GraduationCap,
  Share2
} from 'lucide-react';
import { ModelShareModal } from '@/components/ModelShareModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link, useSearchParams } from 'react-router-dom';
import { ComingSoonNoticeBanner } from '@/components/ComingSoonNoticeBanner';
import { 
  TINY_HOMES_DATA, 
  CONTAINER_HOMES_DATA, 
  GARDEN_PERGOLAS_DATA, 
  COMMERCIAL_DESIGNS_DATA, 
  EDUCATION_AID_POST_DATA,
  COMMERCIAL_WAREHOUSES_DATA,
  PRODUCT_CATEGORIES,
  ProductPlaceholder 
} from '@/data/productsData';
import { KIT_HOME_MODELS, KitHomeModel } from '@/data/kitHomesData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type ProductTab = 'all' | 'residential-kit-homes' | 'tiny-homes' | 'container-homes' | 'garden-pergolas' | 'commercial-designs' | 'education-aid-post' | 'commercial-warehouses';

export interface DesignProductsPageProps {
  defaultTab?: ProductTab;
}

export const isComingSoonCategory = (cat?: string): boolean => {
  return cat === 'tiny-homes' || cat === 'container-homes' || cat === 'commercial-designs' || cat === 'education-aid-post' || cat === 'commercial-warehouses';
};

export default function DesignProductsPage({ defaultTab }: DesignProductsPageProps = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromQuery = searchParams.get('tab') as ProductTab;
  const initialTab = tabFromQuery || defaultTab || 'all';
  
  const [activeTab, setActiveTab] = useState<ProductTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'area-asc' | 'area-desc'>('featured');
  
  // Modals
  const [selectedProduct, setSelectedProduct] = useState<ProductPlaceholder | null>(null);
  const [quoteProduct, setQuoteProduct] = useState<ProductPlaceholder | KitHomeModel | null>(null);
  const [shareModalModel, setShareModalModel] = useState<KitHomeModel | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const openShareModal = (model: KitHomeModel) => {
    setShareModalModel(model);
    setIsShareModalOpen(true);
  };
  
  // Quote form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'National Capital District (Port Moresby)',
    tier: 'turnkey', // blueprint, boq, kitset, turnkey
    timeline: 'Within 3-6 Months',
    notes: '',
    includeSolar: false,
    includeRainwater: false,
    includeLogistics: true
  });

  // Sync tab with URL search parameter or defaultTab
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as ProductTab;
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    } else if (!tabFromUrl && defaultTab && defaultTab !== activeTab) {
      setActiveTab(defaultTab);
    }
  }, [searchParams, defaultTab]);

  const handleTabChange = (tab: ProductTab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'all' ? {} : { tab });
  };

  // Combine all standard product placeholders
  const allPlaceholderProducts = useMemo(() => {
    return [
      ...TINY_HOMES_DATA,
      ...CONTAINER_HOMES_DATA,
      ...GARDEN_PERGOLAS_DATA,
      ...COMMERCIAL_DESIGNS_DATA,
      ...EDUCATION_AID_POST_DATA,
      ...COMMERCIAL_WAREHOUSES_DATA
    ];
  }, []);

  // Filter products based on active tab and search
  const filteredPlaceholders = useMemo(() => {
    return allPlaceholderProducts.filter(item => {
      let matchesTab = true;
      if (activeTab === 'all') {
        matchesTab = true;
      } else if (activeTab === 'tiny-homes') {
        matchesTab = item.category === 'tiny-homes';
      } else if (activeTab === 'container-homes') {
        matchesTab = item.category === 'container-homes';
      } else if (activeTab === 'garden-pergolas') {
        matchesTab = item.category === 'garden-pergolas';
      } else if (activeTab === 'commercial-designs') {
        matchesTab = item.category === 'commercial-designs';
      } else if (activeTab === 'education-aid-post') {
        matchesTab = item.category === 'education-aid-post';
      } else if (activeTab === 'commercial-warehouses') {
        matchesTab = item.category === 'commercial-warehouses';
      } else if (activeTab === 'residential-kit-homes') {
        matchesTab = false; // Kit homes rendered separately
      }

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesTab;

      const matchesSearch = 
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.conceptEssence.toLowerCase().includes(q) ||
        item.subcategoryLabel.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.blueprintPrice - b.blueprintPrice;
      if (sortBy === 'price-desc') return b.blueprintPrice - a.blueprintPrice;
      if (sortBy === 'area-asc') return (a.areaSqm || 0) - (b.areaSqm || 0);
      if (sortBy === 'area-desc') return (b.areaSqm || 0) - (a.areaSqm || 0);
      return 0; // featured default
    });
  }, [allPlaceholderProducts, activeTab, searchQuery, sortBy]);

  // Filtered kit homes if on 'all' or 'residential-kit-homes'
  const filteredKitHomes = useMemo(() => {
    if (activeTab !== 'all' && activeTab !== 'residential-kit-homes') {
      return [];
    }
    const q = searchQuery.toLowerCase().trim();
    return KIT_HOME_MODELS.filter(model => {
      if (!q) return true;
      return (
        model.name.toLowerCase().includes(q) ||
        model.code.toLowerCase().includes(q) ||
        model.description.toLowerCase().includes(q) ||
        `${model.bedrooms} bedroom`.includes(q) ||
        (model.typeLabel && model.typeLabel.toLowerCase().includes(q))
      );
    });
  }, [activeTab, searchQuery]);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('Please enter your full name and contact phone number.');
      return;
    }

    const isComingSoonProduct = quoteProduct && 'category' in quoteProduct && isComingSoonCategory(quoteProduct.category);

    if (isComingSoonProduct) {
      toast.success(
        `Priority notification registered for ${quoteProduct.name}!`,
        {
          description: `You will be among the first to receive certified blueprints, complete BOQ, and turnkey costings upon release. Our team will keep you updated at ${formData.phone}.`
        }
      );
    } else {
      toast.success(
        `Inquiry submitted for ${quoteProduct ? quoteProduct.name : 'Design & Construction Product'}!`,
        {
          description: `Our architectural estimation team in Port Moresby will contact you at ${formData.phone} with full CAD drawings and customized proposal.`
        }
      );
    }
    setQuoteProduct(null);
  };

  const calculateIndicativeTotal = (prod: ProductPlaceholder) => {
    let base = 0;
    if (formData.tier === 'blueprint') base = prod.blueprintPrice;
    else if (formData.tier === 'boq') base = prod.blueprintPrice + prod.boqBomPrice;
    else if (formData.tier === 'kitset') base = prod.kitsetBasePrice;
    else base = prod.turnKeyPrice;

    let addOns = 0;
    if (formData.includeSolar) addOns += 18000;
    if (formData.includeRainwater) addOns += 7500;
    if (formData.includeLogistics) addOns += 6000;

    return base + addOns;
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      {/* Top Hero Banner */}
      <section className="relative px-6 py-12 md:py-16 overflow-hidden border-b border-border bg-radial from-primary/10 via-background to-background">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4 text-xs font-semibold text-muted-foreground">
            <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
            <ChevronRight size={14} />
            <span className="text-primary font-bold">Design &amp; Construction Module</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles size={14} />
            <span>Design &amp; Construction Modular Architecture Catalog</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground font-sans">
            Design &amp; Construction Module
          </h1>
          
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore Papua New Guinea’s comprehensive modular and architectural portfolio. 
            From <strong>18 Official Residential Kit Homes</strong> and <strong>Tiny &amp; Container Living Pods</strong> to 
            <strong>Architectural Pergolas</strong>, <strong>Commercial Complexes</strong>, <strong>Education &amp; Aid Post Infrastructure</strong>, and <strong>Industrial Warehouses</strong>.
          </p>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 mt-8 max-w-6xl mx-auto">
            {[
              { label: 'Residential Kit Homes', count: '20 Models', icon: Home, tab: 'residential-kit-homes', isComingSoon: false },
              { label: 'Tiny Home Concepts', count: 'Coming Soon', icon: Box, tab: 'tiny-homes', isComingSoon: true },
              { label: 'Container Homes', count: 'Coming Soon', icon: Package, tab: 'container-homes', isComingSoon: true },
              { label: 'Garden Pergolas', count: '6 Systems', icon: Sun, tab: 'garden-pergolas', isComingSoon: false },
              { label: 'Commercial Designs', count: 'Coming Soon', icon: Building2, tab: 'commercial-designs', isComingSoon: true },
              { label: 'Education & Aid Post', count: '4 Designs', icon: GraduationCap, tab: 'education-aid-post', isComingSoon: true },
              { label: 'Industrial Warehouses', count: 'Coming Soon', icon: Warehouse, tab: 'commercial-warehouses', isComingSoon: true },
            ].map((item, idx) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.tab;
              return (
                <button
                  key={idx}
                  onClick={() => handleTabChange(item.tab as ProductTab)}
                  className={`p-3.5 rounded-2xl border text-left transition-all group ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]' 
                      : 'bg-card/70 border-border/70 hover:border-primary/50 hover:bg-card'
                  }`}
                >
                  <div className={`p-2 rounded-xl w-fit mb-2 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary group-hover:scale-110 transition-transform'
                  }`}>
                    <Icon size={16} />
                  </div>
                  <div className="text-xs font-bold truncate leading-tight">{item.label}</div>
                  <div className={`text-[11px] font-mono mt-0.5 ${
                    isSelected 
                      ? 'text-primary-foreground/90' 
                      : item.isComingSoon 
                        ? 'text-amber-600 dark:text-amber-400 font-semibold' 
                        : 'text-muted-foreground'
                  }`}>
                    {item.count}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Catalog & Navigation Container */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
          {/* Main Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Products (49)' },
              { id: 'residential-kit-homes', label: 'Residential Kit Homes (20)' },
              { id: 'tiny-homes', label: 'Tiny Homes (Coming Soon)' },
              { id: 'container-homes', label: 'Container Homes (Coming Soon)' },
              { id: 'garden-pergolas', label: 'Garden Pergolas (6)' },
              { id: 'commercial-designs', label: 'Commercial (Coming Soon)' },
              { id: 'education-aid-post', label: 'Education & Aid Post (4)' },
              { id: 'commercial-warehouses', label: 'Warehouses (Coming Soon)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as ProductTab)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                type="text"
                placeholder="Search products, codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 rounded-xl bg-muted/30 text-xs sm:text-sm"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="h-10 px-3 py-2 text-xs sm:text-sm rounded-xl border border-input bg-background font-medium focus:outline-hidden focus:ring-2 focus:ring-primary"
            >
              <option value="featured">Featured / Register</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="area-asc">Size: Small to Large</option>
              <option value="area-desc">Size: Large to Small</option>
            </select>
          </div>
        </div>

        {/* Section Header Description */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
          <p>
            Viewing {activeTab === 'all' ? 'All 38 Design & Construction Products' : PRODUCT_CATEGORIES.find(c => c.id === activeTab)?.label || 'Products'}
          </p>
          <span className="text-xs text-primary font-medium">All itemized pricing in Papua New Guinea Kina (PGK)</span>
        </div>

        {/* 1. RESIDENTIAL KIT HOMES SECTION (If tab is 'all' or 'residential-kit-homes') */}
        {(activeTab === 'all' || activeTab === 'residential-kit-homes') && filteredKitHomes.length > 0 && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <Home size={20} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">
                    Residential Kit Homes ({filteredKitHomes.length} Models)
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    1 to 4 bedroom engineered modular homes with transparent turn-key &amp; blueprint pricing.
                  </p>
                </div>
              </div>
              <Link to="/kit-homes">
                <Button variant="outline" size="sm" className="rounded-xl text-xs flex items-center gap-1.5">
                  <span>Full Kit Homes Catalog</span>
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>

            {/* Kit Home Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredKitHomes.slice(0, activeTab === 'all' ? 6 : undefined).map((model) => (
                <div
                  key={model.id}
                  className="rounded-2xl border border-border bg-card/60 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={model.image}
                      alt={model.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {model.officialNumber && (
                          <span className="px-2 py-0.5 rounded-md bg-black/75 text-amber-300 font-mono text-[11px] font-bold border border-amber-500/30">
                            #{String(model.officialNumber).padStart(2, '0')}
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 rounded-md bg-primary text-primary-foreground font-mono text-xs font-bold">
                          {model.code}
                        </span>
                        {model.typeLabel && (
                          <span className="px-2 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 text-foreground text-[11px] font-bold">
                            {model.typeLabel}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openShareModal(model);
                          }}
                          title="Share kit home model"
                          className="px-2 py-0.5 rounded-md bg-black/65 hover:bg-primary text-white text-[11px] font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1 hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                        >
                          <Share2 size={11} className="text-amber-300" />
                          <span>Share</span>
                        </button>
                        {model.isHighset && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[11px] font-bold">
                            Elevated Stilt
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold text-base leading-tight drop-shadow-sm">{model.name}</h3>
                      <div className="text-xs text-slate-200 mt-0.5">
                        {model.bedrooms} Bed | {model.bathrooms} Bath | {model.buildingAreaSqm} m²
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {model.description}
                    </p>

                    <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Blueprint CAD:</span>
                        <span className="font-bold font-mono text-foreground">PGK {model.blueprintPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Turn-Key Handover:</span>
                        {model.isTurnKeyCostingInProgress ? (
                          <Badge variant="outline" className="font-semibold text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30">
                            Costing in Progress
                          </Badge>
                        ) : (
                          <span className="font-bold font-mono text-primary">PGK {model.fullTurnKeyPrice.toLocaleString()}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Link to={`/kit-homes?model=${model.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full rounded-xl text-xs">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        onClick={() => setQuoteProduct(model)}
                        className="flex-1 rounded-xl text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Request Quote
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openShareModal(model)}
                        className="rounded-xl px-2.5 text-xs border-border hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                        title="Share on WhatsApp, Facebook, X, etc."
                      >
                        <Share2 size={13} className="text-primary" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {activeTab === 'all' && (
              <div className="text-center pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleTabChange('residential-kit-homes')}
                  className="rounded-xl text-xs gap-2"
                >
                  <span>View All 20 Kit Home Models</span>
                  <ChevronRight size={14} />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* 2. NON-RESIDENTIAL PRODUCT CATEGORIES (Tiny Homes, Containers, Pergolas, Commercial, Education & Aid Post, Warehouses) */}
        {/* Prominent Coming Soon Banner if viewing a Coming Soon Category Tab */}
        {isComingSoonCategory(activeTab) && (
          <ComingSoonNoticeBanner
            categoryKey={activeTab as 'tiny-homes' | 'container-homes' | 'commercial-designs' | 'education-aid-post' | 'commercial-warehouses'}
            onRegisterInterest={() => {
              const firstItem = filteredPlaceholders.find(p => p.category === activeTab);
              if (firstItem) {
                setQuoteProduct(firstItem);
              }
            }}
          />
        )}

        {filteredPlaceholders.length > 0 && (
          <div className="mt-8 space-y-12">
            {/* Group by subcategory if in 'all' view or show specific items */}
            {['tiny-homes', 'container-homes', 'garden-pergolas', 'commercial-designs', 'education-aid-post', 'commercial-warehouses'].map((catKey) => {
              const itemsInCat = filteredPlaceholders.filter(item => item.category === catKey);
              if (itemsInCat.length === 0) return null;
              const isComingSoon = isComingSoonCategory(catKey);

              const getCategoryInfo = () => {
                switch (catKey) {
                  case 'tiny-homes':
                    return {
                      title: 'Tiny Home Concepts',
                      count: `${itemsInCat.length} Concepts`,
                      icon: Box,
                      color: 'text-indigo-500 bg-indigo-500/10',
                      desc: 'Compact mobile and off-grid modular pods maximizing space efficiency for eco-living.'
                    };
                  case 'container-homes':
                    return {
                      title: 'Container Home Solutions',
                      count: `${itemsInCat.length} Solutions`,
                      icon: Package,
                      color: 'text-cyan-500 bg-cyan-500/10',
                      desc: '20ft & 40ft Corten steel High-Cube container conversions engineered for rapid deployment.'
                    };
                  case 'garden-pergolas':
                    return {
                      title: 'Garden Pergola Systems',
                      count: `${itemsInCat.length} Systems`,
                      icon: Sun,
                      color: 'text-emerald-500 bg-emerald-500/10',
                      desc: 'Architectural timber, bioclimatic louvered, and solar-roof garden canopy structures.'
                    };
                  case 'commercial-designs':
                    return {
                      title: 'Commercial Designs',
                      count: `${itemsInCat.length} Projects`,
                      icon: Building2,
                      color: 'text-blue-500 bg-blue-500/10',
                      desc: 'Retail plazas, medical clinics, corporate office hubs, and beachfront resort bungalows.'
                    };
                  case 'education-aid-post':
                    return {
                      title: 'Education & Aid Post Infrastructure Designs',
                      count: `${itemsInCat.length} Designs`,
                      icon: GraduationCap,
                      color: 'text-rose-500 bg-rose-500/10',
                      desc: 'Administration buildings & resource centers, 2-storey 8-in-1 classroom blocks, modular STEM science labs, and low-post dual classrooms.'
                    };
                  case 'commercial-warehouses':
                    return {
                      title: 'Commercial Warehouse Designs',
                      count: `${itemsInCat.length} Facilities`,
                      icon: Warehouse,
                      color: 'text-orange-500 bg-orange-500/10',
                      desc: 'Clear-span industrial storage warehouses, cold chains, and multi-tenant logistics complexes.'
                    };
                  default:
                    return {
                      title: 'Products',
                      count: '',
                      icon: Building2,
                      color: 'text-primary bg-primary/10',
                      desc: ''
                    };
                }
              };

              const info = getCategoryInfo();
              const Icon = info.icon;

              return (
                <div key={catKey} className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/80 pb-3 gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl ${info.color}`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-lg sm:text-xl font-bold text-foreground">
                            {info.title} ({info.count})
                          </h2>
                          {isComingSoon && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                              <Clock size={10} />
                              <span>Coming Soon • Costing in Progress</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{info.desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Compact Coming Soon Banner in 'all' view */}
                  {activeTab === 'all' && isComingSoon && (
                    <ComingSoonNoticeBanner
                      categoryKey={catKey as 'tiny-homes' | 'container-homes' | 'commercial-designs' | 'education-aid-post' | 'commercial-warehouses'}
                      compact
                      onRegisterInterest={() => {
                        if (itemsInCat.length > 0) {
                          setQuoteProduct(itemsInCat[0]);
                        }
                      }}
                    />
                  )}

                  {/* Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {itemsInCat.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-border bg-card/60 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                      >
                        {/* Image Container */}
                        <div className="relative h-48 overflow-hidden bg-muted">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                          
                          {/* Badges on Image */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-md bg-primary text-primary-foreground font-mono text-xs font-bold tracking-wider">
                                {item.code}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 text-foreground text-[11px] font-bold">
                                {item.subcategoryLabel}
                              </span>
                            </div>
                            {isComingSoon ? (
                              <span className="px-2 py-0.5 rounded-md bg-amber-500 text-amber-950 text-[11px] font-bold flex items-center gap-1 shadow-xs">
                                <Clock size={11} /> Coming Soon
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-black/60 text-slate-200 text-[11px] font-mono backdrop-blur-xs">
                                {item.dimensions}
                              </span>
                            )}
                          </div>

                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <h3 className="font-bold text-base leading-tight drop-shadow-sm">{item.name}</h3>
                            <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{item.tagline}</p>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          {/* Concept Essence */}
                          <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/15 text-xs">
                            <span className="font-semibold text-foreground text-[11px] uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                              <Sparkles size={12} className="text-primary" />
                              Concept Essence:
                            </span>
                            <p className="italic text-muted-foreground line-clamp-2 leading-relaxed">
                              "{item.conceptEssence}"
                            </p>
                          </div>

                          {/* Key Highlights */}
                          <ul className="space-y-1 text-xs text-muted-foreground">
                            {item.keyFeatures.slice(0, 2).map((feat, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <Check size={13} className="text-primary shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{feat}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Pricing Overview Table vs Coming Soon Notice */}
                          {isComingSoon ? (
                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs space-y-1.5">
                              <div className="flex justify-between items-center text-amber-700 dark:text-amber-400 font-bold">
                                <span className="flex items-center gap-1.5">
                                  <Clock size={13} /> Complete Costings in Progress
                                </span>
                                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/20">Coming Soon</span>
                              </div>
                              <p className="text-[11px] text-muted-foreground leading-tight">
                                These designs are still being developed with complete costings. Advised to check back again soon.
                              </p>
                            </div>
                          ) : (
                            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1.5">
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Blueprint &amp; CAD:</span>
                                <span className="font-bold font-mono text-foreground">PGK {item.blueprintPrice.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Turn-Key Handover:</span>
                                <span className="font-bold font-mono text-primary">PGK {item.turnKeyPrice.toLocaleString()}</span>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          {isComingSoon ? (
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedProduct(item)}
                                className="rounded-xl text-xs"
                              >
                                Preview Concept
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => setQuoteProduct(item)}
                                className="rounded-xl text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium flex items-center justify-center gap-1.5"
                              >
                                <BellRing size={12} />
                                <span>Register Interest</span>
                              </Button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedProduct(item)}
                                className="rounded-xl text-xs"
                              >
                                Specifications
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => setQuoteProduct(item)}
                                className="rounded-xl text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                              >
                                Inquire Quote
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state if search returned nothing */}
        {filteredPlaceholders.length === 0 && filteredKitHomes.length === 0 && (
          <div className="py-16 text-center bg-card/40 rounded-2xl border border-dashed border-border mt-8">
            <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground">No Products Found</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
              We couldn’t find any models or designs matching "{searchQuery}". Try clearing your search query or selecting a different tab.
            </p>
            <Button
              variant="outline"
              onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
              className="mt-4 rounded-xl text-xs"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section className="max-w-4xl mx-auto px-6 py-12 border-t border-border mt-12">
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            Frequently Asked Questions: Products &amp; Modular Construction
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Learn more about blueprints, customization, shipping containers, and turnkey delivery across PNG.
          </p>
        </div>

        <Accordion className="w-full space-y-3">
          <AccordionItem value="faq-1" className="border border-border/80 rounded-xl px-4 bg-card/40">
            <AccordionTrigger className="text-xs sm:text-sm font-semibold text-foreground hover:no-underline">
              What is included in the Blueprint &amp; CAD Package?
            </AccordionTrigger>
            <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Our Blueprint package contains full architectural working drawings (plans, elevations, cross-sections), structural engineering framing calculations (wind rated up to PNG Category C2 &amp; seismic standards), electrical wiring schematics, and plumbing reticulation diagrams ready for Physical Planning Board approval.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-2" className="border border-border/80 rounded-xl px-4 bg-card/40">
            <AccordionTrigger className="text-xs sm:text-sm font-semibold text-foreground hover:no-underline">
              Are Shipping Container Homes suitable for PNG's hot tropical climate?
            </AccordionTrigger>
            <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Yes! All our container concepts feature high-density closed-cell spray-foam insulation (R-3.5) on walls and ceilings, reflective tropical fly-roof frames, and louvered cross-breezeways to prevent thermal buildup and maintain pleasant indoor temperatures.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-3" className="border border-border/80 rounded-xl px-4 bg-card/40">
            <AccordionTrigger className="text-xs sm:text-sm font-semibold text-foreground hover:no-underline">
              Can Commercial and Warehouse designs be modified for specific site dimensions?
            </AccordionTrigger>
            <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every commercial and warehouse plan can be custom-engineered to fit your exact land boundaries, soil conditions, and clear-span height requirements. We provide complete structural engineering certifications for heavy industrial loading.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-education" className="border border-border/80 rounded-xl px-4 bg-card/40">
            <AccordionTrigger className="text-xs sm:text-sm font-semibold text-foreground hover:no-underline">
              How are Education &amp; Aid Post Infrastructure designs tailored for PNG institutions and community delivery?
            </AccordionTrigger>
            <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Our Education &amp; Aid Post models (Administration Building &amp; Resource Center, 2 Storey 8 in 1 Junior High Classroom Block, Modular STEM Science Lab &amp; Digital Resource Center, and Low Post 1 in 2 Classroom Science Lab / Standard Low Set) are engineered to PNG National Department of Education and structural standards. They feature cyclone-rated steel/concrete structures, integrated science laboratory wet/dry infrastructure, and high-capacity rainwater harvesting. Blueprints and itemized BOQs are prepared for school boards, District Development Authority (DDA), and donor-funded project submissions.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-4" className="border border-border/80 rounded-xl px-4 bg-card/40">
            <AccordionTrigger className="text-xs sm:text-sm font-semibold text-foreground hover:no-underline">
              Do you ship kit materials to provincial centres outside Port Moresby?
            </AccordionTrigger>
            <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Yes, our logistics procurement service coordinates containerized coastal shipping and road freight to Lae, Madang, Wewak, Rabaul, Kokopo, Kimbe, Alotau, Mt Hagen, and island provinces.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* SPECIFICATIONS MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white relative">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-primary text-primary-foreground font-mono text-xs font-bold">
                    {selectedProduct.code}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    {selectedProduct.subcategoryLabel}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold">{selectedProduct.name}</h3>
                <p className="text-xs text-slate-300 mt-1">{selectedProduct.tagline}</p>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
                <div className="relative h-56 rounded-xl overflow-hidden bg-muted">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/70 text-white text-xs font-mono backdrop-blur-xs">
                    {selectedProduct.dimensions}
                  </div>
                </div>

                {/* Concept & Architectural Essence */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-primary" />
                    Concept &amp; Architectural Essence:
                  </h4>
                  <p className="text-muted-foreground text-xs italic leading-relaxed">
                    "{selectedProduct.conceptEssence}"
                  </p>
                </div>

                {/* Detailed Description */}
                <div>
                  <h4 className="font-bold text-foreground mb-1.5">Detailed Description</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Key Technical Specifications */}
                <div>
                  <h4 className="font-bold text-foreground mb-2">Key Engineering Features</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProduct.keyFeatures.map((feat, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-muted/40 border border-border/70 text-xs flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground/90">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & Deliverables Table or Coming Soon Notice */}
                {isComingSoonCategory(selectedProduct.category) ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                          <Clock size={14} className="animate-pulse" />
                          Coming Soon • Complete Costings in Progress
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-semibold">
                          Under Development
                        </span>
                      </div>
                      <p className="text-xs text-foreground font-semibold leading-relaxed">
                        &ldquo;These designs are still being developed with complete costings and certified engineering documentation. Customers are advised to check back again soon.&rdquo;
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Our quantity surveying and architectural documentation teams are currently finalizing certified structural engineering packages, local material lists, supplier schedules, and turnkey build rates tailored for Papua New Guinea provinces.
                      </p>
                    </div>

                    <div className="border border-amber-500/30 bg-amber-500/5 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                          <FileCheck2 size={15} className="text-amber-600" />
                          <span>Documentation Deliverables Currently in Development:</span>
                        </h4>
                        <span className="text-[10px] font-mono text-amber-600 font-bold uppercase">PNG Standards</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-card border border-border flex items-start gap-2 shadow-2xs">
                          <CheckCircle2 size={13} className="text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-foreground">1. Certified Blueprints &amp; CAD</span>
                            <p className="text-[10px] text-muted-foreground">Planning board approved drawings (In progress)</p>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-card border border-border flex items-start gap-2 shadow-2xs">
                          <CheckCircle2 size={13} className="text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-foreground">2. Itemized Master BOQ &amp; BOM</span>
                            <p className="text-[10px] text-muted-foreground">Itemized material counts &amp; supplier pricing (In progress)</p>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-card border border-border flex items-start gap-2 shadow-2xs">
                          <CheckCircle2 size={13} className="text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-foreground">3. Structural Materials Kitset</span>
                            <p className="text-[10px] text-muted-foreground">Prefab framing &amp; hardware schedules (In progress)</p>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-card border border-border flex items-start gap-2 shadow-2xs">
                          <CheckCircle2 size={13} className="text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-foreground">4. Turn-Key Provincial Build</span>
                            <p className="text-[10px] text-muted-foreground">Turnkey build rates across PNG provinces (In progress)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-border rounded-xl overflow-hidden">
                    <div className="bg-muted/60 px-4 py-2.5 font-bold text-xs text-foreground border-b border-border flex justify-between">
                      <span>Package Tier</span>
                      <span>Indicative Price (PGK)</span>
                    </div>
                    <div className="divide-y divide-border text-xs">
                      <div className="px-4 py-2 flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-foreground">1. Full Architectural Blueprint &amp; CAD</span>
                          <p className="text-[10px] text-muted-foreground">Planning board approved drawings</p>
                        </div>
                        <span className="font-mono font-bold">PGK {selectedProduct.blueprintPrice.toLocaleString()}</span>
                      </div>
                      <div className="px-4 py-2 flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-foreground">2. BOQ &amp; BOM Cost Schedule</span>
                          <p className="text-[10px] text-muted-foreground">Itemized material counts &amp; supplier pricing</p>
                        </div>
                        <span className="font-mono font-bold">PGK {selectedProduct.boqBomPrice.toLocaleString()}</span>
                      </div>
                      <div className="px-4 py-2 flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-foreground">3. Kitset Structural Materials Package</span>
                          <p className="text-[10px] text-muted-foreground">Prefab framing, steel, roof &amp; hardware</p>
                        </div>
                        <span className="font-mono font-bold">PGK {selectedProduct.kitsetBasePrice.toLocaleString()}</span>
                      </div>
                      <div className="px-4 py-2.5 flex justify-between items-center bg-primary/5">
                        <div>
                          <span className="font-bold text-primary">4. Full Turn-Key Construction &amp; Handover</span>
                          <p className="text-[10px] text-muted-foreground">Complete build from site prep to final keys</p>
                        </div>
                        <span className="font-mono font-bold text-primary text-sm">PGK {selectedProduct.turnKeyPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-muted/30 border-t border-border flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedProduct(null)}
                  className="rounded-xl text-xs"
                >
                  Close
                </Button>
                {isComingSoonCategory(selectedProduct.category) ? (
                  <Button
                    onClick={() => {
                      const prod = selectedProduct;
                      setSelectedProduct(null);
                      setQuoteProduct(prod);
                    }}
                    className="rounded-xl text-xs bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2 font-medium"
                  >
                    <BellRing size={14} />
                    <span>Register Early Interest</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      const prod = selectedProduct;
                      setSelectedProduct(null);
                      setQuoteProduct(prod);
                    }}
                    className="rounded-xl text-xs bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
                  >
                    <Calculator size={14} />
                    <span>Request Custom Quote</span>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUOTE & INQUIRY MODAL */}
      <AnimatePresence>
        {quoteProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuoteProduct(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 my-6 max-h-[92vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground relative">
                <button
                  onClick={() => setQuoteProduct(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-white/20 text-white font-mono text-xs font-bold">
                    {quoteProduct.code}
                  </span>
                  <span className="text-xs text-primary-foreground/90 font-medium">
                    {'category' in quoteProduct && isComingSoonCategory(quoteProduct.category)
                      ? 'Priority Notification & Costing Alert' 
                      : 'Inquiry & Project Estimation'}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold">{quoteProduct.name}</h3>
              </div>

              {/* Form */}
              <form onSubmit={handleQuoteSubmit} className="p-6 overflow-y-auto space-y-3.5 flex-1 text-xs sm:text-sm">
                {'category' in quoteProduct && isComingSoonCategory(quoteProduct.category) && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} className="animate-pulse" />
                        Designs &amp; Costings in Progress
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-foreground font-semibold leading-relaxed">
                      &ldquo;These designs are still being developed with complete costings and certified engineering documentation. Customers are advised to check back again soon.&rdquo;
                    </p>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Register below to be the first to receive the official blueprints, itemized BOQ schedules, and complete turn-key package pricing upon release.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Full Name *</label>
                    <Input
                      required
                      placeholder="e.g. John Kila"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rounded-xl text-xs h-9"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Phone Number *</label>
                    <Input
                      required
                      placeholder="e.g. +675 7123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="rounded-xl text-xs h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Email Address</label>
                    <Input
                      type="email"
                      placeholder="e.g. yourname@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="rounded-xl text-xs h-9"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Project Site Location</label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full h-9 px-3 rounded-xl border border-input bg-background text-xs"
                    >
                      <option value="National Capital District (Port Moresby)">NCD (Port Moresby)</option>
                      <option value="Central Province">Central Province</option>
                      <option value="Morobe (Lae)">Morobe (Lae)</option>
                      <option value="East New Britain (Kokopo/Rabaul)">East New Britain (Kokopo)</option>
                      <option value="Western Highlands (Mt Hagen)">Western Highlands (Mt Hagen)</option>
                      <option value="Madang Province">Madang</option>
                      <option value="Milne Bay (Alotau)">Milne Bay (Alotau)</option>
                      <option value="Other Province">Other Provincial Centre</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    {'category' in quoteProduct && isComingSoonCategory(quoteProduct.category)
                      ? 'Package Tier of Interest'
                      : 'Desired Package Tier'}
                  </label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl border border-input bg-background text-xs font-medium"
                  >
                    <option value="turnkey">Full Turn-Key Handover (Recommended)</option>
                    <option value="kitset">Kitset Structural Materials Pack</option>
                    <option value="boq">Blueprint + BOQ &amp; BOM Package</option>
                    <option value="blueprint">Blueprint &amp; CAD Plans Only</option>
                  </select>
                </div>

                {/* Add-ons */}
                <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-2">
                  <span className="font-semibold text-xs text-foreground block">Optional Upgrades &amp; Services:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.includeSolar}
                        onChange={(e) => setFormData({ ...formData, includeSolar: e.target.checked })}
                        className="rounded border-input text-primary focus:ring-primary"
                      />
                      <span>Hybrid Rooftop Solar PV &amp; Storage (+PGK 18,000)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.includeRainwater}
                        onChange={(e) => setFormData({ ...formData, includeRainwater: e.target.checked })}
                        className="rounded border-input text-primary focus:ring-primary"
                      />
                      <span>Rainwater Tank &amp; UV Filtration (+PGK 7,500)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={formData.includeLogistics}
                        onChange={(e) => setFormData({ ...formData, includeLogistics: e.target.checked })}
                        className="rounded border-input text-primary focus:ring-primary"
                      />
                      <span>Include Coastal Shipping &amp; Logistics Delivery Handling</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Additional Project Notes &amp; Land Specifics</label>
                  <textarea
                    rows={2}
                    placeholder="E.g., Land has slight slope, off-grid location, road access available..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-input bg-background text-xs resize-none"
                  />
                </div>

                {/* Estimate Summary */}
                {'category' in quoteProduct && isComingSoonCategory(quoteProduct.category) ? (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-muted-foreground block">Costing Status:</span>
                      <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                        Complete Costings in Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-muted-foreground block">Estimated Package Price:</span>
                      <span className="text-xs font-semibold text-foreground capitalize">
                        {formData.tier} Tier + Options
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-base font-extrabold text-primary">
                        {(() => {
                          const isKit = 'fullTurnKeyPrice' in quoteProduct;
                          const bp = quoteProduct.blueprintPrice;
                          const boq = quoteProduct.boqBomPrice;
                          const kitset = isKit ? quoteProduct.kitMaterialBasePrice : ('kitsetBasePrice' in quoteProduct ? quoteProduct.kitsetBasePrice : 0);
                          const turnkey = isKit ? quoteProduct.fullTurnKeyPrice : ('turnKeyPrice' in quoteProduct ? quoteProduct.turnKeyPrice : 0);

                          if (formData.tier === 'turnkey' && isKit && (quoteProduct as any).isTurnKeyCostingInProgress) {
                            return 'Costing in Progress';
                          }
                          if (formData.tier === 'blueprint') return `PGK ${bp.toLocaleString()}`;
                          if (formData.tier === 'boq') return `PGK ${(bp + boq).toLocaleString()}`;
                          if (formData.tier === 'kitset') return `PGK ${kitset.toLocaleString()}`;
                          return `PGK ${turnkey.toLocaleString()}`;
                        })()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    className={`w-full rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2 ${
                      'category' in quoteProduct && isComingSoonCategory(quoteProduct.category)
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    }`}
                  >
                    {'category' in quoteProduct && isComingSoonCategory(quoteProduct.category) ? (
                      <>
                        <BellRing size={14} />
                        <span>Submit Priority Notification Registration</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Submit Project Inquiry</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Model Social Share Modal */}
      <ModelShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        model={shareModalModel}
      />
    </div>
  );
}
