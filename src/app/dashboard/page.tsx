"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
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
import IconBadge from "@/components/ui/IconBadge";
import docs from "@/data/docs.json";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  ,
  {
    id: 9,
    name: "CRS Directive – Platform Safety Bulletin 2024-02.pdf",
    type: "PDF",
    size: "1.2 MB",
    uploadDate: "2024-01-08",
    uploadedBy: "CRS Office",
    category: "Regulatory",
    status: "Published",
    department: "Safety & Security"
  },
  {
    id: 10,
    name: "Rolling Stock Maintenance Job Cards – Aluva Depot.xlsx",
    type: "XLSX",
    size: "960 KB",
    uploadDate: "2024-01-07",
    uploadedBy: "Depot Manager (Aluva)",
    category: "Maintenance",
    status: "Review",
    department: "Operations"
  },
  {
    id: 11,
    name: "Procurement – Spare Parts PO & Vendor Invoices.zip",
    type: "ZIP",
    size: "12.6 MB",
    uploadDate: "2024-01-06",
    uploadedBy: "Procurement Cell",
    category: "Finance & Procurement",
    status: "Processing",
    department: "Finance"
  },
  {
    id: 12,
    name: "Environmental Impact Study – Phase 2 Corridor.pdf",
    type: "PDF",
    size: "6.7 MB",
    uploadDate: "2024-01-05",
    uploadedBy: "Environment Team",
    category: "Environment",
    status: "Published",
    department: "Environment"
  },
  {
    id: 13,
    name: "സുരക്ഷാ സർക്കുലർ – രാത്രികാല പ്രവർത്തനങ്ങൾ (Malayalam).pdf",
    type: "PDF",
    size: "1.0 MB",
    uploadDate: "2024-01-05",
    uploadedBy: "Safety Cell",
    category: "Safety",
    status: "Published",
    department: "Safety & Security"
  },
  {
    id: 14,
    name: "Board Meeting Minutes – January 2024.docx",
    type: "DOCX",
    size: "420 KB",
    uploadDate: "2024-01-04",
    uploadedBy: "Company Secretary",
    category: "Governance",
    status: "Approved",
    department: "Corporate Affairs"
  }
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const router = useRouter();
  const { t } = useLanguage();
  const [acks, setAcks] = useState<Record<number, boolean>>({});
  const [follow, setFollow] = useState<Record<number, boolean>>({});

  const greetingText = useMemo(() => {
    // Compute current hour in IST reliably via Intl API
    const hourStr = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hour12: false,
    }).format(new Date());
    const hour = Number(hourStr);
    if (hour >= 5 && hour < 12) return t("dash.greet.morning");
    if (hour >= 12 && hour < 17) return t("dash.greet.afternoon");
    if (hour >= 17 && hour < 22) return t("dash.greet.evening");
    return t("dash.greet.night");
  }, [t]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{greetingText}, Admin</h1>
                <p className="text-gray-600">{t("dash.subtitle")}</p>
              </div>
              <div className="flex items-center space-x-4">
              
              </div>
            </div>
            
          </div>

          {/* AI-Powered Summary Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t("dash.docsProcessed")}</p>
                    <p className="text-3xl font-bold text-gray-900">1,247</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+18% this week</span>
                    </div>
                  </div>
                  <IconBadge color="blue" size="md"><Bot /></IconBadge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t("dash.aiAccuracy")}</p>
                    <p className="text-3xl font-bold text-gray-900">95.2%</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">Above target</span>
                    </div>
                  </div>
                  <IconBadge color="green" size="md"><Shield /></IconBadge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t("dash.processingTime")}</p>
                    <p className="text-3xl font-bold text-gray-900">2.3m</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">90% faster</span>
                    </div>
                  </div>
                  <IconBadge color="orange" size="md"><Clock /></IconBadge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t("dash.complianceRate")}</p>
                    <p className="text-3xl font-bold text-gray-900">100%</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">Perfect score</span>
                    </div>
                  </div>
                  <IconBadge color="purple" size="md"><Check /></IconBadge>
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
                    {t("dash.aiFeed")}
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800">{t("dash.live")}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {(docs as any[]).slice(0, 3).map((d) => (
                  <div key={d.id} className={`border-l-4 pl-4 py-3 rounded ${d.priority === 'High' ? 'bg-red-50/60 border-red-500' : d.department === 'Finance' ? 'bg-orange-50/60 border-orange-500' : 'bg-green-50/60 border-green-500'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="hidden sm:flex w-16 h-20 bg-white/60 border rounded items-center justify-center text-[10px] text-gray-500">Thumb</div>
                        <div>
                          <h4 className="font-medium text-gray-900">{d.title}</h4>
                          <p className="text-sm text-gray-600">{d.department} • {d.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {d.priority && (
                          <Badge className={`${d.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>{d.priority}</Badge>
                        )}
                        {d.dueDate && (
                          <Badge className="bg-amber-100 text-amber-800">Due {d.dueDate}</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">AI Summary: {d.aiSummary}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                      {d.regulator && (<Badge className="bg-white text-gray-700 border">Regulator: {d.regulator}</Badge>)}
                      {d.sourceChannel && (<Badge className="bg-white text-gray-700 border">Source: {d.sourceChannel}</Badge>)}
                      {d.sourcePath && (<span>Path: {d.sourcePath}{d.page ? ` • Page ${d.page}` : ''}</span>)}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Link href="#" className="underline">View Source</Link>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl">
                          <DialogHeader>
                            <DialogTitle>{d.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2 text-sm text-gray-700">
                            <div><span className="font-medium">Type:</span> {d.type}</div>
                            <div><span className="font-medium">Department:</span> {d.department}</div>
                            {d.regulator && (<div><span className="font-medium">Regulator:</span> {d.regulator}</div>)}
                            {d.dueDate && (<div><span className="font-medium">Due:</span> {d.dueDate}</div>)}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {d.sourceChannel && (<Badge className="bg-white text-gray-700 border">Source: {d.sourceChannel}</Badge>)}
                              {d.sourcePath && (<Badge className="bg-white text-gray-700 border">Path: {d.sourcePath}</Badge>)}
                              {d.page && (<Badge className="bg-white text-gray-700 border">Page {d.page}</Badge>)}
                            </div>
                            <div className="mt-3 p-3 bg-gray-50 border rounded">Preview unavailable in prototype.</div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <button
                        className={`ml-2 px-2 py-1 rounded border text-xs ${acks[d.id] ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => setAcks(prev => ({ ...prev, [d.id]: !prev[d.id] }))}
                        aria-pressed={!!acks[d.id]}
                        title="Acknowledge receipt"
                      >
                        {acks[d.id] ? 'Acknowledged' : 'Acknowledge'}
                      </button>
                      <button
                        className={`px-2 py-1 rounded border text-xs ${follow[d.id] ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => setFollow(prev => ({ ...prev, [d.id]: !prev[d.id] }))}
                        aria-pressed={!!follow[d.id]}
                        title="Mark for follow-up"
                      >
                        {follow[d.id] ? 'Following' : 'Follow-up'}
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Daily Digest (moved here) */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Daily Digest</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                    <div>
                      <div className="font-medium text-gray-800 line-clamp-1">CRS Directive – Platform Safety Bulletin 2025-01</div>
                      <div className="text-gray-600 text-xs">Safety • 2025-02-14</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                    <div>
                      <div className="font-medium text-gray-800 line-clamp-1">PO 23-9014 – Axle Bearing Assembly (SKF)</div>
                      <div className="text-gray-600 text-xs">Finance • 2025-02-12</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                    <div>
                      <div className="font-medium text-gray-800 line-clamp-1">റാത്രികാല SOP അപ്ഡേറ്റ് (Malayalam) / Night Shift SOP Update</div>
                      <div className="text-gray-600 text-xs">Operations • 2025-02-10</div>
                    </div>
                  </li>
                </ul>
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
                        <IconBadge color="blue" size="sm"><FileText /></IconBadge>
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
                        <IconBadge color="green" size="sm"><Shield /></IconBadge>
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
                        <IconBadge color="orange" size="sm"><TrendingUp /></IconBadge>
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
                        <IconBadge color="purple" size="sm"><Users /></IconBadge>
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
