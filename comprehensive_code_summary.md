# Legal City Application - Comprehensive Code Summary

## Overview

Legal City is a full-stack web application that connects users with legal professionals. The platform features user and lawyer registration, authentication, lawyer verification, and an admin management system. The application consists of a Node.js/Express backend API and a React frontend with modern UI components.

## Architecture

### Backend (Node.js/Express)
- **Framework**: Express.js v5.1.0
- **Database**: MySQL with Knex.js ORM
- **Authentication**: JWT tokens with Passport.js OAuth integration
- **Email**: Nodemailer with Gmail SMTP
- **Security**: bcryptjs hashing, express-rate-limit, CORS
- **Validation**: Server-side input validation
- **File Structure**:
  ```
  backend/
  ├── server.js                 # Main application entry point
  ├── package.json              # Dependencies and scripts
  ├── knexfile.js              # Database configuration
  ├── db.js                    # Knex database instance
  ├── config/
  │   └── passport.js          # OAuth strategies (Google, Facebook)
  ├── controllers/
  │   ├── authController.js    # Authentication logic
  │   ├── userController.js    # User management
  │   ├── lawyerController.js  # Lawyer management
  │   └── adminController.js   # Admin functions
  ├── routes/
  │   ├── auth.js              # Authentication routes
  │   ├── admin.js             # Admin routes
  │   └── lawyers.js           # Lawyer directory routes
  ├── migrations/              # Database schema migrations
  ├── utils/
  │   ├── token.js             # JWT utilities
  │   ├── mailer.js            # Email sending
  │   ├── middleware.js        # Authentication middleware
  │   ├── limiter.js           # Rate limiting
  │   └── validator.js         # Input validation
  ```

### Frontend (React)
- **Framework**: React 19.2.0 with React Router v7.9.4
- **Styling**: Tailwind CSS v3.4.18
- **HTTP Client**: Axios v1.12.2
- **UI Components**: Custom components with Lucide React icons
- **Notifications**: React Toastify v11.0.5
- **State Management**: React Context API
- **File Structure**:
  ```
  Frontend/
  ├── src/
  │   ├── App.js               # Main app component with routing
  │   ├── index.js             # App entry point
  │   ├── LegalCityAuth.jsx    # Main authentication component
  │   ├── context/
  │   │   └── AuthContext.js   # Authentication state management
  │   ├── components/
  │   │   ├── auth/            # Authentication forms
  │   │   ├── layout/          # Layout components (Header, Sidebar, Footer)
  │   │   └── shared/          # Reusable components (Toast, etc.)
  │   ├── pages/               # Page components
  │   │   ├── Login.js
  │   │   ├── Register.js
  │   │   ├── ForgotPassword.js
  │   │   ├── VerifyEmail.js
  │   │   ├── ResetPassword.js
  │   │   ├── LawyerDirectory.js
  │   │   ├── AdminDashboard.js
  │   │   └── Goodbye.js
  │   ├── utils/
  │   │   ├── api.js           # API client configuration
  │   │   └── notify.js        # Notification utilities
  │   └── components/          # Additional components
  ├── public/                  # Static assets
  └── package.json             # Dependencies
  ```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  username VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email_verification_code VARCHAR(255),
  email_verified INT DEFAULT 0,
  reset_token VARCHAR(255),
  reset_token_expiry TIMESTAMP,
  otp_expiry TIMESTAMP,
  address VARCHAR(255),
  zip_code VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(255),
  country VARCHAR(255),
  mobile_number VARCHAR(20),
  role VARCHAR(255) NOT NULL DEFAULT 'user',
  google_id VARCHAR(255) UNIQUE,
  avatar VARCHAR(255),
  is_active INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Lawyers Table
```sql
CREATE TABLE lawyers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  username VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  registration_id VARCHAR(255),
  law_firm VARCHAR(255),
  speciality VARCHAR(255),
  email_verification_code VARCHAR(255),
  email_verified INT DEFAULT 0,
  reset_token VARCHAR(255),
  reset_token_expiry TIMESTAMP,
  otp_expiry TIMESTAMP,
  address VARCHAR(255),
  zip_code VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(255),
  country VARCHAR(255),
  mobile_number VARCHAR(20),
  lawyer_verified INT DEFAULT 0,
  rating DECIMAL(3,1) DEFAULT 0.0,
  phone VARCHAR(20),
  experience VARCHAR(50),
  description TEXT,
  profile_image VARCHAR(500),
  is_verified INT DEFAULT 0,
  languages JSON,
  hourly_rate INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /auth/register` - Unified user/lawyer registration
