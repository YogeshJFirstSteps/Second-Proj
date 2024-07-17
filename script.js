document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch weather data based on user input
    const fetchWeatherForCity = () => {
        const city = document.querySelector('.location-input').value;
        getWeather(city);
    };

    // Event listener for the location input
    document.querySelector('.location-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchWeatherForCity();
        }
    });

    // Function to get weather data
    async function getWeather(city) {
        try {
            const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
                params: {
                    q: city,
                    appid: '54a57bc234ad752a4f59e59cd372201d',
                    units: 'metric'
                },
            });

            const { list, city: { name: cityName } } = response.data;
            const currentWeather = list[0];
            const { temp } = currentWeather.main;
            const { description, icon: currentWeatherIconCode } = currentWeather.weather[0];
            const { humidity } = currentWeather.main;
            const { speed: windSpeed } = currentWeather.wind;

            document.querySelector('.weather-temp').textContent = Math.round(temp) + 'ºC';
            document.querySelector('.weather-desc').textContent = description.charAt(0).toUpperCase() + description.slice(1);
            document.querySelector('.location').textContent = cityName;
            document.querySelector('.humidity .value').textContent = humidity + '%';
            document.querySelector('.wind .value').textContent = (windSpeed * 3.6).toFixed(2) + ' km/h';

            const now = new Date();
            document.querySelector('.date-dayname').textContent = now.toLocaleDateString('en-US', { weekday: 'long' });
            document.querySelector('.date-day').textContent = now.toDateString();

            const weatherIconElement = document.querySelector('.weather-icon');
            weatherIconElement.innerHTML = getWeatherIcon(currentWeatherIconCode);

            const dayElements = document.querySelectorAll('.day-name');
            const tempElements = document.querySelectorAll('.day-temp');
            const iconElements = document.querySelectorAll('.day-icon');

            const forecastDays = list.filter(item => new Date(item.dt * 1000).getHours() === 12).slice(0, 5);

            forecastDays.forEach((data, index) => {
                const day = new Date(data.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
                dayElements[index].textContent = day;
                tempElements[index].textContent = `${Math.round(data.main.temp_min)}º / ${Math.round(data.main.temp_max)}º`;
                iconElements[index].innerHTML = getWeatherIcon(data.weather[0].icon);
            });

        } catch (error) {
            console.error('An error occurred while fetching data:', error.message);
            document.querySelector('.error-message').textContent = 'Could not fetch weather data. Please try again later.';
        }
    }

    // Function to get weather icon HTML
    function getWeatherIcon(iconCode) {
        return `<img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon">`;
    }

    // Fetch weather data for the default city on page load
    getWeather('Solapur');
});



