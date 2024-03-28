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
        className="m-4 p-4 bg-white rounded-lg shadow-lg text-center"
    >
        <h3>{date}</h3>
        <img src={conditionIcon} alt={conditionText} />
        <p>{conditionText}</p>
        <p>Max temp: {tempUnit === 'C' ? maxTemp : maxTemp}°{tempUnit}</p>
        <p>Min temp: {tempUnit === 'C' ? minTemp : minTemp}°{tempUnit}</p>
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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`font-poppins text-center p-10`}
            style={{ backgroundColor: 'white', height: '100vh', width: '100vw' }}
        >
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="text-4xl mb-4"
            >
                Weather App
            </motion.h1>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
            >
                <button onClick={toggleTempUnit} className="mr-4 rounded-lg p-2">
                    Switch to {tempUnit === 'C' ? 'Fahrenheit' : 'Celsius'}
                </button>
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    onSubmit={handleSearch}
                    className="mb-4"
                >
                    <motion.input
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        type="text"
                        name="location"
                        placeholder="Enter location"
                        className="rounded-lg p-2"
                    />
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="submit"
                        className="rounded-lg p-2"
                    >
                        Search
                    </motion.button>
                </motion.form>
                {error && <p>{error}</p>}
            </motion.div>
            {weatherData && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center"
                >
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5 }}
                        className="m-4 p-4 bg-white rounded-lg shadow-lg text-center"
                    >
                        <h1 className="text-4xl mb-4">
                            Current Weather in {weatherData.location.name}
                        </h1>
                        <h2 className="text-2xl">
                            {tempUnit === 'C' ? weatherData.current.temp_c : weatherData.current.temp_f}°{tempUnit}
                        </h2>
                        <img src={weatherData.current.condition.icon} alt={weatherData.current.condition.text} />
                        <p>{weatherData.current.condition.text}</p>
                        <p>Wind: {weatherData.current.wind_kph} kph</p>
                        <p>Precipitation: {weatherData.current.precip_mm} mm</p>
                        <p>UV Index: {weatherData.current.uv}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5 , rotate: 50}}
                    >
                        <h2 className="text-3xl mt-4">5 Day Forecast</h2>
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
                                    maxTemp={day.day.maxtemp_c}
                                    minTemp={day.day.mintemp_c}
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
