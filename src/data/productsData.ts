export interface ProductPlaceholder {
  id: string;
  code: string;
  name: string;
  category: 'tiny-homes' | 'container-homes' | 'garden-pergolas' | 'commercial-designs' | 'education-aid-post' | 'commercial-warehouses';
  subcategoryLabel: string;
  areaSqm?: number;
  dimensions: string;
  tagline: string;
  conceptEssence: string;
  description: string;
  keyFeatures: string[];
  recommendedUse: string;
  image: string;
  blueprintPrice: number;       // PGK
  boqBomPrice: number;          // PGK
  kitsetBasePrice: number;       // PGK
  turnKeyPrice: number;          // PGK
  leadTimeWeeks: number;
}

export const TINY_HOMES_DATA: ProductPlaceholder[] = [
  {
    id: 'th-01',
    code: 'TH-01',
    name: 'Micro-Nest Tropical Pod',
    category: 'tiny-homes',
    subcategoryLabel: 'Tiny Home Concept',
    areaSqm: 18,
    dimensions: '6.0m x 3.0m',
    tagline: 'Ultra-compact mobile living pod with fold-down timber deck',
    conceptEssence: 'Designed for minimal site footprint and rapid relocation. Maximizes vertical volume with a loft sleeping zone and multi-functional fold-out furniture.',
    description: 'An ultra-compact 18 m² micro-pod crafted with lightweight steel framing and high-efficiency insulation. Perfect for backyard studios, tourist eco-retreats, or starter micro-living in PNG.',
    keyFeatures: [
      'Loft sleeping mezzanine with built-in storage stairs',
      'Fold-out hardwood outdoor veranda deck',
      'Compact galley kitchenette with induction cooktop provision',
      'Full ensuite wet room with rainfall shower and vanity',
      'Pre-wired for 2.5kVA plug-and-play solar generator kit'
    ],
    recommendedUse: 'Backyard studio, eco-tourism bungalow, student accommodation',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Tiny%20Homes%20%26%20Container%20Homes/TinyHomes-Container-TBWeb_Publish/Container%20Tiny%20Homes-003.png',
    blueprintPrice: 2200,
    boqBomPrice: 1500,
    kitsetBasePrice: 42000,
    turnKeyPrice: 78000,
    leadTimeWeeks: 4
  },
  {
    id: 'th-02',
    code: 'TH-02',
    name: 'Highlands Alpine Micro-Cabin',
    category: 'tiny-homes',
    subcategoryLabel: 'Tiny Home Concept',
    areaSqm: 22,
    dimensions: '6.5m x 3.4m',
    tagline: 'Insulated mountain micro-cabin engineered for cool highland valleys',
    conceptEssence: 'Inspired by alpine shelter geometry with steep rain-shedding pitch and thick thermal envelope to retain evening heat in PNG highland regions.',
    description: 'Engineered specifically for cool highland conditions. Includes heavy-gauge thermal blanket insulation, double-glazed windows, and built-in timber cabinetry.',
    keyFeatures: [
      'Steep-pitch gable roof for rapid heavy rain runoff',
      'R-3.0 high-density wall and ceiling insulation pack',
      'Wood-burning stove or energy-efficient hearth niche',
      'Solid timber-look composite weatherboard exterior',
      'Integrated internal laundry and utility closet'
    ],
    recommendedUse: 'Highland farm retreat, mountain getaway, rural worker cottage',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Tiny%20Homes%20%26%20Container%20Homes/TinyHomes-Container-TBWeb_Publish/Container%20Tiny%20Homes-003.png',
    blueprintPrice: 2500,
    boqBomPrice: 1700,
    kitsetBasePrice: 49000,
    turnKeyPrice: 89000,
    leadTimeWeeks: 5
  },
  {
    id: 'th-03',
    code: 'TH-03',
    name: 'Solar-Offgrid Eco Capsule',
    category: 'tiny-homes',
    subcategoryLabel: 'Tiny Home Concept',
    areaSqm: 26,
    dimensions: '7.2m x 3.6m',
    tagline: 'Self-sufficient standalone eco-dwelling with full solar & rainwater harvesting',
    conceptEssence: 'Zero-grid reliance concept featuring integrated solar roof tiles, rainwater filtration tank, and low-voltage DC climate conditioning.',
    description: 'A completely self-sufficient eco-capsule designed for remote island or bush blocks without municipal utility connections. Delivers total off-grid independence with modern comfort.',
    keyFeatures: [
      '3.5kW rooftop solar PV system with lithium storage battery integration',
      'Integrated 3,000L subfloor rainwater collection & UV filtration',
      'Cross-ventilation wind-scoop louvers for natural climate control',
      'Separating compost or low-water ceramic toilet system',
      'All-weather galvanized steel chassis with lifting anchor points'
    ],
    recommendedUse: 'Remote island blocks, conservation areas, off-grid homestays',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Tiny%20Homes%20%26%20Container%20Homes/TinyHomes-Container-TBWeb_Publish/Container%20Tiny%20Homes-004.jpg',
    blueprintPrice: 2800,
    boqBomPrice: 1900,
    kitsetBasePrice: 58000,
    turnKeyPrice: 108000,
    leadTimeWeeks: 6
  },
  {
    id: 'th-04',
    code: 'TH-04',
    name: 'Island Breezeway Studio',
    category: 'tiny-homes',
    subcategoryLabel: 'Tiny Home Concept',
    areaSqm: 28,
    dimensions: '7.8m x 3.6m',
    tagline: 'Tropical open-flow micro-chalet with expansive shaded alfresco veranda',
    conceptEssence: 'Celebrates tropical indoor-outdoor living with bi-folding timber shutters and an expansive covered front deck that doubles the usable living space.',
    description: 'Designed for coastal PNG, this breezy micro-studio features full-width opening French doors, high raked ceilings, and marine-grade anti-corrosive fittings.',
    keyFeatures: [
      'Full-width bi-fold timber glass doors opening to covered deck',
      '12 m² covered front veranda with treated timber decking',
      'High vaulted ceiling with high-level hot air relief louvers',
      'External rain-shower & surfboard / dive gear storage alcove',
      'Marine-grade galvanized chassis and stainless steel fixings'
    ],
    recommendedUse: 'Beachfront homestay, coastal retreat, holiday rental cabin',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Tiny%20Homes%20%26%20Container%20Homes/TinyHomes-Container-TBWeb_Publish/Container%20Tiny%20Homes-005.jpg',
    blueprintPrice: 2900,
    boqBomPrice: 2000,
    kitsetBasePrice: 62000,
    turnKeyPrice: 115000,
    leadTimeWeeks: 5
  }
];

