import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

export async function GET() {
  const csvFilePath = path.join(process.cwd(), "data", "Live.csv");

  if (!fs.existsSync(csvFilePath)) {
    console.error("CSV file not found at:", csvFilePath);
    return NextResponse.json({ error: "CSV file not found" }, { status: 404 });
  }

  interface CsvRow {
    num_reactions: string;
    num_comments: string;
    num_shares: string;
    num_likes: string;
    num_loves: string;
    num_wows: string;
    num_hahas: string;
    num_sads: string;
    num_angrys: string;
  }

  const rows: CsvRow[] = [];
  try {
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (data) => rows.push(data))
        .on("end", resolve)
        .on("error", reject);
    });
  } catch (error: unknown) {
    console.error("Error reading CSV file:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }

  console.log("Rows read from CSV:", rows.length);

  // Aggregate metrics from the CSV rows
  let totalReactions = 0;
  let totalComments = 0;
  let totalShares = 0;
  let totalLikes = 0;
  let totalLoves = 0;
  let totalWows = 0;
  let totalHahas = 0;
  let totalSads = 0;
  let totalAngrys = 0;

  rows.forEach((row) => {
    totalReactions += Number(row.num_reactions) || 0;
    totalComments += Number(row.num_comments) || 0;
    totalShares += Number(row.num_shares) || 0;
    totalLikes += Number(row.num_likes) || 0;
    totalLoves += Number(row.num_loves) || 0;
    totalWows += Number(row.num_wows) || 0;
    totalHahas += Number(row.num_hahas) || 0;
    totalSads += Number(row.num_sads) || 0;
    totalAngrys += Number(row.num_angrys) || 0;
  });

  // Create an array of objects for the Radar Chart
  const aggregatedData = [
    { metric: "Reactions", value: totalReactions },
    { metric: "Comments", value: totalComments },
    { metric: "Shares", value: totalShares },
    { metric: "Likes", value: totalLikes },
    { metric: "Loves", value: totalLoves },
    { metric: "Wows", value: totalWows },
    { metric: "Hahas", value: totalHahas },
    { metric: "Sads", value: totalSads },
    { metric: "Angrys", value: totalAngrys },
  ];

  console.log("Aggregated Engagement Data:", aggregatedData);
  return NextResponse.json(aggregatedData);
}
