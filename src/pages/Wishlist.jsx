import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Heart,
  ShoppingCart,
  Trash2,
  Loader2,
  PackageOpen,
  AlertTriangle,
  X,
} from "lucide-react";
import { RiArrowDropRightLine } from "react-icons/ri";
import { getWishlist, toggleWishlist, clearWishlist } from "../lib/wishlist";
import { getCart, addToCart } from "../lib/cart";
import { getGuestCart, addToGuestCart } from "../lib/guestCart";
import {
  getGuestWishlist,
  toggleGuestWishlist,
  clearGuestWishlist,
} from "../lib/guestWishlist";
import { getProductsByIds } from "../lib/product";
import { isAuthenticated } from "../lib/auth";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title,
  message,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-foreground/40 backdrop-blur-[4px] flex items-center justify-center z-[60] p-4 font-sans">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-foreground/5 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 bg-red-50 rounded-xl text-red-600">
            <AlertTriangle size={22} />
          </div>
          <button
            onClick={onClose}
            className="text-foreground/30 hover:text-foreground/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <h3 className="text-base font-bold uppercase tracking-wider text-foreground">
          {title || "Confirm Action"}
        </h3>
        <p className="text-foreground/60 text-xs mt-2 leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3 mt-6">
          <button
            disabled={loading}
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-foreground/10 rounded-xl text-xs font-bold uppercase tracking-wider text-foreground/60 hover:bg-foreground/[0.02] transition-all"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-red-600 transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [cartKeys, setCartKeys] = useState(new Set());
  const { updateCartCount, isVatInc } = useCart();
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: null,
    targetId: null,
    targetVariantId: null,
    targetName: "",
  });

  const buildCartKeys = async () => {
    if (isAuthenticated()) {
      const cartRes = await getCart().catch(() => null);
      if (cartRes?.cart?.items) {
        return new Set(
          cartRes.cart.items.map(
            (i) =>
              (i.productId?.toString() || "") + (i.variantId?.toString() || ""),
          ),
        );
      }
    } else {
      return new Set(
        getGuestCart().map((i) => (i.productId || "") + (i.variantId || "")),
      );
    }
    return new Set();
  };

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const [keys] = await Promise.all([buildCartKeys()]);
      setCartKeys(keys);

      if (!isAuthenticated()) {
        const items = getGuestWishlist();
        if (items.length === 0) {
          setWishlistItems([]);
          return;
        }
        const hasFullData = items.some((i) => typeof i === "object" && i.title);
        if (hasFullData) {
          setWishlistItems(
            items.map((p) => ({
              product: typeof p === "object" ? p : { _id: p },
              variantId: typeof p === "object" ? p.variantId || null : null,
              variantLabel:
                typeof p === "object" ? p.variantLabel || null : null,
            })),
          );
        } else {
          const ids = items.map((i) =>
            typeof i === "string" ? i : i._id || i.productId,
          );
          const res = await getProductsByIds(ids);
          const products = res.success ? res.data || res.products || [] : [];
          setWishlistItems(
            products.map((p) => ({
              product: { ...p, thumbnail: p.thumbnail || p.images?.[0]?.url },
            })),
          );
        }
      } else {
        const res = await getWishlist();
        if (res.success) setWishlistItems(res.items || []);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const confirmRemoveItem = (productId, variantId, productName) => {
    setModalConfig({
      isOpen: true,
      type: "remove",
      targetId: productId,
      targetVariantId: variantId || null,
      targetName: productName,
    });
  };

  const confirmClearWishlist = () => {
    setModalConfig({
      isOpen: true,
      type: "clear",
      targetId: null,
      targetVariantId: null,
      targetName: "all items",
    });
  };

  const handleModalConfirm = async () => {
    try {
      setActionLoading("modal-action");
      if (!isAuthenticated()) {
        if (modalConfig.type === "remove") {
          toggleGuestWishlist(
            modalConfig.targetId,
            modalConfig.targetVariantId || null,
          );
          setWishlistItems((prev) =>
            prev.filter((item) => {
              const vid = item.product.variantId || null;
              return !(
                item.product._id === modalConfig.targetId &&
                vid === (modalConfig.targetVariantId || null)
              );
            }),
          );
          toast.success("Removed from wishlist");
        } else if (modalConfig.type === "clear") {
          clearGuestWishlist();
          setWishlistItems([]);
          toast.success("Wishlist cleared");
        }
      } else {
        if (modalConfig.type === "remove") {
          const res = await toggleWishlist(
            modalConfig.targetId,
            modalConfig.targetVariantId || null,
          );
          if (res.success) {
            setWishlistItems((prev) =>
              prev.filter((item) => {
                const vid = item.variantId || null;
                return !(
                  item.product._id === modalConfig.targetId &&
                  vid === (modalConfig.targetVariantId || null)
                );
              }),
            );
            toast.success("Removed from wishlist");
          }
        } else if (modalConfig.type === "clear") {
          const res = await clearWishlist();
          if (res.success) {
            setWishlistItems([]);
            toast.success("Wishlist cleared");
          }
        }
      }
    } catch {
      toast.error("Operation failed. Please try again.");
    } finally {
      setActionLoading(null);
      setModalConfig({
        isOpen: false,
        type: null,
        targetId: null,
        targetVariantId: null,
        targetName: "",
      });
    }
  };

  const handleAddToCart = async (product, variantId, variantLabel) => {
    const actionKey = (product._id || "") + (variantId || "");
    try {
      setActionLoading(actionKey);
      if (!isAuthenticated()) {
        const cartProduct = {
          ...product,
          ...(variantId
            ? { variantId, variantLabel, variantStock: product.stock }
            : {}),
        };
        const updated = addToGuestCart(cartProduct, 1);
        updateCartCount(updated.length);
        toast.success(
          `${product.title}${variantLabel ? ` (${variantLabel})` : ""} added to basket!`,
        );
        setCartKeys((prev) => new Set([...prev, actionKey]));
      } else {
        const res = await addToCart({
          items: [
            {
              productId: product._id,
              quantity: 1,
              ...(variantId ? { variantId, variantLabel } : {}),
            },
          ],
        });
        if (res.success) {
          toast.success(
            `${product.title}${variantLabel ? ` (${variantLabel})` : ""} added to basket!`,
          );
          updateCartCount(
            res.cart?.items?.length || res.updatedCart?.items?.length,
          );
          setCartKeys((prev) => new Set([...prev, actionKey]));
        }
      }
    } catch {
      toast.error("Stock limit reached or failed to add");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-white flex flex-col items-center justify-center text-foreground">
        <Loader2
          className="animate-spin text-[var(--terracotta)] mb-3"
          size={32}
          strokeWidth={1.5}
        />
        <p className="text-foreground/40 text-xs font-bold uppercase tracking-[0.2em]">
          Fetching your favorites...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] pb-16  text-foreground">
      <DeleteModal
        isOpen={modalConfig.isOpen}
        loading={actionLoading === "modal-action"}
        onClose={() =>
          setModalConfig({
            isOpen: false,
            type: null,
            targetId: null,
            targetVariantId: null,
            targetName: "",
          })
        }
        onConfirm={handleModalConfirm}
        title={modalConfig.type === "clear" ? "Clear Wishlist" : "Remove Item"}
        message={
          modalConfig.type === "clear"
            ? "Are you sure you want to remove all saved items from your wishlist?"
            : `Are you sure you want to remove ${modalConfig.targetName} from your wishlist?`
        }
      />

      {/* Breadcrumb Section */}
      {/* <div className="pt-4 px-4">
        <div className="max-w-[1350px] mx-auto bg-white border-b border-foreground/5 shadow-sm rounded-xl px-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/40 py-4">
            <Home size={14} className="text-[var(--terracotta)]" />
            <Link to="/" className="hover:text-[var(--terracotta)] transition-colors">Home</Link>
            <RiArrowDropRightLine size={18} className="text-foreground/20" />
            <span className="text-[var(--terracotta)] font-serif normal-case italic tracking-normal font-medium text-sm">Wishlist</span>
          </div>
        </div>
      </div> */}

      <div className="custom-container pt-6">
        <div className="bg-white rounded-2xl border border-foreground/5 shadow-sm overflow-hidden">
          {/* Header Block */}
          <div className="px-6 py-5 border-b border-foreground/5 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <Heart
                className="text-[var(--terracotta)] fill-[var(--terracotta)]"
                size={20}
              />
              <h2 className="text-base font-bold uppercase tracking-wider text-foreground">
                My Wishlist{" "}
                <span className="text-foreground/30 font-sans normal-case font-medium">
                  ({wishlistItems.length})
                </span>
              </h2>
            </div>
            {wishlistItems.length > 0 && (
              <button
                onClick={confirmClearWishlist}
                className="text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50/60 px-3 py-2 rounded-xl transition-all"
              >
                Clear All
              </button>
            )}
          </div>

          {wishlistItems.length > 0 ? (
            <div className="divide-y divide-foreground/5">
              {wishlistItems.map((item) => {
                const product = item.product;
                if (!product) return null;

                const variantId = item.variantId || product.variantId || null;
                const variantLabel =
                  item.variantLabel || product.variantLabel || null;
                const actionKey = (product._id || "") + (variantId || "");
                const alreadyInCart = cartKeys.has(actionKey);

                const activePrices = isVatInc
                  ? product.prices?.includeVat
                  : product.prices?.excludeVat;
                const displayPrice =
                  activePrices?.discount || activePrices?.base;
                const originalPrice = activePrices?.base;
                const hasDiscount = displayPrice < originalPrice;

                return (
                  <div
                    key={actionKey}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row gap-6 hover:bg-foreground/[0.005] transition-all group"
                  >
                    {/* Thumbnail Wrapper */}
                    <div className="w-full sm:w-28 h-28 border border-foreground/5 rounded-xl flex justify-center items-center shrink-0 bg-[#faf9f6] p-2 relative overflow-hidden">
                      <img
                        src={product.thumbnail}
                        className="w-20 h-20 object-contain transition-transform duration-500 group-hover:scale-105"
                        alt={product.title}
                      />
                    </div>

                    {/* Details and Actions Area */}
                    <div className="flex-1 flex flex-col sm:flex-row justify-between gap-6">
                      <div className="space-y-2">
                        <Link
                          to={`/${product?.category?.[0]?.slug || "shop"}/${product.slug}`}
                        >
                          <h3 className="font-serif text-lg italic text-foreground hover:text-[var(--terracotta)] transition-colors line-clamp-2 leading-snug">
                            {product.title}
                          </h3>
                        </Link>

                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          {variantLabel && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/50 bg-foreground/5 px-2 py-0.5 rounded-md">
                              Option: {variantLabel}
                            </span>
                          )}
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${product.stock > 0 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}
                          >
                            {product.stock > 0
                              ? `${product.stock} In Stock`
                              : "Out of Stock"}
                          </span>
                        </div>

                        {/* Pricing architecture block */}
                        <div className="pt-2 flex items-baseline gap-3">
                          <span className="text-xl font-bold tracking-tight text-foreground">
                            ₹{displayPrice}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-foreground/30 line-through font-medium">
                              ₹{originalPrice}
                            </span>
                          )}
                          {product.discountPercentage && (
                            <span className="text-[9px] bg-[var(--cream)] text-[var(--terracotta)] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-md border border-[var(--terracotta)]/10">
                              {product.discountPercentage}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* CTA Interface Panel */}
                      <div className="flex flex-col gap-2.5 sm:items-end justify-center shrink-0">
                        <button
                          disabled={
                            actionLoading === actionKey ||
                            product.stock <= 0 ||
                            alreadyInCart
                          }
                          onClick={() =>
                            handleAddToCart(product, variantId, variantLabel)
                          }
                          className="bg-foreground text-white disabled:bg-foreground/20 disabled:text-foreground/40 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-foreground/90 hover:text-white transition-all shadow-sm w-full sm:w-auto"
                        >
                          {actionLoading === actionKey ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <ShoppingCart size={14} />
                          )}
                          {product.stock <= 0
                            ? "Out of Stock"
                            : alreadyInCart
                              ? "Added to basket"
                              : "Add to basket"}
                        </button>

                        <button
                          onClick={() =>
                            confirmRemoveItem(
                              product._id,
                              variantId,
                              product.title,
                            )
                          }
                          className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider hover:text-red-500 transition-colors flex items-center justify-center gap-1.5 mt-1 sm:pr-2"
                        >
                          <Trash2 size={12} /> Remove Item
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 bg-white px-4">
              <div className="bg-[#faf9f6] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 border border-foreground/5">
                <PackageOpen
                  size={36}
                  strokeWidth={1.2}
                  className="text-foreground/20"
                />
              </div>
              <h3 className="font-serif text-xl italic text-foreground">
                Your wishlist is empty!
              </h3>
              <p className="text-foreground/40 text-xs mt-1.5 max-w-xs mx-auto leading-relaxed">
                Seems like you haven't saved any botanical formulations to your
                favorites list yet.
              </p>
              <Link
                to="/"
                className="mt-8 bg-foreground text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-foreground/90 transition-all inline-block shadow-sm"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
