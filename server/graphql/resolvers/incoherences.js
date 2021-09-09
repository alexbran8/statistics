const e = require("cors");
const nodemailer = require("nodemailer");
const { db, transporterConfig } = require("../../config/configProvider")();

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

    // async normCheckQueryNA(root, args, context) {
    //   let result = await db.query(`SELECT * FROM get_norms_na()`);
    //   console.log('y')
    //   return result[0];

    // }
  },
  Mutation: {
    async saveData(root, data, context) {
      try {
        console.log(data)
        const response = {message: 'Data has been successfully saved!', success: true}
        return  response  
      }
               
      catch (error) {
        console.log(error)
        const response = {message: error, success: false}
        return  response
      }
    }
  }
}

