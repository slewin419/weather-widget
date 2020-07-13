import {TemperatureScale} from "../Weather/types";

export interface OpenWeatherAPIResponse {
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
    message: string
}

export interface Forecast {
    cityName: string,
    weather: Array<{ dayOfWeek: string, temp: number, iconId: number }>
}

const API_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

export default class OpenWeather {

    /**
     * Get five day forecast by zip code from OpenWeatherMap.org API
     * @param zipCode
     * @param units
     */
    async getForecastByZipCode(zipCode: string, units: TemperatureScale = TemperatureScale.Fahrenheit): Promise<Forecast> {

        let requestUrl = API_URL +
            `?zip=${zipCode},us` +
            `&appid=${API_KEY}` +
            '&' + ((units === TemperatureScale.Fahrenheit) ? 'units=imperial' : 'units=metric');

        let data: OpenWeatherAPIResponse,
            response;

        try {
            response = await fetch(requestUrl);
            data = await response.json();
        } catch (e) {
            throw new Error(e);
        }

        if (data.cod === "404") {
            throw new Error(data.message);
        }

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
        forecast.cityName = response.city.name;

        const daysOfWeek = Object.keys(forecastData);

        daysOfWeek.forEach(day => {

            const sumTemperatures = (a:number, b:any) => a+b.main?.temp;

            let averageTemp
                = Math.ceil(forecastData[day].reduce(sumTemperatures, 0) / forecastData[day].length);

            //Get weather description from first record of the day
            let iconId = forecastData[day][0].weather[0].id;

            forecast.weather.push({
                dayOfWeek: day,
                temp: averageTemp,
                iconId: iconId
            });
        });

        return forecast;
    }

}

