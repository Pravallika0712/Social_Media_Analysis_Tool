"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface SentimentCountData {
  timePeriod: string;
  positive: number;
  neutral: number;
  negative: number;
}

export function SentimentCounts() {
  const [data, setData] = useState<SentimentCountData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Updated to fetch from /api/sentiment
    fetch("/api/sentiment")
      .then((res) => res.json())
      .then((aggregated: SentimentCountData[]) => {
        console.log("Client received sentiment data:", aggregated);
        setData(aggregated);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sentiment counts:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading sentiment data...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tweet Sentiment Counts by Time of Tweet</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timePeriod" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="positive" fill="#82ca9d" name="Positive" />
            <Bar dataKey="neutral" fill="#8884d8" name="Neutral" />
            <Bar dataKey="negative" fill="#ff7300" name="Negative" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
