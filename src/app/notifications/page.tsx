"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useNotifications } from "@/contexts/NotificationsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Upload, 
  Shield, 
  Settings,
  ArrowLeft,
  Filter,
  Search
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function NotificationsPage() {
  const [kindFilter, setKindFilter] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [error, _setError] = useState<string | null>(null);
  const router = useRouter();

  // Safely get notifications with error handling
  let notifications: any[] = [];
  let markAllRead: () => void = () => {};
  let markAsRead: (id: string) => void = () => {};

  try {
    const context = useNotifications();
    notifications = context.notifications || [];
    markAllRead = context.markAllRead || (() => {});
    markAsRead = context.markAsRead || (() => {});
  } catch (err) {
    console.error('Error accessing notifications context:', err);
  }

  const filtered = useMemo(() => {
    if (!notifications || !Array.isArray(notifications)) return [];
    return notifications.filter(n => {
      if (!n || typeof n !== 'object') return false;
      if (kindFilter && kindFilter !== "all" && n.kind !== kindFilter) return false;
      if (searchQuery && !n.title?.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !n.message?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [notifications, kindFilter, searchQuery]);

  const unreadCount = notifications?.filter(n => n && !n.read).length || 0;

  const getKindIcon = (kind: string) => {
    switch (kind) {
      case "new_directive": return <Shield className="w-4 h-4" />;
      case "deadline_approaching": return <Clock className="w-4 h-4" />;
      case "department_relevant": return <Upload className="w-4 h-4" />;
      case "audit_upcoming": return <CheckCircle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getKindColor = (kind: string) => {
    switch (kind) {
      case "new_directive": return "text-blue-600 bg-blue-100";
      case "deadline_approaching": return "text-orange-600 bg-orange-100";
      case "department_relevant": return "text-green-600 bg-green-100";
      case "audit_upcoming": return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  // markAsRead is now available from the context

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-100 flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white shadow-lg flex flex-col h-screen sticky top-0">

          {/* Navigation */}
          <div className="p-6 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">NAVIGATION</h3>
            <nav className="space-y-2">
              <Link prefetch href="/dashboard" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                <Bell className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
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
              <button className="w-full flex items-center space-x-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="font-medium">Notifications</span>
                {unreadCount > 0 && (
                  <div className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </div>
                )}
              </button>
              <Link prefetch href="/knowledge-hub" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                <Bell className="w-5 h-5" />
                <span>Knowledge Hub</span>
              </Link>
            </nav>
          </div>

          {/* Quick Stats */}
          <div className="p-6 border-t border-gray-200 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">NOTIFICATION STATS</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Notifications</span>
                <span className="font-semibold text-gray-900">{notifications.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Unread</span>
                <span className="font-semibold text-red-600">{unreadCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Deadline Alerts</span>
                <span className="font-semibold text-orange-600">
                  {notifications.filter(n => n.kind === 'deadline_approaching').length}
                </span>
              </div>
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
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-1">Stay updated with important system alerts and document activities</p>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="mb-8">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="flex gap-4">
                    <Select value={kindFilter || undefined} onValueChange={(value) => setKindFilter(value === "all" ? undefined : value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="new_directive">New Directive</SelectItem>
                        <SelectItem value="deadline_approaching">Deadline Approaching</SelectItem>
                        <SelectItem value="department_relevant">Department Relevant</SelectItem>
                        <SelectItem value="audit_upcoming">Audit Upcoming</SelectItem>
                      </SelectContent>
                    </Select>


                    <Button onClick={markAllRead} variant="outline" className="px-6">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark All Read
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Error Display (render-only, no state updates during render) */}
          {(!notifications || !Array.isArray(notifications)) && (
            <Card className="bg-red-50 border-red-200 mb-4">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800">Failed to load notifications. Please refresh the page.</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                    className="ml-auto"
                  >
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications List */}
          <div className="space-y-4">
          {filtered.length > 0 ? (
              filtered.map((notification) => {
                if (!notification || !notification.id) return null;
                return (
                <Card 
                  key={notification.id} 
                  className={`bg-white shadow-sm border-l-4 ${
                    notification.kind === 'deadline_approaching' ? 'border-l-red-500' : 
                    notification.kind === 'audit_upcoming' ? 'border-l-orange-500' : 
                    'border-l-blue-500'
                  } ${!notification.read ? 'ring-2 ring-blue-100' : ''}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getKindColor(notification.kind)}`}>
                          {getKindIcon(notification.kind)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{notification.title || 'Untitled'}</h3>
                            {!notification.read && (
                              <Badge variant="default" className="bg-blue-600 text-white text-xs">
                                New
                              </Badge>
                            )}
                            {notification.kind === 'deadline_approaching' && (
                              <Badge variant="destructive" className="text-xs">
                                URGENT
                        </Badge>
                      )}
                          </div>
                          
                          <p className="text-gray-600 mb-3">{notification.message || 'No message available'}</p>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                              {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : 'Unknown date'}
                            </p>
                            
                            <div className="flex items-center space-x-2">
                              {!notification.read && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  Mark as Read
                                </Button>
                              )}
                              {notification.documentId && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => router.push(`/compliance?doc=${notification.documentId}`)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  View Document
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
              })
            ) : (
              <Card className="bg-white shadow-sm">
                <CardContent className="p-12 text-center">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notifications Found</h3>
                  <p className="text-gray-600">
                    {searchQuery || (kindFilter && kindFilter !== "all")
                      ? "No notifications match your current filters." 
                      : "You're all caught up! No new notifications at the moment."
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}


