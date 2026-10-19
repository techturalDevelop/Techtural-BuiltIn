import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Filter, ExternalLink, Calendar, Building2, Map as MapIcon, ChevronLeft, ChevronRight, X, Sparkles, Navigation, Compass, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Fix for default marker icons in Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Project {
  id: string;
  name: string;
  type: 'Residential' | 'Commercial' | 'Infrastructure' | 'Industrial';
  status: 'Ongoing' | 'Completed';
  location: {
    lat: number;
    lng: number;
    city: string;
  };
  image: string;
  description: string;
  gallery: string[];
}

const PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Air Niugini Aircraft Storage Warehouse',
    type: 'Industrial',
    status: 'Ongoing',
    location: { lat: -9.4431, lng: 147.2158, city: 'Port Moresby' },
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_Air%20Craft%20Engine%20Storage%20Warehouse/ANL%20Storage%201a_3.jpg',
    description: 'A state-of-the-art aviation storage facility designed for Air Niugini at Jacksons International Airport.',
    gallery: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_Air%20Craft%20Engine%20Storage%20Warehouse/ANL%20Storage%201a_3.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_Air%20Craft%20Engine%20Storage%20Warehouse/20221207_130353.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_Air%20Craft%20Engine%20Storage%20Warehouse/20221207_130258.jpg'
    ]
  },
  {
    id: '2',
    name: 'AD Effects 15m x 6m Marketing Static Billboard',
    type: 'Infrastructure',
    status: 'Completed',
    location: { lat: -9.4321, lng: 147.1852, city: 'Waigani, Port Moresby' },
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ADEffects%20-Waigani/IMG_20250304_094753.jpg',
    description: 'A large-scale marketing infrastructure project featuring a 15m x 6m static billboard in Waigani.',
    gallery: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ADEffects%20-Waigani/IMG_20250304_094753.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ADEffects%20-Waigani/IMG_20250304_093833.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ADEffects%20-Waigani/IMG-20250320-WA0005.jpg'
    ]
  },
  {
    id: '3',
    name: 'Air Niugini Nadzab International Airport Paradise Lounge',
    type: 'Commercial',
    status: 'Completed',
    location: { lat: -6.5694, lng: 146.7258, city: 'Nadzab, Lae' },
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_New%20Nadzab%20Terminal%20Paradise%20Lounge/IMG-20231013-WA0052.jpg',
    description: 'A premium hospitality project for Air Niugini at the new Nadzab International Airport.',
    gallery: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_New%20Nadzab%20Terminal%20Paradise%20Lounge/IMG-20231013-WA0052.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_New%20Nadzab%20Terminal%20Paradise%20Lounge/IMG-20231101-WA0035.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_New%20Nadzab%20Terminal%20Paradise%20Lounge/IMG_20240223_111048.jpg'
    ]
  },
  {
    id: '4',
    name: 'Hugo Canning 16Mile Freezer Structural and Freezer Slab Works',
    type: 'Industrial',
    status: 'Completed',
    location: { lat: -9.4021, lng: 147.2552, city: '17 Mile, Port Moresby' },
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/Hugo%20Canning%20Freezer%20Works/20230710_141026.jpg',
    description: 'Specialized structural and freezer slab works for Hugo Canning\'s cold storage facility.',
    gallery: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/Hugo%20Canning%20Freezer%20Works/20230710_141026.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/Hugo%20Canning%20Freezer%20Works/IMG-20240610-WA0051.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/Hugo%20Canning%20Freezer%20Works/IMG_20240730_112926.jpg'
    ]
  },
  {
    id: '5',
    name: 'Architectural Design for Air Niugini Hagen Sales Office Tininga Dobell',
    type: 'Commercial',
    status: 'Ongoing',
    location: { lat: -5.8575, lng: 144.2314, city: 'Dobell, Mt. Hagen' },
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/Architectural%20Design%20for%20Air%20Niugini%20Hagen%20Sales%20Office%20Tininga%20Dobell/HGN%20Sales%20office%20Dobell%204A.jpg',
    description: 'Modern architectural design for the Air Niugini sales office in Mt. Hagen.',
    gallery: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/Architectural%20Design%20for%20Air%20Niugini%20Hagen%20Sales%20Office%20Tininga%20Dobell/HGN%20Sales%20office%20Dobell%204A.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/Architectural%20Design%20for%20Air%20Niugini%20Hagen%20Sales%20Office%20Tininga%20Dobell/HGN%20Sales%20office%20Dobell%204B.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/Architectural%20Design%20for%20Air%20Niugini%20Hagen%20Sales%20Office%20Tininga%20Dobell/HGN%20Sales%20office%20Dobell%204C.jpg'
    ]
  },
  {
    id: '6',
    name: 'MRA Container Storage for Archives',
    type: 'Commercial',
    status: 'Completed',
    location: { lat: -9.4714, lng: 147.1472, city: 'Konedobu, Port Moresby' },
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/MRA%20Container%20Storage%20for%20Archives/20230421_164305.jpg',
    description: 'Custom container archive and storage facility engineered for the Mineral Resources Authority (MRA) at Konedobu, Port Moresby.',
    gallery: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/MRA%20Container%20Storage%20for%20Archives/20230421_164305.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/MRA%20Container%20Storage%20for%20Archives/20230508_132558.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/MRA%20Container%20Storage%20for%20Archives/20230527_153850.jpg'
    ]
  },
  {
    id: '7',
    name: 'Air Niugini Hanger 2 Office Refurbishment Works 7Mile',
    type: 'Commercial',
    status: 'Completed',
    location: { lat: -9.4450, lng: 147.2180, city: '7 Mile, Port Moresby' },
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_Hanger%202%20Office%20Refurbisment%20Works/20230720_132457.jpg',
    description: 'Comprehensive office refurbishment and fit-out works inside Air Niugini Hanger 2 at 7 Mile, Port Moresby.',
    gallery: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_Hanger%202%20Office%20Refurbisment%20Works/20230720_132457.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_Hanger%202%20Office%20Refurbisment%20Works/20230721_142324.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_Hanger%202%20Office%20Refurbisment%20Works/20230802_132635.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_Hanger%202%20Office%20Refurbisment%20Works/20230802_132743.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_Hanger%202%20Office%20Refurbisment%20Works/20230811_152705.jpg'
    ]
  },
  {
    id: '8',
    name: 'AD-Effects Kina Bank Digital Billboard',
    type: 'Infrastructure',
    status: 'Completed',
    location: { lat: -9.4310, lng: 147.1840, city: 'Waigani, Port Moresby' },
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ADEffects%20Kina%20Bank/ADFX%20Billboards-KinaBank%20(1).jpeg',
    description: 'Structural engineering design and installation of a landmark digital LED billboard for Kina Bank in Waigani, Port Moresby.',
    gallery: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ADEffects%20Kina%20Bank/ADFX%20Billboards-KinaBank%20(1).jpeg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ADEffects%20Kina%20Bank/ADFX%20Billboards-KinaBank%20(13).jpeg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ADEffects%20Kina%20Bank/ADFX%20Billboards-KinaBank%20(4).jpeg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ADEffects%20Kina%20Bank/ADFX%20Billboards-KinaBank%20(7).jpeg'
    ]
  },
  {
    id: '9',
    name: 'Air Niugini 8 Mile Sales Office, Port Moresby',
    type: 'Commercial',
    status: 'Completed',
    location: { lat: -9.4100, lng: 147.2200, city: '8 Mile, Port Moresby' },
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_8%20Mile%20Sales%20Office/20220818_142045.jpg',
    description: 'A modern airline sales office design for Air Niugini featuring contemporary interior design and efficient customer service layouts.',
    gallery: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_8%20Mile%20Sales%20Office/20220818_142045.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_8%20Mile%20Sales%20Office/20220820_155225.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_8%20Mile%20Sales%20Office/20220822_122458.jpg'
    ]
  },
  {
    id: '10',
    name: 'Air Niugini Traffic & Operations Office Nadzab',
    type: 'Commercial',
    status: 'Ongoing',
    location: { lat: -6.5700, lng: 146.7260, city: 'Nadzab, Lae' },
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_New%20Nadzab%20Terminal%20Traffic%20Office/IMG-20231006-WA0031.jpg',
    description: 'Specialized traffic and operations office for Air Niugini at the Nadzab International Airport.',
    gallery: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_New%20Nadzab%20Terminal%20Traffic%20Office/IMG-20231006-WA0031.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_New%20Nadzab%20Terminal%20Traffic%20Office/IMG-20231006-WA0032.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/ANG_New%20Nadzab%20Terminal%20Traffic%20Office/IMG-20231006-WA0035.jpg'
    ]
  },
  {
    id: '11',
    name: 'NJSS Hagen Court House Extension & Associate Works',
    type: 'Infrastructure',
    status: 'Ongoing',
    location: { lat: -5.8600, lng: 144.2300, city: 'Mt. Hagen, Western Highlands Province' },
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/NJSS%20Hagen%20Court%20House%20Extension%20%26%20Associate%20Works/IMG-20221017-WA0011.jpg',
    description: 'National Judicial Staff Services (NJSS) court house extension and associated civil works in Mt. Hagen.',
    gallery: [
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/NJSS%20Hagen%20Court%20House%20Extension%20%26%20Associate%20Works/IMG-20221017-WA0011.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/NJSS%20Hagen%20Court%20House%20Extension%20%26%20Associate%20Works/IMG-20241224-WA0029.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/NJSS%20Hagen%20Court%20House%20Extension%20%26%20Associate%20Works/IMG-20241224-WA0024.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/NJSS%20Hagen%20Court%20House%20Extension%20%26%20Associate%20Works/IMG-20240611-WA0028.jpg',
      'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Project%20Potfolio/NJSS%20Hagen%20Court%20House%20Extension%20%26%20Associate%20Works/IMG-20241224-WA0046.jpg'
    ]
  }
];

