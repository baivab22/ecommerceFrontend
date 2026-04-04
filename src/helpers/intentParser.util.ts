// intentParser.util.ts
// Utility to parse search queries into structured filters (brand, color, price, category, etc.)
// This is a simple rule-based parser. For production, consider NLP libraries or backend support.

export interface ParsedFilters {
  category?: string;
  brand?: string;
  color?: string;
  priceMax?: number;
  priceMin?: number;
  keywords?: string[];
}

// Example lists for demo. In production, fetch from backend or config.
const BRANDS = ['nike', 'adidas', 'puma', 'reebok', 'new balance'];
const COLORS = ['red', 'blue', 'green', 'black', 'white', 'yellow', 'orange', 'pink', 'purple', 'grey', 'brown'];
const CATEGORIES = ['shoes', 'sneakers', 'sandals', 'boots', 'heels', 'flats', 'slippers'];

export function parseIntent(query: string): ParsedFilters {
  const result: ParsedFilters = {};
  const q = query.toLowerCase();

  // Brand
  for (const brand of BRANDS) {
    if (q.includes(brand)) {
      result.brand = brand;
      break;
    }
  }

  // Color
  for (const color of COLORS) {
    if (q.includes(color)) {
      result.color = color;
      break;
    }
  }

  // Category
  for (const cat of CATEGORIES) {
    if (q.includes(cat)) {
      result.category = cat;
      break;
    }
  }

  // Price (e.g., under 100, below 200, less than 50, over 100, above 200)
  const priceMaxMatch = q.match(/(?:under|below|less than)\s*(\d+)/);
  if (priceMaxMatch) {
    result.priceMax = parseInt(priceMaxMatch[1], 10);
  }
  const priceMinMatch = q.match(/(?:over|above|greater than)\s*(\d+)/);
  if (priceMinMatch) {
    result.priceMin = parseInt(priceMinMatch[1], 10);
  }

  // Extract remaining keywords (words not matched above)
  const words = q.split(/\s+/);
  result.keywords = words.filter(
    w => !BRANDS.includes(w) && !COLORS.includes(w) && !CATEGORIES.includes(w) && !/^(under|below|less|than|over|above|greater|than|\d+)$/.test(w)
  );

  return result;
}
