import { NextRequest, NextResponse } from "next/server";
import { progressAwareDocumentProcessor } from "@/lib/progress-aware-document-processor";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('documentId');
    
    if (!documentId) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
    }
    
    // Get the processing result from the progress-aware document processor
    const processingResult = progressAwareDocumentProcessor.getProcessingResult(documentId);
    
    if (!processingResult) {
      return NextResponse.json({ 
        error: "Document not found or processing not completed",
        documentId 
      }, { status: 404 });
    }
    
    // Return the summary and analysis data
    return NextResponse.json({
      success: true,
      documentId,
      summary: processingResult.analysis.summary,
      analysis: {
        entities: processingResult.analysis.entities,
        classification: processingResult.analysis.classification,
        safety: processingResult.analysis.safety,
        confidence: processingResult.analysis.confidence,
        processingTime: processingResult.analysis.processingTime,
        provider: processingResult.analysis.provider
      },
      ocr: {
        text: processingResult.ocr.text,
        confidence: processingResult.ocr.confidence,
        language: processingResult.ocr.language,
        wordCount: processingResult.ocr.wordCount,
        characterCount: processingResult.ocr.characterCount
      },
      processing: {
        status: processingResult.status,
        processingTime: processingResult.processingTime,
        errors: processingResult.errors
      }
    });
    
  } catch (error) {
    console.error('Error retrieving document summary:', error);
    return NextResponse.json({ 
      error: "Failed to retrieve document summary",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { documentId } = body;
    
    if (!documentId) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
    }
    
    // Get the processing result from the progress-aware document processor
    const processingResult = progressAwareDocumentProcessor.getProcessingResult(documentId);
    
    if (!processingResult) {
      return NextResponse.json({ 
        error: "Document not found or processing not completed",
        documentId 
      }, { status: 404 });
    }
    
    // Return the summary and analysis data
    return NextResponse.json({
      success: true,
      documentId,
      summary: processingResult.analysis.summary,
      analysis: processingResult.analysis,
      ocr: processingResult.ocr,
      processing: {
        status: processingResult.status,
        processingTime: processingResult.processingTime,
        errors: processingResult.errors
      }
    });
    
  } catch (error) {
    console.error('Error retrieving document summary:', error);
    return NextResponse.json({ 
      error: "Failed to retrieve document summary",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
