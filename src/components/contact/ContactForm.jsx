import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("Please agree to data collection terms.", { position: "bottom-right" });
      return;
    }
    
    setLoading(true);
    // डमी सबमिशन टाइमआउट
    setTimeout(() => {
      toast.success("Message sent successfully!", {
        position: "bottom-right",
        style: { background: "#253D4E", color: "#fff" }
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setAgreed(false);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="py-16 bg-white ">
      <div className="custom-container px-4 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 sm:p-10 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-[#253D4E] mb-6">Send Us A Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name" 
                  className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Your email address" 
                  className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Subject</label>
              <input 
                type="text" 
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="How can we help you?" 
                className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Message</label>
              <textarea 
                rows="5" 
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message here..." 
                className="w-full p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 resize-none"
              />
            </div>

            {/* User Content Specific Checkbox */}
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