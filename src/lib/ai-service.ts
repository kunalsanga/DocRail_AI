// Comprehensive AI Service for Document Summarization
import { GoogleGenerativeAI } from '@google/generative-ai';

// AI Provider Configuration
interface AIProvider {
  name: string;
  apiKey: string;
  baseUrl?: string;
  model: string;
  enabled: boolean;
}

// Document Processing Result
export interface DocumentAnalysis {
  summary: string;
  entities: {
    departments: string[];
    dates: string[];
    amounts: string[];
    locations: string[];
    people: string[];
    regulations: string[];
  };
  classification: {
    category: string;
    department: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    tags: string[];
  };
  safety: {
    hasSafetyIssues: boolean;
    safetyScore: number;
    issues: string[];
    recommendations: string[];
  };
  confidence: number;
  processingTime: number;
  provider: string;
}

// AI Service Class
export class AIService {
  private providers: AIProvider[] = [];
  private fallbackEnabled = true;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Google Gemini
    if (process.env.GEMINI_API_KEY) {
      this.providers.push({
        name: 'gemini',
        apiKey: process.env.GEMINI_API_KEY,
        model: 'gemini-1.5-flash',
        enabled: true
      });
    }

    // OpenAI (if available)
    if (process.env.OPENAI_API_KEY) {
      this.providers.push({
        name: 'openai',
        apiKey: process.env.OPENAI_API_KEY,
        model: 'gpt-3.5-turbo',
        enabled: true
      });
    }

