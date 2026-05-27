# UI GOVERNANCE SYSTEM
## Enterprise Design Consistency & UX Standardization Guide

Version: 1.0  
Purpose: Global UI/UX governance system for maintaining consistent enterprise-grade design standards across the entire admin panel ecosystem.

---

# 1. CORE OBJECTIVE

This document is the single source of truth for:

- UI consistency
- UX consistency
- Typography hierarchy
- Sidebar behavior
- Header behavior
- Listing page behavior
- Table behavior
- Scroll behavior
- Footer behavior
- View switching behavior
- Card layout behavior
- Status badge styling
- Spacing standards
- Interaction consistency
- HB template parity
- Enterprise SaaS visual hierarchy

If any screen conflicts with this governance system:

## THIS GOVERNANCE DOCUMENT OVERRIDES THE SCREEN

---

# 2. GLOBAL DESIGN PRINCIPLES

All screens throughout the platform must follow:

- Clean enterprise SaaS layout
- Neutral backgrounds
- Minimal visual noise
- High readability
- Strong hierarchy
- Predictable interaction behavior
- Reusable component patterns
- Consistent spacing
- Consistent density
- Consistent typography
- Consistent card styles
- Consistent table styles
- Consistent action patterns
- Consistent view switching patterns

---

# 3. GLOBAL LAYOUT STRUCTURE

Every page must follow:

```text
Global Header
Page Header
Optional Summary Cards
Content Area
Pagination
Footer
```

The application must NEVER scroll as a full page unless explicitly required.

Only content sections should scroll.

---

# 4. GLOBAL HEADER STANDARD

## Header Hierarchy

### CASE 1: Nested/Internal Module Page

Show:

```text
Breadcrumb
Page Title
Optional Description
```

Example:

```text
Administration > User Management
User Management
```

Optional:

```text
Administration > User Management
User Management
Manage platform administrators and support staff.
```

---

### CASE 2: Standalone/Independent Page

If no hierarchy exists:

DO NOT show breadcrumb.

Instead show:

```text
Page Title
Description
```

Example:

```text
Dashboard
Platform overview, analytics, and operational insights.
```

---

# 5. HEADER TYPOGRAPHY STANDARD

| Element | Font Size | Weight |
|---|---|---|
| Page Title | 24px | 700 |
| Breadcrumb | 14px | 500 |
| Description | 14px | 400 |

---

# 6. HEADER SPACING STANDARD

## With Breadcrumb

- Breadcrumb → 8px gap → Title
- Title → 8px gap → Description

## Without Breadcrumb

- Title → 8px gap → Description

---

# 7. GLOBAL ACTION CLUSTER STANDARD

Action cluster order must ALWAYS follow:

```text
Search
Filter
Primary CTA
Analytics/Summary
Refresh
More
View Switcher
```

No random ordering allowed.

---

# 8. ACTION BUTTON STANDARD

| Property | Standard |
|---|---|
| Height | 40px |
| Border Radius | 8px |
| Font Size | 14px |
| Font Weight | 500 |
| Icon Size | 16px |
| Icon Gap | 8px |

---

# 9. PRIMARY BUTTON STANDARD

Primary buttons must:

- Use HB blue color
- Use consistent padding
- Use white text
- Maintain 40px height
- Maintain 8px border radius

Default color:

```text
#1766C2
```

---

# 10. SIDEBAR GOVERNANCE

## Sidebar Typography

| Property | Standard |
|---|---|
| Font Size | 14px |
| Font Weight | 500 |
| Icon Size | 18px |
| Item Height | Consistent |
| Padding | Consistent |

---

## Sidebar Behavior

Sidebar must support:

- Expanded state
- Collapsed state
- Active state
- Hover state
- Nested submenu
- Slim scroll

---

## Sidebar Width

| State | Width |
|---|---|
| Expanded | 256px |
| Collapsed | 64px |

---

# 11. VIEW SWITCHER GOVERNANCE

View switcher must always remain right aligned.

Supported views:

- Table View
- List View
- Card View

