"use client";

import React from "react";

type BadgeColor = "blue" | "green" | "orange" | "purple" | "red" | "slate";
type BadgeSize = "sm" | "md" | "lg";

interface IconBadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  size?: BadgeSize;
  className?: string;
}

const colorToClasses: Record<BadgeColor, string> = {
  blue: "from-blue-100 to-blue-200 text-blue-600",
  green: "from-green-100 to-green-200 text-green-600",
  orange: "from-orange-100 to-orange-200 text-orange-600",
  purple: "from-purple-100 to-purple-200 text-purple-600",
  red: "from-red-100 to-red-200 text-red-600",
  slate: "from-slate-100 to-slate-200 text-slate-700",
};

const sizeToClasses: Record<BadgeSize, string> = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

export function IconBadge({ children, color = "blue", size = "md", className }: IconBadgeProps) {
  return (
    <div
      className={`rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm ${
        sizeToClasses[size]
      } ${colorToClasses[color]} ${className || ""}`}
    >
      <div className="[&>*]:stroke-[1.75] [&>*]:w-6 [&>*]:h-6">
        {children}
      </div>
    </div>
  );
}

export default IconBadge;


