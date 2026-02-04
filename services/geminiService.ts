
import { ToolType, GenerationInput } from "../types.ts";

export const generateMarketingCopy = async (
  toolType: ToolType,
  inputs: GenerationInput
): Promise<any> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toolType,
        inputs,
        uid: 'user-id-placeholder'
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Generation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.output;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error("Gemini Service Error:", error);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. The model is taking too long to respond.');
    }
    throw error;
  }
};

export const refineAsset = async (
  toolType: ToolType,
  previousResult: any,
  refinementPrompt: string,
  originalInputs: GenerationInput
): Promise<any> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toolType,
        inputs: { ...originalInputs, refinementPrompt },
        previousResult,
        uid: 'user-id-placeholder'
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
       const errorData = await response.json().catch(() => ({}));
       throw new Error(errorData.error || 'Refinement failed');
    }
    const data = await response.json();
    return data.output;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error("Refine Service Error:", error);
    if (error.name === 'AbortError') {
      throw new Error('Refinement timed out.');
    }
    throw error;
  }
};