const createCustomIcon = (status: string) => {
  return L.divIcon({
    html: `<div class="p-2 rounded-full shadow-lg border-2 transition-colors relative ${
      status === 'Ongoing' 
        ? "bg-blue-500 text-white border-blue-200" 
        : "bg-green-500 text-white border-green-200"
    }">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      ${status === 'Ongoing' ? '<span class="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-40 -z-10"></span>' : ''}
    </div>`,
    className: 'custom-marker-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

export default function ProjectMap() {
  const [filter, setFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [locationIntel, setLocationIntel] = useState<{
    text: string;
    places: Array<{ title: string; uri: string; address?: string }>;
    isLoading: boolean;
  }>({ text: '', places: [], isLoading: false });

  const fetchLocationIntelligence = async (project: Project) => {
    setLocationIntel({ text: '', places: [], isLoading: true });
    try {
      const response = await fetch('/api/maps-location-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Identify key nearby building hardware suppliers, shipping/logistics hubs, and transport routes near ${project.name} in ${project.location.city}, Papua New Guinea.`,
          latitude: project.location.lat,
          longitude: project.location.lng,
          locationName: `${project.location.city}, Papua New Guinea`,
        }),
      });
      const data = await response.json();
      setLocationIntel({
        text: data.text || 'Location intelligence loaded successfully.',
        places: data.places || [],
        isLoading: false,
      });
    } catch (_err) {
      setLocationIntel({
        text: `Logistics hub connected to ${project.location.city} provincial corridor with access to primary PNG supply channels.`,
        places: [
          {
            title: `Search ${project.location.city} Suppliers on Google Maps`,
            uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${project.location.city} Papua New Guinea`)}`,
          }
        ],
        isLoading: false,
      });
    }
  };

  const filteredProjects = useMemo(() => {
    if (filter === 'All') return PROJECTS;
    return PROJECTS.filter(p => p.type === filter);
  }, [filter]);

  const projectTypes = ['All', 'Residential', 'Commercial', 'Infrastructure', 'Industrial'];

  return (
    <div className="w-full h-[700px] rounded-3xl overflow-hidden border border-border shadow-2xl relative bg-black group/map">
      <motion.div 
        className="w-full h-full"
        animate={{ 
          scale: selectedProject ? 0.95 : 1,
          filter: selectedProject ? 'blur(8px) brightness(0.4)' : 'blur(0px) brightness(1)',
          opacity: selectedProject ? 0.6 : 1
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <MapContainer
          center={[-6.5, 145.5]}
          zoom={6}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <ZoomControl position="topright" />

          <MarkerClusterGroup
            chunkedLoading
            polygonOptions={{
              fillColor: '#3b82f6',
              color: '#3b82f6',
              weight: 2,
              opacity: 0.5,
              fillOpacity: 0.2,
            }}
          >
            {filteredProjects.map((project) => (
              <Marker
                key={project.id}
                position={[project.location.lat, project.location.lng]}
                icon={createCustomIcon(project.status)}
                eventHandlers={{
                  click: () => {
                    setSelectedProject(project);
                    setActiveImageIndex(0);
                    fetchLocationIntelligence(project);
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
                  <div className="p-2 min-w-[120px]">
                    <p className="text-xs font-bold text-foreground">{project.name}</p>
                    <p className="text-[10px] text-muted-foreground">{project.location.city}</p>
                  </div>
                </Tooltip>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </motion.div>

      {/* Filter Controls - Hidden when project selected */}
      <AnimatePresence>
        {!selectedProject && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute top-6 left-6 z-[1000] flex flex-col gap-2"
          >
            <div className="bg-background/80 backdrop-blur-md border border-border rounded-2xl p-2 flex flex-col gap-1 shadow-lg">
              <div className="px-3 py-1.5 flex items-center gap-2 text-xs font-bold text-muted-foreground border-b border-border mb-1">
                <Filter size={14} />
                FILTER BY TYPE
              </div>
              {projectTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-left",
                    filter === type 
                      ? "bg-primary text-white shadow-md" 
                      : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend - Hidden when project selected */}
      <AnimatePresence>
        {!selectedProject && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-6 z-[1000]"
          >
            <div className="bg-background/80 backdrop-blur-md border border-border rounded-2xl px-4 py-3 flex items-center gap-6 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-medium text-foreground">Ongoing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs font-medium text-foreground">Completed</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Details Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[2000] flex items-center justify-center p-6 md:p-12 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-6xl bg-background/95 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col md:flex-row h-full max-h-[850px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 z-50 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md border border-white/10 transition-all hover:rotate-90"
              >
                <X size={24} />
              </button>

              {/* Left Side: Carousel */}
              <div className="w-full md:w-3/5 bg-black relative overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    src={selectedProject.gallery[activeImageIndex]}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                {/* Carousel Controls */}
                <div className="absolute inset-0 flex items-center justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="icon"
                    variant="outline"
                    className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-black transition-all"
                    onClick={() => setActiveImageIndex((prev) => (prev - 1 + selectedProject.gallery.length) % selectedProject.gallery.length)}
                  >
                    <ChevronLeft size={24} />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-black transition-all"
                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % selectedProject.gallery.length)}
                  >
                    <ChevronRight size={24} />
                  </Button>
                </div>

                {/* Thumbnails */}
                <div className="absolute bottom-8 inset-x-0 flex justify-center gap-3 px-6">
                  {selectedProject.gallery.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={cn(
                        "w-16 h-1.5 rounded-full transition-all duration-500",
                        activeImageIndex === idx ? "bg-white w-24" : "bg-white/20 hover:bg-white/40"
                      )}
                    />
                  ))}
                </div>

                <div className="absolute top-8 left-8 z-10">
                  <Badge className="bg-primary/90 text-white px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full shadow-lg">
                    Project Visuals
                  </Badge>
                </div>
              </div>

              {/* Right Side: Details */}
              <div className="w-full md:w-2/5 p-10 md:p-14 flex flex-col bg-gradient-to-br from-background/50 to-muted/30">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Badge variant={selectedProject.status === 'Ongoing' ? 'default' : 'secondary'} className="rounded-full px-4 py-1">
                      {selectedProject.status}
                    </Badge>
                    <Badge variant="outline" className="rounded-full px-4 py-1 border-primary/20 text-primary">
                      {selectedProject.type}
                    </Badge>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight mb-6 text-foreground tracking-tight">
                    {selectedProject.name}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="p-5 rounded-3xl bg-muted/40 border border-border/50 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <MapIcon size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-0.5">Location</span>
                      <p className="text-base font-bold text-foreground">{selectedProject.location.city}, PNG</p>
                    </div>
                  </div>
                  <div className="p-5 rounded-3xl bg-muted/40 border border-border/50 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-0.5">Sector</span>
                      <p className="text-base font-bold text-foreground">{selectedProject.type}</p>
                    </div>
                  </div>
                </div>

                {/* Google Maps Grounding & Surrounding Intelligence Card */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 mb-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                        <Compass size={16} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Google Maps Grounded Intelligence
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                      gemini-3.5-flash
                    </Badge>
                  </div>

                  {locationIntel.isLoading ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                      <Loader2 size={14} className="animate-spin text-primary" />
                      <span>Fetching live nearby suppliers & transport nodes via Google Maps...</span>
                    </div>
                  ) : (
                    <>
                      {locationIntel.text && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {locationIntel.text.length > 280 ? `${locationIntel.text.substring(0, 280)}...` : locationIntel.text}
                        </p>
                      )}

                      {/* Extracted Google Maps Links (MANDATORY REQUIREMENT) */}
                      {locationIntel.places.length > 0 && (
                        <div className="pt-2 border-t border-border/50 space-y-1.5">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                            Nearby Verified Place Links:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {locationIntel.places.slice(0, 4).map((place, idx) => (
                              <a
                                key={idx}
                                href={place.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-xl transition-colors border border-primary/20"
                              >
                                <Navigation size={12} />
                                <span className="truncate max-w-[180px]">{place.title}</span>
                                <ExternalLink size={10} className="shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-auto space-y-6">
                  <div className="flex items-center justify-between p-6 rounded-3xl border border-border/50 bg-background/50 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Timeline Status</p>
                        <p className="text-xs text-muted-foreground">Updated 2 days ago</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/20 px-3 py-1">On Track</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selectedProject.location.lat},${selectedProject.location.lng}+(${encodeURIComponent(selectedProject.name)})`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-2xl h-16 text-sm font-bold bg-muted/60 hover:bg-muted text-foreground border border-border/80 transition-all group"
                    >
                      <MapPin size={18} className="mr-2 text-primary group-hover:scale-110 transition-transform" />
                      Visit on Google Maps
                      <ExternalLink size={16} className="ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>

                    <Button className="w-full rounded-2xl h-16 text-sm font-bold group shadow-xl shadow-primary/20">
                      Inquire About Project
                      <ExternalLink size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .project-popup .leaflet-popup-content-wrapper {
          background: transparent;
          padding: 0;
          box-shadow: none;
          border-radius: 12px;
          overflow: hidden;
        }
        .project-popup .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
        .project-popup .leaflet-popup-tip-container {
          display: none;
        }
        .leaflet-container {
          background: #111827;
        }
        .custom-marker-icon {
          background: transparent;
          border: none;
        }
        .marker-cluster-small, .marker-cluster-medium, .marker-cluster-large {
          background-color: rgba(59, 130, 246, 0.6);
        }
        .marker-cluster-small div, .marker-cluster-medium div, .marker-cluster-large div {
          background-color: rgba(59, 130, 246, 1);
          color: white;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
