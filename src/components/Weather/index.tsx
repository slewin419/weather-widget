import React from 'react';

enum TemperatureScale {
    Fahrenheit,
    Celsius
}

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

    componentWillMount(): void {
        const {zip} = this.props;
        this.getWeatherForecast(zip);
    }

    async getWeatherForecast(zip: string) {
        if(zip.length !== 5) return;
        const { units } = this.state;

        const OPEN_WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';
        const API_KEY = '74d9bc317f6cb40688304324e3555d46';

        let requestForecastUrl = OPEN_WEATHER_API_URL + `?zip=${zip},us&appid=${API_KEY}`;
        requestForecastUrl += '&' + ((units === TemperatureScale.Fahrenheit) ? 'units=imperial': 'units=metric');

        let forecast = await fetch(requestForecastUrl);
        forecast = await forecast.json();

        this.setState({forecast});
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

