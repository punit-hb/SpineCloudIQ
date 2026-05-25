# Static Pages

---

## 1. Module Overview

- **Module Name:** Static Pages
- **Platform:** Admin Panel
- **Layout Type:** Desktop
- **Primary Role(s):** Admin
- **Goal:**  
  Allow Admin to view and update predefined static content pages used in the mobile app and web interface, while preventing page deletion, custom page creation, and slug modification.

---

## 2. Navigation & Entry Points

### 2.1 Left Navigation / Global Entry
- **Menu Label:** Configurations > Static Pages
- **Menu Icon (suggested):** file-text
- **Menu Level:** Secondary
- **Default Landing Screen ID:** ADM-CFG-SP-LIST-01

### 2.2 Visibility Rules
- Visible to:
  - ✅ Admin
  - ❌ Event Host
  - ❌ Participant
  - ❌ Guest

---

## 3. Screen Inventory (Index)

| Screen ID | Screen Name | Screen Type | Primary Action |
|----------|------------|------------|----------------|
| ADM-CFG-SP-LIST-01 | Static Pages | Listing | Edit Page |
| ADM-CFG-SP-EDIT-01 | Static Page Details | Form | Save |

---

## 4. Screens & Interaction Specs

### 4.1 Listing Screen

- **Screen ID:** ADM-CFG-SP-LIST-01
- **Screen Type:** Listing
- **Primary Action:** Edit Page
- **Secondary Actions:** View Page Details

#### Entry Points
- Sitemap > Configurations > Static Pages
- Back action from Static Page Details
- Redirect after saving static page changes
- Browser refresh while authenticated
- Direct URL access with valid Admin session

#### UI Layout
- Page Header
- System Pages Table
- Read-only system structure notice
- Loading skeleton table
- Error banner

#### Components
- Page title: Static Pages
- System notice banner
- Static pages table
- Page ID text
- Page name text
- Last updated date
- Updated by display
- Row click interaction
- Loading skeleton
- Error banner

#### Included Static Pages
| Page Name | Notes |
|------|------|
| Terms & Conditions | System-required static page |
| Privacy Policy | System-required static page |
| About FadeOut | System-required static page |

#### Data Table
| Column | Type | Click Behavior | Notes |
|------|-----|----------------|------|
| Page ID | Text | Click → Static Page Details | System-defined |
| Page Name | Text | Click → Static Page Details | Terms & Conditions / Privacy Policy / About FadeOut |
| Last Updated | Date | None | UTC display |
| Updated By | Text | None | Admin name |

#### Business Rules
- All predefined pages must always exist.
- Pages cannot be deleted.
- Page slugs are immutable.
- New custom pages cannot be created in MVP.
- Listing has no empty state because predefined pages must always exist.

#### UI-Level Validations
- No search or filter validation required.
- No create action is available.
- No delete action is available.

#### UX Copy
| Element | Copy |
|------|------|
| Page Title | Static Pages |
| System Notice | Static pages are predefined system pages. Pages cannot be created, deleted, or renamed here. |
| Error Banner | Unable to load static pages. |
| Session Expired Message | Your session has expired. Please log in again. |
| No Permission Message | You do not have permission to access this page. |

#### Navigation Rules
- Click Page ID → ADM-CFG-SP-EDIT-01
- Click Page Name → ADM-CFG-SP-EDIT-01
- Back from Static Page Details → ADM-CFG-SP-LIST-01
- Save success from Static Page Details → Stay on ADM-CFG-SP-EDIT-01 with success message
- Unauthorized access → ADM-AUTH-LOGIN-01
- Invalid session → ADM-AUTH-LOGIN-01

#### States
- **Loading:** Show skeleton table while static pages load.
- **Empty:** Not applicable because system pages must always exist.
- **Error:** Show “Unable to load static pages.”
- **No-permission:** Show no-permission message or redirect to Login.
- **Loaded:** Show predefined static pages table.

---

### 4.2 Static Page Details / Edit Screen

- **Screen ID:** ADM-CFG-SP-EDIT-01
- **Screen Type:** Form
- **Primary Action:** Save
- **Secondary Action:** Back

#### Entry Points
- Click Page ID from Static Pages listing
- Click Page Name from Static Pages listing
- Direct URL access with valid Admin session

#### UI Layout
- Page Header
- Back Action
- Static Page Metadata Section
- Rich Text Content Editor
- Validation Message Area
- Save Action Area
- Success / Error Feedback Area

#### Components
- Back button
- Page title: Static Page Details
- Page name label
- Slug label
- Rich text editor
- Save button
- Inline validation message
- Success toast
- Error banner
- Loading spinner
- Saving state indicator

#### Form Fields
| Field | Type | Required | Default |
|------|-----|----------|--------|
| Page Name | Label | ✅ | Existing page name |
| Slug | Label | ✅ | Existing system slug |
| Content | Rich Text Editor | ✅ | Existing page content |

