const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        user.googleId = profile.id;
        await user.save();
      } else {
        const isAdmin = profile.emails[0].value?.trim().toLowerCase() === process.env.ADMIN_EMAIL?.trim().toLowerCase();
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: `google_${profile.id}`,
          googleId: profile.id,
          isVerified: true,
          role: isAdmin ? 'admin' : 'user',
        });
      }
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

module.exports = passport;
