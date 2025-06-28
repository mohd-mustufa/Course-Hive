import React from "react";
import { Link, useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  const handleMyCoursesClick = () => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/my-courses");
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
      <section className="text-center">
        <h1 className="text-4xl font-semibold text-orange-500">CourseHive</h1>
        <br />
        <p className="text-gray-500">
          A buzzing hub of smart AI-powered courses
        </p>
        <div className="space-x-4 mt-6">
          <Link
            to={"/courses"}
            className="py-3 px-6 bg-green-500 text-white rounded font-semibold hover:bg-white hover:text-black duration-300 cursor-pointer"
          >
            Explore Courses
          </Link>

          <button
            onClick={handleMyCoursesClick}
            className="py-3 px-6 bg-white text-black rounded font-semibold hover:bg-green-500 hover:text-white duration-300 cursor-pointer"
          >
            My Courses
          </button>
        </div>
      </section>
      <section></section>
    </div>
  );
}

export default HeroSection;
