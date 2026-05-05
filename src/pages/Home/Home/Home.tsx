import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import Banner from "../Banner/Banner";
import HowItWorks from "../HowItWorks/HowItWorks";
import OurServices from "../OurServices/OurServices";
import ClientLogoSlider from "../ClientLogoSlider/ClientLogoSlider";
import FeatureCards from "../FeatureCards/FeatureCards";
import Merchant from "../Merchant/Merchant";
import Testimonials from "../Testimonials/Testimonials";
import FAQ from "../FAQ/FAQ";

import CostCalculator from "../CostCalculator/CostCalculator";

const Home = () => {
  const axiosPublic = useAxios();
  const { data: config } = useQuery({
    queryKey: ["landing-config"],
    queryFn: async () => {
      const res = await axiosPublic.get("/landing/config");
      return res.data.data;
    },
  });

  const seo = config?.seo || {};

  return (
    <div>
      <Helmet>
        <title>{seo.title || "Gram2City | Smart Logistics Solution"}</title>
        <meta
          name="description"
          content={
            seo.description || "The fastest village-to-city logistics network."
          }
        />
        <meta
          name="keywords"
          content={seo.keywords || "logistics, shipping, delivery"}
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={seo.image} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={seo.image} />
      </Helmet>

      <Banner />
      <HowItWorks />
      <OurServices />
      <CostCalculator />
      <ClientLogoSlider />
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
