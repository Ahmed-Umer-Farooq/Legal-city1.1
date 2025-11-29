## Frontend AI Onboarding Guide

Purpose: This file gives any AI assistant a quick, reliable mental model of this React frontend so it can safely add features and fix bugs.

### Tech Stack
- React 18 (CRA or compatible)
- React Router
- Context API for auth: `src/context/AuthContext.js`
- HTTP client wrapper: `src/utils/api.js` (base: `http://localhost:5001/api`)
- Notifications: `react-toastify` via `ToastContainer` in `src/App.js`
- Styling: utility classes (Tailwind-like) already present in components

### How to Run
- Dev server: `npm start` (port 3000)
- Backend: `http://localhost:5001`
- Ensure CORS or CRA proxy is configured. If CRA proxy is used, set in `package.json`: `"proxy": "http://localhost:5001"`.

### API Conventions
- All requests go through `src/utils/api.js`.
- Auth endpoints live under `/auth/*`.
- Registration (unified): `POST /auth/register` (supports both camelCase and snake_case keys for zip and mobile).

### Global Notifications
- Container: `src/App.js` renders `<ToastContainer />` and imports CSS.
- Use `react-toastify` directly or wrapper `src/utils/notify.js`.

### Routing & Auth Flow
- Root app: `src/App.js` → `src/LegalCityAuth.jsx` controls which auth screen to show.
- Auth state: `src/context/AuthContext.js` provides `useAuth()` with `user`, `login`, `logout`, `updateUser`.
- Post-login: `LegalCityAuth.jsx` switches to directory or dashboards based on path/role.

### Directory Layout (key files only)
```
src/
  App.js                  # Root app; mounts ToastContainer
  index.js                # Router + AuthProvider
  LegalCityAuth.jsx       # Auth/Dashboard switchboard
  context/
    AuthContext.js        # Auth state & actions
  components/
    auth/
      AuthForm.jsx        # Registration form (user/lawyer). onSubmit with loading, toasts
      Login.jsx           # Login form; uses toast on success/error
      GoogleLoginButton.jsx
    layout/
      Sidebar.jsx
  pages/
    Register.js           # Wraps AuthForm
    Login.js              # Wraps Login component
    ForgotPassword.js
    VerifyEmail.js
    ResetPassword.js      # Uses toasts on success
    Dashboard.js          # Uses toasts for profile updates/errors
    AdminDashboard.js     # Admin actions with toasts
    LawyerDirectory.js
  utils/
    api.js                # Axios client (ensure baseURL matches backend)
    notify.js             # Toast helpers (success/error/info/warning)
  index.css
```

### Implementation Guidelines
- Place new reusable UI in `src/components/*`.
- Place new pages under `src/pages/*` and route them via `LegalCityAuth.jsx` (or a central router if added later).
- For API calls, always use `utils/api.js` and surface user feedback with `toast.*`.
- Keep forms controlled: `value` + `onChange` and validate in the component.
- Use loading state to disable buttons and avoid double submits.
- Email should be trimmed and lowercased before submission.

### Common Tasks
- Add a page:
  1) Create `src/pages/NewPage.js` (export default component)
  2) Wire route in `LegalCityAuth.jsx` (or central router) based on `authMode` or URL
  3) Use `toast` for user feedback

- Add an API call:
  1) Import `api` from `src/utils/api`
  2) Call `await api.get|post|put|delete(path, data)` in `try/catch`
  3) On success: `toast.success('...')`; on error: extract `error.response?.data?.message`

### Debugging Notes
- If toasts don’t show: verify `ToastContainer` in `App.js` and CSS import.
- If requests don’t reach backend: confirm `api.js` baseURL or CRA proxy, check CORS on backend.
- If a button appears unresponsive: ensure it is inside a `<form onSubmit={...}>` with `type="submit"` and `e.preventDefault()` in handler.

### AI Edit Safety Checklist
- Preserve existing indentation and formatting.
- Do not introduce comments that explain actions; only code rationale when needed.
- Validate no new linter/type errors are introduced.
- Prefer small, focused edits with clear toasts and loading states.

### Ready-to-Use Prompts (drop-in)
- “Add a new page `src/pages/Profile.js` with a form to update name and address using `api.put('/auth/me')`, show `toast.success` on success, disable the submit button while loading, and route to it from `LegalCityAuth.jsx` when `authMode==='dashboard'` via a link.”
- “Replace any `alert()` usage in `src/pages/*` with `toast.*` and ensure `import { toast } from 'react-toastify'` is present.”


