// Comprehensive Document Processing Service
import { aiService, DocumentAnalysis } from './ai-service';
import { ocrService, OCRResult } from './ocr-service';

// Document Processing Result
export interface DocumentProcessingResult {
  documentId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  ocr: OCRResult;
  analysis: DocumentAnalysis;
  processingTime: number;
  status: 'success' | 'partial' | 'failed';
  errors: string[];
}

// Document Processing Service
export class DocumentProcessor {
  
  // Main document processing method
  async processDocument(
    file: File, 
    documentId: string, 
    language: 'en' | 'ml' = 'en'
  ): Promise<DocumentProcessingResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    
    try {
      console.log(`Processing document: ${file.name} (${documentId})`);
      
      // Step 1: Extract text using OCR
      let ocrResult: OCRResult;
      try {
        ocrResult = await ocrService.extractText(file);
        console.log(`OCR completed for ${file.name}`);
      } catch (error) {
        console.error('OCR failed:', error);
        errors.push(`OCR failed: ${error}`);
        // Use fallback OCR
        ocrResult = await this.fallbackOCR(file, startTime);
      }
      
      // Step 2: Analyze document using AI
      let analysis: DocumentAnalysis;
      try {
        analysis = await aiService.analyzeDocument(
          ocrResult.text, 
          file.name, 
          language
        );
        console.log(`AI analysis completed for ${file.name}`);
      } catch (error) {
        console.error('AI analysis failed:', error);
        errors.push(`AI analysis failed: ${error}`);
        // Use fallback analysis
        analysis = await this.fallbackAnalysis(ocrResult.text, file.name, language, startTime);
      }
      
      const processingTime = Date.now() - startTime;
      const status = errors.length === 0 ? 'success' : errors.length < 2 ? 'partial' : 'failed';
      
      console.log(`Document processing completed: ${file.name} (${processingTime}ms)`);
      
      return {
        documentId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        ocr: ocrResult,
        analysis,
        processingTime,
        status,
        errors
      };
      
    } catch (error) {
      console.error('Document processing failed:', error);
      return {
        documentId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        ocr: await this.fallbackOCR(file, startTime),
        analysis: await this.fallbackAnalysis('', file.name, language, startTime),
        processingTime: Date.now() - startTime,
        status: 'failed',
        errors: [`Processing failed: ${error}`]
      };
    }
  }
  
  // Fallback OCR when all providers fail
  private async fallbackOCR(file: File, startTime: number): Promise<OCRResult> {
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    
    let fallbackText = '';
    
    if (fileExtension === 'pdf') {
      fallbackText = `PDF Document: ${file.name}\n\nThis is a PDF document containing important information. The document appears to be ${(file.size / 1024 / 1024).toFixed(2)} MB in size and likely contains text, images, and structured data that requires analysis.\n\nKey areas to analyze:\n- Document structure and layout\n- Text content and key information\n- Images and diagrams\n- Tables and data\n- Safety and compliance information\n- Operational procedures\n- Financial data (if applicable)\n- Personnel information (if applicable)\n\nPlease process this document for safety compliance, entity extraction, and classification.`;
    } else if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'].includes(fileExtension)) {
      fallbackText = `Image Document: ${file.name}\n\nThis is an image file (${file.type}) containing visual information. The image is ${(file.size / 1024 / 1024).toFixed(2)} MB in size.\n\nKey areas to analyze:\n- Visual content and text within the image\n- Safety signs, warnings, or notices\n- Equipment or infrastructure shown\n- People or personnel in the image\n- Location or environmental context\n- Compliance-related visual elements\n- Operational procedures depicted\n- Maintenance or inspection records\n\nPlease process this image for safety compliance, entity extraction, and classification.`;
    } else if (['docx', 'doc'].includes(fileExtension)) {
      fallbackText = `Word Document: ${file.name}\n\nThis is a Microsoft Word document containing structured text and formatting. The document is ${(file.size / 1024 / 1024).toFixed(2)} MB in size.\n\nKey areas to analyze:\n- Document content and main topics\n- Headers, sections, and structure\n- Tables and data\n- Safety protocols and procedures\n- Compliance requirements\n- Operational guidelines\n- Financial information\n- Personnel details\n- Dates and deadlines\n- Department-specific information\n\nPlease process this document for comprehensive analysis, safety compliance, entity extraction, and classification.`;
    } else if (['txt', 'text'].includes(fileExtension)) {
      // For text files, try to read the content
      try {
        fallbackText = await file.text();
      } catch (error) {
        fallbackText = `Text Document: ${file.name}\n\nThis is a text document containing important information. The document is ${(file.size / 1024 / 1024).toFixed(2)} MB in size.\n\nPlease analyze this document for content, safety compliance, and classification.`;
      }
    } else {
      fallbackText = `Document: ${file.name}\n\nThis is a ${file.type || 'unknown type'} document containing important information. The document is ${(file.size / 1024 / 1024).toFixed(2)} MB in size.\n\nPlease analyze this document for:\n- Content and key information\n- Safety and compliance aspects\n- Entity extraction (departments, dates, amounts, locations, people, regulations)\n- Document classification and priority\n- Risk assessment and recommendations\n\nThis document requires thorough analysis to ensure proper handling and compliance with railway operations standards.`;
    }
    
    return {
      text: fallbackText,
      confidence: 0.6,
      language: 'en',
      provider: 'fallback',
      processingTime: Date.now() - startTime,
      metadata: {
        pageCount: 1,
        imageCount: 0,
        tableCount: 0
      }
    };
  }
  
  // Fallback analysis when AI providers fail
  private async fallbackAnalysis(
    text: string, 
    fileName: string, 
    language: 'en' | 'ml', 
    startTime: number
  ): Promise<DocumentAnalysis> {
    // Use the intelligent fallback from AI service
    return aiService.analyzeDocument(text, fileName, language);
  }
  
  // Batch processing for multiple documents
  async processDocuments(
    files: File[], 
    language: 'en' | 'ml' = 'en'
  ): Promise<DocumentProcessingResult[]> {
    const results: DocumentProcessingResult[] = [];
    
    // Process documents in parallel (limit to 5 concurrent)
    const batchSize = 5;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const batchPromises = batch.map(file => {
        const documentId = `doc_${Math.random().toString(36).slice(2)}`;
        return this.processDocument(file, documentId, language);
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    
    return results;
  }
  
  // Get processing statistics
  getProcessingStats(results: DocumentProcessingResult[]) {
    const stats = {
      total: results.length,
      successful: results.filter(r => r.status === 'success').length,
      partial: results.filter(r => r.status === 'partial').length,
      failed: results.filter(r => r.status === 'failed').length,
      averageProcessingTime: results.reduce((sum, r) => sum + r.processingTime, 0) / results.length,
      totalProcessingTime: results.reduce((sum, r) => sum + r.processingTime, 0),
      fileTypes: {} as { [key: string]: number },
      providers: {
        ocr: {} as { [key: string]: number },
        ai: {} as { [key: string]: number }
      }
    };
    
    results.forEach(result => {
      // Count file types
      const fileType = result.fileType || 'unknown';
      stats.fileTypes[fileType] = (stats.fileTypes[fileType] || 0) + 1;
      
      // Count OCR providers
      const ocrProvider = result.ocr.provider;
      stats.providers.ocr[ocrProvider] = (stats.providers.ocr[ocrProvider] || 0) + 1;
      
      // Count AI providers
      const aiProvider = result.analysis.provider;
      stats.providers.ai[aiProvider] = (stats.providers.ai[aiProvider] || 0) + 1;
    });
    
    return stats;
  }
  
  // Health check for all services
  async healthCheck(): Promise<{
    ocr: { [key: string]: boolean };
    ai: { [key: string]: boolean };
    overall: boolean;
  }> {
    const [ocrHealth, aiHealth] = await Promise.all([
      ocrService.healthCheck(),
      aiService.healthCheck()
    ]);
    
    const overall = Object.values(ocrHealth).some(healthy => healthy) && 
                   Object.values(aiHealth).some(healthy => healthy);
    
    return {
      ocr: ocrHealth,
      ai: aiHealth,
      overall
    };
  }
}

// Export singleton instance
export const documentProcessor = new DocumentProcessor();
