# Windsurf / Codex Prompt — Convert SpineCloudIQ Clinic Admin Panel to Hidden Brains Base Template

## Role

Act as a senior React + TypeScript frontend architect and UI migration specialist.

You are working inside the existing `SpineCloudIQ` frontend repository opened in Windsurf with Codex.

## Objective

Modify the **Clinic Admin Panel only** so that all Clinic Admin modules/screens follow the Hidden Brains base template structure, UI guidelines, layout system, and reusable component patterns.

The Hidden Brains base template has already been placed inside the current SpineCloudIQ project under the folder:

```text
HB template/
```

Use this folder as the design and implementation reference.

Do **not** modify Patient Panel, Provider Panel, or Clinic Staff Panel in this pass unless a truly shared component must be adjusted to support Clinic Admin. If a shared component is modified, ensure it does not visually or functionally break the other panels.

---

## Primary Goal

Convert the existing Clinic Admin frontend prototype from its current screen-specific implementation into a consistent Hidden Brains admin-template-based implementation.

The final Clinic Admin output should follow:

```text
Sidebar + Global Header + Main Content Area
```

The layout must support:

- Collapsed / expanded sidebar
- Dynamic main content margin based on sidebar width
- Global header height of 48px
- Consistent page spacing
- Consistent typography
- Consistent card, table, filter, form, modal, and action styles
- Light / dark mode compatibility where the HB template supports it
- Reduced visual noise
- White backgrounds and neutral borders
- Primary brand usage based on `#1766C2`
- Colored borders / subtle indicators instead of heavy filled backgrounds

---

## Pixel-Perfect / Visual Matching Requirement

All Clinic Admin screens must match the HB reference screens as closely as possible at pixel level.

Apply this requirement across listing pages, detail pages, forms, dashboards, reports, settings, wizards, modals, drawers, and calendar screens.

### Required Visual Matching Rules

- Match the HB reference screen’s font family, font size, font weight, line height, and visual density.
- Use **Inter** as the scoped Clinic Admin font.
- Use **14px** as the base font size unless the HB reference uses a different size for a specific element.
- Match title, subtitle, breadcrumb, button, badge, table header, table cell, form label, helper text, modal, drawer, tab, and card typography.
- Match icon size, button height, input height, dropdown height, table row height, card padding, border radius, border color, spacing, gap, and alignment.
- Match the HB action-cluster alignment, especially in page headers.
- Match sidebar width, collapsed/expanded behavior, and global header height.
- Use the same visual hierarchy and density as the HB template.
- Do not approximate using random spacing, oversized icons, different font sizes, inconsistent border radius, custom shadows, gradients, or heavy filled backgrounds.
- Before final response, visually compare the updated module against the HB reference and fix mismatches in spacing, font size, card style, header height, sidebar width, action-cluster alignment, table density, button sizing, input sizing, and tab/card density.

### Final Pixel Review Checklist

Before completion, confirm:

- [ ] Font family matches HB template.
- [ ] Base font size follows 14px expectation.
- [ ] Headings, subtitles, breadcrumbs, labels, helper text, and table text match HB sizing.
- [ ] Buttons, inputs, dropdowns, and icons match HB height and visual density.
- [ ] Cards use HB padding, border, radius, and background style.
- [ ] Tables use HB header, row height, cell spacing, and border style.
- [ ] Tabs/grouped sections use HB spacing and typography.
- [ ] Header action cluster aligns with HB reference.
- [ ] Sidebar and global header dimensions match HB reference.
- [ ] No gradients, heavy shadows, or oversized colorful cards remain unless present in HB reference.

---

# Critical Reference Files and Screens

Before making changes, inspect and understand the following files/screens from the HB template folder.

## 1. Core App Structure Reference

Look for the following files inside the HB template folder:

```text
HB template/**/src/app/App.tsx
HB template/**/src/app/components/Sidebar.tsx
HB template/**/src/app/components/GlobalHeader.tsx
HB template/**/src/app/components/UIKit.tsx
```

These define the expected base admin layout pattern:

```text
Sidebar + Global Header + Main Content Area
```

The sidebar supports collapsed / expanded mode, and the main content area adjusts accordingly.

Use this structure as the layout reference for Clinic Admin.

---

## 2. UI Kit Reference

Use this file as the component and visual pattern reference:

```text
HB template/**/src/app/components/UIKit.tsx
```

It contains reusable design examples for:

- Buttons
- Cards
- Badges
- Status indicators
- Forms
- Inputs
- Select dropdowns
- Tables
- Search bar
- Filters
- Pagination
- Page headers
- Breadcrumbs
- View mode switcher
- Stat cards
- Modal / form patterns

Clinic Admin screens must be updated to use the same styling approach and component behavior wherever applicable.

---

## 3. Primary Page Reference — Left Navigation > Users Management > Users

There is a change in the primary reference screen.

Do **not** use the HB Template `Sample Page` as the main page-level reference for this migration.

Instead, use the actual screen available from the HB Template left navigation:

```text
Left Navigation > Users Management > Users
```

This **Users Management > Users** page is the primary page-level reference for Clinic Admin screen conversion.

Use it to understand and replicate:

- Listing page structure
- Page header
- Summary/stat widgets, if present
- Search placement and styling
- Filter placement and styling
- Active filter chips, if present
- Table/list layout
- Row actions
- Detail/view navigation pattern
- Add/create action placement
- Modal or drawer patterns, if used
- Empty state and pagination patterns, if present
- Overall spacing, alignment, card treatment, and visual hierarchy

All Clinic Admin listing, detail, form, settings, and dashboard-style pages should visually align with the **Users Management > Users** screen pattern wherever applicable.

The `SampleDesign.tsx` file may still be inspected only as a secondary reference if needed, but it must not override the visual and structural pattern of **Users Management > Users**.

---

## 4. Design System / Guidelines

Inspect and follow all relevant files from:

```text
HB template/**/guidelines/
```

Important files may include:

```text
guidelines/DESIGN_SYSTEM.md
guidelines/UI_KIT_README.md
guidelines/QUICKSTART_TEMPLATE.md
guidelines/COMPONENT_CATALOG.md
guidelines/CODE_SNIPPETS.md
guidelines/START_HERE.md
```

Apply the design system rules including:

| Area | Expected Standard |
|---|---|
| Primary color | `#1766C2` |
| Header height | `48px` |
| Sidebar width | `64px` collapsed / `256px` expanded |
| Font | Inter |
| Base font size | 14px |
| Theme support | Light / dark mode where template supports it |
| Layout style | Clean SaaS-style admin UI |
| Backgrounds | Mostly white / neutral |
| Borders | Subtle neutral borders |
| Visual emphasis | Colored borders and subtle accents instead of heavy filled cards |
| Components | Use HB UI kit patterns |

---

## 5. Template Documentation

Inspect and follow these folders where available:

```text
HB template/**/templates/listing/
HB template/**/templates/detail_view/
HB template/**/templates/form/
HB template/**/templates/header/
HB template/**/templates/sidebar/
HB template/**/templates/reports/
```

Use them to convert Clinic Admin pages according to page type:

| Clinic Admin Page Type | HB Template Reference |
|---|---|
| Listing pages | `Users Management > Users` page + `templates/listing/` |
| Detail pages | `templates/detail_view/` |
| Create/Edit forms | `templates/form/` |
| Header/layout | `templates/header/` |
| Sidebar/navigation | `templates/sidebar/` |
| Reports/dashboard pages | `templates/reports/` |

---

# Scope for This Pass

## Include Only Clinic Admin Panel

Update the Clinic Admin panel modules/screens, including but not limited to:

- Clinic Admin Dashboard
- Branches / Locations
- Roles & Users
- Providers
- Patients
- Services
- Appointment Categories
- Calendar / Appointments
- Invoices / Payments
- Subscription Management
- Setup Wizard
- Holidays
- SOAP / Care Plan Masters
- Tickets
- Email Templates
- Settings
- Any other Clinic Admin-specific screens found in the source code

## Exclude for Now

Do not intentionally redesign these panels in this pass:

- Patient Panel
- Provider Panel
- Clinic Staff Panel

Only touch shared files if required for Clinic Admin layout/component reuse.

---

# Migration Rules

## Rule 1 — First Audit, Then Modify

Before coding, inspect the existing SpineCloudIQ source structure and identify:

1. Clinic Admin routes
2. Clinic Admin layout wrapper, if any
3. Clinic Admin sidebar/navigation implementation
4. Clinic Admin global/header implementation
5. Existing reusable components
6. Existing mock data/constants
7. Existing page categories:
   - Dashboard
   - Listing
   - Detail
   - Create/Edit form
   - Calendar
   - Settings
   - Reports/statistics
   - Wizard/stepper

Then create an internal migration map before editing files.

---

## Rule 2 — Do Not Break Existing Functionality

Preserve existing:

- Routes
- Navigation flows
- Screen names
- Mock data
- Form fields
- Table columns
- Filters
- Actions
- Modals
- Tabs
- Status values
- Buttons
- Business logic
- Local state behavior

This task is primarily a **UI/layout/template alignment task**, not a business logic rewrite.

If something is unclear, infer conservatively from the existing implementation and preserve current behavior.

---

## Rule 3 — Use HB Template as Source of Truth for UI

For all Clinic Admin screens:

- Replace inconsistent layouts with HB-style page structure.
- Use HB-style cards, filters, tables, buttons, badges, modals, page headers, and stat cards.
- Match spacing, typography, borders, neutral backgrounds, and button hierarchy from the HB template.
- Use `#1766C2` as the primary brand color where applicable.
- Avoid heavy gradients, overly colorful cards, large filled backgrounds, and inconsistent font sizes unless already part of the HB template.
- Treat `Left Navigation > Users Management > Users` as the primary page-level visual reference.

---

## Rule 4 — Create / Reuse a Clinic Admin Layout

If the existing Clinic Admin layout does not match the HB template, create or refactor it.

Expected structure:

```tsx
<ClinicAdminLayout>
  <Sidebar />
  <div className="main-content">
    <GlobalHeader />
    <main>
      {pageContent}
    </main>
  </div>
</ClinicAdminLayout>
```

The implementation may differ depending on the existing project architecture, but the resulting behavior must match:

- Sidebar on the left
- Global header on top
- Main content below header
- Sidebar collapse/expand behavior
- Content margin adjusts based on sidebar width
- Responsive handling should not break

---

## Rule 5 — Navigation Alignment

Clinic Admin navigation should follow HB sidebar patterns:

- Clear module grouping
- Consistent icon size and spacing
- Active item styling
- Collapsed sidebar state
- Expanded sidebar state
- Submenu behavior if required
- Consistent hover state
- Consistent text truncation
- No broken routes

Use the existing Clinic Admin module inventory as the navigation source. Do not remove modules unless they are unused or clearly duplicate.

---

## Rule 6 — Page Header Standard

Every Clinic Admin screen should use a consistent page header pattern.

Expected elements where applicable:

- Breadcrumb
- Page title
- Short description/subtitle
- Primary action button
- Secondary actions
- Back button for detail/edit pages
- View mode switcher if listing supports grid/list/table
- Optional status badge for detail pages

Follow the **Users Management > Users** page and header templates.

---

## Rule 7 — Listing Page Standard

For listing pages such as patients, providers, users, branches, services, tickets, invoices, etc., apply HB listing patterns.

Use **Left Navigation > Users Management > Users** as the primary reference.

Expected structure:

1. Page header
2. Optional summary/stat cards
3. Search bar
4. Filter area
5. Active filter chips, if filters are applied
6. Table/list/grid content area
7. Row actions
8. Pagination
9. Empty state
10. Loading state, if existing
11. Error state, if existing

Preserve all existing data columns and row actions unless there is a clear duplicate or UI-only issue.

---

## Rule 8 — Detail Page Standard

For detail pages, apply HB detail view patterns.

Use the following as the **primary running UI references** for detail and edit screens where available:

```text
Left Navigation > User Management > Users > View User
Left Navigation > User Management > Users > Edit User
```

Use these references as follows:

- Use `Users > View User` as the primary visual and structural reference for detail/view pages.
- Use `Users > Edit User` as the primary visual and structural reference for edit/detail-form pages.
- If View User is opened from the Users listing row action, inspect and follow that screen as the primary detail/view-page reference.
- If Edit User is opened from the Users listing row action, inspect and follow that screen as the primary edit/form-page reference.

Keep the following as **mandatory supporting references**. Do not remove or ignore them:

```text
HB template/**/templates/detail_view/
HB template/**/src/app/components/UIKit.tsx
HB template/**/guidelines/
```

Use `Left Navigation > User Management > Users` only for shared page shell, global header, sidebar behavior, page header, action cluster, spacing, and visual density reference.

Do not force listing-only behaviors such as table/grid/list switcher, customized columns, row selection, or listing search/filter behavior onto detail pages unless the existing detail page already has those concepts.

### Expected Detail Page Structure

1. Breadcrumb / back navigation
2. Page title with entity name
3. Subtitle or short description where existing
4. Status badge using HB dot/pill badge styling
5. Header action buttons aligned with HB action-cluster style
6. Overview card at the top
7. Tabbed sections or grouped content cards based on existing page structure
8. Related records/cards where existing
9. Audit/history/activity section where existing
10. Tables inside the detail page styled as HB tables
11. Forms inside the detail page styled as HB forms
12. Modals/drawers opened from the detail page styled as HB modals/drawers
13. Empty states styled as HB neutral card states
14. Consistent HB spacing, typography, card padding, border radius, and visual density

### Detail Page Preservation Rules

Preserve existing:

- Routes
- Entity data
- Mock data
- Status values
- Existing sections
- Existing tabs
- Existing cards
- Existing tables
- Existing forms
- Existing actions
- Existing modals/drawers
- Existing navigation and click behavior
- Existing business logic and local state behavior

### Detail Page Visual Rules

- Use neutral white cards, subtle borders, 8px radius, and HB spacing.
- Avoid heavy gradients, large colorful cards, oversized text, and inconsistent shadows.
- Match HB font size, line height, icon size, button height, input height, tab density, card spacing, and section spacing.
- Do not remove or rename existing content sections unless clearly duplicate or unused.

### Edit / Detail-Form Screen Rules

For edit/detail-form screens:

- Use `Left Navigation > User Management > Users > Edit User` as the primary visual reference where available.
- Preserve existing edit form fields, validation, default values, save/cancel behavior, modals/drawers, and business logic.
- Match HB form layout, field spacing, label typography, input height, dropdown height, helper/error text, section cards, footer actions, and modal/drawer sizing.
- Do not replace an existing full-page edit screen with a modal unless the HB reference and current module behavior both support that pattern.
- Do not replace an existing modal/drawer edit screen with a full page unless required by the current module structure.


---

## Rule 9 — Form Page Standard

For create/edit/setup pages:

1. Use HB form layout patterns
2. Group fields into logical sections/cards
3. Preserve all existing validation UI
4. Preserve required/optional indicators
5. Use consistent labels, helper text, and error text
6. Place primary/secondary buttons consistently
7. Use sticky footer actions if the existing pattern or HB template supports it
8. Preserve modal forms if already present, but restyle them according to HB modal patterns

---

## Rule 10 — Status and Badge Styling

Use HB-style badges/status indicators for statuses such as:

- Active
- Inactive
- Pending
- Approved
- Rejected
- Completed
- Cancelled
- Paid
- Unpaid
- Draft
- Published
- Open
- In Progress
- Resolved

Do not invent new statuses. Use existing statuses from the current source code.

---

## Rule 11 — Dashboard / Reports Standard

For dashboard and report-like pages:

- Use HB stat-card patterns
- Use consistent card borders and spacing
- Use clean chart containers
- Avoid overly bright filled widgets
- Preserve all existing dashboard metrics
- Ensure charts remain readable in the HB layout
- Follow `templates/reports/` if available

---

## Rule 12 — Calendar / Appointment Standard

For calendar and appointment screens:

- Preserve existing appointment behavior and calendar data.
- Update surrounding layout, headers, filters, buttons, cards, and modals to match HB template.
- Do not rewrite calendar logic unless required for layout compatibility.
- Appointment status badges should follow HB badge styling.

---

## Rule 13 — Setup Wizard Standard

For setup wizard pages:

- Preserve current wizard steps and flow.
- Apply HB card/form/stepper styling.
- Ensure step labels, progress indicators, buttons, and validation messages are consistent.
- Do not remove steps or alter order unless the existing code clearly indicates dead/unused steps.

---

