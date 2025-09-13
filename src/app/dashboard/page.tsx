"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  MoreVertical,
  Folder,
  Calendar,
  User,
  LogOut,
  Settings,
  Bell,
  AlertTriangle,
  Clock,
  TrendingUp,
  Shield,
  Building2,
  Users,
  Cog,
  Bot,
  Check
} from "lucide-react";
import dynamic from "next/dynamic";
const RiskScoring = dynamic(() => import("@/components/risk/RiskScoring"), {
  ssr: false,
  loading: () => null,
});

// Mock data for KMRL documents
const mockDocuments = [
  {
    id: 1,
    name: "KMRL Annual Report 2024.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadDate: "2024-01-15",
    uploadedBy: "Dr. Alkesh Kumar Sharma",
    category: "Annual Reports",
    status: "Published",
    department: "Corporate Affairs"
  },
  {
    id: 2,
    name: "Metro Station Design Guidelines v3.2.pdf",
    type: "PDF",
    size: "1.8 MB",
    uploadDate: "2024-01-14",
    uploadedBy: "Ar. Priya Menon",
    category: "Design Standards",
    status: "Published",
    department: "Architecture & Planning"
  },
  {
    id: 3,
    name: "Safety Protocols Manual 2024.pdf",
    type: "PDF",
    size: "3.2 MB",
    uploadDate: "2024-01-13",
    uploadedBy: "Capt. Rajesh Kumar",
    category: "Safety & Security",
    status: "Published",
    department: "Operations"
  },
  {
    id: 4,
    name: "Budget Allocation Phase 2.xlsx",
    type: "XLSX",
    size: "856 KB",
    uploadDate: "2024-01-12",
    uploadedBy: "Ms. Sunitha Nair",
    category: "Finance",
    status: "Published",
    department: "Finance"
  },
  {
    id: 5,
    name: "Construction Timeline Phase 2.pptx",
    type: "PPTX",
    size: "4.1 MB",
    uploadDate: "2024-01-11",
    uploadedBy: "Eng. Mohan Das",
    category: "Project Updates",
    status: "Review",
    department: "Project Management"
  },
  {
    id: 6,
    name: "Environmental Impact Assessment.pdf",
    type: "PDF",
    size: "5.2 MB",
    uploadDate: "2024-01-10",
    uploadedBy: "Dr. Anitha Thomas",
    category: "Environmental",
    status: "Published",
    department: "Environment"
  },
  {
    id: 7,
    name: "Metro Fare Structure 2024.pdf",
    type: "PDF",
    size: "1.1 MB",
    uploadDate: "2024-01-09",
    uploadedBy: "Mr. Suresh Kumar",
    category: "Operations",
    status: "Published",
    department: "Commercial"
  },
  {
    id: 8,
    name: "IT Security Policy v2.1.pdf",
    type: "PDF",
    size: "2.8 MB",
    uploadDate: "2024-01-08",
    uploadedBy: "Mr. Ravi Shankar",
    category: "IT & Security",
    status: "Draft",
    department: "IT"
  }
];

