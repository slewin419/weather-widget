import React from 'react';
import './style/index.scss';
import './style/weather-icons.min.css';
import loader from './loader.gif';
import OpenWeather, {Forecast} from '../OpenWeather';
import {TemperatureScale} from "./types";


type WeatherProps = {
    zipCode: string
};

type WeatherWidgetState = {
    zipCode: string,
    forecast: Forecast,
    units: TemperatureScale,
    error: Error | null
};

class Weather extends React.Component<WeatherProps, WeatherWidgetState> {

    state: WeatherWidgetState = {
        zipCode: '',
        forecast: {} as Forecast,
        units: TemperatureScale.Fahrenheit,
        error: null
    };

    private static async getWeatherForecast(zipCode: string): Promise<Forecast> {
        if (zipCode.length !== 5) return {} as Forecast;

        let openWeather = new OpenWeather();
        return await openWeather.getForecastByZipCode(zipCode);
    }

    async componentDidMount() {
        const {zipCode} = this.props;
        this.updateForecast(zipCode);
    }

    render() {
        const {forecast, error} = this.state;

        return (
            <div className="weather-widget">
                <div className="weather-widget__container">
                    <form className="form">
                        <div className="form__field">
                            <label htmlFor="zip">ZIP</label>
                            <input type="text"
                                   id="zipCode"
                                   placeholder="Zip Code"
                                   defaultValue={this.props.zipCode}
                                   maxLength={5}
                                   onChange={(e) => this.updateForecast(e.target.value)}/>
                        </div>
                        <div className={`forecast  ${!forecast.cityName ? "forecast--loading" : ""}`}>
                            {forecast && forecast.cityName
                                ? this.renderWidget(forecast)
                                : error ?
                                    <h2>{error?.message}</h2>
                                    : <img className="forecast__loader" src={loader}/>
                            }
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    private async updateForecast(zipCode: string) {
        let forecast: Forecast;

        try {
            forecast = await Weather.getWeatherForecast(zipCode);
            this.setState({forecast, error: null});
        } catch (e) {
            this.setState({error: e});
        }
    }

    renderWidget(forecast: Forecast) {
        const todaysForecast = forecast.weather.shift();

        return (
            <div className="forecast__container">
                <div className="forecast__panel forecast__panel--city">
                    <div>{forecast.cityName}</div>
                    <div>
                        <i className={`wi wi-owm-${todaysForecast?.iconId}`}> </i>
                    </div>
                </div>
                <div className="forecast__panel forecast__panel--today">
                    <strong>TODAY</strong>
                    <div className="forecast__temp">{todaysForecast?.temp}</div>
                </div>
                {
                    forecast.weather.map((day, i) => {
                        return (
                            <div className="forecast__panel" key={`${day}${i}`}>
                                <div>{day.dayOfWeek}</div>
                                <div className="forecast__temp">{day.temp}</div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

}

export default Weather;