# Coding Standards

Follow the existing project conventions first, then HB template conventions.

## Required

- TypeScript-safe changes
- No `any` unless already used and unavoidable
- Keep components readable and modular
- Avoid duplicate styling
- Reuse existing components where practical
- Extract shared Clinic Admin UI helpers/components only when repetition is clear
- Avoid large uncontrolled rewrites
- Keep route behavior stable
- Keep mock data stable
- Keep imports clean
- Remove unused imports after edits

## Avoid

- Removing fields, columns, filters, or actions
- Changing business rules
- Breaking other panels
- Creating unrelated new libraries
- Replacing the whole app architecture unnecessarily
- Hardcoding large amounts of duplicate UI
- Overusing heavy colors or gradients
- Ignoring dark mode compatibility if the template supports it

---

# Recommended Execution Plan

## Step 1 — Repository Discovery

Inspect:

```text
package.json
src/
HB template/
```

Find:

- Existing Clinic Admin entry/routes
- Existing Clinic Admin components/pages
- Existing navigation/sidebar
- Existing global/shared components
- HB template source files and guidelines
- HB template `Users Management > Users` screen implementation and route

Do not edit yet.

---

## Step 2 — Create Migration Map

Internally map:

| Existing Clinic Admin Area | Existing File(s) | HB Reference | Required Change |
|---|---|---|---|
| Layout | Current layout files | Sidebar + GlobalHeader | Align layout |
| Dashboard | Dashboard files | Reports/stat cards | Restyle |
| Listing pages | List files | Users Management > Users + listing template | Restyle |
| Detail pages | Detail files | detail_view template | Restyle |
| Forms | Create/edit files | form template | Restyle |
| Calendar | Calendar files | Users Management > Users + page shell | Restyle shell |
| Settings | Settings files | form/detail patterns | Restyle |

Then proceed with implementation.

---

## Step 3 — Implement Shared Clinic Admin Layout

Create or refactor Clinic Admin layout to match:

```text
Sidebar + Global Header + Main Content Area
```

Use HB template layout logic as reference.

Ensure:

- Sidebar width is 64px collapsed and 256px expanded
- Header height is 48px
- Main content margin adjusts correctly
- Layout does not overlap
- Scrolling behavior is clean
- Mobile/responsive behavior does not break

---

## Step 4 — Update Clinic Admin Navigation

Update Clinic Admin sidebar to follow HB sidebar styling.

Ensure:

- All Clinic Admin modules remain accessible
- Active states work
- Submenus work if present
- Collapsed/expanded states work
- Icons and labels are aligned
- Header/global controls are not duplicated incorrectly

---

## Step 5 — Convert Screens by Page Type

Convert screens in this order:

1. Clinic Admin Dashboard
2. Branches / Locations
3. Roles & Users
4. Providers
5. Patients
6. Services
7. Appointment Categories
8. Calendar / Appointments
9. Invoices / Payments
10. Subscription Management
11. Setup Wizard
12. Holidays
13. SOAP / Care Plan Masters
14. Tickets
15. Email Templates
16. Settings
17. Any remaining Clinic Admin screens

For each screen:

- Preserve functionality
- Apply HB header pattern
- Apply HB cards/tables/forms/modals/badges
- Clean spacing and typography
- Remove inconsistent visual styling
- Keep route intact

---

## Step 6 — Build and Fix

After changes, run the available project validation commands.

Inspect `package.json` and run the appropriate commands, for example:

```bash
npm install
npm run lint
npm run typecheck
npm run build
```

If scripts are unavailable, run the closest available validation command.

Fix all errors caused by your changes.

---

# Final Self-Evaluation and Correction Pass

After implementation, perform a strict review against the HB template.

## Compare Against Core Layout

Verify:

- [ ] Clinic Admin uses Sidebar + Global Header + Main Content Area
- [ ] Sidebar collapse/expand works
- [ ] Main content margin adjusts correctly
- [ ] Header height visually matches HB template
- [ ] Sidebar width visually matches HB template
- [ ] No content overlaps sidebar/header
- [ ] Layout remains usable on smaller screens

## Compare Against UI Kit

Verify:

- [ ] Buttons follow HB hierarchy
- [ ] Cards follow HB border/background style
- [ ] Badges/status indicators follow HB style
- [ ] Inputs/selects/forms follow HB style
- [ ] Tables follow HB style
- [ ] Search/filter patterns follow HB style
- [ ] Pagination follows HB style
- [ ] Modals follow HB style
- [ ] Stat cards follow HB style
- [ ] Breadcrumbs/page headers follow HB style

## Compare Against Users Management > Users Page

Verify:

- [ ] Listing pages follow Users Management > Users structure
- [ ] Summary widgets are styled consistently
- [ ] Search and filters are placed consistently
- [ ] Filter chips are styled consistently
- [ ] Table/list/grid sections are clean and aligned
- [ ] Detail navigation follows HB pattern
- [ ] Actions are placed consistently

## Compare Against Detail Page Standards

Verify for detail pages:

- [ ] Detail page follows `Users > View User` where applicable.
- [ ] Edit/detail-form page follows `Users > Edit User` where applicable.
- [ ] Detail page also follows `templates/detail_view/`, `UIKit.tsx`, and `guidelines/`.
- [ ] Breadcrumb/back navigation works and is HB-styled.
- [ ] Entity title, subtitle, and status badge are aligned correctly.
- [ ] Header action buttons follow HB action-cluster behavior.
- [ ] Overview card uses HB card styling.
- [ ] Tabs/grouped sections preserve existing content and use HB spacing.
- [ ] Existing tables inside detail pages use HB table style.
- [ ] Existing forms inside detail pages use HB form style.
- [ ] Existing modals/drawers use HB modal/drawer style.
- [ ] Related records/cards are preserved and HB-styled.
- [ ] Audit/history/activity sections are preserved where existing.
- [ ] Listing-only behaviors are not forced onto detail pages unless already needed.
- [ ] Pixel/font/spacing match is reviewed and corrected.


## Compare Against Guidelines

Verify:

- [ ] Primary color uses `#1766C2`
- [ ] Font is consistent with Inter/base 14px expectation
- [ ] White/neutral backgrounds are used
- [ ] Borders are subtle
- [ ] Heavy filled/gradient designs are removed unless template-approved
- [ ] Dark mode compatibility is not broken
- [ ] Overall UI looks like one consistent HB admin product

## Compare Against Template Documentation

Verify:

- [ ] Listing pages follow `Users Management > Users` and `templates/listing/`
- [ ] Detail pages follow `templates/detail_view/`
- [ ] Forms follow `templates/form/`
- [ ] Header follows `templates/header/`
- [ ] Sidebar follows `templates/sidebar/`
- [ ] Reports/dashboard follow `templates/reports/`

---

# If Anything Is Missed

If any Clinic Admin screen or component does not meet the HB template guidelines:

1. Identify the issue.
2. Modify the file.
3. Re-run validation.
4. Re-check the affected screen against the HB template.
5. Continue until the Clinic Admin panel is consistently aligned.

Do not stop after only reporting issues. Fix the missed items where possible.

---

# Required Final Response from Codex

At the end, provide a concise implementation summary with:

## 1. Files Changed

List the files changed, grouped by:

- Layout
- Navigation
- Shared components
- Clinic Admin screens
- Styling/config

## 2. Clinic Admin Modules Updated

List the modules/screens updated.

## 3. HB Template Compliance Summary

Provide a checklist:

| Guideline Area | Status | Notes |
|---|---|---|
| Core layout | Done / Partial / Not Done | Notes |
| Sidebar | Done / Partial / Not Done | Notes |
| Global header | Done / Partial / Not Done | Notes |
| UI Kit components | Done / Partial / Not Done | Notes |
| Users Management > Users pattern | Done / Partial / Not Done | Notes |
| Pixel/font/spacing match | Done / Partial / Not Done | Notes |
| Listing pages | Done / Partial / Not Done | Notes |
| Detail pages | Done / Partial / Not Done | Notes |
| Forms | Done / Partial / Not Done | Notes |
| Dashboard/reports | Done / Partial / Not Done | Notes |
| Dark mode | Done / Partial / Not Done | Notes |
| Build/lint/typecheck | Passed / Failed / Not Available | Notes |

## 4. Any Remaining Gaps

Only mention real remaining gaps that could not be safely completed.