export const CONTAINER_HOMES_DATA: ProductPlaceholder[] = [
  {
    id: 'ch-01',
    code: 'CH-01',
    name: 'Single 20ft Cargo Studio',
    category: 'container-homes',
    subcategoryLabel: 'Container Home Concept',
    areaSqm: 15,
    dimensions: '6.0m x 2.4m (1x 20ft HC)',
    tagline: 'Compact 20ft High-Cube container studio with turnkey interior fitout',
    conceptEssence: 'Repurposes corten steel ISO shipping containers into secure, cyclone-proof micro-suites. Superior structural durability and rapid deployment.',
    description: 'Built inside a brand-new 20ft High-Cube container. Fully spray-foam insulated with drywall interior, kitchenette, ensuite bathroom, and sliding glass security door.',
    keyFeatures: [
      'Structural Corten steel exterior shell with rust-inhibitive epoxy coating',
      'Full closed-cell spray foam thermal and acoustic insulation',
      'Double-glazed sliding entry door behind lockable container cargo doors',
      'Complete pre-plumbed bathroom module with shower, toilet, and vanity',
      'Compact kitchen counter with stainless steel sink & storage drawers'
    ],
    recommendedUse: 'Security guard office, mining camp accommodation, rental pod',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Tiny%20Homes%20%26%20Container%20Homes/TinyHomes-Container-TBWeb_Publish/Container%20Tiny%20Homes-001.png',
    blueprintPrice: 2000,
    boqBomPrice: 1400,
    kitsetBasePrice: 38000,
    turnKeyPrice: 68000,
    leadTimeWeeks: 4
  },
  {
    id: 'ch-02',
    code: 'CH-02',
    name: 'Single 40ft Coastal Cruiser',
    category: 'container-homes',
    subcategoryLabel: 'Container Home Concept',
    areaSqm: 30,
    dimensions: '12.0m x 2.4m (1x 40ft HC)',
    tagline: 'Full 1-bedroom luxury linear residence built within a 40ft High-Cube container',
    conceptEssence: 'Maximizes the linear 12-meter run with distinct functional zoning: private master bedroom, central bathroom, and front lounge-kitchen.',
    description: 'A spacious 1-bedroom container home featuring full-height panoramic glass sliding doors, separate queen-size bedroom, modern galley kitchen, and laundry niche.',
    keyFeatures: [
      '12-meter linear layout with distinct private bedroom and lounge zones',
      'Full-height double glazed sliding doors creating seamless daylight',
      'Modern galley kitchen with breakfast bar seating for two',
      'Walk-in shower ensuite with porcelain fixtures and water heater',
      'Exterior timber screening accents softening industrial steel aesthetics'
    ],
    recommendedUse: 'Full-time residential dwelling, farm manager home, Airbnb rental',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Tiny%20Homes%20%26%20Container%20Homes/TinyHomes-Container-TBWeb_Publish/Container%20Tiny%20Homes-002.png',
    blueprintPrice: 2800,
    boqBomPrice: 1900,
    kitsetBasePrice: 59000,
    turnKeyPrice: 112000,
    leadTimeWeeks: 5
  },
  {
    id: 'ch-03',
    code: 'CH-03',
    name: 'Twin-L 40ft Modular Residence',
    category: 'container-homes',
    subcategoryLabel: 'Container Home Concept',
    areaSqm: 60,
    dimensions: '12.0m x 8.0m (2x 40ft L-Shape)',
    tagline: '2-Bedroom L-shaped container residence with private central courtyard',
    conceptEssence: 'Joins two 40ft containers in an L-configuration to create a wind-sheltered private garden courtyard and generous open-plan living connection.',
    description: 'Two 40ft High-Cube containers joined to form a generous 2-bedroom home. Features a wide living-dining atrium in the junction with private sleeping wings.',
    keyFeatures: [
      'Two full bedrooms with built-in wardrobes and external view windows',
      'Spacious open-concept living area with multi-leaf stacking glass sliders',
      'Central protected courtyard deck ideal for family BBQ and garden gatherings',
      'Engineered structural steel joining plates with weatherproof seal kits',
      'Overhead tropical fly-roof frame reducing direct sun heat load by 80%'
    ],
    recommendedUse: 'Suburban 2-bed family home, plantation executive residence',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Tiny%20Homes%20%26%20Container%20Homes/TinyHomes-Container-TBWeb_Publish/Container%20Tiny%20Homes-003.png',
    blueprintPrice: 4200,
    boqBomPrice: 2800,
    kitsetBasePrice: 105000,
    turnKeyPrice: 198000,
    leadTimeWeeks: 7
  },
  {
    id: 'ch-04',
    code: 'CH-04',
    name: 'Stacked Highset Duplex Container',
    category: 'container-homes',
    subcategoryLabel: 'Container Home Concept',
    areaSqm: 60,
    dimensions: '6.0m x 6.0m (2-Level Stacked)',
    tagline: 'Two-storey stacked container home with upper sunset viewing terrace',
    conceptEssence: 'Vertical stacking configuration engineered for small urban plots. Ground floor living connects to an upper master suite and cantilevered sunset balcony.',
    description: 'A striking 2-storey architectural container home. Ground level provides kitchen, dining, and bathroom; upper level features master retreat opening to a panoramic balcony.',
    keyFeatures: [
      'Two-level vertical stacking footprint maximizing garden and vehicle yard',
      'Upper level cantilevered timber terrace with stainless steel balustrade',
      'Architectural external spiral or linear steel staircase with safety cage',
      'Heavy structural corner casting twist-lock interconnections',
      'Dual-zone split air conditioning and LED ambient lighting package'
    ],
    recommendedUse: 'Urban narrow lots, scenic coastal blocks, trendy boutique rentals',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Tiny%20Homes%20%26%20Container%20Homes/TinyHomes-Container-TBWeb_Publish/Container%20Tiny%20Homes-004.jpg',
    blueprintPrice: 4600,
    boqBomPrice: 3000,
    kitsetBasePrice: 115000,
    turnKeyPrice: 215000,
    leadTimeWeeks: 8
  },
  {
    id: 'ch-05',
    code: 'CH-05',
    name: 'Quad-Cluster Family Container Home',
    category: 'container-homes',
    subcategoryLabel: 'Container Home Concept',
    areaSqm: 120,
    dimensions: '14.0m x 12.0m (4x 40ft Cluster)',
    tagline: 'Grand 3 to 4 bedroom executive container residence with central glass atrium',
    conceptEssence: 'Four 40ft containers arranged around a raised central glass atrium ceiling, creating high-ceiling family living flanked by private bedroom wings.',
    description: 'The ultimate container architectural residence. 120 m² of modern living with 3 spacious bedrooms, 2 bathrooms, executive kitchen, laundry, and high central cathedral living hall.',
    keyFeatures: [
      'Four 40ft container modular cluster with raised central clerestory atrium',
      '3 large bedrooms including private master wing with ensuite and walk-in robe',
      'Expansive chef kitchen with central quartz island benchtop',
      'Wrap-around perimeter decking with cyclone-anchored ground piers',
      'Industrial-chic finish with exposed container corrugations and warm timber'
    ],
    recommendedUse: 'Primary family residence, provincial estate, corporate director lodge',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Tiny%20Homes%20%26%20Container%20Homes/TinyHomes-Container-TBWeb_Publish/Container%20Tiny%20Homes-005.jpg',
    blueprintPrice: 6500,
    boqBomPrice: 4200,
    kitsetBasePrice: 195000,
    turnKeyPrice: 360000,
    leadTimeWeeks: 10
  }
];

