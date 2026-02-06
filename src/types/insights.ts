export type InsightCategory =
  | 'infrastructure'   // How stablecoins work
  | 'market-data'      // Adoption, volume stats
  | 'emerging-markets' // Use cases in developing countries
  | 'regulation';      // Policy & compliance

export interface InsightItem {
  id: string;
  title: string;
  source: string;           // e.g., "Artemis", "a16z", "Circle"
  url: string;
  summary: string;          // 1-2 sentences
  category: InsightCategory;
  imageUrl?: string;        // Optional thumbnail
}
