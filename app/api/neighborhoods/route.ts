import { NextResponse } from "next/server"

// Mock neighborhood data - in production, this would come from a database
const neighborhoods = [
  {
    id: "1",
    name: "Capitol Hill",
    city: "Seattle, WA",
    coordinates: { lat: 47.6205, lng: -122.3212 },
    description: "Vibrant arts district with excellent nightlife, walkable streets, and a strong coffee culture.",
    scores: {
      walkability: 95,
      safety: 75,
      affordability: 60,
      nightlife: 90,
      familyFriendly: 65,
      transit: 85,
    },
    demographics: {
      medianAge: 29,
      medianIncome: 75000,
      population: 28000,
      diversity: 0.72,
    },
    housing: {
      averageRent: 2800,
      homePrice: 850000,
      rentGrowth: 0.08,
    },
    amenities: {
      restaurants: 145,
      bars: 32,
      cafes: 28,
      parks: 3,
      gyms: 8,
      groceryStores: 6,
    },
    keyFeatures: ["Vibrant nightlife", "Walkable streets", "Arts scene", "Coffee culture"],
    highlights: ["Pike/Pine corridor", "Cal Anderson Park", "Light rail access"],
    transportation: {
      walkScore: 95,
      transitScore: 85,
      bikeScore: 78,
    },
  },
  {
    id: "2",
    name: "Fremont",
    city: "Seattle, WA",
    coordinates: { lat: 47.6517, lng: -122.3493 },
    description: "Quirky neighborhood known for its local character, Sunday market, and family-friendly atmosphere.",
    scores: {
      walkability: 85,
      safety: 85,
      affordability: 70,
      nightlife: 70,
      familyFriendly: 80,
      transit: 75,
    },
    demographics: {
      medianAge: 35,
      medianIncome: 82000,
      population: 15000,
      diversity: 0.68,
    },
    housing: {
      averageRent: 2400,
      homePrice: 720000,
      rentGrowth: 0.06,
    },
    amenities: {
      restaurants: 68,
      bars: 15,
      cafes: 12,
      parks: 5,
      gyms: 4,
      groceryStores: 8,
    },
    keyFeatures: ["Quirky character", "Local businesses", "Family-friendly", "Sunday market"],
    highlights: ["Fremont Troll", "Gas Works Park nearby", "Local breweries"],
    transportation: {
      walkScore: 85,
      transitScore: 75,
      bikeScore: 82,
    },
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  try {
    if (id) {
      // Return specific neighborhood
      const neighborhood = neighborhoods.find((n) => n.id === id)
      if (!neighborhood) {
        return NextResponse.json({ error: "Neighborhood not found" }, { status: 404 })
      }
      return NextResponse.json(neighborhood)
    }

    // Return all neighborhoods
    return NextResponse.json(neighborhoods)
  } catch (error) {
    console.error("Error fetching neighborhoods:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { preferences } = body

    // Calculate match scores based on user preferences
    const matches = neighborhoods
      .map((neighborhood) => {
        const weights = {
          walkability: preferences.walkability[0] / 10,
          safety: preferences.safety[0] / 10,
          affordability: (11 - Math.min(preferences.budget[0] / 500, 10)) / 10,
          nightlife: preferences.nightlife[0] / 10,
          familyFriendly: preferences.familyFriendly[0] / 10,
          transit: preferences.publicTransit[0] / 10,
        }

        let overallScore = 0
        Object.keys(weights).forEach((key) => {
          overallScore +=
            neighborhood.scores[key as keyof typeof neighborhood.scores] * weights[key as keyof typeof weights]
        })

        overallScore = Math.round(overallScore / 6)

        return {
          ...neighborhood,
          overallScore,
          matchReasons: generateMatchReasons(neighborhood, preferences),
        }
      })
      .sort((a, b) => b.overallScore - a.overallScore)

    return NextResponse.json(matches)
  } catch (error) {
    console.error("Error calculating matches:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateMatchReasons(neighborhood: any, preferences: any): string[] {
  const reasons = []

  if (neighborhood.scores.walkability >= 80 && preferences.walkability[0] >= 7) {
    reasons.push("Excellent walkability matches your preference")
  }
  if (neighborhood.scores.safety >= 80 && preferences.safety[0] >= 7) {
    reasons.push("High safety rating aligns with your priorities")
  }
  if (neighborhood.scores.nightlife >= 80 && preferences.nightlife[0] >= 7) {
    reasons.push("Vibrant nightlife scene matches your lifestyle")
  }
  if (neighborhood.scores.familyFriendly >= 80 && preferences.familyFriendly[0] >= 7) {
    reasons.push("Family-friendly amenities match your needs")
  }
  if (neighborhood.housing.averageRent <= preferences.budget[0]) {
    reasons.push("Within your budget range")
  }

  return reasons
}
