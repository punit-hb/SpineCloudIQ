# User Management

---

## 1. Module Overview

- **Module Name:** User Management
- **Platform:** Admin Panel
- **Layout Type:** Desktop
- **Primary Role(s):** Admin
- **Goal:**  
  Allow Admin to view active and inactive users, search and filter user records, inspect user details, and activate or deactivate user accounts without deleting users.

---

## 2. Navigation & Entry Points

### 2.1 Left Navigation / Global Entry
- **Menu Label:** User Management > Users
- **Menu Icon (suggested):** users
- **Menu Level:** Secondary
- **Default Landing Screen ID:** ADM-USR-LIST-01

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
| ADM-USR-LIST-01 | Users | Listing | View Details |
| ADM-USR-DETAIL-01 | User Details | Detail | Activate / Deactivate |
| ADM-USR-STATUS-01 | User Status Confirmation | Modal | Confirm |

---

## 4. Screens & Interaction Specs

### 4.1 Listing Screen

- **Screen ID:** ADM-USR-LIST-01
- **Screen Type:** Listing
- **Primary Action:** View Details
- **Secondary Actions:** Search, Filter, Sort, Activate / Deactivate

#### Entry Points
- Sitemap > User Management > Users
- Back action from User Details
- Redirect after account status update
- Browser refresh while authenticated

#### UI Layout
- Page Header
- Filter Bar
- Data Table
- Status Action Control
- Pagination

#### Components
- Page title: Users
- Search input
- Status filter dropdown
- Sortable table headers
- Data table
- Status badge
- Activate / Deactivate toggle action
- Pagination control
- Empty state block
- Error banner
- Loading skeleton table

#### Filters & Search
| Element | Type | Required | Validation Message |
|------|------|----------|-------------------|
| Search | Text | ❌ | Search text must not exceed 100 characters. |
| Status Filter | Dropdown | ❌ | — |
| Pagination | Numeric | ✅ | — |

#### Filter Options
| Filter | Options | Default |
|------|---------|---------|
| Status | Active, Inactive | All visible users |

#### Data Table
| Column | Type | Click Behavior | Notes |
|------|-----|----------------|------|
| User ID | Text | Click → User Details | Unique identifier |
| Name | Text | Click → User Details | Display only |
| Email | Text | None | Masked format optional |
| Status | Badge | None | Active / Inactive |
| Created Date | Date | None | UTC display |
| Actions | Toggle Button | Open Confirmation Modal | Activate / Deactivate |

#### Sorting Rules
- Default sort: Created Date DESC
- Sortable columns:
  - Name
  - Email
  - Created Date

#### Pagination Rules
- Default page size: 20
- Maximum page size: 100
- Page number must be 1 or higher

#### UI-Level Validations
- Search text must not exceed 100 characters.
- Search must not contain unsupported characters.
- Pagination must not allow invalid page numbers.

#### UX Copy
| Element | Copy |
|------|------|
| Page Title | Users |
| Search Placeholder | Search by name or email |
| Status Filter Label | Status |
| Empty State Title | No users found. |
| Error Banner | Unable to load users. Please try again. |
| Session Expired Message | Your session has expired. Please log in again. |
| No Permission Message | You do not have permission to access this page. |

#### Navigation Rules
- Click User ID → ADM-USR-DETAIL-01
- Click Name → ADM-USR-DETAIL-01
- Click Activate / Deactivate → ADM-USR-STATUS-01
- Confirm status change → ADM-USR-LIST-01
- Cancel status change → Stay on ADM-USR-LIST-01
- Unauthorized access → ADM-AUTH-LOGIN-01
- Back from User Details → ADM-USR-LIST-01

#### States
- **Loading:** Show skeleton table while user records load.
- **Empty:** Show “No users found.” when no records match search or filter.
- **Error:** Show “Unable to load users. Please try again.”
- **No-permission:** Show no-permission message or redirect to Login.
- **Loaded:** Show table with pagination and filters.
- **Validation Error:** Show inline validation below search input.

---

### 4.2 User Details Screen

- **Screen ID:** ADM-USR-DETAIL-01
- **Screen Type:** Detail
- **Primary Action:** Activate / Deactivate
- **Secondary Action:** Back

#### Entry Points
- Click User ID from Users listing
- Click Name from Users listing
- Redirect after status update

#### UI Layout
- Page Header
- User Profile Summary Card
- Account Status Section
- Event Summary Metrics
- Created Events Table
- Joined Events Table
- Back Action

#### Components
- Back button
- User ID display
- Name display
- Email display
- Account status badge
- Activate / Deactivate toggle
- Created date display
- Total events created metric
- Total events joined metric
- Active events metric
- Expired events metric
- Created Events table
- Joined Events table
- Loading spinner
- Error banner

#### Display Fields
| Field | Editable | Notes |
|------|----------|------|
| User ID | No | System generated |
| Name | No | Display only |
| Email | No | Unique user email |
| Account Status | Yes | Active / Inactive toggle |
| Created Date | No | UTC display |
| Total Events Created | No | Count |
| Total Events Joined | No | Count |
| Active Events | No | Count |
| Expired Events | No | Count |

