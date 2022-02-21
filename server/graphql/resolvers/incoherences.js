const e = require("cors");

const db = require("../../models");
const { Op } = require("sequelize");
// const { default: IncoherenceReporting } = require("../../../client/src/components/IncoherenceReporting");
const errorHandler = (err, req, res, next) => {
  const { code, desc = err.message } = err;
  res.status(code || 500).json({ data: null, error: desc });
};



module.exports = {
  Query: {
    async refreshReporting(root, args, context) {
      console.log(args)
      const start = new Date(args.startDate ) 
      const end = new Date(args.endDate ) 
      console.log(start)
      // return etat_reporting.objects.filter(Date__range=(endDate,startDate)).order_by('Date').all()
      let result = await db.EtatReporting.findAll({
        where:{ Date: {
          [Op.between]: [start,end],
         },
        },
        order: [
          ['Date', 'ASC'],
      ],});
      
      return result;
    },

    async getAll(root, args, context) {
      try{
      let result = await db.Incoherences.findAll({
        // where: where(sequelize.fn('YEAR', sequelize.col('date')), '2021'),
        // where: sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), 2021),        
        // where: { [Op.and]: [dateFilter, weekFilter, itvFilter, statusFilter, siteFilter, responsibleFilter] },
        limit: 15,
        order: [
          ['date', 'DESC'],
      ],
      });
      // let result = await db.sequelize.query('SELECT id, technology, date, week, "values" FROM public.incoherences_weekly where EXTRACT(YEAR FROM date) = 2022 order by date DESC')
      console.log(result)

      return result;
      }
      catch (error) {
        console.log(error)
      }
    },
    async getAllSubCat(root, args, context) {
      let result = await db.IncoherencesCat.findAll({
        // where: { [Op.and]: [dateFilter, weekFilter, itvFilter, statusFilter, siteFilter, responsibleFilter] },
        // limit: args.first,
        order: [
          ['date', 'DESC'],
          // ['week', 'DESC'],
      ],
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

          let incoherencesCat = [];
          console.log(data.dataSub)

          for (var i=0; i<data.dataSub.length; i++) {
            const row = {
              values: data.dataSub[i].value,
              technology: data.dataSub[i].technology,
              incoherence: data.dataSub[i].incoherence,
              week: data.week,
              date: Date.now()
            }

            incoherencesCat.push(row)
          }
          
          db.IncoherencesCat.bulkCreate(incoherencesCat)
          
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

