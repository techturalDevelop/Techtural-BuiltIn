import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  CloudRain, 
  Sun, 
  Layers, 
  Hammer, 
  CheckCircle2, 
  Info,
  ChevronRight,
  Layout,
  FileText,
  Construction,
  Paintbrush,
  AlertCircle,
  Plus,
  Trash2,
  Settings2,
  Download,
  MapPin,
  CalendarDays,
  Save,
  Link as LinkIcon,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { domToPng } from 'modern-screenshot';
import { jsPDF } from 'jspdf';

type ProjectSize = 'small' | 'medium' | 'large';
type Complexity = 'low' | 'medium' | 'high';
type Weather = 'dry' | 'rainy';
type Location = 'port-moresby' | 'lae' | 'highlands' | 'islands';
type PhaseStatus = 'not-started' | 'in-progress' | 'completed';

interface Phase {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  duration: number; // in weeks
  dependencies?: string[]; // IDs of phases that must be completed first
  status: PhaseStatus;
}

const DEFAULT_PHASES: Phase[] = [
  {
    id: 'design',
    name: 'Design & Planning',
    description: 'Architectural drawings and engineering specs.',
    icon: Layout,
    color: 'bg-blue-500',
    duration: 6,
    dependencies: [],
    status: 'completed'
  },
  {
    id: 'approval',
    name: 'Regulatory Approval',
    description: 'Permit processing with local authorities.',
    icon: FileText,
    color: 'bg-amber-500',
    duration: 8,
    dependencies: ['design'],
    status: 'in-progress'
  },
  {
    id: 'foundation',
    name: 'Foundation',
    description: 'Site clearing and concrete pouring.',
    icon: Layers,
    color: 'bg-emerald-500',
    duration: 5,
    dependencies: ['approval'],
    status: 'not-started'
  },
  {
    id: 'structure',
    name: 'Structural Framing',
    description: 'Main building skeleton and roofing.',
    icon: Construction,
    color: 'bg-indigo-500',
    duration: 12,
    dependencies: ['foundation'],
    status: 'not-started'
  },
  {
    id: 'finishing',
    name: 'Interior & Finishing',
    description: 'Plumbing, electrical, and painting.',
    icon: Paintbrush,
    color: 'bg-rose-500',
    duration: 8,
    dependencies: ['structure'],
    status: 'not-started'
  }
];

const LOCATION_FACTORS: Record<Location, { label: string, delay: number }> = {
  'port-moresby': { label: 'Port Moresby (Hub)', delay: 0 },
  'lae': { label: 'Lae (Industrial)', delay: 1 },
  'highlands': { label: 'Highlands (Logistics)', delay: 3 },
  'islands': { label: 'Islands (Shipping)', delay: 4 }
};

