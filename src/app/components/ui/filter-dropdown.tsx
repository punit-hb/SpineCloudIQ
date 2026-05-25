import React, { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "./button";

interface FilterDropdownProps {
  children: React.ReactNode;
  activeCount?: number;
  onClear?: () => void;
}

export function FilterDropdown({ children, activeCount = 0, onClear }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant={isOpen || activeCount > 0 ? "default" : "outline"}
        size="sm"
        className="gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter className="w-4 h-4" />
        Filters {activeCount > 0 && `(${activeCount})`}
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-[400px] bg-card border border-border rounded-lg shadow-lg z-20 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Advanced Filters</h3>
              {activeCount > 0 && onClear && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClear}
                  className="text-xs h-7"
                >
                  Clear All
                </Button>
              )}
            </div>
            {/* 
              Wrap the children in a flexible container.
              We can use grid configuration passed from parents, 
              but usually, the parent will provide multiple form fields.
            */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {children}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
