"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Search, 
  Filter, 
  ArrowLeft,
  Building2,
  Bell,
  Users,
  Cog,
  FileText,
  Calendar,
  User,
  Bot,
  Globe,
  Clock,
  TrendingUp
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const { user } = useAuth();
  const router = useRouter();

  const departments = [
    "All Departments",
    "Engineering",
    "Finance", 
    "HR",
    "Operations",
    "Safety",
    "Procurement",
    "IT"
  ];

  const mockSearchResults = [
    {
      id: 1,
      title: "Metro Safety Protocol 2024",
      content: "Comprehensive safety guidelines for metro operations including emergency procedures, maintenance protocols, and passenger safety measures...",
      department: "Safety",
      date: "2024-01-15",
      author: "Dr. Rajesh Kumar",
      type: "Policy Document",
      language: "English",
      priority: "High",
      aiSummary: "Key safety protocols for metro operations with focus on emergency response and maintenance procedures.",
      relevanceScore: 95
    },
    {
      id: 2,
      title: "Budget Allocation Report Q4",
      content: "Quarterly budget analysis showing allocation across departments, variance analysis, and recommendations for Q1 2024...",
      department: "Finance",
      date: "2024-01-12",
      author: "Ms. Sunitha Nair",
      type: "Financial Report",
      language: "English",
      priority: "Medium",
      aiSummary: "Q4 budget review with 12% variance in infrastructure spending and recommendations for optimization.",
      relevanceScore: 88
    },
    {
      id: 3,
      title: "മെട്രോ സേവന നിയമങ്ങൾ",
      content: "കൊച്ചി മെട്രോ റെയിൽ ലിമിറ്റഡിന്റെ സേവന നിയമങ്ങളും നടപടിക്രമങ്ങളും...",
      department: "Operations",
      date: "2024-01-10",
      author: "Mr. Mohan Das",
      type: "Service Manual",
      language: "Malayalam",
      priority: "High",
      aiSummary: "Metro service regulations and procedures in Malayalam covering operational guidelines and customer service standards.",
      relevanceScore: 92
    }
  ];

  const filteredResults = mockSearchResults.filter(result => {
    const matchesQuery = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        result.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        result.aiSummary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = selectedLanguage === "all" || result.language.toLowerCase() === selectedLanguage;
    const matchesDepartment = selectedDepartment === "all" || result.department === selectedDepartment;
    return matchesQuery && matchesLanguage && matchesDepartment;
  });

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
              <button 
                onClick={() => router.push("/dashboard")}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <FileText className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => router.push("/upload")}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Search className="w-5 h-5" />
                <span>Upload Documents</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg">
                <Search className="w-5 h-5" />
                <span className="font-medium">Search & Filter</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg relative">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
                <div className="absolute right-3 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </div>
              </button>
            </nav>
          </div>

          {/* Quick Stats */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">SEARCH STATS</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Documents</span>
                <span className="font-semibold text-gray-900">1,247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">AI Indexed</span>
                <span className="font-semibold text-green-600">1,200</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Search Accuracy</span>
                <span className="font-semibold text-blue-600">95%</span>
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
            <div className="flex items-center space-x-4 mb-6">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Intelligent Search</h1>
                <p className="text-gray-600 mt-1">AI-powered search across all documents with natural language processing</p>
              </div>
            </div>
          </div>

          {/* Search Interface */}
          <Card className="mb-8 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 text-blue-600 mr-2" />
                AI-Powered Search
              </CardTitle>
              <CardDescription>Search in English or Malayalam with intelligent understanding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search documents... (e.g., 'safety protocols', 'budget reports', 'മെട്രോ നിയമങ്ങൾ')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Advanced Filters */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="border-2 border-gray-200 rounded-xl focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="malayalam">Malayalam</SelectItem>
                      <SelectItem value="bilingual">Bilingual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="border-2 border-gray-200 rounded-xl focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept.toLowerCase().replace(" ", "")}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                    <SelectTrigger className="border-2 border-gray-200 rounded-xl focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* AI Search Features */}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span>AI Understanding</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4 text-green-600" />
                  <span>Multilingual</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span>Semantic Search</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Search Results ({filteredResults.length})
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Results in 0.3 seconds</span>
              </div>
            </div>

            {filteredResults.map((result) => (
              <Card key={result.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
                        <Badge className={`${
                          result.priority === 'High' ? 'bg-red-100 text-red-800' :
                          result.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {result.priority}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800">
                          {result.language}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{result.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{result.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>{result.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Building2 className="w-4 h-4" />
                          <span>{result.department}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{result.content.substring(0, 200)}...</p>
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Bot className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">AI Summary</span>
                        </div>
                        <p className="text-sm text-blue-700">{result.aiSummary}</p>
                      </div>
                    </div>
                    
                    <div className="ml-4 text-right">
                      <div className="text-sm text-gray-600 mb-1">Relevance</div>
                      <div className="text-2xl font-bold text-blue-600">{result.relevanceScore}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Document
                      </Button>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        Share
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">
                      Processed by AI • {result.relevanceScore}% match
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
