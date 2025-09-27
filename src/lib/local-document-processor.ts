// Local Document Processor - Complete Offline Processing
// Combines OCR and AI analysis without external API keys

import { localOCRService, LocalOCRResult } from './local-ocr-service';
import { localAIService, LocalDocumentAnalysis } from './local-ai-service';

// Complete Document Processing Result
export interface LocalDocumentProcessingResult {
  documentId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  ocr: LocalOCRResult;
  analysis: LocalDocumentAnalysis;
  processingTime: number;
  status: 'success' | 'partial' | 'failed';
  errors: string[];
}

// Local Document Processor Class
export class LocalDocumentProcessor {
  
  // Main document processing method
  async processDocument(
    file: File,
    documentId: string,
    language: 'en' | 'ml' = 'en'
  ): Promise<LocalDocumentProcessingResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    let ocrResult: LocalOCRResult;
    let analysisResult: LocalDocumentAnalysis;
    
    try {
      console.log(`Starting local document processing: ${file.name}`);
      
      // Step 1: OCR Processing
      try {
        ocrResult = await localOCRService.extractText(file, language);
        console.log(`OCR completed for ${file.name}: ${ocrResult.text.length} characters extracted`);
      } catch (ocrError) {
        console.error('OCR processing failed:', ocrError);
        errors.push(`OCR failed: ${ocrError}`);
        
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
      
      // Step 2: AI Analysis
      try {
        analysisResult = await localAIService.analyzeDocument(
          ocrResult.text,
          file.name,
          language
        );
        console.log(`AI analysis completed for ${file.name}: ${analysisResult.summary.length} characters summary`);
      } catch (analysisError) {
        console.error('AI analysis failed:', analysisError);
        errors.push(`AI analysis failed: ${analysisError}`);
        
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
      
      const totalProcessingTime = Date.now() - startTime;
      const status = errors.length === 0 ? 'success' : 
                    (ocrResult.confidence > 0.5 && analysisResult.confidence > 0.5) ? 'partial' : 'failed';
      
      const result: LocalDocumentProcessingResult = {
        documentId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        ocr: ocrResult,
        analysis: analysisResult,
        processingTime: totalProcessingTime,
        status,
        errors
      };
      
      console.log(`Document processing completed: ${file.name} - Status: ${status} - Time: ${totalProcessingTime}ms`);
      return result;
      
    } catch (error) {
      console.error('Complete document processing failed:', error);
      
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
        errors: [`Complete processing failed: ${error}`]
      };
    }
  }
  
  // Process multiple documents
  async processDocuments(
    files: File[],
    language: 'en' | 'ml' = 'en'
  ): Promise<LocalDocumentProcessingResult[]> {
    console.log(`Processing ${files.length} documents locally...`);
    
    const processingPromises = files.map((file, index) => {
      const documentId = `doc_${Date.now()}_${index}`;
      return this.processDocument(file, documentId, language);
    });
    
    try {
      const results = await Promise.all(processingPromises);
      const successCount = results.filter(r => r.status === 'success').length;
      const partialCount = results.filter(r => r.status === 'partial').length;
      const failedCount = results.filter(r => r.status === 'failed').length;
      
      console.log(`Batch processing completed: ${successCount} success, ${partialCount} partial, ${failedCount} failed`);
      return results;
      
    } catch (error) {
      console.error('Batch processing failed:', error);
      throw error;
    }
  }
  
  // Get processing statistics
  getProcessingStats(results: LocalDocumentProcessingResult[]): {
    total: number;
    success: number;
    partial: number;
    failed: number;
    averageProcessingTime: number;
    totalProcessingTime: number;
    averageConfidence: number;
    averageOCRConfidence: number;
  } {
    const total = results.length;
    const success = results.filter(r => r.status === 'success').length;
    const partial = results.filter(r => r.status === 'partial').length;
    const failed = results.filter(r => r.status === 'failed').length;
    
    const totalProcessingTime = results.reduce((sum, r) => sum + r.processingTime, 0);
    const averageProcessingTime = total > 0 ? totalProcessingTime / total : 0;
    
    const averageConfidence = results.length > 0 
      ? results.reduce((sum, r) => sum + r.analysis.confidence, 0) / results.length 
      : 0;
    
    const averageOCRConfidence = results.length > 0 
      ? results.reduce((sum, r) => sum + r.ocr.confidence, 0) / results.length 
      : 0;
    
    return {
      total,
      success,
      partial,
      failed,
      averageProcessingTime,
      totalProcessingTime,
      averageConfidence,
      averageOCRConfidence
    };
  }
  
  // Validate file before processing
  validateFile(file: File): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      errors.push(`File size (${(file.size / 1024 / 1024).toFixed(2)} MB) exceeds maximum allowed size (50 MB)`);
    }
    
    // Check file type
    const allowedTypes = [
      'text/plain',
      'text/csv',
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|csv|pdf|jpg|jpeg|png|gif|bmp|tiff|doc|docx|xls|xlsx)$/i)) {
      errors.push(`File type (${file.type}) is not supported`);
    }
    
    // Check file name
    if (!file.name || file.name.trim().length === 0) {
      errors.push('File name is required');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  // Get supported file types
  getSupportedFileTypes(): string[] {
    return [
      'text/plain',
      'text/csv',
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
  }
  
  // Get file type description
  getFileTypeDescription(fileType: string): string {
    const descriptions: { [key: string]: string } = {
      'text/plain': 'Plain Text Document',
      'text/csv': 'CSV Spreadsheet',
      'application/pdf': 'PDF Document',
      'image/jpeg': 'JPEG Image',
      'image/jpg': 'JPG Image',
      'image/png': 'PNG Image',
      'image/gif': 'GIF Image',
      'image/bmp': 'BMP Image',
      'image/tiff': 'TIFF Image',
      'application/msword': 'Microsoft Word Document',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Microsoft Word Document (DOCX)',
      'application/vnd.ms-excel': 'Microsoft Excel Spreadsheet',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Microsoft Excel Spreadsheet (XLSX)'
    };
    
    return descriptions[fileType] || 'Unknown File Type';
  }
}

// Export singleton instance
export const localDocumentProcessor = new LocalDocumentProcessor();
