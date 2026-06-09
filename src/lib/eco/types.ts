export type CalculatorInput = {
  carKmPerWeek: number;
  flightsPerYear: number;
  publicTransitKmPerWeek: number;
  electricityKwhPerMonth: number;
  renewableShare: number; // 0-100
  dietType: "vegan" | "vegetarian" | "omnivore" | "heavy_meat";
  waterLitersPerDay: number;
  wasteKgPerWeek: number;
  recyclingShare: number; // 0-100
};

export type Breakdown = {
  transport: number;
  electricity: number;
  food: number;
  water: number;
  waste: number;
};

export type CalculationResult = {
  totalKgPerYear: number;
  breakdown: Breakdown;
  ecoScore: number; // 0-100, higher is better
  level: "Beginner" | "Eco Aware" | "Eco Hero" | "Planet Protector";
  rating: string;
  createdAt: string;
};

export type HistoryEntry = CalculationResult & { id: string; input: CalculatorInput };