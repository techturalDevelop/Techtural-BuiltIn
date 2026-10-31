/**
 * Lightweight mapping of all 20 Techtural Kit Home models
 * Used for dynamic OpenGraph thumbnail injection at the edge (Cloudflare Workers/Pages)
 * and in server-side Express rendering.
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
    id: 'tb-sps1b-m3',
    officialNumber: 3,
    code: 'TB-SPS1B-M3',
    name: 'TB Studio Pod Stilt 1B',
    bedrooms: 1,
    bathrooms: 1,
    buildingAreaSqm: 88,
    turnkeyPrice: 237600,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M3%20TBWeb_Publish/M3-Artist_000%20(5).jpg'
  },
  {
    id: 'tb-wcb1b-m4',
    officialNumber: 4,
    code: 'TB-WCB1B-M4',
    name: 'TB Weekend Coastal Bach 1B',
    bedrooms: 1,
    bathrooms: 1,
    buildingAreaSqm: 112,
    turnkeyPrice: 302400,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M4%20TBWeb_Publish/M4-Artist_000%20(4).jpg'
  },
  {
    id: 'tb-vsp2b-m5',
    officialNumber: 5,
    code: 'TB-VSP2B-M5',
    name: 'TB Village Starter Pod 2B',
    bedrooms: 2,
    bathrooms: 1,
    buildingAreaSqm: 104,
    turnkeyPrice: 280800,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M5%20TBWeb_Publish/M5-Artist_000%20(1).jpg'
  },
  {
    id: 'tb-hps2b-m6',
    officialNumber: 6,
    code: 'TB-HPS2B-M6',
    name: 'TB Highland Pioneer Starter 2B',
    bedrooms: 2,
    bathrooms: 1,
    buildingAreaSqm: 118,
    turnkeyPrice: 318600,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M6%20TBWeb_Publish/M6-Artist_000.jpg'
  },
  {
    id: 'tb-csh2b-m7',
    officialNumber: 7,
    code: 'TB-CSH2B-M7',
    name: 'TB Coastal Settlement Home 2B',
    bedrooms: 2,
    bathrooms: 1,
    buildingAreaSqm: 135,
    turnkeyPrice: 364500,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M7%20TBWeb_Publish/M7-Artist_000%20(6).jpg'
  },
  {
    id: 'tb-seh2b-m8',
    officialNumber: 8,
    code: 'TB-SEH2B-M8',
    name: 'TB Suburban Eco Haven 2B',
    bedrooms: 2,
    bathrooms: 1.5,
    buildingAreaSqm: 142,
    turnkeyPrice: 383400,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M8%20TBWeb_Publish/M8-Artist_000%20(2).jpg'
  },
  {
    id: 'tb-afh3b-m9',
    officialNumber: 9,
    code: 'TB-AFH3B-M9',
    name: 'TB Aspirational Family Home 3B',
    bedrooms: 3,
    bathrooms: 2,
    buildingAreaSqm: 168,
    turnkeyPrice: 453600,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M9%20TBWeb_Publish/M9-Artist_000%20(1).jpg'
  },
  {
    id: 'tb-hfh3b-m10',
    officialNumber: 10,
    code: 'TB-HFH3B-M10',
    name: 'TB Highland Family Homestead 3B',
    bedrooms: 3,
    bathrooms: 2,
    buildingAreaSqm: 175,
    turnkeyPrice: 472500,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M10%20TBWeb_Publish/M10-Artist_000%20(5).jpg'
  },
  {
    id: 'tb-prh3b-m11',
    officialNumber: 11,
    code: 'TB-PRH3B-M11',
    name: 'TB Pacific Resilient Homestead 3B',
    bedrooms: 3,
    bathrooms: 2,
    buildingAreaSqm: 182,
    turnkeyPrice: 582400,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M11%20TBWeb_Publish/M11-Artist_000%20(4).jpg'
  },
  {
    id: 'tb-hsh3b-m12',
    officialNumber: 12,
    code: 'TB-HSH3B-M12',
    name: 'TB Highset Stilt Homestead 3B',
    bedrooms: 3,
    bathrooms: 2,
    buildingAreaSqm: 196,
    turnkeyPrice: 627200,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M12%20TBWeb_Publish/M12-Artist_000%20(7).jpg'
  },
  {
    id: 'tb-crh3b-m13',
    officialNumber: 13,
    code: 'TB-CRH3B-M13',
    name: 'TB Coastal Resilient Highset 3B',
    bedrooms: 3,
    bathrooms: 2,
    buildingAreaSqm: 210,
    turnkeyPrice: 672000,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M13%20TBWeb_Publish/M13-Artist_000%20(3).jpg'
  },
  {
    id: 'tb-rfh3b-m14',
    officialNumber: 14,
    code: 'TB-RFH3B-M14',
    name: 'TB Riverine Floodplain Highset 3B',
    bedrooms: 3,
    bathrooms: 2.5,
    buildingAreaSqm: 224,
    turnkeyPrice: 716800,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M14%20TBWeb_Publish/M14-Artist_000%20(2).jpg'
  },
  {
    id: 'tb-pfm4b-m15',
    officialNumber: 15,
    code: 'TB-PFM4B-M15',
    name: 'TB Prestige Family Manor 4B',
    bedrooms: 4,
    bathrooms: 2.5,
    buildingAreaSqm: 248,
    turnkeyPrice: 793600,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M15%20TBWeb_Publish/M15-Artist_000%20(1).jpg'
  },
  {
    id: 'tb-ueh4b-m16',
    officialNumber: 16,
    code: 'TB-UEH4B-M16',
    name: 'TB Urban Executive Haven 4B',
    bedrooms: 4,
    bathrooms: 3,
    buildingAreaSqm: 265,
    turnkeyPrice: 848000,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M16%20TBWeb_Publish/M16-Artist_000.jpg'
  },
  {
    id: 'tb-hfe4b-m17',
    officialNumber: 17,
    code: 'TB-HFE4B-M17',
    name: 'TB Highland Flagship Estate 4B',
    bedrooms: 4,
    bathrooms: 3,
    buildingAreaSqm: 285,
    turnkeyPrice: 912000,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M17%20TBWeb_Publish/M17-Artist_000%20(1).jpg'
  },
  {
    id: 'tb-cpr4b-m18',
    officialNumber: 18,
    code: 'TB-CPR4B-M18',
    name: 'TB Coastal Premier Residence 4B',
    bedrooms: 4,
    bathrooms: 3.5,
    buildingAreaSqm: 310,
    turnkeyPrice: 992000,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M18%20TBWeb_Publish/M18-Artist_000%20(2).jpg'
  },
  {
    id: 'tb-mge4b-m19',
    officialNumber: 19,
    code: 'TB-MGE4B-M19',
    name: 'TB Multi-Gen Grand Estate 4B+',
    bedrooms: 5,
    bathrooms: 4,
    buildingAreaSqm: 345,
    turnkeyPrice: 1104000,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M19%20TBWeb_Publish/M19-Artist_000%20(3).jpg'
  },
  {
    id: 'tb-fmh4b-m20',
    officialNumber: 20,
    code: 'TB-FMH4B-M20',
    name: 'TB Flagship Multi-Level Homestead 4B',
    bedrooms: 4,
    bathrooms: 4,
    buildingAreaSqm: 375,
    turnkeyPrice: 1200000,
    image: 'https://pub-9f2543783aca40a1995960e1c96f77c2.r2.dev/TB%20Kit%20Residential%20Homes/M20%20TBWeb_Publish/M20-Artist_000%20(4).jpg'
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
