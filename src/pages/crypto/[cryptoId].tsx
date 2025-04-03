import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image'; // Already added
import Layout from '../../components/Layout/Layout';
import { fetchCryptoDetail, fetchCryptoHistoricalData } from '../../utils/api';
import { CryptoDetail, HistoricalPriceData, CryptoData } from '../../types';
import { useAppSelector } from '../../redux/hooks';

interface CryptoDetailProps {
  cryptoData: CryptoDetail | null;
  historicalData: HistoricalPriceData | null;
  error?: string;
}

const CryptoDetailPage: React.FC<CryptoDetailProps> = ({ cryptoData, historicalData, error }) => {
  const router = useRouter();
  const { cryptoId } = router.query;
  const cryptoState = useAppSelector((state) => state.crypto);
  const fallbackData = cryptoState.data.find((crypto: CryptoData) => crypto.id === cryptoId);

  if (error || !cryptoData || !historicalData) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold mb-6 capitalize">{cryptoId} Details</h1>
          {fallbackData ? (
            <div className="mb-8 p-6 bg-white shadow rounded-lg flex items-center space-x-6">
              <Image src={fallbackData.image} alt={fallbackData.name} width={64} height={64} />
              <div>
                <h2 className="text-2xl font-semibold mb-4">Current Metrics (Limited Data)</h2>
                <p className="text-gray-600">Price: ${fallbackData.current_price.toLocaleString()}</p>
                <p className="text-gray-600">24h Change: {fallbackData.price_change_percentage_24h.toFixed(2)}%</p>
                <p className="text-gray-600">Market Cap: ${fallbackData.market_cap.toLocaleString()}</p>
                <p className="text-yellow-500 mt-2">
                  Detailed metrics and historical data are unavailable due to API issues.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-white shadow rounded-lg">
              <p className="text-red-500">
                {error || 'Failed to load crypto details. Please try again later.'}
              </p>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold mb-6 capitalize">{cryptoData.name}</h1>
        <div className="mb-8 p-6 bg-white shadow rounded-lg flex items-center space-x-6">
          <Image src={cryptoData.image.large} alt={cryptoData.name} width={64} height={64} />
          <div>
            <h2 className="text-2xl font-semibold mb-4">Current Metrics</h2>
            <p className="text-gray-600">Price: ${cryptoData.market_data.current_price.usd.toLocaleString()}</p>
            <p className="text-gray-600">24h Change: {cryptoData.market_data.price_change_percentage_24h.toFixed(2)}%</p>
            <p className="text-gray-600">Market Cap: ${cryptoData.market_data.market_cap.usd.toLocaleString()}</p>
            <p className="text-gray-600">24h Volume: ${cryptoData.market_data.total_volume.usd.toLocaleString()}</p>
            <p className="text-gray-600">Total Supply: {cryptoData.market_data.total_supply?.toLocaleString() || 'N/A'}</p>
            <p className="text-gray-600">Circulating Supply: {cryptoData.market_data.circulating_supply.toLocaleString()}</p>
          </div>
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Historical Price (Last 7 Days)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2 text-left">Date</th>
                  <th className="border-b p-2 text-left">Price (USD)</th>
                </tr>
              </thead>
              <tbody>
                {historicalData.map(([timestamp, price], index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border-b p-2">{new Date(timestamp).toLocaleDateString()}</td>
                    <td className="border-b p-2">${price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { cryptoId } = context.params as { cryptoId: string };

  try {
    const cryptoData = await fetchCryptoDetail(cryptoId);
    const historicalData = await fetchCryptoHistoricalData(cryptoId);
    return {
      props: {
        cryptoData,
        historicalData,
      },
    };
  } catch {
    return {
      props: {
        cryptoData: null,
        historicalData: null,
        error: 'Failed to fetch crypto data. Please try again later.',
      },
    };
  }
};

export default CryptoDetailPage;