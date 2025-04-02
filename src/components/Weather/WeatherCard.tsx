// src/components/Weather/WeatherCard.tsx
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addCityToFavorites, removeCityFromFavorites } from '../../redux/slices/favoritesSlice';

interface WeatherCardProps {
  city: string;
  data: {
    main: { temp: number };
    weather: { description: string; icon: string }[];
  };
  className?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ city, data, className }) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.cities);
  const isFavorite = favorites.includes(city);

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeCityFromFavorites(city));
    } else {
      dispatch(addCityToFavorites(city));
    }
  };

  return (
    <div className={`card flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 ${className}`}>
      <div>
        <Link href={`/city/${city}`}>
          <h3 className="text-lg sm:text-xl font-semibold capitalize text-gray-800 hover:text-blue-600 transition-colors">
            {city}
          </h3>
        </Link>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Temperature: {data.main.temp}°C</p>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Condition: {data.weather[0].description}</p>
      </div>
      <div className="flex items-center space-x-3">
        <img
          src={`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
          alt={`Weather icon for ${data.weather[0].description} in ${city}`}
          className="w-10 h-10 sm:w-12 sm:h-12"
        />
        <button
          onClick={toggleFavorite}
          className={`btn p-2 rounded-full ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
          } hover:bg-opacity-90 focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
          aria-label={isFavorite ? `Remove ${city} from favorites` : `Add ${city} to favorites`}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
};

export default WeatherCard;