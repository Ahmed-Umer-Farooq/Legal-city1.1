import React from 'react';
import BlogPage from '../Blogs/blogs';

const BlogPosts = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Legal Blog Posts</h1>
        <p className="text-gray-600">Stay updated with the latest legal insights and news</p>
      </div>
      <BlogPage />
    </div>
  );
};

export default BlogPosts;