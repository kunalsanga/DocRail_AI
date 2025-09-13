import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/storage";
import { AppNotification, Department, UserRole } from "@/lib/types";

const FILE = "notifications.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = (searchParams.get("role") || undefined) as UserRole | undefined;
  const department = (searchParams.get("department") || undefined) as
    | Department
    | undefined;
  const userId = searchParams.get("userId") || undefined;
  const limit = Number(searchParams.get("limit") || "0");

  const all = await readJson<AppNotification[]>(FILE, []);

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
  const body = (await req.json()) as Partial<AppNotification>;
  const now = new Date().toISOString();
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

  const all = await readJson<AppNotification[]>(FILE, []);
  all.unshift(toCreate);
  await writeJson(FILE, all);
  return NextResponse.json({ notification: toCreate }, { status: 201 });
}


