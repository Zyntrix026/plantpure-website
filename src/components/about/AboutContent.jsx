import React from "react";
import { Leaf, ShieldAlert, Sparkles, HeartHandshake, CheckCircle } from "lucide-react";

const AboutContent = () => {
  return (
    <div className="bg-white text-[#253D4E] ">
      {/* Hero Section */}
      <div className="bg-[#faf9f6] py-16 md:py-24 border-b border-gray-100">
        <div className="custom-container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ">
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-left">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full mb-4 inline-block">
                About PlantPure
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold mb-6 text-[#253D4E] leading-tight">
                100% Natural. Chemical-Free. <br />
                <span className="text-emerald-600 font-serif italic font-medium normal-case">Beautifully Pure.</span>
              </h1>
              <p className="text-sm sm:text-lg text-gray-600 leading-relaxed font-medium">
                PlantPure is your one-stop solution for 100% natural, chemical-free hair care. Our products help maintain, color, and condition hair using time-tested, plant-based ingredients and simple natural techniques. From hair coloring kits to scalp cleansers, moisturizers, and natural oils, PlantPure offers complete care without harsh chemicals. In a short time, we’ve become a trusted name in natural hair care across India.
              </p>
            </div>

            {/* Right Image Column */}
            <div className="lg:col-span-5 h-[300px] sm:h-[400px] rounded-3xl overflow-hidden shadow-md bg-gray-100">
              <img 
                src="/about_plantpure-edited.jpg" 
                alt="PlantPure Natural Hair Care" 
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/600x800/eceff1/253d4e?text=PlantPure+Hair+Care";
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Principles Section */}
      <div className="py-16 md:py-24 bg-white">
        <div className="custom-container px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">Our Key Principles</h2>
            <div className="w-12 h-[2px] bg-emerald-600 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Principle 1 */}
            <div className="border-2 border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-emerald-600/30 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <Leaf size={24} className="text-emerald-600 group-hover:text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3">1. Nature-Based Ingredients</h3>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                Every PlantPure product is made with traditional herbal ingredients known for their ability to nourish and restore hair health.
              </p>
            </div>

            {/* Principle 2 */}
            <div className="border-2 border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-emerald-600/30 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <ShieldAlert size={24} className="text-emerald-600 group-hover:text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3">2. Chemical-Free Formulas</h3>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                We never use ammonia, parabens, or other harsh chemicals. Our focus is on pure, gentle care that supports scalp and skin health.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="border-2 border-gray-100 rounded-2xl p-6 sm:p-8 hover:border-emerald-600/30 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <Sparkles size={24} className="text-emerald-600 group-hover:text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3">3. Healthy Hair Focus</h3>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                PlantPure products promote stronger hair growth, reduce hair fall, and improve texture — all through the power of plants.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Impact Section */}
      <div className="py-16 md:py-20 bg-[#faf9f6]">
        <div className="custom-container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 mb-2 block">
                Making A Difference
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold mb-4">Our Impact</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                By offering chemical-free, plant-based hair color and care, PlantPure helps people across India embrace custom rituals that are good for their skin, hair, and surroundings.
              </p>
              
              
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <CheckCircle className="text-emerald-600 mb-3" size={20} />
                  <p className="text-xs sm:text-sm font-bold text-[#253D4E] leading-relaxed">
                    Protect their hair from damage caused by synthetic treatments.
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <CheckCircle className="text-emerald-600 mb-3" size={20} />
                  <p className="text-xs sm:text-sm font-bold text-[#253D4E] leading-relaxed">
                    Encourage natural growth through nutrient-rich ingredients.
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <CheckCircle className="text-emerald-600 mb-3" size={20} />
                  <p className="text-xs sm:text-sm font-bold text-[#253D4E] leading-relaxed">
                    Embrace natural beauty by choosing products that work in harmony with nature.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Brand Today Section */}
      <div className="py-16 md:py-24 bg-white">
        <div className="custom-container px-4 max-w-4xl mx-auto text-center">
          <HeartHandshake size={36} className="text-emerald-600 mx-auto mb-6" />
          <h2 className="text-2xl sm:text-4xl font-bold mb-6">The Brand Today</h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 font-medium">
            PlantPure is now one of the fastest-growing natural hair care brands in India. Our products are known for safe coloring, deep cleansing, and long-lasting nourishment — all achieved without compromising scalp health.
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
            Our consistent quality has earned the trust of customers nationwide, along with partnerships in leading hair salons across Delhi, Gurugram, and Mumbai. With every product, we stay true to our commitment to natural ingredients, healthy hair, and sustainable beauty.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutContent;