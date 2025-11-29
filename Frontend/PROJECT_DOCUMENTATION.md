# LegalCity Frontend - Comprehensive Project Documentation

## Project Overview
**LegalCity** is a React-based legal services platform that connects users with lawyers. The frontend provides authentication, user management, and a lawyer directory system with Google OAuth integration.

## Tech Stack
- **Framework**: React 19.2.0 with Create React App
- **Routing**: React Router DOM 7.9.4
- **Styling**: Tailwind CSS 3.4.18
- **HTTP Client**: Axios 1.12.2
- **Notifications**: Sonner 2.0.7
- **Icons**: Lucide React 0.548.0
- **Testing**: React Testing Library

## Project Structure
```
Frontend/
├── public/                     # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── auth/             # Authentication components
│   │   │   ├── AuthForm.jsx
│   │   │   ├── ForgotPasswordForm.jsx
│   │   │   ├── GoogleLoginButton.jsx
│   │   │   └── Login.jsx
│   │   ├── layout/           # Layout components
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── ModernToast.jsx
│   │   ├── OtpInput.jsx
│   │   ├── PasswordStrengthIndicator.jsx
│   │   └── Toast.jsx
│   ├── context/              # React Context providers
│   │   └── AuthContext.js    # Authentication state management
│   ├── pages/                # Page components
│   │   ├── AdminDashboard.js
│   │   ├── ForgotPassword.js
│   │   ├── GoogleLawyerSetup.jsx
│   │   ├── GoogleUserSetup.jsx
│   │   ├── LawyerDirectory.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── ResetPassword.js
│   │   └── VerifyEmail.js
│   ├── utils/                # Utility functions
│   │   ├── api.js           # Axios configuration
│   │   └── notify.js        # Notification helpers
│   ├── App.js               # Main app component with routing
│   ├── LegalCityAuth.jsx    # Main authentication wrapper
│   ├── index.js             # App entry point
│   └── index.css            # Global styles
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind configuration
└── postcss.config.js        # PostCSS configuration
```

## Core Architecture

### 1. Authentication System
- **AuthContext**: Centralized authentication state management
- **Token-based auth**: JWT tokens stored in localStorage
- **Google OAuth**: Integrated Google login with setup flows
- **Role-based access**: Admin and regular user roles
- **Protected routes**: Admin dashboard requires admin role

### 2. Routing Structure
```javascript
// Main routes in App.js
/                           → LegalCityAuth (main auth wrapper)
/admin-dashboard           → AdminDashboard (admin only)
/google-user-setup         → GoogleUserSetup
/google-lawyer-setup       → GoogleLawyerSetup
```

### 3. State Management
- **AuthContext**: User authentication state, login/logout functions
- **Local State**: Component-level state with useState/useEffect
- **URL State**: Search params for OAuth tokens and errors

## Key Components

### LegalCityAuth.jsx (Main Wrapper)
- Handles all authentication flows and page routing
- Manages auth modes: login, register, forgot, verify, reset, directory
- Implements browser back button prevention
- Role-based page access control

### AuthContext.js
- Provides authentication state across the app
- Handles OAuth token processing from URL params
- Auto-hydrates user data from stored tokens
- Manages login/logout functionality

### API Configuration (utils/api.js)
- Axios instance with base URL configuration
- Request interceptor: Adds Bearer token to requests
- Response interceptor: Handles 401 errors and token expiration
- Base URL: `http://localhost:5001/api` (configurable via env)

### LawyerDirectory.js
- Main homepage for authenticated users
- Displays lawyer listings with filtering options
- Responsive design with mobile-first approach
- Integrated header with user authentication status

## Authentication Flow

### 1. Regular Login/Register
1. User enters credentials in Login/Register forms
2. API call to backend authentication endpoints
3. Token received and stored in localStorage
4. User data stored in AuthContext
5. Redirect to appropriate dashboard/directory

### 2. Google OAuth Flow
1. User clicks Google login button
2. Redirected to Google OAuth
3. Google redirects back with token in URL params
4. AuthContext processes token from URL
5. Token stored, URL cleaned up
6. User redirected to setup page if first time
7. After setup, redirected to main directory

### 3. Token Management
- Tokens stored in localStorage
- Automatically added to API requests via interceptor
- Auto-logout on 401 responses
- Token validation on app initialization

## Styling System

### Tailwind CSS Configuration
- Custom color scheme with gradients
- Responsive breakpoints: sm, md, lg, xl
- Custom utilities for common patterns
- Component-specific styling classes

