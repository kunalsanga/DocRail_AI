// Test endpoint for local AI service
import { NextRequest, NextResponse } from "next/server";
import { localAIService } from "@/lib/local-ai-service";
import { localOCRService } from "@/lib/local-ocr-service";
import { localDocumentProcessor } from "@/lib/local-document-processor";

export async function GET(req: NextRequest) {
  try {
    // Test the local AI service with sample text
    const sampleText = `
      Safety Protocol Document
      
      This document outlines critical safety procedures for railway operations.
      All personnel must follow these guidelines to ensure passenger safety.
      
      Key Requirements:
      - Regular equipment inspection every 30 days
      - Emergency response training for all staff
      - Compliance with railway safety standards
      - Incident reporting within 24 hours
      
      Department: Safety Operations
      Priority: High
      Effective Date: 2024-01-15
      Budget: ₹50,00,000 for safety equipment
      
      Contact: John Smith, Safety Manager
      Location: Central Station, Platform 3
    `;
    
    console.log('Testing local AI service...');
    
    // Test AI analysis
    const aiResult = await localAIService.analyzeDocument(sampleText, 'test-document.txt', 'en');
    
    // Test OCR service with a mock file
    const mockFile = new File([sampleText], 'test-document.txt', { type: 'text/plain' });
    const ocrResult = await localOCRService.extractText(mockFile, 'en');
    
    // Test document processor
    const processingResult = await localDocumentProcessor.processDocument(mockFile, 'test-doc-123', 'en');
    
    return NextResponse.json({
      status: 'success',
      message: 'Local AI service is working correctly',
      tests: {
        aiAnalysis: {
          summary: aiResult.summary.substring(0, 200) + '...',
          entities: aiResult.entities,
          classification: aiResult.classification,
          safety: aiResult.safety,
          confidence: aiResult.confidence,
          processingTime: aiResult.processingTime
        },
        ocrService: {
          text: ocrResult.text.substring(0, 200) + '...',
          confidence: ocrResult.confidence,
          processingTime: ocrResult.processingTime,
          wordCount: ocrResult.wordCount
        },
        documentProcessor: {
          status: processingResult.status,
          processingTime: processingResult.processingTime,
          errors: processingResult.errors,
          analysisConfidence: processingResult.analysis.confidence,
          ocrConfidence: processingResult.ocr.confidence
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Local AI service test failed:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Local AI service test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, fileName, language } = body;
    
    if (!text) {
      return NextResponse.json({
        status: 'error',
        message: 'Text content is required'
      }, { status: 400 });
    }
    
    // Test with provided text
    const aiResult = await localAIService.analyzeDocument(
      text, 
      fileName || 'test-document.txt', 
      language || 'en'
    );
    
    return NextResponse.json({
      status: 'success',
      message: 'Local AI analysis completed',
      result: aiResult,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Local AI analysis failed:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Local AI analysis failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
