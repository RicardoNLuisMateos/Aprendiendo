import gql from 'graphql-tag';

export const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.6", import: ["@key", "@shareable"])

  type Query {
    works: String,
    getUsers(id: ID): [User]
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
    phone: String
		email: String
		address: String
		region: String
		country: String
		numberra: Int
    token: String
    password: String
  }
`;