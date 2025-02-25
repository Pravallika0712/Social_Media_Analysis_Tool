import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

export async function GET() {
  const csvFilePath = path.join(process.cwd(), "data", "test.csv");

  if (!fs.existsSync(csvFilePath)) {
    console.error("CSV file not found at:", csvFilePath);
    return NextResponse.json({ error: "CSV file not found" }, { status: 404 });
  }

  interface Row {
    [key: string]: string;
  }

  const rows: Row[] = [];
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
  console.log("First row (raw):", rows[0]);

  // Group rows by "Time of Tweet" (as a categorical value) and count sentiment occurrences
  const grouped: Record<
    string,
    { timePeriod: string; positive: number; neutral: number; negative: number }
  > = {};

  rows.forEach((row) => {
    // Normalize keys (trim extra whitespace)
    const normalized = Object.fromEntries(
      Object.entries(row).map(([key, value]) => [key.trim(), value])
    );

    const timePeriodRaw = normalized["Time of Tweet"];
    if (!timePeriodRaw) return;
    const timePeriod = timePeriodRaw.toLowerCase();

    // Check the sentiment field (assume values are "positive", "neutral", or "negative")
    const sentimentStr = normalized.sentiment?.toLowerCase();
    if (!sentimentStr || !["positive", "neutral", "negative"].includes(sentimentStr)) return;

    if (!grouped[timePeriod]) {
      grouped[timePeriod] = { timePeriod, positive: 0, neutral: 0, negative: 0 };
    }

    if (sentimentStr === "positive") grouped[timePeriod].positive++;
    else if (sentimentStr === "neutral") grouped[timePeriod].neutral++;
    else if (sentimentStr === "negative") grouped[timePeriod].negative++;
  });

  // Define a custom order for expected time periods (if applicable)
  const order = ["morning", "afternoon", "evening", "night"];
  const aggregated = Object.values(grouped).sort((a, b) => {
    const indexA = order.indexOf(a.timePeriod) === -1 ? 99 : order.indexOf(a.timePeriod);
    const indexB = order.indexOf(b.timePeriod) === -1 ? 99 : order.indexOf(b.timePeriod);
    return indexA - indexB;
  });

  console.log("Aggregated Sentiment Data:", aggregated);
  return NextResponse.json(aggregated);
}
