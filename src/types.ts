import { Polygon, MultiPolygon } from 'geojson';

export interface CensusTract {
  id: string;             // GEOID (e.g. "26163510900")
  name: string;           // Tract label (e.g. "Census Tract 5109")
  population: number;
  povertyRate: number;    // % (0 - 100)
  noVehicleRate: number;  // % (0 - 100)
  elderlyRate: number;    // % (0 - 100)
  centroid: [number, number]; // [longitude, latitude]
  geometry: Polygon | MultiPolygon; // Leaflet GeoJSON geometry
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface ClinicCheckpoint {
  id: string;
  label: string;
  coordinates: [number, number]; // [longitude, latitude]
  isSimulated: boolean;
  createdAt: string;
}

export interface SDoHFilters {
  povertyWeight: number;    // Weight in AGS formula (0 - 1)
  noVehicleWeight: number;  // Weight in AGS formula (0 - 1)
  elderlyWeight: number;    // Weight in AGS formula (0 - 1)
  minPoverty: number;       // Filters (0 - 100)
  minNoVehicle: number;     // Filters (0 - 100)
  minElderly: number;       // Filters (0 - 100)
}

export interface ComputedTract extends CensusTract {
  baseAgs: number;          // AGS without distance penalty
  distanceToNearestPharmacy: number; // in miles
  hasDistancePenalty: boolean;
  ags: number;              // Final AGS including penalty
  isDesert: boolean;        // True if far from pharmacies and not covered by simulated mobile clinics
  distanceToNearestMobileClinic?: number; // in miles
  isMitigated: boolean;     // True if covered by a simulated/active mobile clinic
}

export type Persona = 'Field Operator' | 'Regional Director';
