import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const subscribeRequestSchema = z.object({
  email: z.string().email(),
  consent: z.boolean(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parseResult = subscribeRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid request data", details: parseResult.error.issues }, { status: 400 });
    }

    const { email, consent } = parseResult.data;

    if (!consent) {
      return NextResponse.json({ error: "Consent is required" }, { status: 400 });
    }

    // Step 1: Fetch the k-monitor.hu homepage to get the CSRF token
    const homeResponse = await fetch("https://k-monitor.hu/", {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; voksmonitor.hu)",
      },
    });

    if (!homeResponse.ok) {
      console.error("Failed to fetch k-monitor.hu homepage:", homeResponse.status);
      return NextResponse.json({ error: "Failed to initialize subscription" }, { status: 502 });
    }

    // Extract XSRF-TOKEN and laravel_session from Set-Cookie header
    const cookies = homeResponse.headers.get("set-cookie");
    let xsrfToken: string | null = null;
    let laravelSession: string | null = null;

    if (cookies) {
      const cookieArray = cookies.split(",").map((c) => c.trim());
      for (const cookie of cookieArray) {
        const xsrfMatch = cookie.match(/XSRF-TOKEN=([^;]+)/);
        if (xsrfMatch?.[1]) {
          xsrfToken = decodeURIComponent(xsrfMatch[1]);
        }

        const sessionMatch = cookie.match(/laravel_session=([^;]+)/);
        if (sessionMatch?.[1]) {
          laravelSession = decodeURIComponent(sessionMatch[1]);
        }
      }
    }

    if (!xsrfToken) {
      console.error("XSRF-TOKEN not found in cookies");
      return NextResponse.json({ error: "Failed to obtain security token" }, { status: 502 });
    }

    if (!laravelSession) {
      console.error("laravel_session not found in cookies");
      return NextResponse.json({ error: "Failed to obtain session" }, { status: 502 });
    }

    // Step 2: Submit the subscription with the CSRF token
    const formData = new FormData();
    formData.append("email", email);
    formData.append("consent", "1");

    const subscribeResponse = await fetch("https://k-monitor.hu/email_subscribe", {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; voksmonitor.hu)",
        "X-XSRF-TOKEN": xsrfToken,
        Cookie: `XSRF-TOKEN=${encodeURIComponent(xsrfToken)}; laravel_session=${encodeURIComponent(laravelSession)}`,
      },
      body: formData,
    });

    if (!subscribeResponse.ok) {
      console.error("Subscription failed:", subscribeResponse.status, await subscribeResponse.text());
      return NextResponse.json({ error: "Subscription failed" }, { status: subscribeResponse.status });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
