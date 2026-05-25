import React, { useState, useEffect, useRef } from 'react';
import {
  Search, X, ChevronRight, ChevronLeft, ChevronDown,
  LayoutGrid, List, Table2, SlidersHorizontal,
  TrendingUp, TrendingDown, Filter, Calendar, Check,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────
export interface FilterCondition { id: string; field: string; values: string[]; }
export interface ColumnConfig { key: string; label: string; }

// ── Breadcrumb ────────────────────────────────────────────
interface BreadcrumbItem { label: string; href?: string; current?: boolean; }
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />}
          {item.current
            ? <span className="text-neutral-900 dark:text-white font-medium">{item.label}</span>
            : <a href={item.href || '#'} className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">{item.label}</a>}
        </React.Fragment>
      ))}
    </nav>
  );
}

// ── PageHeader ────────────────────────────────────────────
export function PageHeader({ title, breadcrumbs, children }: { title: string; breadcrumbs?: BreadcrumbItem[]; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 pb-6">
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1>{title}</h1>
        {children && <div className="flex items-center gap-2 flex-wrap">{children}</div>}
      </div>
    </div>
  );
}

// ── PrimaryButton ─────────────────────────────────────────
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { icon?: React.ComponentType<{ className?: string }>; }
export function PrimaryButton({ icon: Icon, children, className = '', ...p }: BtnProps) {
  return (
    <button {...p} className={`inline-flex items-center gap-2 h-10 px-4 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg border border-primary-700 transition-colors disabled:opacity-50 ${className}`}>
      {Icon && <Icon className="w-4 h-4" />}{children}
    </button>
  );
}

// ── SecondaryButton ───────────────────────────────────────
export function SecondaryButton({ icon: Icon, children, className = '', ...p }: BtnProps) {
  return (
    <button {...p} className={`inline-flex items-center gap-2 h-10 px-4 text-sm font-medium bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 rounded-lg border border-neutral-200 dark:border-neutral-800 transition-colors disabled:opacity-50 ${className}`}>
      {Icon && <Icon className="w-4 h-4" />}{children}
    </button>
  );
}

