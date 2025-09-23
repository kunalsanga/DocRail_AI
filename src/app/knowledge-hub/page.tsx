"use client";

import { useEffect, useRef, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Users, 
  Cog, 
  ArrowLeft, 
  Search, 
  Filter, 
  Network, 
  FileText, 
  Tag, 
  Eye
} from "lucide-react";
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
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
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
    };
    load();

    // Add resize handler
    const handleResize = () => {
      if (graph) {
        drawGraph(graph);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [graph]);

  const drawGraph = (graphData: KnowledgeGraph) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match container
    const container = canvas.parentElement;
    if (container) {
      const rect = container.getBoundingClientRect();
      canvas.width = Math.min(700, rect.width - 32); // Account for padding
      canvas.height = Math.min(450, rect.height - 32);
    }

    // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create a better layout using force simulation
    const nodes = graphData.nodes.map((node, i) => {
      const angle = (i / graphData.nodes.length) * 2 * Math.PI;
      const radius = Math.min(canvas.width, canvas.height) * 0.25;
      return {
        ...node,
        x: canvas.width / 2 + Math.cos(angle) * radius,
        y: canvas.height / 2 + Math.sin(angle) * radius
      };
    });

    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    // Draw edges
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    graphData.edges.forEach(edge => {
      const source = nodeMap.get(edge.source);
      const target = nodeMap.get(edge.target);
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x!, source.y!);
        ctx.lineTo(target.x!, target.y!);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const isSelected = selectedNode?.id === node.id;
      const radius = isSelected ? 12 : 8;
      
      // Node color based on type
      let color = "#6b7280"; // default
      if (node.type === "document") color = "#3b82f6";
      else if (node.type === "department") color = "#10b981";
      else if (node.type === "category") color = "#f59e0b";

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

      // Draw label
      ctx.fillStyle = "#1f2937";
        ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.label, node.x!, node.y! + radius + 15);
      });
    };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !graph) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked node
    const clickedNode = graph.nodes.find(node => {
      const nodeX = node.x || 0;
      const nodeY = node.y || 0;
      const distance = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2);
      return distance <= 12;
    });

    setSelectedNode(clickedNode || null);
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
      case "document": return "bg-blue-100 text-blue-800";
      case "department": return "bg-green-100 text-green-800";
      case "category": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white shadow-lg flex flex-col h-screen sticky top-0">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">DocRail AI</h1>
                <p className="text-sm text-gray-600">Document Management System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-6 flex-shrink-0 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">NAVIGATION</h3>
            <nav className="space-y-2">
              <Link prefetch href="/dashboard" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link prefetch href="/upload" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5" />
                <span>Upload Documents</span>
              </Link>
              <Link prefetch href="/search" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                <Search className="w-5 h-5" />
                <span>Search & Filter</span>
              </Link>
              <Link prefetch href="/compliance" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5" />
                <span>Compliance</span>
              </Link>
              <Link prefetch href="/notifications" className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5" />
                <span>Notifications</span>
              </Link>
              <button className="w-full flex items-center space-x-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg">
                <Network className="w-5 h-5" />
                <span className="font-medium">Knowledge Hub</span>
              </button>
            </nav>
          </div>

          {/* Knowledge Stats */}
          <div className="p-6 border-t border-gray-200 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">KNOWLEDGE STATS</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Documents</span>
                <span className="font-semibold text-gray-900">{graph?.nodes.filter(n => n.type === 'document').length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Departments</span>
                <span className="font-semibold text-green-600">{graph?.nodes.filter(n => n.type === 'department').length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Categories</span>
                <span className="font-semibold text-orange-600">{graph?.nodes.filter(n => n.type === 'category').length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Connections</span>
                <span className="font-semibold text-blue-600">{graph?.edges.length || 0}</span>
              </div>
            </div>
          </div>

          {/* User Profile - Always visible at bottom */}
          <div className="mt-auto p-6 border-t border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">KMRL Officer</p>
                <p className="text-sm text-gray-600">Engineering Department</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Cog className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-x-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Knowledge Hub</h1>
                <p className="text-gray-600 mt-1">Interactive knowledge graph showing relationships between documents, departments, and categories</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-8">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search knowledge nodes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Filter */}
                  <div className="flex gap-4">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
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
                      className="px-6"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Knowledge Graph */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Graph Canvas */}
            <div className="xl:col-span-3">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <IconBadge color="slate" size="sm"><Network /></IconBadge>
                    <span>Knowledge Graph</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg bg-gray-50 p-4 overflow-hidden">
                    <div className="w-full h-[500px] flex items-center justify-center">
                      <canvas 
                        ref={canvasRef} 
                        width={700} 
                        height={450}
                        onClick={handleCanvasClick}
                        className="cursor-pointer border rounded bg-white max-w-full max-h-full"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <IconBadge color="blue" size="sm"><FileText className="w-4 h-4" /></IconBadge>
                      <span>Documents</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <IconBadge color="green" size="sm"><Building2 className="w-4 h-4" /></IconBadge>
                      <span>Departments</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <IconBadge color="orange" size="sm"><Tag className="w-4 h-4" /></IconBadge>
                      <span>Categories</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Node Details */}
            <div className="xl:col-span-1 space-y-4">
              {/* Selected Node Details */}
              {selectedNode ? (
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <IconBadge color="blue" size="sm">{getNodeIcon(selectedNode.type)}</IconBadge>
                      <span>Selected Node</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedNode.label}</h3>
                        <Badge className={`mt-1 ${getNodeColor(selectedNode.type)}`}>
                          {selectedNode.type}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Connected Nodes:</h4>
                        <div className="space-y-1">
                          {graph?.edges
                            .filter(edge => edge.source === selectedNode.id || edge.target === selectedNode.id)
                            .map(edge => {
                              const connectedNodeId = edge.source === selectedNode.id ? edge.target : edge.source;
                              const connectedNode = graph?.nodes.find(n => n.id === connectedNodeId);
                              return connectedNode ? (
                                <div key={edge.id} className="flex items-center space-x-2 text-sm">
                                  <Badge variant="outline" className="text-xs">
                                    {edge.relation}
                                  </Badge>
                                  <span className="text-gray-600">{connectedNode.label}</span>
                                </div>
                              ) : null;
                            }) || []}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-white shadow-sm">
                  <CardContent className="p-6 text-center">
                    <Network className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Node</h3>
                    <p className="text-gray-600">Click on any node in the graph to see its details and connections.</p>
                  </CardContent>
                </Card>
              )}

              {/* Filtered Results */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <IconBadge color="slate" size="sm"><Filter /></IconBadge>
                    <span>Filtered Results ({filteredNodes.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredNodes.map(node => (
                      <div 
                        key={node.id}
                        className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          selectedNode?.id === node.id ? 'bg-blue-50 border border-blue-200' : ''
                        }`}
                        onClick={() => setSelectedNode(node)}
                      >
                        <IconBadge color="slate" size="sm">{getNodeIcon(node.type)}</IconBadge>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{node.label}</p>
                          <p className="text-xs text-gray-500">{node.type}</p>
                        </div>
                        <Eye className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
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
