import { resolve } from 'aurelia';
import { IHttpClient } from '@aurelia/fetch-client';

export interface Weather {
  place: string;
  country: string;
  temperature: number;
  wind: number;
  summary: string;
}

// Open-Meteo is free and needs no API key.
const summaries: Record<number, string> = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Light snow', 73: 'Snow',
  75: 'Heavy snow', 80: 'Showers', 81: 'Showers', 82: 'Heavy showers', 95: 'Thunderstorm',
};

export class WeatherService {
  private readonly http = resolve(IHttpClient);

  async forCity(city: string): Promise<Weather> {
    const search = await this.http.fetch(
      `https://geocoding-api.open-meteo.com/v1/search?count=1&name=${encodeURIComponent(city)}`,
    );
    const { results } = await search.json();
    if (!results?.length) throw new Error(`Couldn't find "${city}"`);

    const { latitude, longitude, name, country } = results[0];
    const forecast = await this.http.fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        '&current=temperature_2m,wind_speed_10m,weather_code',
    );
    const { current } = await forecast.json();

    return {
      place: name,
      country,
      temperature: Math.round(current.temperature_2m),
      wind: Math.round(current.wind_speed_10m),
      summary: summaries[current.weather_code] ?? 'Unknown',
    };
  }
}
