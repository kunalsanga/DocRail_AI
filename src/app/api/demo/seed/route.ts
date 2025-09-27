import { NextRequest, NextResponse } from "next/server";
import { ensureFile, readJson, writeJson } from "@/lib/storage";
import { Annotation, AppNotification, AuditLog, DocumentVersion, ExtractedInsight, FeedbackEntry, ModelMetrics, TranslationEntry } from "@/lib/types";

export async function POST(_req: NextRequest) {
  const now = new Date().toISOString();

  // Documents and versions (generic corporate documents)
  const versions: DocumentVersion[] = [
    {
      id: "ver_safety_v32",
      documentId: "doc_safety_protocols_v32",
      version: 3,
      filePath: "/docs/safety_protocols_v3_2.pdf",
      summary: "Comprehensive safety protocols and emergency procedures for workplace operations",
      createdAt: now,
      createdBy: { id: "u_ops_01", name: "Operations Team" },
      changeNote: "Updated safety guidelines and emergency response procedures"
    },
    {
      id: "ver_project_phase2",
      documentId: "doc_project_phase2",
      version: 2,
      filePath: "/docs/project_phase2_specs.pdf",
      summary: "Project specifications and technical requirements for phase 2 implementation",
      createdAt: now,
      createdBy: { id: "u_eng_02", name: "Engineering Team" },
      changeNote: "Updated technical specifications and design requirements"
    },
    {
      id: "ver_compliance_annual",
      documentId: "doc_compliance_annual",
      version: 1,
      filePath: "/docs/annual_compliance_2024.pdf",
      summary: "Annual compliance report covering regulatory requirements and audit findings",
      createdAt: now,
      createdBy: { id: "u_admin_01", name: "Compliance Team" },
      changeNote: "Initial compliance assessment and recommendations"
    },
    {
      id: "ver_environmental_2024",
      documentId: "doc_environmental_2024",
      version: 1,
      filePath: "/docs/environmental_assessment_2024.pdf",
      summary: "Environmental impact assessment and sustainability initiatives report",
      createdAt: now,
      createdBy: { id: "u_env_01", name: "Environmental Team" },
      changeNote: "Environmental compliance and sustainability metrics"
    },
    {
      id: "ver_hr_policies",
      documentId: "doc_hr_policies",
      version: 4,
      filePath: "/docs/hr_policies_v4.pdf",
      summary: "Human resources policies and procedures including training and development programs",
      createdAt: now,
      createdBy: { id: "u_hr_01", name: "HR Team" },
      changeNote: "Updated employee handbook and training materials"
    },
    {
      id: "ver_financial_q4",
      documentId: "doc_financial_q4",
      version: 1,
      filePath: "/docs/financial_report_q4_2024.pdf",
      summary: "Quarterly financial report with budget analysis and cost optimization strategies",
      createdAt: now,
      createdBy: { id: "u_fin_01", name: "Finance Team" },
      changeNote: "Q4 financial performance and budget projections"
    },
    {
      id: "ver_it_security",
      documentId: "doc_it_security",
      version: 2,
      filePath: "/docs/it_security_framework.pdf",
      summary: "IT security framework and cybersecurity protocols for data protection",
      createdAt: now,
      createdBy: { id: "u_it_01", name: "IT Security Team" },
      changeNote: "Enhanced security measures and data protection protocols"
    },
    {
      id: "ver_quality_standards",
      documentId: "doc_quality_standards",
      version: 1,
      filePath: "/docs/quality_standards_2024.pdf",
      summary: "Quality assurance standards and process improvement methodologies",
      createdAt: now,
      createdBy: { id: "u_qa_01", name: "Quality Assurance" },
      changeNote: "Quality management system implementation"
    },
    {
      id: "ver_procurement_policy",
      documentId: "doc_procurement_policy",
      version: 3,
      filePath: "/docs/procurement_policy_v3.pdf",
      summary: "Procurement policies and vendor management procedures",
      createdAt: now,
      createdBy: { id: "u_proc_01", name: "Procurement Team" },
      changeNote: "Updated vendor selection criteria and contract management"
    },
    {
      id: "ver_training_manual",
      documentId: "doc_training_manual",
      version: 2,
      filePath: "/docs/training_manual_2024.pdf",
      summary: "Employee training manual with onboarding procedures and skill development programs",
      createdAt: now,
      createdBy: { id: "u_training_01", name: "Training Department" },
      changeNote: "Comprehensive training curriculum and certification programs"
    }
  ];

  const annotations: Annotation[] = [
    {
      id: "ann_1",
      documentId: "doc_safety_protocols_v32",
      author: { id: "u_ops_01", name: "Operations Team" },
      target: { type: "document" },
      content: "Updated safety protocols require immediate review and implementation across all departments.",
      tags: ["#safety", "@Operations", "#urgent"],
      createdAt: now
    },
    {
      id: "ann_2",
      documentId: "doc_project_phase2",
      author: { id: "u_eng_02", name: "Engineering Team" },
      target: { type: "document" },
      content: "Technical specifications updated to meet new industry standards and regulatory requirements.",
      tags: ["#engineering", "@Engineering", "#specifications"],
      createdAt: now
    },
    {
      id: "ann_3",
      documentId: "doc_compliance_annual",
      author: { id: "u_admin_01", name: "Compliance Team" },
      target: { type: "document" },
      content: "Compliance report highlights areas requiring immediate attention and corrective action.",
      tags: ["#compliance", "@Operations", "@Engineering", "#audit"],
      createdAt: now
    },
    {
      id: "ann_4",
      documentId: "doc_environmental_2024",
      author: { id: "u_env_01", name: "Environmental Team" },
      target: { type: "document" },
      content: "Environmental impact assessment identifies key sustainability initiatives for implementation.",
      tags: ["#environment", "@Environment", "#sustainability"],
      createdAt: now
    },
    {
      id: "ann_5",
      documentId: "doc_hr_policies",
      author: { id: "u_hr_01", name: "HR Team" },
      target: { type: "document" },
      content: "HR policies updated to reflect new employment regulations and best practices.",
      tags: ["#hr", "#training", "@HR", "#policies"],
      createdAt: now
    },
    {
      id: "ann_6",
      documentId: "doc_financial_q4",
      author: { id: "u_fin_01", name: "Finance Team" },
      target: { type: "document" },
      content: "Financial performance shows positive trends with recommendations for cost optimization.",
      tags: ["#finance", "@Finance", "#budget"],
      createdAt: now
    },
    {
      id: "ann_7",
      documentId: "doc_it_security",
      author: { id: "u_it_01", name: "IT Security Team" },
      target: { type: "document" },
      content: "Security framework implementation requires immediate attention to address vulnerabilities.",
      tags: ["#security", "@IT", "#cybersecurity"],
      createdAt: now
    },
    {
      id: "ann_8",
      documentId: "doc_quality_standards",
      author: { id: "u_qa_01", name: "Quality Assurance" },
      target: { type: "document" },
      content: "Quality standards updated to align with ISO 9001:2015 requirements and industry best practices.",
      tags: ["#quality", "@Quality Assurance", "#standards"],
      createdAt: now
    },
    {
      id: "ann_9",
      documentId: "doc_kmrl_safety_manual",
      author: { id: "u_safety_01", name: "സുരക്ഷാ സെൽ" },
      target: { type: "document" },
      content: "കൊച്ചി മെട്രോ റെയിൽ സുരക്ഷാ നിയമാവലി - പ്ലാറ്റ്ഫോം സുരക്ഷ, യാത്രക്കാരുടെ സുരക്ഷ, എമർജൻസി പ്രോട്ടോക്കോൾ എന്നിവയുടെ വിശദ നിർദ്ദേശങ്ങൾ.",
      tags: ["#സുരക്ഷ", "@Safety", "#പ്ലാറ്റ്ഫോം", "#എമർജൻസി"],
      createdAt: now
    },
    {
      id: "ann_10",
      documentId: "doc_train_operations_malayalam",
      author: { id: "u_ops_02", name: "ഓപ്പറേഷൻസ് ടീം" },
      target: { type: "document" },
      content: "ട്രെയിൻ ഓപ്പറേഷൻ പ്രൊസീജർ - സിഗ്നൽ സിസ്റ്റം, ട്രാക്ക് ക്ലിയറൻസ്, യാത്രക്കാരുടെ സുരക്ഷ എന്നിവയുടെ നടപടിക്രമങ്ങൾ.",
      tags: ["#ട്രെയിൻ", "@Operations", "#സിഗ്നൽ", "#സുരക്ഷ"],
      createdAt: now
    },
    {
      id: "ann_11",
      documentId: "doc_maintenance_schedule_malayalam",
      author: { id: "u_maint_01", name: "മെയിന്റനൻസ് ഡിപ്പാർട്ട്മെന്റ്" },
      target: { type: "document" },
      content: "മെയിന്റനൻസ് ഷെഡ്യൂൾ - ട്രാക്ക്, റോളിംഗ് സ്റ്റോക്ക്, സിഗ്നൽ, ഇലക്ട്രിക്കൽ മെയിന്റനൻസ് ഷെഡ്യൂൾ.",
      tags: ["#മെയിന്റനൻസ്", "@Maintenance", "#ട്രാക്ക്", "#ഇലക്ട്രിക്കൽ"],
      createdAt: now
    },
    {
      id: "ann_12",
      documentId: "doc_platform_safety_notice",
      author: { id: "u_station_01", name: "സ്റ്റേഷൻ മാനേജർ" },
      target: { type: "document" },
      content: "യാത്രക്കാരുടെ സുരക്ഷാ അറിയിപ്പ് - പ്ലാറ്റ്ഫോം സുരക്ഷ, ക്രൗഡ് മാനേജ്മെന്റ്, എമർജൻസി എവാക്യുവേഷൻ നിർദ്ദേശങ്ങൾ.",
      tags: ["#പ്ലാറ്റ്ഫോം", "@Safety", "#ക്രൗഡ്", "#എമർജൻസി"],
      createdAt: now
    },
    {
      id: "ann_13",
      documentId: "doc_electrical_maintenance_malayalam",
      author: { id: "u_elec_01", name: "ഇലക്ട്രിക്കൽ എഞ്ചിനീയറിംഗ്" },
      target: { type: "document" },
      content: "ഇലക്ട്രിക്കൽ സിസ്റ്റം മെയിന്റനൻസ് - പവർ സപ്ലൈ, ട്രാക്ഷൻ, സിഗ്നൽ പവർ, ലൈറ്റിംഗ് മെയിന്റനൻസ് നടപടിക്രമങ്ങൾ.",
      tags: ["#ഇലക്ട്രിക്കൽ", "@Engineering", "#പവർ", "#ട്രാക്ഷൻ"],
      createdAt: now
    },
    {
      id: "ann_14",
      documentId: "doc_driver_training_malayalam",
      author: { id: "u_train_01", name: "ട്രെയിനിംഗ് ഡിപ്പാർട്ട്മെന്റ്" },
      target: { type: "document" },
      content: "ട്രെയിൻ ഡ്രൈവർ ട്രെയിനിംഗ് മാനുവൽ - ഓപ്പറേഷൻ, സുരക്ഷ, എമർജൻസി, സിഗ്നൽ സിസ്റ്റം എന്നിവയുടെ സമഗ്ര ട്രെയിനിംഗ്.",
      tags: ["#ട്രെയിനിംഗ്", "@Training", "#ഡ്രൈവർ", "#സുരക്ഷ"],
      createdAt: now
    },
    {
      id: "ann_15",
      documentId: "doc_kmrl_compliance_malayalam",
      author: { id: "u_legal_01", name: "ലീഗൽ ഡിപ്പാർട്ട്മെന്റ്" },
      target: { type: "document" },
      content: "KMRL കമ്പ്ലയൻസ് നിയമാവലി - റെയിൽവേ, പരിസ്ഥിതി, ലേബർ, സുരക്ഷാ നിയമങ്ങളുടെ വിശദ നിർദ്ദേശങ്ങൾ.",
      tags: ["#കമ്പ്ലയൻസ്", "@Legal", "#റെയിൽവേ", "#നിയമങ്ങൾ"],
      createdAt: now
    },
    {
      id: "ann_16",
      documentId: "doc_station_management_malayalam",
      author: { id: "u_station_02", name: "സ്റ്റേഷൻ മാനേജ്മെന്റ്" },
      target: { type: "document" },
      content: "സ്റ്റേഷൻ മാനേജ്മെന്റ് പ്രൊസീജർ - ഓപ്പറേഷൻ, യാത്രക്കാരുടെ സേവനം, ക്രൗഡ് മാനേജ്മെന്റ്, എമർജൻസി നടപടിക്രമങ്ങൾ.",
      tags: ["#സ്റ്റേഷൻ", "@Operations", "#സേവനം", "#മാനേജ്മെന്റ്"],
      createdAt: now
    },
    {
      id: "ann_17",
      documentId: "doc_emergency_response_malayalam",
      author: { id: "u_emergency_01", name: "എമർജൻസി റെസ്പോൺസ് ടീം" },
      target: { type: "document" },
      content: "എമർജൻസി റെസ്പോൺസ് പ്രൊസീജർ - ഫയർ, മെഡിക്കൽ, സെക്യൂരിറ്റി, ട്രെയിൻ ബ്രേക്ക് ഡൗൺ എന്നിവയുടെ നടപടിക്രമങ്ങൾ.",
      tags: ["#എമർജൻസി", "@Safety", "#ഫയർ", "#മെഡിക്കൽ"],
      createdAt: now
    },
    {
      id: "ann_18",
      documentId: "doc_procurement_policy",
      author: { id: "u_proc_01", name: "Procurement Team" },
      target: { type: "document" },
      content: "Procurement policies revised to improve vendor selection and contract management processes.",
      tags: ["#procurement", "@Procurement", "#vendors"],
      createdAt: now
    },
    {
      id: "ann_10",
      documentId: "doc_training_manual",
      author: { id: "u_training_01", name: "Training Department" },
      target: { type: "document" },
      content: "Training manual updated with new certification programs and skill development pathways.",
      tags: ["#training", "@HR", "#development"],
      createdAt: now
    }
  ];

  const audit: AuditLog[] = [
    { id: "aud_1", documentId: "doc_safety_protocols_v32", actor: { id: "u_ops_01", name: "Operations Team" }, action: "update_version", details: { version: 3 }, createdAt: now },
    { id: "aud_2", documentId: "doc_project_phase2", actor: { id: "u_eng_02", name: "Engineering Team" }, action: "upload", details: { file: "pdf" }, createdAt: now },
    { id: "aud_3", documentId: "doc_compliance_annual", actor: { id: "u_admin_01", name: "Compliance Team" }, action: "upload", details: {}, createdAt: now },
    { id: "aud_4", documentId: "doc_environmental_2024", actor: { id: "u_env_01", name: "Environmental Team" }, action: "upload", details: {}, createdAt: now },
    { id: "aud_5", documentId: "doc_hr_policies", actor: { id: "u_hr_01", name: "HR Team" }, action: "annotate", details: { tag: "#training" }, createdAt: now },
    { id: "aud_6", documentId: "doc_financial_q4", actor: { id: "u_fin_01", name: "Finance Team" }, action: "upload", details: {}, createdAt: now },
    { id: "aud_7", documentId: "doc_it_security", actor: { id: "u_it_01", name: "IT Security Team" }, action: "update_version", details: { version: 2 }, createdAt: now },
    { id: "aud_8", documentId: "doc_quality_standards", actor: { id: "u_qa_01", name: "Quality Assurance" }, action: "upload", details: {}, createdAt: now },
    { id: "aud_9", documentId: "doc_procurement_policy", actor: { id: "u_proc_01", name: "Procurement Team" }, action: "update_version", details: { version: 3 }, createdAt: now },
    { id: "aud_10", documentId: "doc_training_manual", actor: { id: "u_training_01", name: "Training Department" }, action: "annotate", details: { tag: "#development" }, createdAt: now }
  ];

  const notifications: AppNotification[] = [
    { 
      id: "ntf_demo_1", 
      title: "Safety Protocol Update Released", 
      message: "Updated safety protocols and emergency procedures have been published and require immediate review.", 
      kind: "new_directive", 
      createdAt: now, 
      intendedRoles: ["admin", "director"], 
      intendedDepartments: ["Operations", "Engineering"], 
      documentId: "doc_safety_protocols_v32", 
      channels: ["push", "email"], 
      readByUserIds: [] 
    },
    { 
      id: "ntf_demo_2", 
      title: "Project Specifications Updated", 
      message: "Technical specifications for Phase 2 project have been revised to meet new industry standards.", 
      kind: "department_relevant", 
      createdAt: now, 
      intendedRoles: ["engineer", "admin"], 
      intendedDepartments: ["Engineering", "Project Management"], 
      documentId: "doc_project_phase2", 
      channels: ["push"], 
      readByUserIds: [] 
    },
    { 
      id: "ntf_demo_3", 
      title: "Compliance Deadline Approaching", 
      message: "Annual compliance report submission deadline is approaching. Please ensure all required documents are reviewed.", 
      kind: "deadline_approaching", 
      createdAt: now, 
      intendedRoles: ["admin", "director"], 
      intendedDepartments: ["Compliance", "Operations"], 
      documentId: "doc_compliance_annual", 
      channels: ["push", "email"], 
      readByUserIds: [] 
    },
    { 
      id: "ntf_demo_4", 
      title: "Environmental Assessment Complete", 
      message: "Environmental impact assessment has been completed and is ready for review by the environmental team.", 
      kind: "department_relevant", 
      createdAt: now, 
      intendedRoles: ["admin"], 
      intendedDepartments: ["Environment"], 
      documentId: "doc_environmental_2024", 
      channels: ["push", "email"], 
      readByUserIds: [] 
    },
    { 
      id: "ntf_demo_5", 
      title: "HR Policy Updates", 
      message: "Human resources policies have been updated to reflect new employment regulations and best practices.", 
      kind: "new_directive", 
      createdAt: now, 
      intendedRoles: ["admin", "hr"], 
      intendedDepartments: ["HR"], 
      documentId: "doc_hr_policies", 
      channels: ["push", "email"], 
      readByUserIds: [] 
    },
    { 
      id: "ntf_demo_6", 
      title: "Financial Report Available", 
      message: "Q4 financial report is now available for review by the finance team and management.", 
      kind: "department_relevant", 
      createdAt: now, 
      intendedRoles: ["admin", "finance"], 
      intendedDepartments: ["Finance"], 
      documentId: "doc_financial_q4", 
      channels: ["push"], 
      readByUserIds: [] 
    },
    { 
      id: "ntf_demo_7", 
      title: "Security Framework Update", 
      message: "IT security framework has been updated with enhanced cybersecurity protocols and requires implementation.", 
      kind: "new_directive", 
      createdAt: now, 
      intendedRoles: ["admin", "engineer"], 
      intendedDepartments: ["IT"], 
      documentId: "doc_it_security", 
      channels: ["push", "email"], 
      readByUserIds: [] 
    },
    { 
      id: "ntf_demo_8", 
      title: "Quality Standards Updated", 
      message: "Quality assurance standards have been updated to align with ISO 9001:2015 requirements.", 
      kind: "department_relevant", 
      createdAt: now, 
      intendedRoles: ["admin"], 
      intendedDepartments: ["Quality Assurance"], 
      documentId: "doc_quality_standards", 
      channels: ["push"], 
      readByUserIds: [] 
    }
  ];

  const insights: ExtractedInsight[] = [
    { 
      id: "ins_demo_1", 
      documentId: "doc_safety_protocols_v32", 
      summary: "Safety protocols require regular audits and immediate implementation across all departments.", 
      entities: [{ type: "department", value: "Operations", confidence: 0.92 }], 
      safetyScore: 85, 
      complianceScore: 78, 
      overallConfidence: 0.9, 
      createdAt: now 
    },
    { 
      id: "ins_demo_2", 
      documentId: "doc_environmental_2024", 
      summary: "Environmental assessment identifies key sustainability initiatives requiring immediate attention.", 
      entities: [{ type: "department", value: "Environment", confidence: 0.88 }], 
      safetyScore: 60, 
      complianceScore: 90, 
      overallConfidence: 0.85, 
      createdAt: now 
    },
    { 
      id: "ins_demo_3", 
      documentId: "doc_compliance_annual", 
      summary: "Compliance report highlights critical areas requiring immediate corrective action and process improvements.", 
      entities: [{ type: "department", value: "Compliance", confidence: 0.95 }], 
      safetyScore: 70, 
      complianceScore: 65, 
      overallConfidence: 0.88, 
      createdAt: now 
    },
    { 
      id: "ins_demo_4", 
      documentId: "doc_it_security", 
      summary: "Security framework implementation requires immediate attention to address identified vulnerabilities.", 
      entities: [{ type: "department", value: "IT", confidence: 0.90 }], 
      safetyScore: 45, 
      complianceScore: 85, 
      overallConfidence: 0.82, 
      createdAt: now 
    },
    { 
      id: "ins_demo_5", 
      documentId: "doc_financial_q4", 
      summary: "Financial performance analysis reveals positive trends with recommendations for cost optimization strategies.", 
      entities: [{ type: "department", value: "Finance", confidence: 0.87 }], 
      safetyScore: 30, 
      complianceScore: 95, 
      overallConfidence: 0.90, 
      createdAt: now 
    }
  ];

  const feedback: FeedbackEntry[] = [
    { 
      id: "fb_demo_1", 
      userId: "u_ops_01", 
      documentId: "doc_safety_protocols_v32", 
      rating: 5, 
      comment: "Excellent safety protocols summary. Very useful for team briefings and training sessions.", 
      language: "en", 
      createdAt: now 
    },
    { 
      id: "fb_demo_2", 
      userId: "u_hr_01", 
      documentId: "doc_hr_policies", 
      rating: 4, 
      comment: "HR policies are comprehensive. Would benefit from multilingual support for better accessibility.", 
      language: "en", 
      createdAt: now 
    },
    { 
      id: "fb_demo_3", 
      userId: "u_eng_02", 
      documentId: "doc_project_phase2", 
      rating: 5, 
      comment: "Technical specifications are detailed and well-structured. Great reference for project implementation.", 
      language: "en", 
      createdAt: now 
    },
    { 
      id: "fb_demo_4", 
      userId: "u_fin_01", 
      documentId: "doc_financial_q4", 
      rating: 4, 
      comment: "Financial report provides clear insights. Charts and graphs are particularly helpful for analysis.", 
      language: "en", 
      createdAt: now 
    },
    { 
      id: "fb_demo_5", 
      userId: "u_it_01", 
      documentId: "doc_it_security", 
      rating: 5, 
      comment: "Security framework is comprehensive and addresses current cybersecurity challenges effectively.", 
      language: "en", 
      createdAt: now 
    },
    { 
      id: "fb_demo_6", 
      userId: "u_qa_01", 
      documentId: "doc_quality_standards", 
      rating: 4, 
      comment: "Quality standards align well with ISO requirements. Implementation guidelines are clear and actionable.", 
      language: "en", 
      createdAt: now 
    }
  ];

  const metrics: ModelMetrics = {
    totalFeedback: feedback.length,
    averageRating: Number((feedback.reduce((a, b) => a + b.rating, 0) / feedback.length).toFixed(2)),
    lastUpdated: now
  };

  const translations: TranslationEntry[] = [
    { 
      id: "tr_demo_1", 
      documentId: "doc_safety_protocols_v32", 
      sourceLang: "en", 
      targetLang: "ml", 
      sourceText: "Safety protocols require immediate implementation across all departments.", 
      translatedText: "Safety protocols require immediate implementation across all departments. [Malayalam]", 
      createdAt: now 
    },
    { 
      id: "tr_demo_2", 
      documentId: "doc_hr_policies", 
      sourceLang: "en", 
      targetLang: "ml", 
      sourceText: "HR policies updated to reflect new employment regulations and best practices.", 
      translatedText: "HR policies updated to reflect new employment regulations and best practices. [Malayalam]", 
      createdAt: now 
    },
    { 
      id: "tr_demo_3", 
      documentId: "doc_compliance_annual", 
      sourceLang: "en", 
      targetLang: "ml", 
      sourceText: "Compliance report highlights areas requiring immediate attention and corrective action.", 
      translatedText: "Compliance report highlights areas requiring immediate attention and corrective action. [Malayalam]", 
      createdAt: now 
    }
  ];

  const routing = [
    { 
      id: "rt_demo_1", 
      documentId: "doc_safety_protocols_v32", 
      toRoles: ["engineer", "admin"], 
      toDepartments: ["Operations"], 
      reason: "safety", 
      createdAt: now 
    },
    { 
      id: "rt_demo_2", 
      documentId: "doc_compliance_annual", 
      toRoles: ["admin", "director"], 
      toDepartments: ["Compliance"], 
      reason: "compliance", 
      createdAt: now 
    },
    { 
      id: "rt_demo_3", 
      documentId: "doc_it_security", 
      toRoles: ["engineer", "admin"], 
      toDepartments: ["IT"], 
      reason: "security", 
      createdAt: now 
    },
    { 
      id: "rt_demo_4", 
      documentId: "doc_financial_q4", 
      toRoles: ["admin", "finance"], 
      toDepartments: ["Finance"], 
      reason: "financial", 
      createdAt: now 
    }
  ];

  // Ensure files exist and then write seed data
  await Promise.all([
    ensureFile("annotations.json", []),
    ensureFile("versions.json", []),
    ensureFile("audit.json", []),
    ensureFile("notifications.json", []),
    ensureFile("insights.json", []),
    ensureFile("feedback.json", []),
    ensureFile("metrics.json", { totalFeedback: 0, averageRating: 0, lastUpdated: now }),
    ensureFile("translations.json", []),
    ensureFile("routing.json", [])
  ]);

  // Merge with existing where applicable to avoid blowing away user demo state
  const [
    existingAnn,
    existingVer,
    existingAudit,
    existingNotif,
    existingInsights,
    existingFeedback,
    _existingMetrics,
    existingTrans,
    existingRouting
  ] = await Promise.all([
    readJson<Annotation[]>("annotations.json", []),
    readJson<DocumentVersion[]>("versions.json", []),
    readJson<AuditLog[]>("audit.json", []),
    readJson<AppNotification[]>("notifications.json", []),
    readJson<ExtractedInsight[]>("insights.json", []),
    readJson<FeedbackEntry[]>("feedback.json", []),
    readJson<ModelMetrics>("metrics.json", { totalFeedback: 0, averageRating: 0, lastUpdated: now }),
    readJson<TranslationEntry[]>("translations.json", []),
    readJson<any[]>("routing.json", [])
  ]);

  const upsert = <T extends { id: string }>(base: T[], add: T[]) => {
    const seen = new Set(base.map(b => b.id));
    for (const item of add) if (!seen.has(item.id)) base.unshift(item);
    return base;
  };

  await Promise.all([
    writeJson("annotations.json", upsert(existingAnn, annotations)),
    writeJson("versions.json", upsert(existingVer, versions)),
    writeJson("audit.json", upsert(existingAudit, audit)),
    writeJson("notifications.json", upsert(existingNotif, notifications)),
    writeJson("insights.json", upsert(existingInsights, insights)),
    writeJson("feedback.json", upsert(existingFeedback, feedback)),
    writeJson("metrics.json", metrics),
    writeJson("translations.json", upsert(existingTrans, translations)),
    writeJson("routing.json", upsert(existingRouting, routing)),
  ]);

  return NextResponse.json({ ok: true, seeded: true, counts: {
    annotations: annotations.length,
    versions: versions.length,
    audit: audit.length,
    notifications: notifications.length,
    insights: insights.length,
    feedback: feedback.length,
  } });
}


