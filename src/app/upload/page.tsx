"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Upload, 
  FileText, 
  X, 
  Check,
  AlertCircle,
  ArrowLeft,
  Building2,
  Bell,
  Search,
  Users,
  Cog,
  Bot,
  FileImage,
  FileType,
  Image as ImageIcon,
  Shield
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
const BilingualSummary = dynamic(() => import("@/components/translation/BilingualSummary"), { ssr: false, loading: () => null });
const AnnotationsPanel = dynamic(() => import("@/components/annotations/AnnotationsPanel"), { ssr: false, loading: () => null });

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<{ id: string; name: string }[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles]);
      
      // Process each file
      for (const f of selectedFiles) {
        const docId = `doc_${Math.random().toString(36).slice(2)}`;
        try {
          // create initial version
          await fetch("/api/documents/versions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              documentId: docId,
              createdBy: { id: user?.id || "1", name: user?.name || "User" },
              summary: `Initial upload for ${f.name}`,
              changeNote: "Initial upload",
            }),
          });
          // audit log
          await fetch("/api/audit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              documentId: docId,
              actor: { id: user?.id || "1", name: user?.name || "User" },
              action: "upload",
              details: { fileName: f.name, size: f.size },
            }),
          });
          setUploadedDocs(prev => [{ id: docId, name: f.name }, ...prev]);
        } catch {
          // ignore in demo
        }
      }
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles]);
      
      // Process each file
      for (const f of droppedFiles) {
        const docId = `doc_${Math.random().toString(36).slice(2)}`;
        try {
          // create initial version
          fetch("/api/documents/versions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              documentId: docId,
              createdBy: { id: user?.id || "1", name: user?.name || "User" },
              summary: `Initial upload for ${f.name}`,
              changeNote: "Initial upload",
            }),
          });
          // audit log
          fetch("/api/audit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              documentId: docId,
              actor: { id: user?.id || "1", name: user?.name || "User" },
              action: "upload",
              details: { fileName: f.name, size: f.size },
            }),
          });
          setUploadedDocs(prev => [{ id: docId, name: f.name }, ...prev]);
        } catch {
          // ignore in demo
        }
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white shadow-lg flex flex-col h-screen sticky top-0">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">DocRail AI</h1>
                <p className="text-sm text-gray-600">Document Management System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-6 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">NAVIGATION</h3>
            <nav className="space-y-2">
              <Link prefetch href="/dashboard" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <button className="w-full flex items-center space-x-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg">
                <Upload className="w-5 h-5" />
                <span className="font-medium">Upload Documents</span>
              </button>
              <Link prefetch href="/search" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                <Search className="w-5 h-5" />
                <span>Search & Filter</span>
              </Link>
              <Link prefetch href="/compliance" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5" />
                <span>Compliance</span>
              </Link>
              <Link prefetch href="/notifications" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg relative">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
                <div className="absolute right-3 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </div>
              </Link>
              <Link prefetch href="/knowledge-hub" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5" />
                <span>Knowledge Hub</span>
              </Link>
            </nav>
          </div>

          {/* Quick Stats */}
          <div className="p-6 border-t border-gray-200 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">QUICK STATS</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Documents</span>
                <span className="font-semibold text-gray-900">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Review</span>
                <span className="font-semibold text-orange-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Critical Alerts</span>
                <span className="font-semibold text-red-600">3</span>
              </div>
            </div>
          </div>

          {/* User Profile - Always visible at bottom */}
          <div className="mt-auto p-6 border-t border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">KMRL Officer</p>
                <p className="text-sm text-gray-600">Engineering Department</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Cog className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Upload Documents</h1>
                <p className="text-gray-600 mt-1">Upload documents for automated classification and AI-powered analysis</p>
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <Upload className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Document Upload</h2>
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
              <CardContent className="p-16 text-center">
                {/* Upload Icon with Animation */}
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 transition-all duration-200 ${
                  isDragOver 
                    ? 'bg-blue-500 scale-110 shadow-lg' 
                    : 'bg-gradient-to-br from-blue-100 to-blue-200 shadow-md'
                }`}>
                  <Upload className={`w-12 h-12 transition-colors duration-200 ${
                    isDragOver ? 'text-white' : 'text-blue-600'
                  }`} />
                </div>

                {/* Main Text */}
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {isDragOver ? 'Drop Files Here!' : 'Upload Documents'}
                </h3>
                
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  {isDragOver 
                    ? 'Release to upload your files' 
                    : 'Drag and drop your files here, or click the button below to browse'
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
                    Choose Files
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
                  Maximum file size: 10MB per file
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
                    <h2 className="text-xl font-semibold text-gray-900">Selected Files</h2>
                    <p className="text-sm text-gray-500">{files.length} file{files.length !== 1 ? 's' : ''} ready for upload</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setFiles([])}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear All
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
                                <span className="text-xs text-green-600 font-medium">Ready</span>
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
                        Total size: {(files.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)} MB
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
                        Upload All Files
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
                  <h3 className="font-semibold text-gray-900 mb-2">PDF Documents</h3>
                  <p className="text-sm text-gray-600">Reports, forms, scanned docs</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileType className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Word Documents</h3>
                  <p className="text-sm text-gray-600">DOC, DOCX files</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Images</h3>
                  <p className="text-sm text-gray-600">PNG, JPEG with OCR</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* AI Processing Pipeline */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Bot className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">AI Processing Pipeline</h2>
            </div>
            
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">OCR Text Extraction</h3>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Auto Classification</h3>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">AI Summarization</h3>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  4
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Smart Routing</h3>
              </div>
            </div>
          </div>

          {/* Recently Uploaded (demo doc ids) */}
          {uploadedDocs.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center space-x-2 mb-2">
                <Bot className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Recently Uploaded</h2>
              </div>
              <div className="space-y-2">
                {uploadedDocs.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3 bg-white border rounded">
                    <div className="text-sm">
                      <div className="font-medium">{d.name}</div>
                      <div className="text-xs text-gray-500">ID: {d.id}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => router.push("/compliance")}>Audit</Button>
                      <Button size="sm" variant="outline" onClick={() => router.push("/knowledge-hub")}>Graph</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bilingual Summary & Annotations (demo for first file) */}
          <div className="grid grid-cols-2 gap-6 mt-8">
            <BilingualSummary documentId="demo-doc-1" englishSummary={"This is an AI-generated summary for the uploaded document."} />
            <AnnotationsPanel documentId="demo-doc-1" />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
