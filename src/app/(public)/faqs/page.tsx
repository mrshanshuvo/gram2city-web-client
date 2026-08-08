import React from 'react';
import { Metadata } from 'next';
import FAQClient from './FAQClient';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Gram2City Support',
  description:
    'Find answers to common questions about parcel booking, pricing, delivery speed, tracking, and merchant onboarding at Gram2City Logistics.',
};

export default function FAQPage() {
  return <FAQClient />;
}
