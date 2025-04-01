import Layout from '../components/Layout/Layout';

export default function Home() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">Weather</h2>
          <p>Weather data will go here.</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">Cryptocurrency</h2>
          <p>Crypto data will go here.</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">News</h2>
          <p>News headlines will go here.</p>
        </div>
      </div>
    </Layout>
  );
}