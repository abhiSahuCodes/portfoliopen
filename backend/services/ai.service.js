const OpenAI = require("openai");

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || "";
    this.modelName = "gpt-5-nano";

    if (!this.apiKey) {
      console.warn(
        "⚠️ OpenAI API key not configured. AI features will be disabled."
      );
      this.client = null;
    } else {
      this.client = new OpenAI({ apiKey: this.apiKey });
    }
  }

  async listModels() {
    if (!this.client) return [];
    try {
      const response = await this.client.models.list();
      return response.data.map((m) => m.id);
    } catch (error) {
      console.error("Failed to list models:", error.message);
      return [];
    }
  }

  // Core request handler
  async makeRequest(prompt, options = {}) {
    if (!this.client) throw new Error("AI service not initialized");

    const maxTokens = options.maxTokens || 2000;

    // Log request details
    console.log(
      `🚀 [AIService] Requesting OpenAI | Model: ${this.modelName} | Max Tokens: ${maxTokens}`
    );

    try {
      const completion = await this.client.chat.completions.create({
        model: this.modelName,
        messages: [{ role: "user", content: prompt }],
        max_completion_tokens: maxTokens,
      });

      const content = completion.choices[0]?.message?.content?.trim();

      if (!content) {
        console.error(
          "❌ AI Response was empty. Full response:",
          JSON.stringify(completion, null, 2)
        );
        throw new Error("Empty response from AI");
      }

      // Log success
      console.log(
        `✅ [AIService] Success! Received ${content.split(" ").length} words.`
      );

      return content;
    } catch (error) {
      console.error(
        `🔥 [AIService] Error with model ${this.modelName}:`,
        error.message
      );

      const errObj = new Error(error.message || "AI Request Failed");
      errObj.status = error.status || 500;
      errObj.code = error.code || "AI_ERROR";
      throw errObj;
    }
  }

  sanitizeOutput(text) {
    if (!text) return "";
    let clean = text.replace(/^["']|["']$/g, "").trim();
    const words = clean.split(/\s+/);
    if (words.length > 60) {
      clean = words.slice(0, 60).join(" ");
      if (!/[.!?]$/.test(clean)) clean += ".";
    }
    return clean;
  }

  async enhanceDescription(userInput, context = "professional summary") {
    // UPDATED PROMPT: Explicitly asks for First Person
    const prompt = `You are a professional portfolio writer crafting a personal bio. Transform the following input into a polished, professional paragraph in the First Person ("I", "me", "my").
    
Input: "${userInput}"

Requirements:
- Write strictly in the First Person (e.g., "I am a...", "My passion is...").
- Output exactly one paragraph.
- Length must be between 40 and 60 words.
- Use active, professional language.`;

    const rawText = await this.makeRequest(prompt, { maxTokens: 1500 });
    return this.sanitizeOutput(rawText);
  }

  async enhanceAboutMe(text) {
    return this.enhanceDescription(text, "about me section");
  }

  async enhanceProjectDescription(text) {
    return this.enhanceDescription(text, "project description");
  }

  // UPDATED: Smarter Prompt logic
  // UPDATED: generateSkills with higher limits and broader scope
  async generateSkills(userInput, existingSkills = []) {
    const prompt = `You are an expert career coach. Analyze the user's input and generate a strictly JSON array of 5-8 related professional skills.

Rules:
1. Output strictly a JSON array of strings. No markdown, no explanations.
2. If the input is technical (e.g., "React"), suggest complementary tech stack skills.
3. If the input is creative/artistic (e.g., "Water Color", "Photography"), suggest relevant artistic techniques, software (like Photoshop), or principles (like Color Theory).
4. Use standard naming conventions.

Examples:
Input: "Frontend" -> Output: ["HTML5", "CSS3", "JavaScript", "React.js", "TypeScript"]
Input: "Water Color" -> Output: ["Color Theory", "Wet-on-Wet", "Brush Control", "Paper Texture", "Adobe Photoshop", "Illustration"]
Input: "Management" -> Output: ["Agile", "Scrum", "JIRA", "Team Leadership", "Risk Management"]

User Input: "${userInput}"
${
  existingSkills.length
    ? `Exclude these skills: ${existingSkills.join(", ")}`
    : ""
}
Output:`;

    try {
      // 3000 to allow "reasoning" tokens + output tokens
      const rawText = await this.makeRequest(prompt, { maxTokens: 3000 });

      // Clean markdown code blocks if present
      let cleanText = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
      const jsonStr = jsonMatch ? jsonMatch[0] : cleanText;

      const skills = JSON.parse(jsonStr);
      return Array.isArray(skills) ? skills : [];
    } catch (error) {
      console.error("Error parsing skills:", error);
      // Fallback
      return ["Communication", "Problem Solving", "Teamwork", "Creativity"];
    }
  }

  generateDevFallbackEnhanced(userInput) {
    return `I am a professional specifically focused on ${userInput}. I translate ideas into clean, maintainable solutions and collaborate closely to ship reliable features. I emphasize clarity, usability, and modern best practices to deliver results that feel fast, consistent, and user-focused across all platforms.`;
  }
}

module.exports = AIService;
