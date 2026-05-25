# 📋 HB Design System: Sample Page Implementation Blueprint

This reference document outlines the layout architecture, user flows, state management, and functional specifications of the standard **Listing & Database Management Screen** (as demonstrated in the Employee Management Sample Page).

---

## 📌 Section 1: Page Layout & Toolbar Architecture

Every database list screen must implement the following structural elements in order:

### 1. Page Header Toolbar
Aligns the title and breadcrumbs to the left. The children action items are grouped in a container with `flex items-center gap-2 flex-wrap` to align search and button controllers:
*   **SearchBar (Gmail-style):** Expands on click. Toggles advanced filter options.
*   **Primary Action Button:** Triggers creation form/modal (e.g. *Add Employee*).
*   **KPI Summary Toggle Button:** `BarChart3` icon.
*   **Refresh Button:** `RefreshCw` icon.
*   **More Actions Dropdown:** `MoreVertical` icon containing Export (Excel & PDF) and Import buttons.
*   **ViewModeSwitcher:** Switches between standard views (`table`, `grid`/`card`, `list`).
    *   *Note:* The timeline view option is restricted **strictly** to the Logs module.

### 2. Metric Summary Panel (Togglable)
Placed right beneath the Page Header. Renders a grid of metrics (e.g., total items, active items, pending status counts). Renders conditionally based on local state (`showSummary`).
*   **Implementation Pattern:**
    ```tsx
    const [showSummary, setShowSummary] = useState(true);
    
    // Header icon:
    <IconButton icon={BarChart3} onClick={() => setShowSummary(!showSummary)} title="Summary" />
    
    // Panel display:
    {showSummary && (
      <SummaryWidgets
        widgets={[
          { label: 'Total', value: mockData.length.toString(), trend: '+5%' },
          { label: 'Active', value: mockData.filter(d => d.status === 'active').length.toString() }
        ]}
      />
    )}
    ```

---

## ⚙️ Section 2: Core UX Workflows & Logic

### 1. Column Selection Restriction
The "Column Selection" control dropdown must only be active in **Table View**. 
*   **Rule:** When in card/grid or list view, the column selection control must be hidden. If the panel is open when switching modes, it must automatically close.
*   **Implementation:**
    ```tsx
    <SearchBar
      value={searchQuery}
      onChange={setSearchQuery}
      // Pass the toggle callback only if viewMode is table
      onToggleColumns={viewMode === 'table' ? () => setShowColumnPanel(!showColumnPanel) : undefined}
    />
    ```

### 2. Form Modal Layout & Controls
Creation or edit views use a structured layout:
*   **Structure:**
    *   `<FormModal>` wraps `<form>`
    *   `<FormSection>` sections form inputs (e.g., General Information)
    *   `<FormGrid cols={2}>` organizes inputs into two clean columns on desktop
    *   `<FormField>` labels and manages the input component
    *   `<FormFooter>` groups secondary/cancel button on left, primary save button on right
*   **Status Slider:** Standard status configuration using a custom status slider instead of basic dropdowns.
    ```tsx
    <StatusSlider
      value={formData.status}
      onChange={val => setFormData({ ...formData, status: val })}
      options={[
        { value: 'active', label: 'Active', color: 'bg-success-500' },
        { value: 'on-leave', label: 'On Leave', color: 'bg-warning-500' },
        { value: 'inactive', label: 'Inactive', color: 'bg-error-500' },
      ]}
    />
    ```

### 3. Multi-Row Bulk Action System
When checkboxes are enabled (extreme left column of the table or card rows):
*   Selecting one or more rows adds the ID to a `selectedIds` `Set` state.
*   When `selectedIds.size > 0`, a floating **Bulk Action Bar** slides up from the bottom-center of the screen.
*   **Action Bar Specs:**
    *   Dark background (`bg-neutral-900` or `#171717`) or glassmorphic blur with border and shadow.
    *   Clean layout showing selection count and quick action buttons (e.g., Delete Selected, Change Status).
    *   A "Clear" or "Cancel" action to quickly deselect all.

### 4. Excel & PDF Export Specifications
The export dropdown options (Excel & PDF) must dynamically fetch current active states. The generated files must reflect:
1.  **Search Term:** Exclude rows that don't match the current search query.
2.  **Advanced Filters:** Exclude rows filtered out by active tag chips.
3.  **Active Selections:** If checkboxes are checked, the export must **only** include the selected rows.
4.  **Column Visibility:** Output files must only contain columns that are currently set to visible.