---

## View Switcher Standard

| Property | Standard |
|---|---|
| Height | 40px |
| Border Radius | 8px |
| Icon Size | 16px |
| Active State | HB blue subtle |
| Hover State | Neutral gray |
| Gap | Consistent |

---

# 12. DEFAULT VIEW RULE

All listing pages must open in:

## CARD VIEW

unless business requirements specify otherwise.

---

# 13. TABLE VIEW GOVERNANCE

## Mandatory Rules

- Every column sortable
- Sticky table header
- Internal table scroll
- Slim scroll mandatory
- Fixed pagination
- Fixed footer
- Actions only inside 3-dot menu
- Consistent row height
- Consistent cell padding

---

# 14. TABLE LAYOUT ARCHITECTURE

```text
Fixed Header
Fixed Page Header
Fixed Summary Cards
Fixed Table Header
Scrollable Table Body
Fixed Pagination
Fixed Footer
```

Only the table body should scroll.

---

# 15. TABLE SCROLL BEHAVIOR

Tables with many records must:

- Scroll internally
- Preserve header visibility
- Preserve pagination visibility
- Preserve footer visibility

Entire page scrolling is NOT allowed.

---

# 16. TABLE TYPOGRAPHY STANDARD

| Element | Size |
|---|---|
| Table Header | 14px |
| Table Body | 14px |
| Table Metadata | 12px |

---

# 17. TABLE ACTION STANDARD

All row actions must:

- Exist inside 3-dot menu
- Never float independently
- Maintain consistent width
- Maintain consistent alignment

---

# 18. TABLE CHECKBOX STANDARD

If selection exists:

Table must include:

- Select all checkbox
- Row checkbox

Checkbox alignment must remain consistent.

---

# 19. TABLE HORIZONTAL SCROLL

Wide tables must:

- Scroll horizontally internally
- Use slim scroll
- Preserve sticky header
- Maintain layout integrity

Native ugly scrollbars are not allowed.

---

# 20. LIST VIEW GOVERNANCE

## Mandatory Rules

- Avatar first
- Initial fallback mandatory
- Actions inside 3-dot
- Consistent spacing
- Consistent hierarchy
- Optional full row click

---

## Avatar Fallback Rule

If no image exists:

Generate initials:

```text
First Name Initial + Last Name Initial
```

Example:

```text
John Doe → JD
```

---

# 21. CARD VIEW GOVERNANCE

## Card View is Default

Every listing page must default to:

## CARD VIEW

unless overridden by business requirement.

---

## Card Layout Rules

- 4-column desktop layout
- Responsive collapse
- Uniform height
- Uniform padding
- Uniform metadata spacing
- Consistent avatar placement
- Status badge bottom-right
- Actions inside 3-dot menu

---

# 22. CARD TYPOGRAPHY

| Element | Size |
|---|---|
| Card Title | 16px |
| Card Subtitle | 14px |
| Metadata | 14px |
| Small Metadata | 12px |

---

# 23. KPI CARD GOVERNANCE

## KPI Card Standard

| Property | Standard |
|---|---|
| Radius | 8px |
| Padding | 20px |
| Value Size | Consistent |
| Label Size | Consistent |
| Height | Fixed |

---

# 24. STATUS BADGE GOVERNANCE

Status badges must use:

- Dot + pill style
- Consistent height
- Consistent padding
- Consistent radius

---

## Badge Standard

| Property | Standard |
|---|---|
| Height | 28px |
| Radius | Full pill |
| Dot Size | 8px |
| Font Size | 12px |

---

# 25. STATUS COLORS

| Status | Color |
|---|---|
| Active | Green |
| Inactive | Gray |
| Pending | Orange |
| Failed | Red |
| Success | Green |
| Suspended | Red |
| Open | Blue |
| Closed | Gray |

---

# 26. SCROLL GOVERNANCE

Entire application must use:

# SLIM SCROLL

---

# 27. SLIM SCROLL STANDARD

Apply everywhere:

