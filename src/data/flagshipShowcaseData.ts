import { KIT_HOME_MODELS, KitHomeModel } from './kitHomesData';

/**
 * 10 Flagship Kit Home Model IDs displayed in the introductory welcome slideshow.
 * Models: 2, 3, 5, 6, 7, 8, 9, 10, 15, and 16.
 */
export const FLAGSHIP_SHOWCASE_IDS: string[] = [
  'tb-ses1b-m2',  // Model 02 — TB Solomon Eco Studio 1B
  'tb-hc1b-m3',   // Model 03 — TB Highland Cabin 1B
  'tb-kun2b-m5',  // Model 05 — TB Hill Kundu Resident 2B
  'tb-cor2b-m6',  // Model 06 — TB Coral 2B
  'tb-lag2b-m7',  // Model 07 — TB Lagoon 2B
  'tb-blf2b-m8',  // Model 08 — TB Bilum Family 2B
  'tb-kum3b-m9',  // Model 09 — TB Kumul Tree 3B
  'tb-ech3b-m10', // Model 10 — TB Elevated Coastal Home 3B
  'tb-sgh4b-m15', // Model 15 — TB Grand Pacific 4B
  'tb-kmh3b-m16', // Model 16 — TB Highland Manor 3B
];

export const FLAGSHIP_SHOWCASE_MODELS: KitHomeModel[] = FLAGSHIP_SHOWCASE_IDS
  .map((id) => KIT_HOME_MODELS.find((m) => m.id === id))
  .filter((model): model is KitHomeModel => Boolean(model));
