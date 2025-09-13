"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VirtualList from "@/components/ui/virtual-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  documentId: string;
}

interface AnnotationItem {
  id: string;
  documentId: string;
  content: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  author: { id: string; name: string };
}

export default function AnnotationsPanel({ documentId }: Props) {
  const { user } = useAuth();
  const [items, setItems] = useState<AnnotationItem[]>([]);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/annotations?documentId=${encodeURIComponent(documentId)}`);
        const data = await res.json();
        setItems(data.annotations || []);
      } catch {}
    };
    load();
  }, [documentId]);

  const handleAdd = async () => {
    if (!content.trim() || !user) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/annotations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          content,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          author: { id: user.id, name: user.name },
          target: { type: "summary" },
        }),
      });
      const data = await res.json();
      setItems((prev) => [data.annotation as AnnotationItem, ...prev]);
      setContent("");
      setTags("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Annotations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2">
          <Textarea
            placeholder="Add a comment, note, or @Department tag"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Input
            placeholder="Tags (comma separated, e.g., @Finance,#safety)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <Button onClick={handleAdd} disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Annotation"}
          </Button>
        </div>
        {items.length > 0 ? (
          <VirtualList
            items={items}
            itemHeight={84}
            overscan={6}
            className="border rounded"
            style={{ height: 360 }}
            renderItem={(a) => (
              <div key={a.id} className="m-2 border rounded p-2">
                <div className="text-sm font-medium truncate">{a.author?.name}</div>
                <div className="text-sm text-muted-foreground line-clamp-2">{a.content}</div>
                {a.tags && a.tags.length > 0 && (
                  <div className="mt-1 text-xs text-gray-500 truncate">{a.tags.join(", ")}</div>
                )}
                <div className="text-xs text-gray-400 mt-1">{new Date(a.createdAt).toLocaleString()}</div>
              </div>
            )}
          />
        ) : (
          <div className="text-sm text-muted-foreground">No annotations yet.</div>
        )}
      </CardContent>
    </Card>
  );
}


