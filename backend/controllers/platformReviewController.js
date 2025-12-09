const db = require('../db');

const platformReviewController = {
  // Get all reviews for admin/lawyer dashboard
  getAllReviews: async (req, res) => {
    try {
      const reviews = await db('platform_reviews')
        .leftJoin('lawyers', 'platform_reviews.lawyer_id', 'lawyers.id')
        .select(
          'platform_reviews.*',
          'lawyers.name as lawyer_name'
        )
        .orderBy('platform_reviews.created_at', 'desc');

      res.json({ reviews });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  },

  // Get featured reviews for homepage
  getFeaturedReviews: async (req, res) => {
    try {
      const reviews = await db('platform_reviews')
        .where({ is_approved: true, is_featured: true })
        .select('client_name', 'client_title', 'review_text', 'rating')
        .orderBy('created_at', 'desc')
        .limit(3);

      res.json({ reviews });
    } catch (error) {
      console.error('Error fetching featured reviews:', error);
      res.status(500).json({ error: 'Failed to fetch featured reviews' });
    }
  },

  // Get all approved reviews for homepage
  getApprovedReviews: async (req, res) => {
    try {
      const reviews = await db('platform_reviews')
        .where({ is_approved: true })
        .select('client_name', 'client_title', 'review_text', 'rating')
        .orderBy('created_at', 'desc');

      res.json({ reviews });
    } catch (error) {
      console.error('Error fetching approved reviews:', error);
      res.status(500).json({ error: 'Failed to fetch approved reviews' });
    }
  },

  // Create new review
  createReview: async (req, res) => {
    try {
      console.log('Review submission - User:', req.user);
      const { client_name, client_title, review_text, rating } = req.body;
      const lawyer_id = req.user.id;

      if (!client_name || !review_text || !rating) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      // Check if user is a lawyer (either role='lawyer' or exists in lawyers table)
      let isLawyer = req.user.role === 'lawyer';
      if (!isLawyer) {
        const lawyerCheck = await db('lawyers').where('id', lawyer_id).first();
        isLawyer = !!lawyerCheck;
      }

      if (!isLawyer) {
        return res.status(403).json({ error: 'Only lawyers can submit platform reviews' });
      }

      const [reviewId] = await db('platform_reviews').insert({
        lawyer_id,
        client_name,
        client_title,
        review_text,
        rating,
        is_approved: false
      });

      res.status(201).json({ 
        message: 'Review submitted successfully',
        reviewId 
      });
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ error: 'Failed to create review' });
    }
  },

  // Update review status (approve/feature)
  updateReviewStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { is_approved, is_featured } = req.body;

      await db('platform_reviews')
        .where({ id })
        .update({ is_approved, is_featured });

      res.json({ message: 'Review status updated successfully' });
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ error: 'Failed to update review' });
    }
  }
};

module.exports = platformReviewController;