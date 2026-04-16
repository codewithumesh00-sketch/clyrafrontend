import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";

export async function POST(req: NextRequest) {
  try {
    const { siteId, files } = await req.json();

    const zip = new JSZip();

    for (const [filePath, content] of Object.entries(files)) {
      zip.file(filePath, String(content));
    }

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
    });

    const response = await fetch(
      `https://api.netlify.com/api/v1/sites/${siteId}/deploys`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NETLIFY_AUTH_TOKEN}`,
          "Content-Type": "application/zip",
        },
        body: new Uint8Array(zipBuffer),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: true,
      url: data.ssl_url || data.deploy_ssl_url || data.url,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Deploy failed" });
  }
}
