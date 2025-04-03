import Image from 'next/image';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addCryptoToFavorites, removeCryptoFromFavorites } from '../../redux/slices/favoritesSlice';
import { CryptoData } from '../../types';

interface CryptoCardProps {
  data: CryptoData;
  className?: string;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ data, className }) => {
  const dispatch = useAppDispatch();
  const favoriteCryptos = useAppSelector((state) => state.favorites.cryptos);
  const isFavorite = favoriteCryptos.includes(data.id);
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeCryptoFromFavorites(data.id));
    } else {
      dispatch(addCryptoToFavorites(data.id));
    }
  };

  return (
    <div
      className={`p-4 bg-white shadow rounded-lg transition-transform transform hover:scale-105 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-4">
        <Image
          src={data.image}
          alt={data.name}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{data.name}</h3>
          <p className="text-gray-600">Price: ${data.current_price.toLocaleString()}</p>
          <p
            className={`text-sm ${
              data.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            24h: {data.price_change_percentage_24h.toFixed(2)}%
          </p>
        </div>
        <button
          onClick={handleFavoriteToggle}
          className={`text-2xl focus:outline-none transition-opacity ${
            isHovered ? 'opacity-100' : 'opacity-50'
          }`}
          aria-label={isFavorite ? `Remove ${data.name} from favorites` : `Add ${data.name} to favorites`}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
};

export default CryptoCard;