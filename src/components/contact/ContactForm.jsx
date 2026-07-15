import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { createInquiry } from "../../lib/inquiry"; // आपका API फाइल पाथ

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "", // न्यू स्टेट
    productType: "",
    quantity: "1",
    message: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const products = [
    "Hibiscus Flower Oil",
    "Moringa Oil",
    "Organic Cold-Pressed Jojoba Seed Oil",
    "Color Secure Hair Cleanser",
    "Cleansing & Nourishing Hair Cleanser"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // वैलिडेशन लॉजिक
  const validateForm = () => {
    let tempErrors = {};
    
    if (!formData.name.trim()) tempErrors.name = "Full Name is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    // मोबाइल नंबर वैलिडेशन (10-12 अंक)
    const mobileRegex = /^\+?[0-9]{10,12}$/;
    if (!formData.mobile.trim()) {
      tempErrors.mobile = "Mobile number is required";
    } else if (!mobileRegex.test(formData.mobile.trim())) {
      tempErrors.mobile = "Enter a valid 10-12 digit number";
    }

    if (!formData.productType) tempErrors.productType = "Please select a product";

    const qty = parseInt(formData.quantity, 10);
    if (!formData.quantity || isNaN(qty) || qty < 1) {
      tempErrors.quantity = "Quantity must be at least 1";
    }

    if (!formData.message.trim()) {
      tempErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors in the form.", { position: "bottom-right" });
      return;
    }

    if (!agreed) {
      toast.error("Please agree to data collection terms.", { position: "bottom-right" });
      return;
    }
    
    setLoading(true);
    
    try {
      await createInquiry({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile, // एपीआई में भेजा जा रहा डेटा
        productType: formData.productType,
        quantity: Number(formData.quantity),
        message: formData.message,
        dataConsent: agreed
      });

      toast.success("Message and inquiry sent successfully!", {
        position: "bottom-right",
        style: { background: "#253D4E", color: "#fff" }
      });
      
      setFormData({ 
        name: "", 
        email: "", 
        mobile: "", // रीसेट
        productType: "", 
        quantity: "1", 
        message: "" 
      });
      setAgreed(false);
    } catch (error) {
      toast.error(error.message || "Failed to submit. Please try again.", {
        position: "bottom-right"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-white">
      <div className="custom-container px-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 sm:p-10 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-[#253D4E] mb-6">Send Us A Message & Product Inquiry</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name, Email, and Mobile (3 Columns Layout) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name" 
                  className={`w-full h-11 px-4 border rounded-xl text-sm focus:outline-none focus:border-emerald-600 ${
                    errors.name ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email address" 
                  className={`w-full h-11 px-4 border rounded-xl text-sm focus:outline-none focus:border-emerald-600 ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* नया मोबाइल इनपुट फ़ील्ड */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Mobile Number</label>
                <input 
                  type="tel" 
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210" 
                  className={`w-full h-11 px-4 border rounded-xl text-sm focus:outline-none focus:border-emerald-600 ${
                    errors.mobile ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
              </div>
            </div>

            {/* Product Type & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Product Type</label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  className={`w-full h-11 px-4 border rounded-xl text-sm bg-white focus:outline-none focus:border-emerald-600 ${
                    errors.productType ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <option value="">Select a product...</option>
                  {products.map((prod, index) => (
                    <option key={index} value={prod}>{prod}</option>
                  ))}
                </select>
                {errors.productType && <p className="text-red-500 text-xs mt-1">{errors.productType}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Quantity</label>
                <input 
                  type="number" 
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="1" 
                  className={`w-full h-11 px-4 border rounded-xl text-sm focus:outline-none focus:border-emerald-600 ${
                    errors.quantity ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
              </div>
            </div>

            {/* Subject */}
            {/* <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Subject</label>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help you?" 
                className={`w-full h-11 px-4 border rounded-xl text-sm focus:outline-none focus:border-emerald-600 ${
                  errors.subject ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
            </div> */}

            {/* Message */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Message</label>
              <textarea 
                rows="5" 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..." 
                className={`w-full p-4 border rounded-xl text-sm focus:outline-none focus:border-emerald-600 resize-none ${
                  errors.message ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input 
                type="checkbox" 
                id="data-consent"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
              />
              <label htmlFor="data-consent" className="text-xs sm:text-sm font-medium text-gray-500 cursor-pointer select-none leading-relaxed">
                I agree that my submitted data is being collected
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="h-11 px-6 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#253D4E] transition-colors shadow-sm disabled:opacity-70 active:scale-95"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;