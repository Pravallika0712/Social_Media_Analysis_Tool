"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

// Types for engagement and sentiment data
interface EngagementData {
  date: string;
  totalReach: number;
  totalRetweets: number;
  totalLikes: number;
}

interface SentimentData {
  date: string;
  averageSentiment: number;
}

// Type for a metric card (engagement metrics)
interface Metric {
  name: string;
  value: number;
  change: string; // Placeholder for percentage change
  data: { date: string; value: number }[];
}

export function OverallPerformance() {
  const [engagementMetrics, setEngagementMetrics] = useState<Metric[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      // Engagement data is now served at /api/sentiment (because you renamed the folder)
      fetch("/api/sentiment").then((res) => res.json()),
      // Average sentiment data is fetched from its dedicated endpoint
      fetch("/api/twitter-sentiment").then((res) => res.json()),
    ])
      .then(([engagementData, sentimentData]) => {
        // Compute overall totals from engagement data
        const overall = (engagementData as EngagementData[]).reduce(
          (acc, day) => {
            acc.totalReach += day.totalReach;
            acc.totalRetweets += day.totalRetweets;
            acc.totalLikes += day.totalLikes;
            return acc;
          },
          { totalReach: 0, totalRetweets: 0, totalLikes: 0 }
        );

        const computedMetrics: Metric[] = [
          {
            name: "Reactions",
            value: overall.totalReach,
            change: "+?%",
            data: (engagementData as EngagementData[]).map((day) => ({
              date: day.date,
              value: day.totalReach,
            })),
          },
          {
            name: "Retweets",
            value: overall.totalRetweets,
            change: "+?%",
            data: (engagementData as EngagementData[]).map((day) => ({
              date: day.date,
              value: day.totalRetweets,
            })),
          },
          {
            name: "Likes",
            value: overall.totalLikes,
            change: "+?%",
            data: (engagementData as EngagementData[]).map((day) => ({
              date: day.date,
              value: day.totalLikes,
            })),
          },
        ];

        setEngagementMetrics(computedMetrics);
        setSentimentData(sentimentData as SentimentData[]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  return (
    <div className="space-y-4">
      {/* Engagement Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {engagementMetrics.map((metric) => (
          <Dialog key={metric.name}>
            <DialogTrigger asChild>
              <Card className="hover:bg-accent cursor-pointer transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p
                    className={`text-xs ${
                      metric.change.startsWith("+") ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {metric.change}
                  </p>
                  <div className="h-[80px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metric.data}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#8884d8"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{metric.name} Trend</DialogTitle>
              </DialogHeader>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metric.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
      {/* Sentiment Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Average Sentiment Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="averageSentiment"
                stroke="#ff7300"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