- Tables
- Dropdowns
- Sidebars
- Drawers
- Modals
- Lists
- Filters
- Long content sections

---

## Slim Scroll Style

| Property | Standard |
|---|---|
| Width | 6px |
| Radius | Full |
| Track | Transparent |
| Thumb | Neutral Gray |
| Hover | Darker Gray |
| Auto Hide | Yes |

---

# 28. FOOTER GOVERNANCE

Footer must:

- Remain fixed at bottom
- Never disappear
- Never scroll with content
- Always remain visible

---

# 29. PAGINATION GOVERNANCE

Pagination must:

- Stay fixed above footer
- Never disappear during scroll
- Maintain visibility at all times

---

# 30. TYPOGRAPHY GOVERNANCE

## Global Typography Scale

| Element | Size |
|---|---|
| H1 | 24px |
| H2 | 20px |
| H3 | 18px |
| Body | 14px |
| Small | 12px |
| Sidebar | 14px |
| Table | 14px |

---

# 31. SPACING GOVERNANCE

Only use approved spacing tokens:

```text
4
8
12
16
20
24
32
40
```

Random spacing values are prohibited.

---

# 32. BORDER RADIUS GOVERNANCE

| Component | Radius |
|---|---|
| Button | 8px |
| Card | 8px |
| Modal | 12px |
| Badge | Full |
| Input | 8px |

---

# 33. INPUT STANDARD

| Property | Standard |
|---|---|
| Height | 40px |
| Radius | 8px |
| Font Size | 14px |
| Border | Neutral |

---

# 34. SEARCH GOVERNANCE

Search must:

- Begin as compact icon
- Expand inline
- Maintain HB styling
- Never create duplicate rows

---

# 35. FILTER GOVERNANCE

Filters must:

- Use HB modal/popup style
- Preserve existing functionality
- Use slim scroll
- Use consistent spacing

---

# 36. EMPTY STATE GOVERNANCE

Empty states must:

- Use neutral cards
- Show helpful message
- Show optional CTA
- Avoid oversized graphics

---

# 37. MODAL GOVERNANCE

Modals must:

- Use slim scroll
- Maintain consistent spacing
- Use fixed footer actions
- Preserve overlay consistency

---

# 38. DRAWER GOVERNANCE

Drawers must:

- Use internal scroll
- Use slim scroll
- Preserve sticky actions
- Maintain consistent width

---

# 39. DARK MODE GOVERNANCE

Dark mode must remain:

- fully supported
- visually balanced
- contrast safe

No component should break dark mode.

---

# 40. RESPONSIVE GOVERNANCE

## Desktop

- Full layout
- Multi-column
- Sticky controls

## Tablet

- Reduced spacing
- Adaptive cards

## Mobile

- Stacked layout
- Sticky actions
- Simplified controls

---

# 41. HB TEMPLATE PARITY RULE

The HB template is the visual source of truth.

If any generated UI conflicts with HB patterns:

## HB TEMPLATE WINS

---

# 42. AI GOVERNANCE RULE

Codex/Windsurf must:

- preserve business logic
- preserve routes
- preserve APIs
- preserve state
- preserve filters
- preserve actions

Only improve:

- design consistency
- UX consistency
- spacing
- hierarchy
- interaction behavior
- layout structure

---

# 43. FINAL VALIDATION CHECKLIST

Before completing any task:

- Verify sidebar typography
- Verify title hierarchy
- Verify spacing consistency
- Verify table scroll behavior
- Verify slim scroll everywhere
- Verify fixed footer
- Verify fixed pagination
- Verify view switcher consistency
- Verify button consistency
- Verify status badge consistency
- Verify typography scale
- Verify responsive behavior
- Verify HB parity
- Verify dark mode safety

---

# 44. FINAL SYSTEM RULE

This governance system is the final authority for:

- UI decisions
- UX decisions
- spacing decisions
- layout decisions
- table behavior
- header behavior
- scrolling behavior
- footer behavior
- component consistency

Any inconsistent screen must be corrected until it fully aligns with this governance system.
