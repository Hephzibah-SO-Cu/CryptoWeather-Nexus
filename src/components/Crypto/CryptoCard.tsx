import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addCryptoToFavorites, removeCryptoFromFavorites } from '../../redux/slices/favoritesSlice';
import { CryptoData } from '../../types';

interface CryptoCardProps {
  data: CryptoData;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ data }) => {
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
    <div className="p-4 bg-white shadow rounded-lg flex justify-between items-center">
      <div>
        <Link href={`/crypto/${data.id}`}>
          <h3 className="text-xl font-semibold capitalize cursor-pointer hover:underline">{data.name}</h3>
        </Link>
        <p className="text-gray-600">Price: ${data.current_price.toLocaleString()}</p>
        <p className={`text-gray-600 ${data.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          24h Change: {data.price_change_percentage_24h.toFixed(2)}%
        </p>
        <p className="text-gray-600">Market Cap: ${data.market_cap.toLocaleString()}</p>
      </div>
      <div className="flex items-center space-x-2">
        <img src={data.image} alt={data.name} className="w-12 h-12" />
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

export default CryptoCard;