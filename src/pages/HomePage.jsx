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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* <Navbar /> */}
      <ChapterNav />
      <Hero />
      <Marquee />
      <Chapters />
      <Story />
      <Ritual />
      <Glossary />
      <Products />
      <Testimonials />
      <TrustBadges />
      {/* <Footer /> */}
    </div>
  );
}
