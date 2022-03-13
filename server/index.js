const cookieSession = require("cookie-session");

const bodyParser = require('body-parser')
const express = require("express");
const app = express();
const port = 4000;
const passport = require("passport");
const passportSetup = require("./config/passport-setup");

const authRoutes = require("./routes/auth-routes");

const sequelize = require("sequelize");
const DataTypes = sequelize.DataTypes;
const Types = require("./models/types")(sequelize, DataTypes);
const keys = require("./config/keys");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // parse cookie header
const path = require("path");
// const config = require("./config/configProvider")();


const db = require("./models");


const { ApolloServer } = require("apollo-server-express");
var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");

const typeDefs = require("./graphql/schemas");
const resolvers = require("./graphql/resolvers");
const context = require("./graphql/context");

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // get the user token from the headers
    const token = req.headers.authorization || '';
    const user = req.headers || '';
    // console.log(user)
    // console.log(token)
   
    // try to retrieve a user with the token
    // const user = getUser(token);
    // var decoded = jwt.decode(token)
    // console.log('exp',new Date(1000 * decoded.exp));
    // console.log('now',new Date());

    // eliminated token expire check
    // TODO: check if this has been the issue...
    // if (new Date(1000 * decoded.exp) < new Date() )throw new AuthenticationError('token has expired');
   
    // optionally block the user
    // we could also check user roles/permissions here
    if (!user) throw new AuthenticationError('you must be logged in');
   
    // add the user to the context
    return { user };
   },

  // uploads: false,
  // context,
  // introspection: true,
  // playground: {
  //   settings: {
  //     "schema.polling.enable": false,
  //     "editor.fontSize": 18,
  //   },
  // },
});

// app.use(bodyParser.json())
app.use(bodyParser.json({
  limit: '50mb'
}));

app.use(bodyParser.urlencoded({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true 
}));


db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// define session
app.use(
  cookieSession({
    name: "session",
    keys: [keys.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100
  })
)

// parse cookies
app.use(cookieParser());

// initalize passport
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());

app.use("/static", express.static("static"));

// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);

// set up routes
app.use("/auth", authRoutes);

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated"
    });
  } else {
    next();
  }
};

const authCheckMiddleware = require('./middleware/auth-check')


app.use("/", express.static(path.resolve(__dirname, "../client/public/dist")));
app.use("/public", express.static(path.resolve(__dirname, "../client/public")));

// if it's already login, send the profile response,
// otherwise, send a 401 response that the user is not authenticated
// authCheck before navigating to home page
// app.get("/", authCheck, (req, res) => {
//   res.status(200).json({
//     authenticated: true,
//     message: "user successfully authenticated",
//     user: req.user,
//     cookies: req.cookies
//   });
// });


const options = {
  port: 4000,
  bodyParserOptions: { limit: "10mb", type: "application/json" },
};


apolloServer.start().then(res => {
  apolloServer.applyMiddleware({ app, path: "/graphql" });
  app.listen(options, () => console.log(`Server is running on port ${port}!`));
 })
