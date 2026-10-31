/**
 * Canonical mapping of all 20 Techtural Kit Home models for OpenGraph and social sharing.
 * Fully self-contained to guarantee zero Node ESM resolution errors and 100% consistency
 * with KIT_HOME_MODELS across Cloudflare Workers, Cloudflare Pages, Express, and static HTML generators.
 */

export interface ModelShareMetadata {
  id: string;
  officialNumber: number;
  code: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  buildingAreaSqm: number;
  image: string;
  turnkeyPrice: number;
}

export const KIT_HOMES_SHARE_MAP: ModelShareMetadata[] = [
  {
    id: 'tb-spl1b-m1',
    officialNumber: 1,
    code: 'TB-SPL1B-M1',
    name: 'TB Studio Pod Lite 1B',
    bedrooms: 1,
    bathrooms: 1,
    buildingAreaSqm: 91.3,
    turnkeyPrice: 246510,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M1%20TBWeb_Publish/M1-Artist_012.jpg'
  },
  {
    id: 'tb-ses1b-m2',
    officialNumber: 2,
    code: 'TB-SES1B-M2',
    name: 'TB Solomon Eco Studio 1B',
    bedrooms: 1,
    bathrooms: 2,
    buildingAreaSqm: 126,
    turnkeyPrice: 340200,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M2%20TBWeb_Publish/M2-Artist_000%20(8).jpg'
  },
  {
    id: 'tb-hc1b-m3',
    officialNumber: 3,
    code: 'TB-HC1B-M3',
    name: 'TB Highland Cabin 1B',
    bedrooms: 1,
    bathrooms: 1,
    buildingAreaSqm: 128.7,
    turnkeyPrice: 347490,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M3%20TBWeb_Publish/M3-D5%20Render%20(6).png'
  },
  {
    id: 'tb-ch1b-m4',
    officialNumber: 4,
    code: 'TB-CH1B-M4',
    name: 'TB Coastal Haven 1B',
    bedrooms: 1,
    bathrooms: 2,
    buildingAreaSqm: 92.4,
    turnkeyPrice: 249480,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M4%20TBWeb_Publish/M4-D5%20Render%20(3).jpg'
  },
  {
    id: 'tb-kun2b-m5',
    officialNumber: 5,
    code: 'TB-KUN2B-M5',
    name: 'TB Hill Kundu Resident 2B',
    bedrooms: 2,
    bathrooms: 2,
    buildingAreaSqm: 73.92,
    turnkeyPrice: 199584,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M5%20TBWeb_Publish/M5-Lumion%20Render%20012.jpg'
  },
  {
    id: 'tb-cor2b-m6',
    officialNumber: 6,
    code: 'TB-COR2B-M6',
    name: 'TB Coral 2B',
    bedrooms: 2,
    bathrooms: 1,
    buildingAreaSqm: 96,
    turnkeyPrice: 259200,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M6%20TBWeb_Publish/M6-Lumion%20Render%20009.jpg'
  },
  {
    id: 'tb-lag2b-m7',
    officialNumber: 7,
    code: 'TB-LAG2B-M7',
    name: 'TB Lagoon 2B',
    bedrooms: 2,
    bathrooms: 1,
    buildingAreaSqm: 139.2,
    turnkeyPrice: 375840,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M7%20TBWeb_Publish/M7_Lumion%20Render-013.jpg'
  },
  {
    id: 'tb-blf2b-m8',
    officialNumber: 8,
    code: 'TB-BLF2B-M8',
    name: 'TB Bilum Family 2B',
    bedrooms: 2,
    bathrooms: 1,
    buildingAreaSqm: 124.8,
    turnkeyPrice: 336960,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M8%20TBWeb_Publish/M8-Lumion%20Render%204.png'
  },
  {
    id: 'tb-kum3b-m9',
    officialNumber: 9,
    code: 'TB-KUM3B-M9',
    name: 'TB Kumul Tree 3B',
    bedrooms: 3,
    bathrooms: 2,
    buildingAreaSqm: 159.96,
    turnkeyPrice: 431892,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M9%20TBWeb_Publish/M9-Lumion%20Render%208.jpg'
  },
  {
    id: 'tb-ech3b-m10',
    officialNumber: 10,
    code: 'TB-ECH3B-M10',
    name: 'TB Elevated Coastal Home 3B',
    bedrooms: 4,
    bathrooms: 2,
    buildingAreaSqm: 241.8,
    turnkeyPrice: 652860,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M10%20TBWeb_Publish/M10D5-Render%20Elevation%201.jpg'
  },
  {
    id: 'tb-hig3b-m11',
    officialNumber: 11,
    code: 'TB-HIG3B-M11',
    name: 'TB Highlands Three 3B',
    bedrooms: 3,
    bathrooms: 2,
    buildingAreaSqm: 120,
    turnkeyPrice: 384000,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M11%20TBWeb_Publish/M11-Lumoin-Render%20001.jpg'
  },
  {
    id: 'tb-spk3b-m12',
    officialNumber: 12,
    code: 'TB-SPK3B-M12',
    name: 'TB Split Level Sepik Highset 3B',
    bedrooms: 3,
    bathrooms: 2,
    buildingAreaSqm: 135,
    turnkeyPrice: 432000,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M12%20TBWeb_Publish/M12%20Lumion-Render%20006.png'
  },
  {
    id: 'tb-tam3b-m13',
    officialNumber: 13,
    code: 'TB-TAM3B-M13',
    name: 'TB Tambaran Highset 3B',
    bedrooms: 3,
    bathrooms: 2.5,
    buildingAreaSqm: 148,
    turnkeyPrice: 473600,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M13%20TBWeb_Publish/TB-M13-Lumion%20007.jpg'
  },
  {
    id: 'tb-kdh4b-m14',
    officialNumber: 14,
    code: 'TB-KDH4B-M14',
    name: 'TB Kundu Highset 3B',
    bedrooms: 3,
    bathrooms: 2,
    buildingAreaSqm: 140,
    turnkeyPrice: 448000,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M14%20TBWeb_Publish/M14-Lumion%20Render-002.jpg'
  },
  {
    id: 'tb-sgh4b-m15',
    officialNumber: 15,
    code: 'TB-SGH4B-M15',
    name: 'TB Grand Pacific 4B',
    bedrooms: 4,
    bathrooms: 2.5,
    buildingAreaSqm: 158,
    turnkeyPrice: 505600,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M15%20TBWeb_Publish/M15%20RenderD5%20(5).jpg'
  },
  {
    id: 'tb-kmh4b-m16',
    officialNumber: 16,
    code: 'TB-KMH4B-M16',
    name: 'TB Highland Manor 4B',
    bedrooms: 4,
    bathrooms: 3,
    buildingAreaSqm: 176,
    turnkeyPrice: 563200,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M16%20TBWeb_Publish/M16-Lumion%20Render-007.jpg'
  },
  {
    id: 'tb-mot4b-m17',
    officialNumber: 17,
    code: 'TB-MOT4B-M17',
    name: 'TB Motu Urban Living Oasis 4B',
    bedrooms: 4,
    bathrooms: 3,
    buildingAreaSqm: 192,
    turnkeyPrice: 614400,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M17%20TBWeb_Publish/M17-Lumion%20Render-04.jpg'
  },
  {
    id: 'tb-kna4b-m18',
    officialNumber: 18,
    code: 'TB-KNA4B-M18',
    name: 'TB Signature Kina 4B – 2-Storey',
    bedrooms: 4,
    bathrooms: 3.5,
    buildingAreaSqm: 218,
    turnkeyPrice: 697600,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M18%20TBWeb_Publish/GG-HH_Resident-Design-3D.png'
  },
  {
    id: 'tb-sov4b-m19',
    officialNumber: 19,
    code: 'TB-SOV4B-M19',
    name: 'TB Sovereign Estate 4B',
    bedrooms: 4,
    bathrooms: 3.5,
    buildingAreaSqm: 230,
    turnkeyPrice: 736000,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/GH-4bed%20unit.png'
  },
  {
    id: 'tb-phg5b-m20',
    officialNumber: 20,
    code: 'TB-PHG5B-M20',
    name: 'TB Pacific Horizon Grand 5B – 2-Storey',
    bedrooms: 5,
    bathrooms: 4,
    buildingAreaSqm: 260,
    turnkeyPrice: 832000,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M20%20TBWeb_Publish/TB%20Model%2020-Signature%20Premium%20200%204B%20(2-Storey)b.png'
  }
];

export function getShareMetadata(identifier: string | null | undefined): ModelShareMetadata | undefined {
  if (!identifier) return undefined;
  const clean = identifier.trim().toLowerCase();
  const normalized = clean.replace(/^(model-|model_|m)/i, '');
  const parsedNum = parseInt(normalized, 10);

  return KIT_HOMES_SHARE_MAP.find(m => {
    if (m.id.toLowerCase() === clean) return true;
    if (m.code.toLowerCase() === clean) return true;
    if (String(m.officialNumber) === clean || String(m.officialNumber) === normalized) return true;
    if (!isNaN(parsedNum) && m.officialNumber === parsedNum) return true;
    if (`model-${m.officialNumber}`.toLowerCase() === clean) return true;
    if (`m${m.officialNumber}`.toLowerCase() === clean) return true;
    if (m.name.toLowerCase() === clean) return true;
    return false;
  });
}
