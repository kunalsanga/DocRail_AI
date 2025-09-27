"use client";

import { useState, useCallback } from "react";
import { ProcessingStage } from "@/components/processing/ProcessingProgress";

export interface DocumentProcessingState {
  documentId: string;
  fileName: string;
  isProcessing: boolean;
  overallProgress: number;
  stages: ProcessingStage[];
  startTime: number;
  error?: string;
}

export interface ProcessingOptions {
  onProgress?: (progress: number) => void;
  onStageComplete?: (stageId: string) => void;
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
}

export function useDocumentProcessing() {
  const [processingStates, setProcessingStates] = useState<Map<string, DocumentProcessingState>>(new Map());

  const createProcessingState = useCallback((documentId: string, fileName: string): DocumentProcessingState => {
    const stages: ProcessingStage[] = [
      {
        id: 'upload',
        name: 'File Upload',
        description: 'Uploading document to server',
        status: 'pending',
        progress: 0,
        estimatedTime: 2000,
        icon: null // Will be set by the component
      },
      {
        id: 'ocr',
        name: 'OCR Processing',
        description: 'Extracting text from document',
        status: 'pending',
        progress: 0,
        estimatedTime: 5000,
        icon: null // Will be set by the component
      },
      {
        id: 'analysis',
        name: 'AI Analysis',
        description: 'Analyzing document content and structure',
        status: 'pending',
        progress: 0,
        estimatedTime: 8000,
        icon: null // Will be set by the component
      },
      {
        id: 'safety',
        name: 'Safety Check',
        description: 'Checking for safety and compliance issues',
        status: 'pending',
        progress: 0,
        estimatedTime: 3000,
        icon: null // Will be set by the component
      },
      {
        id: 'indexing',
        name: 'Knowledge Indexing',
        description: 'Indexing document in knowledge graph',
        status: 'pending',
        progress: 0,
        estimatedTime: 2000,
        icon: null // Will be set by the component
      }
    ];

    return {
      documentId,
      fileName,
      isProcessing: true,
      overallProgress: 0,
      stages,
      startTime: Date.now()
    };
  }, []);

  const startProcessing = useCallback((documentId: string, fileName: string) => {
    const state = createProcessingState(documentId, fileName);
    setProcessingStates(prev => new Map(prev).set(documentId, state));
    return state;
  }, [createProcessingState]);

  const updateStage = useCallback((
    documentId: string, 
    stageId: string, 
    updates: Partial<ProcessingStage>
  ) => {
    setProcessingStates(prev => {
      const newMap = new Map(prev);
      const state = newMap.get(documentId);
      if (!state) return newMap;

      const updatedStages = state.stages.map(stage => 
        stage.id === stageId ? { ...stage, ...updates } : stage
      );

      // Calculate overall progress
      const completedStages = updatedStages.filter(s => s.status === 'completed').length;
      const processingStages = updatedStages.filter(s => s.status === 'processing');
      const processingProgress = processingStages.reduce((sum, s) => sum + s.progress, 0) / processingStages.length;
      const overallProgress = ((completedStages + (processingStages.length > 0 ? processingProgress / 100 : 0)) / updatedStages.length) * 100;

      newMap.set(documentId, {
        ...state,
        stages: updatedStages,
        overallProgress: Math.round(overallProgress)
      });

      return newMap;
    });
  }, []);

  const completeStage = useCallback((documentId: string, stageId: string, actualTime?: number) => {
    updateStage(documentId, stageId, {
      status: 'completed',
      progress: 100,
      actualTime
    });
  }, [updateStage]);

  const startStage = useCallback((documentId: string, stageId: string) => {
    updateStage(documentId, stageId, {
      status: 'processing',
      progress: 0
    });
  }, [updateStage]);

  const updateStageProgress = useCallback((documentId: string, stageId: string, progress: number) => {
    updateStage(documentId, stageId, { progress });
  }, [updateStage]);

  const setStageError = useCallback((documentId: string, stageId: string, error: string) => {
    updateStage(documentId, stageId, {
      status: 'error',
      progress: 0
    });
    
    setProcessingStates(prev => {
      const newMap = new Map(prev);
      const state = newMap.get(documentId);
      if (!state) return newMap;

      newMap.set(documentId, {
        ...state,
        isProcessing: false,
        error
      });

      return newMap;
    });
  }, [updateStage]);

  const completeProcessing = useCallback((documentId: string, result?: any) => {
    setProcessingStates(prev => {
      const newMap = new Map(prev);
      const state = newMap.get(documentId);
      if (!state) return newMap;

      newMap.set(documentId, {
        ...state,
        isProcessing: false,
        overallProgress: 100
      });

      return newMap;
    });
  }, []);

  const getProcessingState = useCallback((documentId: string) => {
    return processingStates.get(documentId);
  }, [processingStates]);

  const removeProcessingState = useCallback((documentId: string) => {
    setProcessingStates(prev => {
      const newMap = new Map(prev);
      newMap.delete(documentId);
      return newMap;
    });
  }, []);

  const getAllProcessingStates = useCallback(() => {
    return Array.from(processingStates.values());
  }, [processingStates]);

  return {
    startProcessing,
    updateStage,
    completeStage,
    startStage,
    updateStageProgress,
    setStageError,
    completeProcessing,
    getProcessingState,
    removeProcessingState,
    getAllProcessingStates
  };
}
