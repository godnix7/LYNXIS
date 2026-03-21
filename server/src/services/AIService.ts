import { getReviewFromOllama } from './ollamaClient';
import { getReviewFromClaude } from './claudeClient';

export function buildReviewerPrompt(diff: string): string {
  return `You are LynxisAI, an expert senior full-stack architect and security researcher.
Your mission is to perform a rigorous code review on the following PR diff.

---
CODE DIFF:
${diff}
---

INSTRUCTIONS:
1.  **Analyze** the diff for code quality, architectural integrity, and security vulnerabilities.
2.  **Be Critical but Constructive.** Focus on identifying logic flaws, performance bottlenecks, and "code smells".
3.  **Security Focus:** Specifically look for injection risks, insecure dependencies, and auth bypasses.
4.  **Language:** Respond in clear, professional English.

**OUTPUT FORMAT:**
You must return your response in the following structured JSON format:
{
  "summary": "Full Markdown summary of the review (Summary, Security, Code Quality, Best Practices sections)",
  "findings": [
    {
      "id": "unique-id",
      "file_path": "path/to/file",
      "line_number": 123,
      "severity": "critical", 
      "category": "security",
      "body": "Detailed description of the issue",
      "suggestion": "Optional code suggestion to fix the issue",
      "resolved": false
    }
  ]
}

IMPORTANT: Return ONLY the raw JSON. Do not include any other text or markdown code blocks (unless inside the JSON strings).`;
}

export async function getAIReviewForDiff(diff: string) {
  const provider = process.env.AI_PROVIDER || 'ollama';
  const prompt = buildReviewerPrompt(diff);

  console.log('\n==================================================');
  console.log(`🚀 [AI SCAN TRIGGERED]`);
  console.log(`🤖 Target Provider: ${provider.toUpperCase()}`);
  console.log(`📏 Diff Size: ${diff.length} characters`);
  console.log('==================================================\n');

  try {
    let result;
    if (provider === 'claude') {
      result = await getReviewFromClaude(prompt);
      console.log(`\n✅ [CLAUDE_SUCCESS] Generated ${result.length} characters of review data.`);
    } else {
      // Default to Ollama for local/testing
      result = await getReviewFromOllama(prompt);
      console.log(`\n✅ [OLLAMA_SUCCESS] Generated ${result.length} characters of review data.`);
    }
    return result;
  } catch (error: any) {
    console.warn(`\n❌ [AI_PROVIDER_FAILED] ${provider.toUpperCase()}`);
    console.warn(`Reason: ${error.message}`);
    console.warn(`Reverting to SIMULATION MODE...\n`);
    return JSON.stringify({
      summary: "## 🛡️ Security Confidence: 85%\n\nThis is a simulated AI review because the local AI provider (Ollama/Claude) is not reachable. This confirms the end-to-end data pipeline is functional.",
      findings: [
        {
          id: `sim-${Date.now()}-1`,
          file_path: "src/auth.ts",
          line_number: 12,
          severity: "critical",
          category: "security",
          body: "SIMULATED: Potential SQL injection in user lookup.",
          suggestion: "Use parameterized queries: prisma.user.findUnique({ where: { id } })",
          resolved: false
        },
        {
          id: `sim-${Date.now()}-2`,
          file_path: "src/api.ts",
          line_number: 45,
          severity: "warning",
          category: "bug",
          body: "SIMULATED: Unhandled promise rejection in async handler.",
          suggestion: "Wrap the logic in a try-catch block.",
          resolved: false
        }
      ]
    });
  }
}
