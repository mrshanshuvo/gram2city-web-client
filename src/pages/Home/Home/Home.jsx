import React from 'react';
import Banner from '../Banner/Banner';
import HowItWorks from '../HowItWorks/HowItWorks';
import OurServices from '../OurServices/OurServices';
import ClientLogoSlider from '../ClientLogoSlider/ClientLogoSlider';
import FeatureCards from '../FeatureCards/FeatureCards';
import Merchant from '../Merchant/Merchant';
import Testimonials from '../Testimonials/Testimonials';
import FAQ from '../FAQ/FAQ';

const Home = () => {
  return (
    <div>
      <Banner />
      <HowItWorks />
      <OurServices />
      <ClientLogoSlider />
      <FeatureCards />
      <Merchant />
      <Testimonials />
      <FAQ />
    </div>
  );
};

export default Home;