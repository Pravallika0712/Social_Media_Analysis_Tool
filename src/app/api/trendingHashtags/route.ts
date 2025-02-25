import { NextResponse } from "next/server";
import googleTrends from "google-trends-api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const geo = searchParams.get("geo") || "IN"; // Default to India

    const results = await googleTrends.dailyTrends({
      geo: geo,
    });

    const parsedResults = JSON.parse(results);
    const hashtags =
      parsedResults.default.trendingSearchesDays[0].trendingSearches.map(
        (trend: any) => trend.title
      ) || [];

    return NextResponse.json({ hashtags });
  } catch (error) {
    console.error("Error fetching Google Trends:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending hashtags" },
      { status: 500 }
    );
  }
}
