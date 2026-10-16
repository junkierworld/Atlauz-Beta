import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Share2,
  Search,
  BookOpen,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ResourceItem } from '../../types';

interface GraphNode {
  id: string;
  title: string;
  category: string;
  type: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface GraphLink {
  source: string;
  target: string;
}

interface NoteGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: ResourceItem[];
  onOpenResource: (resource: ResourceItem) => void;
  onShowToast: (msg: string) => void;
}

export const NoteGraphModal: React.FC<NoteGraphModalProps> = ({
  isOpen,
  onClose,
  resources,
  onOpenResource,
  onShowToast
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);
  const draggingNodeRef = useRef<GraphNode | null>(null);

  // Initialize nodes and links from resources
  useEffect(() => {
    if (!isOpen || resources.length === 0) return;

    const width = 800;
    const height = 500;

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

    const newNodes: GraphNode[] = resources.map((r, idx) => {
      const angle = (idx / resources.length) * 2 * Math.PI;
      const radius = 160 + (idx % 3) * 40;
      return {
        id: r.id,
        title: r.title,
        category: r.category,
        type: r.type,
        color: colors[idx % colors.length],
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0
      };
    });

    // Generate links based on shared categories and tags
    const newLinks: GraphLink[] = [];
    for (let i = 0; i < resources.length; i++) {
      for (let j = i + 1; j < resources.length; j++) {
        const r1 = resources[i];
        const r2 = resources[j];
        const sharesCategory = r1.category === r2.category;
        const sharesTags = r1.tags?.some(t => r2.tags?.includes(t));
        if (sharesCategory || sharesTags || (i + 1 === j)) {
          newLinks.push({ source: r1.id, target: r2.id });
        }
      }
    }

    nodesRef.current = newNodes;
    linksRef.current = newLinks;
  }, [isOpen, resources]);

  // Canvas physics loop
  useEffect(() => {
    if (!isOpen) return;
    let animId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const nodes = nodesRef.current;
      const links = linksRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // Apply simple spring & repulsion physics
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        if (n1 === draggingNodeRef.current) continue;

        // Center gravity
        n1.vx += (width / 2 - n1.x) * 0.0005;
        n1.vy += (height / 2 - n1.y) * 0.0005;

        // Node repulsion
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 150) {
            const force = (150 - dist) / dist * 0.04;
            n1.vx -= dx * force;
            n1.vy -= dy * force;
            if (n2 !== draggingNodeRef.current) {
              n2.vx += dx * force;
              n2.vy += dy * force;
            }
          }
        }
      }

      // Link attraction
      links.forEach(l => {
        const s = nodes.find(n => n.id === l.source);
        const t = nodes.find(n => n.id === l.target);
        if (s && t) {
          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDist = 120;
          const force = (dist - targetDist) * 0.002;
          if (s !== draggingNodeRef.current) {
            s.vx += dx * force;
            s.vy += dy * force;
          }
          if (t !== draggingNodeRef.current) {
            t.vx -= dx * force;
            t.vy -= dy * force;
          }
        }
      });

      // Update positions with friction
      nodes.forEach(n => {
        if (n !== draggingNodeRef.current) {
          n.x += n.vx;
          n.y += n.vy;
          n.vx *= 0.88;
          n.vy *= 0.88;

          // Boundaries
          n.x = Math.max(40, Math.min(width - 40, n.x));
          n.y = Math.max(40, Math.min(height - 40, n.y));
        }
      });

      // Draw Canvas
      ctx.clearRect(0, 0, width, height);

      // Draw background grid dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      for (let x = 0; x < width; x += 30) {
        for (let y = 0; y < height; y += 30) {
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      }

      // Draw Links
      ctx.lineWidth = 1.2;
      links.forEach(l => {
        const s = nodes.find(n => n.id === l.source);
        const t = nodes.find(n => n.id === l.target);
        if (s && t) {
          const isHighlighted = s.id === selectedNodeId || t.id === selectedNodeId;
          ctx.strokeStyle = isHighlighted ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.08)';
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(t.x, t.y);
          ctx.stroke();
        }
      });

      // Draw Nodes
      nodes.forEach(n => {
        const isSelected = n.id === selectedNodeId;
        const matchesSearch = !searchQuery || n.title.toLowerCase().includes(searchQuery.toLowerCase());

        // Outer glow if selected
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 16, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, isSelected ? 10 : 8, 0, 2 * Math.PI);
        ctx.fillStyle = matchesSearch ? n.color : '#404040';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = isSelected ? '#ffffff' : '#171717';
        ctx.stroke();

        // Node Label
        ctx.font = '10px monospace';
        ctx.fillStyle = isSelected ? '#ffffff' : matchesSearch ? '#d4d4d4' : '#666666';
        ctx.textAlign = 'center';
        ctx.fillText(n.title.length > 18 ? n.title.slice(0, 16) + '...' : n.title, n.x, n.y + 20);
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isOpen, selectedNodeId, searchQuery]);

  // Mouse interaction handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clicked = nodesRef.current.find(n => {
      const dx = n.x - x;
      const dy = n.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 18;
    });

    if (clicked) {
      setSelectedNodeId(clicked.id);
      draggingNodeRef.current = clicked;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingNodeRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    draggingNodeRef.current.x = e.clientX - rect.left;
    draggingNodeRef.current.y = e.clientY - rect.top;
  };

  const handleMouseUp = () => {
    draggingNodeRef.current = null;
  };

  if (!isOpen) return null;

  const selectedResource = resources.find(r => r.id === selectedNodeId);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none font-sans overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-5xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col h-[85vh] max-h-[800px] overflow-hidden text-white"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between shrink-0 font-mono">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black border border-neutral-700 flex items-center justify-center text-white shrink-0">
                <Share2 className="w-5 h-5 text-neutral-300" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-white block">
                  BIDIRECTIONAL KNOWLEDGE GRAPH VISUALIZER
                </span>
                <span className="text-[11px] text-neutral-400">
                  Concept Clustering • Interrelated Study Volumes • Spring Force Physics
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter graph nodes..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-black border border-neutral-800 text-xs text-white placeholder-neutral-600 outline-none w-48"
                />
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Canvas & Inspector Body */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 relative">
            {/* 2D Canvas Stage (70%) */}
            <div className="flex-1 relative bg-[#060606] overflow-hidden flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="w-full h-full cursor-grab active:cursor-grabbing"
              />

              <div className="absolute bottom-4 left-4 font-mono text-[10px] text-neutral-500 bg-black/70 px-2.5 py-1 rounded-lg border border-neutral-850">
                Drag nodes to inspect elastic links • Click node to inspect details
              </div>
            </div>

            {/* Selected Node Inspector Drawer (30%) */}
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-neutral-800 bg-[#0a0a0a] p-5 space-y-4 overflow-y-auto shrink-0 font-mono text-xs">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                Node Inspector
              </span>

              {selectedResource ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                    <span className="text-[10px] uppercase text-neutral-400">
                      {selectedResource.type} • {selectedResource.category}
                    </span>
                    <h3 className="text-sm font-bold text-white">
                      {selectedResource.title}
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                      {selectedResource.description || 'Scholarly resource in active study repository.'}
                    </p>
                  </div>

                  {/* Connected Tags */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold">Concept Tags</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedResource.tags?.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenResource(selectedResource);
                      onClose();
                    }}
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open in Study Reader</span>
                  </button>
                </div>
              ) : (
                <div className="p-8 text-center text-neutral-500 space-y-2">
                  <Layers className="w-8 h-8 mx-auto text-neutral-700" />
                  <p className="text-[11px]">Click any node in the knowledge network to inspect connections.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
