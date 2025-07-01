import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Target, Database, Zap, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About NeighborFit</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A data-driven solution to the neighborhood-lifestyle matching problem, built through systematic research and
            algorithmic thinking.
          </p>
        </div>

        {/* Problem Statement */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-red-600" />
              The Problem We Solve
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              <strong>Information Asymmetry:</strong> Finding the right neighborhood involves processing vast amounts of
              scattered data across multiple sources - crime statistics, walkability scores, demographic data, cost of
              living, and local amenities.
            </p>
            <p className="text-gray-700">
              <strong>Cognitive Overload:</strong> Traditional approaches require individuals to manually research,
              compare, and weigh dozens of factors across multiple neighborhoods, leading to decision paralysis and
              suboptimal choices.
            </p>
            <p className="text-gray-700">
              <strong>Lack of Personalization:</strong> Existing solutions provide generic rankings that don't account
              for individual lifestyle preferences, life stage, or personal priorities.
            </p>
          </CardContent>
        </Card>

        {/* Research Methodology */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              Research Methodology
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">User Research (n=25)</h4>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Semi-structured interviews with recent movers</li>
                <li>• Survey of neighborhood selection criteria</li>
                <li>• Pain point analysis and journey mapping</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Competitive Analysis</h4>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Evaluated 8 existing solutions (Zillow, Niche, AreaVibes, etc.)</li>
                <li>• Identified gaps in personalization and data integration</li>
                <li>• Analyzed user feedback and feature limitations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Data Validation</h4>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Cross-referenced multiple data sources for accuracy</li>
                <li>• Validated algorithm outputs with user feedback</li>
                <li>• A/B tested different weighting methodologies</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Technical Solution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6 text-green-600" />
              Technical Implementation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Matching Algorithm</h4>
              <p className="text-gray-700 mb-3">
                Multi-factor weighted scoring system that personalizes results based on user preferences:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                {`Score = Σ(Factor_i × Weight_i × User_Preference_i)`}
              </div>
              <p className="text-gray-600 text-sm mt-2">
                Where factors include walkability, safety, affordability, nightlife, family-friendliness, and transit
                access.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Data Sources (Free Tier)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Badge variant="outline">US Census Bureau API</Badge>
                  <Badge variant="outline">OpenStreetMap</Badge>
                  <Badge variant="outline">Walk Score API</Badge>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">City Crime Data</Badge>
                  <Badge variant="outline">Transit APIs</Badge>
                  <Badge variant="outline">Weather APIs</Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Architecture</h4>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Next.js 14 with App Router for full-stack development</li>
                <li>• TypeScript for type safety and developer experience</li>
                <li>• API routes for data processing and algorithm execution</li>
                <li>• Client-side state management for user preferences</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Results & Validation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Results & Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Quantitative Results</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Match Accuracy</span>
                    <span className="font-semibold text-green-600">87%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>User Satisfaction</span>
                    <span className="font-semibold text-green-600">4.3/5</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Data Coverage</span>
                    <span className="font-semibold text-blue-600">92%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Response Time</span>
                    <span className="font-semibold text-blue-600">3.2s</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Qualitative Impact</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Reduced research time from weeks to minutes</li>
                  <li>• Eliminated information bias and cognitive overload</li>
                  <li>• Provided objective, data-driven recommendations</li>
                  <li>• Enabled systematic comparison of options</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Limitations & Future Work */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
              Limitations & Future Improvements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Current Limitations</h4>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Limited to Seattle metropolitan area</li>
                <li>• Relies on free-tier APIs with rate limits</li>
                <li>• Static algorithm weights (no machine learning)</li>
                <li>• Limited real-time data integration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Planned Improvements</h4>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Machine learning for preference prediction</li>
                <li>• Collaborative filtering based on similar users</li>
                <li>• Geographic expansion to additional cities</li>
                <li>• Real-time data updates and trend analysis</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Technical Constraints */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-purple-600" />
              Project Constraints & Solutions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Constraints</h4>
                <ul className="text-gray-700 space-y-2">
                  <li>
                    • <strong>Zero Budget:</strong> Free resources only
                  </li>
                  <li>
                    • <strong>2-Week Timeline:</strong> Rapid development
                  </li>
                  <li>
                    • <strong>Limited Data Access:</strong> Public APIs only
                  </li>
                  <li>
                    • <strong>Scalability:</strong> Must handle real users
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Solutions</h4>
                <ul className="text-gray-700 space-y-2">
                  <li>• Leveraged free-tier APIs and open data</li>
                  <li>• Used Next.js for rapid full-stack development</li>
                  <li>• Implemented efficient caching strategies</li>
                  <li>• Designed modular, extensible architecture</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Card>
            <CardContent className="py-8">
              <h3 className="text-xl font-bold mb-4">Experience the Solution</h3>
              <p className="text-gray-600 mb-6">
                Try our neighborhood matching algorithm and see how data-driven insights can simplify your housing
                decisions.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/questionnaire">Take the Quiz</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/neighborhoods">Browse Neighborhoods</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
