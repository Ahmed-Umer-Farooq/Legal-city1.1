const blogController = require('../controllers/blogController');

describe('Blog Controller', () => {
  test('getAllBlogs should be defined', () => {
    expect(blogController.getAllBlogs).toBeDefined();
    expect(typeof blogController.getAllBlogs).toBe('function');
  });

  test('getBlogCategories should be defined', () => {
    expect(blogController.getBlogCategories).toBeDefined();
    expect(typeof blogController.getBlogCategories).toBe('function');
  });

  test('getTopAuthors should be defined', () => {
    expect(blogController.getTopAuthors).toBeDefined();
    expect(typeof blogController.getTopAuthors).toBe('function');
  });

  test('getBlogTags should be defined', () => {
    expect(blogController.getBlogTags).toBeDefined();
    expect(typeof blogController.getBlogTags).toBe('function');
  });

  test('getPopularPosts should be defined', () => {
    expect(blogController.getPopularPosts).toBeDefined();
    expect(typeof blogController.getPopularPosts).toBe('function');
  });
});