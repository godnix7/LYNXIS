import Anthropic from '@anthropic-ai/sdk';

export const getAnthropicClient = () => {
  const savedKeys = localStorage.getItem('lynxis_ai_keys');
  let key = import.meta.env.VITE_ANTHROPIC_API_KEY;
  
  if (savedKeys) {
    const keys = JSON.parse(savedKeys);
    if (keys.anthropic) key = keys.anthropic;
  }

  if (!key || key === 'your_api_key_here') {
    throw new Error('Anthropic API key is missing. Please add it in Settings.');
  }

  return new Anthropic({
    apiKey: key,
    dangerouslyAllowBrowser: true,
  });
};

export const analyzeCode = async (code: string, fileName: string) => {
  const prompt = `
    You are an expert security and code quality auditor. Analyze the following code from file "${fileName}".
    Identify specific issues related to:
    1. Security (vulnerabilities, hardcoded secrets, etc.)
    2. Logic (bugs, reachable vs unreachable code)
    3. Style (inconsistent naming, best practices)
    
    Return the findings in a JSON array format where each finding has:
    - id: string (unique)
    - type: 'Security' | 'Logic' | 'Style'
    - severity: 'critical' | 'high' | 'medium' | 'low'
    - title: string (short)
    - description: string (detailed)
    - resolved: false

    Code:
    \`\`\`
    ${code}
    \`\`\`

    IMPORTANT: Return ONLY the JSON array. Do not include any other text.
  `;

  try {
    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: prompt }
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    // Try to parse JSON from the response
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    throw error;
  }
};
