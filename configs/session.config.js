const secret = process.env.SESSION_SECRET ||
  (process.env.NODE_ENV !== 'production' ? require('crypto').randomBytes(32).toString('hex') : null)
if (!secret || secret.length < 32) throw new Error('SESSION_SECRET must contain at least 32 characters')
module.exports = {
  secret, resave: false, saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' }
}