export const GARDEN_PERGOLAS_DATA: ProductPlaceholder[] = [
  {
    id: 'gp-01',
    code: 'GP-01',
    name: 'Pacific Timber Architectural Pergola',
    category: 'garden-pergolas',
    subcategoryLabel: 'Garden Pergola System',
    dimensions: '4.0m x 3.0m (12 m²)',
    tagline: 'Hardwood pergola with precision slatted sun-louvers & vine trellis',
    conceptEssence: 'Crafted from sustainable Pacific hardwoods with marine anti-rot treatment. Provides natural dappled shade and structural trellis for tropical bougainvillea.',
    description: 'A classic timber garden pergola engineered with heavy-section posts and angled rafter louvers to filter harsh midday PNG sunlight while welcoming afternoon breezes.',
    keyFeatures: [
      'Treated Kwila / Pacific hardwood posts and beams (Class 1 durability)',
      'Angled overhead rafters positioned for optimal solar deflection',
      'Galvanized concealed post base anchors for concrete slab or footing mount',
      'Modular side privacy screen panels with slatted horizontal battens',
      'Pre-notched joinery components for effortless weekend bolt assembly'
    ],
    recommendedUse: 'Garden dining patio, poolside daybed canopy, outdoor barbecue shade',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Pergola%20Designs/Pergola-Type5-Render2.png',
    blueprintPrice: 250,
    boqBomPrice: 150,
    kitsetBasePrice: 2200,
    turnKeyPrice: 3500,
    leadTimeWeeks: 2
  },
  {
    id: 'gp-02',
    code: 'GP-02',
    name: 'Modern Louvered Bioclimatic Pergola',
    category: 'garden-pergolas',
    subcategoryLabel: 'Garden Pergola System',
    dimensions: '5.0m x 4.0m (20 m²)',
    tagline: 'Motorized adjustable aluminium louvers with automated rain sensor closure',
    conceptEssence: 'High-tech bioclimatic canopy allowing 0° to 135° rotation of waterproof roof blades. Closes automatically when tropical downpours start.',
    description: 'The pinnacle of modern outdoor luxury. Heavy-duty powder-coated aluminium frame with motorized louvers, perimeter LED strip lighting, and concealed internal gutters.',
    keyFeatures: [
      'Motorized rotating double-layer aluminium roof louvers with remote control',
      'Built-in rain sensor triggering automatic watertight blade closure',
      'Concealed internal leg post drainage downpipes for clean water diversion',
      'Integrated dimmable warm LED perimeter lighting channels',
      'High wind rating engineered to withstand gusts up to Category C2'
    ],
    recommendedUse: 'Luxury residential outdoor lounge, restaurant terrace, rooftop bar',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Pergola%20Designs/Pergola-Type4-Render%201.png',
    blueprintPrice: 250,
    boqBomPrice: 150,
    kitsetBasePrice: 2400,
    turnKeyPrice: 3700,
    leadTimeWeeks: 3
  },
  {
    id: 'gp-03',
    code: 'GP-03',
    name: 'Heavy-Duty Steel Cantilever Pergola',
    category: 'garden-pergolas',
    subcategoryLabel: 'Garden Pergola System',
    dimensions: '6.0m x 3.5m (21 m²)',
    tagline: 'Minimalist single-side post cantilever structure for unobstructed views',
    conceptEssence: 'Eliminates front ground posts using high-tensile structural steel cantilevers. Provides clear, obstacle-free sightlines to pools and coastal horizons.',
    description: 'An architectural cantilever canopy supported purely from rear reinforced steel stanchions. Perfect for swimming pool edges and vehicle driveways where clear ground space is required.',
    keyFeatures: [
      'Single-row structural steel post design eliminating front obstructions',
      'Hot-dip galvanized and powder-coated finish for coastal corrosion defense',
      'Polycarbonate or tensioned architectural fabric waterproof shade skin',
      'Engineered concrete footing specification with deep anchor cage cages',
      'Sleek modern geometric profile matching contemporary architecture'
    ],
    recommendedUse: 'Poolside cabanas, vehicle carports, panoramic view terraces',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Pergola%20Designs/Pergola-Type3-Render2.png',
    blueprintPrice: 250,
    boqBomPrice: 150,
    kitsetBasePrice: 1600,
    turnKeyPrice: 2500,
    leadTimeWeeks: 3
  },
  {
    id: 'gp-04',
    code: 'GP-04',
    name: 'Traditional Haus Win Open Pavilion',
    category: 'garden-pergolas',
    subcategoryLabel: 'Garden Pergola System',
    dimensions: '6.0m x 5.0m (30 m²)',
    tagline: 'PNG cultural gazebo pavilion with pitched Colorbond roof & carved timber posts',
    conceptEssence: 'Modernizes the beloved traditional Haus Win communal gazebo. High pitched roof creates massive convective updraft for maximum cooling breeze.',
    description: 'A spacious communal garden pavilion blending traditional PNG timber aesthetics with engineered steel roof trusses and durable Colorbond iron roofing for 50+ year longevity.',
    keyFeatures: [
      'High-pitched pyramid or hip roof design generating natural thermal updraft',
      'Solid carved Kwila corner posts with traditional motif bracket details',
      'Colorbond corrugated steel roofing with wide 600mm weather eaves',
      'Built-in perimeter bench seating with heavy-duty timber slats',
      'Integrated center ceiling fan mount and lantern wiring conduit'
    ],
    recommendedUse: 'Family communal gatherings, church grounds, resort meeting spots',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Pergola%20Designs/pergola101.jpg',
    blueprintPrice: 250,
    boqBomPrice: 200,
    kitsetBasePrice: 4800,
    turnKeyPrice: 7500,
    leadTimeWeeks: 3
  },
  {
    id: 'gp-05',
    code: 'GP-05',
    name: 'Solar-Roof Pergola Carport Hybrid',
    category: 'garden-pergolas',
    subcategoryLabel: 'Garden Pergola System',
    dimensions: '6.0m x 6.0m (36 m²)',
    tagline: 'Double-bay solar canopy generating 6kW clean power while shading two vehicles',
    conceptEssence: 'Dual-purpose functional canopy that transforms an outdoor pergola or driveway carport into a high-yield clean energy power generation asset.',
    description: 'Features 16 high-efficiency bifacial solar modules mounted on an engineered waterproof steel pergola frame. Powers your home while protecting vehicles from tropical sun and rain.',
    keyFeatures: [
      'Integrated 6.0kW Tier-1 bifacial solar PV canopy generating 24kWh/day',
      'Waterproof rubber gasket sealing between panels for 100% dry under-coverage',
      'Heavy-duty galvanized steel framing engineered for 2-car parking clearance',
      'Pre-engineered inverter and EV-charging station mounting plate',
      'Significant electricity bill reduction and backup power capability'
    ],
    recommendedUse: 'Double carport, commercial parking shade, solar patio shelter',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Pergola%20Designs/pergola102.jpg',
    blueprintPrice: 250,
    boqBomPrice: 200,
    kitsetBasePrice: 4200,
    turnKeyPrice: 6500,
    leadTimeWeeks: 4
  },
  {
    id: 'gp-06',
    code: 'GP-06',
    name: 'Urban Terrace Glass-Top Pergola',
    category: 'garden-pergolas',
    subcategoryLabel: 'Garden Pergola System',
    dimensions: '4.5m x 3.0m (13.5 m²)',
    tagline: 'Sleek architectural pergola with UV-tinted laminated safety glass canopy',
    conceptEssence: 'Maintains 100% natural overhead daylight while providing complete rainproofing and 99% UV radiation filtration for modern urban townhouses.',
    description: 'An elegant contemporary terrace canopy featuring an ultra-slim powder-coated aluminium frame supporting tinted laminated safety glass panels with integrated perimeter gutters.',
    keyFeatures: [
      '10.38mm grey-tinted laminated safety glass overhead panels',
      '99% UV radiation block preventing outdoor furniture sun fade',
      'Ultra-slim structural aluminium rafters with concealed screw fastenings',
      'Integrated low-profile gutter with discreet downpipe connection',
      'Optional motorized retractable under-glass fabric shade blinds'
    ],
    recommendedUse: 'Townhouse rear patios, apartment balcony covers, executive entryways',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Pergola%20Designs/pergola107.jpg',
    blueprintPrice: 250,
    boqBomPrice: 250,
    kitsetBasePrice: 5500,
    turnKeyPrice: 8600,
    leadTimeWeeks: 3
  }
];

