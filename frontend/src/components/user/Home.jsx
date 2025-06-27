import React from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import HeroSection from "../layout/HeroSection";
import CourseSlider from "../layout/CourseSlider";

function Home() {
  return (
    <div className="bg-gradient-to-r from-black to-blue-900">
      <div className="h-screen text-white container mx-auto">
        <Header />

        <div className="flex-grow">
          <HeroSection />
          <CourseSlider />
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Home;
