// AI-powered expense categorization utility
export interface CategorySuggestion {
  category: string;
  confidence: number;
  reason: string;
}

const categoryKeywords: Record<string, string[]> = {
  'Food': ['burger', 'pizza', 'restaurant', 'cafe', 'coffee', 'lunch', 'dinner', 'breakfast', 'grocery', 'supermarket', 'market', 'food', 'eat', 'meal', 'bakery', 'fastfood', 'grill'],
  'Transport': ['taxi', 'uber', 'bus', 'train', 'gas', 'parking', 'fuel', 'carpool', 'metro', 'jeepney', 'tricycle', 'drive', 'transport', 'travel', 'ticket'],
  'Entertainment': ['movie', 'cinema', 'game', 'gaming', 'concert', 'show', 'netflix', 'spotify', 'entertainment', 'ticket', 'event', 'play', 'fun', 'party'],
  'Supplies': ['pen', 'paper', 'notebook', 'book', 'supplies', 'office', 'stationery', 'printing', 'material', 'equipment', 'tool'],
  'Healthcare': ['doctor', 'hospital', 'pharmacy', 'medicine', 'drug', 'health', 'clinic', 'dental', 'medical', 'health', 'treatment'],
  'Clothing': ['shirt', 'pants', 'dress', 'shoes', 'clothing', 'apparel', 'fashion', 'mall', 'boutique', 'wear', 'garment'],
};

export function suggestCategory(description: string): CategorySuggestion {
  const lowerDesc = description.toLowerCase();
  const scores: Record<string, number> = {};

  // Calculate confidence scores for each category
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    let matchCount = 0;
    for (const keyword of keywords) {
      if (lowerDesc.includes(keyword)) {
        matchCount++;
      }
    }
    scores[category] = matchCount;
  }

  // Find the best match
  const bestMatch = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];

  if (bestMatch && bestMatch[1] > 0) {
    return {
      category: bestMatch[0],
      confidence: Math.min((bestMatch[1] / 3) * 100, 100), // Max 100%
      reason: `Matched keywords in "${bestMatch[0]}" category`
    };
  }

  return {
    category: 'Other',
    confidence: 0,
    reason: 'No matching keywords found'
  };
}

export function analyzeSpendingPatterns(transactions: any[]) {
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const total = Object.values(expensesByCategory).reduce((sum, val) => sum + val, 0);
  
  return Object.entries(expensesByCategory).map(([category, amount]) => ({
    category,
    amount,
    percentage: total > 0 ? (amount / total) * 100 : 0,
    isHighSpending: (amount / total) * 100 > 30
  }));
}
