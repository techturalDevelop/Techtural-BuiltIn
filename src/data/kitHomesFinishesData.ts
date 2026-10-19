import { KitHomeModel } from './kitHomesData';

export interface FinishOption {
  id: string;
  category: 'kitchen' | 'wardrobe' | 'living';
  name: string;
  code: string;
  subtitle: string;
  price: number;
  image: string;
  features: string[];
  description: string;
  modelSpecificImages?: Record<string, string>;
  modelSpecificNames?: Record<string, string>;
}

export const KIT_HOME_FINISH_OPTIONS: FinishOption[] = [
  {
    id: 'kitchen-modern-island',
    category: 'kitchen',
    name: 'Modern Executive Island Kitchen',
    code: 'KIT-EX-01',
    subtitle: 'Quartz stone waterfall benchtop, soft-close 2-pack polyurethane cabinetry & integrated island bar',
    price: 18500,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M01a%20(1).png',
    modelSpecificImages: {
      'tb-spl1b-m1': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M01a%20(1).png',
      'tb-ses1b-m2': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M02a%20(1).png',
      'tb-cpl2b-m2': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M02a%20(1).png',
      'tb-hc1b-m3': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M03a.png',
      'tb-epl2b-m3': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M03a.png',
      'tb-ch1b-m4': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M01a%20(1).png',
      'tb-tpl3b-m4': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M01a%20(1).png',
      '1': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M01a%20(1).png',
      '2': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M02a%20(1).png',
      '3': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M03a.png',
      '4': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M01a%20(1).png',
      'm1': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M01a%20(1).png',
      'm2': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M02a%20(1).png',
      'm3': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M03a.png',
      'm4': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M01a%20(1).png',
    },
    modelSpecificNames: {
      '1': 'Modern Executive Island Kitchen M1',
      '2': 'Modern Executive Island Kitchen M2',
      '3': 'Modern Executive Island Kitchen M3',
      '4': 'Modern Executive Island Kitchen M4',
      'm1': 'Modern Executive Island Kitchen M1',
      'm2': 'Modern Executive Island Kitchen M2',
      'm3': 'Modern Executive Island Kitchen M3',
      'm4': 'Modern Executive Island Kitchen M4',
    },
    features: [
      'Engineered quartz stone 20mm waterfall island benchtop',
      'High-gloss soft-close 2-pack polyurethane cabinetry & pantry',
      'Integrated under-mount stainless steel double bowl sink & pull-out spray mixer',
      'Concealed LED under-cabinet architectural task lighting strip',
      'Ceramic subway tile splashback with waterproof moisture seal',
    ],
    description: 'A contemporary luxury open-plan kitchen ensemble engineered for family entertaining and tropical ventilation. Includes high-durability scratch and heat-resistant quartz surfaces with premium concealed European runner hardware.'
  },
  {
    id: 'kitchen-coastal-tropical',
    category: 'kitchen',
    name: 'Warm Coastal Tropical Kitchen',
    code: 'KIT-TR-02',
    subtitle: 'Warm tropical timber grain finishes, moisture-sealed composite worktops & matte graphite fixtures',
    price: 14800,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M01b%20(1).png',
    modelSpecificImages: {
      'tb-spl1b-m1': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M01b%20(1).png',
      'tb-ses1b-m2': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M02a.png',
      'tb-cpl2b-m2': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M02a.png',
      'tb-hc1b-m3': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M03b.png',
      'tb-epl2b-m3': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M03b.png',
      'tb-ch1b-m4': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M01b%20(1).png',
      'tb-tpl3b-m4': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M01b%20(1).png',
      '1': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M01b%20(1).png',
      '2': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M02a.png',
      '3': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M03b.png',
      '4': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M01b%20(1).png',
      'm1': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M01b%20(1).png',
      'm2': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M02a.png',
      'm3': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M03b.png',
      'm4': 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/TB-KF-M01b%20(1).png',
    },
    modelSpecificNames: {
      '1': 'Warm Coastal Tropical Kitchen M1',
      '2': 'Warm Coastal Tropical Kitchen M2',
      '3': 'Warm Coastal Tropical Kitchen M3',
      '4': 'Warm Coastal Tropical Kitchen M4',
      'm1': 'Warm Coastal Tropical Kitchen M1',
      'm2': 'Warm Coastal Tropical Kitchen M2',
      'm3': 'Warm Coastal Tropical Kitchen M3',
      'm4': 'Warm Coastal Tropical Kitchen M4',
    },
    features: [
      'Hardwood timber grain laminated cabinet fronts with black architectural bar pulls',
      'Durable solid-surface composite worktops with moisture-resistant sub-core',
      'Overhead open display box shelving with integrated strip illumination',
      'Heavy-duty matte black pull-out gooseneck commercial mixer tap',
      'Spacious floor-to-ceiling larder pull-out wire pantry basket system',
    ],
    description: 'An organic coastal tropical modern kitchen aesthetic combining warm natural wood tones with heavy-duty commercial tapware and easy-clean surfaces suited to Pacific coastal living.'
  },
  {
    id: 'wardrobe-walk-in-suite',
    category: 'wardrobe',
    name: 'Custom Walk-In-Wardrobe Suite',
    code: 'WDR-WI-01',
    subtitle: 'Collection A modular organizers, dual hanging tiers, shoe gallery & valet drawers',
    price: 9600,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/Collection%20A%20Walk%20In%20Wardrobe.png',
    modelSpecificNames: {
      '1': 'Custom Walk-In-Wardrobe Suite M1',
      '2': 'Custom Walk-In-Wardrobe Suite M2',
      '3': 'Custom Walk-In-Wardrobe Suite M3',
      '4': 'Custom Walk-In-Wardrobe Suite M4',
      'm1': 'Custom Walk-In-Wardrobe Suite M1',
      'm2': 'Custom Walk-In-Wardrobe Suite M2',
      'm3': 'Custom Walk-In-Wardrobe Suite M3',
      'm4': 'Custom Walk-In-Wardrobe Suite M4',
    },
    features: [
      'Custom floor-to-ceiling full melamine modular carcass system (2400mm H)',
      'Dual-tier upper and lower chrome garment hanging rails with anti-slip grooves',
      'Velvet-lined accessories & watch/jewelry drawer inserts with dividers',
      'Built-in 6-tier angled shoe gallery shelves with brushed aluminum front lips',
      'Integrated warm 3000K sensor-activated LED vertical lighting channels',
    ],
    description: 'Full custom master walk-in wardrobe system engineered to maximize vertical headroom, offering designated compartments for formal attire, footwear, linens, and accessories.'
  },
  {
    id: 'custom-tv-wall-unit',
    category: 'living',
    name: 'Custom TV Wall Unit',
    code: 'TVW-CL-01',
    subtitle: 'Collection A floating entertainment credenza, fluted acoustic feature wall & cable management',
    price: 7800,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Standard%20Kitchen%20Fitouts/Collection%20A%20TV%20Wall%20Unit.png',
    modelSpecificNames: {
      '1': 'Custom TV Wall Unit M1',
      '2': 'Custom TV Wall Unit M2',
      '3': 'Custom TV Wall Unit M3',
      '4': 'Custom TV Wall Unit M4',
      'm1': 'Custom TV Wall Unit M1',
      'm2': 'Custom TV Wall Unit M2',
      'm3': 'Custom TV Wall Unit M3',
      'm4': 'Custom TV Wall Unit M4',
    },
    features: [
      'Custom floating media console with soft-close push-to-open drawer compartments',
      'Acoustic timber-fluted feature wall cladding with integrated cable routing chase',
      'Recessed ambient 3000K warm LED perimeter backlighting channel',
      'Heavy-duty reinforced structural TV wall mount backing for displays up to 75"',
      'Pre-drilled AV conduit ports and integrated power/data point consolidation',
    ],
    description: 'An architectural entertainment and media wall centerpiece engineered for modern open-plan living. Combines contemporary fluted timber texture with clean floating cabinetry and concealed wiring for a clutter-free living room.'
  },
];

