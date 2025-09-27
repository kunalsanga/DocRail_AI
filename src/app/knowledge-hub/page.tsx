"use client";

import { useEffect, useRef, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  ArrowLeft, 
  Search, 
  Filter, 
  Network, 
  FileText, 
  Tag, 
  Eye,
  RefreshCw
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import Link from "next/link";
import IconBadge from "@/components/ui/IconBadge";

interface KnowledgeNode {
  id: string;
  label: string;
  type: "document" | "category" | "department";
  x?: number;
  y?: number;
}

interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
}

interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

export default function KnowledgeHubPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [graph, setGraph] = useState<KnowledgeGraph | null>(null);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  // zoom controls removed for now to keep UI minimal
  const router = useRouter();
  // Cache computed node positions to avoid recompute and enable accurate clicks
  const positionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  // Throttle redraws
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/knowledge/graph");
        const data = await res.json();
        setGraph(data.graph);
        drawGraph(data.graph);
      } catch (error) {
        console.error('Failed to load knowledge graph:', error);
        // Load demo data if API fails
        const demoGraph: KnowledgeGraph = {
          nodes: [
            { id: "doc_safety_protocols_v32", label: "Safety Protocols v3.2", type: "document" },
            { id: "doc_station_design_phase2", label: "Station Design Phase 2", type: "document" },
            { id: "doc_compliance_annual", label: "Compliance Report 2024", type: "document" },
            { id: "doc_eia_report_2024", label: "EIA Report 2024", type: "document" },
            { id: "doc_maintenance_contract", label: "Maintenance Contract", type: "document" },
            { id: "doc_financial_audit", label: "Financial Audit Q4", type: "document" },
            { id: "doc_hr_policies", label: "HR Policies Update", type: "document" },
            { id: "doc_it_security", label: "IT Security Framework", type: "document" },
            { id: "doc_crs_bulletin_2024_02", label: "CRS Platform Safety Bulletin 2024-02", type: "document" },
            { id: "doc_design_change_axle_v31", label: "Design Change – Axle Spec v3.1", type: "document" },
            { id: "doc_bilingual_safety_notice", label: "Bilingual Safety Notice", type: "document" },
            { id: "dept_Operations", label: "Operations", type: "department" },
            { id: "dept_Engineering", label: "Engineering", type: "department" },
            { id: "dept_Architecture & Planning", label: "Architecture & Planning", type: "department" },
            { id: "dept_Environment", label: "Environment", type: "department" },
            { id: "dept_Commercial", label: "Commercial", type: "department" },
            { id: "dept_Finance", label: "Finance", type: "department" },
            { id: "dept_HR", label: "HR", type: "department" },
            { id: "dept_IT", label: "IT", type: "department" },
            { id: "cat_safety", label: "Safety", type: "category" },
            { id: "cat_emergency", label: "Emergency", type: "category" },
            { id: "cat_design", label: "Design", type: "category" },
            { id: "cat_compliance", label: "Compliance", type: "category" },
            { id: "cat_environment", label: "Environment", type: "category" },
            { id: "cat_finance", label: "Finance", type: "category" },
            { id: "cat_security", label: "Security", type: "category" },
            { id: "cat_regulatory", label: "Regulatory", type: "category" },
            { id: "cat_bilingual", label: "Bilingual", type: "category" }
          ],
          edges: [
            { id: "e1", source: "doc_safety_protocols_v32", target: "dept_Operations", relation: "mentioned_in" },
            { id: "e2", source: "doc_safety_protocols_v32", target: "dept_Engineering", relation: "mentioned_in" },
            { id: "e3", source: "doc_safety_protocols_v32", target: "cat_safety", relation: "categorized_as" },
            { id: "e4", source: "doc_safety_protocols_v32", target: "cat_emergency", relation: "categorized_as" },
            { id: "e5", source: "doc_station_design_phase2", target: "dept_Architecture & Planning", relation: "mentioned_in" },
            { id: "e6", source: "doc_station_design_phase2", target: "dept_Engineering", relation: "mentioned_in" },
            { id: "e7", source: "doc_station_design_phase2", target: "cat_design", relation: "categorized_as" },
            { id: "e8", source: "doc_compliance_annual", target: "dept_Operations", relation: "mentioned_in" },
            { id: "e9", source: "doc_compliance_annual", target: "cat_compliance", relation: "categorized_as" },
            { id: "e10", source: "doc_eia_report_2024", target: "dept_Environment", relation: "mentioned_in" },
            { id: "e11", source: "doc_eia_report_2024", target: "cat_environment", relation: "categorized_as" },
            { id: "e12", source: "doc_financial_audit", target: "dept_Finance", relation: "mentioned_in" },
            { id: "e13", source: "doc_financial_audit", target: "cat_finance", relation: "categorized_as" },
            { id: "e14", source: "doc_hr_policies", target: "dept_HR", relation: "mentioned_in" },
            { id: "e15", source: "doc_it_security", target: "dept_IT", relation: "mentioned_in" },
            { id: "e16", source: "doc_it_security", target: "cat_security", relation: "categorized_as" },
            { id: "e17", source: "doc_crs_bulletin_2024_02", target: "dept_Operations", relation: "impacts" },
            { id: "e18", source: "doc_crs_bulletin_2024_02", target: "cat_regulatory", relation: "categorized_as" },
            { id: "e19", source: "doc_design_change_axle_v31", target: "dept_Engineering", relation: "authored_by" },
            { id: "e20", source: "doc_design_change_axle_v31", target: "dept_Finance", relation: "impacts" },
            { id: "e21", source: "doc_design_change_axle_v31", target: "cat_design", relation: "categorized_as" },
            { id: "e22", source: "doc_bilingual_safety_notice", target: "dept_Operations", relation: "addressed_to" },
            { id: "e23", source: "doc_bilingual_safety_notice", target: "cat_bilingual", relation: "categorized_as" },
            { id: "e24", source: "doc_bilingual_safety_notice", target: "cat_safety", relation: "categorized_as" }
          ]
        };
        setGraph(demoGraph);
        drawGraph(demoGraph);
      }
      setIsLoading(false);
    };
    load();

    // Add resize handler
    let resizeRaf: number | null = null;
    const handleResize = () => {
      if (!graph) return;
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => drawGraph(graph));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redraw when selection changes
  useEffect(() => {
    if (graph) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawGraph(graph));
    }
  }, [selectedNode, graph]);

  const drawGraph = (graphData: KnowledgeGraph) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match container
    const container = canvas.parentElement;
    if (container) {
      const rect = container.getBoundingClientRect();
      canvas.width = Math.min(1000, rect.width - 32);
      canvas.height = Math.min(640, rect.height - 32);
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create a better layout using force simulation
    const nodes = graphData.nodes.map((node, i) => {
      const n = Math.max(1, graphData.nodes.length);
      const angle = -Math.PI / 2 + (i * (2 * Math.PI / n)); // start at top, place evenly on circle
      const radius = Math.min(canvas.width, canvas.height) * 0.40;
      return {
        ...node,
        x: canvas.width / 2 + Math.cos(angle) * radius,
        y: canvas.height / 2 + Math.sin(angle) * radius
      };
    });

    // Save positions for click detection without mutating state
    const pos = new Map<string, { x: number; y: number }>();
    nodes.forEach(n => pos.set(n.id, { x: n.x!, y: n.y! }));
    positionsRef.current = pos;

    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    // Draw edges with gradient
    graphData.edges.forEach(edge => {
      const source = nodeMap.get(edge.source);
      const target = nodeMap.get(edge.target);
      if (source && target) {
        ctx.strokeStyle = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target) 
          ? "#3b82f6" : "#e2e8f0";
        ctx.lineWidth = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target) ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(source.x!, source.y!);
        ctx.lineTo(target.x!, target.y!);
        ctx.stroke();
      }
    });

    // Draw nodes with enhanced styling
    nodes.forEach((node, i) => {
      const isSelected = selectedNode?.id === node.id;
      const radius = isSelected ? 14 : 10;
      
      // Node color based on type with better colors
      let color = "#64748b";
      if (node.type === "document") {
        color = "#3b82f6";
      } else if (node.type === "department") {
        color = "#10b981";
      } else if (node.type === "category") {
        color = "#f59e0b";
      }

      // Draw node
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(node.x!, node.y!, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw border if selected
      if (isSelected) {
        ctx.strokeStyle = "#1f2937";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw label with better typography
      ctx.fillStyle = "#1f2937";
      ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      const label = node.label.length > 24 ? node.label.substring(0, 24) + "..." : node.label;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const dx = (node.x! - centerX);
      const dy = (node.y! - centerY);
      const dist = Math.max(1, Math.hypot(dx, dy));
      // place label outside the circle along the radial direction
      const outward = (isSelected ? 26 : 20) + ((i % 2) * 8);
      const lx = node.x! + (dx / dist) * outward;
      const ly = node.y! + (dy / dist) * outward;
      ctx.fillText(label, lx, ly);
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !graph) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked node using cached positions
    let clicked: KnowledgeNode | null = null;
    for (const node of graph.nodes) {
      const p = positionsRef.current.get(node.id);
      if (!p) continue;
      const distance = Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2);
      if (distance <= 14) {
        clicked = node;
        break;
      }
    }

    setSelectedNode(clicked || null);
  };

  const [searchResults, setSearchResults] = useState<KnowledgeNode[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("query", searchQuery);
        if (filterType) params.set("type", filterType);
        const res = await fetch(`/api/knowledge/search?${params.toString()}`, { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          setSearchResults((data.nodes || []).map((n: any) => ({ id: n.id, label: n.label, type: n.type })));
        }
      } catch (e) {
        // ignore
      }
    };
    run();
    return () => controller.abort();
  }, [searchQuery, filterType]);

  const filteredNodes = searchQuery || filterType !== "all" ? searchResults : (graph?.nodes || []);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "document": return <FileText className="w-4 h-4" />;
      case "department": return <Building2 className="w-4 h-4" />;
      case "category": return <Tag className="w-4 h-4" />;
      default: return <Network className="w-4 h-4" />;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case "document": return "bg-blue-50 text-blue-700 border-blue-200";
      case "department": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "category": return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => router.back()}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Knowledge Hub</h1>
                  <p className="text-slate-600 text-sm">Interactive knowledge graph</p>
                </div>
              </div>
              {/* Right actions intentionally minimal for a cleaner look */}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">

          {/* Controls */}
          <Card className="mb-6 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 h-10 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="all">All</option>
                    <option value="document">Documents</option>
                    <option value="department">Departments</option>
                    <option value="category">Categories</option>
                  </select>

                  <Button 
                    onClick={() => {
                      setSearchQuery("");
                      setFilterType("all");
                      setSelectedNode(null);
                    }}
                    variant="outline"
                    className="px-3 h-10"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Enhanced Graph Canvas */}
            <div className="lg:col-span-3">
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center space-x-2">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Network className="w-5 h-5 text-slate-600" />
                    </div>
                    <span>Graph</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="border border-slate-200 rounded-xl bg-white p-4">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-[500px]">
                        <div className="text-center">
                          <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
                          <p className="text-slate-600">Loading knowledge graph...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-[640px] flex items-center justify-center">
                        <canvas 
                          ref={canvasRef} 
                          width={1000} 
                          height={640}
                          onClick={handleCanvasClick}
                          className="cursor-pointer border rounded-lg bg-white shadow-inner max-w-full max-h-full"
                        />
                      </div>
                    )}
                  </div>
                   
                  {/* Legend (condensed) */}
                  <div className="mt-3 flex items-center justify-center gap-5 text-xs text-slate-600">
                    <div className="flex items-center gap-2"><span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500"></span>Docs</div>
                    <div className="flex items-center gap-2"><span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Depts</div>
                    <div className="flex items-center gap-2"><span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500"></span>Categories</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Selected Node Details */}
              {selectedNode ? (
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center space-x-2">
                      <div className={`p-2 rounded-md ${getNodeColor(selectedNode.type).split(' ')[0]} ${getNodeColor(selectedNode.type).split(' ')[0].replace('50', '100')}`}>
                        {getNodeIcon(selectedNode.type)}
                      </div>
                      <span>Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">{selectedNode.label}</h3>
                      <Badge variant="outline" className={`${getNodeColor(selectedNode.type)} font-medium`}>
                        {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
                      </Badge>
                    </div>
                     
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Connected Nodes</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {graph?.edges
                          .filter(edge => edge.source === selectedNode.id || edge.target === selectedNode.id)
                          .map(edge => {
                            const connectedNodeId = edge.source === selectedNode.id ? edge.target : edge.source;
                            const connectedNode = graph?.nodes.find(n => n.id === connectedNodeId);
                            return connectedNode ? (
                              <div key={edge.id} className="flex items-start gap-2 p-2 bg-slate-50 rounded-md">
                                <Badge variant="outline" className="text-xs bg-white border-slate-300 capitalize">
                                  {edge.relation.replace('_', ' ')}
                                </Badge>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-900 truncate">
                                    {connectedNode.label}
                                  </p>
                                  <p className="text-xs text-slate-500 capitalize">
                                    {connectedNode.type}
                                  </p>
                                </div>
                              </div>
                            ) : null;
                          }) || []}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-sm">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Network className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Select a Node</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Click on any node in the graph to explore its connections and details.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Search Results */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Filter className="w-4 h-4 text-slate-600" />
                      </div>
                      <span>Results</span>
                    </div>
                    <Badge variant="outline" className="bg-slate-50 text-xs">
                      {filteredNodes.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {filteredNodes.length > 0 ? (
                      filteredNodes.map(node => (
                        <button
                          key={node.id}
                          className={`w-full flex items-center justify-between gap-3 p-2 rounded-md text-left transition-colors hover:bg-slate-50 ${
                            selectedNode?.id === node.id ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
                          }`}
                          onClick={() => setSelectedNode(node)}
                        >
                          <span className="text-sm text-slate-900 truncate pr-2">{node.label}</span>
                          <Badge variant="outline" className={`${getNodeColor(node.type)} capitalize text-xs`}>
                            {node.type}
                          </Badge>
                        </button>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-500">
                        No results found. Try a different search or filter.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}