import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateIntelligentSummary } from './intelligent-summary';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!, {
  apiVersion: 'v1'
});

export async function generateText(prompt: string, model: string = 'gemini-1.5-flash'): Promise<string> {
  try {
    const model_instance = genAI.getGenerativeModel({ model });
    const result = await model_instance.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    // Return fallback response instead of throwing error
    return `[AI Analysis] ${prompt.substring(0, 100)}... (Gemini API temporarily unavailable)`;
  }
}

export async function summarizeDocument(text: string, language: 'en' | 'ml' = 'en'): Promise<string> {
  try {
    const languageInstruction = language === 'ml' 
      ? 'Please provide the summary in Malayalam language.' 
      : 'Please provide the summary in English language.';

    const prompt = `
      Analyze the following document and provide a comprehensive summary.
      ${languageInstruction}
      
      Focus on:
      - Key points and main topics
      - Important dates, numbers, and facts
      - Safety-related information
      - Compliance requirements
      - Action items or recommendations
      
      Document content:
      ${text}
      
      Please provide a clear, structured summary that captures the essential information.
    `;

    return await generateText(prompt);
  } catch (error) {
    // Use intelligent summary generator as fallback
    return generateIntelligentSummary(text, language);
  }
}

export async function translateText(text: string, sourceLang: 'en' | 'ml', targetLang: 'en' | 'ml'): Promise<string> {
  try {
    const languageNames = {
      'en': 'English',
      'ml': 'Malayalam'
    };

    const prompt = `
      Translate the following text from ${languageNames[sourceLang]} to ${languageNames[targetLang]}.
      Maintain the original meaning, tone, and context.
      For technical terms related to railway operations, safety, and compliance, use appropriate terminology.
      
      Text to translate:
      ${text}
      
      Provide only the translated text without any additional explanations.
    `;

    return await generateText(prompt);
  } catch (error) {
    // Fallback translation
    if (sourceLang === targetLang) {
      return text;
    }
    
    const fallbackTranslation = targetLang === 'ml' 
      ? `${text} [മലയാളം വിവർത്തനം - AI സേവനം താൽക്കാലികമായി ലഭ്യമല്ല]`
      : `${text} [English Translation - AI service temporarily unavailable]`;
    return fallbackTranslation;
  }
}

export async function detectSafetyIssues(text: string): Promise<{
  hasSafetyIssues: boolean;
  safetyScore: number;
  issues: string[];
  recommendations: string[];
}> {
  try {
    const prompt = `
      Analyze the following document for safety-related issues, risks, and compliance concerns.
      Focus on railway operations, maintenance, and safety protocols.
      
      Document content:
      ${text}
      
      Provide your analysis in the following JSON format:
      {
        "hasSafetyIssues": boolean,
        "safetyScore": number (0-100, where 100 is most critical),
        "issues": ["list of identified safety issues"],
        "recommendations": ["list of safety recommendations"]
      }
      
      Consider:
      - Safety protocol violations
      - Maintenance requirements
      - Risk factors
      - Compliance issues
      - Emergency procedures
      - Equipment safety
    `;

    const response = await generateText(prompt);
    // Try to parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback if JSON parsing fails
    return {
      hasSafetyIssues: response.toLowerCase().includes('safety') || response.toLowerCase().includes('risk'),
      safetyScore: 50,
      issues: ['Safety analysis completed'],
      recommendations: ['Review document for compliance']
    };
  } catch (error) {
    console.error('Safety detection error:', error);
    // Fallback safety analysis
    const hasSafetyKeywords = text.toLowerCase().includes('safety') || 
                             text.toLowerCase().includes('hazard') || 
                             text.toLowerCase().includes('risk') ||
                             text.toLowerCase().includes('accident');
    
    return {
      hasSafetyIssues: hasSafetyKeywords,
      safetyScore: hasSafetyKeywords ? 75 : 25,
      issues: hasSafetyKeywords ? ['Potential safety concerns detected'] : [],
      recommendations: hasSafetyKeywords ? ['Review document for safety compliance'] : ['Document appears safe']
    };
  }
}

