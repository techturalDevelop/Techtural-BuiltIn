import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  ArrowRight
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
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase border border-primary/20"
          >
            <Sparkles size={14} />
            Architectural Design Intelligence
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">
            Design & Visualize Your <span className="text-primary">Container & Kit Home</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Choose between generating custom photorealistic 3D container home renders using AI, or using our interactive guided requirement selector to find your ideal home layout.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex p-1.5 rounded-2xl bg-muted/70 border border-border mt-4 shadow-xs">
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
              AI 3D Container Visualizer
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
              Design Recommender Quiz
            </button>
          </div>
        </div>

        {/* Tab 1: AI 3D Container Visualizer */}
        {activeTab === 'visualizer' && (
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
        {activeTab === 'wizard' && (
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
