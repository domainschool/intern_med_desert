import { CensusTract, Pharmacy } from '../types';

export const MOCK_TRACTS: CensusTract[] = [
  {
    id: "tract-101",
    name: "Tract 101.01 (Downtown Core)",
    population: 4200,
    povertyRate: 35.4,
    noVehicleRate: 48.2,
    elderlyRate: 14.1,
    x: 20,
    y: 20
  },
  {
    id: "tract-102",
    name: "Tract 102.03 (North Heights)",
    population: 3100,
    povertyRate: 12.5,
    noVehicleRate: 15.0,
    elderlyRate: 28.6,
    x: 28,
    y: 15
  },
  {
    id: "tract-103",
    name: "Tract 201.00 (East Riverbend)",
    population: 5600,
    povertyRate: 42.1,
    noVehicleRate: 55.4,
    elderlyRate: 19.3,
    x: 75,
    y: 22
  },
  {
    id: "tract-104",
    name: "Tract 202.04 (Woodland Hills)",
    population: 2900,
    povertyRate: 48.7,
    noVehicleRate: 62.1,
    elderlyRate: 24.5,
    x: 82,
    y: 35
  },
  {
    id: "tract-105",
    name: "Tract 301.01 (Industrial Park)",
    population: 1800,
    povertyRate: 22.0,
    noVehicleRate: 38.0,
    elderlyRate: 8.5,
    x: 15,
    y: 72
  },
  {
    id: "tract-106",
    name: "Tract 302.02 (Southside)",
    population: 6200,
    povertyRate: 39.8,
    noVehicleRate: 51.0,
    elderlyRate: 16.7,
    x: 32,
    y: 82
  },
  {
    id: "tract-107",
    name: "Tract 401.00 (Midtown Cross)",
    population: 4800,
    povertyRate: 18.2,
    noVehicleRate: 22.4,
    elderlyRate: 15.2,
    x: 50,
    y: 50
  },
  {
    id: "tract-108",
    name: "Tract 402.05 (University District)",
    population: 7100,
    povertyRate: 29.1,
    noVehicleRate: 41.5,
    elderlyRate: 6.8,
    x: 55,
    y: 65
  },
  {
    id: "tract-109",
    name: "Tract 501.01 (Far East Border)",
    population: 2300,
    povertyRate: 52.3,
    noVehicleRate: 72.8,
    elderlyRate: 32.1,
    x: 88,
    y: 75
  },
  {
    id: "tract-110",
    name: "Tract 502.03 (Oak Ridge Rural)",
    population: 1500,
    povertyRate: 38.9,
    noVehicleRate: 80.5,
    elderlyRate: 26.4,
    x: 92,
    y: 88
  }
];

export const MOCK_PHARMACIES: Pharmacy[] = [
  {
    id: "pharm-1",
    name: "Community Care Rx",
    address: "240 Main St, Center City",
    x: 23,
    y: 22
  },
  {
    id: "pharm-2",
    name: "County Health Pharmacy",
    address: "1090 River Rd, Heights District",
    x: 22,
    y: 78
  },
  {
    id: "pharm-3",
    name: "Metro Center Pharmacy",
    address: "505 Grand Ave, Midtown",
    x: 52,
    y: 53
  },
  {
    id: "pharm-4",
    name: "Plaza Drugs",
    address: "412 Plaza Way, North",
    x: 45,
    y: 18
  }
];
