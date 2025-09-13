"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  documentId: string;
}

interface VersionItem {
  id: string;
  version: number;
  summary?: string;
  createdAt: string;
  createdBy: { id: string; name: string };
  changeNote?: string;
}

export default function VersionHistory({ documentId }: Props) {
  const [versions, setVersions] = useState<VersionItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/documents/versions?documentId=${encodeURIComponent(documentId)}`);
      const data = await res.json();
      setVersions(data.versions || []);
    };
    load();
  }, [documentId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Version History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {versions.map((v) => (
          <div key={v.id} className="border rounded p-2">
            <div className="text-sm font-medium">v{v.version} - {v.createdBy?.name}</div>
            {v.changeNote && <div className="text-xs text-gray-500">{v.changeNote}</div>}
            {v.summary && <div className="text-xs text-muted-foreground mt-1">{v.summary}</div>}
            <div className="text-xs text-gray-400 mt-1">{new Date(v.createdAt).toLocaleString()}</div>
          </div>
        ))}
        {versions.length === 0 && (
          <div className="text-sm text-muted-foreground">No versions yet.</div>
        )}
      </CardContent>
    </Card>
  );
}


