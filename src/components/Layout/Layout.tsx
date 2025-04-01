import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">CryptoWeather Nexus</h1>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
};

export default Layout;