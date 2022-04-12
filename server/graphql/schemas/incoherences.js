const { gql } = require("apollo-server");

module.exports = gql`
input Incoherence {
    _2G: Int!
    _3G: Int!
    _4G: Int!
  }

  input IncoherencesSub {
    value: Int!
    technology: String!
    incoherence: String!
  }

input RansahringData {
  diff1: Int!
  diff2: Int!
  diff1Cells:String
  diff2Cells:String
  caseName: String!
  week: String
}

  type Response {
    success: String!
    message: String!
  }

  type Etat {
    Date: String
    CATEGORY: String
    count: Int
    ETAT: String
    percentage: String
  }

  type GetAllRansahring {
    diff1: Int!
    diff2: Int!
    diff1Cells:String
    diff2Cells:String
    caseName: String!
    week:String!
  }

  type IncoherenceModel {
    values: Int
    week: String
    technology: String
  }

  type IncoherenceSubModel {
    values: Int
    week: String
    technology: String
    incoherence: String
  }

extend type Mutation {
  saveData (data: [Incoherence], dataSub: [IncoherencesSub], week: String!):Response!
  saveRansharingData(data: [RansahringData], week: String!):Response!
}

extend type Query {
  getAll (first:Int!):[IncoherenceModel]
  getAllRansharing(selectedCase:String):[GetAllRansahring]
  getAllSubCat (first:Int!):[IncoherenceSubModel]
  refreshReporting(startDate:String! endDate:String!):[Etat]
}

`;