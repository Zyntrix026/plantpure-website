import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Trash2, Loader2, AlertTriangle, X, Info } from "lucide-react";
import { RiArrowDropRightLine } from "react-icons/ri";
import { getCart, addToCart, removeProductFromCart, removeItemCompletely, clearCart } from "../lib/cart";
import { isAuthenticated } from "../lib/auth";
import { getGuestCart, addToGuestCart, removeFromGuestCart, clearGuestCart } from "../lib/guestCart";
import { toggleGuestWishlist } from "../lib/guestWishlist";
import { toggleWishlist } from "../lib/wishlist";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import CheckoutAuthDrawer from "../components/checklist/CheckoutAuthDrawer";

const DeleteModal = ({ isOpen, onClose, onConfirm, loading, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[60] p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-red-50 rounded-lg text-red-600"><AlertTriangle size={24} /></div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>
        <h3 className="text-lg font-bold text-slate-900">{title || "Confirm Delete"}</h3>
        <p className="text-slate-500 text-sm mt-2 leading-relaxed">{message}</p>
        <div className="flex gap-3 mt-6">
          <button disabled={loading} onClick={onClose} className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
          <button disabled={loading} onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold shadow-lg hover:bg-red-600 transition-all disabled:opacity-50">
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

const SkeletonRow = () => (
  <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 animate-pulse">
    <div className="w-full sm:w-28 flex flex-col items-center gap-3">
      <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
      <div className="w-20 h-8 bg-gray-200 rounded-full"></div>
    </div>
    <div className="flex-1 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

const CheckList = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { updateCartCount, isVatInc } = useCart();
  
  // Modals state
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, targetId: null, targetVariantId: null, targetName: "" });
  const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false);

  const fetchCart = async () => {
    try {
      if (!isAuthenticated()) {
        const guestItems = getGuestCart();
        setCart({ items: guestItems, totalPrice: 0, totalSavings: 0 });
        updateCartCount(guestItems.length);
        setLoading(false);
        return;
      }
      const data = await getCart();
      setCart(data.cart);
      if (data?.cart?.items) updateCartCount(data.cart.items.length);
    } catch (err) {
      console.error("Fetch Cart Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleCheckoutClick = () => {
    if (isAuthenticated()) {
      navigate("/checkout");
    } else {
      setIsAuthDrawerOpen(true);
    }
  };

  const showToast = (msg, type = "success") => {
    if (type === "error") {
      toast.error(msg, { duration: 3000, position: "bottom-right" });
    } else {
      toast.success(msg, { duration: 3000, position: "bottom-right", style: { background: "#253D4E", color: "#fff", fontSize: "14px", fontWeight: "bold" } });
    }
  };

  const handleQuantity = async (productId, currentQty, action, name, maxStock, variantId = null) => {
    if (updating) return;

    if (!isAuthenticated()) {
      if (action === "inc") {
        if (currentQty >= maxStock) { showToast(`Only ${maxStock} units available`, "error"); return; }
        const product = cart?.items?.find(i =>
          variantId ? (i.productId === productId && i.variantId === variantId) : i.productId === productId
        );
        const updated = addToGuestCart(product, 1);
        setCart(prev => ({ ...prev, items: updated }));
        updateCartCount(updated.length);
        showToast(`Increased quantity of ${name}`);
      } else {
        if (currentQty <= 1) return;
        const updated = removeFromGuestCart(productId, variantId);
        setCart(prev => ({ ...prev, items: updated }));
        updateCartCount(updated.length);
      }
      return;
    }

    if (action === "inc" && currentQty >= maxStock) {
      showToast(`Only ${maxStock} units available in stock`, "error");
      return;
    }

    try {
      setUpdating(true);
      if (action === "inc") {
        await addToCart({ items: [{ productId, quantity: 1, ...(variantId && { variantId }) }] });
        showToast(`Increased quantity of ${name}`);
      } else {
        if (currentQty <= 1) return;
        await removeProductFromCart(productId, variantId);
        showToast(`Decreased quantity of ${name}`);
      }
      await fetchCart();
    } catch {
      toast.error("Failed to update quantity");
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveForLater = async (item) => {
    try {
      const vid = item.variantId || null;
      if (!isAuthenticated()) {
        const productObj = {
          _id: item.productId,
          title: item.name,
          category: item.category,
          thumbnail: item.image,
          slug: item.slug,
          stock: item.stock,
          prices: item.prices,
          discountPercentage: item.discountPercentage,
          vatPercentage: item.vatPercentage,
          ...(vid ? { variantId: vid, variantLabel: item.variantLabel, variantStock: item.stock } : {}),
        };
        toggleGuestWishlist(productObj, vid);
        const updated = cart.items.filter(i => {
          if (vid) return !(i.productId === item.productId && i.variantId === vid);
          return i.productId !== item.productId;
        });
        localStorage.setItem("guest_cart", JSON.stringify(updated));
        setCart(prev => ({ ...prev, items: updated }));
        updateCartCount(updated.length);
        showToast(`${item.name} saved to wishlist`);
        return;
      }
      await toggleWishlist(item.productId, vid);
      await removeItemCompletely(item.productId, vid);
      await fetchCart();
      showToast(`${item.name} saved to wishlist`);
    } catch {
      toast.error("Failed to save for later");
    }
  };

  const executeClearCart = async () => {
    try {
      setUpdating(true);
      if (!isAuthenticated()) {
        clearGuestCart();
        setCart({ items: [], totalPrice: 0, totalSavings: 0 });
        updateCartCount(0);
        setModalConfig({ isOpen: false, type: null, targetId: null, targetVariantId: null, targetName: "" });
        showToast("Cart cleared successfully!");
        return;
      }
      await clearCart();
      setCart({ items: [], totalPrice: 0, totalSavings: 0 });
      updateCartCount(0);
      setModalConfig({ isOpen: false, type: null, targetId: null, targetVariantId: null, targetName: "" });
      showToast("Cart cleared successfully!");
    } catch {
      toast.error("Failed to clear cart");
    } finally {
      setUpdating(false);
    }
  };

  const executeRemoveItem = async () => {
    try {
      setUpdating(true);
      const removedName = modalConfig.targetName;
      const variantId = modalConfig.targetVariantId || null;
      if (!isAuthenticated()) {
        const updated = cart.items.filter(i => {
          if (variantId) return !(i.productId === modalConfig.targetId && i.variantId === variantId);
          return i.productId !== modalConfig.targetId;
        });
        localStorage.setItem("guest_cart", JSON.stringify(updated));
        setCart(prev => ({ ...prev, items: updated }));
        updateCartCount(updated.length);
        setModalConfig({ isOpen: false, type: null, targetId: null, targetVariantId: null, targetName: "" });
        showToast(`${removedName} removed from cart`);
        return;
      }
      await removeItemCompletely(modalConfig.targetId, variantId);
      await fetchCart();
      setModalConfig({ isOpen: false, type: null, targetId: null, targetVariantId: null, targetName: "" });
      showToast(`${removedName} removed from cart`);
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setUpdating(false);
    }
  };

  const items = cart?.items || [];
  const itemCount = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const summary = (() => {
    let subtotalExclVat = 0, totalVat = 0, savings = 0;
    items.forEach(item => {
      const qty = item.quantity || 0;
      const exclVat = item.prices?.excludeVat;
      const inclVat = item.prices?.includeVat;
      const unitPriceExcl = exclVat?.discount || exclVat?.base || 0;
      const unitPriceIncl = inclVat?.discount || inclVat?.base || 0;
      const unitBaseExcl = exclVat?.base || 0;
      subtotalExclVat += unitPriceExcl * qty;
      totalVat += (unitPriceIncl - unitPriceExcl) * qty;
      savings += (unitBaseExcl - unitPriceExcl) * qty;
    });
    return { subtotalExclVat, totalVat, totalInclVat: subtotalExclVat + totalVat, savings: Math.max(0, savings) };
  })();

  return (
    <div className=" bg-[#ffffff]">
      {/* Auth Modal/Drawer */}
      <CheckoutAuthDrawer 
        isOpen={isAuthDrawerOpen} 
        onClose={() => setIsAuthDrawerOpen(false)} 
      />

      <DeleteModal
        isOpen={modalConfig.isOpen}
        loading={updating}
        onClose={() => setModalConfig({ isOpen: false, type: null, targetId: null, targetVariantId: null, targetName: "" })}
        onConfirm={modalConfig.type === "clear" ? executeClearCart : executeRemoveItem}
        title={modalConfig.type === "clear" ? "Clear Cart" : "Remove Item"}
        message={modalConfig.type === "clear" ? "Are you sure you want to remove all items from your cart?" : `Are you sure you want to remove ${modalConfig.targetName} from your cart?`}
      />

      {updating && (
        <div className="fixed inset-0 bg-white/30 z-[99] flex items-center justify-center backdrop-blur-[1px]">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      )}

      {/* <div className="pt-3">
        <div className="max-w-[1350px] rounded-lg mx-auto bg-white border-b border-[#ECECEC] shadow-[0_1px_4px_rgba(0,0,0,0.06)] px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 py-4">
            <Home size={16} className="text-primary" />
            <Link to="/" className="hover:text-primary font-medium">Home</Link>
            <span><RiArrowDropRightLine size={20} /></span>
            <span className="font-medium text-primary">Checklist</span>
          </div>
        </div>
      </div> */}

      <div className="custom-container px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 space-y-3">
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-primary">My Cart ({loading ? "..." : itemCount})</h2>
                {!loading && itemCount > 0 && (
                  <button onClick={() => setModalConfig({ isOpen: true, type: "clear", targetId: null, targetVariantId: null, targetName: "" })} className="text-xs font-bold text-red-500 hover:bg-red-50 px-2 py-1 rounded transition flex items-center gap-1">
                    <Trash2 size={14} /> CLEAR ALL
                  </button>
                )}
              </div>

              {loading ? (
                <><SkeletonRow /><SkeletonRow /></>
              ) : itemCount > 0 ? (
                items.map((item) => {
                  const activePrices = isVatInc ? item.prices?.includeVat : item.prices?.excludeVat;
                  const unitPrice = activePrices?.discount || activePrices?.base;
                  const unitOriginal = activePrices?.base;
                  const hasDiscount = (unitPrice || 0) < (unitOriginal || 0);
                  const isMaxLimitReached = item.quantity >= item.stock;

                  return (
                    <div key={item._id || item.productId} className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 hover:shadow-[0_3px_10px_rgba(0,0,0,0.06)] transition">
                      <div className="w-full sm:w-28 flex flex-col items-center gap-3">
                        <img src={item.image} className="w-24 h-24 object-contain cursor-pointer hover:scale-105 transition-transform" alt={item.name} onClick={() => navigate(`/${item?.category[0]?.slug || "building"}/${item.slug}`)} />
                        <div className="flex items-center border border-gray-400 rounded-full overflow-hidden">
                          <button onClick={() => handleQuantity(item.productId, item.quantity, "dec", item.name, item.stock, item.variantId || null)} className="px-3 py-1 bg-gray-50 hover:bg-gray-200 border-r border-gray-300 disabled:opacity-30" disabled={item.quantity <= 1}>-</button>
                          <input type="text" value={item.quantity} className="w-8 text-center text-sm font-bold outline-none" readOnly />
                          <button onClick={() => handleQuantity(item.productId, item.quantity, "inc", item.name, item.stock, item.variantId || null)} className="px-3 py-1 bg-gray-50 hover:bg-gray-200 border-l border-gray-300 disabled:opacity-30" disabled={isMaxLimitReached}>+</button>
                        </div>
                        {isMaxLimitReached && <span className="text-[9px] text-red-500 font-bold">Max Stock Reached</span>}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-primary leading-tight cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate(`/${item?.category[0]?.slug || "building"}/${item.slug}`)}>{item.name}</h3>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase">{item.stock} Units left in stock</p>
                          </div>
                          <div className="text-xs font-semibold text-primary/50 text-right">
                            {/* VAT: {item.vatPercentage}%<br /> */}
                            <span className="text-[10px]">Delivery in 2-4 Days</span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          <span className="text-lg font-bold text-[#212121]">Rs. {(unitPrice || 0).toFixed(2)}</span>
                          {hasDiscount && (
                            <>
                              <span className="text-sm text-gray-400 line-through">Rs. {(unitOriginal || 0).toFixed(2)}</span>
                              <span className="text-sm text-green-600 font-semibold">{item.discountPercentage}</span>
                            </>
                          )}
                          {/* <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold">{isVatInc ? "Incl. VAT" : "Excl. VAT"}</span> */}
                        </div>
                        <div className="mt-6 flex gap-6">
                          <button onClick={() => handleSaveForLater(item)} className="text-sm font-semibold text-gray-700 uppercase hover:text-primary transition">Save for later</button>
                          <button onClick={() => setModalConfig({ isOpen: true, type: "remove", targetId: item.productId, targetVariantId: item.variantId || null, targetName: item.name })} className="text-sm font-semibold text-red-500 uppercase hover:text-red-700 transition">Remove</button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-16 text-center">
                  <p className="text-gray-400 font-medium mb-4 text-lg">Oops! Your cart is feeling lonely.</p>
                  <Link to="/" className="bg-primary text-white px-8 py-2 rounded shadow-lg hover:opacity-90 transition">Start Shopping</Link>
                </div>
              )}

              <div className="p-4 bg-white flex justify-end shadow-[0_-2px_10px_rgba(0,0,0,0.08)] sticky bottom-0 z-10">
                <button
                  onClick={handleCheckoutClick}
                  disabled={itemCount === 0}
                  className={`${itemCount === 0 ? "pointer-events-none opacity-50" : ""} bg-primary text-white text-sm sm:text-base font-semibold px-12 py-3 rounded-sm shadow-md hover:bg-[#253D4E]/90 transition uppercase`}
                >
                  PLACE ORDER
                </button>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[380px] shrink-0 h-fit sticky top-[100px]">
            <div className="bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.1)] overflow-hidden">
              <h3 className="px-4 py-3 border-b border-gray-100 text-primary font-extrabold uppercase text-xs tracking-widest flex items-center gap-2">
                <Info size={14} /> Price Details
              </h3>
              <div className="p-4 space-y-4">
                <div className="flex justify-between text-base text-gray-500 font-medium">
                  <span>Price ({totalQuantity} items)</span>
                  <span>Rs. {summary.subtotalExclVat.toFixed(2)}</span>
                </div>
                {summary.savings > 0 && (
                  <div className="flex justify-between text-base text-green-600 font-medium">
                    <span>Discount</span><span>-Rs. {summary.savings.toFixed(2)}</span>
                  </div>
                )}
                {/* <div className="flex justify-between text-base text-gray-500 font-medium">
                  <span>Total VAT</span><span>+Rs. {summary.totalVat.toFixed(2)}</span>
                </div> */}
                <div className="flex justify-between text-base text-gray-500 font-medium">
                  <span>Delivery Charges</span><span className="text-orange-500 font-bold text-sm">Calculated at checkout</span>
                </div>
                <div className="border-t border-dashed border-gray-300 pt-4">
                  <div className="flex justify-between text-xl font-bold text-primary">
                    <span>Total Amount</span>
                    <div className="text-right">
                      <p>Rs. {summary.totalInclVat.toFixed(2)}</p>
                      <span className="text-[10px] text-gray-400 block font-normal">(Inclusive of all taxes)</span>
                    </div>
                  </div>
                </div>
              </div>
              {summary.savings > 0 && (
                <div className="p-4 bg-green-50/50 border-t border-gray-100 text-center font-bold text-green-600 text-sm italic">
                  🎉 YOU SAVE Rs. {summary.savings.toFixed(2)} ON THIS ORDER
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckList;