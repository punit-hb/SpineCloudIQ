# 🎨 HB Design System: UI Kit Component Specification

This specification document outlines the exact classes, design guidelines, layout rules, and code snippets for the foundational UI components. It should be used to correct UI/UX designs in other enterprise modules to ensure consistent premium design.

---

## 📌 Section 1: Design Tokens & Styling Foundations

### 1. Border Radius & Rounded Corners
*   **Default Radius:** `rounded-lg` (8px) for buttons, inputs, dropdowns, and cards.
*   **Subtle Elements:** `rounded-md` (6px) for tags and chips.
*   **Large Containers:** `rounded-xl` (12px) for modals and slide-out panels.
*   **Circular Elements:** `rounded-full` for status dots, switches, and progress bars.

### 2. Standard Elevation (Shadows & Borders)
Every elevated element must carry a subtle border alongside the shadow to define bounds clearly:
*   `shadow-sm` + `border border-neutral-200` (Light) / `border-neutral-800` (Dark)
*   `shadow-md` + `border border-neutral-200` (Light) / `border-neutral-800` (Dark)
*   `shadow-xl` + `border border-neutral-200` (Light) / `border-neutral-800` (Dark)

### 3. Spacing & Alignments
*   Standard padding for cards/sections: `p-4` or `p-6`.
*   Toolbar item gap: `gap-2` or `gap-3`.
*   Form input spacing: `space-y-4` or `gap-4`.

---

## 📦 Section 2: Core Components Specification

### 1. Button Controls (40px Height)
Buttons have a standardized height of **40px** (`h-10`) to match other header/filter elements.

#### A. Primary Action Button
*   **Classes:** `h-10 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg px-4 py-2 flex items-center gap-2 transition-colors`
*   **Icon:** Size `16x16px` (`w-4 h-4`)
*   **Code Snippet:**
    ```tsx
    import { Plus } from 'lucide-react';
    <button className="h-10 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg px-4 py-2 flex items-center gap-2 transition-colors">
      <Plus className="w-4 h-4" />
      <span>Add New</span>
    </button>
    ```

#### B. Secondary / Cancel Button
*   **Classes:** `h-10 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 rounded-lg px-4 py-2 flex items-center gap-2 transition-colors`
*   **Code Snippet:**
    ```tsx
    <button className="h-10 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 rounded-lg px-4 py-2 transition-colors">
      Cancel
    </button>
    ```

#### C. Icon Button
*   **Classes:** `w-10 h-10 flex items-center justify-center bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 text-neutral-600 dark:text-neutral-400 transition-colors`
*   **Icon:** Size `20x20px` (`w-5 h-5`)
*   **Code Snippet:**
    ```tsx
    import { RefreshCw } from 'lucide-react';
    <button className="w-10 h-10 flex items-center justify-center bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 text-neutral-600 dark:text-neutral-400 transition-colors">
      <RefreshCw className="w-5 h-5" />
    </button>
    ```

---

### 2. Form Inputs & Select Controls

#### A. Text Input & Textareas
Focus states must use primary ring glow outlines, avoiding the browser default black outlines.
*   **Classes:** `w-full h-10 px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all`
*   **Code Snippet:**
    ```tsx
    <input 
      type="text" 
      placeholder="Enter details..." 
      className="w-full h-10 px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
    />
    ```

#### B. Custom Select Dropdown Panel
The select trigger must be exactly `h-10` (40px) to match buttons. Dropdown items have capsule rounding.
*   **Dropdown Panel:** `shadow-md`, `rounded-lg` (8px), background `bg-white` (Light) / `bg-neutral-950` (Dark), and high z-index (`z-[100]`).
*   **Capsule Rounding Rule:** 
    *   **First Item:** Top corners rounded only (`rounded-t-lg`).
    *   **Last Item:** Bottom corners rounded only (`rounded-b-lg`).
    *   **Middle Items:** Square corners (`rounded-none`).
*   **Focus State:** Background `bg-primary-50` (Light) / `bg-primary-950/40` (Dark) with right-aligned checkmark.
*   **Code Snippet (Shadcn UI structure):**
    ```tsx
    import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
    
    <Select>
      <SelectTrigger className="h-10 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
        <SelectValue placeholder="Select choice..." />
      </SelectTrigger>
      <SelectContent className="rounded-lg shadow-md border border-neutral-200 dark:border-neutral-800 z-[100] p-1 bg-white dark:bg-neutral-950">
        <SelectItem value="opt1" className="rounded-t-lg focus:bg-primary-50 focus:text-primary-900 dark:focus:bg-primary-950/40">Option 1</SelectItem>
        <SelectItem value="opt2" className="rounded-none focus:bg-primary-50 focus:text-primary-900 dark:focus:bg-primary-950/40">Option 2</SelectItem>
        <SelectItem value="opt3" className="rounded-b-lg focus:bg-primary-50 focus:text-primary-900 dark:focus:bg-primary-950/40">Option 3</SelectItem>
      </SelectContent>
    </Select>
    ```

---

### 3. Checkboxes, Radios, and Switches

#### A. Unified Accent Checkbox
Checkboxes must avoid browser-default tint and maintain a white checkmark on a primary background when checked.
*   **Classes:** `w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-primary-500/20 bg-white dark:bg-neutral-900`
*   **Code Snippet:**
    ```tsx
    import { Checkbox } from "./ui/checkbox";
    <Checkbox id="marketing" className="border-neutral-300 dark:border-neutral-700 data-[state=checked]:bg-primary-600 data-[state=checked]:text-white" />
    ```

#### B. Switches (Toggle)
Track turns to the primary accent color when enabled.
*   **Code Snippet:**
    ```tsx
    import { Switch } from "./ui/switch";
    <Switch id="toggle" className="data-[state=checked]:bg-primary-600" />
    ```

---

### 4. Status Badges & Tags (Removable Filter Chips)

#### A. Status Badge with Dot (Pattern 1 & 2)
The standard pattern for tables and card status uses a neutral light-gray background with a thin border and a colored indicator dot.
*   **Classes:** `px-2 py-1 text-xs font-medium border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 rounded-md flex items-center gap-1.5`
*   **Indicator Color classes:**
    *   *Success:* `bg-success-500` (emerald)
    *   *Warning/Pending:* `bg-warning-500` (amber)
    *   *Error/Inactive:* `bg-error-500` (rose)
    *   *Info:* `bg-info-500` (blue)
*   **Code Snippet:**
    ```tsx
    // Badge component
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800">
      <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
      <span>Active</span>
    </span>
    ```

#### B. Removable Tags/Filter Chips (Pattern 3)
*   **Classes:** `inline-flex items-center gap-1.5 px-2 py-0.5 text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 rounded-md`
*   **Code Snippet:**
    ```tsx
    import { Tag, X } from 'lucide-react';
    <span className="inline-flex items-center gap-2 px-2 py-0.5 text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 rounded-md">
      <Tag className="w-3 h-3" />
      <span>Category</span>
      <button className="text-neutral-400 hover:text-error-500 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
    ```
