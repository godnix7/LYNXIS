import Anthropic from '@anthropic-ai/sdk';
// In a real app, you'd import OpenAI or Gemini SDKs here too.

export const generateAIResponse = async (prompt: string, model: string, keys: any) => {
  const apiKey = keys[model];
  
  if (!apiKey) {
    throw new Error(`API key for ${model} is missing. Please add it in Settings.`);
  }

  if (model === 'anthropic') {
    const anthropic = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    return message.content[0].type === 'text' ? message.content[0].text : '';
  }

  // Placeholder for other models
  if (model === 'openai') {
    return "OpenAI integration coming soon. For now, please use Anthropic.";
  }

  if (model === 'gemini') {
    return "Gemini integration coming soon. For now, please use Anthropic.";
  }

  throw new Error(`Model ${model} is not supported yet.`);
};