- `POST /auth/login` - Unified login
- `POST /auth/verify-email` - Email verification
- `POST /auth/send-otp` - Send OTP for verification
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/forgot-password-otp` - Send password reset OTP
- `POST /auth/verify-forgot-password-otp` - Reset password with OTP
- `GET /auth/me` - Get current user profile
- `PUT /auth/me` - Update user profile
- `DELETE /auth/me` - Delete account
- `GET /auth/google` - Google OAuth initiation
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/facebook` - Facebook OAuth initiation
- `GET /auth/facebook/callback` - Facebook OAuth callback

### Admin Routes (`/api/admin`) - Requires Admin JWT
- `GET /admin/lawyers/unverified` - Get unverified lawyers
- `PUT /admin/verify-lawyer/:id` - Verify lawyer
- `GET /admin/stats` - Dashboard statistics
- `GET /admin/users` - User management with pagination
- `GET /admin/lawyers` - Lawyer management with pagination
- `DELETE /admin/users/:id` - Delete user
- `DELETE /admin/lawyers/:id` - Delete lawyer
- `PUT /admin/users/:id/make-admin` - Grant admin access
- `PUT /admin/users/:id/remove-admin` - Remove admin access
- `GET /admin/activity-logs` - Activity logs

### Lawyer Directory Routes (`/api/lawyers`)
- `GET /lawyers/` - Public lawyer directory with filters and pagination

## Application Workflow

### User Registration Flow
1. User submits registration form (name, email, password, etc.)
2. Backend validates input and detects user type (user vs lawyer)
3. User account created with email verification code
4. Verification email sent to user
5. User verifies email via OTP or verification code
6. Account becomes active

### Authentication Flow
1. User enters credentials or uses OAuth
2. Backend validates credentials
3. JWT token generated and returned
4. Frontend stores token in localStorage
5. Subsequent requests include Authorization header
6. Token validated on each protected request

### Lawyer Verification Flow
1. Lawyer registers with additional fields (registration_id, speciality, etc.)
2. Account created but marked as unverified
3. Admin reviews lawyer application
4. Admin can verify or reject lawyer
5. Verified lawyers appear in public directory

### Admin Management Flow
1. Admin logs in (role-based access)
2. Dashboard shows statistics and recent activity
3. Admin can manage users and lawyers
4. Actions logged for audit trail
5. Real-time updates with auto-refresh

## Key Components

### Backend Controllers

#### authController.js
- `login()` - Unified login for users and lawyers
- `verifyEmail()` - Email verification with code/OTP
- `forgotPasswordOtp()` - Send OTP for password reset
- `verifyForgotPasswordOtp()` - Verify OTP and reset password
- `getProfile()` - Get user profile from users/lawyers tables
- `updateProfile()` - Update user profile
- `deleteAccount()` - Delete user account
- `sendOtp()` - Send OTP for email verification
- `verifyOtp()` - Verify OTP and mark email verified

#### adminController.js
- `getUnverifiedLawyers()` - List pending lawyer verifications
- `verifyLawyer()` - Mark lawyer as verified
- `getStats()` - Dashboard statistics
- `getUsers()` - Paginated user list with search
- `getLawyers()` - Paginated lawyer list with filters
- `deleteUser()` - Remove user account
- `deleteLawyer()` - Remove lawyer account
- `makeAdmin()` - Grant admin privileges
- `removeAdmin()` - Revoke admin privileges

#### lawyerController.js
- `registerLawyer()` - Create lawyer account
- `loginLawyer()` - Lawyer-specific login
- `getProfile()` - Get lawyer profile
- `updateProfile()` - Update lawyer profile
- `deleteAccount()` - Delete lawyer account
- `getLawyersDirectory()` - Public lawyer search with filters

### Frontend Components

