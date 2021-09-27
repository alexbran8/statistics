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

  type IncoherenceModel {
    values: Int
    week: String
    technology: String
  }

extend type Mutation {
  saveData (data: [Incoherence],  week: String!):Response!
}

extend type Query {
  getAll (first:Int!):[IncoherenceModel]
  refreshReporting(startDate:String! endDate:String!):[Etat]
}
`;