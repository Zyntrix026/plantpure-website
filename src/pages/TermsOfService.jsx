import React from 'react';

const TermsOfService = () => {
  return (
    <div className="bg-white text-[#253D4E]  py-16 ">
      <div className="custom-container px-4 max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12 border-b border-gray-100 pb-8">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full mb-4 inline-block">
            Legal Policy
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#253D4E] mb-3">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-400">
            Last Updated: June 2026
          </p>
        </div>

        {/* Content Section */}
        <div className="space-y-8 text-sm sm:text-base text-gray-600 leading-relaxed">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3">
              1. Agreement to Terms
            </h2>
            <p>
              Welcome to PlantPure (accessible via plantpure.in). By accessing or using our website and purchasing our 100% natural, chemical-free hair care products, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using our platform.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3">
              2. Product Information & Disclaimer
            </h2>
            <p className="mb-3">
              PlantPure dedicatedly offers herbal-based hair coloring kits, scalp cleansers, moisturizers, and natural oils. While our formulations leverage time-tested plant extracts designed to reduce hair fall and restore health naturally:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-500">
              <li>Results may vary from person to person depending on individual hair texture and scalp conditions.</li>
              <li>We highly recommend performing a <strong>patch test</strong> before using any hair coloring or herbal products to eliminate rare personal allergic responses.</li>
              <li>Our content is informational and should not replace professional medical advice for chronic scalp disorders.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3">
              3. Account Responsibilities
            </h2>
            <p>
              When creating an account with PlantPure to manage your orders, you are responsible for maintaining the absolute confidentiality of your credentials. You agree to provide current, complete, and accurate purchase and account information for all transactions made at our store.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3">
              4. Shipping, Orders & Cancellations
            </h2>
            <p>
              We reserve the right to refuse or limit any order placed with us. In the event that we make a change to or cancel an order, we will attempt to notify you via the email or phone number provided at the time the order was made. Shipping timelines across India follow standard carrier procedures, and specific delivery estimates are presented during checkout.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3">
              5. Intellectual Property
            </h2>
            <p>
              All original content, graphics, imagery, product descriptions, brand names, and website code featured on this platform are the exclusive property of PlantPure and India Craft World. Any unauthorized distribution, reproduction, or modification of these materials without explicit written consent is strictly prohibited.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3">
              6. Privacy Policy & Data Collection
            </h2>
            <p>
              Your submission of personal data through the store is governed by our Privacy Policy. By utilizing our contact and checkout forms, you explicitly consent to the lawful collection and processing of your submitted information necessary to fulfill shipments and answer inquiries.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3">
              7. Governing Law
            </h2>
            <p>
              These Terms of Service and any separate agreements whereby we provide you products or services shall be governed by and construed in accordance with the laws of India, under the legal jurisdiction of New Delhi / Delhi NCR.
            </p>
          </section>

          {/* Section 8 */}
          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3">
              8. Contact Information
            </h2>
            <p className="mb-2">
              Questions or clarifications regarding these Terms of Service should be directed to our support facility:
            </p>
            <div className="bg-[#faf9f6] p-4 rounded-xl border border-gray-100 inline-block space-y-1">
              <p className="font-bold text-sm">PlantPure Legal Operations</p>
              <p className="text-xs text-gray-500">Email: <a href="mailto:indiacraftworld@gmail.com" className="text-emerald-600 hover:underline">indiacraftworld@gmail.com</a></p>
              <p className="text-xs text-gray-500">Phone: <a href="tel:+919625982035" className="text-emerald-600 hover:underline">+91-9625982035</a></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsOfService;