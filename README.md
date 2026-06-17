# 🏛️ University Hall Management System — Client

A SaaS-grade administrative dashboard and student residence portal for orchestrating real-time housing allocations, approvals, billing, and complaints.

[![React Version](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Vercel Deployment Status](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white)](https://hall-mangement-client.vercel.app)

<p align="center">
  <strong>
    <a href="https://hall-mangement-client.vercel.app">Live Demo</a> •
    <a href="https://github.com/[your-username]/hall-management-client/issues">Report Bug</a> •
    <a href="https://github.com/[your-username]/hall-management-client/issues">Request Feature</a>
  </strong>
</p>

---

## 🖼️ Overview Screenshot

![Dashboard Preview](./screenshots/dashboard-preview.png)
*The primary operations panel for hall administration, displaying a comprehensive summary of active occupancies, room statuses, and action items. Real-time data sync allows administrators to track student residency metrics and quickly clear pending approval pipelines. The interface uses custom Recharts visualizations for occupancy breakdowns alongside status badges for student complaints.*

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
  - [Student Portal](#-student-portal)
  - [Admin Control Panel](#-admin-control-panel)
  - [Platform-Wide](#-platform-wide)
- [Tech Stack Table](#-tech-stack-table)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation Steps](#installation-steps)
  - [Quick Start with Demo](#quick-start-with-demo)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Screenshots Section](#-screenshots-section)
- [Role-Based Access Control](#-role-based-access-control)
- [Key Technical Decisions](#-key-technical-decisions)
- [Performance & UX](#-performance--ux)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact / Author](#-contact--author)
- [Acknowledgements](#-acknowledgements)

---

## 🏛️ Project Overview

The University Hall Management System Client is a SaaS-grade web dashboard engineered to streamline campus housing administration and improve the residential life experience. Tailored for university administrators and resident students, the platform centralizes room allocations, fee payments, notice broadcasts, and facility maintenance complaints under a single, synchronized hub. Built using production-ready frontend architecture, this application replaces traditional, error-prone manual spreadsheets with automated validation workflows and secure role-based access. By reducing request processing latency and administrative overhead, the platform ensures operational transparency and high service availability for campus residences.

---

## ✨ Key Features

### 🎓 Student Portal

- **My Room Residency Dashboard** — Access detailed occupancy records including block name, room type, monthly rate, and roommate profiles.
- **Seat Booking Request** — Browse available hall sections, select vacancy options, and submit booking requests with instant pending indicators.
- **Clearance & Seat Cancellation** — Request room evacuation clearance and seat release through an administrative processing pipeline.
- **Maintenance Complaint Submission** — File boarding or infrastructure complaints with category selections, descriptions, and dynamic status tracking.
- **Hall Notice Board** — Read official announcements, emergency guidelines, and campus updates published by the administration.
- **Secure Online Billing** — View monthly fee breakdowns, outstanding dues, and historical payment transactions in a single ledger view.
- **Profile Settings Panel** — Customize contact details, upload profile photos, and change login credentials securely.

### 🛠️ Admin Control Panel

- **Central Overview Dashboard** — Review high-level occupancy metrics, total capacity statistics, and outstanding student request volume.
- **Residency Approval Pipeline** — Process student room booking and clearance requests with one-click approve/reject actions.
- **Resident Student Directory** — Manage registered students, search residential databases, and audit personal information files.
- **Hall Infrastructure Configuration** — Create, edit, or remove hall blocks, room pricing parameters, and seat numbers.
- **Dynamic Vacancy Monitor** — View a structural breakdown of rooms to track empty, partially filled, and fully occupied capacity.
- **Official Notice Broadcast** — Compose and publish global markdown announcements that propagate instantly to student dashboards.
- **Complaints Resolution Console** — Filter reported issues by severity, update repair progress statuses, and archive resolved entries.
- **Security Access Control** — Block or unblock problematic student profiles to restrict portal access during disciplinary holds.
- **Data-Driven Charts** — Analyze monthly occupancy trends, financial collection histories, and complaint patterns via interactive Recharts.

### ✨ Platform-Wide

- **Adaptive Theme System** — Switch seamlessly between light and dark mode styles with persistent localStorage caching.
- **Fluid Layout Responsiveness** — Access the application on mobile, tablet, or desktop viewports via a flexible CSS grid system.
- **Visual Skeleton Loaders** — Reduce perceived load times using Radix-based skeleton placeholders during server operations.
- **Micro-interactions & Transitions** — Experience smooth route animations and interactive elements powered by Framer Motion.
- **Strict Route Guards** — Prevent unauthorized URL access using role-based routing components that inspect JWT structures.

---

## 📊 Tech Stack Table

| Category | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Core Framework** | React | `18.3.1` | Component-based library for building user interfaces. |
| **Build Tool** | Vite | `5.4.19` | Fast build tool and development server with Hot Module Replacement. |
| **Language** | TypeScript | `5.8.3` | Typed superset of JavaScript for compiler-level safety. |
| **Styling** | Tailwind CSS | `3.4.17` | Utility-first CSS framework for rapid UI styling. |
| **Component Library** | Shadcn UI (Radix UI) | `Latest` | Unstyled, accessible primitives for consistent styling. |
| **State Management** | Zustand | `5.0.8` | Lightweight, client-side global state management. |
| **Server State** | TanStack Query v5 | `5.83.0` | Server state management, caching, and automatic refetching. |
| **Routing** | React Router DOM v6 | `6.30.1` | Client-side routing and layout-based route guarding. |
| **Forms & Validation** | React Hook Form | `7.61.1` | Performance-focused form state handling. |
| **Schema Validation** | Zod | `3.25.76` | Type-safe schema validation for form submissions. |
| **Animations** | Framer Motion | `12.23.24` | Fluid animations and page transition management. |
| **Charts** | Recharts | `2.15.4` | Declarative, SVG-based chart library for visual analytics. |
| **HTTP Client** | Axios | `1.13.2` | Promise-based HTTP client for API requests with request interceptors. |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your local machine:
- **Node.js** (v18 or higher recommended)
- **npm** (or yarn / pnpm)
- **Git**

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/[your-username]/hall-management-client.git
   ```

2. **Navigate into the directory:**
   ```bash
   cd hall-management-client
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Environment Setup:**
   Create a `.env` file in the root directory and copy the variables from `.env.example`:
   ```env
   VITE_API_BASE_URL=https://your-backend-url.com
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open the application:**
   Launch your browser and navigate to `http://localhost:5173`.

### Quick Start with Demo

You can test the system locally or at the live URL immediately using these pre-configured credentials:

```text
Student Portal:
  Email:    john.doe@example.com
  Password: password123

Admin Control Panel:
  Email:    admin@example.com
  Password: adminpassword123
```

> **Note:** These credentials can be used directly on the [Live Demo URL](https://hall-mangement-client.vercel.app) without configuring any local databases or backend services.

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── ui/              # Shadcn UI primitives
│   ├── common/          # Shared: StatCard, DataTable, StatusBadge, etc.
│   └── layout/          # Sidebar, Navbar, PageHeader, Footer
├── pages/
│   ├── auth/            # Login, Register
│   ├── student/         # All student dashboard pages
│   ├── admin/           # All admin dashboard pages
│   └── public/          # Landing, About, Contact, Blog, Help
├── hooks/               # useAuth, useRoomBooking, useComplaints, etc.
├── services/            # Axios instances + all API call functions
├── store/               # Zustand slices: authStore, uiStore
├── lib/                 # Utility functions, cn() helper
├── types/               # Global TypeScript interfaces
├── App.tsx
└── main.tsx
```

---

## ⚙️ Environment Variables

| Variable | Required | Description | Example Value |
| :--- | :---: | :--- | :--- |
| `VITE_API_BASE_URL` | Yes | Base URL endpoint for REST API service communications. | `https://hall-management-server-three.vercel.app` |

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local development server with hot module replacement (HMR). |
| `npm run build` | Compiles the production-ready build outputs into the `dist` folder. |
| `npm run preview` | Runs a local preview server for the compiled production builds. |
| `npm run lint` | Inspects the source code using ESLint configurations to enforce code quality. |
| `npm run type-check` | Runs the TypeScript compiler (`tsc`) in no-emit mode to validate system typing. |

---

## 📸 Screenshots Section

| ![Landing Page Hero](./screenshots/landing-page-hero.png) | ![Student Dashboard Overview](./screenshots/student-dashboard.png) |
| :---: | :---: |
| *Landing Page Hero - A clean, welcoming landing page explaining hall facilities.* | *Student Dashboard Overview - View of student profile, assigned room, and announcements.* |
| ![Room Booking Page](./screenshots/room-booking.png) | ![Admin Analytics Page](./screenshots/admin-analytics.png) |
| :---: | :---: |
| *Room Booking Page - Dynamic room selection and real-time seat availability view.* | *Admin Analytics Page - Operations overview with Recharts tracking occupancy rates.* |
| ![Complaints Management](./screenshots/complaints-management.png) | ![Mobile Responsive View](./screenshots/mobile-responsive.png) |
| :---: | :---: |
| *Complaints Management - Administrative console to process, assign, and update complaints.* | *Mobile Responsive View - Sidebar navigation and data grids optimized for mobile viewports.* |

---

## 🛡️ Role-Based Access Control

The application uses an automated client-side routing guard architecture built on top of React Router DOM v6. When a user requests a route, the system checks their active authentication token and decodes their role parameter. If the user is unauthenticated, they are immediately redirected to the public login screen. Users with valid authentication tokens are then audited against role-specific layout paths, preventing students from accessing administrator control centers and vice versa.

```text
User visits URL
     │
     ▼
Is Authenticated?
  No  → Redirect to /login
  Yes → Check Role
          ├── student → Student Dashboard Routes
          └── admin  → Admin Dashboard Routes
```

---

## 💡 Key Technical Decisions

- **TanStack Query over Redux**: Chose TanStack Query for server state to eliminate boilerplate while gaining automatic caching, background refetching, and optimistic updates out of the box.
- **Zustand for Client-Side Global State**: Opted for Zustand to manage UI toggles, authentication sessions, and theme preferences due to its minimal API footprint, excellent TypeScript support, and zero-boilerplate architecture compared to traditional Redux.
- **React Hook Form + Zod for Forms**: Utilized React Hook Form alongside Zod schemas to handle form state and client-side validation efficiently, reducing re-renders on inputs and ensuring structural type safety.
- **Shadcn UI + Radix Primitives for Consistent UX**: Selected Shadcn UI to construct the interface using accessible, unstyled Radix primitives, allowing rapid customized styling while maintaining complete keyboard navigation and screen reader support.
- **TypeScript for Compile-Time Integrity**: Implemented strict TypeScript typings across the client application to capture data integration bugs early, enforce API contracts, and enable reliable IDE autocompletion for complex data shapes.

---

## ⚡ Performance & UX

- **Route-level code splitting with React.lazy() + Suspense** — Reduces the initial JS bundle size and decreases First Contentful Paint times.
- **Debounced search inputs (300ms) to reduce API calls** — Lowers network overhead during high-frequency searching of student directories.
- **TanStack Query caching with stale-while-revalidate strategy** — Retains stale data on screen while fetching fresh data in the background for instant navigation feedback.
- **Skeleton loaders on all data-fetching states (no layout shift)** — Avoids annoying Cumulative Layout Shifts during asynchronous REST actions.
- **Image lazy loading on all room and profile images** — Defers non-critical image assets until they cross the viewport boundary.
- **Framer Motion reduced-motion detection for accessibility** — Detects OS-level accessibility flags to disable potentially disorienting motion effects.

---

## 🗺️ Roadmap

- [x] Dual-role authentication system
- [x] Student booking workflow
- [x] Admin approval pipeline
- [x] Analytics dashboard with charts
- [x] Dark / Light mode
- [x] Fully responsive design
- [ ] Push notification system
- [ ] Payment gateway integration (SSLCommerz / Stripe)
- [ ] Exportable PDF/Excel reports
- [ ] Mobile app (React Native)
- [ ] Real-time updates via WebSocket

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. To contribute, fork the repository, create a branch named after your feature (`feature/your-feature-name`), commit changes following the conventional commits standard, and open a Pull Request. Please ensure your code conforms to the local linting parameters and passes all TypeScript compile checks before submitting the PR.

```bash
git checkout -b feature/your-feature-name
```

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.

---

## ✉️ Contact / Author

| Contact Channel | Destination Link |
| :--- | :--- |
| **Author** | Rasel |
| **Portfolio** | [your-portfolio-link](https://your-portfolio-link) |
| **LinkedIn** | [your-linkedin-url](https://your-linkedin-url) |
| **Email** | [your-email](mailto:your-email) |
| **GitHub** | [rasel754](https://github.com/rasel754) |

---

## 🎁 Acknowledgements

- [React](https://react.dev/) — User interface library
- [Shadcn UI](https://ui.shadcn.com/) — High-quality, accessible UI component primitives
- [TanStack Query](https://tanstack.com/) — Powerful async state management
- [Framer Motion](https://www.framer.com/motion/) — Interactive animation library
- [Recharts](https://recharts.org/) — SVG chart layouts
