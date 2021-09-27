module.exports = (sequelize, type) => {
    const EtatReporting = sequelize.define(
      "EtatReporting",
      {
        percentage: { type: type.STRING },
        CATEGORY: {
          type: type.STRING,
        //   required: true,
        },
        ETAT: {
            type: type.STRING,
            field:'ETAT_EXPLOITATION_CRS'
            // required: true,
          },
        count: {
          type: type.INTEGER,
          required: true,
        },
        Date: {
          type: type.DATE(),
          required: true,
        },
      },
      { timestamps: false,  freezeTableName: true,  tableName: 'synthese_etat_reporting'},
      // {
      //   freezeTableName: true
      // },
      {}
    );
    return EtatReporting;
  };
  