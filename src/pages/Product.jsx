import React, { useState, useEffect, useCallback, useRef } from "react";
import { Home } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { RiArrowDropRightLine } from "react-icons/ri";
import ToolTopBar from "../components/category/ToolTopBar";
import ProductGrid from "../components/category/ProductGrid";
// import ToolBanners from "../components/category/ToolBanners";
import SkeletonProduct from "../components/category/SkeletonProduct";
import { getProducts } from "../lib/product"; 
// import HeroBg from "../assets/Banner2.png";

const Product = () => {
  const { slug } = useParams();
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sort, setSort] = useState("newest");
  const [sortLabel, setSortLabel] = useState("Newest Arrivals");
  const [searchTerm, setSearchTerm] = useState("");
  const sentinelRef = useRef(null);
  const LIMIT = 12;

  // Reset states on filters or category change
  useEffect(() => {
    setProductList([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
  }, [slug, sort, searchTerm]);

  // Combined product API fetching mechanism
  const fetchProductsList = useCallback(async (pageNum) => {
    try {
      // Direct integration with the centralized getProducts controller architecture
      const response = await getProducts({
        page: pageNum,
        limit: LIMIT,
        sort: sort === "newest" ? "-createdAt" : sort === "price_asc" ? "price_asc" : "price_desc",
        search: searchTerm,
        category: slug || "All",
        status: "Published" // Safely fetching only published items
      });

      if (response.success) {
        const newProducts = response.data || [];
        setProductList((prev) => pageNum === 1 ? newProducts : [...prev, ...newProducts]);
        
        const totalPages = Number(response.totalPages) || 1;
        setTotalProducts(Number(response.totalProducts) || 0);
        setHasMore(pageNum < totalPages);
      } else {
        if (pageNum === 1) setProductList([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      if (pageNum === 1) setProductList([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [slug, sort, searchTerm]);

  // Initial trigger handler logic block
  useEffect(() => {
    if (page === 1) fetchProductsList(1);
  }, [page, fetchProductsList]);

  // Infinite Scroll Hook Setup via Native IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setLoadingMore(true);
          setPage((p) => {
            const next = p + 1;
            fetchProductsList(next);
            return next;
          });
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, fetchProductsList]);

  return (
    <div className="bg-[#ffffff]">

        <div className="custom-container pt-6 min-h-screen text-foreground">
      {/* Premium Minimal Breadcrumb Architecture */}
      {/* <nav className="relative mb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/40 pb-3">
          <Home size={14} className="text-[var(--terracotta)]" />
          <Link to="/" className="hover:text-[var(--terracotta)] transition-colors">Home</Link>
          <RiArrowDropRightLine size={18} className="text-foreground/20" />
          <span className="text-[var(--terracotta)] normal-case font-serif text-sm italic tracking-normal font-medium">
            {slug ? slug.replace(/-/g, " ") : "All Collections"}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 border-b border-foreground/5"></div>
      </nav> */}


      <div className="mt-8">
        {/* Dynamic Top Control Bar Section */}
        <ToolTopBar
          sortLabel={sortLabel}
          setSortLabel={setSortLabel}
          setSort={setSort}
          totalProducts={totalProducts}
          setSearchTerm={setSearchTerm}
        />

        {/* Loading Initial States Block */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mt-6">
            {[...Array(8)].map((_, i) => <SkeletonProduct key={i} />)}
          </div>
        ) : productList.length > 0 ? (
          <>
            {/* Optimized Product Render Layout View */}
            <ProductGrid productList={productList} />

            {/* Micro Trigger Block Sentinel node */}
            <div ref={sentinelRef} className="h-4" />

            {/* Pagination Loading State Elements */}
            {loadingMore && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mt-6">
                {[...Array(4)].map((_, i) => <SkeletonProduct key={i} />)}
              </div>
            )}

            {/* All Data Explored Reached Footer Markers */}
            {!hasMore && !loadingMore && (
              <div className="flex flex-col items-center py-16 text-center">
                <div className="w-12 h-[1px] bg-foreground/10 mb-4" />
                <p className="text-foreground/40 font-bold text-[10px] uppercase tracking-[0.2em]">
                  You've curated all {totalProducts} items
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-28 bg-[#faf9f6] rounded-2xl border border-dashed border-foreground/10 px-4">
            <Home size={36} strokeWidth={1.5} className="text-foreground/20 mb-4" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">No Products Found</h3>
            <p className="text-foreground/50 text-xs mt-1 text-center max-w-xs leading-relaxed">
              Try modifying your criteria or clear current tracking parameters.
            </p>
            <button 
              onClick={() => setSearchTerm("")} 
              className="mt-6 text-xs font-bold uppercase tracking-widest text-[var(--terracotta)] hover:underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

     
    </div>
    </div>
  );
};

export default Product;