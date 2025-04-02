// src/components/Crypto/CryptoCard.tsx
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addCryptoToFavorites, removeCryptoFromFavorites } from '../../redux/slices/favoritesSlice';
import { CryptoData } from '../../types';

interface CryptoCardProps {
  data: CryptoData;
  className?: string;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ data, className }) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.cryptos);
  const isFavorite = favorites.includes(data.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeCryptoFromFavorites(data.id));
    } else {
      dispatch(addCryptoToFavorites(data.id));
    }
  };

  return (
    <div className={`card flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 ${className}`}>
      <div>
        <Link href={`/crypto/${data.id}`}>
          <h3 className="text-lg sm:text-xl font-semibold capitalize text-gray-800 hover:text-blue-600 transition-colors">
            {data.name}
          </h3>
        </Link>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Price: ${data.current_price.toLocaleString()}</p>
        <p
          className={`mt-1 text-sm sm:text-base ${
            data.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
          }`}
        >
          24h Change: {data.price_change_percentage_24h.toFixed(2)}%
        </p>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Market Cap: ${data.market_cap.toLocaleString()}</p>
      </div>
      <div className="flex items-center space-x-3">
        <img src={data.image} alt={`Icon for ${data.name}`} className="w-10 h-10 sm:w-12 sm:h-12" />
        <button
          onClick={toggleFavorite}
          className={`btn p-2 rounded-full ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
          } hover:bg-opacity-90 focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
          aria-label={isFavorite ? `Remove ${data.name} from favorites` : `Add ${data.name} to favorites`}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
};

export default CryptoCard;