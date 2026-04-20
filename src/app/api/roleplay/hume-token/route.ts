import { fetchAccessToken } from "hume";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Mints a short-lived Hume access token for the browser using the server-side
 * API key + secret. We never ship the API key to the client.
 *
 * The browser calls this right before opening the EVI WebSocket via
 * @humeai/voice-react's VoiceProvider.
 */
export async function GET() {
  const apiKey = process.env.HUME_API_KEY;
  const secretKey = process.env.HUME_SECRET;

  if (!apiKey || !secretKey) {
    return NextResponse.json(
      {
        error:
          "Hume credentials are not configured. Set HUME_API_KEY and HUME_SECRET.",
      },
      { status: 503 },
    );
  }

  try {
    const accessToken = await fetchAccessToken({ apiKey, secretKey });

    if (!accessToken) {
      throw new Error("Hume returned an empty access token");
    }

    return NextResponse.json({
      accessToken,
      configId: process.env.HUME_CONFIG || null,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[roleplay/hume-token] failed to mint token", err);
    return NextResponse.json(
      { error: "Failed to mint Hume access token" },
      { status: 500 },
    );
  }
}
