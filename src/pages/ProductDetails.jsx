import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { getProductBySlug } from "../lib/product";

// Components
import ProductImageGallery from "../components/product details/ProductImageGallery";
import ProductInfo from "../components/product details/ProductInfo";
import ProductSidebar from "../components/product details/ProductSidebar";
import RelatedProducts from "../components/home/RelatedProducts";
import ProductReview from "../components/product details/ProductReview";
import Breadcrumbs from "../components/product details/Breadcrumbs";

// --- SKELETON COMPONENT FOR THE LAYOUT STRUCTURE ---
const ProductSkeleton = () => {
  return (
    <div className="bg-white animate-pulse">
      <div className="custom-container py-4">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex flex-col gap-10 flex-1">
            {/* Top Section: Gallery & Info */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Image Gallery Skeleton */}
              <div className="flex-1 space-y-4">
                <div className="h-[400px] bg-gray-200 rounded-2xl w-full"></div>
                <div className="flex gap-2">
                  <div className="h-20 bg-gray-200 rounded-lg w-20"></div>
                  <div className="h-20 bg-gray-200 rounded-lg w-20"></div>
                  <div className="h-20 bg-gray-200 rounded-lg w-20"></div>
                </div>
              </div>

              {/* Product Info Skeleton */}
              <div className="flex-1 space-y-4 py-2">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3 my-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>

            {/* Product Overview Tab Skeleton */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
              <div className="border-b border-gray-100 pb-4">
                <div className="h-8 bg-gray-200 rounded-full w-32"></div>
              </div>
              <div className="space-y-3 pt-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
          </div>

          {/* Product Sidebar Skeleton */}
          <div className="w-full lg:w-[350px] space-y-4">
            <div className="h-[300px] bg-gray-200 rounded-2xl w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await getProductBySlug(slug);
        if (response.success) {
          setProduct(response.data);
        }
      } catch (err) {
        console.error("Fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    window.scrollTo(0, 0);
  }, [slug]);

  // Render Skeleton when loading
  if (loading) return <ProductSkeleton />;

  if (!product)
    return (
      <div className="py-20 text-center text-red-500 font-semibold">
        Product not found.
      </div>
    );

  return (
    <div className="bg-white ">
      <div className="custom-container py-4 ">
        <Breadcrumbs />

        {/* Global Style for this component only */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap");
          
          .product-details-page {
            font-family: 'Quicksand', sans-serif !important;
          }

          .dangerous-html-content {
            font-family: 'Quicksand', sans-serif !important;
            line-height: 1.6;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }

          .dangerous-html-content p {
            margin-bottom: 1rem;
          }

          .dangerous-html-content img {
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            margin: 1.5rem 0;
          }

          .dangerous-html-content table {
            width: 100% !important;
            display: block;
            overflow-x: auto;
            border-collapse: collapse;
            margin: 1.5rem 0;
          }

          .dangerous-html-content h1, 
          .dangerous-html-content h2, 
          .dangerous-html-content h3 {
            color: #253D4E;
            font-weight: 700;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
          }

          .dangerous-html-content ul, 
          .dangerous-html-content ol {
            padding-left: 1.5rem;
            margin-bottom: 1rem;
          }

          .dangerous-html-content li {
            margin-bottom: 0.5rem;
          }
        `,
          }}
        />

        <Helmet>
          <title>{product.metaTitle || product.title}</title>
          <meta
            name="description"
            content={product.metaDescription || product.excerpt}
          />
        </Helmet>

        <div className="product-details-page flex flex-col lg:flex-row gap-10">
          <div className="flex flex-col gap-10 flex-1">
            {/* Top Section */}
            <div className="flex flex-col lg:flex-row gap-8">
              <ProductImageGallery images={product.images} />
              <ProductInfo product={product} />
            </div>

            {/* HTML Overview Tab */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="border-b border-gray-100 pb-4">
                <button className="px-6 py-2 rounded-full border border-secondary text-primary font-bold text-sm transition-colors hover:bg-secondary/10">
                  Product Overview
                </button>
              </div>

              <div className="mt-8">
                <div
                  className="dangerous-html-content text-primary/80 text-[15px] md:text-[16px]"
                  dangerouslySetInnerHTML={{ __html: product.productOverview }}
                />
              </div>
            </div>

            <ProductReview productId={product._id} />

            <RelatedProducts id={product._id} />
          </div>

          <ProductSidebar product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;