// ── IconButton ────────────────────────────────────────────
interface MenuItem { icon?: React.ComponentType<{ className?: string }>; label: string; onClick: () => void; variant?: 'destructive'; }
interface IconBtnProps { icon: React.ComponentType<{ className?: string }>; title: string; onClick?: () => void; menuItems?: MenuItem[]; className?: string; active?: boolean; }
export function IconButton({ icon: Icon, title, onClick, menuItems, className = '', active }: IconBtnProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const base = `w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${active ? 'bg-primary-50 dark:bg-primary-950 border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400' : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400'} ${className}`;
  if (menuItems?.length) {
    return (
      <div className="relative" ref={ref}>
        <button onClick={() => setOpen(!open)} title={title} className={base}><Icon className="w-5 h-5" /></button>
        {open && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-[100]">
            {menuItems.map((m, i) => (
              <button key={i} onClick={() => { m.onClick(); setOpen(false); }} className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors ${m.variant === 'destructive' ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'}`}>
                {m.icon && <m.icon className="w-4 h-4" />}{m.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
  return <button onClick={onClick} title={title} className={base}><Icon className="w-5 h-5" /></button>;
}

// ── SearchBar ─────────────────────────────────────────────
interface SearchBarProps { value: string; onChange: (v: string) => void; placeholder?: string; onAdvancedSearch?: () => void; onToggleColumns?: () => void; activeFilterCount?: number; }
export function SearchBar({ value, onChange, placeholder = 'Search...', onAdvancedSearch, onToggleColumns, activeFilterCount = 0 }: SearchBarProps) {
  const [expanded, setExpanded] = useState(value !== '');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (expanded && inputRef.current) inputRef.current.focus(); }, [expanded]);
  if (!expanded) {
    return (
      <button onClick={() => setExpanded(true)} title="Search" className="w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 transition-colors">
        <Search className="w-5 h-5" />
      </button>
    );
  }
  return (
    <div className="flex items-center gap-1 min-w-[260px]">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        <input ref={inputRef} type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full h-10 pl-9 pr-8 text-sm bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-neutral-900 dark:text-white placeholder:text-neutral-400" />
        <button onClick={() => { onChange(''); if (!value) setExpanded(false); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-colors"><X className="w-3.5 h-3.5" /></button>
      </div>
      {onAdvancedSearch && (
        <button onClick={onAdvancedSearch} title="Advanced Filters" className={`relative w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${activeFilterCount > 0 ? 'bg-primary-50 dark:bg-primary-950 border-primary-300 dark:border-primary-700 text-primary-600' : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 text-neutral-600 dark:text-neutral-400'}`}>
          <Filter className="w-4 h-4" />
          {activeFilterCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{activeFilterCount}</span>}
        </button>
      )}
      {onToggleColumns && (
        <button onClick={onToggleColumns} title="Column Visibility" className="w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 text-neutral-600 dark:text-neutral-400 transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ── ViewModeSwitcher ──────────────────────────────────────
export function ViewModeSwitcher({ value, currentMode, onChange }: { value?: string; currentMode?: string; onChange: (m: any) => void }) {
  const mode = value || currentMode || 'grid';
  const modes = [{ id: 'grid', Icon: LayoutGrid, label: 'Grid' }, { id: 'list', Icon: List, label: 'List' }, { id: 'table', Icon: Table2, label: 'Table' }];
  return (
    <div className="flex items-center h-10 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-950">
      {modes.map(({ id, Icon, label }) => (
        <button key={id} onClick={() => onChange(id)} title={`${label} View`} className={`w-10 h-10 flex items-center justify-center transition-colors ${mode === id ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900'}`}>
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────
interface PaginationProps { currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number; onPageChange: (p: number) => void; onItemsPerPageChange?: (n: number) => void; }
export function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange }: PaginationProps) {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-between py-4 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
        <span>Showing {start}–{end} of {totalItems}</span>
        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span>Rows:</span>
            <select value={itemsPerPage} onChange={e => onItemsPerPageChange(Number(e.target.value))} className="h-8 px-2 text-xs bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md focus:outline-none">
              {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 text-neutral-600 dark:text-neutral-400 disabled:opacity-40 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map(p => (
          <button key={p} onClick={() => onPageChange(p)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${p === currentPage ? 'bg-primary-600 text-white border border-primary-700' : 'border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 text-neutral-600 dark:text-neutral-400'}`}>{p}</button>
        ))}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 text-neutral-600 dark:text-neutral-400 disabled:opacity-40 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── FilterPopup ───────────────────────────────────────────
interface FilterPopupProps { isOpen: boolean; onClose: () => void; filters: FilterCondition[]; onFiltersChange: (f: FilterCondition[]) => void; filterOptions: Record<string, string[]>; onApply?: () => void; }
export function FilterPopup({ isOpen, onClose, filters, onFiltersChange, filterOptions, onApply }: FilterPopupProps) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-[90]" onClick={onClose} />
      <div className="absolute top-full mt-2 right-0 w-80 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-[100] p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Advanced Filters</h3>
          {filters.length > 0 && <button onClick={() => onFiltersChange([])} className="text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200">Clear All</button>}
        </div>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {Object.entries(filterOptions).map(([field, values]) => {
            const existing = filters.find(f => f.field === field);
            return (
              <div key={field}>
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">{field}</p>
                <div className="space-y-1">
                  {values.map(val => {
                    const checked = existing?.values.includes(val) || false;
                    return (
                      <label key={val} className="flex items-center gap-2 cursor-pointer py-0.5">
                        <input type="checkbox" checked={checked} onChange={() => {
                          const rest = filters.filter(f => f.field !== field);
                          const cur = existing?.values || [];
                          const next = checked ? cur.filter(v => v !== val) : [...cur, val];
                          onFiltersChange(next.length ? [...rest, { id: field, field, values: next }] : rest);
                        }} className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 accent-primary-600" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">{val}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {onApply && (
          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <button onClick={() => { onApply(); onClose(); }} className="w-full h-10 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">Apply Filters</button>
          </div>
        )}
      </div>
    </>
  );
}

// ── AdvancedSearchPanel ───────────────────────────────────
interface AdvSearchProps { isOpen: boolean; onClose: () => void; filters: FilterCondition[]; onFiltersChange: (f: FilterCondition[]) => void; filterOptions: Record<string, string[]>; }
export function AdvancedSearchPanel({ isOpen, onClose, filters, onFiltersChange, filterOptions }: AdvSearchProps) {
  return <FilterPopup isOpen={isOpen} onClose={onClose} filters={filters} onFiltersChange={onFiltersChange} filterOptions={filterOptions} onApply={onClose} />;
}

// ── FilterChips ───────────────────────────────────────────
export function FilterChips({ filters, onRemove, onClearAll }: { filters: FilterCondition[]; onRemove: (id: string) => void; onClearAll: () => void }) {
  if (!filters.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <span className="text-xs text-neutral-500 dark:text-neutral-400">Active filters:</span>
      {filters.map(f => (
        <span key={f.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 rounded-md">
          <span className="font-medium">{f.field}:</span> {f.values.join(', ')}
          <button onClick={() => onRemove(f.id)} className="ml-1 hover:text-primary-900 dark:hover:text-primary-100"><X className="w-3 h-3" /></button>
        </span>
      ))}
      <button onClick={onClearAll} className="text-xs text-neutral-500 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400 transition-colors">Clear all</button>
    </div>
  );
}

// ── DateRangeFilter ───────────────────────────────────────
interface DateRangeProps { isOpen: boolean; onClose: () => void; startDate: string; endDate: string; onApply: (start: string, end: string, label?: string) => void; }
export function DateRangeFilter({ isOpen, onClose, startDate, endDate, onApply }: DateRangeProps) {
  const [start, setStart] = useState(startDate);
  const [end, setEnd] = useState(endDate);
  const presets = [
    { label: 'Today', days: 0 }, { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 }, { label: 'Last 90 days', days: 90 },
  ];
  if (!isOpen) return null;
  const applyPreset = (days: number) => {
    const e = new Date(); const s = new Date();
    s.setDate(s.getDate() - days);
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    setStart(fmt(s)); setEnd(fmt(e));
  };
  return (
    <>
      <div className="fixed inset-0 z-[90]" onClick={onClose} />
      <div className="absolute top-full mt-2 left-0 w-72 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-[100] p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Date Range</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-2 mb-4">
          {presets.map(p => (
            <button key={p.label} onClick={() => applyPreset(p.days)} className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 transition-colors">{p.label}</button>
          ))}
        </div>
        <div className="space-y-2 border-t border-neutral-200 dark:border-neutral-800 pt-4">
          <div><label className="text-xs text-neutral-500 mb-1 block">Start</label><input type="date" value={start} onChange={e => setStart(e.target.value)} className="w-full h-9 px-3 text-sm border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-primary-500/20" /></div>
          <div><label className="text-xs text-neutral-500 mb-1 block">End</label><input type="date" value={end} onChange={e => setEnd(e.target.value)} className="w-full h-9 px-3 text-sm border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-primary-500/20" /></div>
        </div>
        <button onClick={() => { onApply(start, end); onClose(); }} className="w-full mt-4 h-10 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">Apply</button>
      </div>
    </>
  );
}

// ── ColumnVisibilityPanel ─────────────────────────────────
interface ColVisProps { isOpen: boolean; onClose: () => void; columns: ColumnConfig[]; visibleColumns: Record<string, boolean>; onToggleColumn: (key: string) => void; anchorRef?: React.RefObject<HTMLDivElement | null>; }
export function ColumnVisibilityPanel({ isOpen, onClose, columns, visibleColumns, onToggleColumn }: ColVisProps) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-[90]" onClick={onClose} />
      <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-[100] p-3">
        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">Visible Columns</p>
        <div className="space-y-1">
          {columns.map(col => (
            <label key={col.key} className="flex items-center gap-2 cursor-pointer py-1 rounded hover:bg-neutral-50 dark:hover:bg-neutral-900 px-1">
              <input type="checkbox" checked={visibleColumns[col.key] !== false} onChange={() => onToggleColumn(col.key)} className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 accent-primary-600" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">{col.label}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}

// ── SummaryWidgets ────────────────────────────────────────
interface Widget { label: string; value: string; trend?: string; trendDirection?: 'up' | 'down' | 'neutral'; }
export function SummaryWidgets({ widgets }: { widgets: Widget[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {widgets.map((w, i) => (
        <div key={i} className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 shadow-sm">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">{w.label}</p>
          <p className="text-2xl font-semibold text-neutral-900 dark:text-white">{w.value}</p>
          {w.trend && (
            <div className={`flex items-center gap-1 mt-1 text-xs ${w.trendDirection === 'up' ? 'text-green-600 dark:text-green-400' : w.trendDirection === 'down' ? 'text-red-600 dark:text-red-400' : 'text-neutral-500'}`}>
              {w.trendDirection === 'up' && <TrendingUp className="w-3 h-3" />}
              {w.trendDirection === 'down' && <TrendingDown className="w-3 h-3" />}
              <span>{w.trend}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── FlyoutMenu ────────────────────────────────────────────
export function FlyoutMenu({ children, trigger }: { children: React.ReactNode; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg overflow-hidden z-[100]">
          {children}
        </div>
      )}
    </div>
  );
}

export function FlyoutMenuItem({ icon: Icon, children, onClick, variant }: { icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode; onClick?: () => void; variant?: 'destructive'; }) {
  return (
    <button onClick={onClick} className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors ${variant === 'destructive' ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'}`}>
      {Icon && <Icon className="w-4 h-4" />}{children}
    </button>
  );
}

export function FlyoutMenuDivider() {
  return <div className="border-t border-neutral-200 dark:border-neutral-800 my-1" />;
}
