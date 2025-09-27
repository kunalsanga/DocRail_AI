import { NextRequest, NextResponse } from 'next/server';

// Lightweight ML API that doesn't include heavy dependencies
export async function GET(request: NextRequest) {
  try {
    // Simple fallback summarization without heavy ML dependencies
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text') || '';
    
    if (!text) {
      return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
    }

    // Use lightweight extractive summarization
    const summary = await lightweightSummarization(text);
    
    return NextResponse.json({
      summary,
      model: 'lightweight-fallback',
      confidence: 0.8,
      processingTime: 0,
      wordCount: summary.split(' ').length,
      originalWordCount: text.split(' ').length,
      compressionRatio: summary.split(' ').length / text.split(' ').length
    });
  } catch (error) {
    console.error('Lightweight ML API error:', error);
    return NextResponse.json({ error: 'Summarization failed' }, { status: 500 });
  }
}

// Lightweight extractive summarization
async function lightweightSummarization(text: string): Promise<string> {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  if (sentences.length === 0) {
    return text.substring(0, 200) + '...';
  }

  // Simple scoring based on position and keywords
  const scoredSentences = sentences.map((sentence, index) => {
    let score = 0;
    
    // Position-based scoring
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

  // Get top sentences
  const topSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(2, sentences.length))
    .map(s => s.sentence);

  return topSentences.join('. ') + '.';
}
