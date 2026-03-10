# SETL Frontend

A modern React frontend built with Vite, Tailwind CSS v4, and following the standards in `FRONTEND_STANDARDS.md`.

## Color Theme

- **Primary**: White (`#ffffff`) - Backgrounds, cards
- **Secondary**: Black (`#000000`) - Text, primary buttons
- **Tertiary**: Purple (`#7c3aed`) - Accents, CTAs, focus rings

## Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS v4** with custom theme
- **React Hook Form** + **Zod** for forms
- **Zustand** for state management
- **Axios** for API calls
- **Sonner** for toast notifications
- **React Router v6**

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run lint
npm run lint
```

## Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

## Project Structure

```
src/
├── components/        # ErrorBoundary, ProtectedRoute, layout/
│   ├── layout/        # Layout, PageLayout
│   └── ui/            # Badge, Button, Dialog, FormField, Input, Loader, Select, Skeleton, Textarea
├── features/          # Feature modules (home, not-found)
├── hooks/             # useDialogForm, useApiAction, useDataFetch
├── lib/               # styles, formUtils, api, toastMessages, constants, validationSchemas,
│                      # roleUtils, badgeUtils, userUtils, agentUtils, cn
├── services/          # API services (exampleService template)
├── stores/            # authStore (Zustand)
├── App.jsx
└── main.jsx
```

## Features

- **Error Boundary** – Catches React errors and shows fallback UI
- **404 Page** – Custom not-found page with home link
- **Protected Routes** – `ProtectedRoute` wrapper for auth-required routes
- **Loader & Skeleton** – Loading state components
- **Layout & PageLayout** – Base layout and page structure components
- **Pre-commit hooks** – Husky + lint-staged run ESLint on staged files

## Standards

See `FRONTEND_STANDARDS.md` for coding standards, component patterns, form handling, and best practices.
