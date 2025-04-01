import { WeatherData } from '../../types';

interface WeatherCardProps {
  city: string;
  data: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ city, data }) => {
  return (
    <div className="p-4 bg-white shadow rounded-lg transition-transform transform hover:scale-105 hover:shadow-lg">
      <h3 className="text-lg font-semibold capitalize">{city}</h3>
      <p className="text-gray-600">Temperature: {data.main.temp}°C</p>
      <p className="text-gray-600">Humidity: {data.main.humidity}%</p>
      <p className="text-gray-600">Conditions: {data.weather[0].description}</p>
    </div>
  );
};

export default WeatherCard;