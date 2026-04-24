# Implementation Plan: Supabase & Dashboard Core [PHASE 1] - REVISED

This plan covers the foundational setup for the Supabase backend and the authentication system for `session-bookr`, prioritized by database schema and role-based access.

## 1. Objectives
- Establish a secure, role-based backend using Supabase.
- Implement a premium, high-performance UI for Admin and Client dashboards.
- Align with the "Modern Clinical Luxury" aesthetic.
- Verify role-based navigation and authentication flow.

## 2. Technical Stack
- **Backend**: Supabase (Auth, PostgreSQL, RLS, Edge Functions).
- **Frontend**: React (Vite), Tailwind CSS, Shadcn UI, Sonner (toasts).
- **Routing**: `react-router-dom` (nested dashboard routes and protected routes).

## 3. Detailed Task Breakdown

### Milestone 1: Database Schema & RLS (Backend First)
- [ ] **Infrastructure**:
    - Link project to Supabase.
    - Add `.env.local` keys (URL, Anon Key).
- [ ] **Core Tables**:
    - `profiles`: Manage `id`, `email`, `role` (`user`, `client`, `admin`), and `status`.
    - `locations`: Studios management.
    - `categories` & `treatment_types`: Services list.
- [ ] **RLS Policies**:
    - Users can only read/write their own `profiles`.
    - Admins have full access to all tables.
    - Setup trigger to create `profile` on auth signup.

### Milestone 2: Authentication Implementation
- [ ] **Auth Context**:
    - Create `AuthProvider` and `useAuth` hook powered by Supabase Auth.
- [ ] **UI Implementation**:
    - Implement `/auth/login` and `/auth/signup` pages following the "Modern Clinical Luxury" aesthetic.
    - Add validation and error handling with Sonner toasts.

### Milestone 3: Role-Based Access & Mock Dashboards
- [ ] **Protected Routing**:
    - Implement `ProtectedRoute` component that checks for session and role.
- [ ] **Mock Dashboards**:
    - `MockAdminDashboard`: A simplified view for `/admin/dashboard` to verify admin access.
    - `MockUserDashboard`: A simplified view for `/client/dashboard` to verify client/user access.
- [ ] **Verification**:
    - Manually promote a user to `admin` in Supabase dashboard.
    - Test signup flow -> automatic `user` role.
    - Test login -> redirect based on role.

## 4. UI/UX Refinements
- **Palette**: Warm Ivory background, Muted Rose accent, Espresso text.
- **Glassmorphism**: Use `bg-white/10 backdrop-blur-md` for panels.
- **Animations**: Framer Motion for content fade-ins and state transitions.

## 5. Verification Plan
- [ ] **Auth Check**: Successful login/logout and session persistence.
- [ ] **Role RLS**: Attempting to access `/admin` as a `user` should redirect or show 403.
- [ ] **Data Integrity**: Verify that signup creates a corresponding entry in the `profiles` table.

---
**Branch**: `feat/dashboard-supabase-integration`
**GitHub Issue**: #1
