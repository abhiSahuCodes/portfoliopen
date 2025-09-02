import { post, get } from "./client";

// Enhance text content using AI
export const apiEnhanceText = async (text, type = "description") => {
  return post("/api/ai/enhance", { text, type });
};

// Generate skills based on prompt
export const apiGenerateSkills = async (prompt, existingSkills = []) => {
  return post("/api/ai/skills", { prompt, existingSkills });
};

// Check AI service status
export const apiGetAIStatus = async () => {
  return get("/api/ai/status");
};
