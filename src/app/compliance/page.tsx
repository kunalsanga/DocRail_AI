"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Calendar,
  Building2,
  Bell,
  Users,
  Cog,
  FileText,
  TrendingUp,
  Bot,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
const VersionHistory = dynamic(() => import("@/components/audit/VersionHistory"), { ssr: false, loading: () => null });
const AuditTrail = dynamic(() => import("@/components/audit/AuditTrail"), { ssr: false, loading: () => null });

export default function CompliancePage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30days");
  const { user } = useAuth();
  const router = useRouter();

  const complianceMetrics = {
    overallScore: 100,
    regulatoryDocs: 45,
    pendingReviews: 3,
    upcomingDeadlines: 7,
    overdueItems: 0
  };

  const upcomingDeadlines = [
    {
      id: 1,
      title: "Safety Audit Report Submission",
      department: "Safety",
      dueDate: "2024-02-15",
      daysRemaining: 15,
      priority: "High",
      status: "On Track",
      description: "Annual safety audit report for metro operations"
    },
    {
      id: 2,
      title: "Environmental Compliance Review",
      department: "Environment",
      dueDate: "2024-02-28",
      daysRemaining: 28,
      priority: "Medium",
      status: "On Track",
      description: "Quarterly environmental impact assessment"
    },
    {
      id: 3,
      title: "Financial Statement Audit",
      department: "Finance",
      dueDate: "2024-03-10",
      daysRemaining: 38,
      priority: "High",
      status: "In Progress",
      description: "Annual financial statement preparation and audit"
    }
  ];

  const complianceCategories = [
    {
      name: "Safety & Security",
      score: 100,
      totalDocs: 25,
      pending: 0,
      color: "green",
      icon: Shield
    },
    {
      name: "Environmental",
      score: 95,
      totalDocs: 18,
      pending: 1,
      color: "blue",
      icon: TrendingUp
    },
    {
      name: "Financial",
      score: 100,
      totalDocs: 32,
      pending: 0,
      color: "green",
      icon: FileText
    },
    {
      name: "HR & Labor",
      score: 90,
      totalDocs: 15,
      pending: 2,
      color: "orange",
      icon: Users
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Safety Protocol Updated",
      department: "Safety",
      timestamp: "2 hours ago",
      status: "Completed",
      type: "Compliance Update"
    },
    {
      id: 2,
      action: "Environmental Report Submitted",
      department: "Environment", 
      timestamp: "1 day ago",
      status: "Approved",
      type: "Document Submission"
    },
    {
      id: 3,
      action: "HR Policy Review",
      department: "HR",
      timestamp: "2 days ago",
      status: "In Progress",
      type: "Policy Review"
    }
  ];

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
              <Link prefetch href="/dashboard" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link prefetch href="/upload" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5" />
                <span>Upload Documents</span>
              </Link>
              <Link prefetch href="/search" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5" />
                <span>Search & Filter</span>
              </Link>
              <button className="w-full flex items-center space-x-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Compliance</span>
              </button>
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

          {/* Compliance Stats */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">COMPLIANCE OVERVIEW</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Overall Score</span>
                <span className="font-semibold text-green-600">{complianceMetrics.overallScore}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Regulatory Docs</span>
                <span className="font-semibold text-gray-900">{complianceMetrics.regulatoryDocs}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Reviews</span>
                <span className="font-semibold text-orange-600">{complianceMetrics.pendingReviews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Upcoming Deadlines</span>
                <span className="font-semibold text-blue-600">{complianceMetrics.upcomingDeadlines}</span>
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
                <h1 className="text-3xl font-bold text-gray-900">Compliance Monitoring</h1>
                <p className="text-gray-600 mt-1">AI-powered compliance tracking and regulatory deadline management</p>
              </div>
            </div>
          </div>

          {/* Compliance Overview Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Compliance Score</p>
                    <p className="text-3xl font-bold text-green-600">100%</p>
                    <div className="flex items-center mt-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">All systems green</span>
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
                    <p className="text-sm text-gray-600 mb-1">Upcoming Deadlines</p>
                    <p className="text-3xl font-bold text-blue-600">7</p>
                    <div className="flex items-center mt-2">
                      <Calendar className="w-4 h-4 text-blue-500 mr-1" />
                      <span className="text-sm text-blue-600">Next 30 days</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending Reviews</p>
                    <p className="text-3xl font-bold text-orange-600">3</p>
                    <div className="flex items-center mt-2">
                      <Clock className="w-4 h-4 text-orange-500 mr-1" />
                      <span className="text-sm text-orange-600">Requires attention</span>
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
                    <p className="text-sm text-gray-600 mb-1">Overdue Items</p>
                    <p className="text-3xl font-bold text-green-600">0</p>
                    <div className="flex items-center mt-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">All on track</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Upcoming Deadlines */}
            <Card className="col-span-2 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                  Upcoming Deadlines
                </CardTitle>
                <CardDescription>AI-monitored regulatory deadlines and compliance requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{deadline.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{deadline.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Building2 className="w-4 h-4 mr-1" />
                            {deadline.department}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Due: {deadline.dueDate}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {deadline.daysRemaining} days left
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <Badge className={`mb-2 ${
                          deadline.priority === 'High' ? 'bg-red-100 text-red-800' :
                          deadline.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {deadline.priority}
                        </Badge>
                        <Badge className={`${
                          deadline.status === 'On Track' ? 'bg-green-100 text-green-800' :
                          deadline.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {deadline.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Progress 
                        value={Math.max(0, 100 - (deadline.daysRemaining / 30) * 100)} 
                        className="flex-1 mr-4"
                      />
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Compliance Categories */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 text-blue-600 mr-2" />
                  AI Compliance Analysis
                </CardTitle>
                <CardDescription>Automated compliance monitoring by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {complianceCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div key={category.name} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                            <IconComponent className={`w-5 h-5 text-${category.color}-600`} />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{category.name}</h4>
                            <p className="text-sm text-gray-600">{category.totalDocs} documents</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{category.score}%</p>
                          <p className="text-xs text-gray-500">Compliance</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{category.score}%</span>
                        </div>
                        <Progress value={category.score} className="h-2" />
                        {category.pending > 0 && (
                          <p className="text-xs text-orange-600">
                            {category.pending} pending review{category.pending > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 text-blue-600 mr-2" />
                Recent Compliance Activities
              </CardTitle>
              <CardDescription>AI-tracked compliance actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{activity.action}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{activity.department}</span>
                          <span>•</span>
                          <span>{activity.type}</span>
                          <span>•</span>
                          <span>{activity.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={`${
                      activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      activity.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Version History & Audit Trail */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            <VersionHistory documentId="demo-doc-1" />
            <AuditTrail documentId="demo-doc-1" />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
