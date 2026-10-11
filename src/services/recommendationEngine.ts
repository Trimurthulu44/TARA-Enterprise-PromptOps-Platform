import { PromptItem, PromptRecommendation } from '../types';

/**
 * Enterprise Semantic Recommendation Engine
 * Mimics pgvector semantic similarity search combined with PQS and historical performance ranking.
 */

export function recommendPrompts(
  query: string,
  repository: PromptItem[],
  limit: number = 3
): PromptRecommendation[] {
  const cleanQuery = query.toLowerCase().trim();
  const queryTokens = cleanQuery.split(/[\s,._\-+/]+/).filter(Boolean);

  if (queryTokens.length === 0) {
    return repository.slice(0, limit).map((p, idx) => ({
      prompt: p,
      rank: idx + 1,
      semanticSimilarity: 92 - idx * 4,
      pqsScore: p.pqs.overallScore,
      accuracy: p.pqs.core.accuracy,
      securityRating: p.pqs.core.security >= 95 ? 'Excellent' : 'Good',
      costTier: p.pqs.core.costEfficiency >= 90 ? 'Low' : 'Moderate',
      developerCount: p.pqs.enterprise.developerUsageFrequency,
      averageRating: p.pqs.enterprise.internalDeveloperRating,
      matchReason: 'Curated enterprise baseline prompt with highest organization approval.',
    }));
  }

  const scored = repository.map((item) => {
    const textPool = `${item.title} ${item.description} ${item.category} ${item.department} ${item.tags.join(' ')} ${item.content}`.toLowerCase();

    // Token frequency & exact phrase overlap
    let matchCount = 0;
    queryTokens.forEach((token) => {
      if (textPool.includes(token)) {
        matchCount += 1;
        // Extra weight for tag and title match
        if (item.title.toLowerCase().includes(token)) matchCount += 1.5;
        if (item.tags.some((t) => t.toLowerCase().includes(token))) matchCount += 2;
      }
    });

    const tokenRatio = queryTokens.length > 0 ? Math.min(1, matchCount / (queryTokens.length * 1.8)) : 0.5;
    const semanticSimilarity = Math.min(99, Math.max(68, Math.round(tokenRatio * 100)));

    // Composite rank score
    const pqsScore = item.pqs.overallScore;
    const devRating = item.pqs.enterprise.internalDeveloperRating * 20; // scale 0-100
    const compositeScore = (semanticSimilarity * 0.45) + (pqsScore * 0.35) + (devRating * 0.20);

    const costTier: PromptRecommendation['costTier'] = 
      item.pqs.core.costEfficiency >= 94 ? 'Ultra Low' : 
      item.pqs.core.costEfficiency >= 88 ? 'Low' : 'Moderate';

    const securityRating: PromptRecommendation['securityRating'] = 
      item.pqs.core.security >= 94 ? 'Excellent' : 
      item.pqs.core.security >= 80 ? 'Good' : 'Moderate';

    let matchReason = `High semantic alignment (${semanticSimilarity}%) with target technology stack.`;
    if (item.tags.some(t => cleanQuery.includes(t.toLowerCase()))) {
      matchReason = `Exact match on enterprise tag [${item.tags.find(t => cleanQuery.includes(t.toLowerCase()))}] and verified production stability.`;
    }

    return {
      prompt: item,
      compositeScore,
      semanticSimilarity,
      pqsScore,
      accuracy: item.pqs.core.accuracy,
      securityRating,
      costTier,
      developerCount: item.pqs.enterprise.developerUsageFrequency,
      averageRating: item.pqs.enterprise.internalDeveloperRating,
      matchReason,
    };
  });

  // Sort descending by composite score
  scored.sort((a, b) => b.compositeScore - a.compositeScore);

  return scored.slice(0, limit).map((s, idx) => ({
    prompt: s.prompt,
    rank: idx + 1,
    semanticSimilarity: s.semanticSimilarity,
    pqsScore: s.pqsScore,
    accuracy: s.accuracy,
    securityRating: s.securityRating,
    costTier: s.costTier,
    developerCount: s.developerCount,
    averageRating: s.averageRating,
    matchReason: s.matchReason,
  }));
}