/**
 * Returns finish options dynamically tailored for a given Kit Home model (e.g. M1, M2, M3, M4).
 */
export function getFinishOptionsForModel(model?: KitHomeModel | string | number | null): FinishOption[] {
  if (!model) return KIT_HOME_FINISH_OPTIONS;

  let modelKey = '';
  let numKey = '';

  if (typeof model === 'string') {
    modelKey = model.toLowerCase();
    numKey = modelKey.replace(/[^0-9]/g, '');
  } else if (typeof model === 'number') {
    numKey = String(model);
    modelKey = `m${model}`;
  } else if (typeof model === 'object' && model !== null) {
    modelKey = (model.id || '').toLowerCase();
    numKey = model.officialNumber ? String(model.officialNumber) : modelKey.replace(/[^0-9]/g, '');
  }

  return KIT_HOME_FINISH_OPTIONS.map(opt => {
    let resolvedImage = opt.image;
    let resolvedName = opt.name;

    if (opt.modelSpecificImages) {
      if (modelKey && opt.modelSpecificImages[modelKey]) {
        resolvedImage = opt.modelSpecificImages[modelKey];
      } else if (numKey && opt.modelSpecificImages[numKey]) {
        resolvedImage = opt.modelSpecificImages[numKey];
      } else if (numKey && opt.modelSpecificImages[`m${numKey}`]) {
        resolvedImage = opt.modelSpecificImages[`m${numKey}`];
      }
    }

    if (opt.modelSpecificNames) {
      if (modelKey && opt.modelSpecificNames[modelKey]) {
        resolvedName = opt.modelSpecificNames[modelKey];
      } else if (numKey && opt.modelSpecificNames[numKey]) {
        resolvedName = opt.modelSpecificNames[numKey];
      } else if (numKey && opt.modelSpecificNames[`m${numKey}`]) {
        resolvedName = opt.modelSpecificNames[`m${numKey}`];
      }
    }

    return {
      ...opt,
      image: resolvedImage,
      name: resolvedName,
    };
  });
}
