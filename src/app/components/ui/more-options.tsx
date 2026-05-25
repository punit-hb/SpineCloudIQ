import React, { useState } from "react";
import { MoreVertical, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "./button";

interface MoreOptionsProps {
  onExportExcel: () => void;
  onExportPdf: () => void;
  additionalActions?: {
    label: string;
    icon: any;
    onClick: () => void;
  }[];
}

export function MoreOptions({ onExportExcel, onExportPdf, additionalActions }: MoreOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 text-neutral-600 dark:text-neutral-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        title="More Options"
      >
        <MoreVertical className="w-5 h-5" />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-md z-[100] overflow-hidden">
            <div className="flex flex-col py-1">
              <button
                onClick={() => {
                  onExportExcel();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900/50 transition-colors text-left w-full"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                <span>Export as Excel</span>
              </button>
              <button
                onClick={() => {
                  onExportPdf();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900/50 transition-colors text-left w-full border-b border-border"
              >
                <FileText className="w-4 h-4 text-red-500" />
                <span>Export as PDF</span>
              </button>

              {additionalActions && additionalActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      action.onClick();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900/50 transition-colors text-left w-full"
                  >
                    <Icon className="w-4 h-4 text-neutral-500" />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
