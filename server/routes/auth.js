const express = require('express')
const router = new express.Router()
const passport = require('passport')
const config = require('../config/config')

// const authCheckMiddleware = require("../middleware/auth-check")

router.get('login', (req, res) => {
  res.json({ message: 'Request login' })
})

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(`failed to /logout and destroy ${err.message}`)
    }
    res.redirect(config.baseLocation)
  })
})

router.get('/login-adfs', passport.authenticate('adfs', { session: false }))

router.get('/cbAdfs', passport.authenticate('adfs'), (req, res) => {
  // check if needed to add location based on env
  res.redirect('/home')
})

module.exports = router