#### Created Events Table
| Column | Type | Click Behavior | Notes |
|------|------|----------------|------|
| Event Name | Text | None | Display only |
| Status | Badge | None | Active / Expired |
| Expiry Date | Date | None | UTC display |

#### Joined Events Table
| Column | Type | Click Behavior | Notes |
|------|------|----------------|------|
| Event Name | Text | None | Display only |
| Host | Text | None | Host name |
| RSVP Status | Badge | None | RSVP state |
| Status | Badge | None | Event status |

#### UI-Level Validations
- No editable profile fields are available.
- Status change requires confirmation.
- Self-deactivation must be blocked with a clear message.

#### UX Copy
| Element | Copy |
|------|------|
| Page Title | User Details |
| Back Button | Back |
| Deactivate Button | Deactivate User |
| Activate Button | Activate User |
| Status Update Success | User account has been activated successfully. |
| Deactivation Success | User account has been deactivated successfully. |
| User Not Found | User not found. |
| Already Inactive | The user is already inactive. |
| Update Error | Unable to update user status. |
| Self-Deactivation Blocked | You cannot deactivate your own account. |

#### Navigation Rules
- Back → ADM-USR-LIST-01
- Activate / Deactivate → ADM-USR-STATUS-01
- Confirm status change → Return to ADM-USR-DETAIL-01 with updated status
- Cancel status change → Stay on ADM-USR-DETAIL-01
- User not found → Show error state on ADM-USR-DETAIL-01
- Unauthorized access → ADM-AUTH-LOGIN-01

#### States
- **Loading:** Show spinner while details load.
- **Empty:** Not applicable for valid user detail records.
- **Error:** Show “Unable to load user details.”
- **No-permission:** Show no-permission message or redirect to Login.
- **Loaded:** Display user profile and event participation summary.
- **Status Updating:** Disable status toggle and show progress indicator.

---

### 4.3 User Status Confirmation Modal

- **Screen ID:** ADM-USR-STATUS-01
- **Screen Type:** Modal
- **Primary Action:** Confirm
- **Secondary Action:** Cancel

#### Entry Points
- Activate / Deactivate action from Users listing
- Activate / Deactivate action from User Details

#### UI Layout
- Modal title
- Confirmation message
- Primary confirmation button
- Secondary cancel button

#### Components
- Confirmation modal
- User name or identifier display
- Confirm button
- Cancel button
- Warning copy for deactivation

#### Copy
| Scenario | Title | Message | Primary Button | Secondary Button |
|------|------|---------|----------------|------------------|
| Deactivate User | Deactivate User | Are you sure you want to deactivate this user? The user will not be able to log in. | Confirm | Cancel |
| Activate User | Activate User | Are you sure you want to activate this user? The user will be able to log in again. | Confirm | Cancel |
| Self-Deactivation Blocked | Action Not Allowed | You cannot deactivate your own account. | Close | — |

#### Navigation Rules
- Confirm deactivate → Return to source screen with updated status
- Confirm activate → Return to source screen with updated status
- Cancel → Close modal and stay on source screen
- Close self-deactivation warning → Stay on source screen

#### States
- **Loading:** Disable modal buttons and show progress on Confirm.
- **Empty:** Not applicable.
- **Error:** Show “Unable to update user status.”
- **No-permission:** Close modal and show no-permission message.
- **Success:** Close modal and show success toast.

---

## 5. Notifications & Feedback

- Success toast after activation: User account has been activated successfully.
- Success toast after deactivation: User account has been deactivated successfully.
- Error banner: Unable to load users. Please try again.
- Error banner: Unable to load user details.
- Error toast: Unable to update user status.
- Validation message: Search text must not exceed 100 characters.
- Confirmation modal required before activating or deactivating a user.

---

## 6. Access & Visibility Rules

| Action | Role |
|------|------|
| View Users | ✅ Admin |
| Search Users | ✅ Admin |
| Filter Users | ✅ Admin |
| Sort Users | ✅ Admin |
| View User Details | ✅ Admin |
| Activate User | ✅ Admin |
| Deactivate User | ✅ Admin |
| Delete User | ❌ Admin |
| Edit User Email | ❌ Admin |
| Modify Event Data | ❌ Admin |
| View Users | ❌ Event Host |
| View Users | ❌ Participant |
| View Users | ❌ Guest |

---

## 7. Open Questions / TODOs

- TODO: Confirm whether email should be masked in listing or shown fully.
- TODO: Confirm exact unsupported character rules for search input.
- TODO: Confirm whether Created Events and Joined Events rows should navigate to Event Management detail in prototype.

---

## 8. Regeneration Rules

- Screen IDs must not change.
- One screen = one Figma frame.
- Preserve navigation rules.
- Preserve listing screen ID as ADM-USR-LIST-01.
- Preserve detail screen ID as ADM-USR-DETAIL-01.
- Preserve confirmation modal ID as ADM-USR-STATUS-01.
- Do not add create, edit, or delete user screens unless scope is changed and confirmed.

