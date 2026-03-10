# AGC Frontend Development Standards

> Complete coding standards and best practices for the AGC Frontend project

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Naming Conventions](#naming-conventions)
3. [Component Standards](#component-standards)
4. [Reusable Components & Hooks](#reusable-components--hooks)
5. [Form Handling](#form-handling)
6. [API & Services](#api--services)
7. [State Management](#state-management)
8. [Styling Guidelines](#styling-guidelines)
9. [Error Handling](#error-handling)
10. [Quick Reference](#quick-reference)

---

## Project Structure

### Feature Module Structure

```
features/[feature-name]/
├── [FeatureName]Page.jsx       # Main page
├── index.js                     # Exports
├── components/                  # Feature components
│   ├── Create[Entity]Dialog.jsx
│   └── Edit[Entity]Dialog.jsx
├── hooks/                       # Feature hooks
│   └── use[Feature]Form.js
└── schemas/                     # Validation schemas
    └── create[Entity]Schema.js
```

---

## Naming Conventions

### Files

```
Components:     UserProfile.jsx, CreateCompanyDialog.jsx
Hooks:          useAuthForm.js, useApiAction.js
Utilities:      formUtils.js, dateHelpers.js
Services:       entityService.js, authService.js
Schemas:        createUserSchema.js, loginSchema.js
```

### Variables & Functions

```javascript
// Variables (camelCase)
const userName = "John";
const isLoading = false;

// Boolean variables (prefix: is/has/should/can)
const isActive = true;
const hasPermission = false;

// Functions (camelCase, verb first)
function fetchUsers() { }
function handleSubmit() { }

// Constants (SCREAMING_SNAKE_CASE)
const MAX_RETRIES = 3;
const API_BASE_URL = "...";
```

---

## Component Standards

### Component Structure Order

```jsx
// 1. Imports
import { useState, useEffect } from "react";
import { toast } from "sonner";

// 2. Constants
const DEFAULT_VALUES = { name: "" };

// 3. Component
export function MyComponent({ prop1, prop2 }) {
  // 3a. Hooks (state, context, custom)
  const [state, setState] = useState(null);
  const { user } = useAuthStore();
  
  // 3b. Derived state
  const canEdit = user?.role === "admin";
  
  // 3c. Effects
  useEffect(() => {
    // Logic
  }, [deps]);
  
  // 3d. Event handlers
  const handleSubmit = async (data) => {
    // Logic
  };
  
  // 3e. Early returns
  if (isLoading) return <Loader />;
  
  // 3f. Render
  return <div>{/* JSX */}</div>;
}
```

### Component Documentation

Add JSDoc comments for reusable components:

```jsx
/**
 * UserCard - Displays user information
 * 
 * @param {Object} props
 * @param {Object} props.user - User object
 * @param {boolean} [props.showActions=false] - Show action buttons
 * @param {() => void} [props.onEdit] - Edit callback
 */
export function UserCard({ user, showActions = false, onEdit }) {
  // Component logic
}
```

---

## Reusable Components & Hooks

### Available Utilities

```javascript
// Styles
import { SELECT_CLASS, INPUT_CLASS, TEXTAREA_CLASS } from "@/lib/styles";

// Components
import { FormField } from "@/components/ui/FormField";
import { FormErrorMessage } from "@/components/ui/FormErrorMessage";
import { DialogFormFooter } from "@/components/ui/DialogFormFooter";

// Hooks
import { useDialogForm } from "@/hooks/useDialogForm";
import { useApiAction } from "@/hooks/useApiAction";
import { useDataFetch } from "@/hooks/useDataFetch";

// Utilities
import { trimFormData, toTitleCase } from "@/lib/formUtils";
import { SUCCESS, ERROR, WARNING } from "@/lib/toastMessages";

// Constants
import { AGENT_TYPES, ENTITY_STATUS, LANGUAGES } from "@/lib/constants";
import { isUserAdmin, getUserPrimaryRole } from "@/lib/roleUtils";
import { getAgentTypeLabel, formatPrice } from "@/lib/agentUtils";
import { getStatusBadgeVariant } from "@/lib/badgeUtils";
import { getUserEntityId, getUserDisplayName } from "@/lib/userUtils";
import { emailSchema, passwordSchema } from "@/lib/validationSchemas";
```

### Using FormField

```jsx
<FormField 
  label="Email" 
  required 
  error={errors.email} 
  id="email"
  hint="We'll never share your email"
>
  <Input type="email" {...register("email")} />
</FormField>
```

### Using DialogFormFooter

```jsx
<DialogFormFooter 
  onCancel={() => onOpenChange(false)}
  submitText="Create"
  isLoading={isSubmitting}
/>
```

### Using useDialogForm Hook

```jsx
const form = useDialogForm({
  open,
  defaultValues: { name: "", email: "" },
  resolver: zodResolver(createUserSchema),
});

// For edit dialogs:
const form = useDialogForm({
  open,
  defaultValues: { name: "", email: "" },
  initialData: user, // Populates when dialog opens
  resolver: zodResolver(updateUserSchema),
});
```

### Using useApiAction Hook

```jsx
const { execute: createCompany, isLoading } = useApiAction(
  (data) => createEntity(data),
  "Company created successfully.",
  "Failed to create company."
);

const handleSubmit = async (data) => {
  try {
    await createCompany(data);
    onSuccess?.();
  } catch (err) {
    // Error already handled by hook
  }
};
```

---

## Form Handling

### Always Use React Hook Form + Zod

```jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

function MyForm() {
  const form = useForm({
    defaultValues: { name: "", email: "" },
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });
  
  const onSubmit = async (data) => {
    // Handle submission
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

### Form Data Cleaning

```jsx
import { trimFormData } from "@/lib/formUtils";

const onSubmit = async (data) => {
  const cleaned = trimFormData(data);
  await createEntity(cleaned);
};
```

---

## API & Services

### Service Structure

```javascript
// src/services/entityService.js
import api from "@/lib/api";

export const listEntities = async (params = {}) => {
  const response = await api.get("/entities", { params });
  return response.data;
};

export const getEntityById = async (id) => {
  const response = await api.get(`/entities/${id}`);
  return response.data;
};

export const createEntity = async (body) => {
  const response = await api.post("/entities", body);
  return response.data;
};

export const updateEntity = async (id, body) => {
  const response = await api.put(`/entities/${id}`, body);
  return response.data;
};

export const deleteEntity = async (id) => {
  const response = await api.delete(`/entities/${id}`);
  return response.data;
};
```

### Error Handling

```javascript
import { toast } from "sonner";
import { ERROR, SUCCESS } from "@/lib/toastMessages";

try {
  await updateEntity(id, data);
  toast.success(SUCCESS.UPDATE("Company"));
} catch (err) {
  toast.error(err?.errorMessage || ERROR.UPDATE("Company"));
}
```

---

## State Management

### When to Use What

- **useState** - Component-specific UI state
- **Zustand** - Global state (auth, user preferences)
- **React Hook Form** - Form state
- **URL Params** - Filters, pagination, search

### Zustand Example

```javascript
// src/stores/authStore.js
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

---

## Styling Guidelines

### Use Style Constants

```jsx
import { SELECT_CLASS, INPUT_CLASS } from "@/lib/styles";

<select className={SELECT_CLASS}>
  {/* Options */}
</select>

<Input className={INPUT_CLASS} />
```

### Consistent Spacing

```jsx
<div className="space-y-6">      {/* Sections */}
  <div className="space-y-4">    {/* Groups */}
    <div className="space-y-2">  {/* Fields */}
      {/* Content */}
    </div>
  </div>
</div>
```

### Color Palette

```
slate-50   - Backgrounds
slate-200  - Borders
slate-300  - Input borders
slate-500  - Secondary text
slate-700  - Labels
slate-900  - Primary text

blue-500   - Primary actions
red-500    - Errors
emerald-500 - Success
amber-500  - Warnings
```

### Responsive Design (Mobile-first)

```jsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>
```

---

## Error Handling

### Toast Notifications

```javascript
import { toast } from "sonner";
import { SUCCESS, ERROR, WARNING } from "@/lib/toastMessages";

// Success
toast.success(SUCCESS.CREATE("Company"));
toast.success(SUCCESS.UPDATE("User"));

// Error
toast.error(err?.errorMessage || ERROR.CREATE("Company"));

// Warning
toast.warning(WARNING.UNSAVED_CHANGES);
```

### Try-Catch Pattern

```javascript
const handleAction = async () => {
  try {
    const result = await apiCall();
    toast.success("Action completed.");
    return result;
  } catch (err) {
    toast.error(err?.errorMessage || "Action failed.");
    throw err;
  }
};
```

---

## Quick Reference

### Common Imports

```javascript
// React
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Forms
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Toast
import { toast } from "sonner";

// Custom
import { useDialogForm } from "@/hooks/useDialogForm";
import { useApiAction } from "@/hooks/useApiAction";
import { FormField } from "@/components/ui/FormField";
import { DialogFormFooter } from "@/components/ui/DialogFormFooter";
import { trimFormData, toTitleCase } from "@/lib/formUtils";
import { SUCCESS, ERROR } from "@/lib/toastMessages";
import { SELECT_CLASS, INPUT_CLASS } from "@/lib/styles";
```

### Dialog Component Template

```jsx
import { useDialogForm } from "@/hooks/useDialogForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormField } from "@/components/ui/FormField";
import { DialogFormFooter } from "@/components/ui/DialogFormFooter";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createEntity } from "@/services/entityService";
import { createEntitySchema } from "./schemas/createEntitySchema";
import { SUCCESS, ERROR } from "@/lib/toastMessages";

export function CreateEntityDialog({ open, onOpenChange, onSuccess }) {
  const form = useDialogForm({
    open,
    defaultValues: { name: "", email: "" },
    resolver: zodResolver(createEntitySchema),
  });

  const onSubmit = async (data) => {
    try {
      await createEntity(data);
      toast.success(SUCCESS.CREATE("Entity"));
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error(err?.errorMessage || ERROR.CREATE("Entity"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Entity</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField label="Name" required error={form.formState.errors.name} id="name">
              <Input {...form.register("name")} />
            </FormField>
            
            <FormField label="Email" required error={form.formState.errors.email} id="email">
              <Input type="email" {...form.register("email")} />
            </FormField>
          </div>
          
          <DialogFormFooter 
            onCancel={() => onOpenChange(false)}
            submitText="Create"
            isLoading={form.formState.isSubmitting}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### Before Committing Checklist

- [ ] No `console.log` statements
- [ ] No unused imports/variables
- [ ] Used reusable components (`FormField`, `DialogFormFooter`)
- [ ] Used style constants (`SELECT_CLASS`, `INPUT_CLASS`)
- [ ] Used utility functions (`trimFormData`, `toTitleCase`)
- [ ] Used toast message constants (`SUCCESS`, `ERROR`)
- [ ] Toast notifications for user feedback
- [ ] Loading states for async operations
- [ ] Error handling with try-catch
- [ ] Follows naming conventions
- [ ] No linter errors (`npm run lint`)

---

## Git Workflow

### Branch Naming

```
feature/add-user-management
fix/login-redirect-issue
refactor/extract-components
```

### Commit Messages

```
feat: add user management page
fix: resolve login redirect issue
refactor: extract form components
chore: update dependencies
```

---

## Best Practices Summary

### DO ✅

- Use reusable components and hooks
- Import constants from `lib/styles.js` and `lib/toastMessages.js`
- Handle all errors with try-catch and toast
- Show loading states for async operations
- Use React Hook Form + Zod for forms
- Follow naming conventions strictly
- Add JSDoc comments for reusable components
- Keep components small and focused

### DON'T ❌

- Duplicate CSS class strings (use constants)
- Repeat form field structure (use `FormField`)
- Repeat dialog footer (use `DialogFormFooter`)
- Hardcode toast messages (use constants)
- Leave `console.log` statements
- Ignore linter warnings
- Create components without error handling

---

**Remember:** Consistency is key. When in doubt, look at existing refactored code or ask the team lead.
