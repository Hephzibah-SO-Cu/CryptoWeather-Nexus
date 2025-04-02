// src/components/Layout/Layout.tsx
import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 sm:p-6 shadow-md" aria-label="Main navigation">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">CryptoWeather Nexus</h1>
      </nav>
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
};

export default Layout;