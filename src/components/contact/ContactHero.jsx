import React from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const ContactHero = () => {
  return (
    <div className="bg-[#faf9f6] py-16  border-b border-gray-100">
      <div className="custom-container px-4 max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full mb-4 inline-block">
            Connect With Us
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#253D4E] mb-4">
            Get in Touch With Us
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            PlantPure is your source for a healthy way of living. We welcome you
            at our facility at any time!
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phone Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-gray-100 flex flex-col items-center text-center group hover:border-emerald-600/20 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Phone size={20} />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Call Us Today
            </h3>
            <a
              href="tel:+919625982035"
              className="text-base sm:text-lg font-bold text-[#253D4E] hover:text-emerald-600 transition-colors"
            >
              +91-9625982035
            </a>
          </div>

          {/* Email Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-gray-100 flex flex-col items-center text-center group hover:border-emerald-600/20 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Mail size={20} />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Email Address
            </h3>
            <a
              href="mailto:indiacraftworld@gmail.com"
              className="text-base sm:text-lg font-bold text-[#253D4E] hover:text-emerald-600 transition-colors truncate max-w-full"
            >
              indiacraftworld@gmail.com
            </a>
          </div>

          {/* Facility Location Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-gray-100 flex flex-col items-center text-center group hover:border-emerald-600/20 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <MapPin size={20} />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Our Facility
            </h3>
            <p className="text-sm font-bold text-[#253D4E]">Delhi NCR, India</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactHero;
