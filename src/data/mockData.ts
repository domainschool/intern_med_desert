import { CensusTract, Pharmacy } from '../types';

export const MOCK_TRACTS: CensusTract[] = [
  {
    id: "26163510900",
    name: "Tract 5109",
    population: 3200,
    povertyRate: 31.4,
    noVehicleRate: 42.1,
    elderlyRate: 16.5,
    centroid: [-83.0458, 42.3314],
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-83.055, 42.325],
          [-83.035, 42.325],
          [-83.035, 42.337],
          [-83.055, 42.337],
          [-83.055, 42.325]
        ]
      ]
    }
  }
];

export const MOCK_PHARMACIES: Pharmacy[] = [
  {
    id: "pharm-1",
    name: "DMC Pharmacy (Detroit)",
    address: "3901 Woodward Ave, Detroit, MI",
    coordinates: [-83.0560, 42.3524]
  }
];
