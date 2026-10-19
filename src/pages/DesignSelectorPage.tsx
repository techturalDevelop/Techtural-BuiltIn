import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Home, 
  Layout, 
  Layers, 
  Save, 
  RefreshCw,
  Wallet,
  Maximize,
  Users,
  Palette,
  Sparkles,
  Box,
  HelpCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { submitDesignRecommendation } from '@/lib/firebase';
import { toast } from 'sonner';
import ContainerAiVisualizer from '@/components/ContainerAiVisualizer';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  { id: 1, title: 'Budget', description: 'Your investment range', icon: <Wallet size={20} /> },
  { id: 2, title: 'Land', description: 'Available plot size', icon: <Maximize size={20} /> },
  { id: 3, title: 'Family', description: 'Number of residents', icon: <Users size={20} /> },
  { id: 4, title: 'Style', description: 'Aesthetic preference', icon: <Palette size={20} /> },
];

const budgetOptions = [
  { label: 'Economy', value: 'low', range: 'Under K100,000', description: 'Cost-effective solutions' },
  { label: 'Standard', value: 'medium', range: 'K100,000 - K500,000', description: 'Balanced quality & price' },
  { label: 'Premium', value: 'high', range: 'Over K500,000', description: 'High-end luxury finishes' },
];

const landOptions = [
  { label: 'Compact', value: 150, description: 'Under 200 sqm' },
  { label: 'Standard', value: 400, description: '200 - 600 sqm' },
  { label: 'Spacious', value: 800, description: 'Over 600 sqm' },
];

const familyOptions = [
  { label: 'Small', value: 2, description: '1 - 3 People' },
  { label: 'Medium', value: 5, description: '4 - 6 People' },
  { label: 'Large', value: 8, description: '7+ People' },
];

const styleOptions = [
  { label: 'Modern', value: 'modern', description: 'Clean lines & minimalism' },
  { label: 'Traditional', value: 'traditional', description: 'Classic timeless appeal' },
  { label: 'Tropical PNG', value: 'tropical', description: 'Eco-friendly & local flair' },
];

