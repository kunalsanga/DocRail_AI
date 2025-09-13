"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

export type NotificationChannel = "in-app" | "email" | "whatsapp" | "telegram";

export type NotificationKind =
  | "new_directive"
  | "department_relevant"
  | "deadline_approaching"
  | "audit_upcoming";

export type RiskLevel = "low" | "medium" | "high";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  kind: NotificationKind;
  createdAt: string; // ISO
  intendedRoles?: string[];
  intendedDepartments?: string[];
  documentId?: string;
  channels?: NotificationChannel[];
  readByUserIds?: string[];
  read?: boolean; // For local state management
}

interface NotificationsContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
  markAllRead: () => void;
  markAsRead: (id: string) => void;
  clear: () => void;
  isCenterOpen: boolean;
  setCenterOpen: (open: boolean) => void;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(
  undefined
);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const { user } = useAuth();

  const [isCenterOpen, setCenterOpen] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  useEffect(() => {
    let abort = false;
    const load = async () => {
      if (abort) return;
      
      // Always load demo notifications for this demo app
      const demoNotifications: AppNotification[] = [
        {
          id: "demo_1",
          title: "Document Upload Successful",
          message: "Safety inspection report for Line 1 has been uploaded and is pending review by Engineering Department.",
          kind: "department_relevant",
          createdAt: new Date().toISOString(),
          intendedRoles: ["engineer", "admin"],
          intendedDepartments: ["Engineering"],
          documentId: "doc_safety_001",
          channels: ["push", "email"],
          readByUserIds: [],
          read: false
        },
        {
          id: "demo_2",
          title: "Compliance Deadline Approaching",
          message: "Annual safety compliance report is due in 5 days. Please ensure all required documents are submitted.",
          kind: "deadline_approaching",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          intendedRoles: ["admin", "director"],
          intendedDepartments: ["Operations", "Engineering"],
          documentId: "doc_compliance_annual",
          channels: ["push", "email", "whatsapp"],
          readByUserIds: [],
          read: false
        },
        {
          id: "demo_3",
          title: "System Maintenance Scheduled",
          message: "Document management system will undergo maintenance on January 20th from 2:00 AM to 4:00 AM IST.",
          kind: "department_relevant",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          intendedRoles: ["admin"],
          intendedDepartments: ["IT"],
          channels: ["push", "email"],
          readByUserIds: [],
          read: true
        },
        {
          id: "demo_4",
          title: "Regulatory Update",
          message: "New Metro Rail Safety Regulations 2024 have been published. Please review and update your procedures accordingly.",
          kind: "new_directive",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          intendedRoles: ["admin", "director"],
          intendedDepartments: ["Operations", "Engineering"],
          channels: ["push", "email"],
          readByUserIds: [],
          read: false
        },
        {
          id: "demo_5",
          title: "Document Review Required",
          message: "Station design drawings for Phase 2 extension require urgent review and approval before construction begins.",
          kind: "department_relevant",
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          intendedRoles: ["engineer", "admin"],
          intendedDepartments: ["Engineering", "Architecture & Planning"],
          documentId: "doc_station_design_phase2",
          channels: ["push", "email", "whatsapp"],
          readByUserIds: [],
          read: false
        },
        {
          id: "demo_6",
          title: "Audit Trail Alert",
          message: "Unusual access pattern detected for confidential project documents. Please verify if this was authorized.",
          kind: "audit_upcoming",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          intendedRoles: ["admin"],
          intendedDepartments: ["IT"],
          channels: ["push", "email"],
          readByUserIds: [],
          read: true
        },
        {
          id: "demo_7",
          title: "Document Version Updated",
          message: "Safety protocols document has been updated to version 3.2. All staff must acknowledge the changes.",
          kind: "new_directive",
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          intendedRoles: ["admin", "director"],
          intendedDepartments: ["Operations", "Engineering"],
          documentId: "doc_safety_protocols_v32",
          channels: ["push", "email"],
          readByUserIds: [],
          read: false
        },
        {
          id: "demo_8",
          title: "Training Material Available",
          message: "New training materials for emergency response procedures are now available in the Knowledge Hub.",
          kind: "department_relevant",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          intendedRoles: ["admin"],
          intendedDepartments: ["Operations"],
          channels: ["push"],
          readByUserIds: [],
          read: true
        }
      ];
      
      setNotifications(demoNotifications);
      
      // Also try to load from API if available
      if (user) {
        try {
          const params = new URLSearchParams();
          if (user.role) params.set("role", user.role);
          if (user.department) params.set("department", user.department);
          if (user.id) params.set("userId", user.id);
          params.set("limit", "20");
          const res = await fetch(`/api/notifications?${params.toString()}`);
          if (res.ok && !abort) {
            const data = await res.json();
            const api = (data.notifications || []) as AppNotification[];
            if (api.length > 0) {
              setNotifications(api.map(n => ({ 
                ...n, 
                read: n.readByUserIds?.includes(user?.id || '') || false 
              })));
            }
          }
        } catch (error) {
          console.error('Failed to load API notifications:', error);
          // Keep demo notifications if API fails
        }
      }
    };
    load();
    return () => {
      abort = true;
    };
  }, [user?.id]);

  const addNotification: NotificationsContextValue["addNotification"] = (n) => {
    try {
      setNotifications((prev) => [
        {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          read: false,
          ...n,
        },
        ...prev,
      ]);
      setCenterOpen(true);
    } catch (error) {
      console.error('Failed to add notification:', error);
    }
  };

  const markAllRead = () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const markAsRead = (id: string) => {
    try {
      setNotifications((prev) => 
        prev.map((n) => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const clear = () => {
    try {
      setNotifications([]);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  const value: NotificationsContextValue = {
    notifications,
    unreadCount,
    addNotification,
    markAllRead,
    markAsRead,
    clear,
    isCenterOpen,
    setCenterOpen,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}


