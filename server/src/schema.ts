import { gql } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { IResolvers } from "@graphql-tools/utils";

// const books = [
//   {
//     title: "The Awakening",
//     author: "Kate Chopin",
//   },
//   {
//     title: "City of Glass",
//     author: "Paul Auster",
//   },
// ];

// Schema definition
const typeDefs = gql`
  type WeatherTemp {
    temp: Float
    feelsLike: Float
    tempMin: Float
    tempMax: Float
    pressure: Int
    humidity: Int
  }

  type Weather {
    id: Int!
    main: String
    description: String
    icon: String
  }

  type Coordinates {
    lon: Float
    lat: Float
  }

  type WeatherResponse {
    id: Int!
    name: String
    timezone: Int
    base: String
    coord: Coordinates
    weather: [Weather]!
    main: WeatherTemp
  }

  type Query {
    weatherByCity(city: String!): WeatherResponse
    weatherByCoords(lat: Float!, lon: Float!): WeatherResponse
  }

  # type Book {
  #   title: String
  #   author: String
  # }

  # type Query {
  #   books: [Book]
  # }
`;

// Resolver map
const resolvers: IResolvers = {
  Query: {
    weatherByCity: (_, { city }, { dataSources }) => {
      return dataSources.weatherAPI.withCity(city);
    },
    weatherByCoords: (_, { lat, lon }, { dataSources }) => {
      return dataSources.weatherAPI.withCoords(lat, lon);
    },
  },

  // Query: {
  //   books() {
  //     return books;
  //   },
  // },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });
