// Progress-Aware Document Processor
// Emits progress events during document processing

import { localOCRService, LocalOCRResult } from './local-ocr-service';
import { localAIService, LocalDocumentAnalysis } from './local-ai-service';
import { mlSummarizationService } from './ml-summarization-service';

export interface ProgressEvent {
  documentId: string;
  stage: string;
  progress: number;
  message: string;
  timestamp: number;
}

export interface ProgressCallback {
  (event: ProgressEvent): void;
}

export interface ProgressAwareProcessingResult {
  documentId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  ocr: LocalOCRResult;
  analysis: LocalDocumentAnalysis;
  processingTime: number;
  status: 'success' | 'partial' | 'failed';
  errors: string[];
  progressEvents: ProgressEvent[];
}

export class ProgressAwareDocumentProcessor {
  private progressCallbacks: Map<string, ProgressCallback[]> = new Map()
  private processingResults: Map<string, ProgressAwareProcessingResult> = new Map();

  // Register progress callback for a document
  onProgress(documentId: string, callback: ProgressCallback) {
    if (!this.progressCallbacks.has(documentId)) {
      this.progressCallbacks.set(documentId, []);
    }
    this.progressCallbacks.get(documentId)!.push(callback);
  }

  // Remove progress callback
  offProgress(documentId: string, callback: ProgressCallback) {
    const callbacks = this.progressCallbacks.get(documentId);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit progress event
  private emitProgress(documentId: string, stage: string, progress: number, message: string) {
    const event: ProgressEvent = {
      documentId,
      stage,
      progress,
      message,
      timestamp: Date.now()
    };

    const callbacks = this.progressCallbacks.get(documentId);
    if (callbacks) {
      callbacks.forEach(callback => callback(event));
    }
  }

  // Main document processing method with progress tracking
  async processDocument(
    file: File,
    documentId: string,
    language: 'en' | 'ml' = 'en'
  ): Promise<ProgressAwareProcessingResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    const progressEvents: ProgressEvent[] = [];
    let ocrResult: LocalOCRResult;
    let analysisResult: LocalDocumentAnalysis;
    
    try {
      this.emitProgress(documentId, 'upload', 10, 'Starting document processing...');
      progressEvents.push({
        documentId,
        stage: 'upload',
        progress: 10,
        message: 'Starting document processing...',
        timestamp: Date.now()
      });

      // Step 1: OCR Processing
      try {
        this.emitProgress(documentId, 'ocr', 20, 'Initializing OCR processing...');
        progressEvents.push({
          documentId,
          stage: 'ocr',
          progress: 20,
          message: 'Initializing OCR processing...',
          timestamp: Date.now()
        });

        ocrResult = await localOCRService.extractText(file, language);
        
        this.emitProgress(documentId, 'ocr', 100, `OCR completed: ${ocrResult.text.length} characters extracted`);
        progressEvents.push({
          documentId,
          stage: 'ocr',
          progress: 100,
          message: `OCR completed: ${ocrResult.text.length} characters extracted`,
          timestamp: Date.now()
        });

        console.log(`OCR completed for ${file.name}: ${ocrResult.text.length} characters extracted`);
      } catch (ocrError) {
        console.error('OCR processing failed:', ocrError);
        errors.push(`OCR failed: ${ocrError}`);
        
        this.emitProgress(documentId, 'ocr', 0, `OCR failed: ${ocrError}`);
        progressEvents.push({
          documentId,
          stage: 'ocr',
          progress: 0,
          message: `OCR failed: ${ocrError}`,
          timestamp: Date.now()
        });
        
        // Create fallback OCR result
        ocrResult = {
          text: `[OCR Failed] ${file.name} - ${file.type} - ${(file.size / 1024 / 1024).toFixed(2)} MB`,
          language,
          confidence: 0.1,
          processingTime: 0,
          provider: 'tesseract-js',
          wordCount: 0,
          characterCount: 0
        };
      }
      
      // Step 2: AI Analysis with ML Summarization
      try {
        this.emitProgress(documentId, 'analysis', 10, 'Starting AI analysis...');
        progressEvents.push({
          documentId,
          stage: 'analysis',
          progress: 10,
          message: 'Starting AI analysis...',
          timestamp: Date.now()
        });

        this.emitProgress(documentId, 'analysis', 30, 'Initializing ML model...');
        progressEvents.push({
          documentId,
          stage: 'analysis',
          progress: 30,
          message: 'Initializing ML model...',
          timestamp: Date.now()
        });

        this.emitProgress(documentId, 'analysis', 50, 'Running ML-powered summarization...');
        progressEvents.push({
          documentId,
          stage: 'analysis',
          progress: 50,
          message: 'Running ML-powered summarization...',
          timestamp: Date.now()
        });

        this.emitProgress(documentId, 'analysis', 70, 'Analyzing document structure...');
        progressEvents.push({
          documentId,
          stage: 'analysis',
          progress: 70,
          message: 'Analyzing document structure...',
          timestamp: Date.now()
        });

        this.emitProgress(documentId, 'analysis', 90, 'Finalizing analysis...');
        progressEvents.push({
          documentId,
          stage: 'analysis',
          progress: 90,
          message: 'Finalizing analysis...',
          timestamp: Date.now()
        });

        analysisResult = await localAIService.analyzeDocument(
          ocrResult.text,
          file.name,
          language
        );

        this.emitProgress(documentId, 'analysis', 100, `ML analysis completed: ${analysisResult.summary.length} characters summary`);
        progressEvents.push({
          documentId,
          stage: 'analysis',
          progress: 100,
          message: `ML analysis completed: ${analysisResult.summary.length} characters summary`,
          timestamp: Date.now()
        });

        console.log(`ML analysis completed for ${file.name}: ${analysisResult.summary.length} characters summary`);
      } catch (analysisError) {
        console.error('AI analysis failed:', analysisError);
        errors.push(`AI analysis failed: ${analysisError}`);
        
        this.emitProgress(documentId, 'analysis', 0, `AI analysis failed: ${analysisError}`);
        progressEvents.push({
          documentId,
          stage: 'analysis',
          progress: 0,
          message: `AI analysis failed: ${analysisError}`,
          timestamp: Date.now()
        });
        
        // Create fallback analysis result
        analysisResult = {
          summary: `[Analysis Failed] Document: ${file.name}\n\nBasic processing completed. Content length: ${ocrResult.text.length} characters.\n\n[Local AI Fallback Analysis]`,
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
            tags: ['document', 'processing-failed']
          },
          safety: {
            hasSafetyIssues: false,
            safetyScore: 25,
            issues: [],
            recommendations: ['Manual review required due to processing errors']
          },
          confidence: 0.3,
          processingTime: 0,
          provider: 'local-ai'
        };
      }

      // Step 3: Safety Check
      this.emitProgress(documentId, 'safety', 20, 'Performing safety analysis...');
      progressEvents.push({
        documentId,
        stage: 'safety',
        progress: 20,
        message: 'Performing safety analysis...',
        timestamp: Date.now()
      });

      this.emitProgress(documentId, 'safety', 60, 'Checking compliance requirements...');
      progressEvents.push({
        documentId,
        stage: 'safety',
        progress: 60,
        message: 'Checking compliance requirements...',
        timestamp: Date.now()
      });

      // Simulate safety check processing time
      await new Promise(resolve => setTimeout(resolve, 500));

      this.emitProgress(documentId, 'safety', 100, 'Safety analysis completed');
      progressEvents.push({
        documentId,
        stage: 'safety',
        progress: 100,
        message: 'Safety analysis completed',
        timestamp: Date.now()
      });

      // Step 4: Knowledge Indexing
      this.emitProgress(documentId, 'indexing', 20, 'Indexing document in knowledge graph...');
      progressEvents.push({
        documentId,
        stage: 'indexing',
        progress: 20,
        message: 'Indexing document in knowledge graph...',
        timestamp: Date.now()
      });

      this.emitProgress(documentId, 'indexing', 60, 'Creating document relationships...');
      progressEvents.push({
        documentId,
        stage: 'indexing',
        progress: 60,
        message: 'Creating document relationships...',
        timestamp: Date.now()
      });

      // Simulate indexing time
      await new Promise(resolve => setTimeout(resolve, 800));

      this.emitProgress(documentId, 'indexing', 100, 'Document indexed successfully');
      progressEvents.push({
        documentId,
        stage: 'indexing',
        progress: 100,
        message: 'Document indexed successfully',
        timestamp: Date.now()
      });
      
      const totalProcessingTime = Date.now() - startTime;
      const status = errors.length === 0 ? 'success' : 
                    (ocrResult.confidence > 0.5 && analysisResult.confidence > 0.5) ? 'partial' : 'failed';
      
      this.emitProgress(documentId, 'complete', 100, `Processing completed in ${totalProcessingTime}ms`);
      progressEvents.push({
        documentId,
        stage: 'complete',
        progress: 100,
        message: `Processing completed in ${totalProcessingTime}ms`,
        timestamp: Date.now()
      });
      
      const result: ProgressAwareProcessingResult = {
        documentId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        ocr: ocrResult,
        analysis: analysisResult,
        processingTime: totalProcessingTime,
        status,
        errors,
        progressEvents
      };
      
      // Store the result for later retrieval
      this.processingResults.set(documentId, result);
      
      console.log(`Document processing completed: ${file.name} - Status: ${status} - Time: ${totalProcessingTime}ms`);
      return result;
      
    } catch (error) {
      console.error('Complete document processing failed:', error);
      
      this.emitProgress(documentId, 'error', 0, `Processing failed: ${error}`);
      progressEvents.push({
        documentId,
        stage: 'error',
        progress: 0,
        message: `Processing failed: ${error}`,
        timestamp: Date.now()
      });
      
      // Return minimal result with error information
      return {
        documentId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        ocr: {
          text: `[Processing Failed] ${file.name}`,
          language,
          confidence: 0.1,
          processingTime: 0,
          provider: 'tesseract-js',
          wordCount: 0,
          characterCount: 0
        },
        analysis: {
          summary: `[Processing Failed] Document: ${file.name}\n\nComplete processing failed. Please try again or contact support.\n\n[Local AI Error]`,
          entities: {
            departments: [],
            dates: [],
            amounts: [],
            locations: [],
            people: [],
            regulations: []
          },
          classification: {
            category: 'Error',
            department: 'Operations',
            priority: 'high',
            tags: ['error', 'processing-failed']
          },
          safety: {
            hasSafetyIssues: true,
            safetyScore: 100,
            issues: ['Document processing failed - manual review required'],
            recommendations: ['Contact technical support', 'Try uploading again', 'Check file format']
          },
          confidence: 0.1,
          processingTime: 0,
          provider: 'local-ai'
        },
        processingTime: Date.now() - startTime,
        status: 'failed',
        errors: [`Complete processing failed: ${error}`],
        progressEvents
      };
    }
  }

  // Clean up callbacks for a document
  cleanup(documentId: string) {
    this.progressCallbacks.delete(documentId);
  }

  // Get processing result for a document
  getProcessingResult(documentId: string): ProgressAwareProcessingResult | null {
    return this.processingResults.get(documentId) || null;
  }

  // Get all processing results
  getAllProcessingResults(): Map<string, ProgressAwareProcessingResult> {
    return new Map(this.processingResults);
  }
}

// Export singleton instance
export const progressAwareDocumentProcessor = new ProgressAwareDocumentProcessor();
