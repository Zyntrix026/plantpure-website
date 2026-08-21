import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Loader2, CheckCircle2, AlertCircle, Plus, Minus, ChevronDown, ArrowRight } from "lucide-react";
import { FaStar, FaStarHalfAlt, FaHeart } from "react-icons/fa";
import { addToCart, getCart, removeProductFromCart } from "../../lib/cart";
import { toggleWishlist, getWishlist } from "../../lib/wishlist";
import { isAuthenticated } from "../../lib/auth";
import { addToGuestCart, removeFromGuestCart, getGuestCart } from "../../lib/guestCart";
import { toggleGuestWishlist, getGuestWishlist, isGuestWishlisted } from "../../lib/guestWishlist";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import CheckoutAuthDrawer from '../checklist/CheckoutAuthDrawer'

const applyVat = (price, vat) => Number((price + (price * vat) / 100).toFixed(2));

const ProductInfo = ({ product }) => {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false);
  const { updateCartCount, isVatInc } = useCart();

  // Stable random review count (6 to 9) generated once per mount for zero-review products
  const [randomReviews] = useState(() => Math.floor(Math.random() * 4) + 6);

  // Auto-select first variant if product has variants
  useEffect(() => {
    if (product.hasVariants && product.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  // Re-check wishlist state when variant changes
  useEffect(() => {
    if (!product.hasVariants) return;
    const vid = selectedVariant?._id || null;
    if (isAuthenticated()) {
      getWishlist().then(res => {
        if (res?.success && res.items)
          setIsWishlisted(res.items.some(i => {
            const pid = i.product?._id;
            const ivid = i.variantId || null;
            return pid === product._id && (vid ? ivid?.toString() === vid.toString() : !ivid);
          }));
      }).catch(() => {});
    } else {
      setIsWishlisted(isGuestWishlisted(product._id, vid));
    }
  }, [selectedVariant]);

  useEffect(() => {
    const fetchStates = async () => {
      if (isAuthenticated()) {
        try {
          const [cartRes, wishlistRes] = await Promise.all([getCart(), getWishlist()]);
          if (cartRes?.cart?.items) setCartItems(cartRes.cart.items);
          if (wishlistRes?.success && wishlistRes.items) {
            const vid = product.hasVariants && product.variants?.[0]?._id ? product.variants[0]._id : null;
            setIsWishlisted(wishlistRes.items.some((i) => {
              const pid = i.product?._id;
              const ivid = i.variantId || null;
              return pid === product._id && (vid ? ivid?.toString() === vid.toString() : !ivid);
            }));
          }
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      } else {
        setCartItems(getGuestCart());
        const vid = product.hasVariants && product.variants?.[0]?._id ? product.variants[0]._id : null;
        setIsWishlisted(isGuestWishlisted(product._id, vid));
      }
    };
    fetchStates();
  }, [product._id]);

  const showToast = (msg, type = "success") => {
    if (type === "error") {
      toast.error(msg, { duration: 3000, position: "bottom-right" });
    } else {
      toast.success(msg, { duration: 3000, position: "bottom-right", style: { background: "#253D4E", color: "#fff", fontSize: "14px", fontWeight: "bold", borderRadius: "10px" } });
    }
  };

  const handleCheckoutClick = () => {
    if (isAuthenticated()) {
      navigate("/checkout");
    } else {
      setIsAuthDrawerOpen(true);
    }
  };

  const handleWishlistToggle = async () => {
    const vid = selectedVariant?._id || null;
    if (!isAuthenticated()) {
      const productObj = {
        ...product,
        ...(selectedVariant ? {
          variantId: vid,
          variantLabel: selectedVariant.label,
          variantStock: selectedVariant.stock,
          prices: {
            excludeVat: { base: selectedVariant.price, discount: selectedVariant.discountPrice || null },
            includeVat: {
              base: Number((selectedVariant.price * (1 + (product.vatPercentage || 0) / 100)).toFixed(2)),
              discount: selectedVariant.discountPrice
                ? Number((selectedVariant.discountPrice * (1 + (product.vatPercentage || 0) / 100)).toFixed(2))
                : null,
            },
          },
        } : {}),
      };
      const { wishlisted } = toggleGuestWishlist(productObj, vid);
      setIsWishlisted(wishlisted);
      toast.success(wishlisted ? "Added to wishlist" : "Removed from wishlist", { position: "bottom-right", style: { background: "#253D4E", color: "#fff" } });
      return;
    }
    try {
      setWishlistLoading(true);
      const res = await toggleWishlist(product._id, vid);
      if (res.success) {
        setIsWishlisted(!isWishlisted);
        toast.success(res.message || "Wishlist updated", { position: "bottom-right", style: { background: "#253D4E", color: "#fff" } });
      }
    } catch {
      toast.error("Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  // --- Determine active stock & cart item ---
  const activeStock = product.hasVariants ? (selectedVariant?.stock ?? 0) : product.stock;
  const cartItemKey = product.hasVariants
    ? `${product._id}_${selectedVariant?._id || selectedVariant?.label}`
    : product._id;

  const cartItem = cartItems.find((item) => {
    const pMatch = (item.productId?._id || item.productId)?.toString() === product._id?.toString();
    if (product.hasVariants && selectedVariant) {
      return pMatch && (item.variantId?.toString() === selectedVariant._id?.toString());
    }
    return pMatch && !item.variantId;
  });
  const quantity = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = activeStock <= 0;
  const isMaxLimitReached = quantity >= activeStock;

  const handleQuantity = async (action) => {
    if (product.hasVariants && !selectedVariant) {
      showToast("Please select a variant first", "error");
      return;
    }

    if (!isAuthenticated()) {
      const cartProduct = {
        ...product,
        ...(product.hasVariants && selectedVariant
          ? {
              variantId: selectedVariant._id,
              variantLabel: selectedVariant.label,
              variantStock: selectedVariant.stock,
              prices: {
                excludeVat: { base: selectedVariant.price, discount: selectedVariant.discountPrice || null },
                includeVat: {
                  base: Number((selectedVariant.price * (1 + (product.vatPercentage || 0) / 100)).toFixed(2)),
                  discount: selectedVariant.discountPrice
                    ? Number((selectedVariant.discountPrice * (1 + (product.vatPercentage || 0) / 100)).toFixed(2))
                    : null,
                },
              },
            }
          : {}),
      };
      if (action === "inc") {
        if (quantity >= activeStock) { showToast(`Only ${activeStock} units available`, "error"); return; }
        const updated = addToGuestCart(cartProduct, 1);
        setCartItems(updated);
        updateCartCount(updated.length);
        showToast(`${product.title}${selectedVariant ? ` (${selectedVariant.label})` : ''} added to cart!`);
      } else {
        if (quantity <= 1) return;
        const updated = removeFromGuestCart(product._id, selectedVariant?._id || null);
        setCartItems(updated);
        updateCartCount(updated.length);
      }
      return;
    }

    if (action === "inc" && quantity >= activeStock) {
      showToast(`Only ${activeStock} units available in stock`, "error");
      return;
    }

    try {
      setUpdatingId(cartItemKey);
      let response;
      if (action === "inc") {
        setAdding(true);
        const cartPayload = {
          items: [{
            productId: product._id,
            quantity: 1,
            ...(product.hasVariants && selectedVariant
              ? { variantId: selectedVariant._id, variantLabel: selectedVariant.label }
              : {}),
          }],
        };
        response = await addToCart(cartPayload);
        showToast(`${product.title}${selectedVariant ? ` (${selectedVariant.label})` : ''} added to cart!`);
      } else {
        if (quantity <= 1) return;
        response = await removeProductFromCart(product._id, selectedVariant?._id || null);
        showToast(`Decreased quantity`);
      }
      const updatedCart = response.cart || response.updatedCart;
      if (updatedCart) { setCartItems(updatedCart.items); updateCartCount(updatedCart.items.length); }
    } catch {
      toast.error("Could not update cart. Please try again.");
    } finally {
      setUpdatingId(null);
      setAdding(false);
    }
  };

  // Safe Extraction of DB Attributes
  const realAvgRating = product.ratings?.average || 0;
  const totalReviews = product.ratings?.count || 0;
  const isZeroReviews = totalReviews === 0;

  // Fallback Values: 0 Reviews honge toh 5.0 Rating + Full Colored Stars
  const displayRating = isZeroReviews ? 5 : realAvgRating;
  const displayReviewCount = isZeroReviews ? randomReviews : totalReviews;

  // Dynamic Star Renderer Engine
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} size={14} className="text-[#f3dd70]" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} size={14} className="text-[#f3dd70]" />);
      } else {
        stars.push(<FaStar key={i} size={14} className="text-gray-200" />);
      }
    }
    return stars;
  };

  // --- Price Calculation ---
  const vat = product.vatPercentage || 0;
  let displayPrice, originalPrice, hasDiscount, secondaryDisplayPrice;

  if (product.hasVariants && selectedVariant) {
    const base = selectedVariant.price;
    const disc = selectedVariant.discountPrice || null;
    if (isVatInc) {
      displayPrice = disc ? applyVat(disc, vat) : applyVat(base, vat);
      originalPrice = applyVat(base, vat);
      secondaryDisplayPrice = disc ? disc : base;
    } else {
      displayPrice = disc || base;
      originalPrice = base;
      secondaryDisplayPrice = disc ? applyVat(disc, vat) : applyVat(base, vat);
    }
    hasDiscount = disc && disc < base;
  } else {
    const activePrices = isVatInc ? product.prices?.includeVat : product.prices?.excludeVat;
    displayPrice = activePrices?.discount || activePrices?.base;
    originalPrice = activePrices?.base;
    hasDiscount = displayPrice < originalPrice;
    const oppositePrice = isVatInc ? product.prices?.excludeVat : product.prices?.includeVat;
    secondaryDisplayPrice = oppositePrice?.discount || oppositePrice?.base;
  }

  return (
    <div className="flex-1 font-['Quicksand']">
      <div className="flex items-center gap-3 mb-3">
        {!isOutOfStock ? (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm text-emerald-600 font-bold"><CheckCircle2 size={12} /> In Stock</span>
            <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">{activeStock} units available</span>
          </div>
        ) : (
          <span className="flex items-center gap-1 text-sm text-red-500 font-bold"><AlertCircle size={14} /> Out of Stock</span>
        )}
      </div>

      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#253D4E] leading-tight">{product.title}</h1>

      {/* Dynamic Star Ratings block nodes */}
      <div
        onClick={() => navigate("/customer-review")}
        className="flex items-center gap-2 mt-3 cursor-pointer hover:opacity-80 transition-opacity w-fit select-none"
        title="Click to view reviews"
      >
        <div className="flex items-center gap-0.5">
          {renderStars(displayRating)}
        </div>
        <span className="text-xs text-gray-500 font-semibold bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
          ({displayRating.toFixed(1)} Rating • {displayReviewCount} {displayReviewCount === 1 ? "Review" : "Reviews"})
        </span>
      </div>

      {/* Variant Selector - Dropdown Implementation */}
      {product.hasVariants && product.variants?.length > 0 && (
        <div className="mt-5 max-w-xs">
          <label htmlFor="variant-select" className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
            Select Option
          </label>
          <div className="relative">
            <select
              id="variant-select"
              value={selectedVariant ? JSON.stringify(selectedVariant) : ""}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedVariant(JSON.parse(e.target.value));
                }
              }}
              className="w-full appearance-none bg-white border border-gray-200 text-[#253D4E] font-bold py-3 pl-4 pr-10 rounded-lg text-sm focus:outline-none focus:border-[#253D4E] transition-all shadow-sm cursor-pointer"
            >
              {product.variants.map((v) => {
                const outOfStock = v.stock <= 0;
                return (
                  <option
                    key={v._id || v.label}
                    value={JSON.stringify(v)}
                    disabled={outOfStock}
                    className="text-[#253D4E] font-medium disabled:text-gray-300"
                  >
                    {v.label} {outOfStock ? "(Out of Stock)" : ""}
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#253D4E]">
              <ChevronDown size={16} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      )}

      {/* Price Block */}
      <div className="mt-5 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-bold text-primary">
            Rs. {displayPrice}
            <span className="text-xs ml-1.5 text-gray-400 font-bold tracking-tighter">Inc all taxes </span>
          </span>
        </div>
      </div>

      <p className="mt-6 text-[#253D4E]/70 leading-relaxed font-medium text-[15px]">{product.excerpt}</p>

      {/* Actions Block */}
      <div className="flex flex-wrap items-center gap-4 mt-8">
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
          <button onClick={() => handleQuantity("dec")} disabled={updatingId === cartItemKey || quantity <= 1} className="w-10 h-10 flex items-center justify-center rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-30 transition-all active:scale-90">
            <Minus size={18} strokeWidth={3} className="text-[#253D4E]" />
          </button>
          <div className="w-12 h-10 flex items-center justify-center font-bold text-[#253D4E] text-lg">
            {updatingId === cartItemKey && !adding ? <Loader2 size={16} className="animate-spin text-gray-400" /> : quantity || 1}
          </div>
          <button onClick={() => handleQuantity("inc")} disabled={updatingId === cartItemKey || isMaxLimitReached || isOutOfStock} className="w-10 h-10 flex items-center justify-center rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-30 transition-all active:scale-90">
            <Plus size={18} strokeWidth={3} className="text-[#253D4E]" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => handleQuantity("inc")}
          disabled={adding || isOutOfStock || isMaxLimitReached || (product.hasVariants && !selectedVariant)}
          className="flex items-center justify-center flex-1 sm:flex-none min-w-[200px] gap-2 bg-secondary text-primary px-8 py-3.5 rounded-lg text-sm font-black hover:bg-opacity-90 transition shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {adding ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
          <span>{isOutOfStock ? "Out of Stock" : isMaxLimitReached ? "Limit Reached" : adding ? "Updating..." : quantity > 0 ? "Add More" : "Add to Cart"}</span>
        </button>

        {/* Place Order Button - Only Visible when quantity > 0 */}
        {quantity > 0 && (
          <button
            onClick={handleCheckoutClick}
            className="flex items-center justify-center flex-1 sm:flex-none min-w-[180px] gap-2 bg-[#253D4E] text-white px-8 py-3.5 rounded-lg text-sm font-black hover:bg-[#1e313e] transition shadow-lg shadow-[#253D4E]/20 animate-in fade-in zoom-in duration-200"
          >
            <span>Place Order</span>
            <ArrowRight size={18} />
          </button>
        )}

        {/* Wishlist Button */}
        <button onClick={handleWishlistToggle} disabled={wishlistLoading} className="p-3.5 border border-gray-200 rounded-lg hover:bg-white hover:border-secondary hover:shadow-md transition group">
          {wishlistLoading ? <Loader2 size={20} className="animate-spin text-gray-400" /> : isWishlisted ? <FaHeart size={20} className="text-red-500" /> : <Heart size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />}
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-dashed border-gray-200 space-y-2">
        <div className="grid grid-cols-2 max-w-[400px] text-[13px]">
          <span className="text-gray-500 font-bold">SKU:</span>
          <span className="text-[#253D4E] font-medium">
            {product.hasVariants && selectedVariant?.sku ? selectedVariant.sku : product.sku}
          </span>
          <span className="text-gray-500 font-bold">Brand:</span>
          <span className="text-[#253D4E] font-medium">{product.brand}</span>
        </div>
      </div>

      {/* Checkout Authentication Drawer Modal */}
      <CheckoutAuthDrawer 
        isOpen={isAuthDrawerOpen} 
        onClose={() => setIsAuthDrawerOpen(false)} 
      />
    </div>
  );
};

export default ProductInfo;