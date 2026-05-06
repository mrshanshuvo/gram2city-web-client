import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";

interface Service {
  _id: string;
  title: string;
  description: string;
  image?: string; // New: Illustration from DB
  icon: string;
  color: string;
  isActive: boolean;
}

const OurServices = () => {
  const axiosPublic = useAxios();

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get("/landing/services");
        return res.data.data;
      } catch (error) {
        console.error("Failed to fetch services", error);
        return [];
      }
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-white mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-48 bg-slate-100 mx-auto rounded mb-12 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[...Array(services.length)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square bg-slate-50 rounded-full animate-pulse" />
                <div className="h-6 w-3/4 mx-auto bg-slate-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Fallback services if API is empty
  const displayServices =
    services.length > 0
      ? services
      : [
          {
            _id: "1",
            title: "Same Day Delivery",
            description: "",
            image: "/images/services/pick_and_drop.png",
            icon: "",
            color: "",
            isActive: true,
          },
          {
            _id: "2",
            title: "Nationwide Logistics",
            description: "",
            image: "/images/services/truck.png",
            icon: "",
            color: "",
            isActive: true,
          },
          {
            _id: "3",
            title: "Secure Corporate Shipping",
            description: "",
            image: "/images/services/corporate.png",
            icon: "",
            color: "",
            isActive: true,
          },
          {
            _id: "4",
            title: "Ecommerce Delivery",
            description: "",
            image: "/images/services/ecommerce.png",
            icon: "",
            color: "",
            isActive: true,
          },
        ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight"
          >
            Our Service
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {displayServices.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group text-center"
            >
              <div className="relative mb-6 mx-auto w-full max-w-[240px] aspect-square flex items-center justify-center">
                {/* Illustration with subtle hover scale */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-full h-full"
                >
                  <img
                    src={service.image || "/images/services/ecommerce.png"}
                    alt={service.title}
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              </div>

              <h3 className="text-xl font-bold text-slate-800 transition-colors duration-300 group-hover:text-primary">
                {service.title}
              </h3>

              {/* Optional: if description exists, show it as a subtle tooltip or hidden by default */}
              {service.description && (
                <p className="mt-2 text-slate-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {service.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
