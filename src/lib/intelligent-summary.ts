// Intelligent summary generator for when AI services are unavailable
export function generateIntelligentSummary(text: string, language: 'en' | 'ml' = 'en'): string {
  const words = text.split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  // Extract key information
  const documentType = detectDocumentType(text);
  const priority = detectPriority(text);
  const keyTerms = extractKeyTerms(text);
  const importantSentences = extractImportantSentences(sentences);
  const safetyInfo = extractSafetyInfo(text);
  const complianceInfo = extractComplianceInfo(text);
  
  if (language === 'ml') {
    return generateMalayalamSummary({
      documentType,
      priority,
      keyTerms,
      importantSentences,
      safetyInfo,
      complianceInfo
    });
  } else {
    return generateEnglishSummary({
      documentType,
      priority,
      keyTerms,
      importantSentences,
      safetyInfo,
      complianceInfo
    });
  }
}

function detectDocumentType(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('safety') || lowerText.includes('hazard') || lowerText.includes('accident')) {
    return 'Safety Document';
  } else if (lowerText.includes('maintenance') || lowerText.includes('repair') || lowerText.includes('inspection')) {
    return 'Maintenance Document';
  } else if (lowerText.includes('budget') || lowerText.includes('cost') || lowerText.includes('financial')) {
    return 'Financial Document';
  } else if (lowerText.includes('personnel') || lowerText.includes('employee') || lowerText.includes('hr')) {
    return 'HR Document';
  } else if (lowerText.includes('operation') || lowerText.includes('service') || lowerText.includes('schedule')) {
    return 'Operations Document';
  } else if (lowerText.includes('compliance') || lowerText.includes('regulation') || lowerText.includes('standard')) {
    return 'Compliance Document';
  } else {
    return 'General Document';
  }
}

function detectPriority(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('urgent') || lowerText.includes('critical') || lowerText.includes('emergency')) {
    return 'High Priority';
  } else if (lowerText.includes('important') || lowerText.includes('priority') || lowerText.includes('asap')) {
    return 'Medium Priority';
  } else if (lowerText.includes('routine') || lowerText.includes('normal') || lowerText.includes('regular')) {
    return 'Low Priority';
  } else {
    return 'Normal Priority';
  }
}

function extractKeyTerms(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'a', 'an', 'as', 'if', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'now']);
  
  const wordFreq: { [key: string]: number } = {};
  
  words.forEach(word => {
    if (word.length > 3 && !stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  return Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([word]) => word);
}

function extractImportantSentences(sentences: string[]): string[] {
  return sentences
    .filter(sentence => {
      const lower = sentence.toLowerCase();
      return lower.includes('important') || 
             lower.includes('critical') || 
             lower.includes('urgent') || 
             lower.includes('safety') || 
             lower.includes('compliance') ||
             lower.includes('requirement') ||
             lower.includes('deadline') ||
             lower.includes('action');
    })
    .slice(0, 3);
}

function extractSafetyInfo(text: string): string[] {
  const safetyKeywords = ['safety', 'hazard', 'risk', 'accident', 'incident', 'emergency', 'protocol', 'procedure', 'training', 'equipment'];
  const found = safetyKeywords.filter(keyword => text.toLowerCase().includes(keyword));
  return found;
}

function extractComplianceInfo(text: string): string[] {
  const complianceKeywords = ['compliance', 'regulation', 'standard', 'requirement', 'audit', 'inspection', 'certification', 'policy'];
  const found = complianceKeywords.filter(keyword => text.toLowerCase().includes(keyword));
  return found;
}

function generateEnglishSummary(data: {
  documentType: string;
  priority: string;
  keyTerms: string[];
  importantSentences: string[];
  safetyInfo: string[];
  complianceInfo: string[];
}): string {
  let summary = `Document Type: ${data.documentType}\n`;
  summary += `Priority Level: ${data.priority}\n\n`;
  
  if (data.keyTerms.length > 0) {
    summary += `Key Terms: ${data.keyTerms.join(', ')}\n\n`;
  }
  
  if (data.safetyInfo.length > 0) {
    summary += `Safety Elements: ${data.safetyInfo.join(', ')}\n\n`;
  }
  
  if (data.complianceInfo.length > 0) {
    summary += `Compliance Elements: ${data.complianceInfo.join(', ')}\n\n`;
  }
  
  if (data.importantSentences.length > 0) {
    summary += `Key Points:\n`;
    data.importantSentences.forEach((sentence, index) => {
      summary += `${index + 1}. ${sentence.trim()}\n`;
    });
  }
  
  summary += `\n[Intelligent Analysis - AI services temporarily unavailable]`;
  
  return summary;
}

function generateMalayalamSummary(data: {
  documentType: string;
  priority: string;
  keyTerms: string[];
  importantSentences: string[];
  safetyInfo: string[];
  complianceInfo: string[];
}): string {
  const typeTranslations: { [key: string]: string } = {
    'Safety Document': 'സുരക്ഷാ ഡോക്യുമെന്റ്',
    'Maintenance Document': 'പരിപാലന ഡോക്യുമെന്റ്',
    'Financial Document': 'ധനകാര്യ ഡോക്യുമെന്റ്',
    'HR Document': 'എച്ച്.ആർ. ഡോക്യുമെന്റ്',
    'Operations Document': 'പ്രവർത്തന ഡോക്യുമെന്റ്',
    'Compliance Document': 'കമ്പ്ലയൻസ് ഡോക്യുമെന്റ്',
    'General Document': 'പൊതു ഡോക്യുമെന്റ്'
  };
  
  const priorityTranslations: { [key: string]: string } = {
    'High Priority': 'ഉയർന്ന പ്രാധാന്യം',
    'Medium Priority': 'ഇടത്തരം പ്രാധാന്യം',
    'Low Priority': 'കുറഞ്ഞ പ്രാധാന്യം',
    'Normal Priority': 'സാധാരണ പ്രാധാന്യം'
  };
  
  let summary = `ഡോക്യുമെന്റ് തരം: ${typeTranslations[data.documentType] || data.documentType}\n`;
  summary += `പ്രാധാന്യ നില: ${priorityTranslations[data.priority] || data.priority}\n\n`;
  
  if (data.keyTerms.length > 0) {
    summary += `പ്രധാന പദങ്ങൾ: ${data.keyTerms.join(', ')}\n\n`;
  }
  
  if (data.safetyInfo.length > 0) {
    summary += `സുരക്ഷാ ഘടകങ്ങൾ: ${data.safetyInfo.join(', ')}\n\n`;
  }
  
  if (data.complianceInfo.length > 0) {
    summary += `കമ്പ്ലയൻസ് ഘടകങ്ങൾ: ${data.complianceInfo.join(', ')}\n\n`;
  }
  
  if (data.importantSentences.length > 0) {
    summary += `പ്രധാന പോയിന്റുകൾ:\n`;
    data.importantSentences.forEach((sentence, index) => {
      summary += `${index + 1}. ${sentence.trim()}\n`;
    });
  }
  
  summary += `\n[ബുദ്ധിമുട്ടില്ലാത്ത വിശകലനം - AI സേവനങ്ങൾ താൽക്കാലികമായി ലഭ്യമല്ല]`;
  
  return summary;
}
