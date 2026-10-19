import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Download, 
  Maximize2, 
  RefreshCw, 
  Sliders, 
  Layers, 
  Compass, 
  Sun, 
  TreePine, 
  Box, 
  Check, 
  ArrowRight,
  Info,
  Share2,
  ExternalLink,
  Zap,
  Building2,
  BookmarkPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { auth, signInWithGoogle, saveContainerDesign, getSavedContainerDesigns } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export interface ContainerPreset {
  id: string;
  name: string;
  subtitle: string;
  config: {
    configuration: string;
    style: string;
    cladding: string;
    roofing: string;
    environment: string;
    timeOfDay: string;
    aspectRatio: string;
    customNotes: string;
  };
}

export const PRESETS: ContainerPreset[] = [
  {
    id: 'coastal-40ft',
    name: 'Pacific Coastal 40ft Villa',
    subtitle: 'Single 40ft High-Cube with wide timber deck and ocean views',
    config: {
      configuration: 'Single 40ft High-Cube shipping container with full-length floor-to-ceiling glass sliding doors, extended hardwood veranda deck, and outdoor living area',
      style: 'Tropical Modern PNG with timber louvers, black architectural steel trim, and minimalist lines',
      cladding: 'Industrial charcoal container corrugation contrasted with warm Kwila timber battens and matte black trim',
      roofing: 'Elevated tropical fly-roof system with integrated solar panels and deep shading eaves',
      environment: 'Pacific coastal beach setting with tropical palm trees, white sand, and turquoise ocean background in Papua New Guinea',
      timeOfDay: 'Bright tropical daylight with vibrant natural sunlight and blue skies',
      aspectRatio: '16:9',
      customNotes: 'Include stylish outdoor lounge seating, native PNG plants in concrete planters, and outdoor timber pergola.'
    }
  },
  {
    id: 'duplex-stacked',
    name: '2-Storey Stacked Urban Duplex',
    subtitle: 'Two 40ft containers stacked with cantilevered upper balcony',
    config: {
      configuration: 'Two stacked 40ft shipping containers in a cross-cantilever layout creating a 2-storey home with an upper deck balcony and sheltered ground-floor patio',
      style: 'Contemporary Architectural Hybrid with expansive glass corners and steel staircase',
      cladding: 'Deep matte navy and warm cedar timber slat cladding with dark framed modern windows',
      roofing: 'Upper rooftop garden terrace with steel balustrade and integrated rain canopy',
      environment: 'Modern Port Moresby suburban hills residential landscape with neat paved driveway and security fencing',
      timeOfDay: 'Golden hour sunset with warm glowing sky and soft dramatic architectural lighting',
      aspectRatio: '16:9',
      customNotes: 'Show external architectural steel staircase, under-deck LED strip lighting, and lush tropical landscaping.'
    }
  },
  {
    id: 'l-shape-family',
    name: 'Twin-L 40ft Modular Residence',
    subtitle: 'Two 40ft containers arranged in an L-shape around a central courtyard',
    config: {
      configuration: 'Two 40ft shipping containers joined in an L-shape configuration surrounding a sheltered central timber courtyard and plunge pool',
      style: 'Modern Tropical Eco-Resort aesthetic with wide folding glass doors connecting indoors and outdoors',
      cladding: 'Natural Kwila timber vertical cladding covering 50% of container body, raw dark steel on accents',
      roofing: 'Double-pitch tropical fly-roof with ventilated ridge cap and large overhangs for torrential tropical rain protection',
      environment: 'Lush tropical rainforest garden clearing with native PNG ferns, banana plants, and manicured grass lawn',
      timeOfDay: 'Crisp morning daylight with soft diffused tropical lighting',
      aspectRatio: '16:9',
      customNotes: 'Include a central timber deck with recessed seating and plunge pool, open-concept kitchen looking into the garden.'
    }
  },
  {
    id: 'highset-resilient',
    name: 'Highset Sepik Flood-Resilient Modular',
    subtitle: 'Elevated on heavy-duty galvanized steel stilts for slope and flood safety',
    config: {
      configuration: 'Elevated highset modular home made of 2 shipping containers supported 2.5 meters off the ground on heavy galvanized structural steel stilts',
      style: 'Traditional-Modern Sepik fusion with elevated breezeway, high ceilings, and full perimeter airflow vents',
      cladding: 'Durable Colorbond corrugated sheeting with woven bamboo patterned external privacy screens',
      roofing: 'Steep pitch butterfly roof designed for maximum passive air ventilation and large volume rainwater collection',
      environment: 'Tropical hillside terrain overlooking lush river valley with mist in the distant PNG mountains',
      timeOfDay: 'Late afternoon daylight with dramatic cloud formations over green mountain ridges',
      aspectRatio: '16:9',
      customNotes: 'Show open ground-level shaded parking/workshop space under the house, steel access staircase, and expansive view deck.'
    }
  },
  {
    id: 'quad-estate',
    name: 'Quad-Cluster 4-Bed Family Estate',
    subtitle: 'Four modular containers forming a luxury 4-bedroom compound',
    config: {
      configuration: 'Four interconnected 40ft shipping containers forming a spacious 140 sqm 4-bedroom luxury family estate with a central glass atrium pavilion',
      style: 'Ultra-modern luxury tropical estate with high ceilings and integrated outdoor entertainment zones',
      cladding: 'Smooth architectural composite panels in off-white combined with exposed black container corrugation and timber panels',
      roofing: 'Monopitch solar roof structure with generous 1.5-meter eave overhangs and concealed gutters',
      environment: 'Spacious landscaped acreage with tropical palm trees, perimeter solar lighting, and mountain backdrop',
      timeOfDay: 'Dusk / Twilight with warm amber interior room lighting visible through large glass windows',
      aspectRatio: '16:9',
      customNotes: 'Include large glass sliding facades, illuminated timber walkways, outdoor kitchen pavilion, and clean concrete driveway.'
    }
  }
];

