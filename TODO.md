# TODO: Strengthen Admin Security and Fix 500 Errors

## Tasks
- [x] Update `backend/utils/middleware.js` to add `verifyAdmin` middleware that combines token verification and admin role check
- [x] Update `backend/routes/admin.js` to use `verifyAdmin` instead of `authenticateAdmin`
- [ ] Test admin endpoints with valid admin JWT to ensure they work
- [ ] Test admin endpoints without token or with invalid token to verify clear error messages
