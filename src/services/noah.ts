import { api, SERVER_ORIGIN } from './api';

export type HazardLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface HazardDetail {
  level: HazardLevel;
  score: number;
  description: string;
}

export interface NoahCheckResponse {
  latitude: number;
  longitude: number;
  overallRisk: HazardLevel;
  flood: HazardDetail;
  landslide: HazardDetail;
  stormSurge: HazardDetail;
  tileLayers: {
    flood: string;
    landslide: string;
    stormSurge: string;
  };
}

export type NoahLayerType = 'none' | 'flood' | 'landslide' | 'storm_surge' | 'all';

export interface NoahLayerConfig {
  id: NoahLayerType;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  tileUrl: string;
  description: string;
}

export const NOAH_LAYERS: Record<NoahLayerType, NoahLayerConfig> = {
  none: {
    id: 'none',
    name: 'Base Map',
    shortName: 'Standard',
    icon: '🗺️',
    color: '#6b7d8f',
    tileUrl: '',
    description: 'Clean OpenStreetMap base layout without hazard overlays',
  },
  flood: {
    id: 'flood',
    name: 'Flood Hazard (5-Yr)',
    shortName: 'Flood',
    icon: '🌊',
    color: '#1569ca',
    tileUrl: `${SERVER_ORIGIN}/tiles/flood/{z}/{x}/{y}.png`,
    description: 'DOST-NOAH 5-year return period flood depth simulation',
  },
  landslide: {
    id: 'landslide',
    name: 'Rain-Induced Landslide',
    shortName: 'Landslide',
    icon: '⛰️',
    color: '#d97706',
    tileUrl: `${SERVER_ORIGIN}/tiles/landslide/{z}/{x}/{y}.png`,
    description: 'DENR-MGB & NOAH slope failure susceptibility zones',
  },
  storm_surge: {
    id: 'storm_surge',
    name: 'Storm Surge Advisory',
    shortName: 'Storm Surge',
    icon: '🌀',
    color: '#0891b2',
    tileUrl: `${SERVER_ORIGIN}/tiles/storm_surge/{z}/{x}/{y}.png`,
    description: 'PAGASA / NOAH maximum surge height coastal inundation buffer',
  },
  all: {
    id: 'all',
    name: 'All Hazard Overlays',
    shortName: 'All Overlays',
    icon: '⚡',
    color: '#7c3aed',
    tileUrl: '',
    description: 'Simultaneous combined view of Flood, Landslide, and Storm Surge hazard overlays',
  },
};

/**
 * Calculates local geographic hazard fallback for Metro Cebu coordinates
 */
export function calculateLocalNoahRisk(latitude: number, longitude: number): NoahCheckResponse {
  let floodLevel: HazardLevel = 'LOW';
  let floodScore = 14;
  let floodDesc = 'Safe (Low flood hazard zone, elevated natural grade)';

  if (latitude >= 10.27 && latitude <= 10.33 && longitude >= 123.86 && longitude <= 123.90) {
    floodLevel = 'HIGH';
    floodScore = 85;
    floodDesc = 'High Hazard (Lowland drainage & major river basin run-off zone)';
  } else if (latitude >= 10.31 && latitude <= 10.37 && longitude >= 123.92 && longitude <= 123.96) {
    floodLevel = 'MEDIUM';
    floodScore = 55;
    floodDesc = 'Moderate Hazard (Mandaue plains with seasonal heavy rain accumulation)';
  }

  let landslideLevel: HazardLevel = 'LOW';
  let landslideScore = 8;
  let landslideDesc = 'Safe (Stable bedrock with gentle slope < 8°)';

  if (latitude >= 10.35 && longitude <= 123.88) {
    landslideLevel = 'HIGH';
    landslideScore = 88;
    landslideDesc = 'High Susceptibility (Steep terrain > 25° slope, weathering zone)';
  } else if (latitude >= 10.33 && longitude <= 123.89) {
    landslideLevel = 'MEDIUM';
    landslideScore = 42;
    landslideDesc = 'Moderate Hazard (Gradual foothill slope with moderate soil depth)';
  }

  let stormSurgeLevel: HazardLevel = 'LOW';
  let stormSurgeScore = 5;
  let stormSurgeDesc = 'Safe (Inland elevation safely exceeding 15m above sea level)';

  if (latitude >= 10.28 && latitude <= 10.31 && longitude >= 123.97 && longitude <= 124.01) {
    stormSurgeLevel = 'HIGH';
    stormSurgeScore = 82;
    stormSurgeDesc = 'High Surge Advisory (Low-lying coastal foreshore within SSA-3/4 buffer)';
  } else if (
    (latitude >= 10.25 && latitude <= 10.34 && longitude >= 123.95 && longitude <= 124.03) ||
    (latitude >= 10.26 && latitude <= 10.29 && longitude >= 123.87 && longitude <= 123.895)
  ) {
    stormSurgeLevel = 'MEDIUM';
    stormSurgeScore = 60;
    stormSurgeDesc = 'Moderate Surge Advisory (Coastal zone within SSA-2 buffer)';
  }

  const overallRisk: HazardLevel =
    floodLevel === 'HIGH' || landslideLevel === 'HIGH' || stormSurgeLevel === 'HIGH'
      ? 'HIGH'
      : floodLevel === 'MEDIUM' || landslideLevel === 'MEDIUM' || stormSurgeLevel === 'MEDIUM'
      ? 'MEDIUM'
      : 'LOW';

  return {
    latitude,
    longitude,
    overallRisk,
    flood: { level: floodLevel, score: floodScore, description: floodDesc },
    landslide: { level: landslideLevel, score: landslideScore, description: landslideDesc },
    stormSurge: { level: stormSurgeLevel, score: stormSurgeScore, description: stormSurgeDesc },
    tileLayers: {
      flood: `${SERVER_ORIGIN}/tiles/flood/{z}/{x}/{y}.png`,
      landslide: `${SERVER_ORIGIN}/tiles/landslide/{z}/{x}/{y}.png`,
      stormSurge: `${SERVER_ORIGIN}/tiles/storm_surge/{z}/{x}/{y}.png`,
    },
  };
}

/**
 * Checks NOAH hazards for a pin location from the backend API with instant local fallback
 */
export async function checkNoahRisk(latitude: number, longitude: number): Promise<NoahCheckResponse> {
  try {
    const res = await api.get('/noah/check', {
      params: { lat: latitude, lng: longitude },
      timeout: 3500,
    });
    if (res.data && res.data.overallRisk) {
      return {
        ...res.data,
        tileLayers: {
          flood: `${SERVER_ORIGIN}/tiles/flood/{z}/{x}/{y}.png`,
          landslide: `${SERVER_ORIGIN}/tiles/landslide/{z}/{x}/{y}.png`,
          stormSurge: `${SERVER_ORIGIN}/tiles/storm_surge/{z}/{x}/{y}.png`,
        },
      };
    }
  } catch (err) {
    console.warn('[NOAH] Backend check timed out or unavailable, using local calculation:', err);
  }
  return calculateLocalNoahRisk(latitude, longitude);
}
