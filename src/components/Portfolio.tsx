import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, ChevronLeft, ChevronRight, X, Maximize2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Project {
  title: string;
  category: string;
  location: string;
  images: string[];
  description: string;
  externalLink?: string;
}

export const projects: Project[] = [
  {
    title: 'Air Niugini Aircraft Storage Warehouse',
    category: 'Industrial',
    location: 'Port Moresby',
    images: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_Air%20Craft%20Engine%20Storage%20Warehouse/ANL%20Storage%201a_3.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_Air%20Craft%20Engine%20Storage%20Warehouse/20221207_130353.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_Air%20Craft%20Engine%20Storage%20Warehouse/20221207_130258.jpg',
    ],
    description: 'A state-of-the-art aviation storage facility designed for Air Niugini. This project features a large-span structural steel frame, specialized flooring for heavy aircraft, and advanced climate control systems to ensure the preservation of sensitive aviation components. Located at Jacksons International Airport, it serves as a critical hub for regional aviation maintenance.',
    externalLink: 'https://www.google.com/maps/search/?api=1&query=-9.4431,147.2158+(Air+Niugini+Aircraft+Storage+Warehouse+Jacksons+Airport+Port+Moresby)',
  },
  {
    title: 'AD Effects 15m x 6m Marketing Static Billboard',
    category: 'Infrastructure',
    location: 'Waigani, Port Moresby',
    images: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ADEffects%20-Waigani/IMG_20250304_094753.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ADEffects%20-Waigani/IMG_20250304_093833.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ADEffects%20-Waigani/IMG-20250320-WA0005.jpg',
    ],
    description: 'A large-scale marketing infrastructure project featuring a 15m x 6m static billboard. This project involved precise structural engineering to ensure wind load stability and high-visibility placement in the busy Waigani commercial district. The structure serves as a premier advertising landmark in Port Moresby.',
    externalLink: 'https://www.google.com/maps/search/?api=1&query=-9.4321,147.1852+(AD+Effects+Billboard+Waigani+Drive+Port+Moresby)',
  },
  {
    title: 'Air Niugini Nadzab International Airport Paradise Lounge',
    category: 'Hospitality',
    location: 'Nadzab, Lae Morobe Province',
    images: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_New%20Nadzab%20Terminal%20Paradise%20Lounge/IMG-20231013-WA0052.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_New%20Nadzab%20Terminal%20Paradise%20Lounge/IMG-20231101-WA0035.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_New%20Nadzab%20Terminal%20Paradise%20Lounge/IMG_20240223_111048.jpg',
    ],
    description: 'A premium hospitality project for Air Niugini at the new Nadzab International Airport. The Paradise Lounge features high-end interior finishes, ergonomic seating, and integrated digital services, providing a world-class experience for travelers in the Morobe Province.',
    externalLink: 'https://www.google.com/maps/search/?api=1&query=-6.5694,146.7258+(Air+Niugini+Paradise+Lounge+Nadzab+Tomodachi+Airport+Lae)',
  },
  {
    title: 'Hugo Canning 16Mile Freezer Structural and Freezer Slab Works',
    category: 'Industrial',
    location: '17 Mile, Port Moresby',
    images: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/Hugo%20Canning%20Freezer%20Works/20230710_141026.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/Hugo%20Canning%20Freezer%20Works/IMG-20240610-WA0051.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/Hugo%20Canning%20Freezer%20Works/IMG_20240730_112926.jpg',
    ],
    description: 'Specialized structural and slab works for Hugo Canning\'s 16Mile freezer facility. This project involved high-precision concrete engineering for freezer-grade slabs and robust structural steel framing to support large-scale cold storage operations at 17 Mile, Port Moresby.',
    externalLink: 'https://www.google.com/maps/search/?api=1&query=-9.4021,147.2552+(Hugo+Canning+Freezer+Facility+16+Mile+Port+Moresby)',
  },
  {
    title: 'Architectural Design for Air Niugini Hagen Sales Office Tininga Dobell',
    category: 'Commercial',
    location: 'Dobell, Mt. Hagen',
    images: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/Architectural%20Design%20for%20Air%20Niugini%20Hagen%20Sales%20Office%20Tininga%20Dobell/HGN%20Sales%20office%20Dobell%204A.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/Architectural%20Design%20for%20Air%20Niugini%20Hagen%20Sales%20Office%20Tininga%20Dobell/HGN%20Sales%20office%20Dobell%204B.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/Architectural%20Design%20for%20Air%20Niugini%20Hagen%20Sales%20Office%20Tininga%20Dobell/HGN%20Sales%20office%20Dobell%204C.jpg',
    ],
    description: 'A modern architectural design for the Air Niugini sales office at Tininga Dobell, Mt. Hagen. This project focuses on creating a high-end customer service environment with contemporary interior design, efficient space planning, and brand-aligned aesthetics to serve the Western Highlands region.',
    externalLink: 'https://www.google.com/maps/search/?api=1&query=-5.8575,144.2314+(Air+Niugini+Sales+Office+Tininga+Dobell+Mt+Hagen)',
  },
  {
    title: 'Air Niugini 8 Mile Sales Office, Port Moresby',
    category: 'Commercial',
    location: '8 Mile, Port Moresby',
    images: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_8%20Mile%20Sales%20Office/20220818_142045.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_8%20Mile%20Sales%20Office/20220820_155225.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_8%20Mile%20Sales%20Office/20220822_122458.jpg',
    ],
    description: 'A modern airline sales office design for Air Niugini located at 8 Mile, Port Moresby. This project features contemporary interior design, efficient customer service layouts, and integrated digital displays to enhance the traveler experience.',
    externalLink: 'https://www.google.com/maps/search/?api=1&query=-9.4100,147.2200+(Air+Niugini+8+Mile+Sales+Office+Port+Moresby)',
  },
  {
    title: 'Air Niugini Traffic & Operations Office Nadzab, Nadzab International Airport, Lae',
    category: 'Commercial',
    location: 'Nadzab, Lae',
    images: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_New%20Nadzab%20Terminal%20Traffic%20Office/IMG-20231006-WA0031.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_New%20Nadzab%20Terminal%20Traffic%20Office/IMG-20231006-WA0032.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_New%20Nadzab%20Terminal%20Traffic%20Office/IMG-20231006-WA0035.jpg',
    ],
    description: 'Specialized traffic and operations office for Air Niugini at the Nadzab International Airport. This facility is designed to streamline ground operations and traffic management, featuring robust infrastructure and modern workspace solutions for aviation professionals.',
    externalLink: 'https://www.google.com/maps/search/?api=1&query=-6.5700,146.7260+(Air+Niugini+Traffic+and+Operations+Office+Nadzab+Airport)',
  },
  {
    title: 'MRA Container Storage for Archives',
    category: 'Commercial',
    location: 'Konedobu, Port Moresby',
    images: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/MRA%20Container%20Storage%20for%20Archives/20230421_164305.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/MRA%20Container%20Storage%20for%20Archives/20230508_132558.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/MRA%20Container%20Storage%20for%20Archives/20230527_153850.jpg',
    ],
    description: 'Custom container archive and storage facility engineered for the Mineral Resources Authority (MRA) at Konedobu, Port Moresby. Features durable climate-controlled modular container retrofits designed for archival preservation and secure document storage.',
    externalLink: 'https://www.google.com/maps/search/?api=1&query=-9.4714,147.1472+(Mineral+Resources+Authority+MRA+Haus+Konedobu+Port+Moresby)',
  },
  {
    title: 'Air Niugini Hanger 2 Office Refurbishment Works 7Mile',
    category: 'Commercial',
    location: '7 Mile Port Moresby',
    images: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_Hanger%202%20Office%20Refurbisment%20Works/20230720_132457.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_Hanger%202%20Office%20Refurbisment%20Works/20230721_142324.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_Hanger%202%20Office%20Refurbisment%20Works/20230802_132635.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_Hanger%202%20Office%20Refurbisment%20Works/20230802_132743.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_Hanger%202%20Office%20Refurbisment%20Works/20230811_152705.jpg',
    ],
    description: 'Comprehensive office refurbishment and fit-out works inside Air Niugini Hanger 2 at 7 Mile, Port Moresby. Modernized internal administrative workspaces, acoustic isolation, energy-efficient lighting, and technical aviation support offices.',
    externalLink: 'https://www.google.com/maps/search/?api=1&query=-9.4450,147.2180+(Air+Niugini+Hanger+2+7+Mile+Port+Moresby)',
  },
  {
    title: 'AD-Effects Kina Bank Digital Billboard',
    category: 'Infrastructure',
    location: 'Waigani Port Moresby',
    images: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ADEffects%20Kina%20Bank/ADFX%20Billboards-KinaBank%20(1).jpeg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ADEffects%20Kina%20Bank/ADFX%20Billboards-KinaBank%20(13).jpeg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ADEffects%20Kina%20Bank/ADFX%20Billboards-KinaBank%20(4).jpeg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ADEffects%20Kina%20Bank/ADFX%20Billboards-KinaBank%20(7).jpeg',
    ],
    description: 'Structural engineering design and installation of a landmark digital LED billboard for Kina Bank in Waigani, Port Moresby. Engineered to withstand high tropical wind loads with integrated digital electrical distribution systems.',
    externalLink: 'https://www.google.com/maps/search/?api=1&query=-9.4310,147.1840+(Kina+Bank+Digital+Billboard+Waigani+Drive+Port+Moresby)',
  },
  {
    title: 'NJSS Hagen Court House Extension & Associate Works',
    category: 'Public',
    location: 'Mt. Hagen, Western Highlands Province',
    images: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/NJSS%20Hagen%20Court%20House%20Extension%20%26%20Associate%20Works/IMG-20221017-WA0011.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/NJSS%20Hagen%20Court%20House%20Extension%20%26%20Associate%20Works/IMG-20241224-WA0029.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/NJSS%20Hagen%20Court%20House%20Extension%20%26%20Associate%20Works/IMG-20241224-WA0024.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/NJSS%20Hagen%20Court%20House%20Extension%20%26%20Associate%20Works/IMG-20240611-WA0028.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/NJSS%20Hagen%20Court%20House%20Extension%20%26%20Associate%20Works/IMG-20241224-WA0046.jpg',
    ],
    description: 'National Judicial Staff Services (NJSS) court house extension and associated civil works in Mt. Hagen, Western Highlands Province. High-security civil structure delivering expanded judicial chambers, public gallery facilities, and fortified concrete foundation works.',
    externalLink: 'https://www.google.com/maps/search/?api=1&query=-5.8600,144.2300+(National+Judicial+Staff+Services+Court+House+Mt+Hagen)',
  },
];

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }, 10000 + (index * 200)); // 10 seconds interval as requested
    return () => clearInterval(timer);
  }, [project.images.length, index]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className="group relative overflow-hidden rounded-xl bg-muted cursor-pointer"
        onClick={() => {
          setLightboxImageIndex(currentImageIndex);
          setIsLightboxOpen(true);
        }}
      >
        <div className="aspect-[3/2] overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={project.images[currentImageIndex]}
              alt={`${project.title} - ${currentImageIndex + 1}`}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-500">
              <Maximize2 className="text-white w-6 h-6" />
            </div>
          </div>

          <div className="absolute top-4 right-4 flex gap-1.5 z-20">
            {project.images.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-500",
                  i === currentImageIndex ? "bg-white w-5" : "bg-white/40"
                )} 
              />
            ))}
          </div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 pointer-events-none">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <Badge className="bg-primary/90 text-white border-none text-[10px] h-5 px-2 font-bold tracking-wider uppercase mb-2">
              {project.category}
            </Badge>
            <h3 className="text-xl font-heading font-bold text-white mb-1 leading-tight">
              {project.title}
            </h3>
            <div className="flex items-center gap-1.5 text-white/80 font-bold text-[10px] mt-2">
              View Project Details
              <ExternalLink size={10} />
            </div>
          </div>
        </div>
        
        <div className="p-5 md:hidden">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-[10px] h-5 px-2 uppercase tracking-wider">{project.category}</Badge>
            <span className="text-muted-foreground text-[10px] font-medium">{project.location}</span>
          </div>
          <h3 className="text-lg font-heading font-bold mb-1 leading-tight">{project.title}</h3>
          <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">{project.description}</p>
        </div>
      </motion.div>

      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-[90vw] lg:max-w-6xl p-0 bg-background border-none overflow-hidden flex flex-col lg:flex-row sm:rounded-2xl shadow-2xl h-[90vh] lg:h-auto lg:max-h-[85vh]">
          <DialogTitle className="sr-only">{project.title}</DialogTitle>
          <DialogDescription className="sr-only">Viewing details for {project.title}</DialogDescription>
          
          <div className="relative flex-1 bg-black overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-full">
            <AnimatePresence mode="wait">
              <motion.img
                key={lightboxImageIndex}
                src={project.images[lightboxImageIndex]}
                alt={project.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
              <button 
                onClick={handlePrev}
                className="p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all pointer-events-auto backdrop-blur-md border border-white/10"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNext}
                className="p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all pointer-events-auto backdrop-blur-md border border-white/10"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-[10px] font-mono border border-white/10">
              {lightboxImageIndex + 1} / {project.images.length}
            </div>
          </div>

          <div className="w-full lg:w-[400px] p-8 flex flex-col overflow-y-auto bg-background">
            <div className="flex items-center justify-between mb-6">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                {project.category}
              </Badge>
              <button 
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <h2 className="text-3xl font-heading font-bold mb-2 tracking-tight">{project.title}</h2>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-8">
              <MapPin size={16} className="text-primary" />
              {project.location}
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Project Overview</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>

              {project.externalLink && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Project Location on Google Maps</h4>
                  <a 
                    href={project.externalLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/90 transition-all group"
                  >
                    <MapPin size={18} className="text-white group-hover:scale-110 transition-transform" />
                    <span>Visit Project Site on Google Maps</span>
                    <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <Button 
                className="w-full rounded-xl py-6"
                onClick={() => setIsLightboxOpen(false)}
              >
                Close Details
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

import { Link } from 'react-router-dom';

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-heading font-bold mb-4"
            >
              Our Portfolio
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg"
            >
              Showcasing our commitment to excellence across commercial, residential, and industrial sectors in PNG.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-4"
          >
            <Link to="/map">
              <Badge variant="outline" className="px-4 py-1 text-sm rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors flex items-center gap-2">
                <MapPin size={14} />
                View Interactive Map
              </Badge>
            </Link>
            <Link to="/projects">
              <Badge variant="outline" className="px-4 py-1 text-sm rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors">
                View All Projects
              </Badge>
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.slice(0, 3).map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
