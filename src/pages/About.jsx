import React from "react";
import FAQSection from "../components/about/FAQSection";
import AboutContent from "../components/about/AboutContent";
import { Helmet } from "react-helmet-async";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Our Story & Natural Mission - PlantPure</title>
        <meta
          name="description"
          content="Learn about PlantPure's journey. Discover how we craft 100% natural, chemical-free hair care and organic ayurvedic products for healthy living."
        />
        <meta
          name="keywords"
          content="About PlantPure, natural hair care brand, organic beauty India, chemical free story, ayurvedic hair secrets"
        />
        <link rel="canonical" href="https://plantpure.in/about" />{" "}
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="profile" />
        <meta
          property="og:title"
          content="About PlantPure | Our Story & Natural Mission"
        />
        <meta
          property="og:description"
          content="Discover the story behind PlantPure. 100% pure, chemical-free hair and skin care crafted from traditional ayurvedic herbs."
        />
        <meta property="og:image" content="https://plantpure.in/logo.png" />
        <meta property="og:url" content="https://plantpure.in/about" />
        <meta property="og:site_name" content="PlantPure" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="About PlantPure | Our Story & Natural Mission"
        />
        <meta
          name="twitter:description"
          content="Discover how we craft 100% natural, chemical-free hair care and organic ayurvedic products."
        />
        <meta name="twitter:image" content="https://plantpure.in/logo.png" />
      </Helmet>
      <AboutContent />
      <FAQSection />
    </>
  );
};

export default About;
