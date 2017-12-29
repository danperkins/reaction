const jwt = require('jsonwebtoken');
const config = require('./config');

// Generate an Access Token for the given User ID
function generateAccessToken(userId) {
  // How long will the token be valid for
  const expiresIn = '1 hour';
  // Which service issued the token
  const issuer = config.auth.token.issuer;
  // Which service is the token intended for
  const audience = config.auth.token.audience;
  // The signing key for signing the token
  const secret = config.auth.token.secret;

  const token = jwt.sign({}, secret, {
    expiresIn: expiresIn,
    audience: audience,
    issuer: issuer,
    subject: userId.toString()
  });

  return token;
}

module.exports = {
    generateAccessToken: generateAccessToken
}