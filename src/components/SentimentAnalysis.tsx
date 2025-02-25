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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface SentimentData {
  date: string;
  averageSentiment: number;
}

export function SentimentAnalysis() {
  const [data, setData] = useState<SentimentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sentiment")
      .then((res) => res.json())
      .then((aggregated: SentimentData[]) => {
        setData(aggregated);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sentiment data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading sentiment data...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Sentiment Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[-1, 1]} />
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
  );
}