#### Authentication Components
- `AuthForm.jsx` - Reusable authentication form
- `Login.jsx` - Login page with OAuth options
- `Register.jsx` - Registration form with validation
- `ForgotPasswordForm.jsx` - Password reset request
- `GoogleLoginButton.jsx` - Google OAuth integration

#### Layout Components
- `Sidebar.jsx` - Navigation sidebar
- `Header.jsx` - Application header
- `Footer.jsx` - Footer component

#### Page Components
- `LawyerDirectory.js` - Public lawyer search interface
- `AdminDashboard.js` - Admin management interface
- `VerifyEmail.js` - Email verification page
- `ResetPassword.js` - Password reset page

#### Utility Components
- `OtpInput.jsx` - OTP input component
- `PasswordStrengthIndicator.jsx` - Password strength meter
- `Toast.jsx` - Notification component

## State Management

### AuthContext (Frontend)
- Manages user authentication state
- Handles login/logout operations
- Processes OAuth callbacks
- Provides user data to components
- Intercepts API responses for token expiration

### API Client (Frontend)
- Axios instance with base URL configuration
- Automatic JWT token attachment
- Response interceptors for error handling
- Token expiration handling

## Security Features

### Backend Security
- JWT authentication with 7-day expiration
- Password hashing with bcrypt (10 rounds)
- Rate limiting on authentication endpoints
- Input validation and sanitization
- CORS protection
- OAuth integration with secure callbacks

### Frontend Security
- Token storage in localStorage
- Automatic token cleanup on logout
- Protected routes with authentication checks
- Input validation on forms
- Secure API communication over HTTPS

## Email System

### Email Templates
- Email verification with OTP/code
- Password reset instructions
- Welcome messages
- Admin notifications

### Configuration
- Gmail SMTP transport
- Environment-based configuration
- Mock logging for development
- HTML email templates

## Development and Deployment

### Environment Variables
```env
# Backend
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=legal_city
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_gmail_app_password

# Frontend
REACT_APP_API_URL=http://localhost:5001/api
```

### Development Setup
1. Install backend dependencies: `npm install`
2. Run database migrations: `npx knex migrate:latest`
3. Start backend server: `npm start`
4. Install frontend dependencies: `npm install`
5. Start frontend development server: `npm start`

### Production Deployment
- Build frontend: `npm run build`
- Serve static files from backend or CDN
- Configure production database
- Set up SSL certificates
- Configure reverse proxy (nginx/apache)

## Key Features

### User Features
- User and lawyer registration
- Email verification with OTP
- Password reset functionality
- Profile management
- OAuth login (Google, Facebook)
- Lawyer directory search
- Responsive design

### Admin Features
- Dashboard with statistics
- User and lawyer management
- Lawyer verification system
- Activity logging
- Role-based access control
- Bulk operations support

### Technical Features
- RESTful API design
- Real-time updates
- Pagination and filtering
- Search functionality
- Error handling and logging
- Mobile-responsive UI
- Progressive Web App capabilities

## Code Quality and Best Practices

### Backend
- Modular architecture with separation of concerns
- Consistent error handling
- Input validation
- Database migrations for schema management
- Environment-based configuration
- Logging and monitoring

### Frontend
- Component-based architecture
- React hooks for state management
- Responsive design with Tailwind CSS
- TypeScript-ready structure
- Accessibility considerations
- Performance optimizations

## Future Enhancements

### Potential Features
- Real-time chat between users and lawyers
- Appointment booking system
- Payment integration
- Document management
- Review and rating system
- Mobile app development
- Multi-language support
- Advanced search filters
- Analytics dashboard
- API rate limiting per user
- Two-factor authentication
- Social features (lawyer profiles, blogs)
- Integration with legal databases
- Automated lawyer matching
- Video consultation booking

### Technical Improvements
- GraphQL API implementation
- Redis caching layer
- Docker containerization
- CI/CD pipeline
- Automated testing suite
- Performance monitoring
- Database optimization
- API documentation (Swagger/OpenAPI)
- TypeScript migration
- Microservices architecture
- Serverless deployment options

This comprehensive summary covers all aspects of the Legal City application, from architecture and workflow to specific implementation details and future development opportunities.
