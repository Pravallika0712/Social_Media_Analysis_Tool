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

  const rows: any[] = [];

  try {
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (data) => rows.push(data))
        .on("end", resolve)
        .on("error", reject);
    });
  } catch (error: any) {
    console.error("Error reading CSV file:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("Rows read from CSV:", rows.length);
  console.log("First row (raw):", rows[0]);

  // Aggregate data: sum up num_likes, num_comments, num_shares across all rows
  let totalLikes = 0,
    totalComments = 0,
    totalShares = 0;

  rows.forEach((row) => {
    totalLikes += Number(row.num_likes) || 0;
    totalComments += Number(row.num_comments) || 0;
    totalShares += Number(row.num_shares) || 0;
  });

  // Create the engagement summary array
  const engagementData = [
    { name: "Likes", value: totalLikes },
    { name: "Comments", value: totalComments },
    { name: "Shares", value: totalShares },
  ];

  console.log("Aggregated Engagement Data:", engagementData);
  return NextResponse.json(engagementData);
}
