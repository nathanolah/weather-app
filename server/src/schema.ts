import { gql } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { IResolvers } from "@graphql-tools/utils";

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
    weatherByCityWithUnits(city: String!, units: String!): WeatherResponse
    weatherByCityCountryWithUnits(
      city: String!
      countryCode: String!
      units: String!
    ): WeatherResponse
    weatherByCoords(lat: Float!, lon: Float!): WeatherResponse
    weatherByCoordsWithUnits(
      lat: Float!
      lon: Float!
      units: String!
    ): WeatherResponse
  }
`;

// Resolver map
const resolvers: IResolvers = {
  Query: {
    weatherByCity: (_, { city }, { dataSources }) => {
      if (city === null || city === "") {
        throw new Error("City must be provided");
      }

      return dataSources.weatherAPI.withCity(city);
    },
    weatherByCityWithUnits: (_, { city, units }, { dataSources }) => {
      if (city === null || city === "") {
        throw new Error("City must be provided");
      }

      if (units === null || units === "") {
        throw new Error("Unit must be provided, either 'metric' or 'imperial'");
      }

      return dataSources.weatherAPI.withCityByUnits(city, units);
    },
    weatherByCityCountryWithUnits: (
      _,
      { city, countryCode, units },
      { dataSources }
    ) => {
      if (countryCode === null || countryCode === "") {
        throw new Error("Country code must be provided");
      }

      if (units === null || units === "") {
        throw new Error("Unit must be provided, either 'metric' or 'imperial'");
      }

      return dataSources.weatherAPI.withCityCountryByUnits(
        city,
        countryCode,
        units
      );
    },
    weatherByCoords: (_, { lat, lon }, { dataSources }) => {
      return dataSources.weatherAPI.withCoords(lat, lon);
    },
    weatherByCoordsWithUnits: (_, { lat, lon, units }, { dataSources }) => {
      if (units === "") {
        throw new Error("Unit must be provided, either 'metric' or 'imperial'");
      }

      return dataSources.weatherAPI.withCoordsByUnits(lat, lon, units);
    },
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });
