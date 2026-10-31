import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
interface ModelShareMetadata {
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

const KIT_HOMES_SHARE_MAP: ModelShareMetadata[] = [
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

function getShareMetadata(identifier: string | null | undefined): ModelShareMetadata | undefined {
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

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use('/share-thumbnails', express.static(path.join(process.cwd(), 'public', 'share-thumbnails')));

// Lazy init Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// In-memory store for portal inquiries & consultation requests
interface StoredInquiry {
  id: string;
  type: 'contact_message' | 'project_consultation';
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  projectType?: string;
  service?: string;
  location?: string;
  budget?: string;
  details?: any;
  status: 'new' | 'reviewed' | 'contacted';
  receivedAt: string;
}

const inMemoryInquiries: StoredInquiry[] = [
  {
    id: 'req-init-01',
    type: 'project_consultation',
    name: 'George Vele',
    email: 'g.vele@example.com.pg',
    phone: '+675 7234 5678',
    projectType: 'residential',
    service: 'Full Turnkey Construction - Kit Home Haus Kumul (TB-SPL1B-01)',
    location: 'Port Moresby (Waigani)',
    budget: 'K500k - K2M',
    status: 'reviewed',
    receivedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'msg-init-02',
    type: 'contact_message',
    name: 'Sarah Kuman',
    email: 'sarah.k@miningpng.com',
    phone: '+675 7198 2345',
    subject: 'Commercial Office Space & Warehouse Tender',
    message: 'We are seeking certified architectural drawings and quantity surveying for a 2-storey office and storage facility in Lae Morobe Province.',
    status: 'new',
    receivedAt: new Date(Date.now() - 3600000 * 6).toISOString()
  }
];

// POST /api/contact-message (Portal Inbox fallback)
app.post('/api/contact-message', (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const record: StoredInquiry = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: 'contact_message',
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : undefined,
      subject: subject ? String(subject).trim() : 'General Project Inquiry',
      message: String(message).trim(),
      status: 'new',
      receivedAt: new Date().toISOString()
    };

    inMemoryInquiries.unshift(record);
    console.log(`[PORTAL INBOX] New Contact Message received from ${record.name} (${record.email}) - "${record.subject}"`);

    return res.status(200).json({
      success: true,
      id: record.id,
      message: 'Contact message successfully received and registered in Portal Inbox.'
    });
  } catch (err: any) {
    console.error('Error in /api/contact-message:', err);
    return res.status(500).json({ error: 'Failed to process contact message.' });
  }
});

// POST /api/project-request (Consultation Desk fallback)
app.post('/api/project-request', (req, res) => {
  try {
    const { name, email, phone, projectType, service, location, budget, details } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const record: StoredInquiry = {
      id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: 'project_consultation',
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : 'Not provided',
      projectType: projectType || 'residential',
      service: service || 'Full Turnkey Construction',
      location: location || 'Port Moresby',
      budget: budget || 'Custom Budget',
      details: details || null,
      status: 'new',
      receivedAt: new Date().toISOString()
    };

    inMemoryInquiries.unshift(record);
    console.log(`[PROJECT DESK] New Consultation Request from ${record.name} (${record.email}) - Service: ${record.service}`);

    return res.status(200).json({
      success: true,
      id: record.id,
      message: 'Consultation request successfully received and registered in Project Desk.'
    });
  } catch (err: any) {
    console.error('Error in /api/project-request:', err);
    return res.status(500).json({ error: 'Failed to process consultation request.' });
  }
});

// GET /api/inquiries (View inquiries and consultation requests)
app.get('/api/inquiries', (req, res) => {
  return res.status(200).json({
    success: true,
    total: inMemoryInquiries.length,
    inquiries: inMemoryInquiries
  });
});

// Helper to run promise with timeout
function withTimeout<T>(promise: Promise<T>, ms: number, fallbackValue: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallbackValue), ms)),
  ]);
}

