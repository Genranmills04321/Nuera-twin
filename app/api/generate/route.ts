
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ToolType } from "../../../types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toolType, inputs, uid, previousResult } = body;

    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // ADS_CREATIVE moved to text generation to ensure structured copy output.
    const isImageTask = [
      ToolType.LOGO_GENERATOR, 
      ToolType.IMAGE_GENERATOR
    ].includes(toolType);

    const modelName = isImageTask ? 'gemini-2.5-flash-image' : 'gemini-3-flash-preview';

    // ---------------------------------------------------------
    // 1. IMAGE GENERATION / EDITING LOGIC
    // ---------------------------------------------------------
    if (isImageTask) {
      let parts: any[] = [];
      
      // Handle Refinement (Image-to-Image)
      if (previousResult && previousResult.image) {
        // Strip prefix if present to get raw base64
        const base64Data = previousResult.image.replace(/^data:image\/\w+;base64,/, "");
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: 'image/png'
          }
        });
        parts.push({
          text: `REFINE THIS IMAGE: ${inputs.refinementPrompt || 'Apply subtle improvements.'}. 
          CONTEXT: ${inputs.businessName} - ${inputs.niche}. 
          REQUIREMENT: Maintain high quality and brand consistency.`
        });
      } else {
        // Initial Generation Prompts
        let prompt = "";
        if (toolType === ToolType.LOGO_GENERATOR) {
          prompt = `Create a professional, vector-style logo for "${inputs.businessName}". 
          Industry: ${inputs.niche}. 
          Style: ${inputs.logoStyle || 'Minimalist'}. 
          Colors: ${inputs.logoColors || 'Black and White'}. 
          Symbols: ${inputs.logoIcons || 'Abstract geometric shapes'}. 
          Requirements: High contrast, clean lines, white background, no photorealism, no text other than the brand name.`;
        } else {
          prompt = `Generate a high-quality brand image for "${inputs.businessName}". 
          Context: ${inputs.offerDetails}. 
          Style: ${inputs.stylePreset || 'Photorealistic'}. 
          Mood: ${inputs.tone}.`;
        }
        parts.push({ text: prompt });
      }

      // Config for Image Model
      // Note: responseMimeType and responseSchema are NOT supported for gemini-2.5-flash-image
      const config: any = {
        imageConfig: {
          aspectRatio: toolType === ToolType.LOGO_GENERATOR ? "1:1" : (inputs.aspectRatio || "1:1")
        }
      };

      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts }, // Pass as a single Content object
        config
      });

      let imageData = '';
      let textContent = '';
      
      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            imageData = `data:image/png;base64,${part.inlineData.data}`;
          } else if (part.text) {
            textContent += part.text;
          }
        }
      }

      if (!imageData && !textContent) {
        throw new Error("No content generated. Please try again.");
      }

      // If refining and no new image, fallback to old one
      return NextResponse.json({ 
        output: { 
          image: imageData || (previousResult?.image), 
          description: textContent 
        } 
      });
    }

    // ---------------------------------------------------------
    // 2. TEXT GENERATION LOGIC
    // ---------------------------------------------------------
    const systemInstruction = `You are a world-class marketing strategist. Output purely valid JSON.`;
    const responseSchema = getResponseSchemaForTool(toolType);

    // Build the prompt
    let promptText = `Generate content for tool: ${toolType}. 
    Business: ${inputs.businessName} (${inputs.niche}). 
    Audience: ${inputs.audience}. 
    Tone: ${inputs.tone}. 
    Details: ${inputs.offerDetails}.`;
    
    // Handle Text Refinement
    if (inputs.refinementPrompt && previousResult) {
       promptText += `\n\nREFINE TASK: ${inputs.refinementPrompt}.
       \n\nORIGINAL JSON:\n${JSON.stringify(previousResult)}
       \n\nReturn the FULL updated JSON object.`;
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");

    const output = JSON.parse(text);
    return NextResponse.json({ output });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

function getResponseSchemaForTool(toolType: any): Schema {
  // Schema for Landing Page Builder
  if (toolType === ToolType.LANDING_PAGE) {
    return {
      type: Type.OBJECT,
      properties: {
        heroHeadline: { type: Type.STRING },
        problemDescription: { type: Type.STRING },
        solutionDescription: { type: Type.STRING },
        ctaText: { type: Type.STRING }
      },
      required: ["heroHeadline", "problemDescription", "solutionDescription", "ctaText"]
    };
  }

  // Schema for Sales Page Builder
  if (toolType === ToolType.SALES_PAGE) {
    return {
      type: Type.OBJECT,
      properties: {
        headline: { type: Type.STRING },
        subheadline: { type: Type.STRING },
        storySection: { type: Type.STRING },
        benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
        faq: { 
          type: Type.ARRAY, 
          items: { 
            type: Type.OBJECT, 
            properties: { 
              question: { type: Type.STRING }, 
              answer: { type: Type.STRING } 
            } 
          } 
        },
        cta: { type: Type.STRING }
      },
      required: ["headline", "subheadline", "storySection", "benefits", "faq", "cta"]
    };
  }

  // Schema for Agency Site Builder
  if (toolType === ToolType.AGENCY_SITE) {
    return {
       type: Type.OBJECT,
       properties: {
         sections: {
           type: Type.ARRAY,
           items: {
             type: Type.OBJECT,
             properties: {
               title: { type: Type.STRING },
               content: { type: Type.STRING }
             },
             required: ["title", "content"]
           }
         }
       }
    };
  }

  // Generic Schema
  return {
    type: Type.OBJECT,
    properties: {
      headline: { type: Type.STRING },
      content: { type: Type.STRING },
      cta: { type: Type.STRING }
    },
    required: ["headline", "content", "cta"]
  };
}