#### Field Specifications
| Element | Type | Mandatory | Validation Rules | Validation Message | Remarks |
|------|------|-----------|------------------|-------------------|---------|
| Page Name | Label | ✅ | Read-only | — | Non-editable |
| Slug | Label | ✅ | Read-only | — | Immutable |
| Content | Rich Text Editor | ✅ | Min 20 characters, max 20,000 characters, unsupported elements not allowed | Content must be at least 20 characters. | Editable content field |
| Save | Button | ✅ | Enabled only when content is valid | — | Saves updated content |

#### Content Validation Rules
| Condition | Message |
|------|---------|
| Empty | Content is required. |
| Less than 20 characters | Content must be at least 20 characters. |
| More than 20,000 characters | Content must not exceed 20,000 characters. |
| Contains unsafe script tags | Content contains unsupported elements. |
| Contains inline JavaScript | JavaScript is not allowed. |

#### Allowed Content Elements
- Paragraph text
- Bold text
- Italic text
- Bulleted lists
- List items
- Links
- Line breaks

#### Unsupported Content Elements
- Script tags
- Iframes
- Inline JavaScript
- Unsupported embedded elements

#### UI-Level Validations
- Content is required.
- Content must be at least 20 characters.
- Content must not exceed 20,000 characters.
- Unsafe content must show a clear validation message.
- Save button is disabled when required content is invalid.
- Page Name and Slug must not be editable.

#### UX Copy
| Element | Copy |
|------|------|
| Page Title | Static Page Details |
| Back Button | Back |
| Content Field Label | Content |
| Save Button | Save |
| Saving Button State | Saving... |
| Success Toast | Page updated successfully. |
| Error Banner | Unable to update static page. Please try again. |
| Content Required | Content is required. |
| Unsafe Content | Content contains unsupported elements. |
| Inline JavaScript Error | JavaScript is not allowed. |
| Unsaved Changes Warning | You have unsaved changes. Are you sure you want to leave? |

#### Interaction Rules
- Admin opens a static page row from listing.
- System displays Page Name and Slug as read-only labels.
- Admin edits Content in the rich text editor.
- Save button remains disabled until content passes validation.
- On Save, show saving state and disable Save button.
- On successful save, show success toast and remain on Static Page Details.
- On validation failure, show inline field message under Content.
- On failure, show error banner and preserve unsaved input where possible.
- If Admin attempts to leave with unsaved changes, show unsaved changes warning.

#### Navigation Rules
- Back with no unsaved changes → ADM-CFG-SP-LIST-01
- Back with unsaved changes → Show unsaved changes warning
- Confirm leave with unsaved changes → ADM-CFG-SP-LIST-01
- Cancel leave → Stay on ADM-CFG-SP-EDIT-01
- Save success → Stay on ADM-CFG-SP-EDIT-01 and show success toast
- Save failure → Stay on ADM-CFG-SP-EDIT-01 and show error banner
- Unauthorized access → ADM-AUTH-LOGIN-01
- Invalid session → ADM-AUTH-LOGIN-01

#### States
- **Loading:** Show spinner while page content loads.
- **Empty:** Content field empty state shows validation after interaction or save attempt.
- **Error:** Show “Unable to update static page. Please try again.” or load failure message.
- **No-permission:** Show no-permission message or redirect to Login.
- **Editing:** Show editable rich text content field.
- **Saving:** Disable Save button and show saving state.
- **Success:** Show “Page updated successfully.”
- **Validation Error:** Show inline message below Content field.

---

## 5. Notifications & Feedback

- Success toast: Page updated successfully.
- Error banner on listing: Unable to load static pages.
- Error banner on edit: Unable to update static page. Please try again.
- Inline validation: Content is required.
- Inline validation: Content must be at least 20 characters.
- Inline validation: Content must not exceed 20,000 characters.
- Inline validation: Content contains unsupported elements.
- Inline validation: JavaScript is not allowed.
- Unsaved changes warning: You have unsaved changes. Are you sure you want to leave?

---

## 6. Access & Visibility Rules

| Action | Role |
|------|------|
| View Static Pages | ✅ Admin |
| View Static Page Details | ✅ Admin |
| Edit Static Page Content | ✅ Admin |
| Save Static Page Content | ✅ Admin |
| Create Static Page | ❌ Admin |
| Delete Static Page | ❌ Admin |
| Modify Page Slug | ❌ Admin |
| Rename System Page | ❌ Admin |
| View Static Pages | ❌ Event Host |
| View Static Pages | ❌ Participant |
| View Static Pages | ❌ Guest |

---

## 7. Open Questions / TODOs

- TODO: Confirm final rich text editor toolbar options for prototype.
- TODO: Confirm whether link insertion should include URL validation in the prototype.
- TODO: Confirm whether preview mode is required for static page content.
- TODO: Confirm final labels for Terms & Conditions, Privacy Policy, and About FadeOut if branding changes.

---

## 8. Regeneration Rules

- Screen IDs must not change.
- One screen = one Figma frame.
- Preserve navigation rules.
- Preserve listing screen ID as ADM-CFG-SP-LIST-01.
- Preserve edit screen ID as ADM-CFG-SP-EDIT-01.
- Do not add create, delete, rename, slug edit, version history, or rollback screens unless scope is explicitly changed and confirmed.
- Keep Static Pages limited to predefined system pages unless scope changes.