const CONFIG_OPTIONS = [
  { id: '20ft-single', label: 'Single 20ft Cargo Studio (15 m²)', prompt: 'Single 20ft shipping container converted into an efficient modern compact studio suite with full glass facade, timber entry porch, and side window.' },
  { id: '40ft-single', label: 'Single 40ft High-Cube Villa (30 m²)', prompt: 'Single 40ft High-Cube shipping container converted into a 1-bedroom luxury modern dwelling with large double glass sliding doors and full-length timber deck.' },
  { id: '40ft-twin-l', label: 'Twin-L 40ft Modular (60 m²)', prompt: 'Two 40ft shipping containers joined in an L-shape configuration with connected corner deck, open living room and separate private bedroom wing.' },
  { id: 'stacked-duplex', label: 'Stacked 2-Storey Duplex (60 m²)', prompt: 'Two 40ft containers stacked in a cross or offset 2-storey configuration with upper floor cantilevered balcony, outdoor steel staircase, and shaded ground patio.' },
  { id: 'highset-stilts', label: 'Highset Elevated on Steel Stilts (Flood/Slope)', prompt: 'Highset container home elevated 2.5 meters above ground level on galvanized heavy steel columns with undercroft parking, large timber deck, and steel stairs.' },
  { id: 'quad-cluster', label: 'Quad-Cluster 4-Bed Estate (120 m²)', prompt: 'Four 40ft shipping containers arranged in a modular cluster with central open-plan breezeway living space, 4 bedrooms, and wraparound veranda.' },
];

const STYLE_OPTIONS = [
  { id: 'tropical-png', label: 'Tropical PNG Modern', prompt: 'Tropical Papua New Guinea modern architecture with Kwila timber louvers, wide eaves, natural cross-ventilation, and black steel accents.' },
  { id: 'industrial-chic', label: 'Industrial Chic', prompt: 'Modern industrial-chic aesthetic with exposed charcoal corrugations, raw steel beams, black framed floor-to-ceiling glass, and warm timber highlights.' },
  { id: 'coastal-luxury', label: 'Pacific Coastal Luxury', prompt: 'Resort-style Pacific coastal architecture with white and teak wood accents, huge glass sliding doors, and spacious sun deck.' },
  { id: 'eco-highland', label: 'Highland Eco-Lodge', prompt: 'Highland PNG eco-lodge styling with insulated weatherboard accents, stone foundation plinths, high fly-roof, and cozy modern warmth.' },
  { id: 'minimalist', label: 'Minimalist Nordic-Tropical', prompt: 'Clean minimalist Scandinavian-tropical fusion with pale cedar slats, sharp geometric lines, and seamless indoor-outdoor transitions.' },
];