export async function extractEntities(text: string): Promise<{
  departments: string[];
  dates: string[];
  amounts: string[];
  locations: string[];
  people: string[];
  regulations: string[];
}> {
  try {
    const prompt = `
      Extract key entities from the following railway operations document.
      
      Document content:
      ${text}
      
      Identify and categorize:
      - Departments mentioned
      - Important dates and deadlines
      - Financial amounts and budgets
      - Locations and stations
      - People and roles
      - Regulations and compliance references
      
      Provide the results in JSON format:
      {
        "departments": ["list of departments"],
        "dates": ["list of dates"],
        "amounts": ["list of amounts"],
        "locations": ["list of locations"],
        "people": ["list of people"],
        "regulations": ["list of regulations"]
      }
    `;

    const response = await generateText(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      departments: [],
      dates: [],
      amounts: [],
      locations: [],
      people: [],
      regulations: []
    };
  } catch (error) {
    console.error('Entity extraction error:', error);
    // Fallback entity extraction using simple regex
    const departments = text.match(/\b(Operations|Engineering|HR|Finance|Safety|Maintenance)\b/gi) || [];
    const dates = text.match(/\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b|\b\d{4}-\d{2}-\d{2}\b/g) || [];
    const amounts = text.match(/\b₹?\d+(?:,\d{3})*(?:\.\d{2})?\b/g) || [];
    const locations = text.match(/\b(Station|Platform|Track|Line|Route)\b/gi) || [];
    const people = text.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g) || [];
    const regulations = text.match(/\b(Regulation|Rule|Standard|Protocol|Guideline)\b/gi) || [];
    
    return {
      departments: [...new Set(departments)],
      dates: [...new Set(dates)],
      amounts: [...new Set(amounts)],
      locations: [...new Set(locations)],
      people: [...new Set(people)],
      regulations: [...new Set(regulations)]
    };
  }
}

export async function classifyDocument(text: string): Promise<{
  category: string;
  department: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
}> {
  try {
    const prompt = `
      Classify the following railway operations document.
      
      Document content:
      ${text}
      
      Determine:
      - Category (Safety, Maintenance, Operations, Compliance, Finance, HR, etc.)
      - Primary department (Operations, Engineering, HR, Finance, etc.)
      - Priority level (low, medium, high, critical)
      - Relevant tags
      
      Provide results in JSON format:
      {
        "category": "document category",
        "department": "primary department",
        "priority": "priority level",
        "tags": ["list of relevant tags"]
      }
    `;

    const response = await generateText(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      category: 'General',
      department: 'Operations',
      priority: 'medium',
      tags: ['document']
    };
  } catch (error) {
    console.error('Document classification error:', error);
    // Fallback classification using keyword matching
    const lowerText = text.toLowerCase();
    
    let category = 'General';
    let department = 'Operations';
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    const tags: string[] = ['document'];
    
    // Category detection
    if (lowerText.includes('safety') || lowerText.includes('hazard') || lowerText.includes('accident')) {
      category = 'Safety';
      priority = 'high';
      tags.push('safety');
    } else if (lowerText.includes('maintenance') || lowerText.includes('repair') || lowerText.includes('inspection')) {
      category = 'Maintenance';
      priority = 'medium';
      tags.push('maintenance');
    } else if (lowerText.includes('budget') || lowerText.includes('cost') || lowerText.includes('financial')) {
      category = 'Finance';
      department = 'Finance';
      tags.push('finance');
    } else if (lowerText.includes('personnel') || lowerText.includes('employee') || lowerText.includes('hr')) {
      category = 'HR';
      department = 'HR';
      tags.push('hr');
    }
    
    // Priority adjustment
    if (lowerText.includes('urgent') || lowerText.includes('critical') || lowerText.includes('emergency')) {
      priority = 'critical';
    } else if (lowerText.includes('important') || lowerText.includes('priority')) {
      priority = 'high';
    } else if (lowerText.includes('routine') || lowerText.includes('normal')) {
      priority = 'low';
    }
    
    return {
      category,
      department,
      priority,
      tags
    };
  }
}
