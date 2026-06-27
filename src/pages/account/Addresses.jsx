import React, { useState, useEffect, useCallback } from "react";
import { Plus, MapPin, Trash2, Edit3, Loader2, CheckCircle2, X } from "lucide-react";
import { getProfile, addAddress, updateAddress, deleteAddress, setDefaultAddress } from "../../lib/profile";
import toast from "react-hot-toast";

const Addresses = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United Kingdom",
    isDefault: false
  });

  // --- 1. Fetch Addresses (Exact Structure Fix) ---
  const fetchUserAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      
      /**
       * FIX: Aapke JSON structure ke mutabiq:
       * res.data -> main object
       * res.data.data -> profile object
       * res.data.data.addresses -> array
       */
      const addresses = res?.data?.addresses || res?.data?.data?.addresses || [];
      setSavedAddresses(addresses);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserAddresses();
  }, [fetchUserAddresses]);

  // --- Helper to update UI after Action ---
  const updateState = (res) => {
    /**
     * Action APIs (Add/Delete) hamesha updated data return karti hain.
     * Check structure: res.data (if it's the array) or res.data.data
     */
    const freshData = res?.data || res?.data?.data || [];
    setSavedAddresses(Array.isArray(freshData) ? freshData : (freshData.addresses || []));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // --- 2. SAVE (ADD/UPDATE) ---
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.street || !formData.city || !formData.zipCode) {
      return toast.error("Please fill required fields");
    }

    try {
      setActionLoading(true);
      let res;
      if (editingId) {
        res = await updateAddress(editingId, formData);
        toast.success("Address updated successfully");
      } else {
        res = await addAddress(formData);
        toast.success("Address added successfully");
      }
      
      updateState(res);
      resetForm();
    } catch (error) {
      toast.error(error.message || "Failed to save address");
    } finally {
      setActionLoading(false);
    }
  };

  // --- 3. DELETE ---
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      setActionLoading(true);
      const res = await deleteAddress(id);
      updateState(res);
      toast.success("Address removed");
    } catch (error) {
      toast.error(error.message || "Failed to delete");
    } finally {
      setActionLoading(false);
    }
  };

  // --- 4. SET DEFAULT ---
  const handleSetDefault = async (id) => {
    try {
      setActionLoading(true);
      const res = await setDefaultAddress(id);
      updateState(res);
      toast.success("Default address updated");
    } catch (error) {
      toast.error(error.message || "Failed to set default");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (addr) => {
    setFormData({
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: addr.country,
      isDefault: addr.isDefault
    });
    setEditingId(addr._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData({ street: "", city: "", state: "", zipCode: "", country: "United Kingdom", isDefault: false });
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Manage Addresses</h2>
          <p className="text-sm text-slate-500">Add or edit your delivery locations</p>
        </div>
        {(actionLoading || loading) && <Loader2 className="animate-spin text-primary" size={24} />}
      </div>

      {/* Form Toggle Button */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-3 p-6 border-2 border-dashed border-slate-200 text-primary font-bold rounded-2xl hover:bg-blue-50 hover:border-primary transition-all mb-8 group"
        >
          <Plus size={22} className="group-hover:rotate-90 transition-transform" />
          ADD A NEW ADDRESS
        </button>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xl mb-8 animate-in fade-in zoom-in duration-300 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold uppercase text-xs tracking-widest text-slate-400 flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              {editingId ? "Modify Address" : "New Address Details"}
            </h3>
            <button onClick={resetForm} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
          </div>
          
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Area and Street *</label>
              <textarea name="street" value={formData.street} onChange={handleChange} placeholder="Apartment, suite, unit, building, floor, etc." className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 h-24 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">City / Town *</label>
              <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Pincode *</label>
              <input name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Zip Code" className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="p-4 border border-slate-200 rounded-xl bg-slate-50" />
            <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="p-4 border border-slate-200 rounded-xl bg-slate-50" />

            <div className="md:col-span-2 flex items-center gap-3 py-2">
              <input id="isDefault" name="isDefault" type="checkbox" checked={formData.isDefault} onChange={handleChange} className="w-5 h-5 accent-primary rounded cursor-pointer" />
              <label htmlFor="isDefault" className="text-sm font-semibold text-slate-600 cursor-pointer select-none">Make this my default address</label>
            </div>

            <button disabled={actionLoading} type="submit" className="md:col-span-2 bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center gap-2">
              {actionLoading && <Loader2 className="animate-spin" size={20} />}
              {editingId ? "UPDATE ADDRESS" : "SAVE ADDRESS"}
            </button>
          </form>
        </div>
      )}

      {/* Address Cards */}
      <div className="grid grid-cols-1 gap-5">
        {loading ? (
          <div className="space-y-4">
            <div className="h-40 bg-slate-100 rounded-3xl animate-pulse" />
            <div className="h-40 bg-slate-100 rounded-3xl animate-pulse" />
          </div>
        ) : savedAddresses.length > 0 ? (
          savedAddresses.map((addr) => (
            <div key={addr._id} className={`group border-2 rounded-3xl p-6 transition-all bg-white relative ${addr.isDefault ? 'border-primary/40 bg-blue-50/20 ring-4 ring-primary/5' : 'border-slate-100 hover:border-slate-200 hover:shadow-xl'}`}>
              
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${addr.isDefault ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <MapPin size={20} />
                  </div>
                  {addr.isDefault ? (
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded">Default Address</span>
                  ) : (
                    <button onClick={() => handleSetDefault(addr._id)} className="text-[10px] font-bold text-slate-400 hover:text-primary uppercase tracking-widest transition-colors">Set as default</button>
                  )}
                </div>
                
                <div className="flex gap-1">
                   <button onClick={() => handleEdit(addr)} className="p-2.5 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-xl transition-all" title="Edit">
                     <Edit3 size={18} />
                   </button>
                   <button onClick={() => handleDelete(addr._id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete">
                     <Trash2 size={18} />
                   </button>
                </div>
              </div>

              <div>
                <p className="text-slate-800 font-bold text-lg leading-tight mb-2 pr-10">
                  {addr.street}
                </p>
                <div className="flex flex-wrap gap-x-2 gap-y-1 text-slate-500 text-sm font-medium">
                  <span>{addr.city},</span>
                  <span>{addr.state}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-800">{addr.zipCode}</span>
                  <span className="text-slate-300">|</span>
                  <span>{addr.country}</span>
                </div>
              </div>

              {/* Decorative side bar for default */}
              {addr.isDefault && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full" />}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <MapPin size={32} className="text-slate-300" />
            </div>
            <h4 className="text-slate-800 font-bold mb-1">No addresses found</h4>
            <p className="text-slate-500 text-sm">Please add a delivery address to continue.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;