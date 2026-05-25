# Event Management

---

## 1. Module Overview

- **Module Name:** Event Management
- **Platform:** Admin Panel
- **Layout Type:** Desktop
- **Primary Role(s):** Admin
- **Goal:**  
  Allow Admin to view event records and inspect event details in a read-only format while preserving the platform rule that Admin cannot create, edit, end, expire, or delete events.

---

## 2. Navigation & Entry Points

### 2.1 Left Navigation / Global Entry
- **Menu Label:** Event Management > Event Management
- **Menu Icon (suggested):** calendar
- **Menu Level:** Primary
- **Default Landing Screen ID:** ADM-EVT-LIST-01

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
| ADM-EVT-LIST-01 | Event Management | Listing | View Details |
| ADM-EVT-DETAIL-01 | Event Details | Detail | View Only |

---

## 4. Screens & Interaction Specs

### 4.1 Listing Screen

- **Screen ID:** ADM-EVT-LIST-01
- **Screen Type:** Listing
- **Primary Action:** View Details
- **Secondary Actions:** Search, Filter, Sort

#### Entry Points
- Sitemap > Event Management > Event Management
- Back action from Event Details
- Browser refresh while authenticated
- Direct URL access with valid Admin session

#### UI Layout
- Page Header
- Filter Bar
- Data Table
- Pagination
- Read-only notice banner

#### Components
- Page title: Event Management
- Read-only notice banner
- Search input
- Status filter dropdown
- Date range filter
- Sortable table headers
- Data table
- Event status badge
- Pagination control
- Empty state block
- Error banner
- Loading skeleton table

#### Filters & Search
| Element | Type | Required | Validation Message |
|------|------|----------|-------------------|
| Search | Text | ❌ | Search text must not exceed 100 characters. |
| Status Filter | Dropdown | ❌ | — |
| Date Range Filter | Date Range | ❌ | Invalid date range. |
| Pagination | Numeric | ✅ | — |

#### Filter Options
| Filter | Options | Default |
|------|---------|---------|
| Status | Active, Expired | All events |
| Date Range | Created date range | Empty |

#### Data Table
| Column | Type | Click Behavior | Notes |
|------|-----|----------------|------|
| Event ID | Text | Click → Event Details | Unique identifier |
| Event Name | Text | Click → Event Details | Display only |
| Host | Text | None | Primary event host |
| Status | Badge | None | Active / Expired |
| Start Date | Date | None | UTC display |
| Expiry Date | Date | None | UTC display |
| Created Date | Date | None | UTC display |

#### Sorting Rules
- Default sort: Created Date DESC
- Sortable columns:
  - Event Name
  - Host
  - Status
  - Start Date
  - Expiry Date
  - Created Date

#### Pagination Rules
- Default page size: 20
- Maximum page size: 100
- Page number must be 1 or higher

#### UI-Level Validations
- Search text must not exceed 100 characters.
- Search must not contain unsupported characters.
- Date range must have a valid start and end date.
- End date must not be earlier than start date.
- Pagination must not allow invalid page numbers.

#### UX Copy
| Element | Copy |
|------|------|
| Page Title | Event Management |
| Read-only Banner | Admin can view event records only. Event creation, editing, ending, expiry, and deletion are not available. |
| Search Placeholder | Search by event name or host |
| Status Filter Label | Status |
| Date Filter Label | Created Date |
| Empty State Title | No events found. |
| Error Banner | Unable to load events. Please try again. |
| Session Expired Message | Your session has expired. Please log in again. |
| No Permission Message | You do not have permission to access this page. |

#### Navigation Rules
- Click Event ID → ADM-EVT-DETAIL-01
- Click Event Name → ADM-EVT-DETAIL-01
- Back from Event Details → ADM-EVT-LIST-01
- Unauthorized access → ADM-AUTH-LOGIN-01
- Invalid session → ADM-AUTH-LOGIN-01

#### States
- **Loading:** Show skeleton table while event records load.
- **Empty:** Show “No events found.” when no records match search or filters.
- **Error:** Show “Unable to load events. Please try again.”
- **No-permission:** Show no-permission message or redirect to Login.
- **Loaded:** Show event table with filters and pagination.
- **Validation Error:** Show inline validation below search or date filter.

---

### 4.2 Event Details Screen

- **Screen ID:** ADM-EVT-DETAIL-01
- **Screen Type:** Detail
- **Primary Action:** View Only
- **Secondary Action:** Back

#### Entry Points
- Click Event ID from Event Management listing
- Click Event Name from Event Management listing
- Direct URL access with valid Admin session

#### UI Layout
- Page Header
- Back Action
- Read-only notice banner
- Event Summary Card
- Host and Co-host Section
- RSVP Summary Section
- Participant Summary Section
- Chat and Media Summary Section
- Lifecycle Section

