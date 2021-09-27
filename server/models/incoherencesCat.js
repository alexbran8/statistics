module.exports = (sequelize, type) => {
  const IncoherencesCat = sequelize.define(
    "incoherences_subcat_weekly",
    {
      week: { type: type.STRING },
      technology: {
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
      incoherence: {
        type: type.STRING,
        required:true
      }
    },
    { timestamps: false,  freezeTableName: true,  tableName: 'incoherences_subcat_weekly'},
    // {
    //   freezeTableName: true
    // },
    {}
  );
  return IncoherencesCat;
};
