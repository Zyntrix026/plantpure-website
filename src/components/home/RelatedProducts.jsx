import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart } from "react-icons/fa";
import { ShoppingCart, Loader2, Plus, Minus, Heart } from "lucide-react"; 
import { getProducts } from "../../lib/product"; 
import { addToCart, getCart, removeProductFromCart } from "../../lib/cart";
import { toggleWishlist, getWishlist } from "../../lib/wishlist"; 
import { isAuthenticated } from "../../lib/auth";
import { addToGuestCart, removeFromGuestCart, getGuestCart } from "../../lib/guestCart";
import { toggleGuestWishlist, getGuestWishlist } from "../../lib/guestWishlist";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";

const RelatedProducts = ({ id }) => {
  const { slug } = useParams(); 
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const { updateCartCount, isVatInc } = useCart();

  // 1. Fetch Products using getProducts and skip current slug
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts({
          category: "All",
          status: "Published"
        });

        if (response.success && response.data) {
          // वर्तमान वाले slug को छोड़कर बाकी सभी प्रोडक्ट्स को फ़िल्टर करें
          const filteredProducts = response.data.filter(
            (product) => product.slug !== slug
          );
          setProductList(filteredProducts);
        } else {
          setProductList([]);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setProductList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, [slug]);

  // 2. Initial Data Sync (Cart & Wishlist) with Guest Fallback
  useEffect(() => {
    const fetchStates = async () => {
      const loggedIn = isAuthenticated();
      if (loggedIn) {
        try {
          const [cartRes, wishlistRes] = await Promise.all([
            getCart(),
            getWishlist()
          ]);
          if (cartRes?.cart?.items) setCartItems(cartRes.cart.items);
          if (wishlistRes?.success && wishlistRes.items) {
            setWishlistIds(wishlistRes.items.map(item => {
              const pid = item.product?._id;
              const vid = item.variantId || null;
              return vid ? `${pid}_${vid}` : pid;
            }));
          }
        } catch (error) {
          console.error("Error fetching user states:", error);
        }
      } else {
        setCartItems(getGuestCart());
        const guestWl = getGuestWishlist();
        setWishlistIds(guestWl.map(i => {
          const pid = typeof i === "object" ? (i._id || i.productId) : i;
          const vid = typeof i === "object" ? (i.variantId || null) : null;
          return vid ? `${pid}_${vid}` : pid;
        }));
      }
    };
    fetchStates();
  }, [id, slug]);

  const showToast = (msg, type = "success") => {
    if (type === "error") {
      toast.error(msg, { duration: 3000, position: "bottom-right" });
    } else {
      toast.success(msg, { 
        duration: 3000, 
        position: "bottom-right", 
        style: { background: "#253D4E", color: "#fff", fontSize: "14px", fontWeight: "bold", borderRadius: "10px" } 
      });
    }
  };

  const handleWishlist = async (productId) => {
    if (!isAuthenticated()) {
      const product = productList?.find((p) => p._id === productId);
      const targetVariant = product?.hasVariants && product?.variants?.length > 0 ? product.variants[0] : null;
      const vid = targetVariant?._id || null;
      const productObj = product ? {
        ...product,
        ...(targetVariant ? {
          variantId: vid,
          variantLabel: targetVariant.label,
          variantStock: targetVariant.stock,
          prices: {
            excludeVat: { base: targetVariant.price, discount: targetVariant.discountPrice || null },
            includeVat: {
              base: Number((targetVariant.price * (1 + (product.vatPercentage || 0) / 100)).toFixed(2)),
              discount: targetVariant.discountPrice ? Number((targetVariant.discountPrice * (1 + (product.vatPercentage || 0) / 100)).toFixed(2)) : null,
            },
          },
        } : {}),
      } : productId;
      const { wishlisted, items } = toggleGuestWishlist(productObj, vid);
      setWishlistIds(items.map(i => {
        const pid = typeof i === "object" ? (i._id || i.productId) : i;
        const v = typeof i === "object" ? (i.variantId || null) : null;
        return v ? `${pid}_${v}` : pid;
      }));
      toast.success(wishlisted ? "Added to wishlist" : "Removed from wishlist", { 
        position: "bottom-right", 
        style: { background: "#253D4E", color: "#fff", fontWeight: "600" } 
      });
      return;
    }
    try {
      setWishlistLoadingId(productId);
      const product = productList?.find((p) => p._id === productId);
      const targetVariant = product?.hasVariants && product?.variants?.length > 0 ? product.variants[0] : null;
      const vid = targetVariant?._id || null;
      const res = await toggleWishlist(productId, vid);
      if (res.success) {
        const wishlistKey = vid ? `${productId}_${vid}` : productId;
        setWishlistIds((prev) => prev.includes(wishlistKey) ? prev.filter((k) => k !== wishlistKey) : [...prev, wishlistKey]);
        toast.success(res.message || "Wishlist updated", { 
          position: "bottom-right", 
          style: { background: "#253D4E", color: "#fff", fontWeight: "600" } 
        });
      }
    } catch {
      toast.error("Failed to update wishlist");
    } finally {
      setWishlistLoadingId(null);
    }
  };

  const handleQuantity = async (product, currentQty, action) => {
    const targetVariant = product.hasVariants && product.variants?.length > 0 ? product.variants[0] : null;
    const activeStock = product.hasVariants ? (targetVariant?.stock ?? 0) : product.stock;
    const cartItemKey = product.hasVariants 
      ? `${product._id}_${targetVariant?._id || targetVariant?.label}` 
      : product._id;

    if (!isAuthenticated()) {
      const cartProduct = {
        ...product,
        ...(product.hasVariants && targetVariant
          ? {
              variantId: targetVariant._id,
              variantLabel: targetVariant.label,
              variantStock: targetVariant.stock,
              prices: {
                excludeVat: { base: targetVariant.price, discount: targetVariant.discountPrice || null },
                includeVat: {
                  base: Number((targetVariant.price * (1 + (product.vatPercentage || 0) / 100)).toFixed(2)),
                  discount: targetVariant.discountPrice
                    ? Number((targetVariant.discountPrice * (1 + (product.vatPercentage || 0) / 100)).toFixed(2))
                    : null,
                },
              },
            }
          : {}),
      };

      if (action === "inc") {
        if (currentQty >= activeStock) {
          showToast(`Only ${activeStock} units available`, "error");
          return;
        }
        const updated = addToGuestCart(cartProduct, 1);
        setCartItems(updated);
        updateCartCount(updated.length);
        showToast(`${product.title}${targetVariant ? ` (${targetVariant.label})` : ''} added to cart!`);
      } else {
        if (currentQty <= 1) return;
        const updated = removeFromGuestCart(product._id, targetVariant?._id || null);
        setCartItems(updated);
        updateCartCount(updated.length);
      }
      return;
    }

    if (action === "inc" && currentQty >= activeStock) {
      showToast(`Only ${activeStock} units available in stock`, "error");
      return;
    }

    try {
      setUpdatingId(cartItemKey);
      let response;
      if (action === "inc") {
        const cartPayload = {
          items: [{
            productId: product._id,
            quantity: 1,
            ...(product.hasVariants && targetVariant
              ? { variantId: targetVariant._id, variantLabel: targetVariant.label }
              : {}),
          }],
        };
        response = await addToCart(cartPayload);
        showToast(`${product.title}${targetVariant ? ` (${targetVariant.label})` : ''} added to cart!`);
      } else {
        if (currentQty <= 1) return;
        response = await removeProductFromCart(product._id, targetVariant?._id || null);
        showToast(`Decreased quantity`);
      }
      const updatedCart = response.cart || response.updatedCart;
      if (updatedCart) {
        setCartItems(updatedCart.items);
        updateCartCount(updatedCart.items.length);
      }
    } catch {
      toast.error("Could not update cart. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const renderCardStars = (averageRating) => {
    const stars = [];
    const rating = averageRating || 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-[#f3dd70] text-[10px] sm:text-[13px]" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-[#f3dd70] text-[10px] sm:text-[13px]" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-200 text-[10px] sm:text-[13px]" />);
      }
    }
    return stars;
  };

  const Skeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
      {[1, 2, 4].map((i) => (
        <div key={i} className="h-[280px] sm:h-[400px] bg-gray-100 animate-pulse rounded-xl p-2.5 sm:p-4 space-y-2 sm:space-y-4">
          <div className="h-28 sm:h-40 bg-gray-200 rounded-lg" />
          <div className="h-4 sm:h-6 bg-gray-200 w-3/4 rounded" />
          <div className="h-8 sm:h-10 bg-gray-200 rounded-lg" />
        </div>
      ))}
    </div>
  );

  if (loading) return <div className="custom-container mt-7"><Skeleton /></div>;
  if (productList.length === 0) return null;

  return (
    <div className="my-6 sm:my-12 font-['Quicksand']">
      <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-[#253D4E]">Related Products</h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {productList.map((product) => {
          const targetVariant = product.hasVariants && product.variants?.length > 0 ? product.variants[0] : null;
          const activeStock = product.hasVariants ? (targetVariant?.stock ?? 0) : product.stock;
          const cartItemKey = product.hasVariants 
            ? `${product._id}_${targetVariant?._id || targetVariant?.label}` 
            : product._id;

          const activePrices = isVatInc ? product.prices?.includeVat : product.prices?.excludeVat;
          const displayPrice = activePrices?.discount || activePrices?.base;
          const originalPrice = activePrices?.base;
          const hasDiscount = displayPrice < originalPrice;

          const cartItem = cartItems.find((item) => {
            const pMatch = (item.productId?._id || item.productId)?.toString() === product._id?.toString();
            if (product.hasVariants && targetVariant) {
              return pMatch && (item.variantId?.toString() === targetVariant._id?.toString());
            }
            return pMatch && !item.variantId;
          });

          const quantity = cartItem ? cartItem.quantity : 0;
          const isOutOfStock = activeStock <= 0;
          const isMaxLimitReached = quantity >= activeStock;
          const wishlistKey = product.hasVariants && targetVariant ? `${product._id}_${targetVariant._id}` : product._id;
          const isWishlisted = wishlistIds.includes(wishlistKey);

          const cardAvgRating = product.ratings?.average || 0;

          return (
            <div 
              key={product._id} 
              className="group bg-white rounded-xl border sm:border-2 border-[#253D4E]/80 shadow-sm hover:shadow-lg transition-all duration-300 p-2.5 sm:p-4 flex flex-col relative overflow-hidden"
            >
              {/* Wishlist Button */}
              <button 
                onClick={() => handleWishlist(product._id)}
                disabled={wishlistLoadingId === product._id}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all active:scale-90"
              >
                {wishlistLoadingId === product._id ? (
                  <Loader2 size={14} className="animate-spin text-gray-400 sm:w-[16px] sm:h-[16px]" />
                ) : isWishlisted ? (
                  <FaHeart className="text-red-500 text-[14px] sm:text-[18px]" />
                ) : (
                  <Heart size={14} className="text-gray-400 hover:text-red-500 sm:w-[18px] sm:h-[18px]" />
                )}
              </button>

              {/* Discount Badge */}
              {product.discountPercentage && product.discountPercentage !== "0% Off" && (
                <div className="absolute top-0 left-0 z-10">
                  <span className="bg-[#f3dd70] font-bold text-[#253D4E] px-2 sm:px-4 text-[10px] sm:text-sm py-1 sm:py-2 rounded-tl-lg rounded-br-lg sm:rounded-br-2xl">
                    {product.discountPercentage}
                  </span>
                </div>
              )}

              <Link to={`/${product?.category[1]?.slug || "building"}/${product.slug}`} className="flex flex-col mt-4">
                <div className="h-[110px] sm:h-[180px] flex items-center justify-center p-1 bg-gray-50 rounded-lg mb-2 sm:mb-4">
                  <img 
                    src={product.thumbnail} 
                    alt={product.title} 
                    className="max-h-full transition-transform duration-500 group-hover:scale-105 object-contain" 
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1 gap-1">
                    <p className="text-[8px] sm:text-[10px] text-gray-400 font-medium uppercase tracking-tight truncate max-w-[50%]">
                      SKU: {product.sku}
                    </p>
                    <span className={`text-[8px] sm:text-[9px] font-black px-1.5 sm:px-2 py-0.5 rounded-full uppercase whitespace-nowrap ${!isOutOfStock ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {!isOutOfStock ? `${activeStock} in stock` : 'Out of stock'}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-base font-bold leading-tight text-[#253D4E] line-clamp-2 mb-1 group-hover:text-primary transition-colors min-h-[32px] sm:min-h-[40px]">
                    {product.title}
                    {product.hasVariants && targetVariant && (
                      <span className="text-[10px] sm:text-xs block text-gray-500 font-medium mt-0.5">Opt: {targetVariant.label}</span>
                    )}
                  </h3>

                  {/* Ratings Block */}
                  <div className="flex items-center gap-0.5 sm:gap-1 mb-2">
                    <div className="flex items-center gap-0.5">
                      {renderCardStars(cardAvgRating)}
                    </div>
                    {cardAvgRating > 0 && (
                      <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold ml-0.5">({cardAvgRating.toFixed(1)})</span>
                    )}
                  </div>
                </div>
              </Link>

              {/* Price and Quantity Controls */}
              <div className="flex flex-row items-center justify-between gap-1 mt-auto mb-3 sm:mb-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 min-w-0">
                  <span className="text-primary font-bold text-[15px] sm:text-[20px] underline truncate">Rs. {displayPrice}</span>
                  {hasDiscount && <span className="text-[10px] sm:text-[12px] line-through text-gray-400 font-semibold truncate">Rs. {originalPrice}</span>}
                </div>

                <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                  <button 
                    onClick={() => handleQuantity(product, quantity, "dec")}
                    disabled={updatingId === cartItemKey || quantity <= 1}
                    className="w-6 h-6.5 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-30 transition-all active:scale-90 shadow-sm"
                  >
                    <Minus size={11} strokeWidth={3} className="sm:w-[14px] sm:h-[14px]" />
                  </button>
                  
                  <div className="w-6 h-6.5 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 rounded font-bold text-[#253D4E] text-[11px] sm:text-sm bg-white">
                    {updatingId === cartItemKey ? <Loader2 size={11} className="animate-spin text-gray-400 sm:w-[12px] sm:h-[12px]" /> : quantity || 1}
                  </div>

                  <button 
                    onClick={() => handleQuantity(product, quantity, "inc")}
                    disabled={updatingId === cartItemKey || isMaxLimitReached || isOutOfStock}
                    className="w-6 h-6.5 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-30 transition-all active:scale-90 shadow-sm"
                  >
                    <Plus size={11} strokeWidth={3} className="sm:w-[14px] sm:h-[14px]" />
                  </button>
                </div>
              </div>

              {/* Add to Basket Action CTA */}
              <div>
                <button
                  onClick={() => handleQuantity(product, quantity, "inc")}
                  disabled={updatingId === cartItemKey || isOutOfStock || isMaxLimitReached}
                  className="w-full h-[32px] sm:h-[42px] flex items-center justify-center gap-1.5 sm:gap-2 bg-[#f3dd70] text-[#253D4E] rounded-lg text-xs sm:text-sm font-bold transition-all hover:bg-[#253D4E] hover:text-white disabled:opacity-70 active:scale-95 shadow-sm"
                >
                  {updatingId === cartItemKey ? (
                    <Loader2 size={14} className="animate-spin sm:w-[18px] sm:h-[18px]" />
                  ) : (
                    <ShoppingCart size={14} className="sm:w-[18px] sm:h-[18px]" />
                  )}
                  <span className="truncate">
                    {isOutOfStock ? "Out of Stock" : (isMaxLimitReached ? "No Stock" : (quantity > 0 ? "Add More" : "Add to Basket"))}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;