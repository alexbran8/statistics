const Sequelize = require("sequelize");
/* 
 * create a `.env` file with environment variables in order to laod at runtime.
*/

const hostUrl = process.env.NODE_ENV === `development` ? "http://localhost:4000/auth/azure/redirect" :  'https://cdrbeta.eecloud.dynamic.nsn-net.net/auth/azure/redirect';
const baseLocation = process.env.NODE_ENV === `development` ? "" :  '';



var config = {
  CLIENT_HOME_PAGE_URL: process.env.NODE_ENV === `development` ? "http://localhost:3000/#/home" :  'https://cdrbeta.eecloud.dynamic.nsn-net.net/#/home',
  CLIENT_ERROR_URL: process.env.NODE_ENV === `development` ? "http://localhost:3000/#/error" :  'https://cdrbeta.eecloud.dynamic.nsn-net.net/#/error',
  azureApp: {
    // Azure Application details
    base: process.env.AAD_AUTH_URL || 'https://login.microsoftonline.com/',
    clientID: process.env.AAD_AUTH_CLIENTID || '6181870f-f95d-482e-9956-0ccc95ae9789',
    clientSecret: process.env.AAD_AUTH_CLIENTSECRET || 'B6rFwdW6-adys1~-jj.1FJcP2~D..zL9XD',
    callbackUri: hostUrl + '/auth/cbAdfs',
    resource: process.env.MS_GRAPH_URL || 'https://graph.microsoft.com/',
    tenant: process.env.AAD_AUTH_TENANT || '5d471751-9675-428d-917b-70f44f9630b0'
  },
  baseLocation: baseLocation,
  jwtSecret: process.env.APP_SESSION_SECRET || 'big Secret',
  cookieSettings: {
    maxAge: 360000
  },
  serverPort: process.env.PORT || 8080,
  db: new Sequelize("npt", "postgres", "fJdyP2Dyj@&6v!5hMM#VD", {
    host: "10.129.210.150",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }),
}

module.exports = config