### Key Design Patterns
- **Gradient text**: `.gradient-text` class for brand colors
- **Hero sections**: Full-width backgrounds with overlay text
- **Card layouts**: Consistent spacing and shadows
- **Button styles**: Rounded, hover states, consistent sizing
- **Form styling**: Clean inputs with validation states

## API Integration

### Base Configuration
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
```

### Common API Patterns
- Authentication endpoints: `/auth/login`, `/auth/register`, `/auth/me`
- Google OAuth: `/auth/google`, `/auth/google/callback`
- User management: `/users`, `/lawyers`
- Error handling with toast notifications

## Development Workflow

### Available Scripts
```bash
npm start          # Development server (port 3000)
npm run build      # Production build
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### Environment Setup
- Backend proxy configured to `http://localhost:5001`
- Environment variables for API URL configuration
- Development server with hot reloading

## User Roles and Permissions

### Regular Users
- Access to lawyer directory
- Profile management
- Basic authentication features

### Admin Users
- Access to admin dashboard
- User management capabilities
- System administration features
- Identified by `role: 'admin'` or `is_admin: true`

### Lawyers
- Special registration flow
- Enhanced profile setup
- Directory listing management

## Security Features

### Authentication Security
- JWT token-based authentication
- Automatic token expiration handling
- Secure token storage in localStorage
- Request/response interceptors for token management

### Route Protection
- Admin routes protected by role checking
- Automatic redirects for unauthorized access
- Browser back button prevention in auth flows

### Data Validation
- Form validation on client side
- Password strength indicators
- Email verification flows
- OTP input components

## Toast Notification System

### Sonner Integration
- Positioned at top-right
- Rich colors and close buttons
- 2-second duration by default
- Consistent styling across the app

### Usage Patterns
```javascript
import { toast } from 'sonner';

toast.success('Login successful');
toast.error('Login failed');
toast.info('Please check your email');
```

## Responsive Design

### Mobile-First Approach
- Tailwind's responsive prefixes (sm:, md:, lg:, xl:)
- Flexible layouts with CSS Grid and Flexbox
- Mobile-optimized navigation and forms
- Touch-friendly button sizes and spacing

### Key Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Testing Strategy

### Testing Libraries
- React Testing Library for component testing
- Jest for unit testing
- User event simulation for interaction testing

### Test Coverage Areas
- Authentication flows
- Form validation
- Component rendering
- User interactions

## Performance Considerations

### Optimization Techniques
- Code splitting with React.lazy (ready for implementation)
- Image optimization with proper sizing
- Efficient re-rendering with proper dependency arrays
- Minimal bundle size with tree shaking

### Loading States
- Loading indicators for async operations
- Skeleton screens for better UX
- Error boundaries for graceful error handling

## Common Development Patterns

### Component Structure
```javascript
// Standard component pattern
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const ComponentName = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Component initialization
  }, []);

  return (
    <div className="component-container">
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

### API Call Pattern
```javascript
const fetchData = async () => {
  setLoading(true);
  try {
    const response = await api.get('/endpoint');
    setData(response.data);
  } catch (error) {
    toast.error(error.response?.data?.message || 'Operation failed');
  } finally {
    setLoading(false);
  }
};
```

## Deployment Considerations

### Build Process
- `npm run build` creates optimized production build
- Static files generated in `build/` directory
- Environment variables for different deployment stages

### Environment Variables
- `REACT_APP_API_URL`: Backend API base URL
- Additional config variables as needed

## Future Enhancement Areas

### Planned Features
- Real-time chat system
- Advanced search and filtering
- Payment integration
- Document management
- Calendar scheduling

### Technical Improvements
- State management with Redux/Zustand
- Advanced caching strategies
- Progressive Web App features
- Enhanced accessibility compliance

## Troubleshooting Guide

### Common Issues
1. **Token expiration**: Check localStorage and API interceptors
2. **CORS errors**: Verify backend proxy configuration
3. **Route protection**: Ensure proper role checking logic
4. **Google OAuth**: Check redirect URLs and environment setup

### Debug Tools
- React Developer Tools
- Network tab for API calls
- Console logging for state debugging
- Toast notifications for user feedback

## Code Quality Standards

### Best Practices
- Consistent naming conventions (camelCase for variables, PascalCase for components)
- Proper error handling with try-catch blocks
- Clean component separation and reusability
- Comprehensive commenting for complex logic
- Responsive design implementation

### File Organization
- Components grouped by functionality
- Utilities separated from components
- Context providers in dedicated directory
- Pages as top-level route components

This documentation provides a complete understanding of the LegalCity frontend architecture, enabling any AI assistant to effectively work with and modify the codebase.