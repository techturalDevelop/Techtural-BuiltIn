import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Building2, 
  Home, 
  RefreshCcw, 
  Layers, 
  Gem, 
  MapPin, 
  Download, 
  Save, 
  CheckCircle2,
  ArrowRight,
  Info,
  ChevronRight,
  PieChart as PieChartIcon,
  TrendingUp,
  HardHat,
  History,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { submitCostEstimate, auth, getCostEstimates, signInWithGoogle } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { domToPng } from 'modern-screenshot';

// Constants for calculation
const BASE_COST_PER_SQM = 2500; // Base cost in PGK

const PROJECT_TYPE_MULTIPLIERS = {
  residential: 1.0,
  commercial: 1.3,
  renovation: 0.8,
};

const QUALITY_MULTIPLIERS = {
  standard: 1.0,
  premium: 1.4,
  luxury: 2.0,
};

const LOCATION_MULTIPLIERS = {
  urban: 1.0,
  rural: 1.2,
  remote: 1.5,
};

const FLOOR_MULTIPLIER = 0.15; // 15% increase per additional floor

export default function EstimatorPage() {
  const [projectType, setProjectType] = useState('residential');
  const [floorArea, setFloorArea] = useState(100);
  const [floors, setFloors] = useState(1);
  const [materialQuality, setMaterialQuality] = useState('standard');
  const [locationFactor, setLocationFactor] = useState('urban');
  const [projectName, setProjectName] = useState('New Construction Project');
  const [projectDuration, setProjectDuration] = useState(5);
  const [hasManuallySetDuration, setHasManuallySetDuration] = useState(false);
  
  const [totalCost, setTotalCost] = useState(0);
  const [breakdown, setBreakdown] = useState({
    materials: 0,
    labor: 0,
    contingency: 0,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedEstimates, setSavedEstimates] = useState<any[]>([]);
  const [isLoadingEstimates, setIsLoadingEstimates] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  // Calculate costs
  useEffect(() => {
    const typeMult = PROJECT_TYPE_MULTIPLIERS[projectType as keyof typeof PROJECT_TYPE_MULTIPLIERS];
    const qualMult = QUALITY_MULTIPLIERS[materialQuality as keyof typeof QUALITY_MULTIPLIERS];
    const locMult = LOCATION_MULTIPLIERS[locationFactor as keyof typeof LOCATION_MULTIPLIERS];
    const floorMult = 1 + (floors - 1) * FLOOR_MULTIPLIER;

    const calculatedTotal = floorArea * BASE_COST_PER_SQM * typeMult * qualMult * locMult * floorMult;
    
    setTotalCost(calculatedTotal);
    setBreakdown({
      materials: calculatedTotal * 0.55,
      labor: calculatedTotal * 0.35,
      contingency: calculatedTotal * 0.10,
    });

    // Auto-calculate duration unless manually overridden
    if (!hasManuallySetDuration) {
      setProjectDuration(Math.ceil(floorArea / 20) || 1);
    }
  }, [projectType, floorArea, floors, materialQuality, locationFactor, hasManuallySetDuration]);

  // Handle fetching saved estimates
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoadingEstimates(true);
        try {
          const estimates = await getCostEstimates(user.uid);
          setSavedEstimates(estimates || []);
        } catch (error) {
          console.error("Error fetching estimates from cloud:", error);
          // Fallback to local storage if Firestore fetch has issue
          try {
            const local = localStorage.getItem('techtural_saved_estimates');
            if (local) setSavedEstimates(JSON.parse(local));
          } catch {
            // ignore
          }
        } finally {
          setIsLoadingEstimates(false);
        }
      } else {
        // Load locally saved estimates for guest users
        try {
          const local = localStorage.getItem('techtural_saved_estimates');
          if (local) {
            setSavedEstimates(JSON.parse(local));
          } else {
            setSavedEstimates([]);
          }
        } catch {
          setSavedEstimates([]);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const estimatePayload = {
      projectName: projectName || 'New Construction Project',
      projectType,
      floorArea,
      floors,
      materialQuality,
      locationFactor,
      projectDuration,
      totalCost,
      breakdown
    };

    // 1. Immediately cache in localStorage for instant access
    try {
      const local = localStorage.getItem('techtural_saved_estimates');
      const list = local ? JSON.parse(local) : [];
      const updatedList = [
        {
          id: 'local-' + Date.now(),
          ...estimatePayload,
          createdAt: { toDate: () => new Date() }
        },
        ...list.filter((item: any) => item.projectName !== estimatePayload.projectName || item.totalCost !== estimatePayload.totalCost)
      ].slice(0, 15);
      localStorage.setItem('techtural_saved_estimates', JSON.stringify(updatedList));
      if (!auth.currentUser) {
        setSavedEstimates(updatedList);
      }
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }

    // 2. Submit to Firestore cloud database
    try {
      await submitCostEstimate(estimatePayload);
      setSaveSuccess(true);
      toast.success('Estimate saved successfully!');
      
      // Refresh saved estimates list if authenticated
      if (auth.currentUser) {
        const estimates = await getCostEstimates(auth.currentUser.uid);
        if (estimates && estimates.length > 0) {
          setSavedEstimates(estimates);
        }
      }
      
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
      // If cloud submission fails, we still succeeded locally
      setSaveSuccess(true);
      toast.success('Estimate saved locally on this device.');
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (!pdfRef.current) return;
    
    const toastId = toast.loading('Generating professional PDF estimate...');
    
    try {
      // Use modern-screenshot for better CSS support and reliability
      const dataUrl = await domToPng(pdfRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const img = new Image();
      img.src = dataUrl;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const pdfHeight = (img.height * pdfWidth) / img.width;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Techtural-Estimate-${projectName.replace(/\s+/g, '-')}-${new Date().getTime()}.pdf`);
      
      toast.success('PDF exported successfully', { id: toastId });
    } catch (error) {
      console.error('PDF Export failed:', error);
      toast.error('Failed to generate PDF. Please try again.', { id: toastId });
    }
  };

  const chartData = [
    { name: 'Materials', value: breakdown.materials, color: '#10b981' },
    { name: 'Labor', value: breakdown.labor, color: '#3b82f6' },
    { name: 'Contingency', value: breakdown.contingency, color: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Panel: Inputs */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-heading font-bold mb-2 tracking-tight">Cost Estimator</h1>
              <p className="text-muted-foreground text-sm">Professional construction budgeting tool for PNG projects.</p>
            </div>

            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-muted/50 border-b border-border/50">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Calculator size={16} className="text-primary" />
                  Project Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                
                {/* Project Name */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Project Name</Label>
                  <Input 
                    placeholder="Enter project name..." 
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="bg-muted/50 border-none h-12 rounded-xl text-sm font-bold"
                  />
                </div>

                {/* Project Type */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Project Type</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'residential', icon: Home, label: 'Resi' },
                      { id: 'commercial', icon: Building2, label: 'Comm' },
                      { id: 'renovation', icon: RefreshCcw, label: 'Reno' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setProjectType(type.id)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                          projectType === type.id 
                            ? "border-primary bg-primary/5 text-primary" 
                            : "border-border bg-background text-muted-foreground hover:border-primary/50"
                        )}
                      >
                        <type.icon size={20} />
                        <span className="text-[10px] font-bold uppercase">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Floor Area */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Floor Area (sqm)</Label>
                    <span className="text-primary font-mono font-bold">{floorArea} m²</span>
                  </div>
                  <Slider 
                    value={[floorArea]} 
                    onValueChange={(val) => setFloorArea(val[0])} 
                    max={2000} 
                    step={10}
                    className="py-4"
                  />
                  <Input 
                    type="number" 
                    value={floorArea ?? ''} 
                    onChange={(e) => setFloorArea(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="bg-muted/50 border-none h-10 rounded-lg text-sm font-mono"
                  />
                </div>

                {/* Number of Floors */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Number of Floors</Label>
                    <span className="text-primary font-mono font-bold">{floors}</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFloors(f)}
                        className={cn(
                          "flex-1 h-10 rounded-lg border-2 font-mono text-sm transition-all",
                          floors === f 
                            ? "border-primary bg-primary text-white" 
                            : "border-border bg-background text-muted-foreground hover:border-primary/50"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Material Quality */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Material Quality</Label>
                  <Select value={materialQuality} onValueChange={setMaterialQuality}>
                    <SelectTrigger className="bg-muted/50 border-none h-12 rounded-xl">
                      <SelectValue placeholder="Select Quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (Efficient & Durable)</SelectItem>
                      <SelectItem value="premium">Premium (High-end Finishes)</SelectItem>
                      <SelectItem value="luxury">Luxury (Bespoke & Imported)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Factor */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location Factor</Label>
                  <div className="space-y-2">
                    {[
                      { id: 'urban', label: 'Urban (Port Moresby/Lae)', icon: Building2 },
                      { id: 'rural', label: 'Rural (Highlands/Islands)', icon: MapPin },
                      { id: 'remote', label: 'Remote (Fly River/Sepik)', icon: MapPin },
                    ].map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => setLocationFactor(loc.id)}
                        className={cn(
                          "w-full p-4 rounded-xl border-2 text-left flex items-center gap-3 transition-all",
                          locationFactor === loc.id 
                            ? "border-primary bg-primary/5 text-primary" 
                            : "border-border bg-background text-muted-foreground hover:border-primary/50"
                        )}
                      >
                        <loc.icon size={18} />
                        <span className="text-xs font-bold">{loc.label}</span>
                        {locationFactor === loc.id && <ChevronRight size={16} className="ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Project Duration */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Est. Project Duration (Weeks)</Label>
                    <span className="text-primary font-mono font-bold">{projectDuration} Weeks</span>
                  </div>
                  <Slider 
                    value={[projectDuration]} 
                    onValueChange={(val) => {
                      setProjectDuration(val[0]);
                      setHasManuallySetDuration(true);
                    }} 
                    max={156} 
                    min={1}
                    step={1}
                    className="py-4"
                  />
                  <Input 
                    type="number" 
                    value={projectDuration ?? ''} 
                    onChange={(e) => {
                      setProjectDuration(e.target.value === '' ? 0 : Number(e.target.value));
                      setHasManuallySetDuration(true);
                    }}
                    className="bg-muted/50 border-none h-10 rounded-lg text-sm font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground italic">
                    * Recommended duration: {Math.ceil(floorArea / 20)} weeks.
                  </p>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Right Panel: Results */}
          <div className="flex-1 space-y-6">
            
            {/* Total Cost Card */}
            <Card className="border-none shadow-lg rounded-3xl bg-primary text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Calculator size={120} />
              </div>
              <CardContent className="p-10 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <p className="text-primary-foreground/80 font-bold uppercase tracking-widest text-xs mb-2">Total Estimated Investment</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold opacity-70">PGK</span>
                      <motion.h2 
                        key={totalCost}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-7xl font-heading font-bold tracking-tighter"
                      >
                        {totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </motion.h2>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="secondary" 
                      className="rounded-xl px-6 h-12 font-bold"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : saveSuccess ? <CheckCircle2 size={20} /> : <><Save size={18} className="mr-2" /> Save Estimate</>}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-white/10 border-white/20 hover:bg-white/20 text-white rounded-xl px-6 h-12 font-bold"
                      onClick={handleExportPDF}
                    >
                      <Download size={18} className="mr-2" /> Export PDF
                    </Button>
                  </div>
                </div>

                <div className="mt-10 pt-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-1">
                    <p className="text-primary-foreground/60 text-[10px] font-bold uppercase tracking-widest">Cost per SQM</p>
                    <p className="text-xl font-mono font-bold">K {(totalCost / floorArea).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-primary-foreground/60 text-[10px] font-bold uppercase tracking-widest">Project Duration</p>
                    <p className="text-xl font-mono font-bold">{projectDuration} Weeks</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-primary-foreground/60 text-[10px] font-bold uppercase tracking-widest">Confidence Score</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-mono font-bold">85%</p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className={cn("w-1 h-3 rounded-full", i <= 4 ? "bg-white" : "bg-white/20")} />)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Breakdown & Visualization */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Breakdown List */}
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted/50 border-b border-border/50">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary" />
                    Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {[
                    { label: 'Materials & Logistics', value: breakdown.materials, color: 'bg-emerald-500', icon: Layers },
                    { label: 'Labor & Management', value: breakdown.labor, color: 'bg-blue-500', icon: HardHat },
                    { label: 'Contingency (10%)', value: breakdown.contingency, color: 'bg-amber-500', icon: Info },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={cn("p-1.5 rounded-lg text-white", item.color)}>
                            <item.icon size={14} />
                          </div>
                          <span className="text-sm font-bold">{item.label}</span>
                        </div>
                        <span className="font-mono font-bold">K {item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.value / totalCost) * 100}%` }}
                          className={cn("h-full", item.color)}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Chart Visualization */}
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted/50 border-b border-border/50">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <PieChartIcon size={16} className="text-primary" />
                    Visual Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => `K ${value.toLocaleString()}`}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Dashboard: Recent Estimates */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
              <CardHeader className="bg-muted/50 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <History size={16} className="text-primary" />
                    Estimate Dashboard
                  </CardTitle>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    {savedEstimates.length} Saved
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Sync status / auth status bar */}
                <div className="px-6 py-3 bg-muted/30 border-b border-border/40 flex items-center justify-between flex-wrap gap-2 text-xs">
                  {auth.currentUser ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Cloud Synced ({auth.currentUser.email || 'Google User'})</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Saved locally to this device</span>
                    </div>
                  )}
                  {!auth.currentUser && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 text-[11px] font-semibold text-primary hover:text-primary hover:bg-primary/10 px-2"
                      onClick={() => signInWithGoogle()}
                    >
                      Sign in with Google
                    </Button>
                  )}
                </div>

                {isLoadingEstimates ? (
                  <div className="p-12 flex justify-center">
                    <RefreshCcw className="animate-spin text-primary" size={24} />
                  </div>
                ) : savedEstimates.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                      <Save size={20} />
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-1">No saved estimates yet</p>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">Configure your project parameters above and click "Save Estimate" to track your cost calculations.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {savedEstimates.slice(0, 5).map((est) => (
                      <button 
                        key={est.id} 
                        className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors text-left group"
                        onClick={() => {
                          setProjectName(est.projectName || 'New Construction Project');
                          setProjectType(est.projectType);
                          setFloorArea(est.floorArea);
                          setFloors(est.floors);
                          setMaterialQuality(est.materialQuality);
                          setLocationFactor(est.locationFactor);
                          if (est.projectDuration) {
                            setProjectDuration(est.projectDuration);
                            setHasManuallySetDuration(true);
                          }
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          toast.info('Estimate loaded');
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center text-white",
                            est.projectType === 'residential' ? 'bg-blue-500' : est.projectType === 'commercial' ? 'bg-emerald-500' : 'bg-amber-500'
                          )}>
                            {est.projectType === 'residential' ? <Home size={20} /> : <Building2 size={20} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold truncate max-w-[200px]">{est.projectName || 'Unnamed Project'}</p>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                              <span className="font-bold uppercase">{est.locationFactor}</span>
                              <span>•</span>
                              <span>{est.floorArea} m²</span>
                              <span>•</span>
                              <span>{est.projectDuration} weeks</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-primary">K {est.totalCost?.toLocaleString()}</p>
                          <p className="text-[9px] text-muted-foreground flex items-center gap-1 justify-end">
                            <Clock size={10} />
                            {est.createdAt?.toDate ? est.createdAt.toDate().toLocaleDateString() : 'Just now'}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Summary */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
              <CardHeader className="bg-muted/50 border-b border-border/50">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Info size={16} className="text-primary" />
                  Project Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-lg text-foreground leading-relaxed">
                  A <span className="font-bold text-primary">{materialQuality}</span> quality, 
                  <span className="font-bold text-primary"> {floors === 1 ? 'single-story' : `${floors}-story`}</span> 
                  <span className="font-bold text-primary"> {projectType === 'residential' ? 'residential building' : projectType === 'commercial' ? 'commercial building' : 'renovation project'}</span> in 
                  <span className="font-bold text-primary"> {locationFactor === 'urban' ? 'an urban area' : locationFactor === 'rural' ? 'a rural area' : 'a remote area'}</span> with a floor area of 
                  <span className="font-bold text-primary"> {floorArea} sqm</span>.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>This configuration has been optimized for {locationFactor} logistics and {materialQuality} material standards.</span>
                </div>
              </CardContent>
            </Card>
            {/* Hidden PDF Template */}
            <div className="absolute -left-[9999px] -top-[9999px] overflow-hidden pointer-events-none">
              <div ref={pdfRef} className="p-16 bg-white text-black w-[800px] font-sans">
                {/* Header */}
                <div className="flex justify-between items-start mb-12 border-b-4 pb-8" style={{ borderColor: '#2563eb' }}>
                  <div className="flex items-center gap-4">
                    <img 
                      src="https://pub-d244eff0ad524eccbaae907a70af6b3d.r2.dev/techtural-builtin/techtural_logo_transparent.png" 
                      alt="Techtural Logo" 
                      className="h-20 w-auto"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h1 className="text-4xl font-black tracking-tighter" style={{ color: '#2563eb' }}>TECHTURAL</h1>
                      <p className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: '#9ca3af' }}>BuiltIn Solutions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold uppercase tracking-widest mb-2" style={{ color: '#9ca3af' }}>Cost Estimate</h2>
                    <div className="space-y-1">
                      <p className="text-sm font-bold">Date: {new Date().toLocaleDateString()}</p>
                      <p className="text-sm font-bold">Time: {new Date().toLocaleTimeString()}</p>
                      <p className="text-xs font-mono" style={{ color: '#6b7280' }}>ID: #EST-{Math.floor(Math.random() * 1000000)}</p>
                    </div>
                  </div>
                </div>

                {/* Project Title Section */}
                <div className="mb-12 p-8 rounded-3xl border" style={{ backgroundColor: '#f9fafb', borderColor: '#f3f4f6' }}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#2563eb' }}>Project Title</p>
                  <h2 className="text-3xl font-bold tracking-tight">{projectName}</h2>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12">
                  <div className="space-y-6">
                    <h3 className="font-bold uppercase text-xs tracking-widest border-b pb-2" style={{ color: '#9ca3af', borderColor: '#e5e7eb' }}>Technical Specifications</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: '#6b7280' }}>Project Category</span>
                        <span className="text-sm font-bold capitalize">{projectType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: '#6b7280' }}>Total Floor Area</span>
                        <span className="text-sm font-bold">{floorArea} m²</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: '#6b7280' }}>Vertical Levels</span>
                        <span className="text-sm font-bold">{floors} {floors === 1 ? 'Floor' : 'Floors'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: '#6b7280' }}>Material Standard</span>
                        <span className="text-sm font-bold capitalize">{materialQuality}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: '#6b7280' }}>Geographic Zone</span>
                        <span className="text-sm font-bold capitalize">{locationFactor}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: '#f3f4f6' }}>
                        <span className="text-sm" style={{ color: '#6b7280' }}>Planned Duration</span>
                        <span className="text-sm font-bold">{projectDuration} Weeks</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-10 rounded-[2.5rem] flex flex-col justify-center items-center text-center shadow-xl" style={{ backgroundColor: '#2563eb', color: '#ffffff' }}>
                    <h3 className="font-bold uppercase text-[10px] tracking-[0.2em] mb-4" style={{ opacity: 0.7 }}>Total Estimated Investment</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold" style={{ opacity: 0.6 }}>PGK</span>
                      <p className="text-5xl font-black tracking-tighter">{totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div className="mt-6 pt-6 border-t w-full" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                      <p className="text-xs" style={{ opacity: 0.7 }}>Estimated K {(totalCost / floorArea).toLocaleString()} per m²</p>
                    </div>
                  </div>
                </div>

                {/* Financial Breakdown */}
                <div className="space-y-6 mb-12">
                  <h3 className="font-bold uppercase text-xs tracking-widest border-b pb-2" style={{ color: '#9ca3af', borderColor: '#e5e7eb' }}>Financial Breakdown</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-6 rounded-2xl" style={{ backgroundColor: '#f9fafb' }}>
                      <p className="text-[10px] font-bold uppercase mb-2" style={{ color: '#9ca3af' }}>Materials (55%)</p>
                      <p className="text-lg font-bold">K {breakdown.materials.toLocaleString()}</p>
                    </div>
                    <div className="p-6 rounded-2xl" style={{ backgroundColor: '#f9fafb' }}>
                      <p className="text-[10px] font-bold uppercase mb-2" style={{ color: '#9ca3af' }}>Labor (35%)</p>
                      <p className="text-lg font-bold">K {breakdown.labor.toLocaleString()}</p>
                    </div>
                    <div className="p-6 rounded-2xl" style={{ backgroundColor: '#f9fafb' }}>
                      <p className="text-[10px] font-bold uppercase mb-2" style={{ color: '#9ca3af' }}>Contingency (10%)</p>
                      <p className="text-lg font-bold">K {breakdown.contingency.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline & Confidence */}
                <div className="grid grid-cols-2 gap-8 mb-16">
                  <div className="p-6 border rounded-2xl" style={{ borderColor: '#f3f4f6' }}>
                    <h4 className="text-[10px] font-bold uppercase mb-2" style={{ color: '#9ca3af' }}>Project Timeline</h4>
                    <p className="text-xl font-bold">{projectDuration} Weeks</p>
                    <p className="text-xs mt-1" style={{ color: '#6b7280' }}>Customized schedule for project delivery.</p>
                  </div>
                  <div className="p-6 border rounded-2xl" style={{ borderColor: '#f3f4f6' }}>
                    <h4 className="text-[10px] font-bold uppercase mb-2" style={{ color: '#9ca3af' }}>Estimate Confidence</h4>
                    <p className="text-xl font-bold">85% Accuracy</p>
                    <p className="text-xs mt-1" style={{ color: '#6b7280' }}>Subject to site-specific conditions and market volatility.</p>
                  </div>
                </div>

                {/* Footer Footnote */}
                <div className="mt-auto pt-12 border-t" style={{ borderColor: '#f3f4f6' }}>
                  <div className="grid grid-cols-2 gap-12 items-end">
                    <div className="text-[10px] leading-relaxed" style={{ color: '#9ca3af' }}>
                      <p className="font-bold mb-2 uppercase tracking-widest" style={{ color: '#4b5563' }}>Legal Disclaimer</p>
                      <p>This document is a preliminary cost estimate generated by the Techtural BuiltIn Digital Workspace. It is intended for budgeting purposes only and does not constitute a formal binding quote or contract. Final pricing is subject to detailed architectural drawings, site inspections, and current market rates at the time of procurement.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold mb-1" style={{ color: '#2563eb' }}>Techtural BuiltIn</p>
                      <p className="text-[10px]" style={{ color: '#6b7280' }}>Smart Construction Solutions for Papua New Guinea</p>
                      <p className="text-[10px]" style={{ color: '#6b7280' }}>www.techturalbuiltin.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="container mx-auto px-6 mt-12 pt-12 border-t border-border/50 text-center">
        <p className="text-muted-foreground text-sm font-medium">Techtural BuiltIn – Smart Construction Solutions</p>
      </div>
    </div>
  );
}
