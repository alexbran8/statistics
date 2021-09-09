module.exports = (sequelize, type) => {
  const Incoherences = sequelize.define(
    "incoherences_weekly",
    {
      week: { type: type.STRING },
      tehnology: {
        type: type.STRING,
        required: true,
      },
      values: {
        type: type.INTEGER,
        required: true,
      },
      date: {
        type: type.DATE(),
        required: true,
      },
    },
    { timestamps: false,  freezeTableName: true,  tableName: 'incoherences_weekly'},
    // {
    //   freezeTableName: true
    // },
    {}
  );
  return Incoherences;
};
