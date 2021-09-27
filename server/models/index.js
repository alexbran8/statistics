const Sequelize = require("sequelize");

const sequelize = new Sequelize("syntheseTools", "postgres", "fJdyP2Dyj@&6v!5hMM#VD", {
    host: "10.129.210.150",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.dailyTasks.model = require("./dailyTasks.model.js")(sequelize, Sequelize);
db.Incoherences = require("./incoherences.js")(sequelize, Sequelize);
db.IncoherencesCat = require("./incoherencesCat.js")(sequelize, Sequelize);
db.EtatReporting = require("./etatReporting.js")(sequelize, Sequelize);

// db.gallery = require("./gallery.js")(sequelize, Sequelize);
// db.cartItem = require("./cartItem.js")(sequelize, Sequelize);
// db.tags = require("./tags.js")(sequelize, Sequelize);
// db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
// db.comments = require("./comment.model.js")(sequelize, Sequelize);

// db.tutorials.hasMany(db.comments, { as: "comments" });
// db.comments.belongsTo(db.tutorials, {
//   foreignKey: "tutorialId",
//   as: "tutorial",
// });

// db.gallery.hasMany(db.tags, { as: "tags" });
// db.tags.belongsTo(db.gallery, {
//   foreignKey: "item",
//   as: "item",
// });

module.exports = db;
