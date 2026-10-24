const express = require('express')
const router = express.Router()

// Reject structured query operators before authentication or database lookups.
router.use(['/login', '/signup'], (req, res, next) => {
    if (req.method !== 'POST') return next()
    const body = req.body || {}
    if (typeof body.username !== 'string' || !body.username.trim() ||
        body.username.length > 128 || typeof body.password !== 'string' ||
        !body.password || Buffer.byteLength(body.password, 'utf8') > 72) {
        return res.status(400).json({ message: 'Invalid credentials format' })
    }
    return next()
})

const User = require('../models/User.model')
const bcrypt = require('bcrypt')
const bcryptSalt = 10
const passport = require('passport')



router.get('/signup', (req, res) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body

  if (!username || !password) {
    res.render('auth/signup', {
      errorMsg: 'Por favor, rellena el formulario con usuario y contraseña.',
    })
    return
  }

  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render('auth/signup', { errorMsg: 'Este usuario ya existe' })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User.create({ username, password: hashPass })
        .then(() => {
          res.redirect('/')
        })
        .catch((err) => {
          res.render('auth/signup', {
            errorMsg: 'No se ha podido crear el usuario',
          })
        })
    })
    .catch((err) => next(err))
})



router.get('/login', (req, res) => res.render('auth/login'))

router.post('/login', passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true,
  badRequestMessage: "Por favor, rellene todos los campos."
}))

module.exports = router;
