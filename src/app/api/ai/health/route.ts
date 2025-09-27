// AI Services Health Check API
import { NextRequest, NextResponse } from "next/server";
import { documentProcessor } from "@/lib/document-processor";

export async function GET(req: NextRequest) {
  try {
    console.log('Performing AI services health check...');
    
    const healthStatus = await documentProcessor.healthCheck();
    
    const response = {
      timestamp: new Date().toISOString(),
      status: healthStatus.overall ? 'healthy' : 'degraded',
      services: {
        ocr: {
          status: Object.values(healthStatus.ocr).some(healthy => healthy) ? 'available' : 'unavailable',
          providers: healthStatus.ocr
        },
        ai: {
          status: Object.values(healthStatus.ai).some(healthy => healthy) ? 'available' : 'unavailable',
          providers: healthStatus.ai
        }
      },
      recommendations: generateRecommendations(healthStatus)
    };
    
    console.log('Health check completed:', response);
    
    return NextResponse.json(response, { 
      status: healthStatus.overall ? 200 : 503 
    });
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'unhealthy',
      error: 'Health check failed',
      services: {
        ocr: { status: 'unknown', providers: {} },
        ai: { status: 'unknown', providers: {} }
      },
      recommendations: ['Check server logs for detailed error information']
    }, { status: 500 });
  }
}

function generateRecommendations(healthStatus: any): string[] {
  const recommendations: string[] = [];
  
  // OCR recommendations
  const ocrHealthy = Object.values(healthStatus.ocr).some(healthy => healthy);
  if (!ocrHealthy) {
    recommendations.push('Configure OCR service API keys (Google Cloud Vision, Azure Vision, or Tesseract.js)');
  }
  
  // AI recommendations
  const aiHealthy = Object.values(healthStatus.ai).some(healthy => healthy);
  if (!aiHealthy) {
    recommendations.push('Configure AI service API keys (Gemini, OpenAI, or Anthropic)');
  }
  
  // General recommendations
  if (!healthStatus.overall) {
    recommendations.push('All AI services are unavailable - using intelligent fallback systems');
    recommendations.push('Consider adding API keys for better document processing capabilities');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('All AI services are functioning normally');
  }
  
  return recommendations;
}
