# LegalCity Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables
Create a secure `.env` file with the following variables:

```bash
# Database Configuration
DB_HOST=your_production_db_host
DB_USER=your_db_user
DB_PASSWORD=your_secure_db_password
DB_NAME=legal_city
DB_SSL=true

# JWT Configuration (Generate a strong secret)
JWT_SECRET=your_very_secure_jwt_secret_at_least_32_characters_long
SESSION_SECRET=your_session_secret_different_from_jwt

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Application URLs
FRONTEND_URL=https://yourdomain.com
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback

# Environment
NODE_ENV=production
PORT=5001
TRUST_PROXY=1
```

### 2. Security Requirements

#### Install Required Dependencies
```bash
cd backend
npm install helmet
```

#### Database Security
- Use strong database passwords
- Enable SSL connections
- Restrict database access to application servers only
- Regular database backups

#### Application Security
- HTTPS only in production
- Secure session configuration
- Rate limiting enabled
- Input validation and sanitization
- SQL injection prevention

### 3. Hostinger Deployment Steps

#### Step 1: Prepare Files
1. Remove the original `.env` file (contains development credentials)
2. Use the `.env.example` as template for production values
3. Ensure all sensitive data is properly configured

#### Step 2: Database Setup
1. Create MySQL database on Hostinger
2. Run migrations: `npm run migrate`
3. Update database connection settings

#### Step 3: File Upload
1. Upload backend files to `/public_html/api/` or similar
2. Upload frontend build files to `/public_html/`
3. Set proper file permissions (755 for directories, 644 for files)

#### Step 4: Node.js Configuration
1. Ensure Node.js is enabled in Hostinger control panel
2. Set startup file to `server.js`
3. Configure environment variables in hosting panel

### 4. Frontend Production Build

```bash
cd Frontend
npm run build
```

Upload the `build` folder contents to your domain root.

### 5. SSL Certificate
- Enable SSL certificate in Hostinger control panel
- Update all URLs to use HTTPS
- Configure HSTS headers

### 6. Performance Optimization

#### Backend
- Enable gzip compression
- Configure proper caching headers
- Use connection pooling for database
- Monitor memory usage

#### Frontend
- Minified and optimized build
- CDN for static assets
- Image optimization
- Lazy loading implementation

### 7. Monitoring and Logging

#### Error Logging
- Implement proper error logging
- Monitor application performance
- Set up alerts for critical errors

#### Health Checks
- Database connectivity monitoring
- API endpoint health checks
- Email service verification

### 8. Security Headers

The application now includes:
- Helmet.js for security headers
- Content Security Policy
- Rate limiting
- CORS configuration
- Session security

### 9. Post-Deployment Verification

1. Test all authentication flows
2. Verify email functionality
3. Test file uploads
4. Check database connections
5. Validate SSL certificate
6. Test all API endpoints
7. Verify chat functionality

### 10. Backup Strategy

- Daily database backups
- Weekly full application backups
- Version control for code changes
- Environment configuration backups

## Common Issues and Solutions

### Database Connection Issues
- Verify SSL settings
- Check firewall rules
- Validate connection strings

### Email Not Working
- Use app-specific passwords for Gmail
- Verify SMTP settings
- Check spam folders

### File Upload Problems
- Check directory permissions
- Verify file size limits
- Ensure proper MIME type handling

### Performance Issues
- Monitor database query performance
- Check memory usage
- Optimize image sizes
- Enable caching

## Security Best Practices

1. **Never commit sensitive data to version control**
2. **Use strong, unique passwords for all services**
3. **Enable two-factor authentication where possible**
4. **Regularly update dependencies**
5. **Monitor for security vulnerabilities**
6. **Implement proper logging and monitoring**
7. **Use HTTPS everywhere**
8. **Validate and sanitize all inputs**
9. **Implement proper error handling**
10. **Regular security audits**

## Support and Maintenance

- Regular dependency updates
- Security patch management
- Performance monitoring
- User feedback integration
- Feature enhancement planning