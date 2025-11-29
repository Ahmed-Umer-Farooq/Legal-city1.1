# Google OAuth Fix

## Issue
Google OAuth redirects back to login page instead of completing authentication.

## Root Cause
The Google OAuth app configuration may have incorrect redirect URIs or the callback is failing silently.

## Quick Fix Steps

1. **Restart Backend Server**:
   ```bash
   cd backend
   npm start
   ```

2. **Test OAuth Flow**:
   - Go to: http://localhost:3000/login
   - Select "Lawyer" role
   - Click "Continue with Google as Lawyer"
   - Check backend console for logs

3. **Check Google Console**:
   - Go to: https://console.developers.google.com
   - Select your project
   - Go to "Credentials" > "OAuth 2.0 Client IDs"
   - Verify redirect URIs include:
     - `http://localhost:5001/api/auth/google/callback`

4. **Debug Endpoint**:
   - Test: http://localhost:5001/api/auth/debug-oauth
   - Should show environment variables

## Expected Flow
1. User clicks Google OAuth → Backend logs "Google OAuth initiated"
2. Google redirects to callback → Backend logs "Google callback received"
3. Authentication succeeds → Backend logs "Google OAuth success"
4. Redirects to profile setup or dashboard

## If Still Not Working
Check Google OAuth app settings:
- Authorized redirect URIs must include exact callback URL
- OAuth consent screen must be configured
- API must be enabled