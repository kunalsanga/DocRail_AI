"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function AIStatusIndicator() {
  const [status, setStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    const checkAIStatus = async () => {
      try {
        // Test a simple AI request
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentId: 'test',
            text: 'test',
            sourceLang: 'en',
            targetLang: 'ml'
          })
        });
        
        if (response.ok) {
          setStatus('available');
        } else {
          setStatus('unavailable');
        }
      } catch (error) {
        setStatus('unavailable');
      }
      setLastChecked(new Date());
    };

    checkAIStatus();
    // Check every 5 minutes
    const interval = setInterval(checkAIStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'available': return 'text-green-600';
      case 'unavailable': return 'text-orange-600';
      default: return 'text-blue-600';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'available': return 'AI Services Online';
      case 'unavailable': return 'AI Services Offline (Using Fallback)';
      default: return 'Checking AI Status...';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'unavailable': return <AlertCircle className="w-4 h-4" />;
      default: return <Loader2 className="w-4 h-4 animate-spin" />;
    }
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>
      {lastChecked && (
        <span className="text-xs text-gray-500">
          Last checked: {lastChecked.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
