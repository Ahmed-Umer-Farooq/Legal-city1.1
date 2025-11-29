# 🚀 Start Your LegalCity App on Localhost

## Quick Start Commands

### 1. Start Backend (Terminal 1)
```bash
cd backend
npm start
```

### 2. Start Frontend (Terminal 2) 
```bash
cd Frontend
npm start
```

## ✅ Localhost Configuration Applied

- **JWT Secret**: Set for development (change for production)
- **Session Secret**: Added for localhost
- **Cookie Settings**: Relaxed for localhost (strict for production)
- **CSRF Protection**: Disabled for localhost (enabled for production)
- **Database**: MySQL localhost connection ready
- **Ports**: Backend (5001), Frontend (3000)

## 🔧 If You Get Errors

### Database Connection Error
```bash
# Make sure MySQL is running
# Create database: legal_city
```

### Port Already in Use
```bash
# Kill processes on ports
npx kill-port 3000
npx kill-port 5001
```

### Missing Dependencies
```bash
cd backend && npm install
cd Frontend && npm install
```

## 📱 Access Your App

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/health

## 🎯 Development Ready

Your app is now configured for smooth localhost development with all security features that will automatically activate when you deploy to production in 1 month.