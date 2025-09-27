"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Search, 
  Filter, 
  ArrowLeft,
  Building2,
  Bell,
  FileText,
  Calendar,
  User,
  Bot,
  Globe,
  Clock,
  TrendingUp,
  Upload,
  Shield,
  Folder,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Share2,
  Bookmark,
  Star,
  Zap,
  Brain,
  Languages,
  Target,
  BarChart3,
  RefreshCw,
  Settings,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import IconBadge from "@/components/ui/IconBadge";
import docs from "@/data/docs.json";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [selectedDocumentType, setSelectedDocumentType] = useState("all");
  const [selectedComplianceStatus, setSelectedComplianceStatus] = useState("all");
  const [selectedSafetyLevel, setSelectedSafetyLevel] = useState("all");
  const [relevanceThreshold, setRelevanceThreshold] = useState([70]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTime, setSearchTime] = useState<number>(0);
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const [acks, setAcks] = useState<Record<number, boolean>>({});
  const [follow, setFollow] = useState<Record<number, boolean>>({});
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});

  const departments = [
    "All Departments",
    "Engineering",
    "Finance", 
    "HR",
    "Operations",
    "Safety",
    "Procurement",
    "IT",
    "Legal",
    "Quality Assurance",
    "Maintenance",
    "Environmental"
  ];

  const documentTypes = [
    "All Types",
    "Safety Reports",
    "Compliance Documents",
    "Technical Specifications",
    "Procedures & Manuals",
    "Training Materials",
    "Audit Reports",
    "Incident Reports",
    "Policy Documents",
    "Regulatory Filings",
    "Contracts & Agreements",
    "Research Papers"
  ];

  const complianceStatuses = [
    "All Status",
    "Compliant",
    "Non-Compliant",
    "Pending Review",
    "Under Investigation",
    "Requires Action",
    "Expired",
    "Upcoming Deadline"
  ];

  const safetyLevels = [
    "All Levels",
    "Critical",
    "High Risk",
    "Medium Risk",
    "Low Risk",
    "Informational",
    "Resolved"
  ];

  const languages = [
    "All Languages",
    "English",
    "Hindi",
    "Tamil",
    "Telugu",
    "Bengali",
    "Marathi",
    "Gujarati",
    "Kannada",
    "Malayalam",
    "Punjabi",
    "Bilingual"
  ];

  // Demo data for search suggestions and trending topics
  useEffect(() => {
    setSearchSuggestions([
      "safety incident report",
      "compliance audit checklist",
      "maintenance procedures",
      "environmental impact assessment",
      "training materials",
      "regulatory requirements",
      "quality standards",
      "emergency protocols"
    ]);

    setTrendingTopics([
      "Safety Protocol Updates",
      "Compliance Deadlines",
      "Environmental Regulations",
      "Training Requirements",
      "Maintenance Schedules",
      "Quality Standards"
    ]);

    setSearchHistory([
      "safety procedures",
      "compliance checklist",
      "maintenance manual"
    ]);
  }, []);

  const mockSearchResults = docs as any[];

  const filteredResults = useMemo(() => {
    const startTime = performance.now();
    
    const results = mockSearchResults.filter(result => {
      const matchesQuery = searchQuery === "" || 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.aiSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLanguage = selectedLanguage === "all" || result.language.toLowerCase() === selectedLanguage;
      const matchesDepartment = selectedDepartment === "all" || result.department === selectedDepartment;
      const matchesDocumentType = selectedDocumentType === "all" || result.type === selectedDocumentType;
      const matchesCompliance = selectedComplianceStatus === "all" || result.complianceStatus === selectedComplianceStatus;
      const matchesSafety = selectedSafetyLevel === "all" || result.safetyLevel === selectedSafetyLevel;
      const matchesRelevance = result.relevanceScore >= relevanceThreshold[0];
      
      return matchesQuery && matchesLanguage && matchesDepartment && 
             matchesDocumentType && matchesCompliance && matchesSafety && matchesRelevance;
    });

    const endTime = performance.now();
    setSearchTime(endTime - startTime);
    
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }, [searchQuery, selectedLanguage, selectedDepartment, selectedDocumentType, 
      selectedComplianceStatus, selectedSafetyLevel, relevanceThreshold, mockSearchResults]);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);
    
    // Add to search history
    if (query && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 9)]);
    }
    
    // Simulate search delay
    setTimeout(() => setIsSearching(false), 500);
  };

  return (
    <ErrorBoundary>
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white shadow-lg flex flex-col h-screen sticky top-0">
          
          {/* Navigation */}
          <div className="p-6 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{t("sidebar.navigation")}</h3>
            <nav className="space-y-2">
              <button 
                onClick={() => router.push("/dashboard")}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <FileText className="w-5 h-5" />
                <span>{t("sidebar.dashboard")}</span>
              </button>
              <button 
                onClick={() => router.push("/upload")}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Upload className="w-5 h-5" />
                <span>{t("sidebar.upload")}</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg">
                <Search className="w-5 h-5" />
                <span className="font-medium">{t("sidebar.search")}</span>
              </button>
              <button 
                onClick={() => router.push("/compliance")}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Shield className="w-5 h-5" />
                <span>{t("sidebar.compliance")}</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg relative">
                <Bell className="w-5 h-5" />
                <span>{t("sidebar.notifications")}</span>
                <div className="absolute right-3 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </div>
              </button>
              <button 
                onClick={() => router.push("/knowledge-hub")}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Folder className="w-5 h-5" />
                <span>{t("sidebar.knowledge")}</span>
              </button>
            </nav>
          </div>

          {/* Search Analytics */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">SEARCH ANALYTICS</h3>
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
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Search Time</span>
                <span className="font-semibold text-purple-600">{searchTime.toFixed(0)}ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Filters</span>
                <span className="font-semibold text-orange-600">
                  {[selectedLanguage, selectedDepartment, selectedDocumentType, selectedComplianceStatus, selectedSafetyLevel].filter(f => f !== "all").length}
                </span>
              </div>
            </div>
          </div>

          {/* Search Suggestions */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">SUGGESTED SEARCHES</h3>
            <div className="space-y-2">
              {searchSuggestions.slice(0, 5).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg hover:text-blue-600 transition-colors"
                >
                  <Search className="w-3 h-3 inline mr-2" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Trending Topics */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">TRENDING TOPICS</h3>
            <div className="space-y-2">
              {trendingTopics.slice(0, 4).map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{topic}</span>
                  <TrendingUp className="w-3 h-3 text-green-500" />
                </div>
              ))}
            </div>
          </div>

          {/* Search History */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">RECENT SEARCHES</h3>
            <div className="space-y-2">
              {searchHistory.slice(0, 3).map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg hover:text-blue-600 transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-2" />
                    {search}
                  </span>
                  <X 
                    className="w-3 h-3 text-gray-400 hover:text-red-500" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchHistory(prev => prev.filter((_, i) => i !== index));
                    }}
                  />
                </button>
              ))}
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
                <h1 className="text-3xl font-bold text-gray-900">{t("search.title")}</h1>
                <p className="text-gray-600 mt-1">{t("search.subtitle")}</p>
              </div>
            </div>
          </div>

          {/* Search Interface */}
          <Card className="mb-8 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-2"><IconBadge color="blue" size="sm"><Bot /></IconBadge></span>
                  <span>AI-Powered Document Search</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Advanced Filters</span>
                </Button>
              </CardTitle>
              <CardDescription>Search across all documents with AI-powered semantic understanding and multilingual support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search documents, procedures, compliance requirements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                  </div>
                )}
              </div>

              {/* Basic Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="border-2 border-gray-200 rounded-xl focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang.toLowerCase().replace(" ", "")}>
                          {lang}
                        </SelectItem>
                      ))}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                  <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                    <SelectTrigger className="border-2 border-gray-200 rounded-xl focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase().replace(" ", "")}>
                          {type}
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
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Advanced Filters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Compliance Status</label>
                      <Select value={selectedComplianceStatus} onValueChange={setSelectedComplianceStatus}>
                        <SelectTrigger className="border-2 border-gray-200 rounded-xl focus:border-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {complianceStatuses.map((status) => (
                            <SelectItem key={status} value={status.toLowerCase().replace(" ", "")}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Safety Level</label>
                      <Select value={selectedSafetyLevel} onValueChange={setSelectedSafetyLevel}>
                        <SelectTrigger className="border-2 border-gray-200 rounded-xl focus:border-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {safetyLevels.map((level) => (
                            <SelectItem key={level} value={level.toLowerCase().replace(" ", "")}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relevance Threshold: {relevanceThreshold[0]}%
                      </label>
                      <Slider
                        value={relevanceThreshold}
                        onValueChange={setRelevanceThreshold}
                        max={100}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedLanguage("all");
                        setSelectedDepartment("all");
                        setSelectedDocumentType("all");
                        setSelectedComplianceStatus("all");
                        setSelectedSafetyLevel("all");
                        setRelevanceThreshold([70]);
                      }}
                    >
                      Clear All Filters
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAdvancedFilters(false)}
                    >
                      Hide Advanced Filters
                    </Button>
                  </div>
                </div>
              )}

              {/* AI Search Features */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <span>AI Understanding</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4 text-green-600" />
                    <span>Multilingual</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span>Semantic Search</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4 text-orange-600" />
                    <span>Smart Suggestions</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {filteredResults.length} results found
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
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Search completed in {searchTime.toFixed(0)}ms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Sort
                  </Button>
                </div>
              </div>
            </div>

            {filteredResults.length === 0 ? (
              <Card className="bg-white shadow-sm">
                <CardContent className="p-12 text-center">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or filters to find relevant documents.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedLanguage("all");
                      setSelectedDepartment("all");
                      setSelectedDocumentType("all");
                      setSelectedComplianceStatus("all");
                      setSelectedSafetyLevel("all");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredResults.map((result) => (
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
                          <Badge className="bg-gray-100 text-gray-800 border">{result.type}</Badge>
                          {result.complianceStatus && (
                            <Badge className={`${
                              result.complianceStatus === 'Compliant' ? 'bg-green-100 text-green-800' :
                              result.complianceStatus === 'Non-Compliant' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {result.complianceStatus}
                            </Badge>
                          )}
                          {result.safetyLevel && (
                            <Badge className={`${
                              result.safetyLevel === 'Critical' ? 'bg-red-100 text-red-800' :
                              result.safetyLevel === 'High Risk' ? 'bg-orange-100 text-orange-800' :
                              result.safetyLevel === 'Medium Risk' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {result.safetyLevel}
                            </Badge>
                          )}
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
                          {result.regulator && (
                            <div className="flex items-center space-x-1">
                              <Shield className="w-4 h-4" />
                              <span>{result.regulator}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-4 mb-3">
                          <div className="hidden sm:block w-24 h-32 bg-gray-100 border rounded flex items-center justify-center text-xs text-gray-500">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-700 mb-2">{result.content.substring(0, 200)}...</p>
                            {result.tags && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {result.tags.slice(0, 5).map((tag: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-gray-600">
                          {result.dueDate && (
                            <Badge className="bg-amber-100 text-amber-800">Due {result.dueDate}</Badge>
                          )}
                          {result.sourceChannel && (
                            <Badge className="bg-white text-gray-700 border">Source: {result.sourceChannel}</Badge>
                          )}
                          {result.sourcePath && (
                            <span>Path: {result.sourcePath}{result.page ? ` • Page ${result.page}` : ""}</span>
                          )}
                          {result.wordCount && (
                            <span>• {result.wordCount} words</span>
                          )}
                          {result.lastModified && (
                            <span>• Modified: {result.lastModified}</span>
                          )}
                        </div>
                        
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
                        <div className="text-xs text-gray-500 mt-1">AI Match</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                <FileText className="w-5 h-5" />
                                <span>{result.title}</span>
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="font-medium">Type:</span> {result.type}</div>
                                <div><span className="font-medium">Department:</span> {result.department}</div>
                                <div><span className="font-medium">Language:</span> {result.language}</div>
                                <div><span className="font-medium">Author:</span> {result.author}</div>
                                {result.regulator && (<div><span className="font-medium">Regulator:</span> {result.regulator}</div>)}
                                {result.dueDate && (<div><span className="font-medium">Due Date:</span> {result.dueDate}</div>)}
                                {result.complianceStatus && (<div><span className="font-medium">Compliance:</span> {result.complianceStatus}</div>)}
                                {result.safetyLevel && (<div><span className="font-medium">Safety Level:</span> {result.safetyLevel}</div>)}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {result.tags?.map((tag: string, index: number) => (
                                  <Badge key={index} variant="outline">{tag}</Badge>
                                ))}
                              </div>
                              <div className="p-4 bg-gray-50 border rounded-lg">
                                <h4 className="font-medium mb-2">AI Summary</h4>
                                <p className="text-sm text-gray-700">{result.aiSummary}</p>
                              </div>
                              <div className="p-4 bg-blue-50 border rounded-lg">
                                <h4 className="font-medium mb-2">Document Preview</h4>
                                <p className="text-sm text-gray-700">{result.content}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center space-x-1">
                          <Share2 className="w-4 h-4" />
                          <span>Share</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`flex items-center space-x-1 ${bookmarks[result.id] ? "bg-yellow-500 text-white border-yellow-500" : ""}`}
                          onClick={() => setBookmarks(prev => ({ ...prev, [result.id]: !prev[result.id] }))}
                        >
                          <Bookmark className="w-4 h-4" />
                          <span>{bookmarks[result.id] ? 'Bookmarked' : 'Bookmark'}</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={acks[result.id] ? "bg-green-600 text-white border-green-600" : ""}
                          onClick={() => setAcks(prev => ({ ...prev, [result.id]: !prev[result.id] }))}
                        >
                          {acks[result.id] ? 'Acknowledged' : 'Acknowledge'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={follow[result.id] ? "bg-orange-500 text-white border-orange-500" : ""}
                          onClick={() => setFollow(prev => ({ ...prev, [result.id]: !prev[result.id] }))}
                        >
                          {follow[result.id] ? 'Following' : 'Follow-up'}
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        Processed by AI • {result.relevanceScore}% match
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
    </ErrorBoundary>
  );
}
