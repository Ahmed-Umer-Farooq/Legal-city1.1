const db = require('./db');

const sampleBlogs = [
  {
    title: "Understanding Your Rights: A Comprehensive Guide to Legal Protection",
    slug: "understanding-your-rights-comprehensive-guide-legal-protection",
    excerpt: "Learn about your fundamental legal rights and how to protect yourself in various situations.",
    content: "This comprehensive guide covers the essential legal rights every citizen should know...",
    featured_image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=720&h=400&fit=crop",
    category: "Legal Rights",
    tags: JSON.stringify(["legal rights", "protection", "guide"]),
    views_count: 150,
    author_id: 1,
    status: "published",
    published_at: new Date('2024-12-15')
  },
  {
    title: "Corporate Compliance: Essential Guidelines for Modern Businesses",
    slug: "corporate-compliance-essential-guidelines-modern-businesses",
    excerpt: "Navigate the complex world of corporate compliance with these essential guidelines.",
    content: "Modern businesses face numerous compliance challenges. This article provides essential guidelines...",
    featured_image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=720&h=400&fit=crop",
    category: "Business Law",
    tags: JSON.stringify(["business", "compliance", "corporate"]),
    views_count: 89,
    author_id: 1,
    status: "published",
    published_at: new Date('2024-12-12')
  },
  {
    title: "Navigating Divorce Proceedings: What You Need to Know",
    slug: "navigating-divorce-proceedings-what-you-need-know",
    excerpt: "A comprehensive guide to understanding divorce proceedings and protecting your interests.",
    content: "Divorce can be a challenging process. This guide helps you understand what to expect...",
    featured_image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=720&h=400&fit=crop",
    category: "Family Law",
    tags: JSON.stringify(["divorce", "family law", "legal process"]),
    views_count: 234,
    author_id: 1,
    status: "published",
    published_at: new Date('2024-12-10')
  }
];

async function seedBlogs() {
  try {
    console.log('🌱 Seeding blog data...');
    
    // Check if blogs already exist
    const existingBlogs = await db('blogs').select('id').limit(1);
    if (existingBlogs.length > 0) {
      console.log('📚 Blogs already exist, skipping seed');
      return;
    }
    
    // Insert sample blogs
    await db('blogs').insert(sampleBlogs);
    console.log('✅ Sample blogs inserted successfully');
    
    // Verify insertion
    const blogCount = await db('blogs').count('id as count').first();
    console.log(`📊 Total blogs in database: ${blogCount.count}`);
    
  } catch (error) {
    console.error('❌ Error seeding blogs:', error);
  } finally {
    process.exit(0);
  }
}

seedBlogs();