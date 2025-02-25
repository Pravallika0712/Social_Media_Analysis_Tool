import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function TrendingHashtags() {
  const [hashtags, setHashtags] = useState<{ query: string; exploreLink: string }[]>([]);
  const [region, setRegion] = useState("IN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const predefinedRegions = ["IN", "US", "GB", "CA", "AU"];

  useEffect(() => {
    fetchTrendingHashtags();
  }, [region]);

  const fetchTrendingHashtags = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/trendingHashtags?geo=${region}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch data");
      setHashtags(data.hashtags || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setHashtags([]);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-background rounded-xl shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-4">📈 Trending Hashtags</h2>

      {/* 🔹 Region Selector & Refresh Button */}
      <div className="flex gap-4 items-center">
        <Select defaultValue={region} onValueChange={setRegion}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select Region" />
          </SelectTrigger>
          <SelectContent>
            {predefinedRegions.map((code) => (
              <SelectItem key={code} value={code}>
                {code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={fetchTrendingHashtags}
          disabled={loading}
          className="bg-primary hover:bg-primary/90 transition-all"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Refresh"}
        </Button>
      </div>

      {/* 🔹 Error Message */}
      {error && <p className="mt-4 text-destructive font-medium">{error}</p>}

      {/* 🔹 Trending Hashtags List */}
      <div className="mt-4 space-y-3">
        {loading ? (
          <p className="text-muted-foreground">Fetching latest trends...</p>
        ) : hashtags.length > 0 ? (
          hashtags.map((tag, index) => (
            <Card key={index} className="shadow-sm border">
              <CardContent className="flex justify-between items-center p-3">
                <span className="text-lg font-semibold">#{tag.query}</span>
                <a href={`https://trends.google.com${tag.exploreLink}`} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">
                  View
                </a>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">No trending hashtags found.</p>
        )}
      </div>
    </div>
  );
}
