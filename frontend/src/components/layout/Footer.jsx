import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-white mt-20">

      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_#5b3df5_0%,_#8b5cf6_100%)] shadow-[0_8px_25px_rgba(91,61,245,0.25)]">
              <span className="text-xl font-black tracking-[0.2em] text-white">T</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black uppercase tracking-[0.3em] text-[#5b3df5]">TechRevive</span>
              <span className="mt-1 text-sm font-semibold uppercase tracking-[0.42em] text-gray-400">Aurelia AI</span>
            </div>
          </div>

          <p className="mt-4 text-gray-400">
            India's AI Powered Marketplace for buying
            new gadgets, certified refurbished gadgets,
            selling old devices and smart exchange.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-4">
            Quick Links
          </h3>

          <ul className="space-y-3 text-gray-400">
            <li>Home</li>
            <li>New Gadgets</li>
            <li>Refurbished</li>
            <li>Sell Device</li>
            <li>Exchange</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-4">
            Support
          </h3>

          <ul className="space-y-3 text-gray-400">
            <li>Help Center</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Refund Policy</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-4">
            Follow Us
          </h3>

          <div className="flex gap-4 text-2xl">

            <FaFacebookF className="cursor-pointer hover:text-[#5B3DF5]" />

            <FaInstagram className="cursor-pointer hover:text-[#5B3DF5]" />

            <FaLinkedinIn className="cursor-pointer hover:text-[#5B3DF5]" />

            <FaGithub className="cursor-pointer hover:text-[#5B3DF5]" />

          </div>

          <p className="mt-6 text-gray-400">
            support@techreviveai.com
          </p>

        </div>

      </div>

      <div className="border-t border-gray-700 py-5 text-center text-gray-400">

        © 2026 TechRevive AI. All Rights Reserved.

      </div>

    </footer>
  );
};

export default Footer;