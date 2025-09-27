import { NextRequest, NextResponse } from "next/server";
import { mlSummarizationService } from "@/lib/ml-summarization-service";

export async function GET(req: NextRequest) {
  try {
    console.log('Checking ML model status...');
    
    const modelInfo = mlSummarizationService.getModelInfo();
    
    // Test the model with a simple text
    const testText = "This is a test document for checking ML model performance. It contains safety information and operational procedures.";
    
    const startTime = Date.now();
    let testResult = null;
    let testError = null;
    
    try {
      testResult = await mlSummarizationService.summarizeText(testText);
    } catch (error) {
      testError = error instanceof Error ? error.message : String(error);
    }
    
    const testTime = Date.now() - startTime;
    
    const response = {
      timestamp: new Date().toISOString(),
      model: {
        name: modelInfo.name,
        type: modelInfo.type,
        initialized: modelInfo.initialized,
        testResult: testResult ? {
          success: true,
          processingTime: testResult.processingTime,
          model: testResult.model,
          confidence: testResult.confidence,
          summaryLength: testResult.summary.length
        } : {
          success: false,
          error: testError,
          fallbackUsed: true
        },
        testTime: testTime
      },
      performance: {
        status: testTime < 2000 ? 'fast' : testTime < 5000 ? 'moderate' : 'slow',
        recommendation: testTime > 5000 ? 'Consider using fast fallback mode' : 'Performance is acceptable'
      }
    };
    
    console.log('ML model status check completed:', response);
    
    return NextResponse.json(response, { 
      status: testResult ? 200 : 503 
    });
    
  } catch (error) {
    console.error('ML model status check failed:', error);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      model: {
        name: 'unknown',
        type: 'unknown',
        initialized: false,
        testResult: {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        }
      },
      performance: {
        status: 'error',
        recommendation: 'ML model is not available - using fallback systems'
      }
    }, { status: 500 });
  }
}
