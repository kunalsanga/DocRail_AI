import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/storage";
import { AppNotification, Department, UserRole } from "@/lib/types";

const FILE = "notifications.json";

// Demo notifications data for serverless environment
const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: "ntf_001",
    title: "Document Upload Successful",
    message: "Safety inspection report for Line 1 has been uploaded and is pending review by Engineering Department.",
    kind: "department_relevant",
    createdAt: "2024-01-15T10:30:00Z",
    intendedRoles: ["engineer", "admin"],
    intendedDepartments: ["Engineering"],
    documentId: "doc_safety_001",
    channels: ["push", "email"],
    readByUserIds: []
  },
  {
    id: "ntf_002",
    title: "Compliance Deadline Approaching",
    message: "Annual safety compliance report is due in 5 days. Please ensure all required documents are submitted.",
    kind: "deadline_approaching",
    createdAt: "2024-01-14T09:15:00Z",
    intendedRoles: ["admin", "director"],
    intendedDepartments: ["Operations", "Engineering"],
    documentId: "doc_compliance_annual",
    channels: ["push", "email", "whatsapp"],
    readByUserIds: []
  },
  {
    id: "ntf_003",
    title: "System Maintenance Scheduled",
    message: "Document management system will undergo maintenance on January 20th from 2:00 AM to 4:00 AM IST.",
    kind: "department_relevant",
    createdAt: "2024-01-13T09:15:00Z",
    intendedRoles: ["admin"],
    intendedDepartments: ["IT"],
    channels: ["push", "email"],
    readByUserIds: ["user_001"]
  },
  {
    id: "ntf_004",
    title: "Regulatory Update",
    message: "New Metro Rail Safety Regulations 2024 have been published. Please review and update your procedures accordingly.",
    kind: "new_directive",
    createdAt: "2024-01-12T16:45:00Z",
    intendedRoles: ["admin", "director"],
    intendedDepartments: ["Operations", "Engineering"],
    channels: ["push", "email"],
    readByUserIds: []
  },
  {
    id: "ntf_005",
    title: "Station Design Phase 2 Approved",
    message: "Phase 2 of the new station design has been approved by the planning committee. Construction can proceed as scheduled.",
    kind: "department_relevant",
    createdAt: "2024-01-11T14:20:00Z",
    intendedRoles: ["engineer", "admin"],
    intendedDepartments: ["Engineering", "Architecture & Planning"],
    documentId: "doc_station_design_phase2",
    channels: ["push", "email", "whatsapp"],
    readByUserIds: []
  },
  {
    id: "ntf_006",
    title: "Security Audit Completed",
    message: "Quarterly security audit has been completed successfully. All systems are compliant with security standards.",
    kind: "audit_upcoming",
    createdAt: "2024-01-10T08:20:00Z",
    intendedRoles: ["admin"],
    intendedDepartments: ["IT"],
    channels: ["push", "email"],
    readByUserIds: ["user_002"]
  },
  {
    id: "ntf_007",
    title: "Document Version Updated",
    message: "Safety protocols document has been updated to version 3.2. All staff must acknowledge the changes.",
    kind: "new_directive",
    createdAt: "2024-01-09T13:15:00Z",
    intendedRoles: ["admin", "director"],
    intendedDepartments: ["Operations", "Engineering"],
    documentId: "doc_safety_protocols_v32",
    channels: ["push", "email"],
    readByUserIds: []
  },
  {
    id: "ntf_008",
    title: "Budget Review Meeting",
    message: "Monthly budget review meeting is scheduled for tomorrow at 10:00 AM in the conference room.",
    kind: "department_relevant",
    createdAt: "2024-01-08T15:30:00Z",
    intendedRoles: ["admin"],
    intendedDepartments: ["Operations"],
    channels: ["push"],
    readByUserIds: ["user_003"]
  },
  {
    id: "ntf_009",
    title: "Environmental Impact Assessment",
    message: "EIA report for the new metro line extension has been submitted for government approval.",
    kind: "department_relevant",
    createdAt: "2024-01-07T10:00:00Z",
    intendedRoles: ["admin", "director"],
    intendedDepartments: ["Commercial", "Project Management"],
    channels: ["push", "email"],
    readByUserIds: []
  },
  {
    id: "ntf_010",
    title: "Green Energy Initiative",
    message: "Solar panel installation project has been approved. Implementation will begin next month.",
    kind: "new_directive",
    createdAt: "2024-01-06T11:45:00Z",
    intendedRoles: ["admin", "director"],
    intendedDepartments: ["Environment", "Architecture & Planning"],
    documentId: "doc_eia_report_2024",
    channels: ["push", "email"],
    readByUserIds: []
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = (searchParams.get("role") || undefined) as UserRole | undefined;
  const department = (searchParams.get("department") || undefined) as
    | Department
    | undefined;
  const userId = searchParams.get("userId") || undefined;
  const limit = Number(searchParams.get("limit") || "0");

  // Use demo data for serverless environment
  let all: AppNotification[];
  try {
    all = await readJson<AppNotification[]>(FILE, DEMO_NOTIFICATIONS);
  } catch (error) {
    // Fallback to demo data if file reading fails (serverless environment)
    all = DEMO_NOTIFICATIONS;
  }

  let filtered = all;
  if (role) {
    filtered = filtered.filter(
      n => !n.intendedRoles || n.intendedRoles.length === 0 || n.intendedRoles.includes(role)
    );
  }
  if (department) {
    filtered = filtered.filter(
      n =>
        !n.intendedDepartments ||
        n.intendedDepartments.length === 0 ||
        n.intendedDepartments.includes(department)
    );
  }
  if (userId) {
    filtered = filtered.filter(n => !(n.readByUserIds || []).includes(userId));
  }

  if (limit && limit > 0) {
    filtered = filtered.slice(0, limit);
  }
  const res = NextResponse.json({ notifications: filtered });
  res.headers.set("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
  return res;
}

export async function POST(req: NextRequest) {
  // Allow creating notifications OR saving user notification preferences when body.kind === 'preferences'
  const body = (await req.json()) as Partial<AppNotification> & { kind?: string } & {
    preferences?: {
      userId: string;
      channels?: ("push" | "email" | "telegram" | "whatsapp")[];
      filters?: { departments?: Department[]; roles?: UserRole[]; kinds?: string[] };
    };
  };
  const now = new Date().toISOString();

  if (body.kind === "preferences" && body.preferences?.userId) {
    try {
      const PREF_FILE = `preferences_${body.preferences.userId}.json`;
      await writeJson(PREF_FILE, body.preferences);
      return NextResponse.json({ ok: true });
    } catch (e) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }
  }
  const toCreate: AppNotification = {
    id: body.id || `ntf_${Math.random().toString(36).slice(2)}`,
    title: body.title || "",
    message: body.message || "",
    createdAt: now,
    kind: body.kind || "department_relevant",
    intendedRoles: body.intendedRoles || [],
    intendedDepartments: body.intendedDepartments || [],
    documentId: body.documentId,
    channels: body.channels || ["push"],
    readByUserIds: [],
  };

  try {
    const all = await readJson<AppNotification[]>(FILE, DEMO_NOTIFICATIONS);
    all.unshift(toCreate);
    await writeJson(FILE, all);
  } catch (error) {
    // In serverless environment, just return the created notification
    // without persisting to file system
    console.log('Notification created (not persisted in serverless):', toCreate);
  }
  
  return NextResponse.json({ notification: toCreate }, { status: 201 });
}


