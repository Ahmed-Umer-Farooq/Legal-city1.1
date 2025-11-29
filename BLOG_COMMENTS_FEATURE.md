# Blog Comments/Q&A Feature

## Overview
Added a comprehensive blog commenting system that allows users to engage with blog posts through comments and replies.

## Features Implemented

### 🗄️ Database Schema
- **New Table**: `blog_comments`
  - `id` - Primary key
  - `blog_id` - Foreign key to blogs table
  - `user_id` - Foreign key to users table  
  - `comment_text` - The comment content
  - `parent_comment_id` - For nested replies (nullable)
  - `created_at`, `updated_at` - Timestamps

### 🔌 Backend API Endpoints
- `GET /api/blogs/:blog_id/comments` - Fetch all comments for a blog (public)
- `POST /api/blogs/:blog_id/comments` - Create new comment (auth required)
- `DELETE /api/blogs/comments/:comment_id` - Delete own comment (auth required)

### 🎨 Frontend Components
- **CommentSection** - Main comment interface component
- **CommentCount** - Reusable component for displaying comment counts
- Updated **BlogCard** to show comment counts
- Updated **BlogDetail** to include comment section

### 🔐 Permissions & Security
- **Public Access**: Anyone can view comments
- **Authenticated Users**: Can post comments and replies
- **Comment Ownership**: Users can only delete their own comments
- **Admin Override**: Admins can delete any comment
- **Role Badges**: Shows "Lawyer" or "User" badge next to comments

### 🎯 User Experience
- **Login Prompt**: Non-logged-in users see "Login to ask a question or comment"
- **Real-time Updates**: Comments appear immediately after posting
- **Nested Replies**: Support for replying to specific comments
- **User Identification**: Shows commenter name and role badge
- **Timestamps**: Displays when comments were posted

## Files Modified/Created

### Backend Files
- `migrations/20251201100021_create_blog_comments_table.js` - Database migration
- `controllers/blogController.js` - Added comment methods
- `routes/blogs.js` - Added comment routes

### Frontend Files  
- `components/CommentSection.jsx` - Main comment component
- `components/CommentCount.jsx` - Comment count display
- `pages/Blogs/BlogDetail.jsx` - Added comment section
- `pages/Blogs/blogs.js` - Added comment count to blog cards

## Usage

### For Users
1. **View Comments**: Available to all users on blog detail pages
2. **Post Comments**: Login required, then use the comment form
3. **Reply to Comments**: Click "Reply" button on any comment
4. **Delete Comments**: Only your own comments via "Delete" button

### For Developers
```javascript
// Fetch comments for a blog
const response = await fetch(`/api/blogs/${blogId}/comments`);
const comments = await response.json();

// Post a new comment (requires auth token)
const response = await fetch(`/api/blogs/${blogId}/comments`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    comment_text: 'Your comment here',
    parent_comment_id: null // or parent comment ID for replies
  })
});
```

## Database Migration
Run the migration to create the comments table:
```bash
cd backend
npx knex migrate:latest
```

## Testing
- Database setup verified with `test_comments.js`
- All API endpoints follow existing authentication patterns
- Frontend components integrate seamlessly with existing blog system

## Security Considerations
- All comment operations require proper authentication
- SQL injection protection via parameterized queries
- XSS protection through proper input sanitization
- Rate limiting inherited from existing middleware

## Future Enhancements
- Comment moderation system
- Email notifications for new comments
- Comment voting/rating system
- Rich text editor for comments
- Comment search functionality