import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="bg-white text-[#253D4E] py-16">
      <div className="custom-container px-4 max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12 border-b border-gray-100 pb-8">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full mb-4 inline-block">
            Customer Care
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#253D4E] mb-3">
            Cancellation & Refund Policy
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
              1. Overview of Our Policy
            </h2>
            <p>
              At PlantPure (plantpure.in), we strive to offer 100% natural, premium chemical-free hair care products. Since our products are personal care items items crafted with pure herbal plant extracts, our return and refund operations follow strict hygiene and safety standards to protect all our customers across India.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3">
              2. Returns & Replacements Eligibility
            </h2>
            <p className="mb-3">
              Due to the perishable and personal hygiene nature of natural oils, kits, and herbal hair coloring items, we generally do not offer returns on items that have been opened or used. However, you are fully eligible for a replacement or store credit if:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-500">
              <li>The product delivered to you was **damaged during transit** or handling.</li>
              <li>The package received has an **incorrect item** different from your verified online purchase invoice.</li>
              <li>The item has a manufacturing or structural packaging defect reported instantly upon opening.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3">
              3. Reporting Window & Proof Requirements
            </h2>
            <p>
              To claim a replacement for damaged or incorrect products, you must notify our customer care support within **48 hours of order delivery**. To process your request safely and efficiently, we kindly request you to provide digital proof including **clear photos or a brief unboxing video** highlighting the package damage or issue via our verified support channel (<span className="text-emerald-600">indiacraftworld@gmail.com</span>).
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3">
              4. Order Cancellations
            </h2>
            <p>
              You can cancel your PlantPure order anytime **before it has been shipped** from our facility desk. Once the delivery carrier handles the package and tracking data is generated, orders cannot be canceled or modified in transit. Prepaid orders canceled successfully before shipment will receive a full 100% refund processed back to the original source payment mode.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3">
              5. Refund Processing Timeline
            </h2>
            <p>
              Once your cancellation request or damaged-item assessment is verified and approved by our support team, the refund will be initialized immediately. It usually takes **5 to 7 operational working days** for the dynamic amount to reflect inside your banking statement or credit card balance, depending on standard Indian banking gateway protocols.
            </p>
          </section>

          {/* Contact Section */}
          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3">
              6. Reach Out to Support Desk
            </h2>
            <p className="mb-2">
              For initialization of replacement tickets, cancellation help, or specific order status parameters, please contact our administrative channels directly:
            </p>
            <div className="bg-[#faf9f6] p-4 rounded-xl border border-gray-100 inline-block space-y-1">
              <p className="font-bold text-sm">PlantPure Help & Refund Operations</p>
              <p className="text-xs text-gray-500">
                Email: <a href="mailto:indiacraftworld@gmail.com" className="text-emerald-600 hover:underline">indiacraftworld@gmail.com</a>
              </p>
              <p className="text-xs text-gray-500">
                Phone: <a href="tel:+919810999976" className="text-emerald-600 hover:underline">+91-9810999976</a>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;