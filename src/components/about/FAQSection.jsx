import React, { useState } from "react";
import { Plus, Minus, ShieldCheck } from "lucide-react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is PlantPure?",
      answer: "PlantPure is a fast-growing Indian hair care brand dedicated to offering 100% natural, plant-based, and completely chemical-free solutions. We specialize in safe hair coloring, structural nourishment, scalp cleansers, and organic oils designed to work in harmony with nature."
    },
    {
      question: "Is PlantPure hair color completely natural?",
      answer: "Yes, absolutely! Every single item in our hair coloring kit is formulated strictly from traditional organic herbs and raw plant materials. We do not use any metallic salts, harsh pigments, or synthetic chemicals."
    },
    {
      question: "How is PlantPure different from other hair color brands?",
      answer: "Unlike common commercial brands that rely heavily on hidden synthetics, PlantPure features zero percent ammonia, zero parabens, and absolutely no artificial texturizers. We focus directly on holistic wellness—restoring raw texture, scalp hygiene, and absolute color safety simultaneously."
    },
    {
      question: "Where can I find PlantPure products?",
      answer: "You can securely place orders across India directly from our verified online storefront. Additionally, our premium line of natural products can be experienced in-person via our exclusive premium salon affiliate partners across Delhi, Gurugram, and Mumbai."
    },
    {
      question: "Are PlantPure products safe for all hair types?",
      answer: "Yes. Because our recipes remain heavily anchored around pure gentle botanicals, our full array of cleansers, custom pigments, and moisturizers are completely non-irritant and safe for all diverse hair formats and sensitive scalps."
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#faf9f6] py-16 md:py-24  border-t border-gray-100">
      <div className="custom-container px-4 max-w-3xl mx-auto">
        
        {/* FAQ Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-[#253D4E] mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-500 text-xs sm:text-sm uppercase font-bold tracking-widest">Everything you need to know about us</p>
        </div>

        {/* FAQ List Accordion */}
        <div className="space-y-4 mb-20">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="bg-white rounded-xl border border-gray-200/60 overflow-hidden shadow-sm transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-[#253D4E] text-sm sm:text-base hover:bg-gray-50/50 transition-colors gap-4"
                >
                  <span>{faq.question}</span>
                  <div className="shrink-0 p-1 bg-gray-50 rounded-md text-gray-500">
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-40 border-t border-gray-50' : 'max-h-0'}`}
                >
                  <div className="p-5 text-xs sm:text-sm text-gray-500 leading-relaxed bg-gray-50/20">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Our Promise Footer Block */}
        <div className="bg-emerald-950 rounded-2xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent)] pointer-events-none" />
          <ShieldCheck size={40} className="text-emerald-400 mx-auto mb-6" />
          <h3 className="text-xl sm:text-3xl font-bold mb-4">Our Promise</h3>
          <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-6">
            At PlantPure, we believe healthy hair starts with nature. Every product we create reflects our mission — to care for your hair the natural way, without compromise.
          </p>
          <div className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-emerald-400 bg-emerald-900/40 inline-block px-4 py-2 rounded-full border border-emerald-800/50">
            PlantPure — 100% Natural. Chemical-Free. Beautifully Pure.
          </div>
        </div>

      </div>
    </div>
  );
};

export default FAQSection;