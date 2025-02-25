"use client";

import React from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import { OverallPerformance } from "@/components/overall-performance";
// import { SentimentAnalysis } from "@/components/SentimentAnalysis";
// import { PlatformView } from "@/components/platform-view";
// import { DateRangeSelector } from "@/components/date-range-selector";
import "@/app/globals.css"; // Ensure this path is correct
import { TwitterEngagement } from "@/components/TwitterEngagement";
import { SentimentCounts } from "@/components/SentimentCounts";
import { EngagementSummary } from "@/components/EngagementSummary";
import { Demographics } from "@/components/Demographics";
import { EngagementRadar } from "@/components/Engagement-radar"
import { TrendingHashtags } from "@/components/TrendingHashtags";

export default function DashboardPage() {

  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />
      <main className="p-6">
      <TwitterEngagement />
      <br />

      <TrendingHashtags />
      <br />
    

      {/* <SentimentAnalysis />
      <br /> */}

      <SentimentCounts />
      <br />
        {/* <PlatformView /> */}
        <EngagementSummary />
        <br />
        <Demographics />
        {/* <DateRangeSelector /> */}
        <br />
        <EngagementRadar />
      </main>
    </div>
    
  );
}