export default function Dashboard() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("Today");
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white shadow-lg flex flex-col">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200">
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
          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">NAVIGATION</h3>
            <nav className="space-y-2">
              <button className="w-full flex items-center space-x-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg">
                <FileText className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </button>
              <Link prefetch href="/upload" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                <Upload className="w-5 h-5" />
                <span>Upload Documents</span>
              </Link>
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
                <Folder className="w-5 h-5" />
                <span>Knowledge Hub</span>
              </Link>
            </nav>
          </div>

          {/* Quick Stats */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">QUICK STATS</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Documents</span>
                <span className="font-semibold text-gray-900">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Review</span>
                <span className="font-semibold text-gray-900">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Critical Alerts</span>
                <span className="font-semibold text-gray-900">3</span>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="mt-auto p-6 border-t border-gray-200">
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
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Good morning, Kunal</h1>
                <p className="text-gray-600">Here's your document overview for admin</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setSelectedTimeFilter("Today")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      selectedTimeFilter === "Today" 
                        ? "bg-blue-600 text-white" 
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Today
                  </button>
                  <button 
                    onClick={() => setSelectedTimeFilter("This Week")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      selectedTimeFilter === "This Week" 
                        ? "bg-blue-600 text-white" 
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    This Week
                  </button>
                  <button 
                    onClick={() => setSelectedTimeFilter("This Month")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      selectedTimeFilter === "This Month" 
                        ? "bg-blue-600 text-white" 
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    This Month
                  </button>
                </div>
                <button 
                  onClick={() => router.push("/upload")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Document</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI-Powered Summary Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Documents Processed</p>
                    <p className="text-3xl font-bold text-gray-900">1,247</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+18% this week</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">AI Accuracy</p>
                    <p className="text-3xl font-bold text-gray-900">95.2%</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">Above target</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Processing Time</p>
                    <p className="text-3xl font-bold text-gray-900">2.3m</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">90% faster</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Compliance Rate</p>
                    <p className="text-3xl font-bold text-gray-900">100%</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">Perfect score</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Check className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI-Powered Content Sections */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* AI Document Feed */}
            <Card className="col-span-2 bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Bot className="w-5 h-5 text-blue-600 mr-2" />
                    AI Document Feed
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800">Live Processing</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Safety Protocol Update</h4>
                      <p className="text-sm text-gray-600">Engineering Department • 2 minutes ago</p>
                    </div>
                    <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">AI Summary: New safety guidelines for metro operations require immediate review...</p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Budget Allocation Report</h4>
                      <p className="text-sm text-gray-600">Finance Department • 15 minutes ago</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">High Priority</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">AI Summary: Q4 budget review shows 12% variance in infrastructure spending...</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Compliance Checklist</h4>
                      <p className="text-sm text-gray-600">HR Department • 1 hour ago</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Compliance</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">AI Summary: Monthly compliance review completed with 100% adherence...</p>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Bot className="w-5 h-5 text-blue-600 mr-2" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Processing Efficiency</h3>
                  <p className="text-sm text-gray-600">90% faster than manual processing</p>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Top Categories Today</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Safety Reports</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Financial Docs</span>
                      <span className="font-medium">18</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Compliance</span>
                      <span className="font-medium">12</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row - Compliance & Analytics */}
          <div className="grid grid-cols-3 gap-6">
            {/* AI Category Analytics */}
            <Card className="col-span-2 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Bot className="w-5 h-5 text-blue-600 mr-2" />
                  AI Category Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Safety Reports</p>
                          <p className="text-sm text-gray-600">23 documents</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">95%</p>
                        <p className="text-xs text-gray-500">AI Accuracy</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Compliance</p>
                          <p className="text-sm text-gray-600">12 documents</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">100%</p>
                        <p className="text-xs text-gray-500">On Track</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Financial</p>
                          <p className="text-sm text-gray-600">18 documents</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">92%</p>
                        <p className="text-xs text-gray-500">AI Accuracy</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">HR Documents</p>
                          <p className="text-sm text-gray-600">8 documents</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-600">98%</p>
                        <p className="text-xs text-gray-500">AI Accuracy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Monitoring */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Shield className="w-5 h-5 text-green-600 mr-2" />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">All Systems Green</h3>
                  <p className="text-sm text-gray-600">100% compliance rate</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Regulatory Docs</span>
                    <Badge className="bg-green-100 text-green-800">On Track</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Safety Protocols</span>
                    <Badge className="bg-green-100 text-green-800">Current</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Audit Requirements</span>
                    <Badge className="bg-green-100 text-green-800">Complete</Badge>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <p className="text-xs text-gray-500 text-center">Next compliance review: 15 days</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Scoring */}
          <div className="mt-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  Risk-Based Prioritization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RiskScoring category="Safety" department="Operations" riskLevel="high" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
