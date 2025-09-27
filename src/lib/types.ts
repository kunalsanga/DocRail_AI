// Core domain enums and types for KMRL document hub extensions

export type UserRole =
  | "station_manager"
  | "engineer"
  | "hr"
  | "finance"
  | "director"
  | "admin";

export type Department =
  | "Operations"
  | "Engineering"
  | "HR"
  | "Finance"
  | "Corporate Affairs"
  | "Architecture & Planning"
  | "Project Management"
  | "Environment"
  | "Commercial"
  | "IT"
  | "Compliance"
  | "Quality Assurance";

export type RiskLevel = "low" | "medium" | "high";

export type NotificationChannel = "push" | "email" | "telegram" | "whatsapp";

export type NotificationKind =
  | "new_directive"
  | "department_relevant"
  | "deadline_approaching"
  | "audit_upcoming";

export interface UserRef {
  id: string;
  name: string;
  email?: string;
  role?: UserRole;
  department?: Department;
}

export interface DocumentMeta {
  id: string;
  title: string;
  category: string;
  department?: Department;
  createdAt: string; // ISO
  updatedAt?: string; // ISO
  riskLevel?: RiskLevel;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string; // ISO
  kind: NotificationKind;
  intendedRoles?: UserRole[];
  intendedDepartments?: Department[];
  documentId?: string;
  channels?: NotificationChannel[];
  readByUserIds?: string[];
}

export interface Annotation {
  id: string;
  documentId: string;
  author: UserRef;
  target: {
    type: "summary" | "document";
    selector?: {
      start?: number;
      end?: number;
      text?: string;
    };
  };
  content: string;
  tags?: string[]; // e.g., ["@Finance", "#urgent"]
  createdAt: string; // ISO
  updatedAt?: string; // ISO
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  filePath?: string;
  summary?: string;
  createdAt: string; // ISO
  createdBy: UserRef;
  changeNote?: string;
}

export interface AuditLog {
  id: string;
  documentId?: string;
  actor: UserRef;
  action:
    | "upload"
    | "summarize"
    | "annotate"
    | "update_version"
    | "translate"
    | "notify";
  details?: Record<string, unknown>;
  createdAt: string; // ISO
}

export interface TranslationEntry {
  id: string;
  documentId: string;
  sourceLang: "en" | "ml";
  targetLang: "en" | "ml";
  sourceText?: string;
  translatedText: string;
  createdAt: string;
  createdBy?: UserRef;
}

export interface ImpactScore {
  costImpact: number; // 0-100
  safetyImpact: number; // 0-100
  operationalImpact: number; // 0-100
  overall: number; // 0-100
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: "document" | "category" | "department";
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

// OCR/NLP Extraction Types
export interface OcrResult {
  language: "en" | "ml";
  text: string;
  confidence: number; // 0-1
}

export interface NlpEntity {
  type:
    | "safety_warning"
    | "deadline"
    | "department"
    | "amount"
    | "regulation"
    | "person"
    | "location"
    | "other";
  value: string;
  confidence: number; // 0-1
  start?: number;
  end?: number;
}

export interface ExtractedInsight {
  id: string;
  documentId: string; // traceability to source document
  summary: string;
  entities: NlpEntity[];
  safetyScore?: number; // 0-100
  complianceScore?: number; // 0-100
  overallConfidence: number; // 0-1
  createdAt: string; // ISO
}

// Feedback & Adaptive Learning
export interface FeedbackEntry {
  id: string;
  userId?: string;
  documentId?: string;
  insightId?: string;
  rating: number; // 1-5
  comment?: string;
  language?: "en" | "ml";
  createdAt: string; // ISO
}

export interface ModelMetrics {
  totalFeedback: number;
  averageRating: number; // 1-5
  lastUpdated: string; // ISO
}