export const COMMERCIAL_DESIGNS_DATA: ProductPlaceholder[] = [
  {
    id: 'cd-01',
    code: 'CD-01',
    name: 'Tropical Boulevard Retail Plaza',
    category: 'commercial-designs',
    subcategoryLabel: 'Commercial Design',
    areaSqm: 450,
    dimensions: '30.0m x 15.0m',
    tagline: '6-Unit modular storefront retail strip with covered pedestrian arcade',
    conceptEssence: 'High-visibility linear shopping arcade designed for provincial centres and urban corridors. Shaded front pedestrian colonnade encourages foot traffic.',
    description: 'A 6-shop commercial retail complex featuring individual tenant utilities, aluminum shopfront glazing, rear service access, and a continuous 3-meter deep covered walkway.',
    keyFeatures: [
      'Six flexible commercial shopfronts (each ~65 m² with private half-bath)',
      '3.0m wide continuous covered colonnade protecting shoppers from rain and sun',
      'Individual sub-metering provisions for power, water, and air conditioning',
      'Rear service loading doors and secure waste management compound',
      'Engineered portal steel frame allowing rapid 90-day construction schedule'
    ],
    recommendedUse: 'Suburban retail strip, supermarket annex, provincial market arcade',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Commercial%20HubsTBWeb_Publish/CD-01%20Tropical%20Boulevard%20Retail%20Plaza.png',
    blueprintPrice: 14500,
    boqBomPrice: 8500,
    kitsetBasePrice: 420000,
    turnKeyPrice: 780000,
    leadTimeWeeks: 12
  },
  {
    id: 'cd-02',
    code: 'CD-02',
    name: 'Pacific Two-Storey Commercial Hub',
    category: 'commercial-designs',
    subcategoryLabel: 'Commercial Design',
    areaSqm: 680,
    dimensions: '20.0m x 17.0m (2-Storey)',
    tagline: 'Ground floor banking/retail plus upper floor executive office suites',
    conceptEssence: 'Multi-tenant commercial asset maximizing land yield with dual street frontage, lift shaft provision, and energy-efficient double glazing.',
    description: 'A prestigious two-storey commercial building suited for corporate branches, professional chambers, or medical practices. Ground floor retail anchors with upper office tenancies.',
    keyFeatures: [
      'Dual-level reinforced steel composite construction with concrete mezzanine',
      'Ground floor open layout (340 m²) suited for retail, banking, or showroom',
      'Upper level partitioned into 8 executive suites with boardroom and staff pantry',
      'Central entrance foyer with stairwell and disabled lift shaft provision',
      'Commercial grade curtain wall facade with high acoustic attenuation'
    ],
    recommendedUse: 'Bank branch, corporate headquarters, law/accounting chambers',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Commercial%20HubsTBWeb_Publish/CD-02%20Pacific%20Commercial%20Hub.jpg',
    blueprintPrice: 19500,
    boqBomPrice: 11500,
    kitsetBasePrice: 640000,
    turnKeyPrice: 1250000,
    leadTimeWeeks: 16
  },
  {
    id: 'cd-03',
    code: 'CD-03',
    name: 'Modern Medical & Community Clinic',
    category: 'commercial-designs',
    subcategoryLabel: 'Commercial Design',
    areaSqm: 380,
    dimensions: '24.0m x 16.0m',
    tagline: 'Healthcare clinic with triage reception, 4 consult suites, pharmacy & solar backup',
    conceptEssence: 'Designed to clinical health standards with hygienic anti-microbial finishes, ambulance drop-off portico, and 100% uninterruptible solar power infrastructure.',
    description: 'A purpose-built healthcare facility featuring 4 patient consultation rooms, minor procedure theater, pathology lab room, pharmacy dispensary, and emergency vehicle bay.',
    keyFeatures: [
      'Covered emergency ambulance patient drop-off portico',
      'Four doctor consultation suites with handwashing basins and acoustic walls',
      'Sterile procedure room and dedicated pathology collection cubicle',
      'Public reception waiting area with separate triage intake desk',
      'Integrated solar battery backup guaranteeing 24/7 vaccine refrigeration'
    ],
    recommendedUse: 'Provincial health clinic, private medical center, dental & optical practice',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Commercial%20HubsTBWeb_Publish/CD-03%20Modern%20Medical%20%26%20Comm%20Clinic.png',
    blueprintPrice: 16000,
    boqBomPrice: 9500,
    kitsetBasePrice: 480000,
    turnKeyPrice: 890000,
    leadTimeWeeks: 14
  },
  {
    id: 'cd-04',
    code: 'CD-04',
    name: 'Coastal Eco-Tourism Resort Bungalow Block',
    category: 'commercial-designs',
    subcategoryLabel: 'Commercial Design',
    areaSqm: 520,
    dimensions: 'Master Plan / 8 Bungalows + Clubhouse',
    tagline: 'Modular resort complex with 8 private guest bungalows & central dining pavilion',
    conceptEssence: 'Rapid-deployment tourism infrastructure designed for PNG scenic coastlines and dive sites. Low environmental footprint with luxury guest appointments.',
    description: 'A complete modular resort package consisting of 8 luxury timber-look bungalow chalets and a central open-air restaurant & bar clubhouse with commercial kitchen.',
    keyFeatures: [
      'Eight individual 42 m² guest chalets with private sea-view verandas',
      'Central 180 m² open-sided timber dining pavilion and cocktail lounge',
      'Commercial kitchen, cold-room storage, and guest registration desk',
      'Minimal-excavation pile foundations preserving coastal vegetation and reef',
      'Eco-friendly greywater treatment system and solar thermal hot water units'
    ],
    recommendedUse: 'Island dive resort, eco-tourism lodge, boutique corporate retreat',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Commercial%20HubsTBWeb_Publish/CD-04%20Coastal%20Eco-Tourism%20Rsort%20Bungalow%20Block.png',
    blueprintPrice: 18500,
    boqBomPrice: 11000,
    kitsetBasePrice: 590000,
    turnKeyPrice: 1100000,
    leadTimeWeeks: 15
  },
  {
    id: 'cd-05',
    code: 'CD-05',
    name: 'Urban Co-Working & Tech Incubator',
    category: 'commercial-designs',
    subcategoryLabel: 'Commercial Design',
    areaSqm: 550,
    dimensions: '25.0m x 22.0m',
    tagline: 'Modern tech workspace with flexible hot-desks, private pods & boardroom',
    conceptEssence: 'Fosters collaboration and tech innovation in Port Moresby. Features acoustic zoning, podcast/media recording studio, high-speed fiber backbone, and cafe bar.',
    description: 'A cutting-edge commercial office environment with 60 hot-desk workstations, 6 private team breakout rooms, a 16-person video boardroom, and an artisan coffee lounge.',
    keyFeatures: [
      'Open plan co-working floor with high exposed ceilings and industrial lighting',
      'Six soundproof glass private office pods for 2-4 person startup teams',
      'State-of-the-art boardroom with smart teleconference screen integration',
      'Soundproofed podcast and video content production booth',
      'Central community cafe bar and informal bleacher presentation seating'
    ],
    recommendedUse: 'Tech incubator, co-working facility, multinational regional hub',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Commercial%20HubsTBWeb_Publish/CD-05-Urban%20Co-Working%20%26%20Tech%20Incubator.png',
    blueprintPrice: 17500,
    boqBomPrice: 10500,
    kitsetBasePrice: 540000,
    turnKeyPrice: 980000,
    leadTimeWeeks: 13
  },
  {
    id: 'cd-06',
    code: 'CD-06',
    name: 'Drive-Thru Service & Cafe Station',
    category: 'commercial-designs',
    subcategoryLabel: 'Commercial Design',
    areaSqm: 220,
    dimensions: '18.0m x 12.0m',
    tagline: 'Dual-lane drive-thru quick service cafe & convenience retail kiosk',
    conceptEssence: 'Optimized vehicle traffic circulation with rapid order fulfillment windows. Designed for arterial road highway stopovers and airport connectors.',
    description: 'A compact high-turnover commercial building featuring a drive-thru order lane, indoor dining area for 30 patrons, commercial kitchen line, and outdoor shaded patio.',
    keyFeatures: [
      'Dual-lane drive-thru vehicle ordering and pickup window canopy',
      'Commercial kitchen layout with grease trap and exhaust hood provisions',
      'Indoor customer dining area plus outdoor umbrella patio seating',
      'Reinforced concrete vehicle pavement and drive-thru curbing layout',
      'High-impact illuminated signage pylon and architectural fascia band'
    ],
    recommendedUse: 'Fast food outlet, highway coffee stop, petrol station retail kiosk',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Commercial%20HubsTBWeb_Publish/CD-06-Drive-Thru%20Service%20%26%20Cafe%20Station.jpg',
    blueprintPrice: 12500,
    boqBomPrice: 7500,
    kitsetBasePrice: 320000,
    turnKeyPrice: 590000,
    leadTimeWeeks: 10
  }
];

