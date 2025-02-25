"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Define the type for competitor data
interface CompetitorData {
  country: string;
  you: number;
  competitor1: number;
  competitor2: number;
}

// Updated color palette
const COLORS = {
  you: "#1f77b4",         // Blue
  competitor1: "#ff7f0e", // Orange
  competitor2: "#2ca02c", // Green
};

export function CompetitorAnalysis() {
  const [data, setData] = useState<CompetitorData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/competitor")
      .then((res) => res.json())
      .then((fetched: CompetitorData[]) => {
        setData(fetched);
        if (fetched.length > 0) {
          setSelectedCountry(fetched[0].country);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching competitor data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading competitor data...</p>;

  // Find data for the selected country
  const countryData = data.find((item) => item.country === selectedCountry);

  // Convert the selected country object to an array for the RadialBarChart
  const chartData = countryData
    ? [
        { name: "You", value: countryData.you },
        { name: "Competitor 1", value: countryData.competitor1 },
        { name: "Competitor 2", value: countryData.competitor2 },
      ]
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Competitor Analysis by Country</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select defaultValue={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {data.map((item) => (
                <SelectItem key={item.country} value={item.country}>
                  {item.country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="80%"
              data={chartData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar minAngle={15} background clockWise dataKey="value" />
              <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                wrapperStyle={{ right: 0 }}
              />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        ) : (
          <p>No data available</p>
        )}
      </CardContent>
    </Card>
  );
}
