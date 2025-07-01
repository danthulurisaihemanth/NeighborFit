"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star } from "lucide-react"
import Link from "next/link"

interface NeighborhoodMatch {
  id: string
  name: string
  city: string
  overallScore: number
  scores: {
    walkability: number
    safety: number
    affordability: number
    nightlife: number
    familyFriendly: number
    transit: number
  }
  highlights: string[]
  demographics: {
    medianAge: number
    medianIncome: number
    population: number
  }
  keyFeatures: string[]
  matchReasons: string[]
}

export default function ResultsPage() {
  const [matches, setMatches] = useState<NeighborhoodMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [userPreferences, setUserPreferences] = useState<any>(null)

  useEffect(() => {
    // Get user preferences from localStorage
    const savedPreferences = localStorage.getItem("userPreferences")
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences)
      setUserPreferences(preferences)

      // Simulate API call to matching service
      setTimeout(() => {
        const mockMatches = generateMockMatches(preferences)
        setMatches(mockMatches)
        setLoading(false)
      }, 2000)
    }
  }, [])

  const generateMockMatches = (preferences: any): NeighborhoodMatch[] => {
    const neighborhoods = [
      {
        id: "1",
        name: "Capitol Hill",
        city: "Seattle, WA",
        baseScores: { walkability: 95, safety: 75, affordability: 60, nightlife: 90, familyFriendly: 65, transit: 85 },
        demographics: { medianAge: 29, medianIncome: 75000, population: 28000 },
        keyFeatures: ["Vibrant nightlife", "Walkable streets", "Arts scene", "Coffee culture"],
        highlights: ["Pike/Pine corridor", "Cal Anderson Park", "Light rail access"],
      },
      {
        id: "2",
        name: "Fremont",
        city: "Seattle, WA",
        baseScores: { walkability: 85, safety: 85, affordability: 70, nightlife: 70, familyFriendly: 80, transit: 75 },
        demographics: { medianAge: 35, medianIncome: 82000, population: 15000 },
        keyFeatures: ["Quirky character", "Local businesses", "Family-friendly", "Sunday market"],
        highlights: ["Fremont Troll", "Gas Works Park nearby", "Local breweries"],
      },
      {
        id: "3",
        name: "Ballard",
        city: "Seattle, WA",
        baseScores: { walkability: 80, safety: 80, affordability: 65, nightlife: 85, familyFriendly: 75, transit: 70 },
        demographics: { medianAge: 32, medianIncome: 78000, population: 22000 },
        keyFeatures: ["Historic charm", "Brewery scene", "Waterfront", "Nordic heritage"],
        highlights: ["Ballard Locks", "Sunday farmers market", "Maritime history"],
      },
      {
        id: "4",
        name: "Queen Anne",
        city: "Seattle, WA",
        baseScores: { walkability: 75, safety: 90, affordability: 55, nightlife: 60, familyFriendly: 85, transit: 80 },
        demographics: { medianAge: 38, medianIncome: 95000, population: 18000 },
        keyFeatures: ["Upscale living", "Seattle Center proximity", "Great views", "Low crime"],
        highlights: ["Space Needle views", "Seattle Center", "Kerry Park"],
      },
      {
        id: "5",
        name: "Georgetown",
        city: "Seattle, WA",
        baseScores: { walkability: 65, safety: 70, affordability: 85, nightlife: 75, familyFriendly: 60, transit: 65 },
        demographics: { medianAge: 31, medianIncome: 65000, population: 8000 },
        keyFeatures: ["Industrial charm", "Affordable", "Art studios", "Emerging area"],
        highlights: ["Georgetown Steam Plant", "Art galleries", "Craft breweries"],
      },
    ]

    return neighborhoods
      .map((neighborhood) => {
        // Calculate weighted scores based on user preferences
        const weights = {
          walkability: preferences.walkability[0] / 10,
          safety: preferences.safety[0] / 10,
          affordability: (11 - Math.min(preferences.budget[0] / 500, 10)) / 10,
          nightlife: preferences.nightlife[0] / 10,
          familyFriendly: preferences.familyFriendly[0] / 10,
          transit: preferences.publicTransit[0] / 10,
        }

        let overallScore = 0
        const scores = { ...neighborhood.baseScores }

        Object.keys(weights).forEach((key) => {
          overallScore += scores[key as keyof typeof scores] * weights[key as keyof typeof weights]
        })

        overallScore = Math.round(overallScore / 6)

        // Generate match reasons based on high-scoring categories
        const matchReasons = []
        if (scores.walkability >= 80 && preferences.walkability[0] >= 7) {
          matchReasons.push("Excellent walkability matches your preference")
        }
        if (scores.safety >= 80 && preferences.safety[0] >= 7) {
          matchReasons.push("High safety rating aligns with your priorities")
        }
        if (scores.nightlife >= 80 && preferences.nightlife[0] >= 7) {
          matchReasons.push("Vibrant nightlife scene matches your lifestyle")
        }
        if (scores.familyFriendly >= 80 && preferences.familyFriendly[0] >= 7) {
          matchReasons.push("Family-friendly amenities match your needs")
        }

        return {
          ...neighborhood,
          overallScore,
          scores,
          matchReasons,
        }
      })
      .sort((a, b) => b.overallScore - a.overallScore)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <h3 className="text-lg font-medium mb-2">Finding Your Perfect Matches</h3>
              <p className="text-gray-600 text-center">
                Analyzing neighborhood data and calculating compatibility scores...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Neighborhood Matches</h1>
          <p className="text-gray-600">
            Based on your preferences, here are the neighborhoods that best fit your lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matches.map((match, index) => (
            <Card key={match.id} className={index === 0 ? "ring-2 ring-blue-500" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {index === 0 && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
                      {match.name}
                      {index === 0 && <Badge variant="secondary">Best Match</Badge>}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {match.city}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{match.overallScore}%</div>
                    <div className="text-sm text-gray-500">Match Score</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Match Reasons */}
                {match.matchReasons.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Why this matches you:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {match.matchReasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Walkability</span>
                      <span>{match.scores.walkability}%</span>
                    </div>
                    <Progress value={match.scores.walkability} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Safety</span>
                      <span>{match.scores.safety}%</span>
                    </div>
                    <Progress value={match.scores.safety} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Affordability</span>
                      <span>{match.scores.affordability}%</span>
                    </div>
                    <Progress value={match.scores.affordability} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Nightlife</span>
                      <span>{match.scores.nightlife}%</span>
                    </div>
                    <Progress value={match.scores.nightlife} className="h-2" />
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Key Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {match.keyFeatures.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Demographics */}
                <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <div className="text-sm font-medium">{match.demographics.medianAge}</div>
                    <div className="text-xs text-gray-500">Median Age</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">${(match.demographics.medianIncome / 1000).toFixed(0)}k</div>
                    <div className="text-xs text-gray-500">Median Income</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{(match.demographics.population / 1000).toFixed(0)}k</div>
                    <div className="text-xs text-gray-500">Population</div>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href={`/neighborhoods/${match.id}`}>View Detailed Profile</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-6">
              <h3 className="text-lg font-medium mb-2">Want to refine your results?</h3>
              <p className="text-gray-600 mb-4">
                Adjust your preferences to see how different priorities affect your matches.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/questionnaire">Retake Quiz</Link>
                </Button>
                <Button asChild>
                  <Link href="/neighborhoods">Browse All Neighborhoods</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
