import { analyzeCode } from './anthropic';

export interface Finding {
  id: string;
  type: 'Security' | 'Logic' | 'Style';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  resolved: boolean;
}

export const scanRepository = async (files: { name: string; content: string }[]): Promise<Finding[]> => {
  let allFindings: Finding[] = [];

  for (const file of files) {
    try {
      const findings = await analyzeCode(file.content, file.name);
      allFindings = [...allFindings, ...findings];
    } catch (error) {
      console.error(`Failed to scan file: ${file.name}`, error);
    }
  }

  return allFindings;
};