Do not claim full completion if some pages were not reviewed or updated.

---

# Important Final Instruction

This task is not complete until:

1. Clinic Admin screens are migrated to HB template style.
2. Existing Clinic Admin functionality is preserved.
3. The implementation has been validated using available project scripts.
4. A final self-review against HB template guidelines has been completed.
5. Any missed UI/template alignment issues found during review have been fixed.
6. Pixel-level font, spacing, sizing, alignment, card, table, and action-cluster mismatches have been reviewed and corrected.


---

# Recommended Module-by-Module Execution Prompt Usage

Use this master `.md` file as the base instruction file.

For actual Windsurf/Codex execution, use a small run prompt depending on page type.

## Listing Page Run Prompt

Use this when converting a module listing page.

```text
Read `clinic_admin_hb_template_migration_prompt.md` from the project root and apply it to the following Clinic Admin module listing page only:

MODULE: <MODULE_NAME>
LISTING PAGE / ROUTE: <LISTING_PAGE_FILES_OR_ROUTE>

Use `HB template/` as the source of truth.

Primary listing reference:
- `Left Navigation > Users Management > Users`

Do not use `HB Templates > Sample Page` as the main reference.

Scope:
- Update only this Clinic Admin listing page/module.
- Do not modify Patient Panel, Provider Panel, or Clinic Staff Panel.
- Only modify shared Clinic Admin layout/components if required.
- Preserve existing routes, state, mock data, columns, filters, actions, modals, forms, tabs, and business logic.

Required:
- Match HB template pixel-level spacing, font size, visual density, button/input height, table row height, icon size, card padding, border radius, and alignment.
- Implement HB listing behavior where applicable: header action cluster, compact expandable search, HB Filter By modal, customized columns only in Table View, Table/Grid/List views, row/card checkboxes, summary cards, status badges, pagination, and row actions.
- Do not add duplicate lower search/filter rows.
- Run `npm.cmd run build`.
- Fix errors caused by the change.
- Provide final files changed, features updated, validation result, pixel/font/spacing notes, and remaining gaps.
```

## Detail Page Run Prompt

Use this when converting a module detail/view page.

Important reference addition:
- For detail/view pages, use `Left Navigation > User Management > Users > View User` as the primary running UI reference where available.
- For edit/detail-form pages, use `Left Navigation > User Management > Users > Edit User` as the primary running UI reference where available.
- Keep `HB template/**/templates/detail_view/`, `HB template/**/src/app/components/UIKit.tsx`, and `HB template/**/guidelines/` as mandatory supporting references.

```text
Read `clinic_admin_hb_template_migration_prompt.md` from the project root and apply it to the following Clinic Admin detail page only:

MODULE: <MODULE_NAME>
DETAIL PAGE / ROUTE: <DETAIL_PAGE_FILES_OR_ROUTE>

Use `HB template/` as the source of truth.

Primary detail references:
- `HB template/**/templates/detail_view/`
- `HB template/**/src/app/components/UIKit.tsx`
- `HB template/**/guidelines/`

Use `Left Navigation > Users Management > Users` only for shared page shell, page header, action cluster, spacing, and visual density reference.

Do not use `HB Templates > Sample Page` as the main reference.

Scope:
- Update only this Clinic Admin detail page/module.
- Do not modify Patient Panel, Provider Panel, or Clinic Staff Panel.
- Only modify shared Clinic Admin layout/components if required.
- Preserve existing route, state, mock data, entity details, sections, tabs, actions, modals, drawers, related records, audit/history, and business logic.

Required:
- Match HB template pixel-level spacing, font size, visual density, button/input height, icon size, card padding, border radius, tab density, section spacing, and alignment.
- Apply HB detail structure: breadcrumb/back navigation, entity title, subtitle where existing, status badge, header actions, overview card, tabs/grouped cards, related records, audit/history/activity sections, HB-styled forms/tables/modals/drawers.
- Do not force listing-only behavior such as customized columns, table/grid/list switcher, or row selection unless the detail page already has a table/list requiring it.
- Run `npm.cmd run build`.
- Fix errors caused by the change.
- Provide final files changed, detail page updated, features updated, validation result, pixel/font/spacing notes, and remaining gaps.
```
