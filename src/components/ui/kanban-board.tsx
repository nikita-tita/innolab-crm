"use client";

import { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";

interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  riceScore?: number;
  assignee?: string;
  tags?: string[];
  createdAt: Date;
}

interface KanbanColumn {
  id: string;
  title: string;
  description?: string;
  items: KanbanItem[];
  color?: string;
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onItemMove?: (itemId: string, fromColumn: string, toColumn: string) => void;
  onItemClick?: (item: KanbanItem) => void;
  onAddItem?: (columnId: string) => void;
  showRiceScore?: boolean;
}

export function KanbanBoard({
  columns,
  onItemMove,
  onItemClick,
  onAddItem,
  showRiceScore = false
}: KanbanBoardProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, itemId: string, columnId: string) => {
    setDraggedItem(itemId);
    setDraggedFromColumn(columnId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();

    if (draggedItem && draggedFromColumn && draggedFromColumn !== targetColumnId) {
      onItemMove?.(draggedItem, draggedFromColumn, targetColumnId);
    }

    setDraggedItem(null);
    setDraggedFromColumn(null);
  }, [draggedItem, draggedFromColumn, onItemMove]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL": return "bg-red-100 text-red-800";
      case "HIGH": return "bg-orange-100 text-orange-800";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800";
      case "LOW": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiceScoreColor = (score: number) => {
    if (score >= 10) return "bg-green-100 text-green-800";
    if (score >= 5) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <Card className="h-full">
            <CardHeader className={`pb-3 ${column.color || 'bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{column.title}</CardTitle>
                  {column.description && (
                    <p className="text-sm text-gray-600 mt-1">{column.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{column.items.length}</Badge>
                  {onAddItem && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAddItem(column.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 min-h-[400px]">
              {column.items.map((item) => (
                <Card
                  key={item.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    draggedItem === item.id ? "opacity-50" : ""
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id, column.id)}
                  onClick={() => onItemClick?.(item)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm leading-tight">
                          {item.title}
                        </h4>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>

                      {item.description && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 flex-wrap">
                        {item.priority && (
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getPriorityColor(item.priority)}`}
                          >
                            {item.priority}
                          </Badge>
                        )}

                        {showRiceScore && item.riceScore && (
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getRiceScoreColor(item.riceScore)}`}
                          >
                            RICE: {item.riceScore.toFixed(1)}
                          </Badge>
                        )}

                        {item.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        {item.assignee && (
                          <span>{item.assignee}</span>
                        )}
                        <span>{item.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

export default KanbanBoard;