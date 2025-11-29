const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('../db');
const { generateToken } = require('../utils/token');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      passReqToCallback: true, // Enable request object access
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Get role from query params or session, default to 'user'
        const desiredRole = req.query.role || req.session.oauthRole || 'user';
        console.log('🔍 Google OAuth - Desired role:', desiredRole, 'Query:', req.query.role, 'Session:', req.session.oauthRole);
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        if (!email) {
          return done(null, false, { message: 'No email returned from Google' });
        }

        // Look up by email in both tables to enforce one-role-per-email
        let userUser = await db('users').where({ email }).first();
        let userLawyer = await db('lawyers').where({ email }).first();

        let roleToUse = desiredRole;
        let userRecord = null;
        let tableName = desiredRole === 'lawyer' ? 'lawyers' : 'users';

        // If exists in both (data inconsistency), handle based on desired role
        if (userUser && userLawyer) {
          console.warn('⚠️ Email exists in both users and lawyers tables for', email);
          
          // Use the desired role if the account exists for that role
          if (desiredRole === 'lawyer') {
            roleToUse = 'lawyer';
            tableName = 'lawyers';
            userRecord = userLawyer;
            console.log('✅ Using existing lawyer account for', email);
          } else {
            roleToUse = 'user';
            tableName = 'users';
            userRecord = userUser;
            console.log('✅ Using existing user account for', email);
          }
        } else if (desiredRole === 'user') {
          if (userLawyer && !userUser) {
            // Redirect to error page - can't login as user when lawyer account exists
            return done(null, false, { message: 'This email is registered as a lawyer. Please select "Lawyer" and try again.' });
          } else if (userUser) {
            roleToUse = 'user';
            tableName = 'users';
            userRecord = userUser;
          }
        } else if (desiredRole === 'lawyer') {
          if (userUser && !userLawyer) {
            // Redirect to error page - can't login as lawyer when user account exists
            return done(null, false, { message: 'This email is registered as a user. Please select "User" and try again.' });
          } else if (userLawyer) {
            roleToUse = 'lawyer';
            tableName = 'lawyers';
            userRecord = userLawyer;
          }
        }

        // If account exists with password, block OAuth login for safety
        if (userRecord && userRecord.password && userRecord.password !== '') {
          return done(null, false, { message: 'Account already exists with this email. Please login with your password.' });
        }

        // Create new record if none exists in either table
        if (!userRecord) {
          const insertData = {
            name: profile.displayName,
            email,
            email_verified: 1,
            google_id: profile.id,
            password: '', // OAuth users don't need password
            avatar: (profile.photos && profile.photos[0] && profile.photos[0].value) || null,
            profile_completed: 0, // Always require setup for new OAuth users
          };

          if (roleToUse === 'lawyer') {
            insertData.is_verified = 0; // Lawyers need to complete profile first
            insertData.lawyer_verified = 0; // Lawyers need to complete profile first
          } else {
            insertData.role = 'user';
            insertData.is_verified = 0; // Users also need to complete profile first
          }

          const [id] = await db(tableName).insert(insertData);
          userRecord = await db(tableName).where({ id }).first();
          console.log(`🆕 Created new ${roleToUse} OAuth user:`, { id, email, profile_completed: 0 });
        } else {
          // Ensure google_id is set for existing users
          if (!userRecord.google_id) {
            const updateData = {
              google_id: profile.id,
              email_verified: 1,
            };
            // Don't auto-verify existing users - let them complete profile if needed
            await db(tableName).where({ id: userRecord.id }).update(updateData);
            userRecord = await db(tableName).where({ id: userRecord.id }).first();
            console.log(`🔄 Updated existing user with Google ID:`, { id: userRecord.id, email });
          }
        }

        // Ensure userRecord has all required fields
        if (!userRecord || !userRecord.id) {
          console.error('❌ Invalid user record after OAuth processing');
          return done(null, false, { message: 'Failed to create or retrieve user account' });
        }

        const token = generateToken(userRecord);
        console.log(`✅ Google OAuth success - Role: ${roleToUse}, Email: ${email}, ID: ${userRecord.id}, ProfileCompleted: ${userRecord.profile_completed}`);
        done(null, { user: userRecord, token, role: roleToUse });
      } catch (error) {
        console.error('❌ Google OAuth error:', error.message);
        console.error('Full error:', error);
        done(null, false, { message: error.message });
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || '/api/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails'],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        const role = (req.query && req.query.role) || 'user'; // default to user
        const tableName = role === 'lawyer' ? 'lawyers' : 'users';

        // Check if user/lawyer already exists
        let user = await db(tableName).where({ email }).first();

        if (user && user.password && user.password !== '') {
          // Account exists with password, don't allow OAuth login
          return done(null, false, { message: 'Account already exists with this email. Please login with your password.' });
        }

        if (!user) {
          const insertData = {
            name: profile.displayName,
            email,
            role: 'user', // Default to user for Facebook
            email_verified: 1,
            facebook_id: profile.id,
            password: '', // OAuth users don't need password
            profile_completed: 0, // Mark as incomplete
            is_verified: 0, // Pending until submit later or completion
          };

          const [id] = await db('users').insert(insertData);
          user = await db('users').where({ id }).first();
        } else {
          // Update facebook_id if not set
          if (!user.facebook_id) {
            await db('users').where({ id: user.id }).update({
              facebook_id: profile.id,
              email_verified: 1,
            });
            user = await db('users').where({ id: user.id }).first();
          }
        }

        const token = generateToken(user);
        done(null, { user, token });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
