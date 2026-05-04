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
    <footer className="bg-[#0B0F19] text-gray-400 font-urbanist pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-16 border-b border-white/5">
          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="max-w-[200px]">
              <Gram2CityLogo />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              The fastest way to move your goods from village to city. We
              combine cutting-edge technology with local expertise to deliver
              excellence at your doorstep.
            </p>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
              {footerGroups.map((group) => (
                <div key={group.title} className="space-y-6">
                  <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">
                    {group.title}
                  </h3>
                  <ul className="space-y-4">
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
        </div>

        {/* Bottom Bar: Contact, Social, Copyright */}
        <div className="mt-12 flex flex-col xl:flex-row justify-between items-center gap-10">
          {/* Contact Details */}
          <div className="flex flex-wrap justify-center gap-12">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-400 group-hover:border-[#1E5AA8] group-hover:text-[#1E5AA8] transition-all duration-500">
                <MdEmail className="text-xl" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  Support
                </p>
                <p className="text-sm font-bold text-white">
                  hello@gram2city.com
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-400 group-hover:border-[#2E7D32] group-hover:text-[#2E7D32] transition-all duration-500">
                <MdPhone className="text-xl" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  Call Us
                </p>
                <p className="text-sm font-bold text-white">
                  +880 1234 567 890
                </p>
              </div>
            </div>
          </div>

          {/* Copyright & Socials */}
          <div className="flex flex-col items-center xl:items-end gap-6">
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:border-[#1E5AA8] hover:text-[#1E5AA8] hover:scale-110 transition-all duration-300"
                >
                  <span className="text-sm">{social.icon}</span>
                </a>
              ))}
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest">
                &copy; {foundingYear}-{currentYear} Gram2City Logistics
              </p>
              <div className="flex gap-6">
                <a
                  href="/privacy"
                  className="text-gray-500 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors"
                >
                  Privacy
                </a>
                <a
                  href="/terms"
                  className="text-gray-500 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors"
                >
                  Terms
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Back to Top */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-[#2E7D32] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 animate-in fade-in slide-in-from-bottom-5"
        >
          <FaChevronUp />
        </button>
      )}
    </footer>
  );
};

export default Footer;