// Google Maps Grounding Location Intelligence Endpoint (gemini-3.5-flash + googleMaps)
app.post('/api/maps-location-intelligence', async (req, res) => {
  try {
    const { query, latitude, longitude, locationName } = req.body;

    if (!query && !locationName) {
      return res.status(400).json({ error: 'Query or location name is required' });
    }

    const ai = getGeminiClient();
    const prompt = query || `List key nearby building suppliers, construction hardware, logistics access points, or notable municipal landmarks in and around ${locationName || 'Port Moresby, Papua New Guinea'}. Provide concise details for property developers and project managers.`;

    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (typeof latitude === 'number' && typeof longitude === 'number') {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude,
            longitude,
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config,
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Extract links to guarantee compliance with Maps Grounding guidelines:
    // "If Google Maps is used, you MUST ALWAYS extract the URLs from groundingChunks and list them on the web app as links."
    const places: Array<{ title: string; uri: string; address?: string }> = [];
    if (Array.isArray(groundingChunks)) {
      for (const chunk of groundingChunks as any[]) {
        if (chunk?.maps?.uri) {
          places.push({
            title: chunk.maps.title || 'View on Google Maps',
            uri: chunk.maps.uri,
            address: chunk.maps.placeAnswerSources?.reviewSnippets?.[0] || undefined,
          });
        }
      }
    }

    return res.json({
      success: true,
      text,
      places,
      groundingChunks,
      locationName: locationName || 'Papua New Guinea',
    });
  } catch (error: any) {
    console.error('Maps Grounding Error:', error);
    // Provide a graceful fallback response if the API quota is saturated
    return res.status(200).json({
      success: false,
      error: error?.message || 'Maps service unavailable',
      fallback: true,
      text: `Location intelligence for ${req.body.locationName || 'this site'}: Nearby building material merchants, regional transport corridors, and ports connect this site to main provincial distribution routes in Papua New Guinea.`,
      places: [
        {
          title: `Explore ${req.body.locationName || 'Location'} on Google Maps`,
          uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(req.body.locationName || 'Port Moresby PNG')}`,
        }
      ],
      locationName: req.body.locationName || 'Papua New Guinea',
    });
  }
});

// AI Container Home Visualization Endpoint
app.post('/api/generate-container-image', async (req, res) => {
  try {
    const {
      configuration,
      style,
      cladding,
      roofing,
      environment,
      timeOfDay,
      aspectRatio = '16:9',
      customNotes = '',
    } = req.body;

    if (!configuration) {
      return res.status(400).json({ error: 'Configuration details are required' });
    }

    const ai = getGeminiClient();

    // Construct a rich, photorealistic architectural prompt tailored for PNG tropical container architectures
    const prompt = `Photorealistic architectural 3D exterior visualization render of a modern shipping container home configuration in Papua New Guinea (PNG).
Specifications:
- Layout & Container Structure: ${configuration}
- Architectural Style: ${style || 'Tropical Modern PNG with timber louvers and clean lines'}
- Exterior Cladding & Materials: ${cladding || 'Exposed container corrugations combined with warm Kwila hardwood battens and black steel trim'}
- Roofing & Tropical Shading: ${roofing || 'Tropical double-roof fly-roof system with wide eaves, solar panels, and integrated rainwater collection'}
- Natural Environment & Setting: ${environment || 'Tropical PNG coastal and lush green mountain landscape with palm trees and native landscaping'}
- Lighting & Atmosphere: ${timeOfDay || 'Bright natural tropical sunlight with crisp architectural shadows'}
${customNotes ? `- Custom Architectural Details: ${customNotes}` : ''}

Style requirements:
- High-end architectural photography style, 8k resolution, ultra-detailed architectural concept visualization, realistic materials, concrete foundations/steel stilts, modern glass sliding doors, outdoor timber deck with stylish patio furniture, tropical lush vegetation.
- Clean composition, award-winning architectural design presentation.`;

    let imageUrl: string | null = null;
    let isLiveAiRender = false;
    let architecturalAnalysis: any = null;

    // 1. Try Gemini 3.7 Flash for comprehensive architectural intelligence with timeout
    try {
      const analysisPrompt = `You are a licensed Senior Tropical Architectural Engineer at Techtural BuiltIn Papua New Guinea.
Analyze this custom shipping container home project:
- Configuration: ${configuration}
- Style: ${style || 'Tropical Modern'}
- Cladding: ${cladding || 'Kwila & Steel'}
- Roof: ${roofing || 'Tropical Fly-Roof'}
- Setting: ${environment || 'PNG Tropical'}
- Notes: ${customNotes || 'None'}

Provide a structured JSON output with:
{
  "estimatedKinaBudget": "e.g. K95,000 - K140,000",
  "buildTimeWeeks": "e.g. 6 - 8 weeks",
  "passiveCoolingEfficiency": "e.g. 94%",
  "solarPotentialKw": "e.g. 6.5 kW (18 panels)",
  "cyclonicWindRating": "e.g. C2 (Up to 240 km/h with steel footings)",
  "keyArchitecturalHighlights": ["3 key bullet points on PNG tropical design advantages"],
  "materialListSummary": ["Container bodies", "Kwila hardwood decking", "Colorbond fly-roof", "Thermal acoustic insulation"],
  "engineerAdvice": "A 2-sentence expert construction tip for building this in PNG."
}
Return ONLY valid JSON.`;

      const analysisPromise = ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: analysisPrompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const analysisResponse: any = await withTimeout(analysisPromise, 3500, null);

      const analysisText = analysisResponse?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (analysisText) {
        architecturalAnalysis = JSON.parse(analysisText);
      }
    } catch (_analysisErr) {
      // Gracefully silent fallback to default architectural specs
    }

    // 2. Attempt live image generation with gemini-3.1-flash-lite-image
    try {
      const imagePromise = ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio || '16:9',
          },
        },
      });

      const imageResponse: any = await withTimeout(imagePromise, 3000, null);

      if (imageResponse?.candidates?.[0]?.content?.parts) {
        for (const part of imageResponse.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
            isLiveAiRender = true;
            break;
          }
        }
      }
    } catch (_imgErr: any) {
      // Free-tier rate limit or quota exceeded; gracefully proceed to contextual high-res architectural renders
    }

    // 3. Dynamic High-Definition Architectural Fallback Mapping (when live image quota is restricted on free tier)
    if (!imageUrl) {
      const configStr = (configuration || '').toLowerCase();
      const styleStr = (style || '').toLowerCase();
      const envStr = (environment || '').toLowerCase();
      const timeStr = (timeOfDay || '').toLowerCase();

      // High-resolution architectural photography of modular container residences & tropical pavilions
      if (configStr.includes('20ft') || configStr.includes('single 20ft') || configStr.includes('studio')) {
        imageUrl = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=85';
      } else if (configStr.includes('stacked') || configStr.includes('2-storey') || configStr.includes('duplex')) {
        if (timeStr.includes('sunset') || timeStr.includes('golden') || timeStr.includes('twilight')) {
          imageUrl = 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85';
        } else {
          imageUrl = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85';
        }
      } else if (configStr.includes('twin-l') || configStr.includes('l-shape') || configStr.includes('courtyard')) {
        imageUrl = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85';
      } else if (configStr.includes('highset') || configStr.includes('stilt') || configStr.includes('elevated') || configStr.includes('flood')) {
        imageUrl = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85';
      } else if (configStr.includes('quad') || configStr.includes('cluster') || configStr.includes('4-bed') || configStr.includes('estate')) {
        imageUrl = 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85';
      } else if (envStr.includes('coastal') || envStr.includes('beach') || envStr.includes('ocean')) {
        imageUrl = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85';
      } else if (envStr.includes('rainforest') || envStr.includes('jungle') || styleStr.includes('eco')) {
        imageUrl = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85';
      } else {
        imageUrl = 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=85';
      }
    }

    return res.json({
      success: true,
      imageUrl,
      isLiveAiRender,
      prompt,
      analysis: architecturalAnalysis || {
        estimatedKinaBudget: 'K85,000 - K135,000',
        buildTimeWeeks: '6 - 8 weeks',
        passiveCoolingEfficiency: '92%',
        solarPotentialKw: '5.5 kW',
        cyclonicWindRating: 'C2 (Certified)',
        keyArchitecturalHighlights: [
          'Fly-roof double envelope creates continuous convective airflow over container ceiling.',
          'Kwila timber battens buffer solar heat gain while preserving industrial aesthetic.',
          'Modular structural interlocks provide high earthquake and cyclone resistance.'
        ],
        materialListSummary: ['Corten steel shipping containers', 'Kwila hardwood timber', 'Colorbond roofing', 'Rockwool R3.5 insulation'],
        engineerAdvice: 'Ensure concrete pad footings or galvanized steel columns are anchored to solid subgrade before container delivery.'
      },
      specs: {
        configuration,
        style,
        cladding,
        roofing,
        environment,
        timeOfDay,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating container visual:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate container home visual.',
    });
  }
});

function injectModelSocialMeta(html: string, modelId?: string, host?: string): string {
  if (!modelId) return html;
  const model = getShareMetadata(modelId);
  if (!model) return html;

  const title = `Techtural Kit Home — ${model.name} (${model.code})`;
  const description = `${model.name} (${model.code}) | ${model.bedrooms} Bed, ${model.bathrooms} Bath, ${model.buildingAreaSqm} m². Engineered for Papua New Guinea.`;
  const image = host ? `${host}/share-thumbnails/model-${model.officialNumber}.jpg` : model.image;

  return html
    .replace(/<title>.*?<\/title>/i, `<title>${title}</title>`)
    .replace(/(<meta\s+name=["']description["']\s+content=["']).*?(["']\s*\/?>)/i, `$1${description}$2`)
    .replace(/(<meta\s+property=["']og:title["']\s+content=["']).*?(["']\s*\/?>)/i, `$1${title}$2`)
    .replace(/(<meta\s+property=["']og:description["']\s+content=["']).*?(["']\s*\/?>)/i, `$1${description}$2`)
    .replace(/(<meta\s+property=["']og:image["']\s+content=["']).*?(["']\s*\/?>)/i, `$1${image}$2`)
    .replace(/(<meta\s+property=["']og:image:secure_url["']\s+content=["']).*?(["']\s*\/?>)/i, `$1${image}$2`)
    .replace(/(<meta\s+property=["']og:image:type["']\s+content=["']).*?(["']\s*\/?>)/i, `$1image/jpeg$2`)
    .replace(/(<meta\s+name=["']twitter:title["']\s+content=["']).*?(["']\s*\/?>)/i, `$1${title}$2`)
    .replace(/(<meta\s+name=["']twitter:description["']\s+content=["']).*?(["']\s*\/?>)/i, `$1${description}$2`)
    .replace(/(<meta\s+name=["']twitter:image["']\s+content=["']).*?(["']\s*\/?>)/i, `$1${image}$2`);
}

async function startServer() {
  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const isHmrDisabled = process.env.DISABLE_HMR !== 'false';
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: isHmrDisabled ? false : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const indexHtmlPath = path.join(distPath, 'index.html');
    app.use(express.static(distPath, { index: false }));
    app.get('*', (req, res) => {
      try {
        const rawHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
        const pathMatch = req.path.match(/\/share\/([^\/\?#]+)/i);
        const modelParam = (pathMatch ? pathMatch[1] : (req.query.model || req.query.preview)) as string | undefined;
        const host = `${req.protocol}://${req.get('host')}`;
        const finalHtml = injectModelSocialMeta(rawHtml, modelParam, host);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(finalHtml);
      } catch (_err) {
        res.sendFile(indexHtmlPath);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
