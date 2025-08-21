const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");


passport.serializeUser(() => {});
passport.deserializeUser(() => {});

const upsertSocialUser = async ({ provider, id, emails, displayName }) => {
  const email = emails?.[0]?.value?.toLowerCase();
  if (!email) throw new Error("No email provided by provider");

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: displayName || "New User",
      email,
      password: "", 
      role: "user",
      emailVerified: true, 
    });
  }
  return user;
};


if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await upsertSocialUser({
            provider: "google",
            id: profile.id,
            emails: profile.emails,
            displayName: profile.displayName,
          });
          return done(null, user);
        } catch (e) {
          return done(e);
        }
      }
    )
  );
}


if (process.env.GITHUB_CLIENT_ID) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          
          const emails = profile.emails || [];
          const user = await upsertSocialUser({
            provider: "github",
            id: profile.id,
            emails,
            displayName: profile.displayName || profile.username,
          });
          return done(null, user);
        } catch (e) {
          return done(e);
        }
      }
    )
  );
}

module.exports = passport;
