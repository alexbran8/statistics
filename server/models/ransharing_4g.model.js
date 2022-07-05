module.exports = (sequelize, type) => {
    const Ransharing = sequelize.define(
      "ransharing_weekly",
      {
        week: { type: type.STRING },
        caseName: {
          type: type.STRING,
          required: true,
        },
        diff1: {
          type: type.INTEGER,
          required: true,
        },
        diff2: {
            type: type.INTEGER,
            required: true,
          },
        createdBy: {
            type: type.STRING,
            required: true,
          },
          diff1Cells: {
            type: type.STRING,
            required: true,
          },
          diff2Cells: {
            type: type.STRING,
            required: true,
          },
          totalCells1: {
            type: type.STRING,
            required: true,
          },
          totalCells2: {
            type: type.STRING,
            required: true,
          },
        creationDate: {
          type: type.DATE(),
          required: true,
        },
      },
      { timestamps: false,  freezeTableName: true,  tableName: 'ransharing_weekly'},
      // {
      //   freezeTableName: true
      // },
      {}
    );
    return Ransharing;
  };
  