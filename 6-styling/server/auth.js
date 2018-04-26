'use strict';

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passportJwt = require('passport-jwt');
const config = require('./config');
const token = require('./token');

const jwtOptions = {
  // Get the JWT from the "Authorization" header.
  // By default this looks for a "JWT " prefix
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  // The secret that was used to sign the JWT
  secretOrKey: config.auth.token.secret,
  // The issuer stored in the JWT
  issuer: config.auth.token.issuer,
  // The audience stored in the JWT
  audience: config.auth.token.audience
};

passport.use(new passportJwt.Strategy(jwtOptions, (payload, done) => {
  // payload.sub is the user id
  // payload is the full JWT object - issuer, audience, expiry
  return done(null, payload.sub, payload);
}));

function extractProfile (profile) {
  let imageUrl = '';
  if (profile.photos && profile.photos.length) {
    imageUrl = profile.photos[0].value;
  }
  return {
    id: profile.id,
    displayName: profile.displayName,
    image: imageUrl
  };
}

// Configure the Google strategy for use by Passport.js.
//
// OAuth 2-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Google API on the user's behalf,
// along with the user's profile. The function must invoke `cb` with a user
// object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new GoogleStrategy({
  clientID: config.auth.google.clientId,
  clientSecret: config.auth.google.clientSecret,
  callbackURL: 'http://localhost:3000/auth/google/callback',
  accessType: 'offline'
}, (accessToken, refreshToken, profile, cb) => {
  // Extract the minimal profile information we need from the profile object
  // provided by Google
  cb(null, extractProfile(profile));
}));

/*passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((obj, cb) => {
  cb(null, obj);
}); */
// [END setup]

const router = express.Router();

// Begins the authorization flow. The user will be redirected to Google where
// they can authorize the application to have access to their basic profile
// information. Upon approval the user is redirected to `/auth/google/callback`.
router.get(
  '/auth/login',

  // Start OAuth 2 flow using Passport.js
  passport.authenticate('google', { session: false, scope: ['email', 'profile'] })
);

// Using a string template here instead of a PUG template because adding the
// inline script is trivial this way
const authenticatedTemplate = (token, name, image) => `
<!-- src/public/authenticated.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>Authenticated</title>
  </head>
  <body>
    Authenticated successfully.

    <script type="text/javascript">
      window.authData = {
          token: ${token ? JSON.stringify(token) : null},
          image: ${image ? JSON.stringify(image) : null},
          name: ${name ? JSON.stringify(name) : null}
      };
      window.opener.authenticateCallback(window.authData);
      window.close();
    </script>
  </body>
</html>
`;

// At the top of this file, passport's GoogleStrategy is configured to redicert
// to this URL after authenticating
router.get(
  '/auth/google/callback',

  // Finish OAuth 2 flow using Passport.js
  passport.authenticate('google', { session: false }),

  // Send a generated JWT token and user info back in the popup window
  (req, res) => {
    const accessToken = token.generateAccessToken(req.user.id);
    res.send(authenticatedTemplate(accessToken, req.user.displayName, req.user.image));
  }
);

module.exports = {
  extractProfile: extractProfile,
  validateJwt: passport.authenticate('jwt', {session: false, assignProperty: 'userId'}),
  router: router
};