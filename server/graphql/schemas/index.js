const { gql } = require("apollo-server");

const incoherences = require("./incoherences");


const rootType = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
`;

module.exports = [rootType, incoherences];
