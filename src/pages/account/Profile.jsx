import React, { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../../lib/profile";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "not specified",
    phone: "",
  });

  // 1. Fetch Profile Data on Load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        // response.data.data because of your API structure
        const user = response?.data || response?.data?.data || {};
        
        setFormData({
          name: user.name || "",
          email: user.email || "",
          gender: user.gender || "not specified",
          phone: user.phone || "",
        });
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Update Profile Function
  const handleUpdate = async () => {
    try {
      setUpdateLoading(true);
      const res = await updateProfile(formData);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl text-slate-800 font-bold">Personal Information</h2>
        <button
          onClick={() => {
            if (isEditing) setIsEditing(false);
            else setIsEditing(true);
          }}
          className="text-primary font-semibold hover:underline cursor-pointer"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="space-y-8">
        {/* Name Input (Single field as per your Model) */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full p-4 border rounded-xl outline-none transition-all ${
              isEditing ? "border-primary bg-white ring-4 ring-primary/5" : "border-slate-100 bg-slate-50 cursor-not-allowed"
            }`}
          />
        </div>

        {/* Gender Selection */}
        <div>
          <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Your Gender</label>
          <div className="flex flex-wrap gap-6">
            {['male', 'female', 'other', 'not specified'].map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  checked={formData.gender === option}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="accent-primary w-5 h-5 cursor-pointer"
                />
                <span className={`capitalize ${formData.gender === option ? "text-primary font-bold" : "text-slate-600"}`}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Email Section (Disabled usually for security, but editable here) */}
        <div className="pt-4">
          <h3 className="text-lg text-slate-800 font-bold mb-2">Email Address</h3>
          <input
            name="email"
            type="email"
            value={formData.email}
            disabled={true} // Email typically login ID hota hai, isliye readonly rakha hai
            className="md:w-1/2 w-full p-4 border border-slate-100 bg-slate-50 rounded-xl cursor-not-allowed text-slate-400"
          />
          <p className="text-xs text-slate-400 mt-2 italic">Email cannot be changed for security reasons.</p>
        </div>

        {/* Mobile Number Section */}
        <div className="pt-4">
          <h3 className="text-lg text-slate-800 font-bold mb-2">Mobile Number</h3>
          <input
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Enter phone number"
            className={`md:w-1/2 w-full p-4 border rounded-xl outline-none transition-all ${
              isEditing ? "border-primary bg-white ring-4 ring-primary/5" : "border-slate-100 bg-slate-50 cursor-not-allowed"
            }`}
          />
        </div>

        {/* Save Button */}
        {isEditing && (
          <button
            onClick={handleUpdate}
            disabled={updateLoading}
            className="bg-primary text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 active:scale-[0.98] transition-all uppercase tracking-wide flex items-center gap-2"
          >
            {updateLoading && <Loader2 className="animate-spin" size={20} />}
            Save Changes
          </button>
        )}
      </div>

      {/* FAQ Section */}
      {/* <div className="mt-16 border-t border-slate-100 pt-10">
        <h4 className="text-slate-800 font-bold mb-4">FAQs</h4>
        <div className="space-y-6 text-sm text-slate-500 leading-relaxed">
          <p>
            <strong className="text-slate-700 block mb-1">What happens when I update my info?</strong>
            Your profile details will be updated instantly across our platform.
          </p>
          <p>
            <strong className="text-slate-700 block mb-1">Is my data secure?</strong>
            We use industry-standard encryption to protect your personal information.
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default Profile;