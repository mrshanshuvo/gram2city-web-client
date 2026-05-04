import React, { useState, useEffect } from "react";
import {
  FaTwitter,
  FaYoutube,
  FaFacebookF,
  FaLinkedin,
  FaInstagram,
  FaChevronUp,
} from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import Gram2CityLogo from "../Gram2CityLogo/Gram2CityLogo";
import { FooterProps } from "../../../types";

const Footer: React.FC<FooterProps> = ({ foundingYear = 2024 }) => {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);

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
    { name: "Twitter", url: "#", icon: <FaTwitter /> },
    { name: "YouTube", url: "#", icon: <FaYoutube /> },
    { name: "Facebook", url: "#", icon: <FaFacebookF /> },
    { name: "LinkedIn", url: "#", icon: <FaLinkedin /> },
    { name: "Instagram", url: "#", icon: <FaInstagram /> },
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
        { name: "About Gram2City", path: "/about" },
        { name: "Our Fleet", path: "#" },
        { name: "Career Openings", path: "#" },
        { name: "Sustainability", path: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", path: "#" },
        { name: "Track Shipment", path: "/dashboard/trackParcel" },
        { name: "Contact Support", path: "#" },
        { name: "Service Areas", path: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-[#0B0F19] text-gray-400 font-urbanist pt-16 pb-6">
      <div className="container mx-auto px-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-10 border-b border-white/5">
          {/* Brand & Description */}
          <div className="lg:col-span-4 space-y-5 md:mx-auto">
            <div className="max-w-[160px]">
              <Gram2CityLogo />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              The fastest way to move your goods from village to city. Local
              expertise meets global logistics technology.
            </p>
          </div>

          {/* Navigation Groups */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {footerGroups.map((group) => (
                <div key={group.title} className="space-y-4">
                  <h3 className="text-white font-black text-[10px] uppercase tracking-[0.25em]">
                    {group.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {group.links.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.path}
                          className="text-gray-400 hover:text-[#1E5AA8] hover:translate-x-1 inline-block transition-all duration-300 text-sm font-medium"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Contact Column */}
          <div className="lg:col-span-3 space-y-6 lg:pl-4">
            <h3 className="text-white font-black text-[10px] uppercase tracking-[0.25em]">
              Connect With Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 group cursor-pointer">
                <div className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 group-hover:bg-[#1E5AA8] group-hover:border-[#1E5AA8] group-hover:text-white transition-all duration-300">
                  <MdEmail className="text-lg" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-gray-500 mb-0.5">
                    Email
                  </p>
                  <p className="text-[13px] font-bold text-gray-300 group-hover:text-white transition-colors">
                    hello@gram2city.com
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3.5 group cursor-pointer">
                <div className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 group-hover:bg-[#2E7D32] group-hover:border-[#2E7D32] group-hover:text-white transition-all duration-300">
                  <MdPhone className="text-lg" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-gray-500 mb-0.5">
                    Support
                  </p>
                  <p className="text-[13px] font-bold text-gray-300 group-hover:text-white transition-colors">
                    +880 1234 567 890
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-6 md:mx-20">
          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest">
              &copy; {foundingYear}-{currentYear} Gram2City Logistics
            </p>
            <div className="flex gap-6">
              <a
                href="/privacy"
                className="text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                Privacy
              </a>
              <a
                href="/terms"
                className="text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                Terms
              </a>
            </div>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-2.5">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                className="w-9 h-9 rounded-lg border border-white/5 flex items-center justify-center text-gray-500 hover:bg-white/5 hover:text-white hover:-translate-y-1 transition-all duration-300"
                title={social.name}
              >
                <span className="text-sm">{social.icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Back to Top */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-11 h-11 bg-[#2E7D32] text-white rounded-xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 animate-in fade-in slide-in-from-bottom-5"
          aria-label="Scroll to top"
        >
          <FaChevronUp className="text-sm" />
        </button>
      )}
    </footer>
  );
};

export default Footer;
