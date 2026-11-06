import { resolve } from 'aurelia';
import { WeatherService, type Weather } from './weather-service';

export class MyApp {
  private readonly weather = resolve(WeatherService);

  city = 'Brisbane';
  forecast: Promise<Weather> = this.weather.forCity(this.city);

  search() {
    this.forecast = this.weather.forCity(this.city);
  }
}
