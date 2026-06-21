/**
 * ask-gustavo — Cloudflare Worker proxy for the portfolio AI terminal.
 *
 * Keeps the Groq API key server-side (never in the browser) and streams chat
 * completions back to the static site. The system prompt and profile are built
 * here so the model can only answer about Gustavo and the client can't override
 * the guardrails.
 *
 * Secrets / vars:
 *   GROQ_API_KEY   (secret)  -> wrangler secret put GROQ_API_KEY
 *   ALLOWED_ORIGIN (var)     -> e.g. https://guhcostan.github.io
 */

const MODEL = "llama-3.3-70b-versatile";
const MAX_TURNS = 12; // cap conversation history
const MAX_CHARS = 1500; // cap each message length

const PROFILE = `
Name: Gustavo Costa
Headline: Lead Mobile & Frontend Engineer · React Native · TypeScript · AI-Powered Features & Agents · Tech Anchor @ Thoughtworks
Location: São Sebastião, São Paulo, Brazil
Contact: guhcostan@gmail.com · linkedin.com/in/guhcostan · github.com/guhcostan
Languages: Portuguese (native), English (professional), Spanish (professional)

Summary:
- 8+ years building apps used by millions, across airline loyalty, EdTech and fintech.
- Tech Anchor at Thoughtworks steering a global-scale React Native product (Brazil & Chile).
- Since late 2024 focused on AI-assisted engineering: LLM-powered features and autonomous agents in production, hands-on with Claude and Cursor.
- Open source: mac-cleaner-cli has 1.5k+ stars on GitHub.

Experience:
- Thoughtworks — Tech Anchor (Dec 2024–present): technical direction of the LatamPass mobile app; leads AI-assisted engineering.
- Thoughtworks — Technical Lead (Apr 2023–present): led 8+ engineers across Brazil & Chile; defined architecture, standards and CI/CD; test coverage to 80%+ via TDD; cut CI/CD runtime ~35% (Bitrise + Jenkins).
- Thoughtworks — Mobile Engineer (May 2022–Jul 2023): core React Native features for iOS/Android serving millions; Clean Code/TDD; Firebase Crashlytics.
- RecargaPay — Mobile Developer (Jan–May 2022): fintech app, 18,000+ concurrent users.
- Descomplica — Mobile Developer (Feb 2021–Jan 2022): EdTech app from scratch; React Native, TypeScript, GraphQL, Node.js.
- Equal (Aug 2019–Feb 2021): web & mobile financial platform; React Native, React.js, TypeScript, Node.js, Java.
- LEMAF (Feb 2018–Aug 2019): web developer & architect for government environmental platforms (SICAR/PA, SIGERH-PA); .NET Core, Spring, Node.js, React.js, Vue.js.
- Comp Júnior (Nov 2017–Jan 2018): trainee developer.

Skills: React Native, iOS, Android, React, Next.js, TypeScript, Node.js, GraphQL, Firebase, CI/CD, Bitrise, Jenkins, LLM integration, AI agents, Claude, Cursor, TDD, Clean Architecture, Agile/XP.
Certifications: DevOps Essentials (DEPCP), Scrum Foundations (SFPC), Software Architecture Fundamentals, Self-Leadership, Active Listening.
Education: BSc Computer Science, Federal University of Lavras (UFLA), 2015–2019.
`.trim();

function systemPrompt() {
  return [
    "You are an AI assistant embedded in the terminal of Gustavo Costa's portfolio website.",
    "Answer questions about Gustavo using the PROFILE below as your source of truth.",
    "Be concise, friendly and a little playful, like a helpful CLI agent. Short paragraphs or tight bullet lists, no markdown headings.",
    "If a question is unrelated to Gustavo, say you're here to talk about Gustavo.",
    "If something isn't in the profile, say you don't have that detail instead of inventing it.",
    "Reply in the same language the user writes in (Portuguese or English). Keep answers under ~120 words unless asked for more.",
    "",
    "=== PROFILE ===",
    PROFILE,
    "=== END PROFILE ===",
  ].join("\n");
}

function corsHeaders(origin, allowed) {
  const allowOrigin = !allowed || allowed === "*" ? "*" : allowed;
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin, env.ALLOWED_ORIGIN);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: cors });
    }
    if (!env.GROQ_API_KEY) {
      return new Response("Server not configured: missing GROQ_API_KEY", {
        status: 500,
        headers: cors,
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400, headers: cors });
    }

    const incoming = Array.isArray(body?.messages) ? body.messages : [];
    // Sanitize: drop client-provided system messages, cap turns and length.
    const turns = incoming
      .filter((m) => m && (m.role === "user" || m.role === "assistant"))
      .slice(-MAX_TURNS)
      .map((m) => ({
        role: m.role,
        content: String(m.content ?? "").slice(0, MAX_CHARS),
      }));

    const messages = [{ role: "system", content: systemPrompt() }, ...turns];

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages,
          stream: true,
          temperature: 0.4,
          max_tokens: 600,
        }),
      }
    );

    if (!groqRes.ok || !groqRes.body) {
      const detail = await groqRes.text().catch(() => "");
      return new Response(`Groq error ${groqRes.status}: ${detail}`, {
        status: 502,
        headers: cors,
      });
    }

    // Pipe Groq's SSE stream straight through to the browser.
    return new Response(groqRes.body, {
      headers: {
        ...cors,
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  },
};
