import {TemperatureScale} from "../Weather/types";

interface OpenWeatherAPIResponse {
    city: {
        coord: {
            lat: number,
            long: number
        },
        country: string,
        name: string,
        sunrise: number,
        sunset: number,
        timezone: number
    },
    cnt: number,
    cod: string,
    list: any[],
    message: number
}

interface Forecast {
    cityName: string,
    weather: Array<{dayOfWeek: string, temp: number}>
}

const API_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

export default class OpenWeather {

    private requestUrl: string = '';

    async getForecastByZipCode(zip: string, units: TemperatureScale = TemperatureScale.Fahrenheit): Promise<Forecast> {

        this.requestUrl = API_URL + `?zip=${zip},us&appid=${API_KEY}`
            + '&' + ((units === TemperatureScale.Fahrenheit) ? 'units=imperial': 'units=metric');

        let response = await fetch(this.requestUrl);
        let data = await response.json();

        return this.parseResponse(data);
    }

    /**
     * Creates a new object with less data for widget display.
     * @param response
     * @return Forecast
     */
    parseResponse(response: OpenWeatherAPIResponse): Forecast {

        let forecastData = {} as any;

        response.list.forEach(line => {
            const weekDay = new Date(line.dt_txt).toLocaleString('en-us', {weekday: 'short'});

            if(!forecastData[weekDay]) {
                forecastData[weekDay] = [];
            }

            forecastData[weekDay].push(line);
        });

        let forecast: Forecast = {
            cityName: '',
            weather: []
        };

        const daysOfWeek = Object.keys(forecastData);
        daysOfWeek.forEach(day => {

            const sumTemperatures = (a:number, b:any) => a+b.main?.temp;

            let averageTemp
                = Math.ceil(forecastData[day].reduce(sumTemperatures, 0) / forecastData[day].length);

            forecast.weather?.push({
                dayOfWeek: day,
                temp: averageTemp
            });
        });

        forecast.cityName = response.city.name;
        return forecast;
    }



}

