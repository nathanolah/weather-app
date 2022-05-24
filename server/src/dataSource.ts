import { RequestOptions, RESTDataSource } from "apollo-datasource-rest";
import camelcaseKeys from "camelcase-keys";

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

export class WeatherAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_URL!;
  }

  willSendRequest(request: RequestOptions) {
    request.params.set("appid", API_KEY!);
  }

  async withCoords(lat: number, lon: number) {
    const data = await this.get("weather", { lat, lon });
    return camelcaseKeys(data, { deep: true });
  }

  async withCoordsByUnits(lat: number, lon: number, units: string) {
    const data = await this.get("weather", { lat, lon, units });
    return camelcaseKeys(data, { deep: true });
  }

  async withCity(city: string) {
    const data = await this.get("weather", { q: city });
    return camelcaseKeys(data, { deep: true });
  }

  async withCityByUnits(city: string, units: string) {
    const data = await this.get("weather", { q: city, units });
    return camelcaseKeys(data, { deep: true });
  }

  async withCityCountryByUnits(
    city: string,
    countryCode: string,
    units: string
  ) {
    const data = await this.get("weather", {
      q: city + "," + countryCode,
      units,
    });
    return camelcaseKeys(data, { deep: true });
  }
}

// Initializes and returns an object with all of the data sources.
export const dataSources = () => ({ weatherAPI: new WeatherAPI() });
