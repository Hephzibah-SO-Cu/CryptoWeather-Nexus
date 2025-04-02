import { CryptoData } from '../../types';
import Link from 'next/link';

interface CryptoCardProps {
  data: CryptoData;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ data }) => {
  const changeColor = data.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600';
  return (
    <div className="p-4 bg-white shadow rounded-lg flex items-center space-x-4 transition-transform transform hover:scale-105 hover:shadow-lg">
      <img src={data.image} alt={data.name} className="w-8 h-8" />
      <div>
        <Link href={`/crypto/${data.id}`}>
          <h3 className="text-lg font-semibold text-blue-600 hover:underline">{data.name}</h3>
        </Link>
        <p className="text-gray-600">Price: ${data.current_price.toLocaleString()}</p>
        <p className={`text-gray-600 ${changeColor}`}>
          24h Change: {data.price_change_percentage_24h.toFixed(2)}%
        </p>
        <p className="text-gray-600">Market Cap: ${data.market_cap.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default CryptoCard;