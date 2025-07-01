"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Search } from "lucide-react"
import Link from "next/link"

interface Neighborhood {
  id: string
  name: string
  city: string
  description: string
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
  keyFeatures: string[]
  highlights: string[]
  averageRent: number
}

const mockNeighborhoods: Neighborhood[] = [
  {
    id: "1",
    name: "Capitol Hill",
    city: "Seattle, WA",
    description: "Vibrant arts district with excellent nightlife, walkable streets, and a strong coffee culture.",
    scores: { walkability: 95, safety: 75, affordability: 60, nightlife: 90, familyFriendly: 65, transit: 85 },
    demographics: { medianAge: 29, medianIncome: 75000, population: 28000 },
    keyFeatures: ["Vibrant nightlife", "Walkable streets", "Arts scene", "Coffee culture"],
    highlights: ["Pike/Pine corridor", "Cal Anderson Park", "Light rail access"],
    averageRent: 2800,
  },
  {
    id: "2",
    name: "Fremont",
    city: "Seattle, WA",
    description: "Quirky neighborhood known for its local character, Sunday market, and family-friendly atmosphere.",
    scores: { walkability: 85, safety: 85, affordability: 70, nightlife: 70, familyFriendly: 80, transit: 75 },
    demographics: { medianAge: 35, medianIncome: 82000, population: 15000 },
    keyFeatures: ["Quirky character", "Local businesses", "Family-friendly", "Sunday market"],
    highlights: ["Fremont Troll", "Gas Works Park nearby", "Local breweries"],
    averageRent: 2400,
  },
  {
    id: "3",
    name: "Ballard",
    city: "Seattle, WA",
    description: "Historic maritime neighborhood with a thriving brewery scene and waterfront access.",
    scores: { walkability: 80, safety: 80, affordability: 65, nightlife: 85, familyFriendly: 75, transit: 70 },
    demographics: { medianAge: 32, medianIncome: 78000, population: 22000 },
    keyFeatures: ["Historic charm", "Brewery scene", "Waterfront", "Nordic heritage"],
    highlights: ["Ballard Locks", "Sunday farmers market", "Maritime history"],
    averageRent: 2600,
  },
  {
    id: "4",
    name: "Queen Anne",
    city: "Seattle, WA",
    description: "Upscale neighborhood with stunning city views, close to Seattle Center and cultural attractions.",
    scores: { walkability: 75, safety: 90, affordability: 55, nightlife: 60, familyFriendly: 85, transit: 80 },
    demographics: { medianAge: 38, medianIncome: 95000, population: 18000 },
    keyFeatures: ["Upscale living", "Seattle Center proximity", "Great views", "Low crime"],
    highlights: ["Space Needle views", "Seattle Center", "Kerry Park"],
    averageRent: 3200,
  },
  {
    id: "5",
    name: "Georgetown",
    city: "Seattle, WA",
    description: "Industrial-chic neighborhood with affordable housing, art studios, and an emerging food scene.",
    scores: { walkability: 65, safety: 70, affordability: 85, nightlife: 75, familyFriendly: 60, transit: 65 },
    demographics: { medianAge: 31, medianIncome: 65000, population: 8000 },
    keyFeatures: ["Industrial charm", "Affordable", "Art studios", "Emerging area"],
    highlights: ["Georgetown Steam Plant", "Art galleries", "Craft breweries"],
    averageRent: 1900,
  },
  {
    id: "6",
    name: "Wallingford",
    city: "Seattle, WA",
    description: "Residential neighborhood with tree-lined streets, local shops, and strong community feel.",
    scores: { walkability: 78, safety: 88, affordability: 68, nightlife: 65, familyFriendly: 90, transit: 72 },
    demographics: { medianAge: 36, medianIncome: 85000, population: 19000 },
    keyFeatures: ["Tree-lined streets", "Community feel", "Good schools", "Local shops"],
    highlights: ["Green Lake nearby", "Wallingford Center", "Family parks"],
    averageRent: 2500,
  },
]

export default function NeighborhoodsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [neighborhoods] = useState<Neighborhood[]>(mockNeighborhoods)

  const filteredNeighborhoods = neighborhoods
    .filter(
      (n) =>
        n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.keyFeatures.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "walkability":
          return b.scores.walkability - a.scores.walkability
        case "safety":
          return b.scores.safety - a.scores.safety
        case "affordability":
          return b.scores.affordability - a.scores.affordability
        case "rent":
          return a.averageRent - b.averageRent
        default:
          return a.name.localeCompare(b.name)
      }
    })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Neighborhoods</h1>
          <p className="text-gray-600">
            Explore detailed profiles of neighborhoods in Seattle and find your perfect match.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search neighborhoods, features, or amenities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="name">Sort by Name</option>
            <option value="walkability">Sort by Walkability</option>
            <option value="safety">Sort by Safety</option>
            <option value="affordability">Sort by Affordability</option>
            <option value="rent">Sort by Rent (Low to High)</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredNeighborhoods.length} of {neighborhoods.length} neighborhoods
          </p>
        </div>

        {/* Neighborhood Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredNeighborhoods.map((neighborhood) => (
            <Card key={neighborhood.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{neighborhood.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {neighborhood.city}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      ${(neighborhood.averageRent / 1000).toFixed(1)}k
                    </div>
                    <div className="text-xs text-gray-500">avg rent</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{neighborhood.description}</p>

                {/* Key Scores */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Walkability</span>
                      <span>{neighborhood.scores.walkability}%</span>
                    </div>
                    <Progress value={neighborhood.scores.walkability} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Safety</span>
                      <span>{neighborhood.scores.safety}%</span>
                    </div>
                    <Progress value={neighborhood.scores.safety} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Affordability</span>
                      <span>{neighborhood.scores.affordability}%</span>
                    </div>
                    <Progress value={neighborhood.scores.affordability} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Nightlife</span>
                      <span>{neighborhood.scores.nightlife}%</span>
                    </div>
                    <Progress value={neighborhood.scores.nightlife} className="h-2" />
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <div className="flex flex-wrap gap-2">
                    {neighborhood.keyFeatures.slice(0, 3).map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {neighborhood.keyFeatures.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{neighborhood.keyFeatures.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Demographics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t text-center">
                  <div>
                    <div className="text-sm font-medium">{neighborhood.demographics.medianAge}</div>
                    <div className="text-xs text-gray-500">Med. Age</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      ${(neighborhood.demographics.medianIncome / 1000).toFixed(0)}k
                    </div>
                    <div className="text-xs text-gray-500">Med. Income</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {(neighborhood.demographics.population / 1000).toFixed(0)}k
                    </div>
                    <div className="text-xs text-gray-500">Population</div>
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <Link href={`/neighborhoods/${neighborhood.id}`}>View Full Profile</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNeighborhoods.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No neighborhoods found</h3>
            <p className="text-gray-600">Try adjusting your search terms or browse all neighborhoods.</p>
            <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-8">
              <h3 className="text-xl font-bold mb-2">Ready to Find Your Perfect Match?</h3>
              <p className="text-gray-600 mb-6">
                Take our personalized questionnaire to get neighborhood recommendations tailored to your lifestyle.
              </p>
              <Button size="lg" asChild>
                <Link href="/questionnaire">Get Personalized Matches</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