#### Components
- Back button
- Page title: Event Details
- Read-only notice banner
- Event ID display
- Event name display
- Host display
- Co-host display list
- Event status badge
- Start date display
- Expiry date display
- Created date display
- Expired date display, when available
- Expiry reason display, when available
- RSVP summary cards
- Participant count display
- Media count display
- Chat summary display
- Loading spinner
- Error banner

#### Display Fields
| Field | Editable | Notes |
|------|----------|------|
| Event ID | No | System generated |
| Event Name | No | Display only |
| Host | No | Primary event host |
| Co-hosts | No | Display only, if available |
| Status | No | Active / Expired |
| Start Date | No | UTC display |
| Expiry Date | No | UTC display |
| Created Date | No | UTC display |
| Expired Date | No | Shown when event is expired |
| Expiry Reason | No | Auto, Manual End, or Host Account Deletion when available |
| Going Count | No | RSVP summary |
| Maybe Count | No | RSVP summary |
| Not Going Count | No | RSVP summary |
| Media Count | No | Image count summary |
| Chat State | No | Active or read-only archive state |

#### RSVP Summary Section
| Card | Type | Click Behavior | Notes |
|------|------|----------------|------|
| Going | Metric Card | None | Display count only |
| Maybe | Metric Card | None | Display count only |
| Not Going | Metric Card | None | Display count only |

#### Lifecycle Section
| Field | Type | Notes |
|------|------|------|
| Current Status | Badge | Active / Expired |
| Start Date | Date | UTC display |
| Expiry Date | Date | UTC display |
| Expired Date | Date | Visible only when expired |
| Archive State | Text | Read-only archive after expiry |

#### UI-Level Validations
- No editable fields are available.
- No destructive actions are available.
- Event deletion controls must not be displayed.
- Event ending controls must not be displayed.
- Event expiry controls must not be displayed.

#### UX Copy
| Element | Copy |
|------|------|
| Page Title | Event Details |
| Back Button | Back |
| Read-only Banner | This event is view-only for Admin. No event actions are available. |
| Expired Archive Label | This event has faded out and is now read-only. |
| Active Label | This event is currently active. |
| Event Not Found | Event not found. |
| Detail Error | Unable to load event details. |
| No Permission Message | You do not have permission to access this page. |

#### Navigation Rules
- Back → ADM-EVT-LIST-01
- Event not found → Show error state on ADM-EVT-DETAIL-01
- Unauthorized access → ADM-AUTH-LOGIN-01
- Invalid session → ADM-AUTH-LOGIN-01

#### States
- **Loading:** Show spinner while event details load.
- **Empty:** Not applicable for valid event detail records.
- **Error:** Show “Unable to load event details.”
- **No-permission:** Show no-permission message or redirect to Login.
- **Loaded:** Display event information in read-only mode.
- **Expired Archive:** Show archive label and read-only state.

---

## 5. Notifications & Feedback

- Error banner: Unable to load events. Please try again.
- Error banner: Unable to load event details.
- Empty state: No events found.
- Read-only banner on listing: Admin can view event records only. Event creation, editing, ending, expiry, and deletion are not available.
- Read-only banner on detail: This event is view-only for Admin. No event actions are available.
- No success toast required because this module has no data-changing actions.
- No confirmation modal required because this module has no destructive actions.

---

## 6. Access & Visibility Rules

| Action | Role |
|------|------|
| View Event Listing | ✅ Admin |
| Search Events | ✅ Admin |
| Filter Events | ✅ Admin |
| Sort Events | ✅ Admin |
| View Event Details | ✅ Admin |
| Create Event | ❌ Admin |
| Edit Event | ❌ Admin |
| End Event | ❌ Admin |
| Expire Event | ❌ Admin |
| Delete Event | ❌ Admin |
| Permanently Delete Event | ❌ Admin |
| View Event Management | ❌ Event Host |
| View Event Management | ❌ Participant |
| View Event Management | ❌ Guest |

---

## 7. Open Questions / TODOs

- TODO: Confirm final Admin Event Listing columns if different from Event ID, Event Name, Host, Status, Start Date, Expiry Date, and Created Date.
- TODO: Confirm whether RSVP counts should be shown only as summary cards or include a read-only participant list.
- TODO: Confirm whether media count and chat state should be shown as summary only or with separate read-only preview sections.
- TODO: Confirm exact status labels to display in Admin Panel if the production event lifecycle uses only Active and Expired.

---

## 8. Regeneration Rules

- Screen IDs must not change.
- One screen = one Figma frame.
- Preserve navigation rules.
- Preserve listing screen ID as ADM-EVT-LIST-01.
- Preserve detail screen ID as ADM-EVT-DETAIL-01.
- Do not add create, edit, delete, expire, or end-event screens for Admin.
- Keep Event Management read-only unless scope is explicitly changed and confirmed.

