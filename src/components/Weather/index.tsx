import React from 'react';
import './style/index.scss';
import './style/weather-icons.min.css';
import loader from './loader.gif';
import OpenWeather, {Forecast} from '../OpenWeather';
import {TemperatureScale} from "./types";


type WeatherProps = {
    zip: string
};

type WeatherWidgetState = {
    zip: string,
    forecast: Forecast,
    units: TemperatureScale,
    error: Error | null
};

class Weather extends React.Component<WeatherProps, WeatherWidgetState> {

    state: WeatherWidgetState = {
        zip: '',
        forecast: {} as Forecast,
        units: TemperatureScale.Fahrenheit,
        error: null
    };

    async componentDidMount() {
        const {zip} = this.props;
        let forecast: Forecast;

        try {
            forecast = await this.getWeatherForecast(zip);
            this.setState({forecast, error: null});
        } catch (e) {
            this.setState({error: e});
        }
    }

    async getWeatherForecast(zipCode: string): Promise<Forecast> {
        if (zipCode.length !== 5) return {} as Forecast;

        let openWeather = new OpenWeather();
        return await openWeather.getForecastByZipCode(zipCode);
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
                                   defaultValue={this.props.zip}
                                   maxLength={5}
                                   onChange={(e) => this.handleChange(e.target.value)}/>
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

    private async handleChange(value: string) {
        let forecast: Forecast;

        try {
            forecast = await this.getWeatherForecast(value);
            this.setState({forecast, error: null});
        } catch (e) {
            this.setState({error: e});
        }
    }

}

export default Weather;

