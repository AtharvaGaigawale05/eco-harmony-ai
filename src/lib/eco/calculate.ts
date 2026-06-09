import type { CalculatorInput, CalculationResult, Breakdown } from "./types";

// Emission factors (kg CO2e) — rough public estimates, used for educational tracking.
const EF = {
  carPerKm: 0.192,
  transitPerKm: 0.05,
  flightPerTrip: 500,
  electricityPerKwh: 0.45, // grid average
  dietPerYear: {
    vegan: 1500,
    vegetarian: 1700,
    omnivore: 2500,
    heavy_meat: 3300,
  } as const,
  waterPerLiter: 0.0003,
  wastePerKg: 0.7,
};

export function calculate(input: CalculatorInput): CalculationResult {
  const transport =
    input.carKmPerWeek * 52 * EF.carPerKm +
    input.publicTransitKmPerWeek * 52 * EF.transitPerKm +
    input.flightsPerYear * EF.flightPerTrip;

  const electricity =
    input.electricityKwhPerMonth * 12 * EF.electricityPerKwh *
    (1 - Math.min(100, Math.max(0, input.renewableShare)) / 100);

  const food = EF.dietPerYear[input.dietType];

  const water = input.waterLitersPerDay * 365 * EF.waterPerLiter;

  const waste =
    input.wasteKgPerWeek * 52 * EF.wastePerKg *
    (1 - Math.min(100, Math.max(0, input.recyclingShare)) / 100 * 0.6);

  const breakdown: Breakdown = {
    transport: round(transport),
    electricity: round(electricity),
    food: round(food),
    water: round(water),
    waste: round(waste),
  };

  const totalKgPerYear = round(
    breakdown.transport + breakdown.electricity + breakdown.food + breakdown.water + breakdown.waste,
  );

  // Global average ~ 4800 kg/yr per person; target 2000 kg/yr.
  const ecoScore = Math.max(0, Math.min(100, Math.round(100 - ((totalKgPerYear - 1500) / 6000) * 100)));

  const level =
    ecoScore >= 80 ? "Planet Protector" :
    ecoScore >= 60 ? "Eco Hero" :
    ecoScore >= 40 ? "Eco Aware" : "Beginner";

  const rating =
    ecoScore >= 80 ? "Outstanding — well below global average" :
    ecoScore >= 60 ? "Great — better than most" :
    ecoScore >= 40 ? "Average — clear room to improve" : "High impact — let's reduce it together";

  return {
    totalKgPerYear,
    breakdown,
    ecoScore,
    level,
    rating,
    createdAt: new Date().toISOString(),
  };
}

function round(n: number) {
  return Math.round(n * 10) / 10;
}

export const DEFAULT_INPUT: CalculatorInput = {
  carKmPerWeek: 100,
  flightsPerYear: 2,
  publicTransitKmPerWeek: 20,
  electricityKwhPerMonth: 250,
  renewableShare: 10,
  dietType: "omnivore",
  waterLitersPerDay: 150,
  wasteKgPerWeek: 8,
  recyclingShare: 30,
};