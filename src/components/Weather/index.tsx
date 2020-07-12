import React from 'react';
import './style/index.scss';
import './style/weather-icons.min.css';
import OpenWeather, {Forecast} from '../OpenWeather';
import {TemperatureScale} from "./types";


type WeatherProps = {
    zip: string
};

type WeatherWidgetState = {
    zip: string,
    forecast: Forecast,
    units: TemperatureScale
};

class Weather extends React.Component<WeatherProps, WeatherWidgetState> {

    state: WeatherWidgetState = {
        zip: '',
        forecast: {} as Forecast,
        units: TemperatureScale.Fahrenheit
    };

    componentDidMount() {
        const {zip} = this.props;
        this.getWeatherForecast(zip).then(forecast => this.setState({forecast}));
    }

    async getWeatherForecast(zip: string): Promise<Forecast> {
        if (zip.length !== 5) return {} as Forecast;

        let openWeather = new OpenWeather();
        return await openWeather.getForecastByZipCode(zip);
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

    render() {
        const { forecast } = this.state;

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
                        <div className="forecast">
                            {forecast && forecast.cityName
                                ? this.renderWidget(forecast)
                                : <h2>Loading...</h2>
                                }
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    private handleChange(value: string) {
        this.getWeatherForecast(value).then(forecast => this.setState({forecast}));
    }

}

export default Weather;

