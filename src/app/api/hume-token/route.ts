/**
 * Mints short-lived Hume EVI access tokens so the browser never sees
 * HUME_API_KEY / HUME_SECRET_KEY. The token is minted per page load
 * and used by @humeai/voice-react to open a websocket to Hume.
 *
 * Uses client_credentials against Hume's OAuth2 endpoint directly —
 * this avoids tying us to any specific hume SDK export name.
 */

export const runtime = "nodejs";

export async function GET() {
  const apiKey = process.env.HUME_API_KEY;
  const secretKey = process.env.HUME_SECRET_KEY;

  if (!apiKey || !secretKey) {
    return Response.json(
      {
        error:
          "Hume is not configured. Set HUME_API_KEY and HUME_SECRET_KEY in your project env.",
      },
      { status: 501 },
    );
  }

  const credentials = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");

  try {
    const res = await fetch("https://api.hume.ai/oauth2-cc/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return Response.json(
        {
          error: `Hume token request failed (${res.status})`,
          detail: text.slice(0, 500),
        },
        { status: 502 },
      );
    }

    const json = (await res.json()) as {
      access_token?: string;
      expires_in?: number;
    };

    if (!json.access_token) {
      return Response.json(
        { error: "Hume did not return an access_token." },
        { status: 502 },
      );
    }

    return Response.json({
      accessToken: json.access_token,
      expiresIn: json.expires_in ?? 1800,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[hume-token] failed", err);
    return Response.json(
      { error: "Hume token request threw an exception." },
      { status: 500 },
    );
  }
}
