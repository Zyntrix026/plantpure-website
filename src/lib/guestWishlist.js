const KEY = "guest_wishlist";

export const getGuestWishlist = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
};

const itemKey = (productId, variantId) =>
  variantId ? `${productId}_${variantId}` : `${productId}`;

export const toggleGuestWishlist = (productOrId, variantId = null) => {
  const items = getGuestWishlist();
  const id = typeof productOrId === "string" ? productOrId : productOrId._id;
  const vid = variantId || (typeof productOrId === "object" ? productOrId.variantId || null : null);
  const key = itemKey(id, vid);

  const idx = items.findIndex((item) => itemKey(item._id || item.productId, item.variantId || null) === key);

  if (idx > -1) {
    items.splice(idx, 1);
    localStorage.setItem(KEY, JSON.stringify(items));
    return { wishlisted: false, items };
  }

  if (typeof productOrId === "object") {
    items.push({
      _id: id,
      productId: id,
      variantId: vid || undefined,
      variantLabel: productOrId.variantLabel || undefined,
      title: productOrId.title || productOrId.name,
      thumbnail: productOrId.thumbnail || productOrId.image || productOrId.images?.[0]?.url || "",
      slug: productOrId.slug,
      stock: vid ? (productOrId.variantStock ?? productOrId.stock) : productOrId.stock,
      prices: productOrId.prices,
      discountPercentage: productOrId.discountPercentage,
      sku: productOrId.sku,
      brand: productOrId.brand,
      vatPercentage: productOrId.vatPercentage,
      category:productOrId.category
    });
  } else {
    items.push({ _id: id, productId: id, variantId: vid || undefined });
  }

  localStorage.setItem(KEY, JSON.stringify(items));
  return { wishlisted: true, items };
};

export const isGuestWishlisted = (productId, variantId = null) => {
  const items = getGuestWishlist();
  const key = itemKey(productId, variantId);
  return items.some((item) => itemKey(item._id || item.productId, item.variantId || null) === key);
};

export const clearGuestWishlist = () => localStorage.removeItem(KEY);
