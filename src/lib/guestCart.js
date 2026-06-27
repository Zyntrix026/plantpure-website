const KEY = "guest_cart";

export const getGuestCart = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
};

const save = (items) => localStorage.setItem(KEY, JSON.stringify(items));

// Unique key per line item — variant products get separate rows
const lineKey = (productId, variantId) =>
  variantId ? `${productId}_${variantId}` : `${productId}`;

const findIdx = (items, productId, variantId) =>
  items.findIndex((i) => lineKey(i.productId, i.variantId) === lineKey(productId, variantId));

// Add to guest cart
// product should include: _id, title/name, images/thumbnail/image, slug,
//   stock, shipping_category, vatPercentage, prices
// For variant products also pass: variantId, variantLabel, variantStock
export const addToGuestCart = (product, quantity = 1) => {
  const items = getGuestCart();
  const productId = product._id || product.productId;
  const variantId = product.variantId || null;
  const variantLabel = product.variantLabel || null;
  const stock = product.variantStock ?? product.stock ?? 999;

  const idx = findIdx(items, productId, variantId);

  if (idx > -1) {
    items[idx].quantity = Math.min(items[idx].quantity + quantity, stock);
  } else {
    items.push({
      productId,
      variantId,
      variantLabel,
      name: variantLabel
        ? `${product.title || product.name} — ${variantLabel}`
        : (product.title || product.name),
      image: product.thumbnail || product.image || product.images?.[0]?.url || "",
      slug: product.slug,
      stock,
      shipping_category: product.shipping_category ?? "SP",
      vatPercentage: product.vatPercentage ?? 0,
      discountPercentage: product.discountPercentage ?? null,
      prices: product.prices,
      quantity,
      category:product.category
    });
  }

  save(items);
  return items;
};

// Decrease qty by 1 — or remove if qty = 1
export const removeFromGuestCart = (productId, variantId = null) => {
  const items = getGuestCart();
  const idx = findIdx(items, productId, variantId);
  if (idx === -1) return items;

  if (items[idx].quantity > 1) {
    items[idx].quantity -= 1;
  } else {
    items.splice(idx, 1);
  }

  save(items);
  return items;
};

// Remove item completely regardless of qty
export const removeItemCompletelyFromGuestCart = (productId, variantId = null) => {
  const items = getGuestCart().filter(
    (i) => lineKey(i.productId, i.variantId) !== lineKey(productId, variantId)
  );
  save(items);
  return items;
};

// Update exact quantity
export const updateGuestCartQty = (productId, variantId = null, quantity) => {
  const items = getGuestCart();
  const idx = findIdx(items, productId, variantId);
  if (idx === -1) return items;
  if (quantity < 1) {
    items.splice(idx, 1);
  } else {
    items[idx].quantity = Math.min(quantity, items[idx].stock);
  }
  save(items);
  return items;
};

export const clearGuestCart = () => localStorage.removeItem(KEY);
