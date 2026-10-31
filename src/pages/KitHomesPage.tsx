import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Bed, 
  Bath, 
  Maximize2, 
  FileText, 
  Layers, 
  HardHat, 
  Truck, 
  Key, 
  CheckCircle2, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Wind, 
  Sun, 
  Droplets, 
  Download, 
  PhoneCall, 
  Send, 
  X, 
  ChevronRight, 
  Info,
  Check,
  Calculator,
  ArrowUpDown,
  Building2,
  DraftingCompass,
  Ruler,
  ZoomIn,
  MessageSquare,
  Mail,
  ExternalLink,
  ShieldAlert,
  Palette,
  Share2
} from 'lucide-react';
import { ModelShareModal } from '@/components/ModelShareModal';
import { KitHomeImageZoomModal, PreviewImageItem } from '@/components/KitHomeImageZoomModal';
import { KitHomeDisplayPreviewBox } from '@/components/KitHomeDisplayPreviewBox';
import { KitHomeScopeOfWorksModal } from '@/components/KitHomeScopeOfWorksModal';
import { KIT_HOME_FINISH_OPTIONS, getFinishOptionsForModel } from '@/data/kitHomesFinishesData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { submitProjectRequest } from '@/lib/firebase';
import { 
  PRIMARY_WHATSAPP_NUMBER, 
  PRIMARY_EMAIL,
  buildWhatsAppLink, 
  buildMailtoLink,
  formatKitHomeQuoteWhatsAppMessage,
  formatBlueprintInquiryWhatsAppMessage 
} from '@/lib/communicationLinks';
import { KIT_HOME_MODELS, KIT_HOME_COLLECTIONS, PACKAGE_TIERS_INFO, KitHomeModel, findKitHomeModel } from '@/data/kitHomesData';
import { updateSocialMetaTags } from '@/lib/seoMeta';

