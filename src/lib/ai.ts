import { DesignGenerationInput, DesignGenerationResult } from "./types";

export interface AIResponse {
  success: boolean;
  result?: DesignGenerationResult;
  error?: string;
  isKeyMissing?: boolean;
}

export async function generateFashionDesign(input: DesignGenerationInput): Promise<AIResponse> {
  const apiKey = process.env.AI_API_KEY;
  const apiUrl = process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions";
  const model = process.env.AI_MODEL || "gpt-4o";

  if (!apiKey || apiKey.trim() === "") {
    // Per specification rule: NEVER fake AI results when no API key is provided!
    return {
      success: false,
      isKeyMissing: true,
      error: "AI_API_KEY is not configured on the server. To protect integrity, fake AI results are disabled. You can manually enter your tailoring specifications or proceed with a manual sketch/notes.",
    };
  }

  const prompt = `You are a Master Haute Couture & Ready-to-Wear Fashion Designer and Technical Tailoring Consultant for the CROOKED RIB marketplace in Uzbekistan.
Analyze the following custom garment request and provide a detailed technical tailoring specification.

User input:
- Category: ${input.category}
- Gender Category: ${input.genderCategory || "Women"}
- Aesthetic Style: ${input.style}
- Season: ${input.season || "All Season"}
- Color Preferences: ${input.colors}
- Occasion: ${input.occasion || "Everyday / Formal"}
- Target Budget: ${input.budget ? `${input.budget} UZS` : "Standard"}
- Fabric Preferences: ${input.fabricPreferences || "Natural, durable or authentic regional fabrics"}
- Detailed Concept Description: ${input.description}

Respond ONLY with a valid JSON object strictly matching this schema without markdown fences:
{
  "title": "A creative title for this fashion design (e.g. Silk Atlas Evening Trench)",
  "conceptDescription": "A 2-3 paragraph vivid editorial fashion concept description highlighting cut, silhouette, drape, and aesthetic harmony.",
  "recommendedFabrics": ["Specific fabric 1 (e.g. Natural Uzbek Khan-Atlas Silk)", "Specific fabric 2 (e.g. Organic Cotton Lining)"],
  "recommendedAccessories": ["Accessory 1 (e.g. 5 Mother-of-pearl buttons)", "Accessory 2 (e.g. Invisible YKK zipper 50cm)"],
  "technicalNotes": ["Tailoring instruction 1 (e.g. Reinforce lapel with lightweight horsehair canvas)", "Tailoring instruction 2 (e.g. Double-stitched French seams for silk longevity)"],
  "suggestedColors": ["#Hex1", "#Hex2", "#Hex3"],
  "estimatedDifficulty": "MEDIUM"
}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are an expert technical fashion design engine for CROOKED RIB. Return valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      return {
        success: false,
        error: `AI Provider returned HTTP ${response.status}: ${errBody.slice(0, 200)}`,
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return { success: false, error: "Empty response received from AI service." };
    }

    const parsed: DesignGenerationResult = JSON.parse(content);
    return {
      success: true,
      result: parsed,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `AI Request execution failed: ${err.message || String(err)}`,
    };
  }
}
