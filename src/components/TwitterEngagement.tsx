"use client";

import { useState, useEffect } from "react";
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

interface AggregatedTwitterData {
  date: string;
  totalReach: number;
  totalRetweets: number;
  totalLikes: number;
}

export function TwitterEngagement() {
  const [data, setData] = useState<AggregatedTwitterData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/twitter-engagement")
      .then((res) => res.json())
      .then((aggregatedData: AggregatedTwitterData[]) => {
        // Sort data by date for proper ordering
        const sortedData = aggregatedData.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setData(sortedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching Twitter engagement data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading Twitter Engagement data...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Twitter Engagement Metrics</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalReach" fill="#8884d8" name="Reach" />
          <Bar dataKey="totalRetweets" fill="#82ca9d" name="Retweets" />
          <Bar dataKey="totalLikes" fill="#ffc658" name="Likes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
