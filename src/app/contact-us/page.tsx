import React from 'react';
import ContactPage from '../../components/ContactPage';
import PublicShell from '../../components/PublicShell';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Yono Hub',
  description: 'Get in touch with Yono Hub support team for any queries, advertisements or partnerships.',
  alternates: {
    canonical: '/contact-us',
  },
};

export default function ContactUsRoute() {
  return (
    <PublicShell>
      <ContactPage />
    </PublicShell>
  );
}
