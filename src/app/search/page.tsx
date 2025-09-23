"use client";

import { useMemo, useState } from "react";
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
  TrendingUp,
  Upload,
  Shield,
  Folder
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
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const [acks, setAcks] = useState<Record<number, boolean>>({});
  const [follow, setFollow] = useState<Record<number, boolean>>({});

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

  const mockSearchResults = docs as any[];

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
                <h1 className="text-3xl font-bold text-gray-900">{t("search.title")}</h1>
                <p className="text-gray-600 mt-1">{t("search.subtitle")}</p>
              </div>
            </div>
          </div>

          {/* Search Interface */}
          <Card className="mb-8 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2"><IconBadge color="blue" size="sm"><Bot /></IconBadge></span>
                <span>{t("search.ai")}</span>
              </CardTitle>
              <CardDescription>{t("search.ai.desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder={t("search.bar.placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Advanced Filters */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("search.filters.language")}</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="border-2 border-gray-200 rounded-xl focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("search.lang.all")}</SelectItem>
                      <SelectItem value="english">{t("search.lang.en")}</SelectItem>
                      <SelectItem value="malayalam">{t("search.lang.ml")}</SelectItem>
                      <SelectItem value="bilingual">{t("search.lang.bi")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("search.filters.department")}</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("search.filters.date")}</label>
                  <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                    <SelectTrigger className="border-2 border-gray-200 rounded-xl focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("search.date.all")}</SelectItem>
                      <SelectItem value="today">{t("search.date.today")}</SelectItem>
                      <SelectItem value="week">{t("search.date.week")}</SelectItem>
                      <SelectItem value="month">{t("search.date.month")}</SelectItem>
                      <SelectItem value="quarter">{t("search.date.quarter")}</SelectItem>
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
                {t("search.results")} ({filteredResults.length})
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{t("search.results.time")}</span>
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
                        <Badge className="bg-gray-100 text-gray-800 border">{result.type}</Badge>
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
                          Thumbnail
                        </div>
                        <p className="text-gray-700">{result.content.substring(0, 200)}...</p>
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
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Bot className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">{t("search.ai.summary")}</span>
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">{t("search.view")}</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl">
                          <DialogHeader>
                            <DialogTitle>{result.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2 text-sm text-gray-700">
                            <div><span className="font-medium">Type:</span> {result.type}</div>
                            <div><span className="font-medium">Department:</span> {result.department}</div>
                            {result.regulator && (<div><span className="font-medium">Regulator:</span> {result.regulator}</div>)}
                            {result.dueDate && (<div><span className="font-medium">Due:</span> {result.dueDate}</div>)}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {result.sourceChannel && (<Badge className="bg-white text-gray-700 border">Source: {result.sourceChannel}</Badge>)}
                              {result.sourcePath && (<Badge className="bg-white text-gray-700 border">Path: {result.sourcePath}</Badge>)}
                              {result.page && (<Badge className="bg-white text-gray-700 border">Page {result.page}</Badge>)}
                            </div>
                            <div className="mt-3 p-3 bg-gray-50 border rounded">Preview unavailable in prototype.</div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm">
                        {t("search.download")}
                      </Button>
                      <Button variant="outline" size="sm">
                        {t("search.share")}
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
                        className={follow[result.id] ? "bg-yellow-500 text-white border-yellow-500" : ""}
                        onClick={() => setFollow(prev => ({ ...prev, [result.id]: !prev[result.id] }))}
                      >
                        {follow[result.id] ? 'Following' : 'Follow-up'}
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">
                      {t("search.processed")} • {result.relevanceScore}% match
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
