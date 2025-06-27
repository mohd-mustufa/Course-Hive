import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { BASE_URL, GET_ALL_COURSES_URL } from "../../utils/constants";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function CourseSlider() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(BASE_URL + GET_ALL_COURSES_URL, {
          withCredentials: true,
        });
        setCourses(response?.data?.courses || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Popular Courses
      </h2>
      <Slider {...settings}>
        {courses.map((course) => (
          <div key={course._id} className="px-3">
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <img
                src={course.image?.url}
                alt={course.title}
                className="h-40 w-full object-contain pt-3 pb-2 rounded-t-lg"
              />
              <div className="p-4 text-center">
                <h2 className="text-lg font-semibold text-white">
                  {course.title}
                </h2>
                <button className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 transition">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CourseSlider;
