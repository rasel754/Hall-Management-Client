# Hall Management Client

A comprehensive dashboard application for managing hall residence operations, designed to streamline administrative tasks and enhance the student experience. Built with modern web technologies for performance and scalability.

## 🚀 Features

- **Authentication System**: Secure login and registration functionality for both Students and Administrators.
- **Admin Dashboard**: 
  - Manage students, rooms, and seat allocations.
  - Post and manage notices.
  - Overview of hall operations.
- **Student Portal**:
  - View seat status.
  - Cancel seat bookings.
  - View notices and hall updates.
- **Modern UI/UX**:
  - Fully responsive design using Tailwind CSS.
  - Accessible and beautiful components via Shadcn UI.
  - Smooth animations with Framer Motion.

## 🛠️ Tech Stack

- **Frontend Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Charts**: [Recharts](https://recharts.org/)
- **HTTP Client**: Axios

## 📦 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <YOUR_GIT_URL>
    cd hall-management-client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    npm i
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the application:**
    Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## 📜 Available Scripts

- `npm run dev`: Starts the development server with hot module replacement.
- `npm run build`: builds the app for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Locally previews the production build.

## 📂 Project Structure

```
hall-management-client/
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Application views (Admin, Student, Auth)
│   ├── services/     # API services and axios configuration
│   ├── store/        # Global state management (Zustand)
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions and library configurations
│   ├── data/         # Static data or constants
│   ├── App.tsx       # Main application component
│   └── main.tsx      # Entry point
├── public/           # Static assets
└── ...config files   # (vite, tailwind, tsconfig, etc.)
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](<YOUR_ISSUES_URL>).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