const CLADDING_OPTIONS = [
  { id: 'corrugation-timber', label: 'Exposed Container & Kwila Hardwood', prompt: 'Exposed dark container steel corrugation combined with vertical warm Kwila timber battens and matte dark framing.' },
  { id: 'colorbond-ultra', label: 'Colorbond Ultra & Timber Slats', prompt: 'Colorbond Ultra architectural steel wall cladding in Monument grey with contrasting natural wood panels.' },
  { id: 'smooth-composite', label: 'Smooth Architectural Panels & Glass', prompt: 'Smooth composite architectural panels in warm white and slate grey with extensive structural glazing.' },
  { id: 'bamboo-timber', label: 'Woven Bamboo & Sustainable Timber', prompt: 'Sustainable timber cladding with woven bamboo exterior privacy screens and tropical weatherboarding.' },
];

const ROOF_OPTIONS = [
  { id: 'fly-roof', label: 'Tropical Fly-Roof / Double-Roof (Solar)', prompt: 'Elevated tropical double-roof fly-roof frame with wide 1.2m overhangs for maximum passive cooling and rooftop solar panels.' },
  { id: 'butterfly-roof', label: 'Butterfly Rainwater Roof', prompt: 'Inverted butterfly roof with central water harvesting channel and high clerestory windows under eaves.' },
  { id: 'terrace-roof', label: 'Rooftop Deck & Pergola', prompt: 'Reinforced flat rooftop terrace garden with timber decking, steel safety balustrade, and shading pergola.' },
  { id: 'pitched-gable', label: 'Traditional Gable with Eaves', prompt: 'Classic pitched gable roof with ventilated ridge and corrugated metal sheeting tailored for tropical heavy rain.' },
];

const ENVIRONMENT_OPTIONS = [
  { id: 'coastal-beach', label: 'Pacific Coastal Oceanfront', prompt: 'Pacific tropical oceanfront setting with coconut palms, white sand, and turquoise blue sea backdrop in Papua New Guinea.' },
  { id: 'highland-slope', label: 'Highland Hillside & Mountain', prompt: 'Scenic PNG highland hillside terrain with lush green rainforest ridges and misty blue mountain panorama.' },
  { id: 'rainforest-clearing', label: 'Tropical Rainforest Eco-Clearing', prompt: 'Lush green tropical rainforest clearing surrounded by exotic palms, ferns, and manicured grass garden.' },
  { id: 'suburban-compound', label: 'Urban Suburban Compound (Port Moresby)', prompt: 'Suburban Port Moresby residential allotment with paved driveway, security perimeter, and tropical landscaping.' },
];

const LIGHTING_OPTIONS = [
  { id: 'daylight', label: 'Bright Tropical Sunlight', prompt: 'Bright midday tropical sunlight with clear blue sky and crisp realistic architectural shadows.' },
  { id: 'golden-hour', label: 'Golden Hour Sunset Glow', prompt: 'Warm golden hour sunset lighting with rich orange and amber sky reflecting on glass and timber surfaces.' },
  { id: 'twilight-evening', label: 'Twilight / Night with Warm Interior Glow', prompt: 'Atmospheric twilight evening with glowing warm interior lighting, deck uplights, and deep cobalt sky.' },
];

interface GeneratedHistoryItem {
  id: string;
  imageUrl: string;
  specs: {
    configTitle: string;
    styleTitle: string;
    claddingTitle: string;
    roofTitle: string;
    envTitle: string;
  };
  prompt: string;
  timestamp: string;
}

interface ContainerAiVisualizerProps {
  initialConfig?: {
    houseType?: string;
    layout?: string;
    material?: string;
    style?: string;
  };
}

