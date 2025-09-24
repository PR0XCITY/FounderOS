import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not configured. Please add it to your environment variables.');
}

const ai = new GoogleGenAI({ apiKey });

export interface IdeaValidationResult {
  validation_score: number;
  market_size: string;
  competition_level: string;
  demand_indicators: string[];
  risk_factors: string[];
  opportunities: string[];
  recommendations: string[];
}

export async function validateStartupIdea(
  title: string,
  description: string,
  problem_statement: string,
  solution_approach: string,
  target_market: string
): Promise<IdeaValidationResult> {
  try {
    const prompt = `Analyze this startup idea and provide a comprehensive validation:

Title: ${title}
Description: ${description}
Problem Statement: ${problem_statement}
Solution Approach: ${solution_approach}
Target Market: ${target_market}

Please analyze and provide:
1. A validation score (0-100) based on market potential, solution fit, and feasibility
2. Estimated market size (e.g., "$2.5B", "$500M")
3. Competition level (Low, Medium, High)
4. 3-5 demand indicators showing market need
5. 2-4 key risk factors
6. 3-5 market opportunities
7. 3-4 actionable recommendations

Respond with JSON in this exact format:
{
  "validation_score": number,
  "market_size": "string",
  "competition_level": "string",
  "demand_indicators": ["string1", "string2", "string3"],
  "risk_factors": ["string1", "string2"],
  "opportunities": ["string1", "string2", "string3"],
  "recommendations": ["string1", "string2", "string3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            validation_score: { type: "number" },
            market_size: { type: "string" },
            competition_level: { type: "string" },
            demand_indicators: { type: "array", items: { type: "string" } },
            risk_factors: { type: "array", items: { type: "string" } },
            opportunities: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
          },
          required: [
            "validation_score",
            "market_size", 
            "competition_level",
            "demand_indicators",
            "risk_factors",
            "opportunities",
            "recommendations"
          ],
        },
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("Failed to validate startup idea:", error);
    // Provide more specific error messages for better debugging
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid API key. Please check your Gemini API key configuration.');
      } else if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please check your Gemini API usage limits.');
      }
    }
    throw new Error("Failed to validate startup idea with AI. Please try again.");
  }
}

export interface MVPGenerationResult {
  wireframes: Array<{ name: string; description: string; features: string[] }>;
  code_structure: string;
  tech_recommendations: string[];
  development_timeline: string;
  estimated_cost: string;
  key_features: string[];
}

export async function generateMVP(
  name: string,
  description: string,
  features: string[],
  tech_stack: string[],
  custom_requirements: string
): Promise<MVPGenerationResult> {
  try {
    const prompt = `Generate a comprehensive MVP plan for this project:

Name: ${name}
Description: ${description}
Desired Features: ${features.join(", ")}
Tech Stack: ${tech_stack.join(", ")}
Custom Requirements: ${custom_requirements}

Please generate:
1. 3-5 wireframe descriptions with specific features for each screen
2. Code structure and architecture recommendations
3. Technology stack recommendations and reasoning
4. Development timeline estimate
5. Estimated development cost range
6. Prioritized key features for MVP

Respond with JSON in this exact format:
{
  "wireframes": [
    {
      "name": "string",
      "description": "string", 
      "features": ["string1", "string2"]
    }
  ],
  "code_structure": "string",
  "tech_recommendations": ["string1", "string2"],
  "development_timeline": "string",
  "estimated_cost": "string",
  "key_features": ["string1", "string2", "string3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            wireframes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  features: { type: "array", items: { type: "string" } }
                },
                required: ["name", "description", "features"]
              }
            },
            code_structure: { type: "string" },
            tech_recommendations: { type: "array", items: { type: "string" } },
            development_timeline: { type: "string" },
            estimated_cost: { type: "string" },
            key_features: { type: "array", items: { type: "string" } },
          },
          required: [
            "wireframes",
            "code_structure",
            "tech_recommendations", 
            "development_timeline",
            "estimated_cost",
            "key_features"
          ],
        },
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("Failed to generate MVP:", error);
    // Provide more specific error messages for better debugging
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid API key. Please check your Gemini API key configuration.');
      } else if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please check your Gemini API usage limits.');
      }
    }
    throw new Error("Failed to generate MVP with AI. Please try again.");
  }
}

export interface PitchDeckResult {
  slides: Array<{
    title: string;
    content: any;
  }>;
  executive_summary: string;
  key_metrics: string[];
  investment_highlights: string[];
}

export async function generatePitchDeck(data: {
  title: string;
  description: string;
  pitch_type: string;
  funding_goal: string;
  business_model: string;
  target_market: string;
  team_info: string;
  traction_metrics: string;
  competitive_advantage: string;
}): Promise<PitchDeckResult> {
  try {
    const prompt = `Generate a professional pitch deck for this startup:

Title: ${data.title}
Description: ${data.description}
Pitch Type: ${data.pitch_type}
Funding Goal: ${data.funding_goal}
Business Model: ${data.business_model}
Target Market: ${data.target_market}
Team Info: ${data.team_info}
Traction Metrics: ${data.traction_metrics}
Competitive Advantage: ${data.competitive_advantage}

Generate a complete 10-slide pitch deck with:
1. Title slide
2. Problem statement
3. Solution overview
4. Market opportunity with specific numbers
5. Business model and revenue streams
6. Traction and key metrics
7. Competition analysis
8. Team introduction
9. Financial projections
10. Funding request and use of funds

Also provide:
- Executive summary (2-3 sentences)
- Key metrics to highlight
- Investment highlights

Each slide should have a title and detailed content object with relevant data.

Respond with JSON in this exact format:
{
  "slides": [
    {
      "title": "string",
      "content": {}
    }
  ],
  "executive_summary": "string",
  "key_metrics": ["string1", "string2"],
  "investment_highlights": ["string1", "string2", "string3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            slides: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "object" }
                },
                required: ["title", "content"]
              }
            },
            executive_summary: { type: "string" },
            key_metrics: { type: "array", items: { type: "string" } },
            investment_highlights: { type: "array", items: { type: "string" } },
          },
          required: ["slides", "executive_summary", "key_metrics", "investment_highlights"],
        },
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("Failed to generate pitch deck:", error);
    // Provide more specific error messages for better debugging
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid API key. Please check your Gemini API key configuration.');
      } else if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please check your Gemini API usage limits.');
      }
    }
    throw new Error("Failed to generate pitch deck with AI. Please try again.");
  }
}