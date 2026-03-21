export async function getReviewFromOllama(prompt: string) {
  const baseUrl = process.env.OLLAMA_API_BASE_URL || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'llama3';

  console.log(`🔄 [OLLAMA_CONNECT] Sending request to ${baseUrl}/api/generate (Model: ${model})...`);
  const startTime = Date.now();

  try {
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [OLLAMA_HTTP_ERROR] Status: ${response.status} - ${errorText}`);
        throw new Error(`Ollama API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log(`⏱️  [OLLAMA_COMPLETE] Response received in ${duration} seconds.`);
    console.log(`📊 [OLLAMA_PREVIEW] ${data.response.substring(0, 120).replace(/\n/g, ' ')}...`);
    
    return data.response;
  } catch (error: any) {
    console.error(`❌ [OLLAMA_SERVICE_ERROR] ${error.message}`);
    throw new Error(`Failed to get review from Ollama: ${error.message}`);
  }
}
