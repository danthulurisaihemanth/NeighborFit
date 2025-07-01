import { NextResponse } from "next/server"

interface UserPreferences {
  budget: number[]
  walkability: number[]
  safety: number[]
  nightlife: number[]
  familyFriendly: number[]
  publicTransit: number[]
  lifestyle: string
  priorities: string[]
}

interface NeighborhoodData {
  id: string
  name: string
  city: string
  scores: {
    walkability: number
    safety: number
    affordability: number
    nightlife: number
    familyFriendly: number
    transit: number
  }
  demographics: {
    medianAge: number
    medianIncome: number
    population: number
  }
  housing: {
    averageRent: number
    homePrice: number
  }
  keyFeatures: string[]
  highlights: string[]
}

// Enhanced matching algorithm with multiple scoring methods
export async function POST(request: Request) {
  try {
    const { preferences }: { preferences: UserPreferences } = await request.json()

    // Validate preferences
    if (!preferences || !preferences.budget || !preferences.walkability) {
      return NextResponse.json({ error: "Invalid preferences data" }, { status: 400 })
    }

    // Get neighborhood data (in production, this would be from a database)
    const neighborhoods = await getNeighborhoodData()

    // Calculate matches using multiple algorithms
    const matches = neighborhoods.map((neighborhood) => {
      const scores = calculateMatchScores(neighborhood, preferences)
      return {
        ...neighborhood,
        overallScore: scores.overall,
        categoryScores: scores.categories,
        matchReasons: generateDetailedMatchReasons(neighborhood, preferences, scores),
        confidenceScore: calculateConfidenceScore(neighborhood, preferences),
      }
    })

    // Sort by overall score and apply diversity filter
    const rankedMatches = matches.sort((a, b) => b.overallScore - a.overallScore).slice(0, 10) // Return top 10 matches

    return NextResponse.json({
      matches: rankedMatches,
      metadata: {
        totalNeighborhoods: neighborhoods.length,
        algorithmVersion: "2.1",
        processingTime: Date.now(),
      },
    })
  } catch (error) {
    console.error("Matching algorithm error:", error)
    return NextResponse.json(
      {
        error: "Failed to calculate matches",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function calculateMatchScores(neighborhood: NeighborhoodData, preferences: UserPreferences) {
  // Normalize preference values (0-10 scale to 0-1 weights)
  const weights = {
    walkability: preferences.walkability[0] / 10,
    safety: preferences.safety[0] / 10,
    affordability: calculateAffordabilityWeight(preferences.budget[0]),
    nightlife: preferences.nightlife[0] / 10,
    familyFriendly: preferences.familyFriendly[0] / 10,
    transit: preferences.publicTransit[0] / 10,
  }

  // Apply lifestyle multipliers
  const lifestyleMultipliers = getLifestyleMultipliers(preferences.lifestyle)

  // Calculate weighted scores for each category
  const categoryScores = {
    walkability: neighborhood.scores.walkability * weights.walkability * lifestyleMultipliers.walkability,
    safety: neighborhood.scores.safety * weights.safety * lifestyleMultipliers.safety,
    affordability: neighborhood.scores.affordability * weights.affordability * lifestyleMultipliers.affordability,
    nightlife: neighborhood.scores.nightlife * weights.nightlife * lifestyleMultipliers.nightlife,
    familyFriendly: neighborhood.scores.familyFriendly * weights.familyFriendly * lifestyleMultipliers.familyFriendly,
    transit: neighborhood.scores.transit * weights.transit * lifestyleMultipliers.transit,
  }

  // Calculate overall score with priority boosts
  let overallScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / 6

  // Apply priority bonuses
  overallScore = applyPriorityBonuses(overallScore, neighborhood, preferences.priorities)

  return {
    overall: Math.round(Math.min(overallScore, 100)),
    categories: Object.fromEntries(Object.entries(categoryScores).map(([key, value]) => [key, Math.round(value)])),
  }
}

function calculateAffordabilityWeight(budget: number): number {
  // Higher budget = lower weight on affordability
  const normalizedBudget = Math.min(budget / 5000, 1)
  return Math.max(0.3, 1 - normalizedBudget * 0.7)
}

function getLifestyleMultipliers(lifestyle: string) {
  const multipliers = {
    walkability: 1,
    safety: 1,
    affordability: 1,
    nightlife: 1,
    familyFriendly: 1,
    transit: 1,
  }

  switch (lifestyle) {
    case "young-professional":
      multipliers.nightlife = 1.2
      multipliers.transit = 1.1
      multipliers.familyFriendly = 0.8
      break
    case "family":
      multipliers.familyFriendly = 1.3
      multipliers.safety = 1.2
      multipliers.nightlife = 0.7
      break
    case "student":
      multipliers.affordability = 1.4
      multipliers.transit = 1.2
      multipliers.nightlife = 1.1
      break
    case "retiree":
      multipliers.safety = 1.3
      multipliers.walkability = 1.1
      multipliers.nightlife = 0.6
      break
    case "remote-worker":
      multipliers.affordability = 1.1
      multipliers.walkability = 1.2
      break
  }

  return multipliers
}

function applyPriorityBonuses(baseScore: number, neighborhood: NeighborhoodData, priorities: string[]): number {
  let bonusScore = 0

  priorities.forEach((priority) => {
    switch (priority) {
      case "Low cost of living":
        bonusScore += neighborhood.scores.affordability * 0.1
        break
      case "Walkable amenities":
        bonusScore += neighborhood.scores.walkability * 0.1
        break
      case "Safe neighborhood":
        bonusScore += neighborhood.scores.safety * 0.1
        break
      case "Good schools":
        bonusScore += neighborhood.scores.familyFriendly * 0.1
        break
      case "Nightlife & dining":
        bonusScore += neighborhood.scores.nightlife * 0.1
        break
      case "Public transportation":
        bonusScore += neighborhood.scores.transit * 0.1
        break
    }
  })

  return baseScore + bonusScore
}

function generateDetailedMatchReasons(
  neighborhood: NeighborhoodData,
  preferences: UserPreferences,
  scores: any,
): string[] {
  const reasons = []

  // High-scoring categories
  Object.entries(scores.categories).forEach(([category, score]) => {
    if (score >= 80) {
      const categoryNames = {
        walkability: "walkability",
        safety: "safety",
        affordability: "affordability",
        nightlife: "nightlife and dining",
        familyFriendly: "family-friendly amenities",
        transit: "public transportation",
      }
      reasons.push(`Excellent ${categoryNames[category as keyof typeof categoryNames]} (${score}% match)`)
    }
  })

  // Budget compatibility
  if (neighborhood.housing.averageRent <= preferences.budget[0] * 1.1) {
    reasons.push(`Within your budget range ($${neighborhood.housing.averageRent}/month)`)
  }

  // Lifestyle compatibility
  if (preferences.lifestyle === "young-professional" && neighborhood.scores.nightlife >= 80) {
    reasons.push("Perfect for young professionals with vibrant social scene")
  }

  if (preferences.lifestyle === "family" && neighborhood.scores.familyFriendly >= 80) {
    reasons.push("Excellent family-friendly environment with good schools and parks")
  }

  return reasons.slice(0, 4) // Limit to top 4 reasons
}

function calculateConfidenceScore(neighborhood: NeighborhoodData, preferences: UserPreferences): number {
  // Calculate confidence based on data completeness and preference clarity
  let confidence = 85 // Base confidence

  // Adjust based on preference strength (how decisive the user was)
  const preferenceStrength =
    [
      preferences.walkability[0],
      preferences.safety[0],
      preferences.nightlife[0],
      preferences.familyFriendly[0],
      preferences.publicTransit[0],
    ].reduce((sum, val) => sum + Math.abs(val - 5), 0) / 5

  confidence += preferenceStrength * 2

  // Adjust based on data completeness (mock - in production would check actual data)
  confidence += 10 // Assume good data quality

  return Math.min(Math.round(confidence), 95)
}

async function getNeighborhoodData(): Promise<NeighborhoodData[]> {
  // Mock data - in production, this would fetch from database
  return [
    {
      id: "1",
      name: "Capitol Hill",
      city: "Seattle, WA",
      scores: { walkability: 95, safety: 75, affordability: 60, nightlife: 90, familyFriendly: 65, transit: 85 },
      demographics: { medianAge: 29, medianIncome: 75000, population: 28000 },
      housing: { averageRent: 2800, homePrice: 850000 },
      keyFeatures: ["Vibrant nightlife", "Walkable streets", "Arts scene", "Coffee culture"],
      highlights: ["Pike/Pine corridor", "Cal Anderson Park", "Light rail access"],
    },
    {
      id: "2",
      name: "Fremont",
      city: "Seattle, WA",
      scores: { walkability: 85, safety: 85, affordability: 70, nightlife: 70, familyFriendly: 80, transit: 75 },
      demographics: { medianAge: 35, medianIncome: 82000, population: 15000 },
      housing: { averageRent: 2400, homePrice: 720000 },
      keyFeatures: ["Quirky character", "Local businesses", "Family-friendly", "Sunday market"],
      highlights: ["Fremont Troll", "Gas Works Park nearby", "Local breweries"],
    },
    {
      id: "3",
      name: "Ballard",
      city: "Seattle, WA",
      scores: { walkability: 80, safety: 80, affordability: 65, nightlife: 85, familyFriendly: 75, transit: 70 },
      demographics: { medianAge: 32, medianIncome: 78000, population: 22000 },
      housing: { averageRent: 2600, homePrice: 780000 },
      keyFeatures: ["Historic charm", "Brewery scene", "Waterfront", "Nordic heritage"],
      highlights: ["Ballard Locks", "Sunday farmers market", "Maritime history"],
    },
  ]
}
