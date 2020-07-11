import React from 'react';
import OpenWeather from '../OpenWeather';
import {TemperatureScale} from "./types";



type WeatherProps = {
    zip: string
};

type WeatherWidgetState = {
    zip: string,
    forecast: any,
    units: TemperatureScale
};

class Weather extends React.Component<WeatherProps, WeatherWidgetState> {

    state: WeatherWidgetState = {
        zip: '',
        forecast: null,
        units: TemperatureScale.Fahrenheit
    };

    componentDidMount(): void {
        const {zip} = this.props;
        this.getWeatherForecast(zip);
    }

    async getWeatherForecast(zip: string) {
        if(zip.length !== 5) return;

        let openWeather = new OpenWeather();
        let forecast = await openWeather.getForecastByZipCode(zip);

        console.log(forecast);
        //this.setState({forecast});
    }

    render() {
        const { forecast } = this.state;

        return (
            <div className="weather-widget">
                <div className="weather-widget__container">
                    <form>
                        <div>
                            <label htmlFor="zip">ZIP</label>
                            <input type="text"
                                   placeholder="Zip Code"
                                   defaultValue={this.props.zip}
                                   maxLength={5}
                                   onChange={(e) => this.getWeatherForecast(e.target.value)}/>
                        </div>
                        <div className="forecast">
                            <div className="forecast__container">
                                <h1>Forecast</h1>
                                {forecast
                                    ? <h2>{forecast.city.name}</h2>
                                    : <h2>no</h2>
                                }
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Weather;