export const EDUCATION_AID_POST_DATA: ProductPlaceholder[] = [
  {
    id: 'eap-01',
    code: 'EAP-01',
    name: 'Administration Building & Resource Center',
    category: 'education-aid-post',
    subcategoryLabel: 'Administration & Institutional Facility',
    areaSqm: 320,
    dimensions: '24.0m x 14.0m',
    tagline: 'Centralized school & institutional administration hub with staff offices, conference room & resource library',
    conceptEssence: 'Provides a professional administrative and academic resource center for educational institutions, district hubs, or mission stations in PNG with executive principal offices, staff prep room, and digital library.',
    description: 'A comprehensive institutional administration and resource center facility. Features an executive principal/director suite, deputy and bursar offices, open-plan staff workroom for 20 teachers/officers, a 24-seat conference boardroom, dedicated digital resource library, and secure archival records storage.',
    keyFeatures: [
      'Executive leadership suites with private meeting lounge and consultation desks',
      'Open-plan teacher/staff preparation room with integrated workstations and charging bays',
      'Central digital resource center and multimedia library for curriculum development',
      'Secure high-density fire-resistant records archive and bursar fee collection booth',
      'Energy-efficient louvered breezeway cross-ventilation and backup solar power readiness'
    ],
    recommendedUse: 'Secondary school administration, district education office, technical college hub, institutional resource center',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Education%20%26%20Hospital%20Infrastructure/Admin%20and%20Resource%20Center-07-Option%202.jpg',
    blueprintPrice: 14500,
    boqBomPrice: 8500,
    kitsetBasePrice: 380000,
    turnKeyPrice: 690000,
    leadTimeWeeks: 12
  },
  {
    id: 'eap-02',
    code: 'EAP-02',
    name: '2 Storey 8 in 1 Junior High Classroom Block',
    category: 'education-aid-post',
    subcategoryLabel: 'High-Capacity Education Infrastructure',
    areaSqm: 520,
    dimensions: '32.0m x 9.0m (2-Storey / 8x Classrooms)',
    tagline: 'High-capacity 2-storey 8-classroom building block accommodating up to 360 students',
    conceptEssence: 'Engineered for growing junior high schools and secondary colleges across PNG to maximize land footprint yield. Features dual-level heavy structural steel framing, seismic/cyclone rating, and acoustic concrete mezzanine.',
    description: 'A robust 2-storey education complex providing eight standard 8m x 8m learning classrooms (four on ground floor, four on upper level). Built with wide double-sided sheltered verandas, dual concrete/steel escape stairs, lockable security louvers, and integrated roof catchment linking to 40,000L water storage.',
    keyFeatures: [
      'Eight spacious 8m x 8m learning classrooms accommodating 40-45 students each (360 total capacity)',
      'Dual reinforced steel escape staircases with safety balustrades and non-slip treads',
      'Reinforced acoustic composite concrete upper floor slab minimizing footfall sound transmission',
      'Wide 2.4m cantilevered covered access verandas providing weather shelter on both levels',
      'Engineered for PNG seismic Zone 1 and Category 5 tropical cyclone wind loadings'
    ],
    recommendedUse: 'Junior high school expansion, secondary school block, vocational college, high-density provincial academy',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Education%20%26%20Hospital%20Infrastructure/2%20Storey%20Classroom%20Block-Lumion%20Render%20008.jpg',
    blueprintPrice: 22000,
    boqBomPrice: 13500,
    kitsetBasePrice: 680000,
    turnKeyPrice: 1280000,
    leadTimeWeeks: 16
  },
  {
    id: 'eap-03',
    code: 'EAP-03',
    name: 'Modular STEM Science Lab & Digital Resource Center',
    category: 'education-aid-post',
    subcategoryLabel: 'Specialized Education Facility',
    areaSqm: 210,
    dimensions: '21.0m x 10.0m',
    tagline: 'Fully wired science laboratory, digital computer lab & satellite-ready multimedia library',
    conceptEssence: 'Brings 21st-century science and digital education to secondary and tertiary institutions in PNG. Built with chemical-resistant bench tops, gas/water plumbing feeds, and solar-supported computer network wiring.',
    description: 'A cutting-edge modular facility split into a wet-bench practical science laboratory and an adjoining digital computer research library. Equipped with surge-protected electrical channels, fume exhaust provisions, and secure equipment stores.',
    keyFeatures: [
      'Wet-lab section with 8 stainless steel wash stations, gas lines, and acid-resistant surfaces',
      'Computer lab section pre-wired for 32 student workstations and network server rack',
      'Rooftop 6kW solar array with lithium battery bank ensuring zero study downtime',
      'Double-door high-security chemical store and lockable teacher prep room',
      'Energy-efficient ceiling insulation and whisper-quiet ceiling fans throughout'
    ],
    recommendedUse: 'Secondary school science wing, technical vocational institute, community digital learning hub',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Education%20%26%20Hospital%20Infrastructure/Modular%20STEM%20Science%20Lab%20%26%20Digital%20Resource%20Center.jpg',
    blueprintPrice: 15500,
    boqBomPrice: 9000,
    kitsetBasePrice: 420000,
    turnKeyPrice: 790000,
    leadTimeWeeks: 14
  },
  {
    id: 'eap-04',
    code: 'EAP-04',
    name: 'Low Post 1 in 2 Classroom Science Lab or Standard Low Set',
    category: 'education-aid-post',
    subcategoryLabel: 'Low Post Dual Classroom / Science Lab',
    areaSqm: 180,
    dimensions: '20.0m x 9.0m (2x 9m x 9m Units)',
    tagline: 'Modular low-set 1-in-2 dual classroom building adaptable as science lab or standard learning spaces',
    conceptEssence: 'Versatile low-set structural chassis optimized for rapid flat-pack assembly on level or gently sloping rural school grounds. Easily configured as two standard classrooms or as an integrated practical science demonstration unit with adjoining theory lab.',
    description: 'A cost-effective, high-durability low-post double classroom block designed to meet PNG Department of Education spatial and ventilation standards. Features robust low-set concrete pile footings, wide front shaded veranda, cyclone-tested Colorbond roofing, and flexible partition wall options.',
    keyFeatures: [
      'Dual 9m x 9m learning spaces accommodating 45 students each (or dual science wet/dry lab)',
      'Low-post reinforced concrete stilt chassis providing elevated damp protection and easy ground access',
      'Heavy-duty security louvers and lockable steel insect mesh for secure overnight equipment storage',
      'High-capacity roof guttering linked to dual 5,000L clean drinking water rainwater tanks',
      'Modular flat-pack kitset pre-engineered for rapid provincial transport in 20ft container'
    ],
    recommendedUse: 'Primary and junior high school classrooms, community school science lab, vocational workshop',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Education%20%26%20Hospital%20Infrastructure/Low%20Post%20Double%202Classroom.jpg',
    blueprintPrice: 11000,
    boqBomPrice: 6500,
    kitsetBasePrice: 260000,
    turnKeyPrice: 480000,
    leadTimeWeeks: 9
  }
];

