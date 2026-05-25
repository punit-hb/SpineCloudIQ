import React, { useState } from "react";
import { Download, ChevronDown } from "lucide-react";
import { Button } from "./button";
import { Label } from "./label";

export type ExportFormat = "csv" | "excel" | "pdf";
export type ExportScope = "current" | "all";

interface ExportDropdownProps {
  onExport: (format: ExportFormat, scope: ExportScope) => void;
}

export function ExportDropdown({ onExport }: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (format: ExportFormat, scope: ExportScope) => {
    onExport(format, scope);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Download className="w-4 h-4" />
        Export
        <ChevronDown className="w-3 h-3" />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-20 p-3">
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-semibold text-foreground mb-2 block">Format</Label>
                <div className="space-y-1">
                  <button
                    onClick={() => handleExport("csv", "current")}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    CSV - Current Page
                  </button>
                  <button
                    onClick={() => handleExport("csv", "all")}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    CSV - All Data
                  </button>
                </div>
              </div>
              <div className="border-t border-border pt-2">
                <div className="space-y-1">
                  <button
                    onClick={() => handleExport("excel", "current")}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    Excel - Current Page
                  </button>
                  <button
                    onClick={() => handleExport("excel", "all")}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    Excel - All Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
