export type Challenge = {
  id: string;
  title: string;
  description: string;
  xp: number;
  category: "transport" | "food" | "energy" | "water" | "waste";
  durationDays: number;
};

export const CHALLENGES: Challenge[] = [
  { id: "no-plastic-week", title: "No Plastic Week", description: "Avoid single-use plastics for 7 days.", xp: 150, category: "waste", durationDays: 7 },
  { id: "bike-to-work", title: "Bike-to-Work Challenge", description: "Replace car commutes with cycling 3+ days.", xp: 200, category: "transport", durationDays: 7 },
  { id: "water-saver", title: "Water Saving Week", description: "Keep showers under 5 minutes for a week.", xp: 120, category: "water", durationDays: 7 },
  { id: "minimal-energy", title: "Minimal Electricity Day", description: "Unplug non-essentials for 24 hours.", xp: 80, category: "energy", durationDays: 1 },
  { id: "meatless-week", title: "Meatless Week", description: "Try a fully plant-based menu for 7 days.", xp: 180, category: "food", durationDays: 7 },
  { id: "zero-food-waste", title: "Zero Food Waste", description: "Plan meals and compost scraps for 7 days.", xp: 130, category: "waste", durationDays: 7 },
];

export type Badge = { id: string; name: string; description: string; threshold: number };

export const BADGES: Badge[] = [
  { id: "green-beginner", name: "Green Beginner", description: "Complete your first challenge.", threshold: 1 },
  { id: "eco-explorer", name: "Eco Explorer", description: "Complete 3 challenges.", threshold: 3 },
  { id: "sustainability-hero", name: "Sustainability Hero", description: "Complete 5 challenges.", threshold: 5 },
  { id: "planet-protector", name: "Planet Protector", description: "Complete all 6 challenges.", threshold: 6 },
];