export const COMMERCIAL_WAREHOUSES_DATA: ProductPlaceholder[] = [
  {
    id: 'wh-01',
    code: 'WH-01',
    name: 'Apex Span Industrial Warehouse (500 m²)',
    category: 'commercial-warehouses',
    subcategoryLabel: 'Commercial Warehouse',
    areaSqm: 500,
    dimensions: '25.0m x 20.0m (Clear Span)',
    tagline: 'Clear-span industrial storage facility with 6.5m eave height & container bay',
    conceptEssence: 'Zero-interior-column design providing 100% unobstructed floor area for heavy forklift maneuvering, container de-stuffing, and high-bay pallet racking.',
    description: 'A 500 m² portal steel frame warehouse engineered for industrial storage, fabrication workshops, or distribution logistics. Features 6.5m clear eave height and 5m motorized roller shutters.',
    keyFeatures: [
      '20m clear-span portal frame with no central interior columns',
      '6.5m internal eave clearance accommodating 4-tier standard pallet racking',
      'Two 5.0m x 5.0m motorized industrial steel roller doors for 40ft container access',
      'Heavy-duty 150mm reinforced concrete slab with 35MPa load rating',
      'High-bay LED lighting and natural daylight polycarbonate roof skylight strips'
    ],
    recommendedUse: 'General freight warehousing, metal fabrication workshop, equipment depot',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Commercial%20Warehouse-TBWeb_Publish/WArehouse%201.png',
    blueprintPrice: 15000,
    boqBomPrice: 9000,
    kitsetBasePrice: 480000,
    turnKeyPrice: 880000,
    leadTimeWeeks: 12
  },
  {
    id: 'wh-02',
    code: 'WH-02',
    name: 'Logistics & Distribution Center (1,200 m²)',
    category: 'commercial-warehouses',
    subcategoryLabel: 'Commercial Warehouse',
    areaSqm: 1200,
    dimensions: '40.0m x 30.0m',
    tagline: 'High-throughput distribution warehouse with multi-level offices & dual loading docks',
    conceptEssence: 'Engineered for high-volume freight logistics with dual raised loading docks, comprehensive staff amenities, and an integrated 120 m² mezzanine administrative office.',
    description: 'A premier logistics facility boasting two container loading docks with dock levelers, heavy vehicle turning apron, fire sprinkler system, and executive dispatch office suite.',
    keyFeatures: [
      'Two raised loading dock bays equipped with hydraulic dock levelers',
      '8.0m high internal clearance for maximum vertical volumetric storage capacity',
      '120 m² two-level administrative office suite with dispatch viewing windows',
      'Complete fire hydrant system with dedicated 50,000L backup water tank',
      'Heavy-duty 200mm post-tensioned floor slab engineered for 8-ton axle loads'
    ],
    recommendedUse: 'National logistics hub, FMCG distribution center, sea-port bonded warehouse',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Commercial%20Warehouse-TBWeb_Publish/WArehouse%202.png',
    blueprintPrice: 28000,
    boqBomPrice: 16500,
    kitsetBasePrice: 1100000,
    turnKeyPrice: 2100000,
    leadTimeWeeks: 18
  },
  {
    id: 'wh-03',
    code: 'WH-03',
    name: 'Cold Storage & Agri-Processing Depot (800 m²)',
    category: 'commercial-warehouses',
    subcategoryLabel: 'Commercial Warehouse',
    areaSqm: 800,
    dimensions: '32.0m x 25.0m',
    tagline: 'Insulated PIR cold chain facility for agricultural export & perishable logistics',
    conceptEssence: 'Maintains strict temperature zones (-20°C freezer to +4°C chiller) with 150mm insulated PIR panels and dual hermetic refrigeration plant rooms.',
    description: 'Engineered for PNG fisheries, agricultural produce, and food distribution. Features dual climate-controlled zones, hygienic food-grade washdown surfaces, and backup diesel generator room.',
    keyFeatures: [
      'Two independent climate zones (Freezer -20°C and Chiller +4°C)',
      '150mm PIR high-density insulated fire-resistant sandwich wall and ceiling panels',
      'Under-floor glycol floor-heating matrix preventing sub-slab frost heave',
      'Insulated high-speed rapid-roll doors minimizing thermal loss during loading',
      'Food-grade stainless steel drainage gutters and anti-microbial floor screed'
    ],
    recommendedUse: 'Coffee/cocoa export depot, seafood cold storage, supermarket perishables',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Commercial%20Warehouse-TBWeb_Publish/WArehouse%203.png',
    blueprintPrice: 24000,
    boqBomPrice: 14000,
    kitsetBasePrice: 890000,
    turnKeyPrice: 1680000,
    leadTimeWeeks: 16
  },
  {
    id: 'wh-04',
    code: 'WH-04',
    name: 'Multi-Tenancy Flexi-Industrial Park (1,600 m²)',
    category: 'commercial-warehouses',
    subcategoryLabel: 'Commercial Warehouse',
    areaSqm: 1600,
    dimensions: '64.0m x 25.0m (4x 400 m² Units)',
    tagline: '4-Unit flexi-warehouse complex with dedicated storefront offices & roller access',
    conceptEssence: 'Modular multi-tenant industrial park providing four self-contained 400 m² commercial units, each with independent power meters, glass office entry, and rear roller doors.',
    description: 'An outstanding commercial investment property. Four identical 400 m² light-industrial units designed for SME tenants, contractors, hardware distributors, or automotive service hubs.',
    keyFeatures: [
      'Four separate 400 m² units, each with private glass reception and 2-storey office',
      'Independent sub-metered 3-phase 100A power boards and water connections for each unit',
      'Individual 4.5m x 4.5m automated roller shutter doors for vehicle and forklift entry',
      'Shared concrete vehicle courtyard with designated customer and staff parking bays',
      'High-security perimeter fencing with automated access control boom gate'
    ],
    recommendedUse: 'Commercial investment park, SME contractor units, multi-tenant industrial park',
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/Commercial%20Warehouse-TBWeb_Publish/WArehouse%204Shed.png',
    blueprintPrice: 32000,
    boqBomPrice: 19000,
    kitsetBasePrice: 1450000,
    turnKeyPrice: 2750000,
    leadTimeWeeks: 20
  }
];

