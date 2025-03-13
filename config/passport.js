const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,       // Set in .env
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Set in .env
  callbackURL: "/auth/google/callback"
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = new User({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '',
          avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
          role: 'user',
          createdAt: new Date()
        });
        await user.save();
      } else {
        user.lastLogin = new Date();
        await user.save();
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
