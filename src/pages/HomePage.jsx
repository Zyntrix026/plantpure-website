import Navbar from "../components/layout/Navbar";
import ChapterNav from "../components/home/ChapterNav";
import Hero from "../components/home/Hero";
import Story from "../components/home/Story";
import Chapters from "../components/home/Chapters";
import Ritual from "../components/home/Ritual";
import Glossary from "../components/home/Glossary";
import Products from "../components/home/Products";
import Testimonials from "../components/home/Testimonials";
import Marquee from "../components/home/Marquee";
import TrustBadges from "../components/home/TrustBadges";
import Footer from "../components/layout/Footer";
import { Helmet } from "react-helmet-async";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>PlantPure | Natural Hair Care & Chemical-Free Hair Color</title>
        <meta
          name="description"
          content="Shop 100% natural, chemical-free hair color, organic cold-pressed oils, and herbal hair cleansers from PlantPure."
        />
        <meta
          name="keywords"
          content="PlantPure, natural hair color, chemical free hair dye, organic hibiscus oil, pure indigo powder"
        />
        <link rel="canonical" href="https://plantpure.in/" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="PlantPure | Natural Hair Care & Color"
        />
        <meta
          property="og:description"
          content="Shop 100% natural, chemical-free hair color, organic cold-pressed oils, and herbal hair cleansers."
        />
        <meta property="og:image" content="https://plantpure.in/logo.png" />{" "}
        {/* Fix: Added full domain URL */}
        <meta property="og:url" content="https://plantpure.in/" />
        <meta property="og:site_name" content="PlantPure" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="PlantPure | Natural Hair Care & Color"
        />
        <meta
          name="twitter:description"
          content="100% natural hair coloring kits, cold-pressed oils, and herbal cleansers. Free from sulfates and parabens."
        />
        <meta name="twitter:image" content="https://plantpure.in/logo.png" />{" "}
        {/* Fix: Added full domain URL */}
      </Helmet>
      <div className="min-h-screen bg-white text-foreground">
        {/* <ChapterNav /> */}
        <Hero />
        <Marquee />
        <Chapters />
        <Story />
        <Ritual />
        <Glossary />
        <Products />
        <Testimonials />
        <TrustBadges />
      </div>
    </>
  );
}
