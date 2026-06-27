import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import ProductGrid from "../../components/category/ProductGrid";
import SkeletonProduct from "../../components/category/SkeletonProduct";
import { getProducts } from "../../lib/product";

function Products() {
  const { slug } = useParams();
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Combined product API fetching mechanism (Shorn of sorting, searching, and pagination)
  const fetchProductsList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProducts({
        category: slug || "All",
        status: "Published", 
      });

      if (response?.success) {
        setProductList(response?.data || []);
      } else {
        setProductList([]);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      setProductList([]);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Trigger data fetch whenever the category/slug changes
  useEffect(() => {
    fetchProductsList();
  }, [fetchProductsList]);
  return (
    <section id="shop" className="bg-[var(--sage)]/8 custom-container py-24 ">
      <div className="">
        <div className="mx-auto mb-10 max-w-3xl text-center ">
          <span className="text-[11px] font-semibold uppercase italic tracking-[0.3em] text-[var(--terracotta)]">
            The Apothecary
          </span>

          <h2 className="mt-4 font-serif text-4xl text-black md:text-5xl">
            Curated Essentials
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-600">
            Clinically tested. Botanically perfected. Made in small batches in
            our garden lab. Explore our carefully crafted botanical products
            designed to nourish, restore and elevate your daily wellness ritual.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 ">
          {[...Array(8)].map((_, i) => (
            <SkeletonProduct key={i} />
          ))}
        </div>
      ) : productList.length > 0 ? (
        /* Optimized Product Render Layout View */
        <ProductGrid productList={productList} />
      ) : (
        /* No Products Found State */
        <div className="flex flex-col items-center justify-center py-28 bg-[#faf9f6] rounded-2xl border border-dashed border-foreground/10 px-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
            No Products Found
          </h3>
          <p className="text-foreground/50 text-xs mt-1 text-center max-w-xs leading-relaxed">
            There are no published products available in this category.
          </p>
        </div>
      )}
    </section>
  );
}

export default Products;
