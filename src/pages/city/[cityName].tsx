import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout/Layout';
import { fetchWeatherData, fetchHistoricalWeatherData } from '../../utils/api';
import { WeatherData, HistoricalWeatherData } from '../../types';

interface CityDetailProps {
  weatherData: WeatherData;
  historicalData: HistoricalWeatherData[];
}

const CityDetail: React.FC<CityDetailProps> = ({ weatherData, historicalData }) => {
  const router = useRouter();
  const { cityName } = router.query;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold mb-6 capitalize">{cityName} Weather</h1>
        <div className="mb-8 p-6 bg-white shadow rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Current Weather</h2>
          <p className="text-gray-600">Temperature: {weatherData.main.temp}°C</p>
          <p className="text-gray-600">Humidity: {weatherData.main.humidity}%</p>
          <p className="text-gray-600">Conditions: {weatherData.weather[0].description}</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Historical Weather (Last 5 Days)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2 text-left">Date</th>
                  <th className="border-b p-2 text-left">Temperature (°C)</th>
                  <th className="border-b p-2 text-left">Conditions</th>
                </tr>
              </thead>
              <tbody>
                {historicalData.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border-b p-2">{entry.date}</td>
                    <td className="border-b p-2">{entry.temp.toFixed(1)}</td>
                    <td className="border-b p-2">{entry.description}</td>
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
  const { cityName } = context.params as { cityName: string };

  try {
    const weatherData = await fetchWeatherData(cityName);
    const historicalData = await fetchHistoricalWeatherData();
    return {
      props: {
        weatherData,
        historicalData,
      },
    };
  } catch {
    return {
      notFound: true, // Return 404 if the city is not found
    };
  }
};

export default CityDetail;