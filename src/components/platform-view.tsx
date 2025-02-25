"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { PieChart, Pie, Cell } from "recharts"

const platforms = ["Facebook", "Instagram", "Twitter", "LinkedIn"]

const engagementData = [
  { name: "Likes", value: 4000 },
  { name: "Comments", value: 3000 },
  { name: "Shares", value: 2000 },
]

const demographicsData = [
  { name: "18-24", value: 400 },
  { name: "25-34", value: 300 },
  { name: "35-44", value: 300 },
  { name: "45-54", value: 200 },
  { name: "55+", value: 100 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const topPosts = [
  { id: 1, thumbnail: "/placeholder.svg", likes: 1200, comments: 89, shares: 56 },
  { id: 2, thumbnail: "/placeholder.svg", likes: 980, comments: 72, shares: 41 },
  { id: 3, thumbnail: "/placeholder.svg", likes: 850, comments: 63, shares: 38 },
]

export function PlatformView() {
  const [activePlatform, setActivePlatform] = useState(platforms[0])

  return (
    <Tabs defaultValue={activePlatform} onValueChange={setActivePlatform}>
      <TabsList>
        {platforms.map((platform) => (
          <TabsTrigger key={platform} value={platform}>
            {platform}
          </TabsTrigger>
        ))}
      </TabsList>
      {platforms.map((platform) => (
        <TabsContent key={platform} value={platform}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={demographicsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {demographicsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {topPosts.map((post) => (
                    <li key={post.id} className="flex items-center space-x-4">
                      <img
                        src={post.thumbnail || "/placeholder.svg"}
                        alt="Post thumbnail"
                        className="w-16 h-16 rounded"
                      />
                      <div>
                        <p className="font-semibold">Likes: {post.likes}</p>
                        <p>Comments: {post.comments}</p>
                        <p>Shares: {post.shares}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

