import { generateAIResponse } from './aiService';

export interface Finding {
  id: string;
  type: 'Security' | 'Logic' | 'Style';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  resolved: boolean;
}

export const scanRepository = async (
  files: { name: string; content: string }[], 
  model: string, 
  keys: any
): Promise<Finding[]> => {
  let allFindings: Finding[] = [];

  for (const file of files) {
    try {
      const prompt = `Analyze code for security, logic, and style issues: ${file.content}`;
      const response = await generateAIResponse(prompt, model, keys);
      // Parsing logic here (simplified for this example)
      console.log(`Response for ${file.name}:`, response);
    } catch (error) {
      console.error(`Failed to scan file: ${file.name}`, error);
    }
  }

  return allFindings;
};
