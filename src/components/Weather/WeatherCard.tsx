import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addCityToFavorites, removeCityFromFavorites } from '../../redux/slices/favoritesSlice';
import { WeatherData } from '../../types';

interface WeatherCardProps {
  city: string;
  data: WeatherData;
  className?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ city, data, className }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const favoriteCities = useAppSelector((state) => state.favorites.cities);
  const isFavorite = favoriteCities.includes(city.toLowerCase());
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeCityFromFavorites(city.toLowerCase()));
    } else {
      dispatch(addCityToFavorites(city.toLowerCase()));
    }
  };

  const handleCardClick = () => {
    router.push(`/city/${city.toLowerCase()}`);
  };

  return (
    <div
      className={`p-4 bg-white shadow rounded-lg transition-transform transform hover:scale-105 cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="flex items-center space-x-4">
        <Image
          src={`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
          alt={data.weather[0].description}
          width={40}
          height={40}
          onError={(e) => {
            e.currentTarget.src = '/images/weather-fallback.png'; // Fallback image (you'll need to add this)
          }}
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold capitalize hover:text-blue-600 transition-colors">{city}</h3>
          <p className="text-gray-600">Temp: {data.main.temp}°C</p>
          <p className="text-gray-600 capitalize">{data.weather[0].description}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFavoriteToggle();
          }}
          className={`text-2xl focus:outline-none transition-opacity ${
            isHovered ? 'opacity-100' : 'opacity-50'
          }`}
          aria-label={isFavorite ? `Remove ${city} from favorites` : `Add ${city} to favorites`}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
};

export default WeatherCard;