export async function getReviewFromClaude(prompt: string) {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error('CLAUDE_API_KEY is not configured in environment variables.');
  }

  try {
    // Anthropic API implementation
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Claude API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error: any) {
    console.error('Claude Service Error:', error);
    throw new Error(`Failed to get review from Claude: ${error.message}`);
  }
}
