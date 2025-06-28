import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  BASE_URL,
  GET_COURSE_URL,
  PURCHASE_COURSE_URL,
} from "../../utils/constants";
import Header from "../layout/Header";
import toast from "react-hot-toast";

function CoursePurchase() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const discount = Number(searchParams.get("discount"));
  const originalPrice = Number(searchParams.get("originalPrice"));

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}${GET_COURSE_URL}${courseId}`,
          {
            withCredentials: true,
          }
        );
        setCourse(response.data.course);
      } catch (error) {
        console.error("Failed to load course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handlePurchase = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) {
      toast.error("Please login to purchase the course!");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}${PURCHASE_COURSE_URL}`,
        { courseId: courseId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Purchase successful!");
      navigate("/my-courses");
    } catch (error) {
      if (error.response.status === 400) {
        toast.error("You have already purchased this course!");
        navigate("/my-courses");
      } else {
        toast.error(error?.response?.data?.error);
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-900 min-h-screen text-white">
      <Header />

      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg animate-pulse">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-full md:w-1/2 h-64 bg-gray-700 rounded-lg" />
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                <div className="h-6 bg-gray-700 rounded w-1/2"></div>
                <div className="h-10 bg-gray-700 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ) : !course ? (
          <div className="text-center text-red-400">Course not found.</div>
        ) : (
          <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <img
                src={course.image?.url}
                alt={course.title}
                className="w-full md:w-1/2 rounded-lg"
              />

              <div className="flex-1">
                <h2 className="text-3xl font-bold text-orange-500 mb-4">
                  {course.title}
                </h2>
                <p className="text-gray-300 mb-4">{course.description}</p>

                <div className="mb-6">
                  <span className="text-2xl font-bold text-white">
                    ${course.price}
                  </span>
                  {originalPrice !== 0 && discount !== 0 && (
                    <span>
                      <span className="text-gray-400 line-through ml-2">
                        {originalPrice}
                      </span>
                      <span className="ml-4 text-green-400">
                        {discount}% off
                      </span>
                    </span>
                  )}
                </div>

                <button
                  onClick={handlePurchase}
                  className="bg-orange-500 hover:bg-blue-700 text-white py-3 px-6 rounded transition duration-300 cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CoursePurchase;
