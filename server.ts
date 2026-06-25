import express from "express";
import path from "path";
import os from "os";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// --- AI Provider Initialization ---
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
}

const hasOpenRouter = !!process.env.OPENROUTER_API_KEY;

// --- Shared analysis prompt ---
const ANALYSIS_PROMPT = `
Analyze this outfit portrait of a person. Identify the primary upper garment (e.g., shirt, blazer, t-shirt, jacket, coat, sweater) and the lower garment (e.g., trousers, jeans, chinos, joggers, pants).
Identify the single most dominant, representative solid color of the upper garment and lower garment, ignoring skin, hair, face, background, walls, shoes, belts, phones, accessories, and shadows.

Provide the colors in hexadecimal format (e.g. #800020) and convert them to sophisticated, luxury fashion color names (e.g., 'Rich Burgundy' instead of 'Dark Red', 'Stone Beige' instead of 'Light Gray', 'Canyon Clay' instead of 'Terracotta', 'Forest Green' instead of 'Dark Green', 'Desert Sand' instead of 'Beige').

Based on these colors, suggest 5 matching, premium color combinations that look professional for lookbooks. Each suggestion should include:
- A title like "Burgundy + Cream" or "Burgundy + Charcoal"
- A short design description of why this looks good and of a luxury styling tip
- HEX color for the suggested upper garment
- HEX color for the suggested lower garment
- Sophisticated names for those suggested colors

Format your response strictly as JSON with this schema:
{
  "upperGarment": {
    "type": "shirt | blazer | jacket | sweater | etc",
    "colorName": "Fashion Color Name (e.g. Rich Burgundy)",
    "hex": "#800020",
    "rgb": "rgb(128, 0, 32)"
  },
  "lowerGarment": {
    "type": "jeans | trousers | chinos | pants | etc",
    "colorName": "Fashion Color Name (e.g. Stone Beige)",
    "hex": "#C2B280",
    "rgb": "rgb(194, 178, 128)"
  },
  "matchingRecommendations": [
    {
      "name": "E.g., Burgundy + Charcoal",
      "description": "E.g., A highly sophisticated combination suitable for autumn soir\u00e9es.",
      "upperHex": "#800020",
      "lowerHex": "#36454F",
      "upperName": "Rich Burgundy",
      "lowerName": "Slate Charcoal"
    }
  ]
}
`;

// --- Gemini analysis ---
async function analyzeWithGemini(imageBase64: string, mimeType: string): Promise<any> {
  if (!ai) throw new Error("Gemini API not configured");

  const imagePart = {
    inlineData: {
      mimeType: mimeType || "image/jpeg",
      data: imageBase64,
    },
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [imagePart, { text: ANALYSIS_PROMPT }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["upperGarment", "lowerGarment", "matchingRecommendations"],
        properties: {
          upperGarment: {
            type: Type.OBJECT,
            required: ["type", "colorName", "hex", "rgb"],
            properties: {
              type: { type: Type.STRING },
              colorName: { type: Type.STRING },
              hex: { type: Type.STRING },
              rgb: { type: Type.STRING },
            },
          },
          lowerGarment: {
            type: Type.OBJECT,
            required: ["type", "colorName", "hex", "rgb"],
            properties: {
              type: { type: Type.STRING },
              colorName: { type: Type.STRING },
              hex: { type: Type.STRING },
              rgb: { type: Type.STRING },
            },
          },
          matchingRecommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ["name", "description", "upperHex", "lowerHex", "upperName", "lowerName"],
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                upperHex: { type: Type.STRING },
                lowerHex: { type: Type.STRING },
                upperName: { type: Type.STRING },
                lowerName: { type: Type.STRING },
              },
            },
          },
        },
      },
    },
  });

  const resultText = response.text?.trim() || "{}";
  return JSON.parse(resultText);
}

// --- OpenRouter analysis ---
async function analyzeWithOpenRouter(imageBase64: string, mimeType: string): Promise<any> {
  if (!process.env.OPENROUTER_API_KEY) throw new Error("OpenRouter API not configured");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "http://localhost:3000",
      "X-OpenRouter-Title": "Lookbook Studio",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional fashion color expert. Analyze outfit images and return accurate garment color data as JSON. Return only valid JSON matching the requested schema, no markdown, no explanation.",
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${imageBase64}` },
            },
            {
              type: "text",
              text: ANALYSIS_PROMPT,
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`OpenRouter API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  return JSON.parse(content);
}

// --- API Routes ---

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", gemini: !!ai, openrouter: hasOpenRouter });
});

app.get("/api/providers", (_req, res) => {
  res.json({
    gemini: !!ai,
    openrouter: hasOpenRouter,
    local: true,
  });
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { imageBase64, mimeType, provider } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: "Missing image data" });
      return;
    }

    // If user explicitly chose local detection, skip server-side analysis
    if (provider === "local") {
      res.status(400).json({ error: "local", message: "Using local pixel-sampling detection" });
      return;
    }

    // Provider routing
    if (provider === "gemini") {
      if (!ai) {
        res.status(500).json({ error: "Gemini API key not configured. Set GEMINI_API_KEY in your .env file." });
        return;
      }
      const result = await analyzeWithGemini(imageBase64, mimeType || "image/jpeg");
      res.json(result);
      return;
    }

    if (provider === "openrouter") {
      if (!hasOpenRouter) {
        res.status(500).json({ error: "OpenRouter API key not configured. Set OPENROUTER_API_KEY in your .env file." });
        return;
      }
      const result = await analyzeWithOpenRouter(imageBase64, mimeType || "image/jpeg");
      res.json(result);
      return;
    }

    // Auto-detect: try Gemini first, then OpenRouter
    if (ai) {
      const result = await analyzeWithGemini(imageBase64, mimeType || "image/jpeg");
      res.json(result);
      return;
    }

    if (hasOpenRouter) {
      const result = await analyzeWithOpenRouter(imageBase64, mimeType || "image/jpeg");
      res.json(result);
      return;
    }

    // No provider available — client will fall back to pixel sampling
    res.status(400).json({ error: "local", message: "No AI provider configured. Using local detection." });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to analyze outfit image" });
  }
});

// --- Server Startup ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    const isDev = process.env.NODE_ENV !== "production";
    let networkUrl = "";
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === "IPv4" && !iface.internal) {
          networkUrl = `http://${iface.address}:${PORT}`;
          break;
        }
      }
      if (networkUrl) break;
    }

    const providers = [];
    if (ai) providers.push("Gemini");
    if (hasOpenRouter) providers.push("OpenRouter");
    if (providers.length === 0) providers.push("Local (pixel sampling)");

    console.log("");
    console.log("  \x1b[32m\u2713\x1b[0m Lookbook Studio Development Server Started");
    console.log("");
    console.log(`  Local:    http://localhost:${PORT}`);
    if (networkUrl) console.log(`  Network:  ${networkUrl}`);
    console.log("");
    console.log(`  Environment: ${isDev ? "Development" : "Production"}`);
    console.log(`  AI Provider: ${providers.join(", ")}`);
    console.log(`  Status:      Running`);
    console.log("");
  });
}

startServer();
