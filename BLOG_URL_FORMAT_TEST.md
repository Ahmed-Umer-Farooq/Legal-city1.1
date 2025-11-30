# Blog URL Format Update

## New URL Format
✅ **Before:** `/legal-blog/understanding-your-legal-rights`
✅ **After:** `/legal-blog/understanding-your-legal-rights/ed684da357c8655c72af1eeddc08a3d7`

## Format: `/legal-blog/{slug}/{secure_id}`

### Benefits:
1. **SEO-friendly slug** in URL
2. **Unique secure_id** prevents duplicate slug issues
3. **Both identifiers** visible for clarity

### Changes Made:
1. ✅ blogs.js - Added id, secure_id to transformed data
2. ✅ BlogCard (blogs.js) - Uses `${slug}/${secure_id}` format
3. ✅ BlogDetail.jsx - Extracts secure_id from URL
4. ✅ BlogCard.jsx - Updated share/view links
5. ✅ Related articles - Fixed navigation format

### How It Works:
- **Frontend:** Navigates to `/legal-blog/slug/secure_id`
- **BlogDetail:** Extracts secure_id from URL (splits by `/` and takes last part)
- **Backend API:** Receives secure_id and fetches blog

### Example URLs:
```
/legal-blog/understanding-your-legal-rights/25adab1737aecf07f9b95d45ef8fe4ed
/legal-blog/criminal-activity/7384759474dhdhd334
/legal-blog/baber-king/ed684da357c8655c72af1eeddc08a3d7
```

## Test After Restart:
1. Restart frontend
2. Click any blog card
3. URL should show: `/legal-blog/{slug}/{secure_id}`
