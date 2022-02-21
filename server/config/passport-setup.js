const passport = require("passport");
const AzureOAuth2Strategy = require('passport-azure-ad-oauth2')
const keys = require("./keys");
const config = require('../config/config')

  passport.serializeUser((profile, done) => {
    done(null, profile)
  })

  passport.deserializeUser((profile, done) => {
    done(null, profile)
  })


passport.use(
  'adfs',
  new AzureOAuth2Strategy(
    {
      clientID: config.azureApp.clientID,
      clientSecret: config.azureApp.clientSecret,
      callbackURL: config.azureApp.callbackUri,
      resource: config.azureApp.resource,
      tenant: config.azureApp.tenant
    },
    (accessToken, refreshToken, params, profile, done) =>
      adfsStrategy(
        accessToken,
        refreshToken,
        params,
        profile,
        done
      )
  )
)

const adfsStrategy = require('./passport-adfs')
