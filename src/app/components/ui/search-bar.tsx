import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
}

export function SearchBar({ placeholder = "Search...", value, onChange }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(value !== "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="w-10 h-10 flex-shrink-0 flex items-center justify-center border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 text-neutral-600 dark:text-neutral-400 transition-colors"
        onClick={() => setIsExpanded(true)}
        title="Search"
      >
        <Search className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div className="relative flex items-center w-full min-w-[320px] transition-all duration-300">
      <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10 w-full h-10 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 border-neutral-200 dark:border-neutral-800 rounded-lg bg-input-background"
      />
      <button
        onClick={() => {
          onChange("");
          if (value === "") {
            setIsExpanded(false);
          }
        }}
        className="absolute right-3 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
