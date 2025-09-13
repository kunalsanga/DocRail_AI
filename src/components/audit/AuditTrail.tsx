"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  documentId?: string;
}

interface AuditItem {
  id: string;
  documentId?: string;
  action: string;
  createdAt: string;
  actor: { id: string; name: string };
  details?: Record<string, unknown>;
}

export default function AuditTrail({ documentId }: Props) {
  const [items, setItems] = useState<AuditItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const qs = new URLSearchParams();
      if (documentId) qs.set("documentId", documentId);
      const res = await fetch(`/api/audit?${qs.toString()}`);
      const data = await res.json();
      setItems(data.logs || []);
    };
    load();
  }, [documentId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Trail</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((a) => (
          <div key={a.id} className="border rounded p-2">
            <div className="text-sm font-medium">{a.actor?.name} • {a.action}</div>
            {a.details && (
              <pre className="text-xs text-gray-500 mt-1 overflow-auto">{JSON.stringify(a.details, null, 2)}</pre>
            )}
            <div className="text-xs text-gray-400 mt-1">{new Date(a.createdAt).toLocaleString()}</div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-sm text-muted-foreground">No audit entries.</div>
        )}
      </CardContent>
    </Card>
  );
}