export default function DesignSelectorPage() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'wizard'>('visualizer');
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState({
    budget: '',
    landSize: 0,
    familySize: 0,
    style: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [visualizerInitialConfig, setVisualizerInitialConfig] = useState<any>(null);
  const [showPrototypePreview, setShowPrototypePreview] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const getRecommendation = () => {
    const { budget, landSize, familySize, style } = selections;
    
    let houseType = 'Standard Bungalow';
    let layout = 'Open Concept';
    let material = 'Concrete & Timber';

    // Logic for House Type
    if (familySize > 6) houseType = 'Multi-generational Estate';
    else if (landSize < 200) houseType = 'Compact Studio';
    else if (budget === 'high') houseType = '2-Story Luxury Villa';

    // Logic for Layout
    if (style === 'tropical') layout = 'Courtyard & Veranda';
    else if (style === 'traditional') layout = 'Cellular Traditional';
    else if (landSize < 300) layout = 'Split-Level Vertical';

    // Logic for Material
    if (style === 'tropical') material = 'Bamboo & Sustainable Timber';
    else if (budget === 'high') material = 'Steel & Glass Hybrid';
    else if (budget === 'low') material = 'Pre-fab Concrete Panels';

    return { houseType, layout, material };
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const recommendation = getRecommendation();
      await submitDesignRecommendation({
        inputs: selections,
        recommendations: recommendation,
      });
      toast.success('Design recommendation saved to your profile!');
    } catch (error) {
      toast.error('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleVisualizeRecommendation = () => {
    const rec = getRecommendation();
    setVisualizerInitialConfig({
      houseType: rec.houseType,
      layout: rec.layout,
      material: rec.material,
      style: selections.style,
    });
    setActiveTab('visualizer');
    toast.info(`Transferred ${rec.houseType} specifications to the AI Visualizer!`);
  };

  const reset = () => {
    setCurrentStep(1);
    setShowResults(false);
    setSelections({
      budget: '',
      landSize: 0,
      familySize: 0,
      style: '',
    });
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* COMING SOON NOTICE HERO CARD */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-background to-primary/5 p-6 sm:p-10 shadow-xl overflow-hidden"
        >
          {/* Ambient background decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary/5 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10" />

          <div className="relative z-10 space-y-6">
            {/* Status Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                Coming Soon • Module Notice
              </div>

              <span className="text-xs font-mono font-medium text-muted-foreground bg-muted/60 px-3 py-1 rounded-lg border border-border/60">
                Status: In Engineering &amp; Feature Implementation
              </span>
            </div>

            {/* Headline and Narrative */}
            <div className="space-y-3 max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                Design Selector &amp; AI Recommender Engine
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                <strong>Notice:</strong> We are currently updating, engineering, and calibrating the automated architectural configuration algorithms, multi-parameter PNG site &amp; climate matching engines, and AI generative visualizers for this module. Full interactive functions will be activated for use once features are fully built and implemented.
              </p>
            </div>

            {/* Upcoming Capabilities Roadmap Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-card/90 border border-border/70 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Sparkles size={20} />
                </div>
                <h4 className="text-sm font-bold text-foreground">AI 3D Generative Visualizer</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Generates customized photorealistic 3D container and kitset exterior perspective renders.
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                    <Clock size={11} /> Model Fine-Tuning
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-card/90 border border-border/70 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Layout size={20} />
                </div>
                <h4 className="text-sm font-bold text-foreground">Spatial &amp; Family Matching</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Automated layout calculations mapped to family occupants, room zones, and functional needs.
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                    <Clock size={11} /> Algorithm Calibration
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-card/90 border border-border/70 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Layers size={20} />
                </div>
                <h4 className="text-sm font-bold text-foreground">PNG Climate Adaptation</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Provincial topography, cyclonic wind ratings, and tropical rainfall roofing compliance.
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                    <Clock size={11} /> Engineering Ruleset
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-card/90 border border-border/70 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                  <Wallet size={20} />
                </div>
                <h4 className="text-sm font-bold text-foreground">QuantyPros Live Cost Sync</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Instant synchronization with certified BOQ costing schedules and material procurement fees.
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                    <Clock size={11} /> Pipeline Integration
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Navigation to Active Tools */}
            <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/products?tab=residential-kit-homes">
                  <Button className="rounded-xl h-11 px-5 font-bold shadow-md shadow-primary/20">
                    Browse Kit Homes Catalogue (20 Models)
                    <ArrowRight size={16} className="ml-1.5" />
                  </Button>
                </Link>
                <Link to="/estimator">
                  <Button variant="outline" className="rounded-xl h-11 px-5 font-bold border-border hover:bg-muted">
                    Launch Cost Estimator
                  </Button>
                </Link>
                <HashLink smooth to="/#contact">
                  <Button variant="ghost" className="rounded-xl h-11 px-4 font-semibold text-muted-foreground hover:text-foreground">
                    Inquire With Design Team
                  </Button>
                </HashLink>
              </div>

              {/* Prototype Preview Toggle */}
              <button
                onClick={() => setShowPrototypePreview(prev => !prev)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer bg-background/60 hover:bg-background px-3 py-2 rounded-xl border border-border/60"
              >
                <span>{showPrototypePreview ? 'Hide Development Sandbox' : 'Inspect Prototype Sandbox'}</span>
                {showPrototypePreview ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Prototype Sandbox Section (Only rendered when toggled) */}
        {showPrototypePreview && (
          <div className="space-y-6 pt-4 border-t border-dashed border-border/80">
            {/* Sandbox Notice Banner */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
              <AlertTriangle className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={18} />
              <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <strong className="font-bold">Development Sandbox Preview:</strong> Functions and generative algorithms in this sandbox are currently undergoing engineering calibration. Live interactive capabilities will be activated once development and verification are complete.
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex justify-center">
              <div className="inline-flex p-1.5 rounded-2xl bg-muted/70 border border-border shadow-xs">
                <button
                  onClick={() => setActiveTab('visualizer')}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all",
                    activeTab === 'visualizer'
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Sparkles size={16} />
                  AI 3D Container Visualizer (Preview)
                </button>
                <button
                  onClick={() => setActiveTab('wizard')}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all",
                    activeTab === 'wizard'
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <HelpCircle size={16} />
                  Design Recommender Quiz (Preview)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: AI 3D Container Visualizer */}
        {showPrototypePreview && activeTab === 'visualizer' && (
          <motion.div
            key="tab-visualizer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ContainerAiVisualizer initialConfig={visualizerInitialConfig} />
          </motion.div>
        )}

        {/* Tab 2: Guided Requirement Quiz */}
        {showPrototypePreview && activeTab === 'wizard' && (
          <motion.div
            key="tab-wizard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {!showResults ? (
              <div className="bg-muted/30 border border-border rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-muted">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {/* Step Indicator */}
                <div className="flex justify-between mb-12">
                  {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center gap-2">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                        currentStep >= step.id 
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                          : "bg-background border-border text-muted-foreground"
                      )}>
                        {currentStep > step.id ? <Check size={20} /> : step.icon}
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider hidden sm:block",
                        currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                      )}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Step Content */}
                <div className="min-h-[300px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-bold mb-2">{steps[currentStep-1].title}</h2>
                        <p className="text-muted-foreground">{steps[currentStep-1].description}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {currentStep === 1 && budgetOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setSelections(s => ({ ...s, budget: opt.value }))}
                            className={cn(
                              "p-6 rounded-3xl border-2 text-left transition-all group",
                              selections.budget === opt.value 
                                ? "bg-primary/5 border-primary shadow-md" 
                                : "bg-background border-border hover:border-primary/50"
                            )}
                          >
                            <p className="font-bold mb-1">{opt.label}</p>
                            <p className="text-xs text-primary font-medium mb-2">{opt.range}</p>
                            <p className="text-[10px] text-muted-foreground leading-tight">{opt.description}</p>
                          </button>
                        ))}

                        {currentStep === 2 && landOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setSelections(s => ({ ...s, landSize: opt.value }))}
                            className={cn(
                              "p-6 rounded-3xl border-2 text-left transition-all",
                              selections.landSize === opt.value 
                                ? "bg-primary/5 border-primary shadow-md" 
                                : "bg-background border-border hover:border-primary/50"
                            )}
                          >
                            <p className="font-bold mb-1">{opt.label}</p>
                            <p className="text-xs text-primary font-medium mb-2">{opt.description}</p>
                          </button>
                        ))}

                        {currentStep === 3 && familyOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setSelections(s => ({ ...s, familySize: opt.value }))}
                            className={cn(
                              "p-6 rounded-3xl border-2 text-left transition-all",
                              selections.familySize === opt.value 
                                ? "bg-primary/5 border-primary shadow-md" 
                                : "bg-background border-border hover:border-primary/50"
                            )}
                          >
                            <p className="font-bold mb-1">{opt.label}</p>
                            <p className="text-xs text-primary font-medium mb-2">{opt.description}</p>
                          </button>
                        ))}

                        {currentStep === 4 && styleOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setSelections(s => ({ ...s, style: opt.value }))}
                            className={cn(
                              "p-6 rounded-3xl border-2 text-left transition-all",
                              selections.style === opt.value 
                                ? "bg-primary/5 border-primary shadow-md" 
                                : "bg-background border-border hover:border-primary/50"
                            )}
                          >
                            <p className="font-bold mb-1">{opt.label}</p>
                            <p className="text-xs text-primary font-medium mb-2">{opt.description}</p>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-12 pt-8 border-t border-border">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="rounded-xl"
                  >
                    <ChevronLeft size={20} className="mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={
                      (currentStep === 1 && !selections.budget) ||
                      (currentStep === 2 && !selections.landSize) ||
                      (currentStep === 3 && !selections.familySize) ||
                      (currentStep === 4 && !selections.style)
                    }
                    className="rounded-xl px-8"
                  >
                    {currentStep === steps.length ? 'See Recommendations' : 'Next'}
                    <ChevronRight size={20} className="ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* House Type Card */}
                  <div className="bg-muted/30 border border-border rounded-[2.5rem] p-8 flex flex-col items-center text-center group hover:bg-primary/5 transition-colors">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Home size={32} />
                    </div>
                    <Badge variant="outline" className="mb-4 rounded-full border-primary/20 text-primary">House Type</Badge>
                    <h3 className="text-2xl font-bold mb-4">{getRecommendation().houseType}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Based on your family size and budget, this structure provides the optimal balance of space and efficiency.
                    </p>
                  </div>

                  {/* Layout Card */}
                  <div className="bg-muted/30 border border-border rounded-[2.5rem] p-8 flex flex-col items-center text-center group hover:bg-primary/5 transition-colors">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Layout size={32} />
                    </div>
                    <Badge variant="outline" className="mb-4 rounded-full border-primary/20 text-primary">Layout Concept</Badge>
                    <h3 className="text-2xl font-bold mb-4">{getRecommendation().layout}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A {getRecommendation().layout.toLowerCase()} layout maximizes natural light and airflow, perfectly matching your {selections.style} preference.
                    </p>
                  </div>

                  {/* Material Card */}
                  <div className="bg-muted/30 border border-border rounded-[2.5rem] p-8 flex flex-col items-center text-center group hover:bg-primary/5 transition-colors">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Layers size={32} />
                    </div>
                    <Badge variant="outline" className="mb-4 rounded-full border-primary/20 text-primary">Material Palette</Badge>
                    <h3 className="text-2xl font-bold mb-4">{getRecommendation().material}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Utilizing {getRecommendation().material.toLowerCase()} ensures durability and aesthetic harmony with the PNG environment.
                    </p>
                  </div>
                </div>

                {/* AI Visualization Callout from Recommendation */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/15 via-primary/5 to-accent/15 border border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
                      <Sparkles size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Want to see what this looks like?</h4>
                      <p className="text-xs text-muted-foreground">Generate a custom 3D architectural render of this {getRecommendation().houseType} using AI.</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleVisualizeRecommendation}
                    className="rounded-xl px-6 font-bold bg-primary hover:bg-primary/90 text-white shrink-0"
                  >
                    Visualize in 3D AI
                    <ArrowRight size={16} className="ml-1.5" />
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="rounded-2xl h-14 px-10 text-lg font-bold w-full sm:w-auto"
                  >
                    {isSaving ? <RefreshCw className="animate-spin mr-2" /> : <Save className="mr-2" />}
                    Save to Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={reset}
                    className="rounded-2xl h-14 px-10 text-lg font-bold w-full sm:w-auto"
                  >
                    <RefreshCw className="mr-2" />
                    Start Over
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