export default function KitHomesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'area-asc' | 'area-desc' | 'number-asc'>('recommended');
  
  // Modal states
  const [activeModel, setActiveModel] = useState<KitHomeModel | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'specs' | 'builder' | 'inclusions'>('specs');
  const [isSowModalOpen, setIsSowModalOpen] = useState(false);
  const [sowModalModel, setSowModalModel] = useState<KitHomeModel | null>(null);
  const [searchParams] = useSearchParams();

  // Image Zoom Lightbox states
  const [isPreviewZoomOpen, setIsPreviewZoomOpen] = useState(false);
  const [previewZoomModel, setPreviewZoomModel] = useState<KitHomeModel | null>(null);
  const [previewZoomInitialIndex, setPreviewZoomInitialIndex] = useState(0);

  // Social Share Modal states
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareModalModel, setShareModalModel] = useState<KitHomeModel | null>(null);

  const openShareModal = (model: KitHomeModel) => {
    setShareModalModel(model);
    setIsShareModalOpen(true);
  };

  // Customizer selections for active modal
  const [customSelections, setCustomSelections] = useState<{
    includeBlueprint: boolean;
    includeBoqBom: boolean;
    includeProjectManagement: boolean;
    includeMaterialProcurement: boolean;
    includeKitMaterials: boolean;
    isFullTurnKey: boolean;
    includeContingency: boolean;
    includeSolar: boolean;
    includeRainwater: boolean;
    includeCycloneUpgrade: boolean;
    selectedFinishes: string[];
  }>({
    includeBlueprint: true,
    includeBoqBom: true,
    includeProjectManagement: false,
    includeMaterialProcurement: false,
    includeKitMaterials: true,
    isFullTurnKey: false,
    includeContingency: false,
    includeSolar: false,
    includeRainwater: false,
    includeCycloneUpgrade: false,
    selectedFinishes: [],
  });

  // Card-level customization toggles (state keyed by model id)
  const [cardToggles, setCardToggles] = useState<{
    [modelId: string]: {
      includeBoqBom: boolean;
      includeProjectManagement: boolean;
      includeMaterialProcurement: boolean;
      includeKitMaterials: boolean;
      includeContingency?: boolean;
    };
  }>({});

  // Quote form inputs
  const [quoteForm, setQuoteForm] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    plotLocation: '',
    targetTimeline: '3-6 months',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize or get card toggle state
  const getCardToggle = (modelId: string) => {
    return cardToggles[modelId] || {
      includeBoqBom: true,
      includeProjectManagement: false,
      includeMaterialProcurement: false,
      includeKitMaterials: false,
      includeContingency: false,
    };
  };

  const setCardToggle = (
    modelId: string, 
    field: 'includeBoqBom' | 'includeProjectManagement' | 'includeMaterialProcurement' | 'includeKitMaterials' | 'includeContingency',
    value: boolean
  ) => {
    setCardToggles(prev => ({
      ...prev,
      [modelId]: {
        ...(prev[modelId] || {
          includeBoqBom: true,
          includeProjectManagement: false,
          includeMaterialProcurement: false,
          includeKitMaterials: false,
          includeContingency: false,
        }),
        [field]: value
      }
    }));
  };

  // Filter and sort models
  const filteredModels = useMemo(() => {
    return KIT_HOME_MODELS.filter(model => {
      let matchesCategory = true;
      if (selectedCategory === 'all') {
        matchesCategory = true;
      } else if (selectedCategory.startsWith('collection-')) {
        matchesCategory = model.collectionId === selectedCategory;
      } else if (selectedCategory === 'highset') {
        matchesCategory = !!model.isHighset;
      } else {
        matchesCategory = model.category === selectedCategory;
      }

      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        model.name.toLowerCase().includes(q) ||
        model.code.toLowerCase().includes(q) ||
        model.description.toLowerCase().includes(q) ||
        (model.typeLabel && model.typeLabel.toLowerCase().includes(q)) ||
        (model.designEssence && model.designEssence.toLowerCase().includes(q)) ||
        (model.collectionName && model.collectionName.toLowerCase().includes(q)) ||
        (model.collectionEssence && model.collectionEssence.toLowerCase().includes(q)) ||
        `${model.bedrooms} bedroom`.includes(q) ||
        `${model.bedrooms} bed`.includes(q);

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.blueprintPrice - b.blueprintPrice;
      if (sortBy === 'price-desc') return b.blueprintPrice - a.blueprintPrice;
      if (sortBy === 'area-asc') return a.buildingAreaSqm - b.buildingAreaSqm;
      if (sortBy === 'area-desc') return b.buildingAreaSqm - a.buildingAreaSqm;
      if (sortBy === 'number-asc') return (a.officialNumber || 0) - (b.officialNumber || 0);
      return (a.officialNumber || 0) - (b.officialNumber || 0); // register order default
    });
  }, [selectedCategory, searchQuery, sortBy]);

  // Open modal with preselected model
  const openModelConfig = (
    model: KitHomeModel, 
    defaultToTurnKey: boolean = false, 
    initialTab: 'specs' | 'builder' | 'inclusions' = 'specs'
  ) => {
    const cardToggle = getCardToggle(model.id);
    setActiveModel(model);
    setCustomSelections({
      includeBlueprint: true,
      includeBoqBom: cardToggle.includeBoqBom ?? true,
      includeProjectManagement: defaultToTurnKey || cardToggle.includeProjectManagement,
      includeMaterialProcurement: defaultToTurnKey || cardToggle.includeMaterialProcurement,
      includeKitMaterials: defaultToTurnKey || cardToggle.includeKitMaterials,
      isFullTurnKey: defaultToTurnKey,
      includeContingency: cardToggle.includeContingency ?? false,
      includeSolar: false,
      includeRainwater: false,
      includeCycloneUpgrade: false,
      selectedFinishes: [],
    });
    setActiveModalTab(initialTab);
    setIsConfigModalOpen(true);
  };

  // Open high-resolution image preview & zoom lightbox
  const openImageZoom = (model: KitHomeModel, initialIndex: number = 0) => {
    setPreviewZoomModel(model);
    setPreviewZoomInitialIndex(initialIndex);
    setIsPreviewZoomOpen(true);
  };

  // Previewable image items for active preview model
  const previewImages: PreviewImageItem[] = useMemo(() => {
    if (!previewZoomModel) return [];
    const items: PreviewImageItem[] = [
      {
        title: '3D Exterior Render',
        subtitle: `${previewZoomModel.name} Architectural Perspective`,
        url: previewZoomModel.image,
        badge: '3D Perspective',
        type: '3d-render'
      }
    ];
    if (previewZoomModel.floorPlanImage) {
      items.push({
        title: 'Architectural Floor Plan',
        subtitle: `${previewZoomModel.name} Dimensional Layout (${previewZoomModel.dimensions})`,
        url: previewZoomModel.floorPlanImage,
        badge: 'Floor Plan',
        type: 'floor-plan'
      });
    }
    return items;
  }, [previewZoomModel]);

  // Handle URL query parameter pre-selection and dynamic OpenGraph sync
  useEffect(() => {
    const modelParam = searchParams.get('model');
    const previewParam = searchParams.get('preview');
    const target = modelParam || previewParam;
    if (target) {
      const found = findKitHomeModel(target);
      if (found) {
        // Update client document title and social tags for this model
        updateSocialMetaTags({
          title: `Techtural Kit Home — ${found.name} (${found.code})`,
          description: `${found.name} (${found.code}) | ${found.bedrooms} Bed, ${found.bathrooms} Bath, ${found.buildingAreaSqm} m². Engineered for Papua New Guinea.`,
          imageUrl: found.image,
          url: `${window.location.origin}/kit-homes?model=${encodeURIComponent(found.id)}`,
          imageAlt: `${found.name} 3D Artist Impression Perspective`,
        });

        if (previewParam) {
          openImageZoom(found, 0);
        } else {
          openModelConfig(found, false, 'specs');
        }
      }
    }
  }, [searchParams]);

  // Calculate dynamic total price for modal
  const modalCalculatedTotal = useMemo(() => {
    if (!activeModel) return 0;
    const contingencyAmount = activeModel.contingencyFee || activeModel.addOns?.contingencyPrice || 0;

    // Calculate sum of optional interior finishes
    const finishesTotal = (customSelections.selectedFinishes || []).reduce((acc, finishId) => {
      const finish = KIT_HOME_FINISH_OPTIONS.find(f => f.id === finishId);
      return acc + (finish?.price || 0);
    }, 0);

    if (customSelections.isFullTurnKey) {
      let total = activeModel.fullTurnKeyPrice;
      if (customSelections.includeContingency && contingencyAmount > 0) {
        total += contingencyAmount;
      }
      if (customSelections.includeSolar && activeModel.addOns?.solarKitPrice) {
        total += activeModel.addOns.solarKitPrice;
      }
      if (customSelections.includeRainwater && activeModel.addOns?.rainwaterSystemPrice) {
        total += activeModel.addOns.rainwaterSystemPrice;
      }
      if (customSelections.includeCycloneUpgrade && activeModel.addOns?.cycloneFoundationUpgradePrice) {
        total += activeModel.addOns.cycloneFoundationUpgradePrice;
      }
      total += finishesTotal;
      return total;
    }

    let total = 0;
    if (customSelections.includeBlueprint) total += activeModel.blueprintPrice;
    if (customSelections.includeBoqBom) total += activeModel.boqBomPrice;
    if (customSelections.includeKitMaterials) total += activeModel.kitMaterialBasePrice;
    if (customSelections.includeProjectManagement) total += activeModel.projectManagementFee;
    if (customSelections.includeMaterialProcurement) total += activeModel.materialProcurementFee;
    if (customSelections.includeContingency && contingencyAmount > 0) {
      total += contingencyAmount;
    }
    if (customSelections.includeSolar && activeModel.addOns?.solarKitPrice) {
      total += activeModel.addOns.solarKitPrice;
    }
    if (customSelections.includeRainwater && activeModel.addOns?.rainwaterSystemPrice) {
      total += activeModel.addOns.rainwaterSystemPrice;
    }
    if (customSelections.includeCycloneUpgrade && activeModel.addOns?.cycloneFoundationUpgradePrice) {
      total += activeModel.addOns.cycloneFoundationUpgradePrice;
    }
    total += finishesTotal;

    return total;
  }, [activeModel, customSelections]);

  // Card price calculation
  const getCardSubtotal = (model: KitHomeModel) => {
    const toggle = getCardToggle(model.id);
    let sum = model.blueprintPrice;
    if (toggle.includeBoqBom) sum += model.boqBomPrice;
    if (toggle.includeKitMaterials) sum += model.kitMaterialBasePrice;
    if (toggle.includeProjectManagement) sum += model.projectManagementFee;
    if (toggle.includeMaterialProcurement) sum += model.materialProcurementFee;
    if (toggle.includeContingency && (model.contingencyFee || model.addOns?.contingencyPrice)) {
      sum += (model.contingencyFee || model.addOns?.contingencyPrice || 0);
    }
    return sum;
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModel) return;
    if (!quoteForm.clientName || !quoteForm.clientEmail || !quoteForm.plotLocation) {
      toast.error('Please fill in your name, email, and plot location');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitProjectRequest({
        name: quoteForm.clientName,
        email: quoteForm.clientEmail,
        phone: quoteForm.clientPhone || 'Not specified',
        location: quoteForm.plotLocation,
        projectType: 'residential',
        service: `Kit Home Quote - ${activeModel.code} ${activeModel.name}`,
        budget: `PGK ${modalCalculatedTotal.toLocaleString()} (${customSelections.isFullTurnKey ? 'Full Turn-Key' : 'Custom Package'})`,
        details: {
          modelCode: activeModel.code,
          modelName: activeModel.name,
          bedrooms: activeModel.bedrooms,
          areaSqm: activeModel.buildingAreaSqm,
          timeline: quoteForm.targetTimeline,
          selections: customSelections,
          estimatedTotalPGK: modalCalculatedTotal,
          clientNotes: quoteForm.notes,
        }
      });

      toast.success('Kit Home quote inquiry submitted successfully! Our team will contact you within 24 hours.');
      setIsConfigModalOpen(false);
      setQuoteForm({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        plotLocation: '',
        targetTimeline: '3-6 months',
        notes: '',
      });
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to submit quote inquiry. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50/50 dark:bg-background text-foreground">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-transparent border-b border-border/60 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <Building2 size={14} />
            <span>Techtural Builtin Modular Series</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            Techtural Builtin <span className="text-primary">Kit Home Models</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Engineered specifically for Papua New Guinea’s tropical climate and seismic conditions. 
            Choose from <strong>{KIT_HOME_MODELS.length} pre-engineered 1 to 5 bedroom models</strong> with complete price transparency 
            covering Blueprints, BOQ & BOM packages, Project Management, Material Procurement, and Full Turn-Key Construction.
          </p>

          {/* Value Badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background/80 border border-border shadow-xs backdrop-blur-xs font-medium">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>AS/NZS & PNG Building Code Certified</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background/80 border border-border shadow-xs backdrop-blur-xs font-medium">
              <Wind size={16} className="text-blue-600" />
              <span>Cyclone-Resilient Steel Framing</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background/80 border border-border shadow-xs backdrop-blur-xs font-medium">
              <Calculator size={16} className="text-amber-600" />
              <span>100% Itemized Cost Transparency</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background/80 border border-border shadow-xs backdrop-blur-xs font-medium">
              <Key size={16} className="text-purple-600" />
              <span>Turn-Key or DIY Staged Supply</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Collections Overview Strip */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <span>Official Collections Register (Collections A – E)</span>
            </h2>
            <span className="text-xs text-muted-foreground hidden sm:inline">Click any collection to filter</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {KIT_HOME_COLLECTIONS.map((col) => {
              const isSelected = selectedCategory === col.id;
              return (
                <button
                  key={col.id}
                  onClick={() => setSelectedCategory(isSelected ? 'all' : col.id)}
                  className={cn(
                    "text-left p-3 rounded-2xl border transition-all duration-200 flex flex-col justify-between relative overflow-hidden group",
                    isSelected
                      ? "bg-primary/10 border-primary shadow-sm ring-2 ring-primary/20"
                      : "bg-card hover:bg-muted/40 border-border shadow-2xs hover:border-primary/40"
                  )}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border",
                      col.badgeColor
                    )}>
                      {col.code}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono font-medium">
                      {col.modelsLabel}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {col.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-tight">
                    {col.essence}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Tabs & Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-background p-4 rounded-2xl border border-border shadow-xs">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: `All ${KIT_HOME_MODELS.length} Models` },
              { id: 'collection-a', label: 'Col A (Compact 1B)' },
              { id: 'collection-b', label: 'Col B (Family 2B)' },
              { id: 'collection-c', label: 'Col C (Elevated 3B)' },
              { id: 'collection-d', label: 'Col D (Highset 3B)' },
              { id: 'collection-e', label: 'Col E (Premium 4-5B)' },
              { id: '1-bedroom', label: '1-Bed (4)' },
              { id: '2-bedroom', label: '2-Bed (4)' },
              { id: '3-bedroom', label: '3-Bed (6)' },
              { id: '4-bedroom', label: '4-5 Bed (6)' },
              { id: 'highset', label: 'Highset Stilts (4)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                  selectedCategory === tab.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and Sort controls */}
          <div className="flex items-center gap-2 flex-1 md:max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                type="text"
                placeholder="Search model, code (e.g. TB-SPL1B, Kumul, Sepik)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 rounded-xl bg-muted/30 text-sm"
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
              <option value="recommended">Official Register (#01-#{KIT_HOME_MODELS.length})</option>
              <option value="price-asc">Blueprint Price: Low to High</option>
              <option value="price-desc">Blueprint Price: High to Low</option>
              <option value="area-asc">Area: Small to Large</option>
              <option value="area-desc">Area: Large to Small</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mt-4 px-2 text-xs sm:text-sm text-muted-foreground">
          <p>
            Showing <strong>{filteredModels.length}</strong> of <strong>{KIT_HOME_MODELS.length}</strong> Official Kit Home Models
          </p>
          <span className="text-xs text-primary font-medium">All pricing in Papua New Guinea Kina (PGK)</span>
        </div>

        {/* Grid of Kit Home Models */}
        {filteredModels.length === 0 ? (
          <div className="text-center py-20 bg-background rounded-3xl border border-dashed border-border mt-6">
            <Home className="mx-auto text-muted-foreground mb-3" size={48} />
            <h3 className="text-lg font-bold text-foreground">No kit home models match your search</h3>
            <p className="text-sm text-muted-foreground mt-1">Try resetting your filters or search keywords.</p>
            <Button
              variant="outline"
              className="mt-4 rounded-xl"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 mt-6">
            {filteredModels.map((model) => {
              const cardToggle = getCardToggle(model.id);
              const cardSubtotal = getCardSubtotal(model);

              return (
                <motion.div
                  key={model.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card rounded-3xl border border-border shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Image Container */}
                  <div 
                    onClick={() => openModelConfig(model, false, 'specs')}
                    className="relative aspect-[16/10] overflow-hidden bg-slate-900 cursor-pointer"
                  >
                    <img
                      src={model.image}
                      alt={model.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    
                    {/* Badges on Image */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        {model.officialNumber && (
                          <span className="px-2.5 py-1 rounded-lg bg-black/75 text-amber-300 font-mono text-xs font-bold backdrop-blur-md border border-amber-500/30 shadow-xs">
                            #{String(model.officialNumber).padStart(2, '0')}
                          </span>
                        )}
                        <span className="px-3 py-1 rounded-lg bg-primary/95 text-primary-foreground font-mono text-xs font-bold tracking-wider shadow-md">
                          {model.code}
                        </span>
                        {model.typeLabel && (
                          <span className="px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 text-foreground text-xs font-bold backdrop-blur-xs">
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
                          title="Share kit home model on WhatsApp, Facebook, X, etc."
                          className="px-2.5 py-1 rounded-lg bg-black/65 hover:bg-primary text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1 hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                        >
                          <Share2 size={12} className="text-amber-300" />
                          <span>Share</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openImageZoom(model, 0);
                          }}
                          title="Preview image with zoom options"
                          className="px-2.5 py-1 rounded-lg bg-black/65 hover:bg-black/90 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1 hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                        >
                          <ZoomIn size={12} className="text-primary" />
                          <span>Preview</span>
                        </button>
                        {model.isHighset ? (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-600/90 text-white text-xs font-bold backdrop-blur-xs shadow-xs flex items-center gap-1">
                            <Layers size={12} />
                            Elevated Stilt
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-black/60 text-slate-200 text-xs font-medium backdrop-blur-xs">
                            {model.stories === 1 ? 'Single Storey' : '2-Storey'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom overlay on image */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div>
                        <div className="text-[11px] font-semibold text-amber-300/90 uppercase tracking-wider mb-0.5">
                          {model.collectionName}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                          {model.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-200 line-clamp-1">
                          {model.tagline}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 text-white backdrop-blur-md border border-white/20 text-xs font-bold shrink-0">
                        <Maximize2 size={13} className="text-primary" />
                        <span>{model.buildingAreaSqm} m²</span>
                      </div>
                    </div>
                  </div>

                  {/* Model Specs Quick Bar */}
                  <div className="grid grid-cols-4 divide-x divide-border border-b border-border bg-muted/20 py-2.5 px-2 text-center text-xs font-medium">
                    <div className="flex items-center justify-center gap-1.5">
                      <Bed size={15} className="text-primary" />
                      <span><strong>{model.bedrooms}</strong> {model.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <Bath size={15} className="text-primary" />
                      <span><strong>{model.bathrooms}</strong> {model.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <Maximize2 size={15} className="text-primary" />
                      <span><strong>{model.buildingAreaSqm}</strong> m²</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground truncate px-1">
                      <span>{model.dimensions}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    {/* Description & Design Essence */}
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {model.description}
                      </p>

                      {/* Design Essence Callout */}
                      {model.designEssence && (
                        <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground text-[11px] uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                            <Sparkles size={12} className="text-primary" />
                            Architectural & Cultural Essence:
                          </span>
                          <p className="italic text-foreground/85 leading-relaxed">
                            "{model.designEssence}"
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5">
                        {model.features.slice(0, 3).map((feat, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted/60 text-[11px] text-foreground font-medium"
                          >
                            <Check size={11} className="text-emerald-600 shrink-0" />
                            <span className="truncate max-w-[200px]">{feat}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* PRICING & OPTIONS BREAKDOWN SECTION (CRITICAL USER REQUIREMENT) */}
                    <div className="rounded-2xl bg-muted/30 border border-border p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-border/60">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Itemized Price Structure
                        </span>
                        <span className="text-[11px] font-medium text-primary">Interactive Options</span>
                      </div>

                      {/* 1. Preferred Design Blueprint Price (Base) */}
                      <div className="flex items-center justify-between text-sm py-1">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                            <FileText size={12} />
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">Blueprint PDF Pack</span>
                            <span className="ml-1.5 text-[10px] text-muted-foreground">(Plans with Dimensions &amp; Elevations)</span>
                          </div>
                        </div>
                        <span className="font-bold text-foreground">
                          K{model.blueprintPrice.toLocaleString()}
                        </span>
                      </div>

                      {/* Complete Construction Drawings Callout */}
                      {model.constructionDrawingsPrice && (
                        <div className="flex items-center justify-between text-xs py-1 px-1 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/40 dark:border-blue-900/40">
                          <span className="text-[11px] font-medium text-foreground">Complete Construction Drawings &amp; Design:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
                            K{model.constructionDrawingsPrice.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {/* 2. Optional BOQ & Material Listing Copy */}
                      <div className="flex items-center justify-between text-sm py-1 hover:bg-muted/40 rounded-lg px-1 transition-colors">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={cardToggle.includeBoqBom}
                            onChange={(e) => setCardToggle(model.id, 'includeBoqBom', e.target.checked)}
                            className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                          />
                          <div className="flex items-center gap-1.5">
                            <Layers size={13} className="text-amber-600" />
                            <span className="text-xs font-medium text-foreground">Complete BOQ &amp; Material Listing Copy</span>
                          </div>
                        </label>
                        <span className="text-xs font-bold text-foreground">
                          +K{model.boqBomPrice.toLocaleString()}
                        </span>
                      </div>

                      {/* 3. Optional Project Management Fee */}
                      <div className="flex items-center justify-between text-sm py-1 hover:bg-muted/40 rounded-lg px-1 transition-colors">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={cardToggle.includeProjectManagement}
                            onChange={(e) => setCardToggle(model.id, 'includeProjectManagement', e.target.checked)}
                            className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                          />
                          <div className="flex items-center gap-1.5">
                            <HardHat size={13} className="text-indigo-600" />
                            <span className="text-xs font-medium text-foreground">Project Management Fee</span>
                          </div>
                        </label>
                        <span className="text-xs font-bold text-foreground">
                          +K{model.projectManagementFee.toLocaleString()}
                        </span>
                      </div>

                      {/* 4. Optional Material Procurement Fee */}
                      <div className="flex items-center justify-between text-sm py-1 hover:bg-muted/40 rounded-lg px-1 transition-colors">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={cardToggle.includeMaterialProcurement}
                            onChange={(e) => setCardToggle(model.id, 'includeMaterialProcurement', e.target.checked)}
                            className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                          />
                          <div className="flex items-center gap-1.5">
                            <Truck size={13} className="text-emerald-600" />
                            <span className="text-xs font-medium text-foreground">Material Procurement & Logistics</span>
                          </div>
                        </label>
                        <span className="text-xs font-bold text-foreground">
                          +K{model.materialProcurementFee.toLocaleString()}
                        </span>
                      </div>

                      {/* 5. Optional Kitset Base Materials */}
                      <div className="flex items-center justify-between text-sm py-1 hover:bg-muted/40 rounded-lg px-1 transition-colors">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={cardToggle.includeKitMaterials}
                            onChange={(e) => setCardToggle(model.id, 'includeKitMaterials', e.target.checked)}
                            className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                          />
                          <div className="flex items-center gap-1.5">
                            <Building2 size={13} className="text-slate-600" />
                            <span className="text-xs font-medium text-foreground">Kitset Structural Materials Pack</span>
                          </div>
                        </label>
                        <span className="text-xs font-bold text-foreground">
                          +K{model.kitMaterialBasePrice.toLocaleString()}
                        </span>
                      </div>

                      {/* 6. Optional Project Contingency Provision (for models with contingency configured, like M10) */}
                      {(model.contingencyFee || model.addOns?.contingencyPrice) && (
                        <div className="flex items-center justify-between text-sm py-1.5 hover:bg-muted/40 rounded-lg px-1 transition-colors border-t border-dashed border-border/80 pt-1.5 mt-0.5 bg-amber-500/5">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={cardToggle.includeContingency}
                              onChange={(e) => setCardToggle(model.id, 'includeContingency', e.target.checked)}
                              className="rounded border-amber-400 text-amber-600 focus:ring-amber-500 w-4 h-4"
                            />
                            <div className="flex items-center gap-1.5">
                              <ShieldAlert size={13} className="text-amber-600" />
                              <span className="text-xs font-semibold text-foreground">Project Contingency Provision</span>
                            </div>
                          </label>
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                            +K{(model.contingencyFee || model.addOns?.contingencyPrice || 0).toLocaleString()}
                          </span>
                        </div>
                      )}

                      {/* Dynamic Calculated Subtotal based on chosen options */}
                      <div className="pt-2 border-t border-border flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">
                          Selected Options Subtotal:
                        </span>
                        <span className="text-sm font-extrabold text-primary">
                          K{cardSubtotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* OPTIONAL INTERIOR SELECTION DISPLAY SAMPLES (2x Kitchen & 2x Wardrobe) */}
                    <div className="p-3 rounded-2xl bg-muted/20 border border-border space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Palette size={13} className="text-primary" />
                          <span className="text-xs font-bold text-foreground">
                            Optional Interior Finish Selections
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          4 Styles Available
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Customize your kit home with luxury kitchen cabinetry and master bedroom wardrobe packages:
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {getFinishOptionsForModel(model).map((finish) => (
                          <div 
                            key={finish.id}
                            className="group relative rounded-xl overflow-hidden border border-border/70 bg-background hover:border-primary/50 transition-all cursor-pointer flex flex-col"
                            onClick={() => openModelConfig(model, true, 'builder')}
                            title={`Click to configure: ${finish.name} (+K${finish.price.toLocaleString()})`}
                          >
                            <div className="aspect-[4/3] w-full overflow-hidden relative bg-muted">
                              <img
                                src={finish.image}
                                alt={finish.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                              <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs uppercase">
                                {finish.category === 'kitchen' ? 'Kitchen' : finish.category === 'wardrobe' ? 'Wardrobe' : 'TV Unit'}
                              </span>
                            </div>
                            <div className="p-1.5 flex flex-col justify-between flex-1">
                              <div className="text-[11px] font-semibold text-foreground truncate" title={finish.name}>
                                {finish.name}
                              </div>
                              <div className="text-[10px] font-bold text-primary mt-0.5">
                                +K{finish.price.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FULL TURN-KEY PRICE HERO BOX */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-purple-500/10 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Key size={15} className="text-primary" />
                          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                            Full Turn-Key Package
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Complete Design, Engineering, Procurement & Construction
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        {model.isTurnKeyCostingInProgress ? (
                          <div className="flex flex-col items-start sm:items-end">
                            <span className="text-xs font-medium text-muted-foreground block">
                              Turn-Key Handover Price
                            </span>
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs font-bold px-2.5 py-1 mt-0.5">
                              Costing in Progress
                            </Badge>
                            <span className="text-[10px] text-muted-foreground block mt-0.5">
                              Under establishment — Inquire for custom quote
                            </span>
                          </div>
                        ) : (
                          <>
                            <span className="text-xs font-medium text-muted-foreground block">
                              {cardToggle.includeContingency && (model.contingencyFee || model.addOns?.contingencyPrice)
                                ? 'Turn-Key + Contingency' 
                                : 'Ready to Move In'}
                            </span>
                            <span className="text-xl font-black text-foreground">
                              K{(model.fullTurnKeyPrice + (cardToggle.includeContingency ? (model.contingencyFee || model.addOns?.contingencyPrice || 0) : 0)).toLocaleString()}
                            </span>
                            {cardToggle.includeContingency && (model.contingencyFee || model.addOns?.contingencyPrice) ? (
                              <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 block font-mono">
                                Base K{model.fullTurnKeyPrice.toLocaleString()} + K{(model.contingencyFee || model.addOns?.contingencyPrice || 0).toLocaleString()} Contingency
                              </span>
                            ) : (
                              <span className="text-[10px] text-muted-foreground block font-mono">
                                PGK {Math.round(model.fullTurnKeyPrice / model.buildingAreaSqm).toLocaleString()} / m²
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-1">
                      <div className="grid grid-cols-2 gap-2.5">
                        <Button
                          variant="outline"
                          className="rounded-xl h-10 text-xs font-semibold"
                          onClick={() => openModelConfig(model, false, 'specs')}
                        >
                          <Info size={14} className="mr-1.5" />
                          View Details &amp; Blueprint
                        </Button>
                        <Button
                          className="rounded-xl h-10 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                          onClick={() => openModelConfig(model, true, 'builder')}
                        >
                          <Calculator size={14} className="mr-1.5" />
                          Configure &amp; Quote
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          className="flex-1 rounded-xl h-9 text-xs font-medium border border-border/80 text-foreground hover:bg-muted"
                          onClick={() => {
                            setSowModalModel(model);
                            setIsSowModalOpen(true);
                          }}
                        >
                          <Download size={13} className="mr-1.5 text-primary" />
                          <span>Scope of Works (PDF)</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-xl h-9 px-3 text-xs font-semibold border-border/80 text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors cursor-pointer"
                          onClick={() => openShareModal(model)}
                          title="Share this model directly on WhatsApp, Facebook, X, or copy link"
                        >
                          <Share2 size={13} className="mr-1 text-primary" />
                          <span>Share</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* PACKAGE TIERS EXPLANATION SECTION */}
        <div className="mt-20 bg-background rounded-3xl border border-border p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Transparent Inclusions</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground mt-1">
              Understanding Our Kit Home Package Options
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Whether you need only certified architectural blueprints, material supply, or full turn-key building construction in PNG, Techtural BuiltIn lets you tailor every service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PACKAGE_TIERS_INFO.map((tier) => (
              <div
                key={tier.id}
                className="p-6 rounded-2xl bg-muted/20 border border-border hover:border-primary/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold mb-4">
                    {tier.id === 'blueprint' && <FileText size={20} />}
                    {tier.id === 'boq_bom' && <Layers size={20} />}
                    {tier.id === 'project_management' && <HardHat size={20} />}
                    {tier.id === 'material_procurement' && <Truck size={20} />}
                    {tier.id === 'turn_key' && <Key size={20} />}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                  <p className="text-xs text-primary font-medium mt-0.5">{tier.shortDesc}</p>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                    {tier.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-border/60 space-y-1.5">
                    <span className="text-[11px] font-bold text-foreground uppercase tracking-wider block mb-2">
                      Key Deliverables:
                    </span>
                    {tier.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scope of Works Document PDF Download Banner */}
          <div className="mt-8 p-5 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-primary shrink-0" />
                <h4 className="text-sm font-bold text-foreground">
                  Need the Full Technical Scope of Works Document (PDF)?
                </h4>
              </div>
              <p className="text-xs text-muted-foreground max-w-2xl">
                For complete technical specifications, bill of quantities methodology, and contract stage gates for any kit home model, contact Techtural BuiltIn directly to receive the comprehensive Scope of Works PDF document.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Button
                variant="outline"
                className="text-xs font-semibold rounded-xl bg-background"
                onClick={() => {
                  setSowModalModel(KIT_HOME_MODELS[0]);
                  setIsSowModalOpen(true);
                }}
              >
                <Download size={13} className="mr-1.5 text-primary" />
                Inquire SOW Document
              </Button>
              <a
                href={buildWhatsAppLink(
                  `Halo Techtural BuiltIn, I would like to request the official Scope of Works PDF document and deliverables breakdown for your Kit Home models.`,
                  PRIMARY_WHATSAPP_NUMBER
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <MessageSquare size={13} />
                WhatsApp Techtural
              </a>
            </div>
          </div>
        </div>

        {/* WHY CHOOSE TECHTURAL KIT HOMES */}
        <div className="mt-16 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                The Techtural BuiltIn Advantage
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 leading-tight">
                Why Techtural Kit Homes Are Built Better for Papua New Guinea
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
                Traditional construction in PNG often suffers from material wastage, unpredictable contractor delays, 
                and budget blowouts. Our precision kit homes combine computer-controlled steel framing, pre-tested engineering, 
                and structured procurement to deliver faster, stronger, and more affordable homes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <ShieldCheck size={20} className="text-emerald-400 mb-2" />
                  <h4 className="font-bold text-sm text-white">Termite & Rot Immune</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Lightweight galvanized steel frames will never rot, warp, crack, or be damaged by termites.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <Wind size={20} className="text-blue-400 mb-2" />
                  <h4 className="font-bold text-sm text-white">Cyclone & Seismic Rated</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Certified to AS/NZS standards, engineered to withstand high Pacific cyclonic wind pressures and tremors.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <Calculator size={20} className="text-amber-400 mb-2" />
                  <h4 className="font-bold text-sm text-white">Zero Budget Surprises</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Fixed-price itemized BOQ/BOM documents prevent unexpected material overruns and price surges.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <Sparkles size={20} className="text-purple-400 mb-2" />
                  <h4 className="font-bold text-sm text-white">50% Faster Build Time</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Pre-punched, numbered components allow on-site framing erection in days rather than months.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/10 rounded-2xl p-6 border border-white/15 backdrop-blur-md">
              <h3 className="text-lg font-bold text-white mb-2">Speak to a Kit Home Specialist</h3>
              <p className="text-xs text-slate-300 mb-4">
                Have custom plot dimensions, remote provincial delivery requirements, or commercial multi-unit needs? We’re ready to assist.
              </p>
              <div className="space-y-3">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-11 font-semibold text-sm"
                  onClick={() => openModelConfig(KIT_HOME_MODELS[0], true)}
                >
                  <PhoneCall size={16} className="mr-2" />
                  Request Custom Consultation
                </Button>
                <div className="text-center">
                  <span className="text-[11px] text-slate-400">
                    Direct Support: techtural782@gmail.com | Port Moresby & Provincial Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ ACCORDION */}
        <div className="mt-16 bg-background rounded-3xl border border-border p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Frequently Asked Questions</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
              Common Questions About Our Kit Homes
            </h2>
          </div>

          <Accordion className="w-full max-w-3xl mx-auto space-y-3">
            <AccordionItem value="item-1" className="border border-border rounded-xl px-4">
              <AccordionTrigger className="text-sm font-bold hover:no-underline">
                Can Techtural freight kit homes to provincial or island locations in PNG?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Yes! We coordinate full containerized sea freight and road transport to all 22 provinces in Papua New Guinea, including Lae, Kokopo, Madang, Mount Hagen, Goroka, Kimbe, Kavieng, and Buka. All structural parts are flat-packed with weatherproof protective wrapping.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-border rounded-xl px-4">
              <AccordionTrigger className="text-sm font-bold hover:no-underline">
                What is the difference between Preferred Blueprint and Full Turn-Key?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                The <strong>Preferred Blueprint</strong> gives you complete certified architectural, structural, electrical, and plumbing engineering plans to submit to your local municipal council or build with your own local team. The <strong>Full Turn-Key Package</strong> is our complete service where Techtural handles everything from municipal approvals and material procurement to full on-site construction, painting, plumbing, fixtures, and final handover.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-border rounded-xl px-4">
              <AccordionTrigger className="text-sm font-bold hover:no-underline">
                Can I customize or modify a standard Kit Home floor plan?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Absolutely. While our {KIT_HOME_MODELS.length} official standard models are pre-engineered for maximum cost savings, our architectural team can adjust room dimensions, add bathrooms, extend verandas, or incorporate sloping-ground subfloor structures to match your exact land topography.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-border rounded-xl px-4">
              <AccordionTrigger className="text-sm font-bold hover:no-underline">
                Are your BOQ & BOM documents accepted by PNG banks for home loans?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Yes. Our Bill of Quantities (BOQ) and Bill of Materials (BOM) are prepared according to standard Quantity Surveying protocols recognized by major PNG financial institutions (BSP, Kina Bank, Westpac, and National Housing schemes) for residential mortgage approvals.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* DETAILED INTERACTIVE MODEL MODAL */}
      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent className="w-[96vw] max-w-5xl sm:max-w-4xl lg:max-w-5xl max-h-[92vh] overflow-y-auto p-0 rounded-3xl border-border shadow-2xl">
          {activeModel && (
            <div className="flex flex-col">
              {/* Modal Header */}
              <div className="relative bg-slate-900 text-white p-5 sm:p-7 border-b border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      {activeModel.officialNumber && (
                        <span className="px-2 py-0.5 rounded-md bg-black/60 text-amber-300 border border-amber-500/30 font-mono text-xs font-bold">
                          #{String(activeModel.officialNumber).padStart(2, '0')}
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-md bg-primary text-primary-foreground font-mono text-xs font-bold">
                        {activeModel.code}
                      </span>
                      {activeModel.typeLabel && (
                        <span className="px-2 py-0.5 rounded-md bg-white/20 text-white text-xs font-bold">
                          {activeModel.typeLabel}
                        </span>
                      )}
                      <span className="text-xs text-slate-300 font-medium">
                        {activeModel.bedrooms} Bed | {activeModel.bathrooms} Bath | {activeModel.buildingAreaSqm} m²
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                      {activeModel.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                      {activeModel.tagline}
                    </p>
                  </div>

                  <div className="flex flex-row sm:flex-col sm:items-end items-center justify-between gap-3 shrink-0">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl px-3.5 py-2 sm:p-3 sm:text-right border border-white/10">
                      <span className="text-[10px] sm:text-[11px] text-slate-300 block">
                        {customSelections.isFullTurnKey && activeModel.isTurnKeyCostingInProgress
                          ? 'Turn-Key Handover Price'
                          : 'Est. Calculated Total'}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-white">
                        {customSelections.isFullTurnKey && activeModel.isTurnKeyCostingInProgress
                          ? 'Costing in Progress'
                          : `K${modalCalculatedTotal.toLocaleString()}`}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-blue-300 block">
                        {customSelections.isFullTurnKey && activeModel.isTurnKeyCostingInProgress
                          ? 'Quotation available on request'
                          : 'PGK (Papua New Guinea Kina)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => openShareModal(activeModel)}
                        className="h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold gap-1.5 shadow-xs cursor-pointer"
                        title="Share this model on social media"
                      >
                        <Share2 size={13} className="text-amber-300" />
                        <span>Share Model</span>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => openImageZoom(activeModel, 0)}
                        className="h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold gap-1.5 shadow-xs cursor-pointer"
                      >
                        <ZoomIn size={13} className="text-primary" />
                        <span>Preview &amp; Zoom</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs System: Placed at the top just below the header */}
              <Tabs value={activeModalTab} onValueChange={(v: any) => setActiveModalTab(v)} className="w-full flex flex-col">
                {/* Dedicated Top Tab Bar directly beneath the header */}
                <div className="sticky top-0 z-20 px-4 sm:px-6 md:px-8 py-2.5 bg-background/95 backdrop-blur-md border-b border-border shadow-xs">
                  <TabsList className="grid grid-cols-3 h-auto p-1 rounded-2xl bg-muted/80 border border-border w-full max-w-3xl mx-auto">
                    <TabsTrigger 
                      value="specs" 
                      className="py-2 sm:py-2.5 px-2 sm:px-4 text-xs sm:text-sm font-bold rounded-xl data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2"
                    >
                      <DraftingCompass size={15} className="text-primary shrink-0" />
                      <span className="truncate">Details &amp; Blueprint</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="builder" 
                      className="py-2 sm:py-2.5 px-2 sm:px-4 text-xs sm:text-sm font-bold rounded-xl data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2"
                    >
                      <Calculator size={15} className="text-emerald-500 shrink-0" />
                      <span className="truncate">Configure &amp; Quote</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="inclusions" 
                      className="py-2 sm:py-2.5 px-2 sm:px-4 text-xs sm:text-sm font-bold rounded-xl data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2"
                    >
                      <ShieldCheck size={15} className="text-blue-500 shrink-0" />
                      <span className="truncate">Deliverables &amp; Scope</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab Content Body with generous view space */}
                <div className="p-4 sm:p-6 md:p-8 flex-1">

                  {/* TAB 1: INTERACTIVE QUOTE BUILDER */}
                  <TabsContent value="builder" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left Column: Configuration Options */}
                      <div className="lg:col-span-7 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                            1. Select Package Tiers
                          </h4>
                          <span className="text-xs text-muted-foreground">Toggle items to update quote</span>
                        </div>

                        {/* Turn-Key Quick Switch */}
                        <div 
                          onClick={() => {
                            const next = !customSelections.isFullTurnKey;
                            setCustomSelections(prev => ({
                              ...prev,
                              isFullTurnKey: next,
                              includeProjectManagement: next,
                              includeMaterialProcurement: next,
                              includeKitMaterials: true,
                              includeBoqBom: true,
                              includeBlueprint: true,
                            }));
                          }}
                          className={cn(
                            "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between",
                            customSelections.isFullTurnKey
                              ? "border-primary bg-primary/5 shadow-xs"
                              : "border-border hover:border-primary/40 bg-card"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-9 h-9 rounded-xl flex items-center justify-center font-bold",
                              customSelections.isFullTurnKey ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                            )}>
                              <Key size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground">Full Turn-Key Construction</p>
                              <p className="text-xs text-muted-foreground">Complete design, procurement & full on-site build</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {activeModel.isTurnKeyCostingInProgress ? (
                              <div className="flex flex-col items-end">
                                <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs font-bold px-2 py-0.5">
                                  Costing in Progress
                                </Badge>
                                <span className="text-[10px] text-muted-foreground mt-0.5">
                                  {customSelections.isFullTurnKey ? "Selected for Quote" : "Handover Price Pending"}
                                </span>
                              </div>
                            ) : (
                              <>
                                <span className="text-sm font-black text-foreground block">
                                  K{activeModel.fullTurnKeyPrice.toLocaleString()}
                                </span>
                                <Badge variant={customSelections.isFullTurnKey ? "default" : "outline"} className="text-[10px]">
                                  {customSelections.isFullTurnKey ? "Selected" : "All-Inclusive"}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Project Contingency Provision (When available on model, e.g. M10) */}
                        {(activeModel.contingencyFee || activeModel.addOns?.contingencyPrice) && (
                          <div className={cn(
                            "p-3.5 rounded-2xl border transition-all flex items-center justify-between",
                            customSelections.includeContingency
                              ? "border-amber-500 bg-amber-500/10 shadow-xs"
                              : "border-border hover:border-amber-500/40 bg-card"
                          )}>
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id="inc-cont-provision"
                                checked={customSelections.includeContingency}
                                onCheckedChange={(c) => setCustomSelections(p => ({ ...p, includeContingency: !!c }))}
                                className="border-amber-500 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                              />
                              <label htmlFor="inc-cont-provision" className="text-xs font-medium cursor-pointer">
                                <div className="flex items-center gap-1.5">
                                  <ShieldAlert size={14} className="text-amber-600" />
                                  <span className="font-bold text-foreground">Project Contingency Provision</span>
                                </div>
                                <span className="text-[11px] text-muted-foreground block">
                                  Applies to {customSelections.isFullTurnKey ? 'Full Turn-Key Contract' : 'Configured Package'} (Site, Freight &amp; Materials Buffer)
                                </span>
                              </label>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-black text-amber-600 dark:text-amber-400 block">
                                +K{(activeModel.contingencyFee || activeModel.addOns?.contingencyPrice || 0).toLocaleString()}
                              </span>
                              <Badge variant={customSelections.includeContingency ? "default" : "outline"} className={cn("text-[10px]", customSelections.includeContingency ? "bg-amber-600 text-white" : "text-amber-600 border-amber-400")}>
                                {customSelections.includeContingency ? "Applied" : "Optional"}
                              </Badge>
                            </div>
                          </div>
                        )}

                        {/* Individual Item Toggles (Active when not in full turn-key mode or for customization) */}
                        <div className="space-y-2.5 pt-2">
                          <h5 className="text-xs font-bold text-muted-foreground uppercase">
                            Individual Service & Material Breakdown
                          </h5>

                          {/* Preferred Blueprint */}
                          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                            <div className="flex items-center gap-2.5">
                              <Checkbox
                                id="inc-bp"
                                checked={customSelections.includeBlueprint || customSelections.isFullTurnKey}
                                disabled={customSelections.isFullTurnKey}
                                onCheckedChange={(c) => setCustomSelections(p => ({ ...p, includeBlueprint: !!c }))}
                              />
                              <label htmlFor="inc-bp" className="text-xs font-medium cursor-pointer">
                                <strong>Blueprint PDF Pack</strong> (Plans with Dimensions &amp; Elevations)
                              </label>
                            </div>
                            <span className="text-xs font-bold text-foreground">
                              K{activeModel.blueprintPrice.toLocaleString()}
                            </span>
                          </div>

                          {/* BOQ & BOM */}
                          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                            <div className="flex items-center gap-2.5">
                              <Checkbox
                                id="inc-boq"
                                checked={customSelections.includeBoqBom || customSelections.isFullTurnKey}
                                disabled={customSelections.isFullTurnKey}
                                onCheckedChange={(c) => setCustomSelections(p => ({ ...p, includeBoqBom: !!c }))}
                              />
                              <label htmlFor="inc-boq" className="text-xs font-medium cursor-pointer">
                                <strong>Complete BOQ &amp; Material Listing Copy</strong> (Itemized Schedule)
                              </label>
                            </div>
                            <span className="text-xs font-bold text-foreground">
                              +K{activeModel.boqBomPrice.toLocaleString()}
                            </span>
                          </div>

                          {/* Project Management */}
                          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                            <div className="flex items-center gap-2.5">
                              <Checkbox
                                id="inc-pm"
                                checked={customSelections.includeProjectManagement || customSelections.isFullTurnKey}
                                disabled={customSelections.isFullTurnKey}
                                onCheckedChange={(c) => setCustomSelections(p => ({ ...p, includeProjectManagement: !!c }))}
                              />
                              <label htmlFor="inc-pm" className="text-xs font-medium cursor-pointer">
                                <strong>Project Management Fee</strong> (Dedicated On-site Quality Supervision)
                              </label>
                            </div>
                            <span className="text-xs font-bold text-foreground">
                              +K{activeModel.projectManagementFee.toLocaleString()}
                            </span>
                          </div>

                          {/* Material Procurement */}
                          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                            <div className="flex items-center gap-2.5">
                              <Checkbox
                                id="inc-proc"
                                checked={customSelections.includeMaterialProcurement || customSelections.isFullTurnKey}
                                disabled={customSelections.isFullTurnKey}
                                onCheckedChange={(c) => setCustomSelections(p => ({ ...p, includeMaterialProcurement: !!c }))}
                              />
                              <label htmlFor="inc-proc" className="text-xs font-medium cursor-pointer">
                                <strong>Material Procurement & Logistics</strong> (Direct Sourcing & Port/Site Freight)
                              </label>
                            </div>
                            <span className="text-xs font-bold text-foreground">
                              +K{activeModel.materialProcurementFee.toLocaleString()}
                            </span>
                          </div>

                          {/* Kitset Materials Base */}
                          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                            <div className="flex items-center gap-2.5">
                              <Checkbox
                                id="inc-kit"
                                checked={customSelections.includeKitMaterials || customSelections.isFullTurnKey}
                                disabled={customSelections.isFullTurnKey}
                                onCheckedChange={(c) => setCustomSelections(p => ({ ...p, includeKitMaterials: !!c }))}
                              />
                              <label htmlFor="inc-kit" className="text-xs font-medium cursor-pointer">
                                <strong>Kitset Structural Materials Pack</strong> (Steel Frame, Cladding, Trusses)
                              </label>
                            </div>
                            <span className="text-xs font-bold text-foreground">
                              +K{activeModel.kitMaterialBasePrice.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Optional Add-on Upgrades */}
                        <div className="pt-2">
                          <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2">
                            Optional Sustainable & Site Upgrades
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <label className="p-3 rounded-xl border border-border bg-muted/20 flex flex-col justify-between cursor-pointer hover:border-primary/50">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={customSelections.includeSolar}
                                  onChange={(e) => setCustomSelections(p => ({ ...p, includeSolar: e.target.checked }))}
                                  className="rounded text-primary focus:ring-primary"
                                />
                                <span className="text-xs font-bold text-foreground">Off-Grid Solar Kit</span>
                              </div>
                              <span className="text-xs text-primary font-bold mt-2">
                                +K{activeModel.addOns?.solarKitPrice?.toLocaleString()}
                              </span>
                            </label>

                            <label className="p-3 rounded-xl border border-border bg-muted/20 flex flex-col justify-between cursor-pointer hover:border-primary/50">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={customSelections.includeRainwater}
                                  onChange={(e) => setCustomSelections(p => ({ ...p, includeRainwater: e.target.checked }))}
                                  className="rounded text-primary focus:ring-primary"
                                />
                                <span className="text-xs font-bold text-foreground">Rainwater Tank Kit</span>
                              </div>
                              <span className="text-xs text-primary font-bold mt-2">
                                +K{activeModel.addOns?.rainwaterSystemPrice?.toLocaleString()}
                              </span>
                            </label>

                            <label className="p-3 rounded-xl border border-border bg-muted/20 flex flex-col justify-between cursor-pointer hover:border-primary/50">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={customSelections.includeCycloneUpgrade}
                                  onChange={(e) => setCustomSelections(p => ({ ...p, includeCycloneUpgrade: e.target.checked }))}
                                  className="rounded text-primary focus:ring-primary"
                                />
                                <span className="text-xs font-bold text-foreground">Cyclone Pier Upgrade</span>
                              </div>
                              <span className="text-xs text-primary font-bold mt-2">
                                +K{activeModel.addOns?.cycloneFoundationUpgradePrice?.toLocaleString()}
                              </span>
                            </label>
                          </div>
                        </div>

                        {/* Optional Interior Finishes Selection (2x Kitchen, 2x Wardrobes) */}
                        <div className="pt-2">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                              <Palette size={13} className="text-primary" />
                              Optional Interior Finishes Selection (Add to Quote)
                            </h5>
                            <span className="text-[10px] text-muted-foreground">Select one or multiple styles</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {getFinishOptionsForModel(activeModel).map((finish) => {
                              const isSelected = customSelections.selectedFinishes.includes(finish.id);
                              return (
                                <div
                                  key={finish.id}
                                  onClick={() => {
                                    setCustomSelections(prev => {
                                      const current = prev.selectedFinishes || [];
                                      const updated = current.includes(finish.id)
                                        ? current.filter(id => id !== finish.id)
                                        : [...current, finish.id];
                                      return { ...prev, selectedFinishes: updated };
                                    });
                                  }}
                                  className={cn(
                                    "flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer select-none",
                                    isSelected
                                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                                      : "border-border bg-card hover:border-primary/40"
                                  )}
                                >
                                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-border bg-muted">
                                    <img
                                      src={finish.image}
                                      alt={finish.name}
                                      className="w-full h-full object-cover"
                                    />
                                    <span className="absolute bottom-0 inset-x-0 bg-black/65 text-[8px] font-bold text-white text-center py-0.5 uppercase tracking-wider">
                                      {finish.category === 'kitchen' ? 'Kitchen' : finish.category === 'wardrobe' ? 'Wardrobe' : 'TV Unit'}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-xs font-bold text-foreground truncate">
                                        {finish.name}
                                      </span>
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => {}} // Handled by parent container click
                                        className="rounded text-primary focus:ring-primary pointer-events-none"
                                      />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                                      {finish.description}
                                    </p>
                                    <div className="text-xs font-bold text-primary mt-1">
                                      +K{finish.price.toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Inquiry Submission Form */}
                      <div className="lg:col-span-5 bg-muted/30 p-5 rounded-2xl border border-border flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between pb-3 border-b border-border">
                            <div>
                              <h4 className="text-sm font-bold text-foreground">Request Official Quote</h4>
                              <p className="text-[11px] text-muted-foreground">Receive PDF breakdown & engineer review</p>
                            </div>
                            <Badge variant="secondary" className="text-xs font-bold font-mono">
                              {customSelections.isFullTurnKey && activeModel.isTurnKeyCostingInProgress
                                ? 'Costing in Progress'
                                : `PGK ${modalCalculatedTotal.toLocaleString()}`}
                            </Badge>
                          </div>

                          <form onSubmit={handleQuoteSubmit} className="space-y-3 mt-3.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div>
                                <Label className="text-xs font-semibold">Your Full Name *</Label>
                                <Input
                                  required
                                  placeholder="e.g. John Kua"
                                  value={quoteForm.clientName}
                                  onChange={(e) => setQuoteForm(p => ({ ...p, clientName: e.target.value }))}
                                  className="h-9 text-xs mt-1 rounded-lg bg-background"
                                />
                              </div>
                              <div>
                                <Label className="text-xs font-semibold">Phone / WhatsApp *</Label>
                                <Input
                                  required
                                  placeholder="e.g. +675 7000 0000"
                                  value={quoteForm.clientPhone}
                                  onChange={(e) => setQuoteForm(p => ({ ...p, clientPhone: e.target.value }))}
                                  className="h-9 text-xs mt-1 rounded-lg bg-background"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div>
                                <Label className="text-xs font-semibold">Email Address *</Label>
                                <Input
                                  required
                                  type="email"
                                  placeholder="e.g. john@example.com"
                                  value={quoteForm.clientEmail}
                                  onChange={(e) => setQuoteForm(p => ({ ...p, clientEmail: e.target.value }))}
                                  className="h-9 text-xs mt-1 rounded-lg bg-background"
                                />
                              </div>
                              <div>
                                <Label className="text-xs font-semibold">Plot Location / Province in PNG *</Label>
                                <Input
                                  required
                                  placeholder="e.g. 8-Mile, Port Moresby"
                                  value={quoteForm.plotLocation}
                                  onChange={(e) => setQuoteForm(p => ({ ...p, plotLocation: e.target.value }))}
                                  className="h-9 text-xs mt-1 rounded-lg bg-background"
                                />
                              </div>
                            </div>

                            <div>
                              <Label className="text-xs font-semibold">Target Timeline</Label>
                              <select
                                value={quoteForm.targetTimeline}
                                onChange={(e) => setQuoteForm(p => ({ ...p, targetTimeline: e.target.value }))}
                                className="w-full h-9 px-2 text-xs rounded-lg border border-input bg-background mt-1"
                              >
                                <option value="Immediate (1-2 months)">Immediate (1-2 months)</option>
                                <option value="3-6 months">3-6 months</option>
                                <option value="6-12 months">6-12 months</option>
                                <option value="Planning / Future Stage">Planning / Future Stage</option>
                              </select>
                            </div>

                            <div>
                              <Label className="text-xs font-semibold">Special Site Notes or Custom Requests</Label>
                              <textarea
                                rows={2}
                                placeholder="e.g. Sloping terrain, need soil testing, interested in bank financing..."
                                value={quoteForm.notes}
                                onChange={(e) => setQuoteForm(p => ({ ...p, notes: e.target.value }))}
                                className="w-full text-xs p-2 rounded-lg border border-input bg-background mt-1 resize-none"
                              />
                            </div>

                            <div className="space-y-3 pt-1">
                              <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-md"
                              >
                                {isSubmitting ? (
                                  <span>Submitting...</span>
                                ) : (
                                  <span className="flex items-center justify-center gap-2">
                                    <Send size={15} />
                                    Submit Official Quotation Request (Portal)
                                  </span>
                                )}
                              </Button>

                              <div className="relative my-2 text-center">
                                <div className="absolute inset-0 flex items-center">
                                  <div className="w-full border-t border-border"></div>
                                </div>
                                <span className="relative px-2 bg-muted text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                  Or Send Direct To Techtural
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <a
                                  href={buildWhatsAppLink(
                                    formatKitHomeQuoteWhatsAppMessage({
                                      modelName: activeModel.name,
                                      modelCode: activeModel.code,
                                      officialNumber: activeModel.officialNumber,
                                      calculatedTotal: modalCalculatedTotal,
                                      isFullTurnKey: customSelections.isFullTurnKey,
                                      isTurnKeyCostingInProgress: activeModel.isTurnKeyCostingInProgress,
                                      selections: customSelections,
                                      clientName: quoteForm.clientName,
                                      clientPhone: quoteForm.clientPhone,
                                      clientEmail: quoteForm.clientEmail,
                                      plotLocation: quoteForm.plotLocation,
                                      targetTimeline: quoteForm.targetTimeline,
                                      notes: quoteForm.notes,
                                    }),
                                    PRIMARY_WHATSAPP_NUMBER
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                                >
                                  <MessageSquare size={14} />
                                  <span>Send Quote via WhatsApp</span>
                                </a>

                                <a
                                  href={buildMailtoLink(
                                    `Kit Home Quote Request: ${activeModel.code} - ${activeModel.name} ${customSelections.isFullTurnKey && activeModel.isTurnKeyCostingInProgress ? '(Turn-Key Costing in Progress)' : `(PGK ${modalCalculatedTotal.toLocaleString()})`}`,
                                    formatKitHomeQuoteWhatsAppMessage({
                                      modelName: activeModel.name,
                                      modelCode: activeModel.code,
                                      officialNumber: activeModel.officialNumber,
                                      calculatedTotal: modalCalculatedTotal,
                                      isFullTurnKey: customSelections.isFullTurnKey,
                                      isTurnKeyCostingInProgress: activeModel.isTurnKeyCostingInProgress,
                                      selections: customSelections,
                                      clientName: quoteForm.clientName,
                                      clientPhone: quoteForm.clientPhone,
                                      clientEmail: quoteForm.clientEmail,
                                      plotLocation: quoteForm.plotLocation,
                                      targetTimeline: quoteForm.targetTimeline,
                                      notes: quoteForm.notes,
                                    }),
                                    PRIMARY_EMAIL
                                  )}
                                  className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-background hover:bg-muted text-foreground text-xs font-bold border border-border shadow-xs transition-colors"
                                >
                                  <Mail size={14} className="text-primary" />
                                  <span>Email Quote Summary</span>
                                </a>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 1: DETAILS & BLUEPRINT */}
                  <TabsContent value="specs" className="space-y-6">
                    {/* Full-Width Interactive Blueprint & 3D Display Preview Box */}
                    <KitHomeDisplayPreviewBox 
                      model={activeModel} 
                      onOpenFullscreen={(idx) => openImageZoom(activeModel, idx)} 
                    />

                    {/* Specifications, Cultural Concept & Deliverables Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Left Column: Dimensions, Structural Compliance & Concept (7 cols) */}
                      <div className="lg:col-span-7 space-y-4">
                        {/* Technical Dimensional Data */}
                        <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                            <Ruler size={13} className="text-primary" /> Technical Dimensional Data
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                            <div className="p-2.5 rounded-xl bg-background border border-border/80">
                              <span className="text-muted-foreground block text-[11px]">Enclosed Area</span>
                              <span className="text-sm font-extrabold text-foreground">{activeModel.buildingAreaSqm} m²</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-background border border-border/80">
                              <span className="text-muted-foreground block text-[11px]">Footprint</span>
                              <span className="text-sm font-extrabold text-foreground">{activeModel.dimensions}</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-background border border-border/80">
                              <span className="text-muted-foreground block text-[11px]">Beds / Baths</span>
                              <span className="text-sm font-extrabold text-foreground">{activeModel.bedrooms}B / {activeModel.bathrooms}B</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-background border border-border/80">
                              <span className="text-muted-foreground block text-[11px]">Ceilings</span>
                              <span className="text-sm font-extrabold text-foreground">2.7m Tropical Airflow</span>
                            </div>
                          </div>

                          {/* Structural Engineering Standards in PNG */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-border/70 text-[11px] text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Wind size={12} className="text-primary shrink-0" />
                              <span>PNG Wind Zone C2</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Layers size={12} className="text-emerald-500 shrink-0" />
                              <span>{activeModel.isHighset ? 'Highset Stilt Frame' : 'Lowset Ground Slab'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Sun size={12} className="text-amber-500 shrink-0" />
                              <span>Passive Shading Eaves</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ShieldCheck size={12} className="text-blue-500 shrink-0" />
                              <span>Seismic Zone 1-4 Rated</span>
                            </div>
                          </div>
                        </div>

                        {/* Concept & Cultural Essence */}
                        {activeModel.designEssence && (
                          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles size={14} className="text-primary" />
                                Architectural &amp; Cultural Essence
                              </span>
                              <Badge variant="outline" className="text-[10px] bg-background">
                                {activeModel.collectionName}
                              </Badge>
                            </div>
                            <p className="italic text-muted-foreground leading-relaxed">
                              "{activeModel.designEssence}"
                            </p>
                          </div>
                        )}

                        {/* Engineering Highlights */}
                        <div className="p-4 rounded-2xl bg-card border border-border">
                          <h5 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-primary" />
                            Model Architectural &amp; Engineering Features:
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {activeModel.features.map((feat, i) => (
                              <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-muted/30 border border-border/50">
                                <CheckCircle2 size={13} className="text-primary mt-0.5 shrink-0" />
                                <span className="text-foreground/90">{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Blueprint Deliverables & Direct Inquiry Form (5 cols) */}
                      <div className="lg:col-span-5 space-y-4">
                        {/* Blueprint Deliverables Card */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-3.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                                <DraftingCompass size={17} />
                              </div>
                              <div>
                                <h4 className="text-sm font-extrabold text-foreground">Blueprint PDF Pack</h4>
                                <p className="text-[11px] text-muted-foreground">Plans with Dimensions &amp; Elevations</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-muted-foreground block font-medium">Standard Rate</span>
                              <span className="text-lg font-black text-primary">PGK {activeModel.blueprintPrice.toLocaleString()}</span>
                              {activeModel.constructionDrawingsPrice && (
                                <span className="text-[10px] text-muted-foreground block font-mono">
                                  Complete Drawings: K{activeModel.constructionDrawingsPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>

                          <ul className="space-y-2 text-xs text-muted-foreground border-t border-primary/15 pt-3">
                            <li className="flex items-start gap-2">
                              <Check size={14} className="text-primary mt-0.5 shrink-0" />
                              <span>Full architectural CAD sets (Plans, 4 Elevations, Sections, Roof Drainage)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check size={14} className="text-primary mt-0.5 shrink-0" />
                              <span>Certified structural engineering (PNG C2 cyclone wind &amp; seismic rated)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check size={14} className="text-primary mt-0.5 shrink-0" />
                              <span>Electrical schematics &amp; plumbing reticulation layouts</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check size={14} className="text-primary mt-0.5 shrink-0" />
                              <span>Pre-stamped for NCDC, Lae City Authority &amp; Provincial Building Boards</span>
                            </li>
                          </ul>

                          {/* Dimensions Issuance Policy Callout */}
                          <div className="p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/40 text-[11px] text-blue-900 dark:text-blue-200 flex items-start gap-2">
                            <DraftingCompass size={14} className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                            <span><strong>Certified Blueprint Notice:</strong> All complete CAD floor plan dimensions and elevation drawings are issued when customers purchase the Blueprint PDF Copy.</span>
                          </div>

                          {/* Quick CTA to Switch to Quote Builder */}
                          <div className="pt-2">
                            <Button
                              type="button"
                              onClick={() => setActiveModalTab('builder')}
                              className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm flex items-center justify-center gap-2"
                            >
                              <Calculator size={14} />
                              <span>Configure &amp; Calculate Total Price</span>
                              <ArrowRight size={13} />
                            </Button>
                          </div>
                        </div>

                        {/* Blueprint & Model Inquiry Form */}
                        <div className="bg-muted/30 p-4 sm:p-5 rounded-2xl border border-border">
                          <div className="flex items-center justify-between pb-3 border-b border-border">
                            <div>
                              <h4 className="text-sm font-bold text-foreground">Inquire or Order Blueprint</h4>
                              <p className="text-[11px] text-muted-foreground">Direct contact with Techtural engineering desk</p>
                            </div>
                            <Badge variant="outline" className="text-[10px] font-mono font-bold bg-background">
                              {activeModel.code}
                            </Badge>
                          </div>

                          <form onSubmit={handleQuoteSubmit} className="space-y-3 mt-3.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div>
                                <Label className="text-xs font-semibold">Your Full Name *</Label>
                                <Input
                                  required
                                  placeholder="e.g. John Kua"
                                  value={quoteForm.clientName}
                                  onChange={(e) => setQuoteForm(p => ({ ...p, clientName: e.target.value }))}
                                  className="h-9 text-xs mt-1 rounded-lg bg-background"
                                />
                              </div>
                              <div>
                                <Label className="text-xs font-semibold">Phone / WhatsApp *</Label>
                                <Input
                                  required
                                  placeholder="e.g. +675 7000 0000"
                                  value={quoteForm.clientPhone}
                                  onChange={(e) => setQuoteForm(p => ({ ...p, clientPhone: e.target.value }))}
                                  className="h-9 text-xs mt-1 rounded-lg bg-background"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div>
                                <Label className="text-xs font-semibold">Email Address *</Label>
                                <Input
                                  required
                                  type="email"
                                  placeholder="e.g. john@example.com"
                                  value={quoteForm.clientEmail}
                                  onChange={(e) => setQuoteForm(p => ({ ...p, clientEmail: e.target.value }))}
                                  className="h-9 text-xs mt-1 rounded-lg bg-background"
                                />
                              </div>
                              <div>
                                <Label className="text-xs font-semibold">Plot Location / Province *</Label>
                                <Input
                                  required
                                  placeholder="e.g. Port Moresby, Lae, Hagen"
                                  value={quoteForm.plotLocation}
                                  onChange={(e) => setQuoteForm(p => ({ ...p, plotLocation: e.target.value }))}
                                  className="h-9 text-xs mt-1 rounded-lg bg-background"
                                />
                              </div>
                            </div>

                            <div>
                              <Label className="text-xs font-semibold">Selected Scope</Label>
                              <select
                                value={quoteForm.targetTimeline}
                                onChange={(e) => setQuoteForm(p => ({ ...p, targetTimeline: e.target.value }))}
                                className="w-full h-9 px-2 text-xs rounded-lg border border-input bg-background mt-1"
                              >
                                <option value="Blueprint PDF Pack (Plans & Elevations)">Blueprint PDF Pack — Plans &amp; Elevations (K{activeModel.blueprintPrice.toLocaleString()})</option>
                                {activeModel.constructionDrawingsPrice && (
                                  <option value="Complete Construction Drawings & Design">Complete Construction Drawings &amp; Design (K{activeModel.constructionDrawingsPrice.toLocaleString()})</option>
                                )}
                                <option value="Complete BOQ & Material Listing Copy">Complete BOQ &amp; Material Listing Copy (+K{activeModel.boqBomPrice.toLocaleString()})</option>
                                <option value="Blueprint + Complete BOQ & Material Listing">Blueprint + Complete BOQ &amp; Material Listing (K{(activeModel.blueprintPrice + activeModel.boqBomPrice).toLocaleString()})</option>
                                {activeModel.constructionDrawingsPrice && (
                                  <option value="Complete Drawings + BOQ & Material Listing">Complete Drawings + BOQ &amp; Material Listing (K{(activeModel.constructionDrawingsPrice + activeModel.boqBomPrice).toLocaleString()})</option>
                                )}
                                <option value="Kitset Structural Materials Supply">Kitset Structural Materials Supply</option>
                                {activeModel.isTurnKeyCostingInProgress ? (
                                  <option value="Full Turn-Key Building Construction (Costing in Progress)">
                                    Full Turn-Key Building Construction (Costing in Progress)
                                  </option>
                                ) : (
                                  <>
                                    <option value="Full Turn-Key Building Construction">Full Turn-Key Building Construction (K{activeModel.fullTurnKeyPrice.toLocaleString()})</option>
                                    {(activeModel.contingencyFee || activeModel.addOns?.contingencyPrice) && (
                                      <option value="Full Turn-Key + Project Contingency">
                                        Full Turn-Key + Project Contingency (K{(activeModel.fullTurnKeyPrice + (activeModel.contingencyFee || activeModel.addOns?.contingencyPrice || 0)).toLocaleString()})
                                      </option>
                                    )}
                                  </>
                                )}
                                <option value="Custom Modifications & Consultation">Custom Architectural Consultation</option>
                              </select>
                            </div>

                            <div>
                              <Label className="text-xs font-semibold">Special Site Notes / Questions</Label>
                              <textarea
                                rows={2}
                                placeholder="e.g. Sloping land, foundation adjustments, soil test inquiry..."
                                value={quoteForm.notes}
                                onChange={(e) => setQuoteForm(p => ({ ...p, notes: e.target.value }))}
                                className="w-full text-xs p-2 rounded-lg border border-input bg-background mt-1 resize-none"
                              />
                            </div>

                            <div className="space-y-3 pt-1">
                              <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md"
                              >
                                {isSubmitting ? (
                                  <span>Submitting...</span>
                                ) : (
                                  <span className="flex items-center justify-center gap-2">
                                    <Send size={14} />
                                    Submit Details &amp; Blueprint Request (Portal)
                                  </span>
                                )}
                              </Button>

                              <div className="relative my-2 text-center">
                                <div className="absolute inset-0 flex items-center">
                                  <div className="w-full border-t border-border"></div>
                                </div>
                                <span className="relative px-2 bg-muted text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                  Or Send Direct To Techtural
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <a
                                  href={buildWhatsAppLink(
                                    formatBlueprintInquiryWhatsAppMessage({
                                      modelName: activeModel.name,
                                      modelCode: activeModel.code,
                                      officialNumber: activeModel.officialNumber,
                                      blueprintPrice: activeModel.blueprintPrice,
                                      selectedScope: quoteForm.targetTimeline,
                                      clientName: quoteForm.clientName,
                                      clientPhone: quoteForm.clientPhone,
                                      clientEmail: quoteForm.clientEmail,
                                      plotLocation: quoteForm.plotLocation,
                                      notes: quoteForm.notes,
                                    }),
                                    PRIMARY_WHATSAPP_NUMBER
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                                >
                                  <MessageSquare size={13} />
                                  <span>WhatsApp Blueprint Desk</span>
                                </a>

                                <a
                                  href={buildMailtoLink(
                                    `Blueprint & Specifications Inquiry: ${activeModel.code} - ${activeModel.name}`,
                                    formatBlueprintInquiryWhatsAppMessage({
                                      modelName: activeModel.name,
                                      modelCode: activeModel.code,
                                      officialNumber: activeModel.officialNumber,
                                      blueprintPrice: activeModel.blueprintPrice,
                                      selectedScope: quoteForm.targetTimeline,
                                      clientName: quoteForm.clientName,
                                      clientPhone: quoteForm.clientPhone,
                                      clientEmail: quoteForm.clientEmail,
                                      plotLocation: quoteForm.plotLocation,
                                      notes: quoteForm.notes,
                                    }),
                                    PRIMARY_EMAIL
                                  )}
                                  className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-background hover:bg-muted text-foreground text-xs font-bold border border-border shadow-xs transition-colors"
                                >
                                  <Mail size={13} className="text-primary" />
                                  <span>Email Blueprint Desk</span>
                                </a>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 3: DELIVERABLES & INCLUSIONS */}
                  <TabsContent value="inclusions" className="space-y-4">
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                      <h4 className="text-sm font-bold text-foreground mb-2">Standard Kit Inclusions for {activeModel.name}:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {activeModel.inclusions.map((inc, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-background border border-border/80 flex items-start gap-2">
                            <Check size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                            <span className="text-foreground">{inc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-xs text-muted-foreground space-y-2">
                      <h5 className="font-bold text-foreground flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                        <Info size={14} />
                        Municipal Building Approvals in PNG
                      </h5>
                      <p>
                        All Techtural Builtin Kit Home blueprints are stamped and certified by licensed structural engineers. We provide full compliance documentation for National Capital District Commission (NCDC), Lae City Authority, and provincial urban safety boards.
                      </p>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>

              {/* Modal Footer */}
              <div className="bg-muted/40 p-4 px-6 border-t border-border flex items-center justify-between">
                <Button
                  variant="ghost"
                  className="rounded-xl text-xs"
                  onClick={() => setIsConfigModalOpen(false)}
                >
                  Close
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="rounded-xl text-xs"
                    onClick={() => {
                      toast.info(`Quotation for ${activeModel.code} calculated at PGK ${modalCalculatedTotal.toLocaleString()}`);
                    }}
                  >
                    <Download size={14} className="mr-1.5" />
                    Save Configuration
                  </Button>
                  <Button
                    className="rounded-xl text-xs font-bold bg-primary text-primary-foreground"
                    onClick={() => setActiveModalTab('builder')}
                  >
                    Proceed to Request Quote
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* FULLSCREEN IMAGE PREVIEW & ZOOM LIGHTBOX */}
      <KitHomeImageZoomModal
        isOpen={isPreviewZoomOpen}
        onClose={() => setIsPreviewZoomOpen(false)}
        images={previewImages}
        initialIndex={previewZoomInitialIndex}
        modelName={previewZoomModel?.name || ''}
        modelCode={previewZoomModel?.code || ''}
        modelNumber={previewZoomModel?.officialNumber}
      />

      {/* SCOPE OF WORKS MODAL */}
      <KitHomeScopeOfWorksModal
        isOpen={isSowModalOpen}
        onClose={() => setIsSowModalOpen(false)}
        model={sowModalModel}
      />

      {/* SOCIAL MEDIA SHARE MODAL */}
      <ModelShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        model={shareModalModel}
      />
    </div>
  );
}
