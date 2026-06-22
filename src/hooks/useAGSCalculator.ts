import { useMemo } from 'react';
import { CensusTract, Pharmacy, ClinicCheckpoint, SDoHFilters, ComputedTract } from '../types';
import { distance, point } from '@turf/turf';

const PHARMACY_DISTANCE_THRESHOLD = 1.5; // distance in miles for penalty
const CLINIC_COVERAGE_RADIUS = 1.2; // coverage radius in miles

export const useAGSCalculator = (
  tracts: CensusTract[],
  pharmacies: Pharmacy[],
  mobileClinics: ClinicCheckpoint[],
  filters: SDoHFilters
): ComputedTract[] => {
  return useMemo(() => {
    // Normalize weights to sum to 1.0
    const { povertyWeight, noVehicleWeight, elderlyWeight } = filters;
    const totalWeight = povertyWeight + noVehicleWeight + elderlyWeight;
    const wp = totalWeight > 0 ? povertyWeight / totalWeight : 0.4;
    const wv = totalWeight > 0 ? noVehicleWeight / totalWeight : 0.4;
    const we = totalWeight > 0 ? elderlyWeight / totalWeight : 0.2;

    return tracts.map((tract) => {
      // 1. Calculate distance in miles to the nearest pharmacy
      let minPharmDist = Infinity;
      if (pharmacies.length > 0) {
        const tractPt = point(tract.centroid);
        pharmacies.forEach((pharm) => {
          const pharmPt = point(pharm.coordinates);
          const dist = distance(tractPt, pharmPt, { units: 'miles' });
          if (dist < minPharmDist) {
            minPharmDist = dist;
          }
        });
      } else {
        minPharmDist = 99.9; // fallback if no pharmacies loaded
      }

      // 2. Calculate distance in miles to nearest simulated mobile clinic
      let minClinicDist = Infinity;
      if (mobileClinics.length > 0) {
        const tractPt = point(tract.centroid);
        mobileClinics.forEach((clinic) => {
          const clinicPt = point(clinic.coordinates);
          const dist = distance(tractPt, clinicPt, { units: 'miles' });
          if (dist < minClinicDist) {
            minClinicDist = dist;
          }
        });
      }

      const hasDistancePenalty = minPharmDist > PHARMACY_DISTANCE_THRESHOLD;
      const isMitigated = minClinicDist <= CLINIC_COVERAGE_RADIUS;

      // 3. Base AGS calculation (weighted SDoH values)
      const baseAgs = (tract.povertyRate * wp) + (tract.noVehicleRate * wv) + (tract.elderlyRate * we);

      // 4. Apply 1.5x penalty factor if far from pharmacies AND not mitigated
      const penaltyFactor = (hasDistancePenalty && !isMitigated) ? 1.5 : 1.0;
      const ags = Math.min(100, Math.round(baseAgs * penaltyFactor * 10) / 10);

      const isDesert = hasDistancePenalty && !isMitigated;

      return {
        ...tract,
        baseAgs: Math.round(baseAgs * 10) / 10,
        distanceToNearestPharmacy: minPharmDist === Infinity ? 99.9 : Math.round(minPharmDist * 10) / 10,
        hasDistancePenalty,
        ags,
        isDesert,
        distanceToNearestMobileClinic: minClinicDist === Infinity ? undefined : Math.round(minClinicDist * 10) / 10,
        isMitigated
      };
    });
  }, [tracts, pharmacies, mobileClinics, filters]);
};
