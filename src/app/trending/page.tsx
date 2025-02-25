"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import "@/app/globals.css";
import { TrendingHeader } from "@/components/trending-header";

export default function TrendingPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [region, setRegion] = useState("US");
  const [maxResults, setMaxResults] = useState(10);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const predefinedRegions = useMemo(() => ["US", "IN", "GB", "CA", "AU"], []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchTrendingVideos();
    }
  }, [region, maxResults, mounted]);

  const fetchTrendingVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/trending?region=${region}&maxResults=${maxResults}`);
      const data = await res.json();
      setVideos(data);
    } catch (error) {
      console.error("Error fetching trending videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toISOString().split("T")[0];

  if (!mounted) return <p>Loading...</p>; // Prevents hydration errors

  return (
    <>
      <TrendingHeader />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">YouTube Trending Videos</h1>
        <div className="mb-4 flex flex-wrap items-center gap-4">
          {/* Region Selector */}
          <div className="flex items-center gap-2">
            <label className="font-medium">Region Code:</label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-[120px]">
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
          </div>

          {/* Max Results Input */}
          <div className="flex items-center gap-2">
            <label className="font-medium">Max Results:</label>
            <input
              type="number"
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value) || 1)}
              className="ml-2 border rounded p-1 w-20"
            />
          </div>

          <Button onClick={fetchTrendingVideos}>Refresh</Button>
        </div>

        {loading ? (
          <p>Loading trending videos...</p>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => (
              <Card key={video.videoId} className="p-4 shadow-lg border border-gray-200 rounded-xl">
                <div className="flex gap-4">
                  {/* Video Thumbnail */}
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-40 h-24 rounded-lg object-cover"
                      onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
                    />
                  ) : (
                    <div className="w-40 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  )}

                  {/* Video Details */}
                  <div className="flex-1">
                    <CardHeader className="p-0">
                      <CardTitle className="text-lg font-semibold">{video.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 mt-2">
                      <p className="text-sm text-gray-600">
                        <strong className="font-medium">Channel:</strong> {video.channelTitle}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong className="font-medium">Published:</strong> {formatDate(video.publishedAt)}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-700 mt-2">
                        <span>👁 {video.viewCount}</span>
                        <span>👍 {video.likeCount}</span>
                        <span>💬 {video.commentCount}</span>
                      </div>

                      {/* Buttons */}
                      <div className="mt-3 flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => window.open(`https://www.youtube.com/watch?v=${video.videoId}`, "_blank")}
                        >
                          🎬 Watch Video
                        </Button>
                        <Button variant="outline" size="sm">🔗 Share</Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
