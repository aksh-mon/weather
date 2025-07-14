// app/weather/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import {
  Sun,
  CloudRain,
  Cloud,
  CloudSnow,
  CloudLightning,
  MapPin,
  RefreshCw,
  Clock,
  Wind,
  Droplets,
  Thermometer,
  Moon
} from 'lucide-react';

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  code: string;
  windSpeed: number;
  humidity: number;
  feelsLike: number;
}

const mockWeatherData = async (city: string): Promise<WeatherData> => {
  const types = [
    { code: 'sunny', label: 'Sunny', temp: 30 },
    { code: 'rain', label: 'Rainy', temp: 22 },
    { code: 'cloud', label: 'Cloudy', temp: 25 },
    { code: 'snow', label: 'Snowy', temp: 0 },
    { code: 'storm', label: 'Thunderstorm', temp: 20 }
  ];
  const random = types[Math.floor(Math.random() * types.length)];

  return {
    city,
    country: 'Demo',
    temperature: random.temp,
    condition: random.label,
    code: random.code,
    windSpeed: Math.floor(Math.random() * 20 + 5),
    humidity: Math.floor(Math.random() * 50 + 30),
    feelsLike: random.temp + Math.floor(Math.random() * 5 - 2)
  };
};

const getIcon = (code: string) => {
  switch (code) {
    case 'sunny': return <Sun className="w-12 h-12 text-yellow-400" />;
    case 'rain': return <CloudRain className="w-12 h-12 text-blue-400" />;
    case 'cloud': return <Cloud className="w-12 h-12 text-gray-400" />;
    case 'snow': return <CloudSnow className="w-12 h-12 text-blue-200" />;
    case 'storm': return <CloudLightning className="w-12 h-12 text-purple-400" />;
    default: return <Sun className="w-12 h-12 text-yellow-400" />;
  }
};

export default function WeatherPage() {
  const [city, setCity] = useState('Delhi');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [localTime, setLocalTime] = useState('');

  const loadWeather = async (targetCity: string) => {
    if (weather && weather.city.toLowerCase() === targetCity.toLowerCase()) return;
    setLoading(true);
    const data = await mockWeatherData(targetCity);
    setWeather(data);
    setLocalTime(new Date().toLocaleTimeString());
    setLoading(false);
  };

  useEffect(() => {
    loadWeather(city);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return (
    <div
      style={{fontFamily:'monospace'}}
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-100 text-black'
      }`}
    >
      <div className="w-full max-w-md shadow-md rounded-xl p-6 text-center border border-white/20 bg-white/20 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Weather App</h1>
          <button
            onClick={() => setIsDarkMode((prev) => !prev)}
            className="flex items-center gap-2 text-sm px-2 py-1 border rounded hover:bg-white/10"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDarkMode ? 'Light' : 'Dark'}
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <MapPin className="w-5 h-5" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border px-3 py-1 rounded-md w-2/3"
            placeholder="Enter city"
          />
          <button
            onClick={() => loadWeather(city)}
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 text-blue-500">
            <RefreshCw className="w-5 h-5 animate-spin" /> Loading...
          </div>
        ) : weather && (
          <div>
            <div className="flex justify-center mb-4">{getIcon(weather.code)}</div>
            <div className="text-xl font-semibold">{weather.city}, {weather.country}</div>
            <div className="text-3xl font-bold">{weather.temperature}°C</div>
            <div className={`${isDarkMode ? 'text-gray-100':'text-gray-700'} capitalize`}>{weather.condition}</div>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2 justify-center">
                <Thermometer className="w-4 h-4" />
                Feels Like: {weather.feelsLike}°C
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Wind className="w-4 h-4" /> Wind: {weather.windSpeed} km/h
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Droplets className="w-4 h-4" /> Humidity: {weather.humidity}%
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Clock className="w-4 h-4" />
                {localTime}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
