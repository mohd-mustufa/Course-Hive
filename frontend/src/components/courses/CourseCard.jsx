import React from "react";
import { Link } from "react-router-dom";

function CourseCard({ course }) {
  const discountPercents = [20, 30, 40, 50, 60, 70, 80];
  const discountPercent =
    discountPercents[Math.floor(Math.random() * discountPercents.length)];
  const originalPrice = Math.round(
    (course.price * 100) / (100 - discountPercent)
  );

  return (
    <div className="bg-gray-900 text-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <img
        src={course.image.url}
        alt={course.title}
        className="h-45 w-full object-contain bg-gray-800"
      />
      <div className="p-4">
        <h2 className="text-lg font-bold mb-2 text-orange-500">
          {course.title}
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          {course.description.length > 100
            ? `${course.description.slice(0, 100)}...`
            : course.description}
        </p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold">
            ${course.price}
            <span className="text-gray-400 line-through pl-2">
              ${originalPrice}
            </span>
          </span>
          <span className="text-green-400">{discountPercent}% off</span>
        </div>
        <Link
          to={`/purchase/${course._id}?originalPrice=${originalPrice}&discount=${discountPercent}`}
          className="block w-full text-center bg-orange-500 hover:bg-blue-700 text-white py-2 rounded transition duration-300"
        >
          Buy Now
        </Link>
      </div>
    </div>
  );
}

export default CourseCard;
