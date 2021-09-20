const e = require("cors");

const db = require("../../models");

const errorHandler = (err, req, res, next) => {
  const { code, desc = err.message } = err;
  res.status(code || 500).json({ data: null, error: desc });
};



module.exports = {
  Query: {
    // async normCheckQuery(root, args, context) {
    //   console.log(args)
    //   let result = await db.query(`SELECT * FROM get_norms_check('${args.department}')`);
    //   return result[0];

    // },

    async getAll(root, args, context) {
      let result = await db.Incoherences.findAll({
        // where: { [Op.and]: [dateFilter, weekFilter, itvFilter, statusFilter, siteFilter, responsibleFilter] },
        limit: args.first
      });
      console.log(result[0])

      return result;

    }
  },
  Mutation: {
    async saveData(root, data, context) {
      try {
        
        let check = await db.Incoherences.findAll({
          where: {
          week: data.week
          }
        });

        console.log()

        if(check[0] === undefined) {

        let incoherences = [];

          const row2G = {
            technology: "2G",
            week: data.week,
            values: data.data[0]["_2G"],
            date: Date.now(),
          }
          const row3G = {
            technology: "3G",
            week: data.week,
            values: data.data[0]["_3G"],
            date: Date.now(),
          }
          const row4G = {
            technology: "4G",
            week: data.week,
            values: data.data[0]["_4G"],
            date: Date.now(),
          }

          incoherences.push(row2G)
          incoherences.push(row3G)
          incoherences.push(row4G)
          db.Incoherences.bulkCreate(incoherences)
          
          const response = {message: 'Data has been successfully saved!', success: true}
          return  response  
        }
        else
        {
          const response = {message: 'Data for this week already exists!', success: false}
          return  response  
        }
          
        }

               
      catch (error) {
        console.log(error)
        const response = {message: error, success: false}
        return  response
      }
    }
  }
}

