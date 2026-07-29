import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-white text-[#253D4E]  py-16 ">
      <div className="custom-container px-4 max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12 border-b border-gray-100 pb-8">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full mb-4 inline-block">
            Data Protection
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#253D4E] mb-3">
            Privacy Policy
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
              1. Introduction
            </h2>
            <p>
              At PlantPure (plantpure.in), we are deeply committed to protecting your personal data and maintaining your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, submit inquiries via our forms, or purchase our natural hair care products.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3">
              2. Information We Collect
            </h2>
            <p className="mb-3">
              We collect information that you voluntarily provide directly to us when interacting with our brand. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-500">
              <li><strong>Personal Identifiers:</strong> Name, shipping address, billing address, phone number (+91-9625982035 or personal lines), and email address.</li>
              <li><strong>Transactional Data:</strong> Details about payments and the specific natural kits, oils, or hair coloring items purchased.</li>
              <li><strong>Communication Records:</strong> Any data, messages, or text entered via our "Get in Touch With Us" forms or direct email inquiries (<span className="text-emerald-600">indiacraftworld@gmail.com</span>).</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3">
              3. How We Use Your Information
            </h2>
            <p className="mb-2">
              The data collected is processed strictly to improve your natural hair care experience, specifically to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-500">
              <li>Process, ship, and track your chemical-free product orders across India.</li>
              <li>Respond to your inquiries, support issues, or facility visit requests safely and effectively.</li>
              <li>Send transaction updates, order confirmations, and essential brand notices.</li>
              <li>Comply with applicable legal, security, and verification processes under Indian law.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3">
              4. Data Consent & User Agreement
            </h2>
            <p>
              By checking our consent checkboxes (such as <em>"I agree that my submitted data is being collected"</em>) on our contact or registration forms, you explicitly authorize PlantPure to collect and manage your data in strict compliance with this policy. You retain the full right to withdraw this consent or request data removal at any time by contacting our facility desk.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3">
              5. Data Sharing & Security
            </h2>
            <p>
              We do not sell, trade, or rent your personal data to third parties. We only share essential delivery information with trusted shipping providers to ensure your orders are delivered securely. We use robust administrative and technical security layers to protect your sensitive details from unauthorized access or alteration.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3">
              6. Cookies and Tracking
            </h2>
            <p>
              Our platform uses standard temporary cookies to enhance your browsing experience, remember shopping cart components, and observe general web traffic parameters to refine our operational performance. You can disable cookies inside your personal browser setups if you choose.
            </p>
          </section>

          {/* Contact Node */}
          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3">
              7. Contact Privacy Desk
            </h2>
            <p className="mb-2">
              For queries, data correction requests, or structural privacy concerns, please contact our administrative channels directly:
            </p>
            <div className="bg-[#faf9f6] p-4 rounded-xl border border-gray-100 inline-block space-y-1">
              <p className="font-bold text-sm">PlantPure Data Protection Office</p>
              <p className="text-xs text-gray-500">Email: <a href="mailto:indiacraftworld@gmail.com" className="text-emerald-600 hover:underline">indiacraftworld@gmail.com</a></p>
              <p className="text-xs text-gray-500">Phone: <a href="tel:+919625982035" className="text-emerald-600 hover:underline">+91-9625982035</a></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;