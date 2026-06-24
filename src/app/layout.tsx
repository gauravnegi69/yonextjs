import './globals.css';
import React from 'react';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import { CompareProvider } from '../context/CompareContext';

export const metadata = {
  title: 'Yono Hub – Premium App Discovery & Play Platform',
  description: 'Discover, compare and download premium rummy and skill apps.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AdminAuthProvider>
          <CompareProvider>
            {children}
          </CompareProvider>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
