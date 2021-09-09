const { gql } = require("apollo-server");

module.exports = gql`
input Incoherence {
    _2G: Int!
    _3G: Int!
    _4G: Int!
  }
  type Response {
    success: String!
    message: String!
  }


extend type Mutation {
  saveData (data: [Incoherence], week: String!):Response!
}
`;