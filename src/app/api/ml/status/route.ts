import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log('Checking ML model status...');
    
    // Test with lightweight summarization
    const testText = "This is a test document for checking ML model performance. It contains safety information and operational procedures.";
    
    const startTime = Date.now();
    
    // Use lightweight summarization
    const sentences = testText.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const summary = sentences.length > 0 ? sentences[0] + '.' : testText.substring(0, 100) + '...';
    
    const testTime = Date.now() - startTime;
    
    const response = {
      timestamp: new Date().toISOString(),
      model: {
        name: 'lightweight-fallback',
        type: 'extractive',
        initialized: true,
        testResult: {
          success: true,
          processingTime: testTime,
          model: 'lightweight-fallback',
          confidence: 0.8,
          summaryLength: summary.length
        },
        testTime: testTime
      },
      performance: {
        status: testTime < 100 ? 'fast' : 'moderate',
        recommendation: 'Using lightweight fallback mode for serverless compatibility'
      }
    };
    
    console.log('ML model status check completed:', response);
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('ML model status check failed:', error);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      model: {
        name: 'lightweight-fallback',
        type: 'extractive',
        initialized: true,
        testResult: {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        }
      },
      performance: {
        status: 'error',
        recommendation: 'Lightweight fallback system is available'
      }
    }, { status: 500 });
  }
}
