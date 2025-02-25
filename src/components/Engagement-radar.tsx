"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface EngagementBreakdown {
  metric: string;
  value: number;
}

export function EngagementRadar() {
  const [data, setData] = useState<EngagementBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/engagement-radar")
      .then((res) => res.json())
      .then((fetched: EngagementBreakdown[]) => {
        console.log("Client received engagement data:", fetched);
        setData(fetched);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching engagement radar data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading engagement data...</p>;

  // Determine maximum value for the radar chart axis
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Radar Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={30} domain={[0, maxValue]} />
            <Tooltip />
            <Legend />
            <Radar
              name="Engagement"
              dataKey="value"
              stroke="#d62728"
              fill="#d62728"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