export default function TimelinePage() {
  const [size, setSize] = useState<ProjectSize>('medium');
  const [complexity, setComplexity] = useState<Complexity>('medium');
  const [weather, setWeather] = useState<Weather>('dry');
  const [location, setLocation] = useState<Location>('port-moresby');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [phases, setPhases] = useState<Phase[]>(DEFAULT_PHASES);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showCriticalPath, setShowCriticalPath] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Auto-adjust phases based on global parameters if NOT in manual edit mode
  useEffect(() => {
    if (!isEditMode) {
      const complexityMultiplier = { low: 0.8, medium: 1, high: 1.4 }[complexity];
      const sizeMultiplier = { small: 0.6, medium: 1, large: 2 }[size];
      const weatherMultiplier = weather === 'rainy' ? 1.2 : 1.0;
      const logisticsDelay = LOCATION_FACTORS[location].delay;

      const updatedPhases = DEFAULT_PHASES.map(p => {
        let phaseWeatherImpact = 1.0;
        if (weather === 'rainy') {
          if (p.id === 'foundation') phaseWeatherImpact = 1.5;
          if (p.id === 'structure') phaseWeatherImpact = 1.3;
        }

        const calculatedDuration = Math.round(
          p.duration * sizeMultiplier * complexityMultiplier * phaseWeatherImpact + 
          (p.id === 'structure' ? logisticsDelay : 0)
        );

        return { ...p, duration: calculatedDuration };
      });
      setPhases(updatedPhases);
    }
  }, [size, complexity, weather, location, isEditMode]);

  const timelineData = useMemo(() => {
    const calculatedPhases: any[] = [];
    
    phases.forEach(phase => {
      let start = 0;
      if (phase.dependencies && phase.dependencies.length > 0) {
        const depEnds = phase.dependencies.map(depId => {
          const dep = calculatedPhases.find(p => p.id === depId);
          return dep ? dep.end : 0;
        });
        start = Math.max(...depEnds);
      }

      const end = start + phase.duration;
      
      const startCalendarDate = new Date(startDate);
      startCalendarDate.setDate(startCalendarDate.getDate() + (start * 7));
      
      const endCalendarDate = new Date(startDate);
      endCalendarDate.setDate(endCalendarDate.getDate() + (end * 7));

      calculatedPhases.push({
        ...phase,
        start,
        end,
        startDate: startCalendarDate,
        endDate: endCalendarDate
      });
    });

    return calculatedPhases;
  }, [phases, startDate]);

  const totalWeeks = timelineData.length > 0 ? Math.max(...timelineData.map(p => p.end)) : 0;

  const criticalPathIds = useMemo(() => {
    if (!showCriticalPath) return new Set<string>();
    
    // Simple critical path calculation (longest path)
    const memo: Record<string, number> = {};
    const getLongestPath = (phaseId: string): number => {
      if (memo[phaseId]) return memo[phaseId];
      const phase = timelineData.find(p => p.id === phaseId);
      if (!phase) return 0;
      
      const dependents = timelineData.filter(p => p.dependencies?.includes(phaseId));
      if (dependents.length === 0) return phase.duration;
      
      const maxSubPath = Math.max(...dependents.map(d => getLongestPath(d.id)));
      memo[phaseId] = phase.duration + maxSubPath;
      return memo[phaseId];
    };

    const pathLengths = timelineData.map(p => ({ id: p.id, length: getLongestPath(p.id) }));
    const maxLength = Math.max(...pathLengths.map(pl => pl.length));
    const startPhases = pathLengths.filter(pl => pl.length === maxLength);
    
    const criticalSet = new Set<string>();
    const buildPath = (id: string) => {
      criticalSet.add(id);
      const phase = timelineData.find(p => p.id === id);
      const dependents = timelineData.filter(p => p.dependencies?.includes(id));
      const next = dependents.find(d => getLongestPath(d.id) === memo[id] - phase!.duration);
      if (next) buildPath(next.id);
    };

    startPhases.forEach(sp => buildPath(sp.id));
    return criticalSet;
  }, [timelineData, showCriticalPath]);
  
  const finalCompletionDate = useMemo(() => {
    if (timelineData.length === 0) return 'N/A';
    return timelineData[timelineData.length - 1].endDate.toLocaleDateString('en-US', { 
      month: 'long', year: 'numeric', day: 'numeric' 
    });
  }, [timelineData]);

  const handleUpdatePhase = (id: string, updates: Partial<Phase>) => {
    setPhases(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleAddPhase = () => {
    const newPhase: Phase = {
      id: `custom-${Date.now()}`,
      name: 'New Phase',
      description: 'Custom project phase.',
      icon: Settings2,
      color: 'bg-slate-500',
      duration: 4,
      status: 'not-started'
    };
    setPhases([...phases, newPhase]);
  };

  const handleRemovePhase = (id: string) => {
    setPhases(prev => prev.filter(p => p.id !== id));
  };

  const handleExport = async (format: 'pdf' | 'png') => {
    if (!containerRef.current) return;
    
    try {
      const options = {
        scale: 2,
        backgroundColor: '#ffffff',
      };

      if (format === 'png') {
        const dataUrl = await domToPng(containerRef.current, options);
        const link = document.createElement('a');
        link.download = `construction-timeline-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } else {
        const dataUrl = await domToPng(containerRef.current, options);
        // We need to get dimensions for the PDF
        const img = new Image();
        img.src = dataUrl;
        await new Promise((resolve) => (img.onload = resolve));
        
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [img.width, img.height]
        });
        pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height);
        pdf.save(`construction-timeline-${Date.now()}.pdf`);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Timeline Pro v2.0</Badge>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 tracking-tight">
                Project <span className="text-primary">Planner</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                A robust, customizable construction scheduling tool designed for the PNG building industry.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant={isEditMode ? "default" : "outline"}
                onClick={() => setIsEditMode(!isEditMode)}
                className="rounded-xl"
              >
                {isEditMode ? <Save size={18} className="mr-2" /> : <Settings2 size={18} className="mr-2" />}
                {isEditMode ? "Save Configuration" : "Customize Phases"}
              </Button>
              <Button variant="outline" className="rounded-xl">
                <Download size={18} className="mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column: Controls */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarDays size={18} className="text-primary" />
                    Project Basics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Start Date</Label>
                    <Input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location (PNG)</Label>
                    <Select value={location} onValueChange={(v) => setLocation(v as Location)}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(LOCATION_FACTORS).map(([key, val]) => (
                          <SelectItem key={key} value={key}>{val.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings2 size={18} className="text-primary" />
                    Global Modifiers
                  </CardTitle>
                  <CardDescription>Affects all phases automatically</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Project Scale</Label>
                    <Select value={size} onValueChange={(v) => setSize(v as ProjectSize)} disabled={isEditMode}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Residential (Small)</SelectItem>
                        <SelectItem value="medium">Standard (Medium)</SelectItem>
                        <SelectItem value="large">Commercial (Large)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Weather Season</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setWeather('dry')}
                        disabled={isEditMode}
                        className={cn(
                          "flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2",
                          weather === 'dry' 
                            ? "bg-primary/10 border-primary text-primary" 
                            : "bg-background border-border hover:border-primary/50",
                          isEditMode && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <Sun size={20} />
                        <span className="text-xs font-medium">Dry Season</span>
                      </button>
                      <button
                        onClick={() => setWeather('rainy')}
                        disabled={isEditMode}
                        className={cn(
                          "flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2",
                          weather === 'rainy' 
                            ? "bg-blue-500/10 border-blue-500 text-blue-500" 
                            : "bg-background border-border hover:border-blue-500/50",
                          isEditMode && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <CloudRain size={20} />
                        <span className="text-xs font-medium">Rainy Season</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phase Editor (Visible in Edit Mode) */}
              <AnimatePresence>
                {isEditMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-widest">Phase Editor</h3>
                      <Button size="sm" variant="ghost" onClick={handleAddPhase} className="text-primary">
                        <Plus size={16} className="mr-1" /> Add Phase
                      </Button>
                    </div>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {phases.map((phase) => (
                        <Card key={phase.id} className="p-4 border-primary/20 bg-primary/5">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <Input 
                              value={phase.name} 
                              onChange={(e) => handleUpdatePhase(phase.id, { name: e.target.value })}
                              className="h-8 text-sm font-bold bg-transparent border-none p-0 focus-visible:ring-0"
                            />
                            <button onClick={() => handleRemovePhase(phase.id)} className="text-muted-foreground hover:text-destructive">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <Label className="text-[10px] uppercase text-muted-foreground">Duration (Weeks)</Label>
                              <Input 
                                type="number" 
                                value={phase.duration} 
                                onChange={(e) => handleUpdatePhase(phase.id, { duration: parseInt(e.target.value) || 0 })}
                                className="h-8 mt-1"
                              />
                            </div>
                            <div className="w-12 h-8 rounded-md bg-background border border-border flex items-center justify-center">
                              <phase.icon size={16} className="text-primary" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mt-3">
                            <div className="space-y-2">
                              <Label className="text-[10px] uppercase text-muted-foreground">Dependencies</Label>
                              <Popover>
                                <PopoverTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full h-8 text-xs justify-between font-normal")}>
                                  {phase.dependencies?.length || 0} Linked
                                  <LinkIcon size={12} className="ml-2 opacity-50" />
                                </PopoverTrigger>
                                <PopoverContent className="w-56 p-2" align="start">
                                  <div className="space-y-2">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground px-2 py-1">Select Prerequisites</p>
                                    <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                                      {phases.filter(p => p.id !== phase.id).map(p => (
                                        <div key={p.id} className="flex items-center space-x-2 p-1 hover:bg-muted rounded-md transition-colors">
                                          <Checkbox 
                                            id={`dep-${phase.id}-${p.id}`}
                                            checked={phase.dependencies?.includes(p.id) || false}
                                            onCheckedChange={(checked) => {
                                              const currentDeps = phase.dependencies || [];
                                              const newDeps = checked 
                                                ? [...currentDeps, p.id]
                                                : currentDeps.filter(id => id !== p.id);
                                              handleUpdatePhase(phase.id, { dependencies: newDeps });
                                            }}
                                          />
                                          <label 
                                            htmlFor={`dep-${phase.id}-${p.id}`}
                                            className="text-xs cursor-pointer flex-1 truncate"
                                          >
                                            {p.name}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] uppercase text-muted-foreground">Status</Label>
                              <Select 
                                value={phase.status} 
                                onValueChange={(v) => handleUpdatePhase(phase.id, { status: v as PhaseStatus })}
                              >
                                <SelectTrigger className="h-8 text-xs rounded-lg">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="not-started">Not Started</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Visualization */}
            <div className="lg:col-span-8 space-y-6">
              <Card className="border-border/50 shadow-lg overflow-hidden">
                <CardHeader className="bg-muted/50 border-b border-border/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Master Schedule</CardTitle>
                        <CardDescription>Total Duration: {totalWeeks} Weeks</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button 
                        variant={showCriticalPath ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setShowCriticalPath(!showCriticalPath)}
                        className={cn("rounded-xl h-10", showCriticalPath && "bg-orange-500 hover:bg-orange-600")}
                      >
                        <Zap size={16} className="mr-2" />
                        Critical Path
                      </Button>

                      <Popover>
                        <PopoverTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-xl h-10")}>
                          <Download size={16} className="mr-2" />
                          Export
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-1" align="end">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-xs h-9" 
                            onClick={() => handleExport('png')}
                          >
                            Download as PNG
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-xs h-9" 
                            onClick={() => handleExport('pdf')}
                          >
                            Download as PDF
                          </Button>
                        </PopoverContent>
                      </Popover>

                      <div className="grid grid-cols-2 gap-4">
                      <div className="bg-background p-3 rounded-2xl border border-border/50">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Project Start</p>
                        <p className="text-sm font-bold">{new Date(startDate).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20">
                        <p className="text-[10px] uppercase font-bold text-primary tracking-wider mb-1">Target Completion</p>
                        <p className="text-sm font-bold text-primary">{finalCompletionDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
                <CardContent className="p-0">
                  <div className="border-t border-border/50">
                    {/* Gantt Header */}
                    <div className="grid grid-cols-[240px_1fr] bg-muted/30 border-b border-border/50">
                      <div className="p-4 border-r border-border/50 flex items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Phase Details</span>
                      </div>
                      <div className="relative h-12 flex items-center">
                        {/* Time Scale */}
                        <div className="absolute inset-0 flex justify-between px-6 items-center">
                          {Array.from({ length: 7 }).map((_, i) => {
                            const week = Math.round((totalWeeks / 6) * i);
                            const date = new Date(startDate);
                            date.setDate(date.getDate() + (week * 7));
                            return (
                              <div key={i} className="flex flex-col items-center">
                                <span className="text-[9px] font-mono text-muted-foreground/60">W{week}</span>
                                <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-tighter">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Gantt Body */}
                    <div className="relative" ref={containerRef}>
                      {/* Dependency Lines SVG Overlay */}
                      <svg className="absolute inset-0 pointer-events-none z-0" style={{ width: '100%', height: '100%' }}>
                        <defs>
                          <marker
                            id="arrowhead"
                            markerWidth="10"
                            markerHeight="7"
                            refX="9"
                            refY="3.5"
                            orient="auto"
                          >
                            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-primary/30" />
                          </marker>
                        </defs>
                        {timelineData.map((phase, index) => {
                          if (!phase.dependencies || phase.dependencies.length === 0) return null;
                          
                          return phase.dependencies.map(depId => {
                            const depIndex = timelineData.findIndex(p => p.id === depId);
                            if (depIndex === -1) return null;
                            
                            const depPhase = timelineData[depIndex];
                            
                            // Horizontal positions (%)
                            // Offset by 240px (left column)
                            // We'll calculate relative to the right column by using a nested container or just math
                            // Let's use math: (x% * rightColWidth + leftColWidth) / totalWidth
                            // Actually, if we put the SVG only over the right column, it's easier.
                            // But dependencies can cross rows.
                            // Let's keep it simple: the SVG is over the WHOLE container.
                            const leftColWidth = 240;
                            const getX = (week: number) => `calc(${leftColWidth}px + (100% - ${leftColWidth}px) * ${week / totalWeeks})`;
                            
                            const xStart = getX(depPhase.end);
                            const xEnd = getX(phase.start);
                            
                            // Vertical positions
                            // Row height: p-6 (24px * 2) + bar (40px) + border (1px) = 89px
                            const rowHeight = 89; 
                            const yStart = depIndex * rowHeight + 44; 
                            const yEnd = index * rowHeight + 44;
                            
                            const isCritical = criticalPathIds.has(phase.id) && criticalPathIds.has(depId);
                            
                            return (
                              <g key={`${depId}-${phase.id}`}>
                                <path
                                  d={`M ${xStart} ${yStart} L ${xStart} ${yEnd} L ${xEnd} ${yEnd}`}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={isCritical ? "2.5" : "1.5"}
                                  strokeDasharray={isCritical ? "none" : "4 2"}
                                  className={cn(
                                    isCritical ? "text-orange-500" : "text-primary/20",
                                    "transition-all duration-500"
                                  )}
                                  markerEnd="url(#arrowhead)"
                                />
                              </g>
                            );
                          });
                        })}
                      </svg>

                      {/* Gantt Rows */}
                      <div className="divide-y divide-border/50">
                        <TooltipProvider>
                          {timelineData.map((phase, index) => (
                            <div key={phase.id} className="grid grid-cols-[240px_1fr] group hover:bg-muted/30 transition-colors">
                              {/* Left: Phase Details */}
                              <div className="p-4 border-r border-border/50 flex flex-col justify-center gap-1">
                                <div className="flex items-center gap-2">
                                  <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-white shrink-0", phase.color)}>
                                    <phase.icon size={12} />
                                  </div>
                                  <h4 className="text-xs font-bold truncate">{phase.name}</h4>
                                  {phase.status === 'completed' && (
                                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                                  )}
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <p className="text-[9px] text-muted-foreground font-medium">
                                    {phase.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {phase.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </p>
                                  <Badge variant="outline" className="text-[8px] h-4 px-1 font-mono opacity-60">{phase.duration}w</Badge>
                                </div>
                                {phase.status === 'in-progress' && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="text-[8px] font-bold text-blue-500 uppercase tracking-widest">Active</span>
                                  </div>
                                )}
                              </div>

                              {/* Right: Timeline Bar */}
                              <div className="p-6 flex items-center relative">
                                <Tooltip>
                                  <TooltipTrigger className="w-full text-left">
                                    <div className="h-10 bg-muted/20 rounded-lg relative overflow-hidden border border-border/5">
                                      <motion.div
                                        initial={{ width: 0, x: 0 }}
                                        animate={{ 
                                          width: `${(phase.duration / totalWeeks) * 100}%`,
                                          x: `${(phase.start / totalWeeks) * 100}%`
                                        }}
                                        transition={{ type: "spring", stiffness: 40, damping: 12, delay: index * 0.05 }}
                                        className={cn(
                                          "absolute top-0 h-full rounded-lg shadow-md flex items-center px-3 overflow-hidden",
                                          phase.color,
                                          criticalPathIds.has(phase.id) && "ring-2 ring-orange-400 ring-offset-2 ring-offset-background"
                                        )}
                                      >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                                        {phase.status === 'completed' && (
                                          <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[1px] flex items-center justify-end pr-3">
                                            <CheckCircle2 size={14} className="text-white opacity-50" />
                                          </div>
                                        )}
                                        {phase.status === 'not-started' && (
                                          <div className="absolute inset-0 bg-slate-900/30" />
                                        )}
                                        <span className="text-[9px] font-bold text-white truncate opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                                          {phase.name}
                                        </span>
                                      </motion.div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="p-4 rounded-2xl max-w-xs border-primary/20">
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <div className={cn("w-2 h-2 rounded-full", phase.color)} />
                                        <p className="font-bold text-sm">{phase.name}</p>
                                      </div>
                                      <p className="text-xs text-muted-foreground leading-relaxed">{phase.description}</p>
                                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
                                        <div>
                                          <p className="text-[9px] uppercase font-bold text-muted-foreground">Start</p>
                                          <p className="text-xs font-medium">{phase.startDate.toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                          <p className="text-[9px] uppercase font-bold text-muted-foreground">End</p>
                                          <p className="text-xs font-medium">{phase.endDate.toLocaleDateString()}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          ))}
                        </TooltipProvider>
                      </div>

                      {/* Today Marker (Visual Only) */}
                      <div className="absolute top-0 bottom-0 w-px bg-primary/20" style={{ left: '240px' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* PNG Specific Contextual Insights */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-border/50 bg-blue-500/5">
                  <CardContent className="p-6 flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-1">Logistics Insight: {LOCATION_FACTORS[location].label}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {location === 'highlands' || location === 'islands' 
                          ? "Significant transport delays included for material mobilization via Highlands Highway or sea freight."
                          : "Standard urban logistics applied. Ensure early booking for specialized heavy machinery."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50 bg-amber-500/5">
                  <CardContent className="p-6 flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-1">Critical Dependencies</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Regulatory approval is set to {phases.find(p => p.id === 'approval')?.duration} weeks. This is the primary risk factor for project slippage.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50 bg-indigo-500/5">
                  <CardContent className="p-6 flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-1">Dependency Logic</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Phases now respect prerequisites. A phase will only start once all its dependencies are 100% complete.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
