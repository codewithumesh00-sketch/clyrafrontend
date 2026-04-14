import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { siteId } = await req.json();

    const zipPath = path.join(process.cwd(), "exports", "site.zip");
    const zipBuffer = fs.readFileSync(zipPath);

    const response = await fetch(
      `https://api.netlify.com/api/v1/sites/${siteId}/deploys`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NETLIFY_AUTH_TOKEN}`,
          "Content-Type": "application/zip",
        },
        body: zipBuffer,
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: true,
      url: data.ssl_url || data.deploy_ssl_url,
      deployId: data.id,
    });
  } catch (error) {
    console.error("Netlify deploy failed:", error);
    return NextResponse.json(
      { success: false, error: "Deploy failed" },
      { status: 500 }
    );
  }
}