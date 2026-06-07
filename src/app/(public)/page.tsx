import Banner from "@/components/Home/Banner/Banner";
import TrackerBar from "@/components/Home/Banner/TrackerBar";
import TopEnterprises from "@/components/Home/TopEnterprises/TopEnterprises";
import HowItWorks from "@/components/Home/HowItWorks/HowItWorks";
import OurServices from "@/components/Home/OurServices/OurServices";
import FeatureCards from "@/components/Home/FeatureCards/FeatureCards";
import Merchant from "@/components/Home/Merchant/Merchant";
import Testimonials from "@/components/Home/Testimonials/Testimonials";
import FAQ from "@/components/Home/FAQ/FAQ";

import CostCalculator from "@/components/Home/CostCalculator/CostCalculator";

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
