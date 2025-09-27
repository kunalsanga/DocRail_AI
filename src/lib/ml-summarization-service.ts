// ML Summarization Service using Hugging Face Transformers
// Provides real AI-powered document summarization

import { pipeline, Pipeline } from '@huggingface/transformers';

export interface MLSummarizationResult {
  summary: string;
  confidence: number;
  processingTime: number;
  model: string;
  wordCount: number;
  originalWordCount: number;
  compressionRatio: number;
}

export interface MLSummarizationOptions {
  maxLength?: number;
  minLength?: number;
  doSample?: boolean;
  temperature?: number;
  topP?: number;
  topK?: number;
  repetitionPenalty?: number;
}

export class MLSummarizationService {
  private summarizationPipeline: Pipeline | null = null;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;
  private readonly modelName = 'facebook/bart-large-cnn'; // Pre-trained summarization model
  private readonly useFastMode = true; // Enable fast mode for better performance
  private static instance: MLSummarizationService | null = null;
  private lastUsed = Date.now();

  // Initialize the ML model with caching and fast mode
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    // Prevent multiple simultaneous initializations
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._doInitialize();
    return this.initializationPromise;
  }

  private async _doInitialize(): Promise<void> {
    try {
      console.log('Initializing ML summarization model...');
      
      // Use a smaller, faster model for better performance
      const modelConfig = this.useFastMode ? {
        quantized: true,
        device: 'cpu', // Force CPU for better compatibility
        revision: 'main'
      } : {
        quantized: true
      };

      this.summarizationPipeline = await pipeline(
        'summarization',
        this.modelName,
        modelConfig
      );
      
      this.isInitialized = true;
      console.log('ML summarization model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ML summarization model:', error);
      console.error('This might be due to network issues or model download problems.');
      console.error('The system will fall back to extractive summarization.');
      this.isInitialized = false;
      this.initializationPromise = null;
      throw new Error(`ML model initialization failed: ${error}`);
    }
  }

  // Summarize text using ML model with fast fallback
  async summarizeText(
    text: string,
    options: MLSummarizationOptions = {}
  ): Promise<MLSummarizationResult> {
    const startTime = Date.now();
    this.lastUsed = startTime;

    // Try to initialize ML model with timeout
    try {
      if (!this.isInitialized) {
        // Set a timeout for model initialization
        const initPromise = this.initialize();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Model initialization timeout')), 5000)
        );
        
        await Promise.race([initPromise, timeoutPromise]);
      }

      if (this.summarizationPipeline && this.isInitialized) {
        return await this._runMLSummarization(text, options, startTime);
      }
    } catch (error) {
      console.log('ML model not available, using fast fallback:', error.message);
    }

    // Fast fallback - use optimized extractive summarization
    return this._runFastFallback(text, startTime);
  }

  // Run ML summarization
  private async _runMLSummarization(
    text: string,
    options: MLSummarizationOptions,
    startTime: number
  ): Promise<MLSummarizationResult> {

    try {
      // Clean and prepare text
      const cleanedText = this.preprocessText(text);
      
      if (cleanedText.length < 100) {
        return {
          summary: cleanedText,
          confidence: 0.8,
          processingTime: Date.now() - startTime,
          model: this.modelName,
          wordCount: cleanedText.split(' ').length,
          originalWordCount: text.split(' ').length,
          compressionRatio: 1.0
        };
      }

      // Configure summarization parameters based on document type
      const documentType = this.detectDocumentType(cleanedText);
      const summarizationOptions = this.getSummarizationOptions(documentType, options);

      console.log(`Running ML summarization for ${documentType} document...`);
      console.log(`Text length: ${cleanedText.length} characters`);
      const result = await this.summarizationPipeline!(cleanedText, summarizationOptions);
      
      const summary = Array.isArray(result) ? result[0]?.summary_text || result[0] : result.summary_text || result;
      const processingTime = Date.now() - startTime;
      const wordCount = summary.split(' ').length;
      const originalWordCount = cleanedText.split(' ').length;
      const compressionRatio = originalWordCount > 0 ? wordCount / originalWordCount : 1.0;

      return {
        summary: this.postprocessSummary(summary),
        confidence: 0.9, // High confidence for BART model
        processingTime,
        model: this.modelName,
        wordCount,
        originalWordCount,
        compressionRatio
      };

    } catch (error) {
      console.error('ML summarization failed:', error);
      
      // Fallback to extractive summarization
      return this.fallbackSummarization(text, startTime);
    }
  }

  // Fast fallback summarization (optimized for speed)
  private _runFastFallback(text: string, startTime: number): MLSummarizationResult {
    console.log('Using fast fallback summarization...');
    
    const cleanedText = this.preprocessText(text);
    const sentences = cleanedText.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    if (sentences.length === 0) {
      return {
        summary: cleanedText.substring(0, 200) + '...',
        confidence: 0.8,
        processingTime: Date.now() - startTime,
        model: 'fast-fallback',
        wordCount: cleanedText.split(' ').length,
        originalWordCount: text.split(' ').length,
        compressionRatio: 1.0
      };
    }

    // Quick scoring based on position and keywords
    const scoredSentences = sentences.map((sentence, index) => {
      let score = 0;
      
      // Position-based scoring (first and last sentences are important)
      if (index === 0) score += 10;
      if (index === sentences.length - 1) score += 8;
      if (index < 3) score += 5;
      
      // Keyword-based scoring
      const lowerSentence = sentence.toLowerCase();
      const importantKeywords = [
        'safety', 'important', 'critical', 'urgent', 'compliance',
        'requirement', 'procedure', 'protocol', 'maintenance',
        'operation', 'training', 'emergency', 'hazard', 'risk'
      ];
      
      importantKeywords.forEach(keyword => {
        if (lowerSentence.includes(keyword)) {
          score += 3;
        }
      });
      
      return { sentence: sentence.trim(), score };
    });

    // Get top sentences (limit to 2-3 for speed)
    const topSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(2, sentences.length))
      .map(s => s.sentence);

    const summary = topSentences.join('. ') + '.';
    const wordCount = summary.split(' ').length;
    const originalWordCount = cleanedText.split(' ').length;
    const compressionRatio = originalWordCount > 0 ? wordCount / originalWordCount : 1.0;

    return {
      summary,
      confidence: 0.75, // Good confidence for fast fallback
      processingTime: Date.now() - startTime,
      model: 'fast-fallback',
      wordCount,
      originalWordCount,
      compressionRatio
    };
  }

  // Preprocess text for better summarization
  private preprocessText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .replace(/[^\w\s.,!?;:()-]/g, '') // Remove special characters
      .trim()
      .substring(0, 4000); // Limit to model's input length
  }

  // Postprocess summary for better readability
  private postprocessSummary(summary: string): string {
    return summary
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/^[^A-Za-z]*/, '') // Remove leading non-alphabetic characters
      .replace(/([.!?])\s*$/, '$1'); // Ensure proper ending punctuation
  }

  // Fallback summarization using extractive methods
  private fallbackSummarization(text: string, startTime: number): MLSummarizationResult {
    console.log('Using fallback summarization...');
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const words = text.toLowerCase().split(/\s+/);
    
    // Simple TF-IDF-like scoring
    const wordFreq: { [key: string]: number } = {};
    words.forEach(word => {
      if (word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    // Railway-specific important terms (boost their scores)
    const railwayTerms = [
      'safety', 'maintenance', 'operation', 'compliance', 'inspection',
      'training', 'equipment', 'platform', 'station', 'track', 'signal',
      'passenger', 'freight', 'locomotive', 'rolling', 'infrastructure',
      'security', 'emergency', 'protocol', 'procedure', 'standard',
      'regulation', 'policy', 'guideline', 'requirement', 'audit',
      'machine', 'learning', 'algorithm', 'data', 'model', 'analysis'
    ];

    // Boost railway terms
    railwayTerms.forEach(term => {
      if (wordFreq[term]) {
        wordFreq[term] *= 2;
      }
    });

    // Score sentences
    const scoredSentences = sentences.map(sentence => {
      const sentenceWords = sentence.toLowerCase().split(/\s+/);
      let score = sentenceWords.reduce((acc, word) => {
        return acc + (wordFreq[word] || 0);
      }, 0);
      
      // Boost score for important keywords
      const importantKeywords = [
        'important', 'critical', 'urgent', 'safety', 'compliance',
        'requirement', 'deadline', 'action', 'must', 'should',
        'emergency', 'hazard', 'risk', 'procedure', 'protocol'
      ];
      
      importantKeywords.forEach(keyword => {
        if (sentence.toLowerCase().includes(keyword)) {
          score += 5;
        }
      });
      
      return { sentence: sentence.trim(), score };
    });

    // Get top sentences
    const topSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(3, Math.max(1, Math.floor(sentences.length * 0.3))))
      .map(s => s.sentence);

    const summary = topSentences.join('. ') + '.';
    const wordCount = summary.split(' ').length;
    const originalWordCount = text.split(' ').length;
    const compressionRatio = originalWordCount > 0 ? wordCount / originalWordCount : 1.0;

    return {
      summary,
      confidence: 0.7, // Higher confidence for improved fallback
      processingTime: Date.now() - startTime,
      model: 'fallback-extractive',
      wordCount,
      originalWordCount,
      compressionRatio
    };
  }

  // Summarize multiple documents
  async summarizeDocuments(
    texts: string[],
    options: MLSummarizationOptions = {}
  ): Promise<MLSummarizationResult[]> {
    const results: MLSummarizationResult[] = [];
    
    for (const text of texts) {
      try {
        const result = await this.summarizeText(text, options);
        results.push(result);
      } catch (error) {
        console.error('Failed to summarize document:', error);
        results.push({
          summary: `[Summarization failed] ${text.substring(0, 100)}...`,
          confidence: 0.1,
          processingTime: 0,
          model: 'error',
          wordCount: 0,
          originalWordCount: text.split(' ').length,
          compressionRatio: 0
        });
      }
    }
    
    return results;
  }

  // Get model information
  getModelInfo(): { name: string; type: string; initialized: boolean } {
    return {
      name: this.modelName,
      type: 'transformer',
      initialized: this.isInitialized
    };
  }

  // Detect document type for better summarization
  private detectDocumentType(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('safety') || lowerText.includes('hazard') || lowerText.includes('risk')) {
      return 'safety';
    } else if (lowerText.includes('maintenance') || lowerText.includes('repair') || lowerText.includes('inspection')) {
      return 'maintenance';
    } else if (lowerText.includes('operation') || lowerText.includes('schedule') || lowerText.includes('service')) {
      return 'operations';
    } else if (lowerText.includes('compliance') || lowerText.includes('regulation') || lowerText.includes('standard')) {
      return 'compliance';
    } else if (lowerText.includes('training') || lowerText.includes('education') || lowerText.includes('learning')) {
      return 'training';
    } else if (lowerText.includes('machine learning') || lowerText.includes('algorithm') || lowerText.includes('model')) {
      return 'technical';
    } else {
      return 'general';
    }
  }

  // Get summarization options based on document type
  private getSummarizationOptions(documentType: string, options: MLSummarizationOptions): any {
    const baseOptions = {
      do_sample: options.doSample || false,
      temperature: options.temperature || 1.0,
      top_p: options.topP || 1.0,
      top_k: options.topK || 50,
      repetition_penalty: options.repetitionPenalty || 1.0,
      truncation: true,
      padding: true
    };

    // Adjust parameters based on document type
    switch (documentType) {
      case 'safety':
        return {
          ...baseOptions,
          max_length: options.maxLength || 200, // Longer for safety documents
          min_length: options.minLength || 50,
        };
      case 'technical':
        return {
          ...baseOptions,
          max_length: options.maxLength || 180,
          min_length: options.minLength || 40,
        };
      case 'compliance':
        return {
          ...baseOptions,
          max_length: options.maxLength || 160,
          min_length: options.minLength || 35,
        };
      case 'maintenance':
        return {
          ...baseOptions,
          max_length: options.maxLength || 140,
          min_length: options.minLength || 30,
        };
      default:
        return {
          ...baseOptions,
          max_length: options.maxLength || 150,
          min_length: options.minLength || 30,
        };
    }
  }

  // Get singleton instance
  static getInstance(): MLSummarizationService {
    if (!MLSummarizationService.instance) {
      MLSummarizationService.instance = new MLSummarizationService();
    }
    return MLSummarizationService.instance;
  }

  // Clean up resources
  async cleanup(): Promise<void> {
    if (this.summarizationPipeline) {
      // Clean up pipeline resources
      this.summarizationPipeline = null;
      this.isInitialized = false;
      this.initializationPromise = null;
      console.log('ML summarization service cleaned up');
    }
  }

  // Auto-cleanup after inactivity
  private scheduleCleanup(): void {
    setTimeout(() => {
      const timeSinceLastUse = Date.now() - this.lastUsed;
      if (timeSinceLastUse > 300000) { // 5 minutes
        this.cleanup();
      }
    }, 300000);
  }
}

// Export singleton instance
export const mlSummarizationService = MLSummarizationService.getInstance();
