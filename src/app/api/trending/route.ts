import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") || "US";
  const maxResults = Number(searchParams.get("maxResults")) || 10;

  const youtube = google.youtube({
    version: "v3",
    auth: process.env.API, // Your API key from the .env file
  });

  try {
    const response = await youtube.videos.list({
      part: ["snippet", "statistics"],
      chart: "mostPopular",
      regionCode: region,
      maxResults,
    });

    const items = response.data.items || [];
    const trendingVideos = items.map((item) => ({
      videoId: item.id || "",
      title: item.snippet?.title || "",
      channelTitle: item.snippet?.channelTitle || "",
      publishedAt: item.snippet?.publishedAt || "",
      viewCount: item.statistics?.viewCount ? Number(item.statistics.viewCount) : 0,
      likeCount: item.statistics?.likeCount ? Number(item.statistics.likeCount) : 0,
      commentCount: item.statistics?.commentCount ? Number(item.statistics.commentCount) : 0,
    }));

    return NextResponse.json(trendingVideos);
  } catch (error: any) {
    console.error("Error fetching trending videos:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
