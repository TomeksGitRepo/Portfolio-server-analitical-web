import { gql } from 'apollo-server-express';

let typeDefs = gql`
  type Record {
    rodzaj: String
    tytul: String
    zrodlo: String
  }

  type Data {
    tytul: String
    rodzaj: String
    tagi: [String]
    data: [Record]
    #TODO add this field createdAt: DateTime
  }

  type Query {
    hello: String
    getData: [Data]
  }
`;

export { typeDefs as default };