export interface ProductCategoryTab {
  id: 'all' | 'residential-kit-homes' | 'tiny-homes' | 'garden-pergolas' | 'commercial-designs' | 'education-aid-post' | 'commercial-warehouses';
  label: string;
  shortLabel: string;
  badge: string;
  count: number;
  description: string;
}

export const PRODUCT_CATEGORIES: ProductCategoryTab[] = [
  {
    id: 'all',
    label: 'All Products Hub',
    shortLabel: 'All Products',
    badge: '49 Total',
    count: 49,
    description: 'Browse our complete catalog of 20 Kit Homes, 9 Tiny & Container Homes, 6 Pergolas, 6 Commercial, 4 Education & Aid Posts, and 4 Warehouses.'
  },
  {
    id: 'residential-kit-homes',
    label: 'Residential Kit Homes',
    shortLabel: 'Kit Homes',
    badge: '20 Models',
    count: 20,
    description: 'Official 20-model modular home register from 1-bedroom studio pods to 4-bedroom executive highsets.'
  },
  {
    id: 'tiny-homes',
    label: 'Tiny & Container Homes',
    shortLabel: 'Tiny & Containers',
    badge: '9 Concepts',
    count: 9,
    description: '4 Tiny Home mobile & off-grid concepts plus 5 High-Cube Shipping Container living solutions.'
  },
  {
    id: 'garden-pergolas',
    label: 'Garden Pergola Systems',
    shortLabel: 'Garden Pergolas',
    badge: '6 Systems',
    count: 6,
    description: '6 Architectural timber, motorized bioclimatic, cantilever steel, and solar-canopy outdoor pergolas.'
  },
  {
    id: 'commercial-designs',
    label: 'Commercial Designs',
    shortLabel: 'Commercial',
    badge: '6 Concepts',
    count: 6,
    description: '6 Turnkey commercial concepts including retail plazas, 2-storey office hubs, clinics, and resorts.'
  },
  {
    id: 'education-aid-post',
    label: 'Education & Aid Post Infrastructure',
    shortLabel: 'Education & Aid Post',
    badge: '4 Designs',
    count: 4,
    description: '4 Turnkey educational and institutional designs: Administration Buildings & Resource Centers, 2-Storey 8-in-1 Classroom Blocks, STEM Science Labs, and Low Post Classrooms.'
  },
  {
    id: 'commercial-warehouses',
    label: 'Commercial Warehouse Designs',
    shortLabel: 'Warehouses',
    badge: '4 Solutions',
    count: 4,
    description: '4 Clear-span industrial warehouses, logistics hubs, cold-storage depots, and multi-tenant parks.'
  }
];
