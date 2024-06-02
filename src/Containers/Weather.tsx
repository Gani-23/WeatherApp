import React, { useEffect, useState, FormEvent } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface WeatherData {
    location: {
        name: string;
    };
    current: {
        temp_c: number;
        temp_f: number;
        condition: {
            text: string;
            icon: string;
        };
        wind_kph: number;
        precip_mm: number;
        uv: number;
        humidity: number;
        visibility_km: number;
    };
    forecast: {
        forecastday: {
            date: string;
            day: {
                maxtemp_c: number;
                maxtemp_f: number;
                mintemp_c: number;
                mintemp_f: number;
                condition: {
                    text: string;
                    icon: string;
                };
            };
        }[];
    };
}

interface ForecastCardProps {
    date: string;
    maxTemp: number;
    minTemp: number;
    conditionText: string;
    conditionIcon: string;
    tempUnit: 'C' | 'F';
}

const ForecastCard: React.FC<ForecastCardProps> = ({
    date,
    maxTemp,
    minTemp,
    conditionText,
    conditionIcon,
    tempUnit,
}) => (
    <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="m-4 p-4 bg-white bg-opacity-10 rounded-lg shadow-lg text-center backdrop-filter backdrop-blur-lg"
    >
        <h3 className="text-lg font-semibold">{date}</h3>
        <img src={conditionIcon} alt={conditionText} className="mx-auto" />
        <p>{conditionText}</p>
        <p>Max temp: {tempUnit === 'C' ? maxTemp : ((maxTemp * 9/5) + 32).toFixed(1)}°{tempUnit}</p>
        <p>Min temp: {tempUnit === 'C' ? minTemp : ((minTemp * 9/5) + 32).toFixed(1)}°{tempUnit}</p>
    </motion.div>
);

const Weather: React.FC = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');

    useEffect(() => {
        if (searchQuery) {
            axios
                .get<WeatherData>(
                    `https://api.weatherapi.com/v1/forecast.json?key=83ef98777f7d4279b8b110122242203&q=${searchQuery}&days=5`
                )
                .then((response) => {
                    setWeatherData(response.data);
                    setError(null);
                })
                .catch((error) => {
                    console.error(`Error: ${error}`);
                    setError('Location is not available');
                    setWeatherData(null);
                });
        }
    }, [searchQuery]);

    const toggleTempUnit = () => {
        setTempUnit(tempUnit === 'C' ? 'F' : 'C');
    };

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const target = event.target as typeof event.target & {
            location: { value: string };
        };
        setSearchQuery(target.location.value);
    };

    const getWeatherAnimation = (condition: string) => {
        switch (condition.toLowerCase()) {
            case 'sunny':
                return (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="sun"
                    >
                        ☀️
                    </motion.div>
                );
            case 'cloudy':
                return (
                    <motion.div
                        animate={{ x: [0, 10, -10, 0], y: [0, -10, 10, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="cloud"
                    >
                        ☁️
                    </motion.div>
                );
            case 'rain':
                return (
                    <motion.div
                        animate={{ y: [0, 10, 0], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="rain"
                    >
                        🌧️
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="font-sans text-center p-10"
            style={{
                background: 'linear-gradient(135deg, #f0f0f0 0%, #c9d6ff 100%)',
                minHeight: '100vh',
                minWidth: '100vw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="text-4xl mb-4"
                style={{ color: '#333' }}
            >
                Weather App
            </motion.h1>

            <button
                onClick={toggleTempUnit}
                className="mb-4 rounded-lg p-2"
                style={{ backgroundColor: '#333', color: '#fff' }}
            >
                Switch to {tempUnit === 'C' ? 'Fahrenheit' : 'Celsius'}
            </button>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', alignItems: 'center' }}
            >
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    onSubmit={handleSearch}
                    className="mb-4"
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    <motion.input
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        type="text"
                        name="location"
                        placeholder="Enter location"
                        className="rounded-lg p-2"
                        style={{ border: '1px solid #333' }}
                    />
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="submit"
                        className="rounded-lg p-2 ml-2"
                        style={{ backgroundColor: '#333', color: '#fff' }}
                    >
                        Search
                    </motion.button>
                </motion.form>
                {error && <p className="text-red-500">{error}</p>}
            </motion.div>
            {weatherData && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center flex-wrap"
                >
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5 }}
                        className="m-4 p-4 bg-white bg-opacity-10 rounded-lg shadow-lg text-center backdrop-filter backdrop-blur-lg"
                    >
                        <h1 className="text-4xl mb-4" style={{ color: '#333' }}>
                            Current Weather in {weatherData.location.name}
                        </h1>
                        <h2 className="text-2xl">
                            {tempUnit === 'C'
                                ? weatherData.current.temp_c
                                : ((weatherData.current.temp_c * 9/5) + 32).toFixed(1)}
                            °{tempUnit}
                        </h2>
                        {getWeatherAnimation(weatherData.current.condition.text)}
                        <img
                            src={weatherData.current.condition.icon}
                            alt={weatherData.current.condition.text}
                        />
                        <p>{weatherData.current.condition.text}</p>
                        <p>Wind: {weatherData.current.wind_kph} kph</p>
                        <p>Precipitation: {weatherData.current.precip_mm} mm</p>
                        <p>UV Index: {weatherData.current.uv}</p>
                        <p>Humidity: {weatherData.current.humidity}%</p>
                        <p>Visibility: {weatherData.current.visibility_km} km</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl mt-4" style={{ color: '#333' }}>5 Day Forecast</h2>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-wrap justify-center"
                        >
                            {weatherData.forecast.forecastday.map((day, index) => (
                                <ForecastCard
                                    key={index}
                                    date={day.date}
                                    maxTemp={Number(tempUnit === 'C' ? day.day.maxtemp_c : ((day.day.maxtemp_c * 9/5) + 32).toFixed(1))}
                                    minTemp={Number(tempUnit === 'C' ? day.day.mintemp_c : ((day.day.mintemp_c * 9/5) + 32).toFixed(1))}
                                    conditionText={day.day.condition.text}
                                    conditionIcon={day.day.condition.icon}
                                    tempUnit={tempUnit}
                                />
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Weather;
