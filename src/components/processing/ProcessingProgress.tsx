"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Bot, 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Loader2
} from "lucide-react";

export interface ProcessingStage {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  estimatedTime?: number;
  actualTime?: number;
  icon: React.ReactNode;
}

interface ProcessingProgressProps {
  documentId: string;
  fileName: string;
  stages: ProcessingStage[];
  overallProgress: number;
  isProcessing: boolean;
  startTime: number;
  onComplete?: () => void;
}

export default function ProcessingProgress({
  documentId,
  fileName,
  stages,
  overallProgress,
  isProcessing,
  startTime,
  onComplete
}: ProcessingProgressProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTotalTime, setEstimatedTotalTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isProcessing) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing, startTime]);

  useEffect(() => {
    // Calculate estimated total time based on completed stages
    const completedStages = stages.filter(stage => stage.status === 'completed');
    if (completedStages.length > 0) {
      const avgTimePerStage = completedStages.reduce((sum, stage) => 
        sum + (stage.actualTime || 0), 0) / completedStages.length;
      const remainingStages = stages.filter(stage => stage.status !== 'completed').length;
      setEstimatedTotalTime(avgTimePerStage * remainingStages);
    }
  }, [stages]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const getStageIcon = (stage: ProcessingStage) => {
    switch (stage.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        // Set default icons based on stage ID
        switch (stage.id) {
          case 'upload':
            return <FileText className="w-5 h-5 text-gray-600" />;
          case 'ocr':
          case 'analysis':
          case 'indexing':
            return <Bot className="w-5 h-5 text-gray-600" />;
          case 'safety':
            return <Shield className="w-5 h-5 text-gray-600" />;
          default:
            return <FileText className="w-5 h-5 text-gray-600" />;
        }
    }
  };

  const getStageBadgeColor = (stage: ProcessingStage) => {
    switch (stage.status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOverallStatus = () => {
    if (stages.some(stage => stage.status === 'error')) {
      return { text: 'Error', color: 'text-red-600' };
    }
    if (overallProgress === 100) {
      return { text: 'Completed', color: 'text-green-600' };
    }
    if (isProcessing) {
      return { text: 'Processing', color: 'text-blue-600' };
    }
    return { text: 'Pending', color: 'text-gray-600' };
  };

  const status = getOverallStatus();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                {fileName}
              </h3>
              <p className="text-sm text-gray-500">ID: {documentId}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge className={`${status.color} border`}>
              {status.text}
            </Badge>
            <p className="text-sm text-gray-500 mt-1">
              {formatTime(elapsedTime)}
            </p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Overall Progress
            </span>
            <span className="text-sm text-gray-500">
              {overallProgress}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-2" />
          {estimatedTotalTime > 0 && isProcessing && (
            <p className="text-xs text-gray-500 mt-1">
              Estimated time remaining: {formatTime(estimatedTotalTime)}
            </p>
          )}
        </div>

        {/* Processing Stages */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Processing Stages
          </h4>
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex items-center space-x-4 p-3 rounded-lg border">
              <div className="flex-shrink-0">
                {getStageIcon(stage)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="text-sm font-medium text-gray-900">
                    {stage.name}
                  </h5>
                  <Badge className={`text-xs ${getStageBadgeColor(stage)}`}>
                    {stage.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  {stage.description}
                </p>
                {stage.status === 'processing' && (
                  <Progress value={stage.progress} className="h-1" />
                )}
                {stage.actualTime && (
                  <p className="text-xs text-gray-500 mt-1">
                    Completed in {formatTime(stage.actualTime)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Processing Stats */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {stages.filter(s => s.status === 'completed').length}
              </p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {stages.filter(s => s.status === 'processing').length}
              </p>
              <p className="text-xs text-gray-500">Processing</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">
                {stages.filter(s => s.status === 'pending').length}
              </p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
