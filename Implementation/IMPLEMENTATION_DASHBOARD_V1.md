# Implementation Plan: Supabase & Dashboard Core [PHASE 1]

This plan covers the foundational setup for the Supabase backend and the architectural dashboard system for `session-bookr`.

## 1. Objectives
- Establish a secure, role-based backend using Supabase.
- Implement a premium, high-performance UI for Admin and Client dashboards.
- Align with the "Modern Clinical Luxury" aesthetic.

## 2. Technical Stack
- **Backend**: Supabase (Auth, PostgreSQL, RLS, Edge Functions).
- **Frontend**: React (Vite), Tailwind CSS, Shadcn UI, Sonner (toasts).
- **Routing**: `react-router-dom` (nested dashboard routes).

## 3. Detailed Task Breakdown

### Milestone 1: Supabase & Auth Foundation
- [ ] **Infrastructure**:
    - Link project to Supabase.
    - Add `.env.local` keys (URL, Anon Key).
- [ ] **Authentication**:
    - Configure Google & Email providers in Supabase.
    - Create `AuthProvider` and `useAuth` hook.
    - Implement `/auth/login` and `/auth/signup` pages.

### Milestone 2: Schema & RLS
- [ ] **Core Tables**:
    - `profiles`: Manage roles (`user`, `client`, `admin`) and status.
    - `locations`: Studios management.
    - `categories` & `treatment_types`: Services list.
- [ ] **RLS Policies**:
    - Users can only read/write their own `profiles`.
    - Admins have full access to all tables.
    - Clients can read their own `bookings`.
- [ ] **Edge Functions (Optional for Phase 1)**:
    - Auto-upgrade `user` to `client` on first booking.

### Milestone 3: Dashboard Architecture
- [ ] **Layout System**:
    - `SidebarLayout`: Architectural collapsible sidebar.
    - `TopNav`: Breadcrumbs and user profile menu.
- [ ] **Admin Dashboard UI**:
    - `Overview`: Key metrics cards (using Shadcn).
    - `Bookings`: Filterable data table.
- [ ] **Client Dashboard UI**:
    - `Overview`: Next session countdown card.
    - `History`: Booking list.

## 4. UI/UX Refinements
- **Palette**: Warm Ivory background, Muted Rose accent, Espresso text.
- **Glassmorphism**: Use `bg-white/10 backdrop-blur-md` for panels.
- **Animations**: Framer Motion for sidebar transitions and content fade-ins.
- **Toasts**: Sonner configured to `top-left`.

## 5. Verification Plan
- [ ] **Auth Check**: Successful login/logout and session persistence.
- [ ] **Role RLS**: Attempting to access `/admin` as a `user` should redirect to `/client/dashboard` or 403.
- [ ] **Data Fetching**: Verify `treatment_types` load from Supabase into the admin list.

---
**Branch**: `feat/dashboard-supabase-integration`
**GitHub Issue**: #3
