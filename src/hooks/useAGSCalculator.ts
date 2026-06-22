import { useMemo } from 'react';
import { CensusTract, Pharmacy, ClinicCheckpoint, SDoHFilters, ComputedTract } from '../types';

const DISTANCE_THRESHOLD = 20.0; // Distance units on the 0-100 canvas grid
const CLINIC_COVERAGE_RADIUS = 15.0; // Mobile clinic coverage radius on canvas grid

// Euclidean distance helper
const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

export const useAGSCalculator = (
  tracts: CensusTract[],
  pharmacies: Pharmacy[],
  mobileClinics: ClinicCheckpoint[],
  filters: SDoHFilters
): ComputedTract[] => {
  return useMemo(() => {
    // Normalize weights to sum to 1.0 (to ensure consistent scaling)
    const { povertyWeight, noVehicleWeight, elderlyWeight } = filters;
    const totalWeight = povertyWeight + noVehicleWeight + elderlyWeight;
    const wp = totalWeight > 0 ? povertyWeight / totalWeight : 0.4;
    const wv = totalWeight > 0 ? noVehicleWeight / totalWeight : 0.4;
    const we = totalWeight > 0 ? elderlyWeight / totalWeight : 0.2;

    return tracts.map((tract) => {
      // 1. Calculate distance to the nearest pharmacy
      let minPharmDist = Infinity;
      pharmacies.forEach((pharm) => {
        const dist = calculateDistance(tract.x, tract.y, pharm.x, pharm.y);
        if (dist < minPharmDist) {
          minPharmDist = dist;
        }
      });

      // 2. Calculate distance to nearest simulated mobile clinic (if any exist)
      let minClinicDist = Infinity;
      mobileClinics.forEach((clinic) => {
        const dist = calculateDistance(tract.x, tract.y, clinic.x, clinic.y);
        if (dist < minClinicDist) {
          minClinicDist = dist;
        }
      });

      const hasDistancePenalty = minPharmDist > DISTANCE_THRESHOLD;
      const isMitigated = minClinicDist <= CLINIC_COVERAGE_RADIUS;

      // 3. Base AGS calculation (weighted SDoH)
      const baseAgs = (tract.povertyRate * wp) + (tract.noVehicleRate * wv) + (tract.elderlyRate * we);

      // 4. Apply distance friction penalty if far from pharmacies AND not mitigated by a clinic
      const penaltyFactor = (hasDistancePenalty && !isMitigated) ? 1.5 : 1.0;
      const ags = Math.min(100, Math.round(baseAgs * penaltyFactor * 10) / 10);

      // A tract is in a "medication desert" if it has the distance penalty and is not mitigated
      const isDesert = hasDistancePenalty && !isMitigated;

      return {
        ...tract,
        baseAgs: Math.round(baseAgs * 10) / 10,
        distanceToNearestPharmacy: Math.round(minPharmDist * 10) / 10,
        hasDistancePenalty,
        ags,
        isDesert,
        distanceToNearestMobileClinic: minClinicDist === Infinity ? undefined : Math.round(minClinicDist * 10) / 10,
        isMitigated
      };
    });
  }, [tracts, pharmacies, mobileClinics, filters]);
};
