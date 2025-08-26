const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    this._modelChecked = false;
    this._availableModels = null;

    if (!this.apiKey) {
      console.warn(
        "⚠️  Gemini API key not configured. AI features will be disabled."
      );
      this.genAI = null;
      this.model = null;
    } else {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: this.modelName });
    }
  }

  // Discover available models for this API key (cached)
  async listModels(force = false) {
    if (this._availableModels && !force) return this._availableModels;
    if (!this.genAI) return [];

    try {
      const models = await this.genAI.listModels();
      const modelNames = models.map((model) =>
        model.name.replace("models/", "")
      );
      this._availableModels = modelNames;
      return modelNames;
    } catch (e) {
      console.error("Failed to list models:", e.message);
      // If listing fails, don't block normal usage; return empty
      return [];
    }
  }

  // Ensure we pick a model that is actually available
  async ensureModelAvailability() {
    if (this._modelChecked) return this.model;
    this._modelChecked = true;

    const preferred = [
      this.model,
      
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b",
      "gemini-1.5-pro",
      "gemini-1.0-pro",
    ];

    const available = await this.listModels();
    if (!available.length) return this.model; // fallback to configured default

    const found = preferred.find((m) => available.includes(m));
    if (found) this.model = found;
    return this.model;
  }

  async makeRequest(prompt, maxTokens = 500) {
    if (!this.model) {
      const err = new Error("Gemini API key not configured");
      err.status = 500;
      err.code = "CONFIG_MISSING";
      throw err;
    }

    try {
      // Ensure selected model is available (first call only)
      await this.ensureModelAvailability();

      const generationConfig = {
        maxOutputTokens: maxTokens,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      };

      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
      });

      const response = await result.response;
      const content = response.text();

      if (!content || content.trim().length === 0) {
        const err = new Error("AI service returned empty content");
        err.status = 502;
        err.code = "EMPTY_CONTENT";
        throw err;
      }

      return content.trim();
    } catch (error) {
      console.error("Gemini API Error:", error.message);

      // Normalize errors
      let status = 500;
      let code = "AI_PROVIDER_ERROR";
      let message = "Failed to generate AI content. Please try again.";

      if (error.message.includes("API_KEY_INVALID")) {
        status = 401;
        code = "PROVIDER_UNAUTHORIZED";
        message = "AI provider authentication failed. Please check API key.";
      } else if (error.message.includes("RATE_LIMIT_EXCEEDED")) {
        status = 429;
        code = "RATE_LIMITED";
        message = "AI provider rate limit reached. Please wait and try again.";
      } else if (error.message.includes("SAFETY")) {
        status = 400;
        code = "CONTENT_BLOCKED";
        message = "Content was blocked by safety filters";
      } else if (error.message.includes("quota")) {
        status = 402;
        code = "INSUFFICIENT_CREDITS";
        message =
          "Insufficient AI provider credits. Please add credits or try later.";
      }

      const err = new Error(message);
      err.status = status;
      err.code = code;
      throw err;
    }
  }

  // Sanitize model output and enforce word limits
  sanitizeEnhancedText(text, minWords = 40, maxWords = 80) {
    if (!text) return "";

    // Strip code fences and quotes
    let cleaned = String(text)
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/^\s*"|"\s*$/g, "")
      .replace(/^\s*'|'\s*$/g, "")
      .replace(/^[\s\S]*?(?=\w)/, "") // remove any leading non-word chars/meta
      .replace(/Guidelines:?[\s\S]*/i, "") // drop guideline blocks if echoed
      .replace(/^(?:The user wants|User input|Instruction|Task):?[\s\S]*/i, "");

    // Remove list markers and excessive newlines
    cleaned = cleaned
      .split(/\r?\n/)
      .filter((line) => !/^(\s*[-*\d+\.])/i.test(line.trim()))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    // Enforce word limits
    const words = cleaned.split(/\s+/).filter(Boolean);
    if (words.length > maxWords) {
      cleaned = words.slice(0, maxWords).join(" ");
      if (!/[.!?]$/.test(cleaned)) cleaned += ".";
      return cleaned;
    }

    if (words.length < minWords) {
      const pads = [
        " I focus on clarity, usability, and performance to deliver reliable results.",
        " I prioritize accessibility, responsive design, and clean, maintainable code.",
        " My work balances technical rigor with thoughtful user experience and collaboration.",
      ];
      let i = 0;
      while (cleaned.split(/\s+/).length < minWords && i < pads.length) {
        cleaned += pads[i++];
      }
      const finalWords = cleaned.split(/\s+/).filter(Boolean);
      if (finalWords.length > maxWords) {
        cleaned = finalWords.slice(0, maxWords).join(" ");
        if (!/[.!?]$/.test(cleaned)) cleaned += ".";
      }
    }

    if (!/[.!?]$/.test(cleaned)) cleaned += ".";
    return cleaned;
  }

  async enhanceDescription(userInput, context = "portfolio description") {
    const prompt = `You are a professional portfolio content writer. Transform user input into a polished, engaging, and professional ${context}.

Strict output rules:
- Length: 40 to 80 words
- Output a single paragraph only
- Return ONLY the enhanced text (no quotes, no JSON, no bullets, no explanations)
- Keep the original meaning and tone
- Use active voice, concise but impactful language
- Improve clarity and flow; correct grammar and spelling

Enhance this ${context}: ${userInput}`;

    const raw = await this.makeRequest(prompt, 350);
    return this.sanitizeEnhancedText(raw, 40, 80);
  }

  // Development fallback for enhancement to avoid blocking UI when provider is unavailable
  generateDevFallbackEnhanced(userInput, context = "portfolio description") {
    const input = (userInput || "").toString().trim();
    if (!input) return "";

    const role = input
      .replace(/\s+/g, " ")
      .trim()
      .replace(/(^|[\s-])([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());

    let draft = `I am a ${role} crafting responsive, accessible, and performant experiences. I translate ideas into clean, maintainable interfaces and collaborate closely to ship reliable features. I emphasize clarity, usability, and modern best practices to deliver results that feel fast, consistent, and user-focused across devices.`;

    return this.sanitizeEnhancedText(draft, 40, 80);
  }

  async generateSkills(prompt, existingSkills = []) {
    const skillsPrompt = `You are a skills recommendation expert. Based on a user's prompt or description, suggest relevant professional skills.

Guidelines:
- Return a JSON array of skill names only
- Include 5-8 relevant skills
- Focus on current, in-demand skills
- Avoid duplicating existing skills
- Skills should be specific and professional
- Format: ["skill1", "skill2", "skill3", ...]
- Return only the JSON array, no explanations

Generate skills based on this prompt: "${prompt}"
${
  existingSkills.length > 0
    ? `Existing skills to avoid duplicating: ${existingSkills.join(", ")}`
    : ""
}`;

    try {
      const response = await this.makeRequest(skillsPrompt, 200);
      // Extract a JSON array from the response
      let text = response.trim();
      const match = text.match(/\[[\s\S]*\]/);
      if (match) text = match[0];
      const skills = JSON.parse(text);
      return Array.isArray(skills) ? skills : [];
    } catch (error) {
      console.error("Error parsing skills response:", error);
      return this.getFallbackSkills(prompt);
    }
  }

  getFallbackSkills(prompt) {
    const fallbackSkills = {
      frontend: ["HTML", "CSS", "JavaScript", "React", "Vue.js", "TypeScript"],
      backend: [
        "Node.js",
        "Python",
        "Express.js",
        "MongoDB",
        "PostgreSQL",
        "REST APIs",
      ],
      design: [
        "Figma",
        "Adobe Photoshop",
        "UI/UX Design",
        "Wireframing",
        "Prototyping",
      ],
      mobile: [
        "React Native",
        "Flutter",
        "iOS Development",
        "Android Development",
      ],
      data: [
        "Python",
        "SQL",
        "Data Analysis",
        "Machine Learning",
        "Pandas",
        "NumPy",
      ],
      devops: ["Docker", "AWS", "CI/CD", "Kubernetes", "Linux", "Git"],
    };

    const lowerPrompt = prompt.toLowerCase();
    for (const [key, skills] of Object.entries(fallbackSkills)) {
      if (lowerPrompt.includes(key)) {
        return skills.slice(0, 6);
      }
    }

    return [
      "Communication",
      "Problem Solving",
      "Teamwork",
      "Leadership",
      "Time Management",
    ];
  }

  async enhanceProjectDescription(userInput) {
    return await this.enhanceDescription(userInput, "project description");
  }

  async enhanceAboutMe(userInput) {
    return await this.enhanceDescription(userInput, "about me section");
  }
}

module.exports = AIService;
