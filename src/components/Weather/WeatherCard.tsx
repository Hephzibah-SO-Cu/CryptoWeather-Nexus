import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addCityToFavorites, removeCityFromFavorites } from '../../redux/slices/favoritesSlice';

interface WeatherCardProps {
  city: string;
  data: {
    main: { temp: number };
    weather: { description: string; icon: string }[];
  };
}

const WeatherCard: React.FC<WeatherCardProps> = ({ city, data }) => {
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
    <div className="p-4 bg-white shadow rounded-lg flex justify-between items-center">
      <div>
        <Link href={`/city/${city}`}>
          <h3 className="text-xl font-semibold capitalize cursor-pointer hover:underline">{city}</h3>
        </Link>
        <p className="text-gray-600">Temperature: {data.main.temp}°C</p>
        <p className="text-gray-600">Condition: {data.weather[0].description}</p>
      </div>
      <div className="flex items-center space-x-2">
        <img
          src={`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
          alt={data.weather[0].description}
          className="w-12 h-12"
        />
        <button
          onClick={toggleFavorite}
          className={`p-2 rounded-full ${isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'} hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
};

export default WeatherCard;