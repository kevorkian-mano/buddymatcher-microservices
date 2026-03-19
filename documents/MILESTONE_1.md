# 🎨 Milestone 1 — UI/UX Design in Figma

> **Weight:** 30% of total project grade
> **Deadline:** 17 March 2026
> **Submission:** Google Form → Google Drive link containing the Figma file/prototype

---

## 📑 Table of Contents

1. [Objective](#1-objective)
2. [What to Design — Page List](#2-what-to-design--page-list)
3. [Page-by-Page Breakdown](#3-page-by-page-breakdown)
   - [1. Landing / Welcome Page](#page-1-landing--welcome-page)
   - [2. Registration Page](#page-2-registration-page)
   - [3. Login Page](#page-3-login-page)
   - [4. User Profile Setup Page](#page-4-user-profile-setup-page)
   - [5. Study Preferences Setup Page](#page-5-study-preferences-setup-page)
   - [6. Availability Management Page](#page-6-availability-management-page)
   - [7. Dashboard / Home Page](#page-7-dashboard--home-page)
   - [8. Matching / Study Buddy Recommendation Page](#page-8-matching--study-buddy-recommendation-page)
   - [9. Match Details Page](#page-9-match-details-page)
   - [10. Buddy Requests / Connections Page](#page-10-buddy-requests--connections-page)
   - [11. Study Sessions Page](#page-11-study-sessions-page)
   - [12. Create Study Session Page](#page-12-create-study-session-page)
   - [13. Notifications Page](#page-13-notifications-page)
   - [14. Messaging / Chat Page (Optional)](#page-14-messaging--chat-page-optional)
   - [15. User Profile & Activity Page](#page-15-user-profile--activity-page)
4. [UI/UX Concepts to Apply](#4-uiux-concepts-to-apply)
5. [Figma Prototype Requirements](#5-figma-prototype-requirements)
6. [The Concepts Document](#6-the-concepts-document)
7. [Checklist Before Submission](#7-checklist-before-submission)
8. [Submission Instructions](#8-submission-instructions)

---

## 1. Objective

The goal of Milestone 1 is to produce a **fully interactive Figma prototype** that covers the entire user journey — from first landing on the platform to finding a study buddy and scheduling a session. The prototype must:

- Show **every screen** the user will interact with.
- Demonstrate **all transitions and interactions** between pages (clicking a button navigates to the right screen).
- Apply **UI/UX principles** (covered in labs) visibly and intentionally in every frame.
- Be accompanied by a **written document** that explains which UI/UX concept was applied on each page and why.

The Figma design will directly feed into Milestone 3, where you convert it to React code — so invest time in making it clean, consistent, and realistic.

---

## 2. What to Design — Page List

| # | Page Name | Required / Optional |
|---|---|---|
| 1 | Landing / Welcome Page | ✅ Required |
| 2 | Registration Page | ✅ Required |
| 3 | Login Page | ✅ Required |
| 4 | User Profile Setup Page | ✅ Required |
| 5 | Study Preferences Setup Page | ✅ Required |
| 6 | Availability Management Page | ✅ Required |
| 7 | Dashboard / Home Page | ✅ Required |
| 8 | Matching / Study Buddy Recommendation Page | ✅ Required |
| 9 | Match Details Page | ✅ Required |
| 10 | Buddy Requests / Connections Page | ✅ Required |
| 11 | Study Sessions Page | ✅ Required |
| 12 | Create Study Session Page | ✅ Required |
| 13 | Notifications Page | ✅ Required |
| 14 | Messaging / Chat Page | ⭐ Optional (Bonus) |
| 15 | User Profile & Activity Page | ✅ Required |

---

## 3. Page-by-Page Breakdown

For each page below you will find: **purpose**, **required content/components**, **key interactions**, and **UI/UX hints**.

---

### Page 1: Landing / Welcome Page

**Purpose:**
The first page a visitor sees. It must communicate what the platform does clearly and immediately, and funnel new users toward sign-up and existing users toward login.

**Required Content:**
- Platform name and logo.
- A short, compelling tagline (e.g., *"Find the perfect study partner — anytime, anywhere."*).
- Brief description of the platform's core features (2–4 bullet points or feature cards).
- A prominent **"Get Started"** / **"Sign Up"** call-to-action (CTA) button.
- A secondary **"Log In"** link for returning users.
- Optional: hero illustration or background image related to studying.

**Key Interactions:**
- "Get Started" / "Sign Up" → navigates to Registration Page.
- "Log In" → navigates to Login Page.
- Feature cards may be clickable to scroll to more detail (optional).

**UI/UX Concepts to highlight here:**
- **Visual Hierarchy** — the tagline and CTA must be the most prominent elements.
- **F-pattern / Z-pattern layout** — design the hero section so the eye naturally lands on the CTA.
- **Gestalt: Figure/Ground** — use contrast to separate the hero content from the background.
- **White space** — give breathing room; avoid cluttering the first impression.

---

### Page 2: Registration Page

**Purpose:**
Allow new students to create an account by entering their basic information.

**Required Fields:**
- Full Name
- Email Address
- Password
- Confirm Password
- University Name
- Academic Year (dropdown: Year 1–5 / Postgraduate)
- Contact Info (email or phone — for out-of-app communication if messaging is not implemented)
- "Sign Up" submit button
- Link: *"Already have an account? Log in"*

**Key Interactions:**
- Form validation states: empty field errors, mismatched passwords, invalid email format.
- Show/hide password toggle on password fields.
- On success → navigate to Profile Setup Page (or Dashboard).
- "Log in" link → navigates to Login Page.

**UI/UX Concepts to highlight here:**
- **Affordance** — input fields must look like input fields (borders, placeholders, labels above fields).
- **Error states** — red border + error message below the field.
- **Progressive Disclosure** — keep the form minimal; only ask for what's strictly necessary at registration.
- **Feedback** — show a loading spinner on the submit button while the request is processing.

---

### Page 3: Login Page

**Purpose:**
Allow returning users to authenticate.

**Required Fields:**
- Email Address
- Password (with show/hide toggle)
- "Log In" button
- "Forgot password?" link (design the screen; functionality not required in M1)
- Link: *"Don't have an account? Sign up"*

**Key Interactions:**
- Invalid credentials → show inline error message.
- Success → navigate to Dashboard.
- "Sign up" link → Registration Page.

**UI/UX Concepts to highlight here:**
- **Consistency** — same input field style as the Registration Page.
- **Error prevention** — email field should use `type="email"` keyboard on mobile.
- **Fitts's Law** — the login button must be large enough and centrally placed for easy clicking.

---

### Page 4: User Profile Setup Page

**Purpose:**
After registration, guide the user to complete their academic profile. This is part of the onboarding flow.

**Required Content:**
- Progress indicator (e.g., "Step 1 of 3: Profile Setup").
- Fields:
  - University (pre-filled from registration; editable)
  - Academic Year (pre-filled; editable)
  - Profile photo upload (optional but good for UX)
- **Courses section:**
  - Add a course by name and code (e.g., "Data Structures — CS201").
  - Display added courses as removable tags/chips.
- **Topics section:**
  - Add topics/subjects you need help with (e.g., "Binary Trees", "Recursion").
  - Display as removable tags/chips.
- "Next" button → navigates to Study Preferences Setup.
- "Skip for now" option.

**Key Interactions:**
- Typing a course name and pressing Enter or clicking "Add" appends it to the list.
- Clicking the ✕ on a chip removes it.
- "Next" → Study Preferences Setup Page.

**UI/UX Concepts to highlight here:**
- **Onboarding / Progressive Onboarding** — step-by-step flow with a visible progress bar.
- **Chunking** — group courses and topics into clearly separated card sections.
- **Immediate feedback** — chip appears instantly when a course/topic is added.
- **Empty state** — show a helpful placeholder (e.g., "No courses added yet — start by typing a course name above") when the list is empty.

---

### Page 5: Study Preferences Setup Page

**Purpose:**
Let the user declare how they prefer to study. This data feeds directly into the matching algorithm.

**Required Content:**
- Progress indicator (e.g., "Step 2 of 3: Study Preferences").
- Preference selectors for:

  | Preference | Options | Input Type Suggestion |
  |---|---|---|
  | **Study Pace** | Slow / Moderate / Fast | Segmented control / Radio cards |
  | **Study Mode** | Online / In-Person / Both | Segmented control / Radio cards |
  | **Preferred Group Size** | Solo / Small group (2–4) / Large group (5+) | Radio cards with icons |
  | **Study Style** | Writing notes / Listening / Discussing out loud / Studying quietly / Other | Multi-select chips or checkboxes |

- "Next" button → Availability Management Page.
- "Back" button → Profile Setup Page.

**Key Interactions:**
- Selected option visually highlighted (filled card, checkmark, or color change).
- Multiple study styles can be selected simultaneously.
- "Next" → Availability Page.

**UI/UX Concepts to highlight here:**
- **Mapping** — icons next to each option make choices self-explanatory (e.g., 🎧 for Listening, ✍️ for Writing Notes).
- **Radio card pattern** — large clickable cards are more touch-friendly and scannable than small radio buttons.
- **Visibility of system state** — the selected state must be unmistakably different from the unselected state.
- **Constraints** — for single-choice questions (pace, mode, group size), only one option can be active at a time.

---

### Page 6: Availability Management Page

**Purpose:**
Let users define the time slots during the week when they are available to study.

**Required Content:**
- Progress indicator (e.g., "Step 3 of 3: Availability") — if in onboarding flow.
- A **weekly grid or time-slot picker**:
  - Rows = days of the week (Monday–Sunday).
  - Columns or interactive elements = time ranges.
  - Users can click/drag to select blocks, or use an "Add Slot" form.
- "Add Slot" form (alternative to drag-select):
  - Day of week (dropdown)
  - Start time (time picker)
  - End time (time picker)
  - "Add" button
- List of added slots displayed below, each with a delete (🗑) button.
- Error state for overlapping slots.
- "Save & Continue" / "Finish Setup" button.

**Key Interactions:**
- Adding a slot → it appears in the weekly grid and in the list.
- Attempting to add an overlapping slot → inline error: *"This slot overlaps with an existing one."*
- Deleting a slot → it disappears from both the grid and the list (with a confirmation micro-interaction).
- "Finish Setup" → navigates to Dashboard.

**UI/UX Concepts to highlight here:**
- **Direct manipulation** — clicking/dragging on the weekly grid is more intuitive than filling a form.
- **Feedback & error prevention** — visually block or warn before an overlapping slot is committed.
- **Consistency** — use the same chip/card removal pattern as the profile setup page.
- **Spatial layout** — the weekly grid leverages users' existing mental model of a weekly calendar.

---

### Page 7: Dashboard / Home Page

**Purpose:**
The central hub of the application. After login, this is where the user lands. It gives a quick overview of all key activity.

**Required Sections/Widgets:**
- **Welcome message** — "Hello, [Name] 👋"
- **Quick Stats bar** — number of matches, upcoming sessions, unread notifications.
- **Recommended Study Buddies** — a horizontal scroll row showing 3–4 buddy cards (name, compatibility score %, shared courses badge). "See all" link → Matching Page.
- **Upcoming Study Sessions** — list of the next 1–3 sessions with date/time, topic, and type badge (online/in-person). "See all" link → Sessions Page.
- **Notifications preview** — the latest 2–3 notifications. "See all" link → Notifications Page.
- **Navigation bar** (sidebar or top/bottom nav) with links to: Dashboard, Matches, Sessions, Notifications, Profile.

**Key Interactions:**
- Clicking a buddy card → Match Details Page.
- Clicking a session card → Session Details (or Sessions Page).
- Clicking a notification → relevant page.
- Clicking nav items → respective pages.

**UI/UX Concepts to highlight here:**
- **Information Architecture** — the most important content (matches, sessions) must be immediately visible without scrolling.
- **Card pattern** — consistent card components for buddies, sessions, and notifications.
- **Visual Hierarchy** — welcome message large, stats bar secondary, content sections below.
- **Navigation — Recognition over Recall** — nav icons labeled with text so users never have to guess where to go.

---

### Page 8: Matching / Study Buddy Recommendation Page

**Purpose:**
Display the full list of study buddy recommendations for the logged-in user, ranked by compatibility score.

**Required Content:**
- Page title: "Recommended Study Buddies" or "Find a Study Buddy".
- **Filter / Sort bar**:
  - Filter by: shared course, study mode, availability day.
  - Sort by: compatibility score (default), name.
- **Match cards** (one per recommended user), each showing:
  - Avatar / initials
  - Name
  - University + Academic Year
  - Compatibility score (e.g., 85%) with a visual bar or ring.
  - Shared courses count (e.g., "3 shared courses")
  - Study mode badge (🌐 Online / 🏛 In-Person / Both)
  - "View Profile" button → Match Details Page.
  - "Send Request" button → sends a buddy request (shows confirmation state).
- Empty state: *"No matches found yet. Complete your profile and availability to get recommendations."*

**Key Interactions:**
- Clicking a filter → list updates (no page reload; animate the change).
- "View Profile" → Match Details Page.
- "Send Request" → button changes to "Request Sent ✓" (disabled).

**UI/UX Concepts to highlight here:**
- **Fitts's Law** — action buttons ("Send Request") must be prominent and easy to hit.
- **Progressive Disclosure** — show a summary on the card; full detail only on the details page.
- **Feedback** — the "Request Sent" state confirms the action without a modal.
- **Perceived performance** — use skeleton loading cards while the list loads.

---

### Page 9: Match Details Page

**Purpose:**
Show full information about a specific potential study buddy and their compatibility with the current user.

**Required Content:**
- Back button → Matching Page.
- Avatar, name, university, academic year, contact info.
- **Compatibility score** prominently displayed (e.g., large circular gauge at 78%).
- **Why you matched** section — list of match reasons:
  - Shared courses (listed with course codes)
  - Shared topics
  - Overlapping availability windows (day + time range)
  - Matching study preferences (pace, mode, style)
- **Shared Courses** section — list of course names/codes in common.
- **Overlapping Availability** section — visual mini-calendar highlighting shared free slots.
- **Study Preferences comparison** — side-by-side: "You" vs "Them" for each preference.
- "Send Buddy Request" button (or "Request Already Sent" if pending, "Connected ✓" if accepted).

**Key Interactions:**
- "Send Buddy Request" → button state changes to "Request Sent".
- Accepted buddies: show "Start Chat" button (→ Chat Page) or display contact info.

**UI/UX Concepts to highlight here:**
- **Comparison layout** — side-by-side "You vs Them" reduces cognitive load.
- **Data visualization** — compatibility score as a gauge/ring is more impactful than plain text.
- **Gestalt: Proximity** — group related info (shared courses together, availability together).
- **Transparency** — showing *why* they were matched builds trust in the algorithm.

---

### Page 10: Buddy Requests / Connections Page

**Purpose:**
Manage incoming buddy requests and view the list of accepted study partners.

**Required Content:**
- Two tabs or sections:
  1. **Pending Requests**:
     - **Incoming** — requests from other users, each with "Accept" / "Decline" buttons.
     - **Outgoing** — requests you sent, each with "Cancel" option.
  2. **My Connections** — list of accepted study partners with "View Profile" and "Start Chat" (optional) actions.
- Empty states for each tab.

**Key Interactions:**
- "Accept" → request moves to "My Connections", notification sent to requester.
- "Decline" → request removed.
- "Cancel" → outgoing request cancelled.
- "View Profile" → Match Details Page.

**UI/UX Concepts to highlight here:**
- **Tabbed navigation** — keeps pending requests and connections logically separated.
- **Inline actions** — Accept/Decline on the card itself avoids navigating away.
- **Status badges** — color-coded labels (yellow = pending, green = accepted, grey = declined) provide at-a-glance clarity.

---

### Page 11: Study Sessions Page

**Purpose:**
Show all study sessions the user has created or joined, categorized as upcoming or past.

**Required Content:**
- Two tabs: **Upcoming** and **Past**.
- Session cards showing:
  - Topic
  - Date & time
  - Duration
  - Session type badge: 🌐 Online / 🏛 In-Person
  - Number of participants (e.g., "3 / 5 participants")
  - Status badge: Scheduled / Cancelled / Completed
  - "View Details" or "Leave Session" action.
- Floating **"+ Create Session"** button (FAB) → Create Study Session Page.

**Key Interactions:**
- Tab switch animates between upcoming and past.
- "Leave Session" shows a confirmation dialog.
- "View Details" expands or navigates to session detail view.

**UI/UX Concepts to highlight here:**
- **Temporal grouping** — Upcoming / Past tabs match the user's natural mental model.
- **Status badges** — color coding (green = scheduled, red = cancelled, grey = completed).
- **FAB (Floating Action Button)** — the primary action "Create Session" is always accessible.

---

### Page 12: Create Study Session Page

**Purpose:**
A form that lets a user set up a new study session.

**Required Fields:**
- **Topic** — text input
- **Date** — date picker
- **Time** — time picker
- **Duration** — dropdown (30 min / 1 hr / 1.5 hr / 2 hr / Custom)
- **Session Type** — toggle: Online / In-Person
  - If **Online**: show a text field for a meeting link or contact info.
  - If **In-Person**: show a dropdown or map selector for a university study room.
- **Participants** — search and add users from your connections (tag input showing avatar + name chips).
- "Create Session" submit button.
- "Cancel" link → Sessions Page.

**Key Interactions:**
- Toggling between Online/In-Person dynamically shows/hides the relevant field.
- Typing a participant name shows a dropdown of matching connected users.
- Selecting a user adds their chip to the participants field.
- "Create Session" → success toast → redirects to Sessions Page.

**UI/UX Concepts to highlight here:**
- **Conditional / Dynamic forms** — only show fields relevant to the selected session type.
- **Inline search / autocomplete** — reduces friction when adding participants.
- **Confirmation feedback** — a success toast ("Session created! 🎉") confirms the action.
- **Error prevention** — disable "Create Session" if required fields (topic, date, time) are empty.

---

### Page 13: Notifications Page

**Purpose:**
A dedicated page (or expandable panel/dropdown) where users can see all system notifications.

**Required Content:**
- List of notifications, each showing:
  - Icon representing the notification type (🔗 match, 👤 buddy request, 📅 session, ⏰ reminder).
  - Short message (e.g., *"Ahmed matched with you — 82% compatibility"*).
  - Timestamp (relative: "2 hours ago").
  - Unread indicator — bold text or a colored left border.
- "Mark all as read" button.
- Empty state: *"You have no notifications yet."*

**Notification Types to design:**
| Type | Example message |
|---|---|
| New match found | *"You have a new study buddy match! Sara — 91% compatibility."* |
| Buddy request received | *"Mohamed sent you a buddy request."* |
| Session invitation | *"You were invited to a study session: Algorithms — Fri 14:00."* |
| Session reminder | *"Reminder: Your session starts in 1 hour."* |
| Buddy request accepted | *"Sara accepted your buddy request!"* |

**Key Interactions:**
- Clicking a notification → navigates to the relevant page (match details, session, etc.).
- "Mark all as read" → all unread indicators disappear.
- Individual notification can be dismissed (swipe or ✕ button).

**UI/UX Concepts to highlight here:**
- **Notification design patterns** — unread indicator (dot or bold), read/unread visual contrast.
- **Contextual navigation** — each notification is a link to the related context.
- **Gestalt: Similarity** — consistent icon + message + timestamp layout for all notifications.

---

### Page 14: Messaging / Chat Page *(Optional — Bonus)*

**Purpose:**
Allow matched users to send and receive messages within the platform.

**Required Content:**
- **Left panel**: conversation list showing each contact with avatar, last message preview, and unread message count badge.
- **Right panel / main area**: active conversation showing:
  - Message bubbles (sent = right-aligned, received = left-aligned).
  - Timestamps on messages.
  - Text input box with "Send" button.
  - Conversation header: contact name + avatar + online indicator.

**Key Interactions:**
- Clicking a conversation in the left panel loads it on the right.
- Sending a message appends it to the conversation immediately (optimistic UI).
- Unread count badge clears when the conversation is opened.

**UI/UX Concepts to highlight here:**
- **Familiar mental model** — mirror iMessage / WhatsApp layout so users need zero learning.
- **Optimistic UI** — message appears immediately before server confirmation.
- **Visual differentiation** — sent vs received bubbles must be clearly distinguishable by color and alignment.

---

### Page 15: User Profile & Activity Page

**Purpose:**
Let users view and edit their own profile, study preferences, and review past activity.

**Required Content:**
- Profile header: avatar, name, university, academic year, "Edit Profile" button.
- **Sections** (tab or accordion):
  1. **Personal Info** — name, email, contact info, university, year (all editable inline or via a modal).
  2. **Courses & Topics** — editable chip lists (same UI as Profile Setup).
  3. **Study Preferences** — editable preference selectors (same UI as Preferences Setup).
  4. **Availability** — link or inline section to view/edit slots (same UI as Availability Management).
  5. **Activity** — past sessions joined/created, connections made (read-only history list).
- "Save Changes" button when in edit mode.

**Key Interactions:**
- "Edit Profile" toggles the personal info fields from read-only to editable.
- "Save Changes" → success toast → return to read-only view.
- Activity section shows a chronological history feed.

**UI/UX Concepts to highlight here:**
- **Inline editing** — reduce navigation depth; users edit without leaving the page.
- **Section tabs / accordion** — prevent information overload by revealing one section at a time.
- **Consistency** — reuse the exact same chip, card, and preference selector components from earlier pages.

---

## 4. UI/UX Concepts to Apply

The following is a reference list of concepts covered in labs. You **must** apply these across your designs and reference them in the document.

### Layout & Visual Design
| Concept | Description |
|---|---|
| **Visual Hierarchy** | Size, weight, and color guide the eye to the most important elements first. |
| **White Space (Negative Space)** | Strategic empty space improves readability and reduces cognitive load. |
| **Grid System** | Use a consistent column grid (8pt or 12-column) for alignment. |
| **F-pattern / Z-pattern** | Structure landing pages so the eye naturally lands on the CTA. |
| **Color Theory** | Use a primary brand color, a neutral palette, and semantic colors (green = success, red = error). |
| **Typography Scale** | Define a clear type scale: H1, H2, H3, Body, Caption, Label. |

### Component & Interaction Design
| Concept | Description |
|---|---|
| **Affordance** | Elements must look like what they do (buttons look clickable, inputs look typeable). |
| **Feedback** | Every user action must produce visible system feedback. |
| **Constraints** | Prevent impossible actions (e.g., disable "Next" until required fields are filled). |
| **Mapping** | Spatial relationship between controls and their effects should be intuitive. |
| **Consistency & Standards** | Same components, same colors, same interaction patterns throughout. |
| **Error Prevention & Recovery** | Validate early, show clear errors, offer recovery paths. |

### Information Architecture
| Concept | Description |
|---|---|
| **Progressive Disclosure** | Show only what's needed; reveal more on demand. |
| **Chunking** | Group related information into digestible sections. |
| **Recognition over Recall** | Use labels, icons, and visual cues so users don't have to remember. |
| **Empty States** | Every list must have a designed empty state — not just a blank space. |

### Gestalt Principles
| Principle | How to apply |
|---|---|
| **Proximity** | Group related elements close together. |
| **Similarity** | Cards, buttons, and labels of the same type should look the same. |
| **Figure/Ground** | Important content must pop against a clear background. |
| **Continuity** | Guide the eye through a page in a natural flow. |

### Mobile & Responsive Considerations
- Design for **web desktop** as primary, but consider how critical pages (Dashboard, Notifications, Chat) would look on mobile.
- Use **Fitts's Law** — touch targets should be at least 44×44px.
- Avoid hover-only interactions for actions that must work on touch devices.

---

## 5. Figma Prototype Requirements

### File Organization
```
Figma Project
│
├── 📄 Cover Page (project title, team names, date)
│
├── 🗂 Design System / Component Library
│   ├── Colors
│   ├── Typography
│   ├── Spacing scale
│   ├── Button variants (primary, secondary, disabled, loading)
│   ├── Input field variants (default, focused, error, filled)
│   ├── Card component
│   ├── Badge / Chip component
│   ├── Navigation bar
│   └── Icons
│
├── 🗂 Onboarding Flow
│   ├── Landing Page
│   ├── Registration
│   ├── Login
│   ├── Profile Setup
│   ├── Preferences Setup
│   └── Availability Setup
│
├── 🗂 Main App
│   ├── Dashboard
│   ├── Matching Page
│   ├── Match Details
│   ├── Buddy Requests & Connections
│   ├── Study Sessions
│   ├── Create Session
│   ├── Notifications
│   └── User Profile & Activity
│
└── 🗂 Bonus
    └── Messaging / Chat
```

### Prototype Interactions
Every page must be linked so that clicking buttons/links navigates to the correct frame. At minimum, the following flows must be fully connected:

1. **Onboarding flow:** Landing → Register → Profile Setup → Preferences → Availability → Dashboard.
2. **Matching flow:** Dashboard → Matching Page → Match Details → Send Request → Buddy Connections.
3. **Session flow:** Dashboard → Sessions Page → Create Session → Sessions Page (confirmation).
4. **Notification flow:** Dashboard → Notifications Page → click notification → relevant page.
5. **Profile edit flow:** Dashboard → Profile Page → Edit → Save → Profile Page.

### Design System Rules
- Define and use **Figma components** for all reusable elements (buttons, cards, inputs, nav bar).
- Use **auto layout** on all cards and form sections for easy resizing.
- Use **variants** for button states: default, hover, active, disabled, loading.
- Use **consistent spacing** based on an 8pt grid.
- Maintain a **styles panel** with named colors and text styles.

---

## 6. The Concepts Document

Along with the Figma file, you must submit a **written document** (PDF or Google Doc) that:

- Has one section per page (15 sections minimum).
- For each page, lists and briefly explains:
  1. Which UI/UX concepts were applied.
  2. Why that concept was chosen for that specific context.
  3. How it improves usability or user experience.

**Example entry:**

> **Page 8 — Matching / Study Buddy Recommendation Page**
>
> - **Progressive Disclosure:** Only a summary (name, score, shared courses) is shown on the card. Full details are behind "View Profile" to avoid overwhelming the user with information.
> - **Feedback:** The "Send Request" button changes to "Request Sent ✓" immediately, confirming the action without requiring a full-page reload.
> - **Perceived Performance:** Skeleton loading cards are shown while the list fetches, preventing a jarring blank-screen state.
> - **Fitts's Law:** The "Send Request" button is wide and clearly separated from "View Profile" to avoid accidental taps on mobile.

---

## 7. Checklist Before Submission

Use this list to verify your Figma file is complete before submitting.

### Pages
- [ ] Landing / Welcome Page ✅
- [ ] Registration Page ✅
- [ ] Login Page ✅
- [ ] User Profile Setup Page ✅
- [ ] Study Preferences Setup Page ✅
- [ ] Availability Management Page ✅
- [ ] Dashboard / Home Page ✅
- [ ] Matching Page ✅
- [ ] Match Details Page ✅
- [ ] Buddy Requests / Connections Page ✅
- [ ] Study Sessions Page ✅
- [ ] Create Study Session Page ✅
- [ ] Notifications Page ✅
- [ ] User Profile & Activity Page ✅
- [ ] Messaging / Chat Page (if doing bonus) ⭐

### Prototype
- [ ] All CTA buttons are linked to the correct frames.
- [ ] Back buttons work.
- [ ] Onboarding flow is fully connected (Landing → … → Dashboard).
- [ ] Matching flow is fully connected.
- [ ] Session creation flow is fully connected.

### Design Quality
- [ ] A component library / design system page exists.
- [ ] All reusable elements are Figma components.
- [ ] Auto layout is used on cards and form sections.
- [ ] Button states (default, disabled, loading) are designed.
- [ ] Input field states (default, focused, error) are designed.
- [ ] Empty states are designed for all lists.
- [ ] Error states are designed for all forms.
- [ ] Spacing is consistent (8pt grid).

### Document
- [ ] One section per page.
- [ ] At least 2–3 UI/UX concepts explained per page.
- [ ] Explanations include *why* the concept was chosen, not just naming it.

---

## 8. Submission Instructions

1. Make sure your Figma file is set to **"Anyone with the link can view"**.
2. Copy the Figma prototype share link (the blue **"Share"** button → **"Copy link"**).
3. Upload the concepts document to Google Drive and ensure it is publicly accessible.
4. Place both links in a single Google Drive folder.
5. Submit the Drive folder link via the provided **Google Form** before **17 March 2026 at 11:59 PM**.

> ⚠️ Late submissions will not be accepted. Make sure all links are accessible before submitting — a broken link is treated as a missing submission.