export default function ContainerAiVisualizer({ initialConfig }: ContainerAiVisualizerProps) {
  const [selectedConfig, setSelectedConfig] = useState(CONFIG_OPTIONS[1].prompt);
  const [selectedStyle, setSelectedStyle] = useState(STYLE_OPTIONS[0].prompt);
  const [selectedCladding, setSelectedCladding] = useState(CLADDING_OPTIONS[0].prompt);
  const [selectedRoof, setSelectedRoof] = useState(ROOF_OPTIONS[0].prompt);
  const [selectedEnv, setSelectedEnv] = useState(ENVIRONMENT_OPTIONS[0].prompt);
  const [selectedLighting, setSelectedLighting] = useState(LIGHTING_OPTIONS[0].prompt);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [customNotes, setCustomNotes] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageSpecs, setImageSpecs] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [history, setHistory] = useState<GeneratedHistoryItem[]>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSavingToCloud, setIsSavingToCloud] = useState(false);
  const [cloudSaved, setCloudSaved] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState<any[]>([]);

  // Listen to Auth State
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.uid) {
        loadSavedDesigns(currentUser.uid);
      } else {
        setSavedDesigns([]);
      }
    });
    return () => unsub();
  }, []);

  const loadSavedDesigns = async (uid: string) => {
    try {
      const list = await getSavedContainerDesigns(uid);
      if (list) setSavedDesigns(list);
    } catch (_err) {
      // Non-blocking
    }
  };

  const handleSaveToCloud = async () => {
    if (!currentImage) return;
    if (!user) {
      toast.info('Please sign in with Google to save designs to your private cloud library');
      try {
        const loggedUser = await signInWithGoogle();
        if (!loggedUser) return;
      } catch (_err) {
        return;
      }
    }

    setIsSavingToCloud(true);
    try {
      await saveContainerDesign({
        imageUrl: currentImage,
        configTitle: CONFIG_OPTIONS.find(o => o.prompt === selectedConfig)?.label || 'Custom Container Layout',
        styleTitle: STYLE_OPTIONS.find(o => o.prompt === selectedStyle)?.label || 'Custom Architectural Style',
        claddingTitle: CLADDING_OPTIONS.find(o => o.prompt === selectedCladding)?.label || 'Custom Cladding',
        roofTitle: ROOF_OPTIONS.find(o => o.prompt === selectedRoof)?.label || 'Custom Roof',
        envTitle: ENVIRONMENT_OPTIONS.find(o => o.prompt === selectedEnv)?.label || 'Custom Setting',
        analysis: analysis || null,
        specs: imageSpecs || null,
      });
      setCloudSaved(true);
      toast.success('Design saved to your Firebase cloud portfolio!');
      if (auth.currentUser?.uid) {
        loadSavedDesigns(auth.currentUser.uid);
      }
    } catch (err: any) {
      console.error('Error saving design:', err);
      toast.error('Failed to save design to cloud.');
    } finally {
      setIsSavingToCloud(false);
    }
  };

  // Apply initial config if passed from quiz wizard
  useEffect(() => {
    if (initialConfig?.houseType) {
      if (initialConfig.houseType.includes('Compact')) {
        setSelectedConfig(CONFIG_OPTIONS[0].prompt);
      } else if (initialConfig.houseType.includes('2-Story') || initialConfig.houseType.includes('Luxury')) {
        setSelectedConfig(CONFIG_OPTIONS[3].prompt);
      } else if (initialConfig.houseType.includes('Multi')) {
        setSelectedConfig(CONFIG_OPTIONS[5].prompt);
      }

      if (initialConfig.style === 'tropical') {
        setSelectedStyle(STYLE_OPTIONS[0].prompt);
        setSelectedRoof(ROOF_OPTIONS[0].prompt);
      } else if (initialConfig.style === 'modern') {
        setSelectedStyle(STYLE_OPTIONS[1].prompt);
      }

      if (initialConfig.material?.includes('Timber')) {
        setSelectedCladding(CLADDING_OPTIONS[0].prompt);
      } else if (initialConfig.material?.includes('Concrete') || initialConfig.material?.includes('Steel')) {
        setSelectedCladding(CLADDING_OPTIONS[1].prompt);
      }
    }
  }, [initialConfig]);

  // Handle Preset Selection
  const applyPreset = (preset: ContainerPreset) => {
    setSelectedConfig(preset.config.configuration);
    setSelectedStyle(preset.config.style);
    setSelectedCladding(preset.config.cladding);
    setSelectedRoof(preset.config.roofing);
    setSelectedEnv(preset.config.environment);
    setSelectedLighting(preset.config.timeOfDay);
    setAspectRatio(preset.config.aspectRatio);
    setCustomNotes(preset.config.customNotes);
    toast.success(`Loaded preset: ${preset.name}`);
  };

  const stepsText = [
    'Analyzing container layout geometry & proportions...',
    'Simulating PNG tropical solar shading & passive cooling...',
    'Rendering Kwila timber, Colorbond & corrugated steel textures...',
    'Synthesizing photorealistic architectural 3D visualization...'
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationStep(0);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < stepsText.length - 1 ? prev + 1 : prev));
    }, 2400);

    try {
      const response = await fetch('/api/generate-container-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          configuration: selectedConfig,
          style: selectedStyle,
          cladding: selectedCladding,
          roofing: selectedRoof,
          environment: selectedEnv,
          timeOfDay: selectedLighting,
          aspectRatio,
          customNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate visual render');
      }

      setCurrentImage(data.imageUrl);
      setImageSpecs(data.specs);
      if (data.analysis) {
        setAnalysis(data.analysis);
      }

      // Add to session history
      const newHistoryItem: GeneratedHistoryItem = {
        id: Date.now().toString(),
        imageUrl: data.imageUrl,
        specs: {
          configTitle: CONFIG_OPTIONS.find(o => o.prompt === selectedConfig)?.label || 'Custom Container Layout',
          styleTitle: STYLE_OPTIONS.find(o => o.prompt === selectedStyle)?.label || 'Custom Architectural Style',
          claddingTitle: CLADDING_OPTIONS.find(o => o.prompt === selectedCladding)?.label || 'Custom Cladding',
          roofTitle: ROOF_OPTIONS.find(o => o.prompt === selectedRoof)?.label || 'Custom Roof',
          envTitle: ENVIRONMENT_OPTIONS.find(o => o.prompt === selectedEnv)?.label || 'Custom Setting',
        },
        prompt: data.prompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setHistory((prev) => [newHistoryItem, ...prev]);
      toast.success('Custom container home visual generated successfully!');
    } catch (err: any) {
      console.error('Image generation error:', err);
      toast.error(err.message || 'Could not generate visualization. Please check connection and try again.');
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!currentImage) return;
    const a = document.createElement('a');
    a.href = currentImage;
    a.download = `Techtural-Container-Design-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Visualization render downloaded');
  };

  return (
    <div className="space-y-10" id="container-ai-visualizer">
      {/* Visualizer Hero / Header Card */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-primary/20 rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-bold tracking-wider uppercase border border-primary/25">
              <Sparkles size={14} className="animate-pulse" />
              AI Architectural Visualizer Engine
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground">
              Visualize Your Custom <span className="text-primary">Container Home</span> in 3D
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Configure shipping container layouts, tropical fly-roofs, Kwila timber accents, and PNG terrain settings to generate photorealistic architectural concepts instantly with Gemini AI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="px-3 py-1.5 rounded-xl border-border bg-background/80 backdrop-blur text-xs font-semibold flex items-center gap-1.5">
              <Box size={14} className="text-primary" />
              PNG Climate-Optimized
            </Badge>
            <Badge variant="outline" className="px-3 py-1.5 rounded-xl border-border bg-background/80 backdrop-blur text-xs font-semibold flex items-center gap-1.5">
              <Zap size={14} className="text-amber-500" />
              High-Cube 20ft & 40ft
            </Badge>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="mt-8 pt-6 border-t border-border/60">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
              <Sliders size={13} className="text-primary" />
              Quick Inspiration Presets:
            </span>
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              Click any concept to auto-fill the parameters
            </span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="group flex-shrink-0 px-4 py-2 rounded-2xl bg-background/90 hover:bg-primary/10 border border-border hover:border-primary/50 text-left transition-all text-xs font-medium flex items-center gap-2 shadow-xs"
              >
                <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] group-hover:scale-110 transition-transform">
                  <Box size={12} />
                </div>
                <div>
                  <div className="font-bold text-foreground group-hover:text-primary transition-colors whitespace-nowrap">
                    {preset.name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Controls + Render Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Configuration Controls (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-muted/30 border border-border rounded-[2.5rem] p-6 sm:p-8 space-y-6 shadow-md">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Sliders size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Configuration Parameters</h3>
                  <p className="text-xs text-muted-foreground">Customize structural & architectural specifications</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-[11px] rounded-lg">
                Step-by-Step Tuning
              </Badge>
            </div>

            {/* 1. Container Configuration */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Box size={14} className="text-primary" />
                1. Container Layout & Module Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CONFIG_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedConfig(opt.prompt)}
                    className={cn(
                      "p-3.5 rounded-2xl border text-left transition-all text-xs relative",
                      selectedConfig === opt.prompt
                        ? "bg-primary/10 border-primary text-foreground font-bold shadow-xs ring-1 ring-primary/40"
                        : "bg-background border-border hover:border-primary/40 text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{opt.label}</span>
                      {selectedConfig === opt.prompt && <Check size={14} className="text-primary shrink-0 ml-1" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Architectural Aesthetic */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Building2 size={14} className="text-primary" />
                2. Architectural Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 gap-2">
                {STYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedStyle(opt.prompt)}
                    className={cn(
                      "p-3 rounded-2xl border text-left transition-all text-xs",
                      selectedStyle === opt.prompt
                        ? "bg-primary/10 border-primary text-foreground font-bold shadow-xs ring-1 ring-primary/40"
                        : "bg-background border-border hover:border-primary/40 text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{opt.label}</span>
                      {selectedStyle === opt.prompt && <Check size={12} className="text-primary shrink-0 ml-1" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Cladding & Materials */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers size={14} className="text-primary" />
                3. Exterior Cladding & Finishes
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CLADDING_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedCladding(opt.prompt)}
                    className={cn(
                      "p-3 rounded-2xl border text-left transition-all text-xs",
                      selectedCladding === opt.prompt
                        ? "bg-primary/10 border-primary text-foreground font-bold shadow-xs ring-1 ring-primary/40"
                        : "bg-background border-border hover:border-primary/40 text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{opt.label}</span>
                      {selectedCladding === opt.prompt && <Check size={12} className="text-primary shrink-0 ml-1" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Tropical Shading & Roof */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sun size={14} className="text-primary" />
                4. Climate-Adaptive Roof & Veranda
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ROOF_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedRoof(opt.prompt)}
                    className={cn(
                      "p-3 rounded-2xl border text-left transition-all text-xs",
                      selectedRoof === opt.prompt
                        ? "bg-primary/10 border-primary text-foreground font-bold shadow-xs ring-1 ring-primary/40"
                        : "bg-background border-border hover:border-primary/40 text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{opt.label}</span>
                      {selectedRoof === opt.prompt && <Check size={12} className="text-primary shrink-0 ml-1" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Natural PNG Environment & Atmosphere */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <TreePine size={14} className="text-primary" />
                  5. PNG Landscape Setting
                </label>
                <select
                  value={selectedEnv}
                  onChange={(e) => setSelectedEnv(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  {ENVIRONMENT_OPTIONS.map((env) => (
                    <option key={env.id} value={env.prompt}>
                      {env.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Compass size={14} className="text-primary" />
                  6. Lighting & Time of Day
                </label>
                <select
                  value={selectedLighting}
                  onChange={(e) => setSelectedLighting(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  {LIGHTING_OPTIONS.map((light) => (
                    <option key={light.id} value={light.prompt}>
                      {light.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 7. Aspect Ratio & Custom Details */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  7. Custom Architectural Notes / Specific Requirements
                </label>
                <div className="flex items-center gap-1">
                  {['16:9', '4:3', '1:1'].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors",
                        aspectRatio === ratio
                          ? "bg-primary text-white border-primary"
                          : "bg-background border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                placeholder="e.g. Add an outdoor timber plunge pool, solar panels on the fly-roof, and vertical Kwila battens..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Generate Action Button */}
            <div className="pt-2">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full h-14 rounded-2xl text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    <span>Rendering 3D Concept with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Generate AI Container Visualization</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Visualization Canvas / Render Output (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-muted/30 border border-border rounded-[2.5rem] p-6 sm:p-8 space-y-6 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Architectural Render</h3>
                  <p className="text-xs text-muted-foreground">Photorealistic 3D Concept View</p>
                </div>
              </div>

              {currentImage && (
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullscreen(true)}
                    className="h-8 w-8 p-0 rounded-lg"
                    title="Fullscreen preview"
                  >
                    <Maximize2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    className="h-8 w-8 p-0 rounded-lg"
                    title="Download Render"
                  >
                    <Download size={16} />
                  </Button>
                </div>
              )}
            </div>

            {/* Main Visual Display Area */}
            <div className="relative rounded-3xl overflow-hidden bg-background border border-border/80 aspect-video sm:aspect-16/10 flex items-center justify-center shadow-inner group">
              {isGenerating ? (
                /* Dynamic Loading State */
                <div className="absolute inset-0 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-5 z-20">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-3xl bg-primary/10 border-2 border-primary border-t-transparent animate-spin flex items-center justify-center" />
                    <Sparkles className="absolute inset-0 m-auto text-primary animate-pulse" size={24} />
                  </div>
                  
                  <div className="space-y-2 max-w-xs">
                    <p className="text-xs font-bold text-primary tracking-widest uppercase">
                      Architectural AI Synthesizer
                    </p>
                    <p className="text-sm font-semibold text-foreground transition-all duration-300">
                      {stepsText[generationStep]}
                    </p>
                    <div className="w-48 h-1.5 bg-muted rounded-full mx-auto overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500 rounded-full"
                        style={{ width: `${((generationStep + 1) / stepsText.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : currentImage ? (
                /* Rendered Image */
                <div className="relative w-full h-full">
                  <img
                    src={currentImage}
                    alt="AI Generated Container Home Concept"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-3xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 rounded-3xl">
                    <span className="text-xs font-semibold text-white/90">
                      Techtural BuiltIn • AI 3D Concept
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setIsFullscreen(true)}
                        className="h-8 text-xs rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur border-none"
                      >
                        <Maximize2 size={14} className="mr-1" />
                        Expand
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleSaveToCloud}
                        disabled={isSavingToCloud}
                        className={cn(
                          "h-8 text-xs rounded-xl backdrop-blur border-none",
                          cloudSaved
                            ? "bg-emerald-600/80 text-white"
                            : "bg-white/20 hover:bg-white/30 text-white"
                        )}
                      >
                        <BookmarkPlus size={14} className="mr-1" />
                        {cloudSaved ? 'Saved' : isSavingToCloud ? 'Saving...' : 'Save to Cloud'}
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleDownload}
                        className="h-8 text-xs rounded-xl bg-primary text-white hover:bg-primary/90"
                      >
                        <Download size={14} className="mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty Placeholder State */
                <div className="p-8 text-center space-y-4 max-w-sm">
                  <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <Box size={32} />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-foreground">Ready to Render</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Select your desired container configuration, tropical cladding, and landscape options on the left, then click <strong>Generate</strong>.
                    </p>
                  </div>
                  <Button
                    onClick={handleGenerate}
                    size="sm"
                    variant="outline"
                    className="rounded-xl text-xs font-bold border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Sparkles size={14} className="mr-1.5" />
                    Try Preset Concept
                  </Button>
                </div>
              )}
            </div>

            {/* Spec Breakdown & Actions (Visible when image generated) */}
            {currentImage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 pt-2"
              >
                <div className="p-4 rounded-2xl bg-background border border-border space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-foreground">
                    <span className="flex items-center gap-1.5">
                      <Info size={14} className="text-primary" />
                      Concept Design Summary
                    </span>
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                      Techtural Modular System
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                    <div>
                      <span className="font-semibold text-foreground">Structure:</span>{' '}
                      {CONFIG_OPTIONS.find(o => o.prompt === selectedConfig)?.label.split('(')[0] || 'Modular Container'}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">Roof Type:</span>{' '}
                      {ROOF_OPTIONS.find(o => o.prompt === selectedRoof)?.label.split('(')[0] || 'Fly-Roof'}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">Cladding:</span>{' '}
                      {CLADDING_OPTIONS.find(o => o.prompt === selectedCladding)?.label || 'Hardwood & Steel'}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">Setting:</span>{' '}
                      {ENVIRONMENT_OPTIONS.find(o => o.prompt === selectedEnv)?.label || 'Papua New Guinea'}
                    </div>
                  </div>

                  {/* AI Engineering Metrics */}
                  {analysis && (
                    <div className="mt-3 pt-3 border-t border-border/80 space-y-2.5">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-muted/50 border border-border/50">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Est. PNG Kina Budget</span>
                          <span className="text-xs font-bold text-primary">{analysis.estimatedKinaBudget || 'K95,000 - K140,000'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-muted/50 border border-border/50">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Build Timeline</span>
                          <span className="text-xs font-bold text-foreground">{analysis.buildTimeWeeks || '6 - 8 Weeks'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-muted/50 border border-border/50">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Passive Cooling</span>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{analysis.passiveCoolingEfficiency || '92%'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-muted/50 border border-border/50">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Cyclone Wind Rating</span>
                          <span className="text-xs font-bold text-foreground">{analysis.cyclonicWindRating || 'C2 Certified'}</span>
                        </div>
                      </div>

                      {analysis.engineerAdvice && (
                        <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 text-[11px] text-muted-foreground">
                          <span className="font-bold text-primary block mb-0.5">Engineering Advice (PNG Tropics):</span>
                          {analysis.engineerAdvice}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Next Steps Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    to="/estimator"
                    className="inline-flex items-center justify-center h-11 rounded-xl text-xs font-bold border border-border bg-background hover:bg-muted text-foreground transition-colors"
                  >
                    Calculate Kitset Cost
                    <ArrowRight size={14} className="ml-1.5" />
                  </Link>

                  <Link
                    to="/services"
                    className="inline-flex items-center justify-center h-11 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-white shadow-xs transition-colors"
                  >
                    Request Full Blueprints
                    <ExternalLink size={14} className="ml-1.5" />
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Session History Gallery */}
            {history.length > 0 && (
              <div className="pt-4 border-t border-border space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Session Renders ({history.length})</span>
                  <span className="text-[10px] font-normal lowercase">click to view</span>
                </span>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentImage(item.imageUrl);
                        toast.info(`Loaded render from ${item.timestamp}`);
                      }}
                      className={cn(
                        "rounded-xl overflow-hidden border aspect-video relative group transition-all",
                        currentImage === item.imageUrl
                          ? "ring-2 ring-primary border-transparent scale-95"
                          : "border-border hover:border-primary/50 opacity-70 hover:opacity-100"
                      )}
                    >
                      <img
                        src={item.imageUrl}
                        alt="Saved render"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold">
                        {item.timestamp}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cloud Saved Designs Portfolio (Firebase Firestore) */}
            {savedDesigns.length > 0 && (
              <div className="pt-4 border-t border-border space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <BookmarkPlus size={14} />
                    Cloud Saved Designs ({savedDesigns.length})
                  </span>
                  <span className="text-[10px] font-normal lowercase text-muted-foreground">Firebase Firestore sync</span>
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {savedDesigns.slice(0, 6).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentImage(item.imageUrl);
                        if (item.analysis) setAnalysis(item.analysis);
                        if (item.specs) setImageSpecs(item.specs);
                        toast.info(`Loaded cloud design: ${item.configTitle || 'Container Concept'}`);
                      }}
                      className={cn(
                        "rounded-xl overflow-hidden border p-1 bg-background text-left transition-all group",
                        currentImage === item.imageUrl
                          ? "ring-2 ring-primary border-transparent"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="aspect-video rounded-lg overflow-hidden mb-1.5 relative">
                        <img
                          src={item.imageUrl}
                          alt={item.configTitle || 'Saved Concept'}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p className="text-[10px] font-bold text-foreground truncate px-0.5">
                        {item.configTitle || 'Container Concept'}
                      </p>
                      <p className="text-[9px] text-muted-foreground truncate px-0.5">
                        {item.styleTitle || item.claddingTitle || 'Modern Tropical'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isFullscreen && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8"
            onClick={() => setIsFullscreen(false)}
          >
            <div className="absolute top-6 right-6 flex items-center gap-3 z-10" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="rounded-xl bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Download size={16} className="mr-1.5" />
                Download PNG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(false)}
                className="rounded-xl bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                Close ✕
              </Button>
            </div>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-5xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImage}
                alt="Techtural AI Concept Fullscreen"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-[80vh] rounded-3xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
