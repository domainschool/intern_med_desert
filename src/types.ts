export interface CensusTract {
  id: string;
  name: string;
  population: number;
  povertyRate: number;    // % (0 - 100)
  noVehicleRate: number;  // % (0 - 100)
  elderlyRate: number;    // % (0 - 100)
  x: number;              // Coordinate X percentage on visual canvas (0-100)
  y: number;              // Coordinate Y percentage on visual canvas (0-100)
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  x: number;              // Coordinate X percentage on visual canvas (0-100)
  y: number;              // Coordinate Y percentage on visual canvas (0-100)
}

export interface ClinicCheckpoint {
  id: string;
  label: string;
  x: number;              // Coordinate X percentage on visual canvas (0-100)
  y: number;              // Coordinate Y percentage on visual canvas (0-100)
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
  distanceToNearestPharmacy: number; // distance units (SVG percentage distance)
  hasDistancePenalty: boolean;
  ags: number;              // Final AGS including penalty
  isDesert: boolean;        // True if far from pharmacies and not covered by simulated mobile clinics
  distanceToNearestMobileClinic?: number; // Distance to nearest simulated/active mobile clinic
  isMitigated: boolean;     // True if covered by a simulated/active mobile clinic
}

export type Persona = 'Field Operator' | 'Regional Director';
