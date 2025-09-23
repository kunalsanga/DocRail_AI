"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Department, UserRole } from "@/lib/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  allowedDepartments?: Department[];
}

export default function ProtectedRoute({ children, allowedRoles, allowedDepartments }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const hasRoleAccess = () => {
    if (!user) return false;
    if (allowedRoles && allowedRoles.length > 0) {
      if (!user.role || !allowedRoles.includes(user.role as UserRole)) return false;
    }
    if (allowedDepartments && allowedDepartments.length > 0) {
      if (!user.department || !allowedDepartments.includes(user.department as Department)) return false;
    }
    return true;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!hasRoleAccess()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-700 font-medium mb-1">Access restricted</p>
          <p className="text-gray-500 text-sm">Your account does not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
