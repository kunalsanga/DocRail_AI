// AI Service Configuration
export interface AIConfig {
  providers: {
    gemini: {
      enabled: boolean;
      apiKey?: string;
      model: string;
      fallbackEnabled: boolean;
    };
    openai: {
      enabled: boolean;
      apiKey?: string;
      model: string;
      fallbackEnabled: boolean;
    };
    anthropic: {
      enabled: boolean;
      apiKey?: string;
      model: string;
      fallbackEnabled: boolean;
    };
  };
  ocr: {
    providers: {
      tesseract: {
        enabled: boolean;
        fallbackEnabled: boolean;
      };
      googleVision: {
        enabled: boolean;
        apiKey?: string;
        fallbackEnabled: boolean;
      };
      azureVision: {
        enabled: boolean;
        apiKey?: string;
        endpoint?: string;
        fallbackEnabled: boolean;
      };
    };
  };
  processing: {
    maxFileSize: number; // in bytes
    supportedFormats: string[];
    batchSize: number;
    timeout: number; // in milliseconds
    retryAttempts: number;
  };
  fallback: {
    enabled: boolean;
    intelligentAnalysis: boolean;
    mockResponses: boolean;
  };
}

// Default configuration
export const defaultAIConfig: AIConfig = {
  providers: {
    gemini: {
      enabled: !!process.env.GEMINI_API_KEY,
      apiKey: process.env.GEMINI_API_KEY,
      model: 'gemini-1.5-flash',
      fallbackEnabled: true
    },
    openai: {
      enabled: !!process.env.OPENAI_API_KEY,
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-3.5-turbo',
      fallbackEnabled: true
    },
    anthropic: {
      enabled: !!process.env.ANTHROPIC_API_KEY,
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-3-haiku-20240307',
      fallbackEnabled: true
    }
  },
  ocr: {
    providers: {
      tesseract: {
        enabled: true,
        fallbackEnabled: true
      },
      googleVision: {
        enabled: !!process.env.GOOGLE_CLOUD_VISION_API_KEY,
        apiKey: process.env.GOOGLE_CLOUD_VISION_API_KEY,
        fallbackEnabled: true
      },
      azureVision: {
        enabled: !!process.env.AZURE_VISION_API_KEY,
        apiKey: process.env.AZURE_VISION_API_KEY,
        endpoint: process.env.AZURE_VISION_ENDPOINT,
        fallbackEnabled: true
      }
    }
  },
  processing: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedFormats: ['pdf', 'docx', 'doc', 'txt', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'],
    batchSize: 5,
    timeout: 30000, // 30 seconds
    retryAttempts: 3
  },
  fallback: {
    enabled: true,
    intelligentAnalysis: true,
    mockResponses: false
  }
};

// Configuration manager
export class AIConfigManager {
  private config: AIConfig;

  constructor(config: AIConfig = defaultAIConfig) {
    this.config = config;
  }

  getConfig(): AIConfig {
    return this.config;
  }

  updateConfig(updates: Partial<AIConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  isProviderEnabled(provider: keyof AIConfig['providers']): boolean {
    return this.config.providers[provider].enabled;
  }

  isOCRProviderEnabled(provider: keyof AIConfig['ocr']['providers']): boolean {
    return this.config.ocr.providers[provider].enabled;
  }

  getProviderConfig(provider: keyof AIConfig['providers']) {
    return this.config.providers[provider];
  }

  getOCRProviderConfig(provider: keyof AIConfig['ocr']['providers']) {
    return this.config.ocr.providers[provider];
  }

  isFileSupported(fileName: string): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension ? this.config.processing.supportedFormats.includes(extension) : false;
  }

  isFileSizeValid(fileSize: number): boolean {
    return fileSize <= this.config.processing.maxFileSize;
  }

  getProcessingConfig() {
    return this.config.processing;
  }

  getFallbackConfig() {
    return this.config.fallback;
  }

  // Validate configuration
  validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if at least one AI provider is enabled
    const hasAIProvider = Object.values(this.config.providers).some(provider => provider.enabled);
    if (!hasAIProvider) {
      errors.push('At least one AI provider must be enabled');
    }

    // Check if at least one OCR provider is enabled
    const hasOCRProvider = Object.values(this.config.ocr.providers).some(provider => provider.enabled);
    if (!hasOCRProvider) {
      errors.push('At least one OCR provider must be enabled');
    }

    // Check if fallback is enabled when no providers are available
    if (!hasAIProvider && !this.config.fallback.enabled) {
      errors.push('Fallback must be enabled when no AI providers are available');
    }

    // Validate API keys for enabled providers
    Object.entries(this.config.providers).forEach(([name, provider]) => {
      if (provider.enabled && !provider.apiKey) {
        errors.push(`${name} provider is enabled but no API key is configured`);
      }
    });

    Object.entries(this.config.ocr.providers).forEach(([name, provider]) => {
      if (provider.enabled && name !== 'tesseract' && 'apiKey' in provider && !provider.apiKey) {
        errors.push(`${name} OCR provider is enabled but no API key is configured`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Get configuration summary
  getConfigSummary(): {
    ai: { enabled: number; total: number; providers: string[] };
    ocr: { enabled: number; total: number; providers: string[] };
    fallback: boolean;
    supportedFormats: string[];
    maxFileSize: string;
  } {
    const aiProviders = Object.entries(this.config.providers);
    const ocrProviders = Object.entries(this.config.ocr.providers);

    return {
      ai: {
        enabled: aiProviders.filter(([, config]) => config.enabled).length,
        total: aiProviders.length,
        providers: aiProviders.filter(([, config]) => config.enabled).map(([name]) => name)
      },
      ocr: {
        enabled: ocrProviders.filter(([, config]) => config.enabled).length,
        total: ocrProviders.length,
        providers: ocrProviders.filter(([, config]) => config.enabled).map(([name]) => name)
      },
      fallback: this.config.fallback.enabled,
      supportedFormats: this.config.processing.supportedFormats,
      maxFileSize: `${Math.round(this.config.processing.maxFileSize / (1024 * 1024))}MB`
    };
  }
}

// Export singleton instance
export const aiConfigManager = new AIConfigManager();
