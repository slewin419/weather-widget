import React from 'react';
import './style/index.scss';
import './style/weather-icons.min.css';
import loader from './loader.gif';
import OpenWeather, {Forecast} from '../OpenWeather';
import {TemperatureScale} from "./types";
import BootstrapSwitchButton from 'bootstrap-switch-button-react';

type WeatherProps = {
    zipCode: string,
};

type WeatherWidgetState = {
    zipCode: string,
    forecast: Forecast,
    scale: TemperatureScale,
    error: Error | null
};

class Weather extends React.Component<WeatherProps, WeatherWidgetState> {

    state: WeatherWidgetState = {
        zipCode: '',
        forecast: {} as Forecast,
        scale: TemperatureScale.Fahrenheit,
        error: null
    };

    async getWeatherForecast(zipCode: string, scale?: TemperatureScale): Promise<Forecast> {
        if (zipCode.length !== 5) return {} as Forecast;

        let openWeather = new OpenWeather();
        return await openWeather.getForecastByZipCode(zipCode, scale);
    }

    async componentDidMount() {
        const {zipCode} = this.props;
        this.updateForecast(zipCode);
    }

    private async updateForecast(zipCode: string, scale?: TemperatureScale) {
        let forecast: Forecast;

        try {
            forecast = await this.getWeatherForecast(zipCode, scale);
            this.setState({zipCode, forecast, error: null});
        } catch (e) {
            this.setState({error: e});
        }
    }

    renderError(message: string) {

    }

    renderForecast(forecast: Forecast) {
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
        const {forecast, error, scale} = this.state;
        const checked = (scale === TemperatureScale.Fahrenheit);

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
                                   onChange={(e) => this.updateForecast(e.target.value, scale)}/>
                            <BootstrapSwitchButton
                                checked={checked}
                                onlabel="&#8457;"
                                offlabel="&#8451;"
                                onstyle="primary"
                                offstyle="info"
                                onChange={(checked: boolean) => {
                                    const scale = checked ? TemperatureScale.Fahrenheit : TemperatureScale.Celsius;
                                    this.setState({scale}, () => {
                                        this.updateForecast(this.state.zipCode, scale);
                                    });
                                }}
                            />
                        </div>
                        <div className={`forecast  ${!forecast.cityName ? "forecast--loading" : ""}`}>
                            {forecast && forecast.cityName
                                ? this.renderForecast(forecast)
                                : error ?
                                    <h2>{error?.message}</h2>
                                    : <img className="forecast__loader" src={loader} alt="loading"/>
                            }
                        </div>
                    </form>
                </div>
            </div>
        )
    }

}

export default Weather;

