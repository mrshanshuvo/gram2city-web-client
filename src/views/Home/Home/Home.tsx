"use client";

import Banner from "../Banner/Banner";
import TrackerBar from "../Banner/TrackerBar";
import TopEnterprises from "../TopEnterprises/TopEnterprises";
import HowItWorks from "../HowItWorks/HowItWorks";
import OurServices from "../OurServices/OurServices";
import FeatureCards from "../FeatureCards/FeatureCards";
import Merchant from "../Merchant/Merchant";
import Testimonials from "../Testimonials/Testimonials";
import FAQ from "../FAQ/FAQ";

import CostCalculator from "../CostCalculator/CostCalculator";

const Home = () => {
  return (
    <div>
      <Banner />
      <TrackerBar />
      <TopEnterprises />
      <OurServices />
      <CostCalculator />
      <HowItWorks />
      <FeatureCards />
      <Merchant />
      <Testimonials />
      <FAQ
        limit={5}
        showSearch={false}
        showCategories={false}
        sortBy="helpful"
        title="Popular Questions"
        subtitle="Quick answers to our most frequently asked questions."
      />
    </div>
  );
};

export default Home;
