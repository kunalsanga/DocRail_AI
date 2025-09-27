"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Removed unused Label import
// Removed unused imports for better performance
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AIStatusIndicator from "@/components/AIStatusIndicator";
import { 
  Upload, 
  FileText, 
  X, 
  ArrowLeft,
  Bell,
  Search,
  Bot,
  FileType,
  Image as ImageIcon,
  Shield
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import IconBadge from "@/components/ui/IconBadge";
const BilingualSummary = dynamic(() => import("@/components/translation/BilingualSummary"), { 
  ssr: false, 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded"></div>
});
const AnnotationsPanel = dynamic(() => import("@/components/annotations/AnnotationsPanel"), { 
  ssr: false, 
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded"></div>
});

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<{ id: string; name: string; status: string; progress: number }[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles]);
      
      // Process all files in parallel for faster upload
      setIsProcessing(true);
      
      const uploadPromises = selectedFiles.map(async (f): Promise<{ id: string; name: string; status: string; progress: number }> => {
        const docId = `doc_${Math.random().toString(36).slice(2)}`;
        try {
          // Create document version and audit log in parallel
          await Promise.all([
            fetch("/api/documents/versions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                documentId: docId,
                createdBy: { id: user?.id || "1", name: user?.name || "User" },
                summary: `Initial upload for ${f.name}`,
                changeNote: "Initial upload",
              }),
            }),
            fetch("/api/audit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                documentId: docId,
                actor: { id: user?.id || "1", name: user?.name || "User" },
                action: "upload",
                details: { fileName: f.name, size: f.size },
              }),
            })
          ]);

          // Trigger AI processing pipeline in background (non-blocking)
          fetch("/api/pipeline/extract", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              documentId: docId,
              text: `Sample extracted text from ${f.name}. This document contains important information that requires analysis and processing.`,
              language: f.name.toLowerCase().includes('.ml') ? "ml" : "en"
            }),
          }).catch(() => {}); // Don't fail upload if AI processing fails

          // Trigger safety detection in background (non-blocking)
          fetch("/api/safety/detect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              documentId: docId,
              text: `Safety analysis for ${f.name}. This document may contain safety-related information that requires review.`,
              language: f.name.toLowerCase().includes('.ml') ? "ml" : "en"
            }),
          }).catch(() => {}); // Don't fail upload if safety detection fails

          return { id: docId, name: f.name, status: "Uploaded", progress: 100 };
        } catch {
          return { id: docId, name: f.name, status: "Error", progress: 0 };
        }
      });
      
      // Wait for all uploads to complete
      const results = await Promise.all(uploadPromises);
      setUploadedDocs(prev => [...results, ...prev]);
      setIsProcessing(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles]);
      
      // Process all files in parallel for faster upload
      setIsProcessing(true);
      
      const uploadPromises = droppedFiles.map(async (f): Promise<{ id: string; name: string; status: string; progress: number }> => {
        const docId = `doc_${Math.random().toString(36).slice(2)}`;
        try {
          // Create document version and audit log in parallel
          await Promise.all([
            fetch("/api/documents/versions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                documentId: docId,
                createdBy: { id: user?.id || "1", name: user?.name || "User" },
                summary: `Initial upload for ${f.name}`,
                changeNote: "Initial upload",
              }),
            }),
            fetch("/api/audit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                documentId: docId,
                actor: { id: user?.id || "1", name: user?.name || "User" },
                action: "upload",
                details: { fileName: f.name, size: f.size },
              }),
            })
          ]);

          // Trigger AI processing pipeline in background (non-blocking)
          fetch("/api/pipeline/extract", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              documentId: docId,
              text: `Sample extracted text from ${f.name}. This document contains important information that requires analysis and processing.`,
              language: f.name.toLowerCase().includes('.ml') ? "ml" : "en"
            }),
          }).catch(() => {}); // Don't fail upload if AI processing fails

          // Trigger safety detection in background (non-blocking)
          fetch("/api/safety/detect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              documentId: docId,
              text: `Safety analysis for ${f.name}. This document may contain safety-related information that requires review.`,
              language: f.name.toLowerCase().includes('.ml') ? "ml" : "en"
            }),
          }).catch(() => {}); // Don't fail upload if safety detection fails

          return { id: docId, name: f.name, status: "Uploaded", progress: 100 };
        } catch {
          return { id: docId, name: f.name, status: "Error", progress: 0 };
        }
      });

      // Wait for all uploads to complete
      const results = await Promise.all(uploadPromises);
      setUploadedDocs(prev => [...results, ...prev]);
      setIsProcessing(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["engineer", "admin"]}>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white shadow-lg flex flex-col h-screen sticky top-0">
          

          {/* Navigation */}
          <div className="p-6 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{t("sidebar.navigation")}</h3>
            <nav className="space-y-2">
              <Link prefetch href="/dashboard" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5" />
                <span>{t("sidebar.dashboard")}</span>
              </Link>
              <button className="w-full flex items-center space-x-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg">
                <Upload className="w-5 h-5" />
                <span className="font-medium">{t("sidebar.upload")}</span>
              </button>
              <Link prefetch href="/search" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                <Search className="w-5 h-5" />
                <span>{t("sidebar.search")}</span>
              </Link>
              <Link prefetch href="/compliance" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5" />
                <span>{t("sidebar.compliance")}</span>
              </Link>
              <Link prefetch href="/notifications" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg relative">
                <Bell className="w-5 h-5" />
                <span>{t("sidebar.notifications")}</span>
                <div className="absolute right-3 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </div>
              </Link>
              <Link prefetch href="/knowledge-hub" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5" />
                <span>{t("sidebar.knowledge")}</span>
              </Link>
            </nav>
          </div>

          {/* Quick Stats */}
          <div className="p-6 border-t border-gray-200 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">QUICK STATS</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t("stats.totalDocs")}</span>
                <span className="font-semibold text-gray-900">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t("stats.pendingReview")}</span>
                <span className="font-semibold text-orange-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t("stats.criticalAlerts")}</span>
                <span className="font-semibold text-red-600">3</span>
              </div>
            </div>
          </div>

          
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{t("upload.title")}</h1>
                  <p className="text-gray-600 mt-1">{t("upload.subtitle")}</p>
                </div>
              </div>
              
              {/* Language Switcher and AI Status */}
              <div className="flex flex-col items-end space-y-2">
                <LanguageSwitcher />
                <AIStatusIndicator />
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <Upload className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">{t("upload.dragDrop")}</h2>
            </div>
            
            <Card 
              className={`bg-white shadow-sm border-2 border-dashed transition-all duration-200 ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <CardContent className="p-8 sm:p-12 text-center">
                {/* Professional Icon */}
                <div className="mx-auto mb-6">
                  <IconBadge color={isDragOver ? "blue" : "slate"} size="md">
                    <Upload />
                  </IconBadge>
                </div>

                {/* Main Text */}
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  {isDragOver ? t("upload.dragDropActive") : t("upload.dragDrop")}
                </h3>
                
                <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-md mx-auto">
                  {isDragOver 
                    ? t("upload.dragDropActiveDesc")
                    : t("upload.dragDropDesc")
                  }
                </p>

                {/* Professional File Input Container */}
                <div className="relative">
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept=".pdf,.docx,.png,.jpeg,.jpg"
                    id="file-upload-input"
                  />
                  
                  {/* Custom Button */}
                  <label 
                    htmlFor="file-upload-input"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
                  >
                    <Upload className="w-5 h-5 mr-3" />
                    {t("upload.chooseFiles")}
                  </label>
                </div>

                {/* File Type Info */}
                <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>PDF</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>DOCX</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Images</span>
                  </div>
                </div>

                {/* File Size Limit */}
                <p className="text-sm text-gray-400 mt-4">
                  {t("upload.maxSize")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Selected Files Preview */}
          {files.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{t("upload.selectedFiles")}</h2>
                    <p className="text-sm text-gray-500">{files.length} {t("upload.filesReady")}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setFiles([])}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    <X className="w-4 h-4 mr-2" />
                    {t("upload.clearAll")}
                  </Button>
                </div>
              </div>
              
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{file.name}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <p className="text-sm text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              <p className="text-sm text-gray-500">
                                {file.type || 'Unknown type'}
                              </p>
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-green-600 font-medium">{t("upload.ready")}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {t("upload.totalSize")} {(files.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)} MB
                      </div>
                      <Button
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        onClick={() => {
                          // Process upload
                          console.log('Uploading files:', files);
                          setFiles([]);
                        }}
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        {t("upload.uploadAll")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Document Type Examples */}
          <div className="mb-8">
            <div className="grid grid-cols-3 gap-6">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t("upload.pdfDocs")}</h3>
                  <p className="text-sm text-gray-600">{t("upload.pdfDesc")}</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileType className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t("upload.wordDocs")}</h3>
                  <p className="text-sm text-gray-600">{t("upload.wordDesc")}</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t("upload.images")}</h3>
                  <p className="text-sm text-gray-600">{t("upload.imagesDesc")}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* AI Processing Pipeline */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Bot className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">{t("upload.aiPipeline")}</h2>
              {isProcessing && (
                <div className="ml-4 flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-blue-600 font-medium">{t("upload.processing")}</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{t("upload.step1")}</h3>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{t("upload.step2")}</h3>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{t("upload.step3")}</h3>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  4
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{t("upload.step4")}</h3>
              </div>
            </div>
          </div>

          {/* Recently Uploaded (demo doc ids) */}
          {uploadedDocs.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center space-x-2 mb-2">
                <Bot className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">{t("upload.recentlyUploaded")}</h2>
              </div>
              <div className="space-y-2">
                {uploadedDocs.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3 bg-white border rounded">
                    <div className="text-sm">
                      <div className="font-medium">{d.name}</div>
                      <div className="text-xs text-gray-500">ID: {d.id}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => router.push("/compliance")}>{t("upload.audit")}</Button>
                      <Button size="sm" variant="outline" onClick={() => router.push("/knowledge-hub")}>{t("upload.graph")}</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bilingual Summary & Annotations (for uploaded files) */}
          {uploadedDocs.length > 0 && (
            <div className="grid grid-cols-2 gap-6 mt-8">
              <BilingualSummary 
                documentId={uploadedDocs[0].id} 
                englishSummary={`AI-generated summary for ${uploadedDocs[0].name}: This document has been processed and analyzed. Key insights include safety protocols, compliance requirements, and operational procedures that require immediate attention and implementation across all departments.`} 
              />
              <AnnotationsPanel documentId={uploadedDocs[0].id} />
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
