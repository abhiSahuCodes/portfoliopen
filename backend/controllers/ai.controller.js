const AIService = require('../services/aiService');
const User = require('../models/User');

// Lazy-load AIService to ensure environment variables are loaded
const getAIService = () => {
  if (!getAIService._instance) {
    getAIService._instance = new AIService();
  }
  return getAIService._instance;
};

// Middleware to check if user is pro
const requirePro = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.subscription !== 'pro') {
      return res.status(403).json({ success: false, message: 'Pro subscription required for AI features' });
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Enhance text content based on a prompt using AI
const enhance = async (req, res) => {
  try {
    const { text, type = 'description' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Text content is required' });
    }

    if (text.length > 1000) {
      return res.status(400).json({ success: false, message: 'Text content is too long (max 1000 characters)' });
    }

    let enhancedText;
    switch (type) {
      case 'about':
        enhancedText = await getAIService().enhanceAboutMe(text);
        break;
      case 'project':
        enhancedText = await getAIService().enhanceProjectDescription(text);
        break;
      default:
        enhancedText = await getAIService().enhanceDescription(text);
    }

    return res.json({
      success: true,
      data: { original: text, enhanced: enhancedText }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production' && (error.code === 'INSUFFICIENT_CREDITS' || error.status === 402)) {
      const { text } = req.body;
      const fallback = getAIService().generateDevFallbackEnhanced(text);
      return res.status(200).json({ success: true, data: { original: text, enhanced: fallback, fallback: true } });
    }

    const status = error.status || 500;
    const message = error.message || 'Failed to enhance content';
    return res.status(status).json({ success: false, code: error.code || 'AI_ERROR', message });
  }
};

// Generate skills based on a prompt using AI
const skills = async (req, res) => {
  try {
    const { prompt, existingSkills = [] } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    if (prompt.length > 200) {
      return res.status(400).json({ success: false, message: 'Prompt is too long (max 200 characters)' });
    }

    const skills = await getAIService().generateSkills(prompt, existingSkills);

    res.json({ success: true, data: { prompt, skills, count: skills.length } });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || 'Failed to generate skills';
    res.status(status).json({ success: false, code: error.code || 'AI_ERROR', message });
  }
};

// Check AI status
const status = async (req, res) => {
  try {
    const svc = getAIService();
    const isConfigured = !!process.env.GEMINI_API_KEY;
    let available = [];
    try {
      available = await svc.listModels();
    } catch (_) {}

    res.json({
      success: true,
      data: {
        configured: isConfigured,
        provider: 'gemini',
        model: svc.model,
        availableModels: available,
        features: ['text_enhancement', 'skill_generation']
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to check AI status' });
  }
};

module.exports = { requirePro, enhance, skills, status };