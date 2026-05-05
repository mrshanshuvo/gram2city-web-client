import React, { useState, useEffect } from "react";
import {
  Twitter,
  Youtube,
  Facebook,
  Linkedin,
  Instagram,
  ChevronUp,
  Phone,
  MapPin,
} from "lucide-react";
import Gram2CityLogo from "../Gram2CityLogo/Gram2CityLogo";
import { FooterProps } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";

const Footer: React.FC<FooterProps> = ({ foundingYear = 2024 }) => {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);
  const axiosPublic = useAxios();

  const { data: config } = useQuery({
    queryKey: ["landing-config"],
    queryFn: async () => {
      const res = await axiosPublic.get("/landing/config");
      return res.data.data;
    },
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const socialLinks = [
    {
      name: "Twitter",
      url: config?.socialLinks?.twitter || "#",
      icon: <Twitter size={18} />,
    },
    {
      name: "YouTube",
      url: config?.socialLinks?.youtube || "#",
      icon: <Youtube size={18} />,
    },
    {
      name: "Facebook",
      url: config?.socialLinks?.facebook || "#",
      icon: <Facebook size={18} />,
    },
    {
      name: "LinkedIn",
      url: config?.socialLinks?.linkedin || "#",
      icon: <Linkedin size={18} />,
    },
    {
      name: "Instagram",
      url: config?.socialLinks?.instagram || "#",
      icon: <Instagram size={18} />,
    },
  ];

  const footerGroups = [
    {
      title: "Solutions",
      links: [
        { name: "Express Delivery", path: "#" },
        { name: "Corporate Shipping", path: "#" },
        { name: "E-commerce Logistics", path: "#" },
        { name: "Warehousing", path: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Our Fleet", path: "#" },
        { name: "Careers", path: "#" },
        { name: "Impact", path: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", path: "#" },
        { name: "Track Order", path: "/dashboard/trackParcel" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Service Areas", path: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-[#0B0F19] text-gray-400 pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1E5AA8]/5 blur-[120px] rounded-full -mr-64 -mt-64" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 pb-16">
          <div className="lg:col-span-4 space-y-8">
            <div className="scale-110 origin-left">
              <Gram2CityLogo />
            </div>
            <p className="text-gray-400 text-lg leading-relaxed font-medium">
              Bridging the gap between village and city with the fastest, most
              reliable logistics network in the nation.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-[#2E7D32] group-hover:border-[#2E7D32]/50 transition-all">
                  <MapPin size={20} />
                </div>
                <span className="text-sm font-semibold whitespace-pre-line">
                  {config?.contactInfo?.address ||
                    "123 Logistics Way, Dhaka, BD"}
                </span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-[#1E5AA8] group-hover:border-[#1E5AA8]/50 transition-all">
                  <Phone size={20} />
                </div>
                <span className="text-sm font-semibold">
                  {config?.contactInfo?.phone || "+880 1234 567 890"}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 mb-16">
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">
                    {group.title}
                  </h3>
                  <ul className="space-y-4">
                    {group.links.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.path}
                          className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 font-bold"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Newsletter Section */}
            <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#F4C20D]/10 blur-[50px] rounded-full group-hover:bg-[#F4C20D]/20 transition-all duration-500" />
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-2">
                     <h4 className="text-white text-xl font-black tracking-tight">Stay ahead of the curve</h4>
                     <p className="text-sm text-gray-500 font-medium">Get the latest logistics insights and exclusive offers.</p>
                  </div>
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const email = (e.target as any).email.value;
                      try {
                        const res = await axiosPublic.post("/landing/subscribe", { email });
                        if (res.data.success) {
                           (e.target as any).reset();
                           alert("Welcome to the family! 🚀");
                        }
                      } catch (err: any) {
                        alert(err.response?.data?.message || "Something went wrong");
                      }
                    }}
                    className="flex gap-2"
                  >
                     <input 
                       name="email"
                       type="email" 
                       required
                       placeholder="Enter your email" 
                       className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-[#F4C20D] transition-colors"
                     />
                     <button className="px-8 py-4 bg-[#F4C20D] text-black font-black rounded-2xl hover:bg-white transition-all duration-500 shadow-xl shadow-[#F4C20D]/20">
                        Join
                     </button>
                  </form>
               </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12">
            <p className="text-gray-500 text-sm font-bold">
              &copy; {foundingYear}-{currentYear} Gram2City Logistics. All
              rights reserved.
            </p>
            <div className="flex gap-8">
              <a
                href="/terms"
                className="text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
              >
                Terms
              </a>
              <a
                href="/privacy"
                className="text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
              >
                Privacy
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:bg-[#F4C20D] hover:text-black hover:border-[#F4C20D] hover:-translate-y-1 transition-all duration-300"
                title={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 w-14 h-14 bg-[#2E7D32] text-white rounded-2xl shadow-[0_10px_30px_rgba(46,125,50,0.3)] flex items-center justify-center hover:bg-[#1E5AA8] hover:shadow-[0_10px_30px_rgba(30,90,168,0.3)] hover:-translate-y-2 transition-all z-50 group"
          aria-label="Scroll to top"
        >
          <ChevronUp className="group-hover:animate-bounce" size={24} />
        </button>
      )}
    </footer>
  );
};

export default Footer;