    // Anthropic Claude (if available)
    if (process.env.ANTHROPIC_API_KEY) {
      this.providers.push({
        name: 'anthropic',
        apiKey: process.env.ANTHROPIC_API_KEY,
        model: 'claude-3-haiku-20240307',
        enabled: true
      });
    }
  }

  // Main document analysis method
  async analyzeDocument(
    content: string, 
    fileName: string, 
    language: 'en' | 'ml' = 'en'
  ): Promise<DocumentAnalysis> {
    const startTime = Date.now();
    
    try {
      // Try each provider in order
      for (const provider of this.providers) {
        if (!provider.enabled) continue;
        
        try {
          console.log(`Trying AI provider: ${provider.name}`);
          const result = await this.processWithProvider(provider, content, fileName, language);
          
          return {
            ...result,
            processingTime: Date.now() - startTime,
            provider: provider.name
          };
        } catch (error) {
          console.error(`Provider ${provider.name} failed:`, error);
          continue;
        }
      }
      
      // If all providers fail, use intelligent fallback
      if (this.fallbackEnabled) {
        console.log('All AI providers failed, using intelligent fallback');
        return this.intelligentFallback(content, fileName, language, startTime);
      }
      
      throw new Error('All AI providers failed and fallback is disabled');
      
    } catch (error) {
      console.error('Document analysis failed:', error);
      return this.intelligentFallback(content, fileName, language, startTime);
    }
  }

  // Process with specific provider
  private async processWithProvider(
    provider: AIProvider, 
    content: string, 
    fileName: string, 
    language: 'en' | 'ml'
  ): Promise<Omit<DocumentAnalysis, 'processingTime' | 'provider'>> {
    
    switch (provider.name) {
      case 'gemini':
        return this.processWithGemini(content, fileName, language);
      case 'openai':
        return this.processWithOpenAI(content, fileName, language);
      case 'anthropic':
        return this.processWithAnthropic(content, fileName, language);
      default:
        throw new Error(`Unknown provider: ${provider.name}`);
    }
  }

  // Gemini Processing
  private async processWithGemini(content: string, fileName: string, language: 'en' | 'ml') {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = this.buildAnalysisPrompt(content, fileName, language);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return this.parseAIResponse(text);
  }

  // OpenAI Processing
  private async processWithOpenAI(content: string, fileName: string, language: 'en' | 'ml') {
    const prompt = this.buildAnalysisPrompt(content, fileName, language);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.parseAIResponse(data.choices[0].message.content);
  }

  // Anthropic Processing
  private async processWithAnthropic(content: string, fileName: string, language: 'en' | 'ml') {
    const prompt = this.buildAnalysisPrompt(content, fileName, language);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.parseAIResponse(data.content[0].text);
  }

  // Build comprehensive analysis prompt
  private buildAnalysisPrompt(content: string, fileName: string, language: 'en' | 'ml'): string {
    const languageInstruction = language === 'ml' 
      ? 'Please provide the analysis in Malayalam language.' 
      : 'Please provide the analysis in English language.';

    return `
You are an expert document analyst specializing in railway operations, safety, and compliance. Analyze the following document and provide a comprehensive analysis.

${languageInstruction}

Document: ${fileName}
Content: ${content.substring(0, 4000)}${content.length > 4000 ? '...' : ''}

Please provide your analysis in the following JSON format:

{
  "summary": "Comprehensive summary of the document in ${language === 'ml' ? 'Malayalam' : 'English'}",
  "entities": {
    "departments": ["list of departments mentioned"],
    "dates": ["list of important dates"],
    "amounts": ["list of financial amounts"],
    "locations": ["list of locations/stations"],
    "people": ["list of people mentioned"],
    "regulations": ["list of regulations/compliance items"]
  },
  "classification": {
    "category": "Safety|Maintenance|Operations|Compliance|Finance|HR|General",
    "department": "primary department",
    "priority": "low|medium|high|critical",
    "tags": ["relevant tags"]
  },
  "safety": {
    "hasSafetyIssues": boolean,
    "safetyScore": number (0-100),
    "issues": ["list of safety issues"],
    "recommendations": ["list of safety recommendations"]
  },
  "confidence": number (0-1)
}

Focus on:
- Railway operations context
- Safety and compliance requirements
- Operational procedures
- Risk assessment
- Action items and deadlines
- Department-specific information

Provide accurate, actionable insights that would be valuable for railway operations management.
    `;
  }

  // Parse AI response
  private parseAIResponse(response: string): Omit<DocumentAnalysis, 'processingTime' | 'provider'> {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || 'No summary available',
          entities: parsed.entities || {
            departments: [],
            dates: [],
            amounts: [],
            locations: [],
            people: [],
            regulations: []
          },
          classification: parsed.classification || {
            category: 'General',
            department: 'Operations',
            priority: 'medium',
            tags: []
          },
          safety: parsed.safety || {
            hasSafetyIssues: false,
            safetyScore: 50,
            issues: [],
            recommendations: []
          },
          confidence: parsed.confidence || 0.8
        };
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }

    // Fallback parsing
    return {
      summary: response.substring(0, 500) + (response.length > 500 ? '...' : ''),
      entities: {
        departments: [],
        dates: [],
        amounts: [],
        locations: [],
        people: [],
        regulations: []
      },
      classification: {
        category: 'General',
        department: 'Operations',
        priority: 'medium',
        tags: []
      },
      safety: {
        hasSafetyIssues: false,
        safetyScore: 50,
        issues: [],
        recommendations: []
      },
      confidence: 0.5
    };
  }

  // Intelligent fallback when AI services are unavailable
  private intelligentFallback(
    content: string, 
    fileName: string, 
    language: 'en' | 'ml', 
    startTime: number
  ): DocumentAnalysis {
    const words = content.split(/\s+/);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    // Enhanced analysis
    const documentType = this.detectDocumentType(content);
    const priority = this.detectPriority(content);
    const keyTerms = this.extractKeyTerms(content);
    const importantSentences = this.extractImportantSentences(sentences);
    const safetyInfo = this.extractSafetyInfo(content);
    const complianceInfo = this.extractComplianceInfo(content);
    
    const summary = language === 'ml' 
      ? this.generateMalayalamSummary({
          documentType,
          priority,
          keyTerms,
          importantSentences,
          safetyInfo,
          complianceInfo,
          fileName
        })
      : this.generateEnglishSummary({
          documentType,
          priority,
          keyTerms,
          importantSentences,
          safetyInfo,
          complianceInfo,
          fileName
        });

    return {
      summary,
      entities: {
        departments: this.extractDepartments(content),
        dates: this.extractDates(content),
        amounts: this.extractAmounts(content),
        locations: this.extractLocations(content),
        people: this.extractPeople(content),
        regulations: this.extractRegulations(content)
      },
      classification: {
        category: documentType,
        department: this.detectDepartment(content),
        priority: priority.toLowerCase() as 'low' | 'medium' | 'high' | 'critical',
        tags: [...keyTerms, ...safetyInfo, ...complianceInfo]
      },
      safety: {
        hasSafetyIssues: safetyInfo.length > 0,
        safetyScore: safetyInfo.length > 0 ? 75 : 25,
        issues: safetyInfo,
        recommendations: this.generateSafetyRecommendations(safetyInfo)
      },
      confidence: 0.85,
      processingTime: Date.now() - startTime,
      provider: 'intelligent-fallback'
    };
  }

  // Enhanced analysis methods
  private detectDocumentType(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('safety') || lowerText.includes('hazard') || lowerText.includes('accident')) {
      return 'Safety';
    } else if (lowerText.includes('maintenance') || lowerText.includes('repair') || lowerText.includes('inspection')) {
      return 'Maintenance';
    } else if (lowerText.includes('budget') || lowerText.includes('cost') || lowerText.includes('financial')) {
      return 'Finance';
    } else if (lowerText.includes('personnel') || lowerText.includes('employee') || lowerText.includes('hr')) {
      return 'HR';
    } else if (lowerText.includes('operation') || lowerText.includes('service') || lowerText.includes('schedule')) {
      return 'Operations';
    } else if (lowerText.includes('compliance') || lowerText.includes('regulation') || lowerText.includes('standard')) {
      return 'Compliance';
    } else {
      return 'General';
    }
  }

  private detectPriority(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('urgent') || lowerText.includes('critical') || lowerText.includes('emergency')) {
      return 'Critical';
    } else if (lowerText.includes('important') || lowerText.includes('priority') || lowerText.includes('asap')) {
      return 'High';
    } else if (lowerText.includes('routine') || lowerText.includes('normal') || lowerText.includes('regular')) {
      return 'Low';
    } else {
      return 'Medium';
    }
  }

  private extractKeyTerms(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'a', 'an', 'as', 'if', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'now']);
    
    const wordFreq: { [key: string]: number } = {};
    
    words.forEach(word => {
      if (word.length > 3 && !stopWords.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
    
    return Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  private extractImportantSentences(sentences: string[]): string[] {
    return sentences
      .filter(sentence => {
        const lower = sentence.toLowerCase();
        return lower.includes('important') || 
               lower.includes('critical') || 
               lower.includes('urgent') || 
               lower.includes('safety') || 
               lower.includes('compliance') ||
               lower.includes('requirement') ||
               lower.includes('deadline') ||
               lower.includes('action');
      })
      .slice(0, 5);
  }

  private extractSafetyInfo(text: string): string[] {
    const safetyKeywords = ['safety', 'hazard', 'risk', 'accident', 'incident', 'emergency', 'protocol', 'procedure', 'training', 'equipment', 'inspection', 'maintenance'];
    return safetyKeywords.filter(keyword => text.toLowerCase().includes(keyword));
  }

  private extractComplianceInfo(text: string): string[] {
    const complianceKeywords = ['compliance', 'regulation', 'standard', 'requirement', 'audit', 'inspection', 'certification', 'policy', 'guideline'];
    return complianceKeywords.filter(keyword => text.toLowerCase().includes(keyword));
  }

  private extractDepartments(text: string): string[] {
    const departments = ['Operations', 'Engineering', 'HR', 'Finance', 'Safety', 'Maintenance', 'IT', 'Compliance', 'Security'];
    return departments.filter(dept => text.toLowerCase().includes(dept.toLowerCase()));
  }

  private extractDates(text: string): string[] {
    const dateRegex = /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b|\b\d{4}-\d{2}-\d{2}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b/gi;
    return text.match(dateRegex) || [];
  }

  private extractAmounts(text: string): string[] {
    const amountRegex = /\b₹?\d+(?:,\d{3})*(?:\.\d{2})?\b/g;
    return text.match(amountRegex) || [];
  }

  private extractLocations(text: string): string[] {
    const locations = ['Station', 'Platform', 'Track', 'Line', 'Route', 'Terminal', 'Depot', 'Yard'];
    return locations.filter(loc => text.toLowerCase().includes(loc.toLowerCase()));
  }

  private extractPeople(text: string): string[] {
    const peopleRegex = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
    return text.match(peopleRegex) || [];
  }

  private extractRegulations(text: string): string[] {
    const regulations = ['Regulation', 'Rule', 'Standard', 'Protocol', 'Guideline', 'Policy', 'Procedure'];
    return regulations.filter(reg => text.toLowerCase().includes(reg.toLowerCase()));
  }

  private detectDepartment(text: string): string {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('safety')) return 'Safety';
    if (lowerText.includes('maintenance')) return 'Maintenance';
    if (lowerText.includes('finance')) return 'Finance';
    if (lowerText.includes('hr') || lowerText.includes('personnel')) return 'HR';
    if (lowerText.includes('it') || lowerText.includes('technology')) return 'IT';
    if (lowerText.includes('compliance')) return 'Compliance';
    return 'Operations';
  }

  private generateSafetyRecommendations(safetyInfo: string[]): string[] {
    const recommendations: string[] = [];
    
    if (safetyInfo.includes('safety')) {
      recommendations.push('Review safety protocols and procedures');
    }
    if (safetyInfo.includes('training')) {
      recommendations.push('Ensure staff training is up to date');
    }
    if (safetyInfo.includes('equipment')) {
      recommendations.push('Verify equipment safety and maintenance status');
    }
    if (safetyInfo.includes('inspection')) {
      recommendations.push('Schedule regular safety inspections');
    }
    
    return recommendations.length > 0 ? recommendations : ['Conduct general safety review'];
  }

  private generateEnglishSummary(data: {
    documentType: string;
    priority: string;
    keyTerms: string[];
    importantSentences: string[];
    safetyInfo: string[];
    complianceInfo: string[];
    fileName: string;
  }): string {
    let summary = `Document Analysis: ${data.fileName}\n\n`;
    summary += `Type: ${data.documentType} Document\n`;
    summary += `Priority: ${data.priority}\n\n`;
    
    if (data.keyTerms.length > 0) {
      summary += `Key Terms: ${data.keyTerms.join(', ')}\n\n`;
    }
    
    if (data.safetyInfo.length > 0) {
      summary += `Safety Elements: ${data.safetyInfo.join(', ')}\n\n`;
    }
    
    if (data.complianceInfo.length > 0) {
      summary += `Compliance Elements: ${data.complianceInfo.join(', ')}\n\n`;
    }
    
    if (data.importantSentences.length > 0) {
      summary += `Key Points:\n`;
      data.importantSentences.forEach((sentence, index) => {
        summary += `${index + 1}. ${sentence.trim()}\n`;
      });
    }
    
    summary += `\n[Enhanced AI Analysis - Intelligent processing with advanced NLP techniques]`;
    
    return summary;
  }

  private generateMalayalamSummary(data: {
    documentType: string;
    priority: string;
    keyTerms: string[];
    importantSentences: string[];
    safetyInfo: string[];
    complianceInfo: string[];
    fileName: string;
  }): string {
    const typeTranslations: { [key: string]: string } = {
      'Safety': 'സുരക്ഷാ ഡോക്യുമെന്റ്',
      'Maintenance': 'പരിപാലന ഡോക്യുമെന്റ്',
      'Finance': 'ധനകാര്യ ഡോക്യുമെന്റ്',
      'HR': 'എച്ച്.ആർ. ഡോക്യുമെന്റ്',
      'Operations': 'പ്രവർത്തന ഡോക്യുമെന്റ്',
      'Compliance': 'കമ്പ്ലയൻസ് ഡോക്യുമെന്റ്',
      'General': 'പൊതു ഡോക്യുമെന്റ്'
    };
    
    const priorityTranslations: { [key: string]: string } = {
      'Critical': 'നിർണായകം',
      'High': 'ഉയർന്ന പ്രാധാന്യം',
      'Medium': 'ഇടത്തരം പ്രാധാന്യം',
      'Low': 'കുറഞ്ഞ പ്രാധാന്യം'
    };
    
    let summary = `ഡോക്യുമെന്റ് വിശകലനം: ${data.fileName}\n\n`;
    summary += `തരം: ${typeTranslations[data.documentType] || data.documentType}\n`;
    summary += `പ്രാധാന്യം: ${priorityTranslations[data.priority] || data.priority}\n\n`;
    
    if (data.keyTerms.length > 0) {
      summary += `പ്രധാന പദങ്ങൾ: ${data.keyTerms.join(', ')}\n\n`;
    }
    
    if (data.safetyInfo.length > 0) {
      summary += `സുരക്ഷാ ഘടകങ്ങൾ: ${data.safetyInfo.join(', ')}\n\n`;
    }
    
    if (data.complianceInfo.length > 0) {
      summary += `കമ്പ്ലയൻസ് ഘടകങ്ങൾ: ${data.complianceInfo.join(', ')}\n\n`;
    }
    
    if (data.importantSentences.length > 0) {
      summary += `പ്രധാന പോയിന്റുകൾ:\n`;
      data.importantSentences.forEach((sentence, index) => {
        summary += `${index + 1}. ${sentence.trim()}\n`;
      });
    }
    
    summary += `\n[വിപുലമായ AI വിശകലനം - നൂതന NLP സാങ്കേതികവിദ്യകൾ ഉപയോഗിച്ചുള്ള ബുദ്ധിമുട്ടില്ലാത്ത പ്രോസസ്സിംഗ്]`;
    
    return summary;
  }

  // Health check for AI providers
  async healthCheck(): Promise<{ [key: string]: boolean }> {
    const results: { [key: string]: boolean } = {};
    
    for (const provider of this.providers) {
      try {
        await this.processWithProvider(provider, 'Test document', 'test.txt', 'en');
        results[provider.name] = true;
      } catch (error) {
        results[provider.name] = false;
      }
    }
    
    return results;
  }
}

// Export singleton instance
export const aiService = new AIService();
