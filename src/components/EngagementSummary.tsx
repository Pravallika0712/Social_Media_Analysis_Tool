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

interface EngagementMetric {
  name: string;
  value: number;
}

export function EngagementSummary() {
  const [data, setData] = useState<EngagementMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/engagement")
      .then((res) => res.json())
      .then((data: EngagementMetric[]) => {
        console.log("Client received engagement data:", data);
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching engagement data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading engagement data...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
