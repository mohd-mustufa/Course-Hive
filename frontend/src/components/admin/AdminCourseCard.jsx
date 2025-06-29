import React from "react";
import { useNavigate } from "react-router-dom";

function AdminCourseCard({ course, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
      <div className="aspect-video bg-gray-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        {course.image?.url ? (
          <img
            src={course.image.url}
            alt={course.title}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="text-gray-500 text-8xl">📚</div>
        )}
      </div>
      
      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course.title}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {course.description}
      </p>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-orange-500 font-semibold">
          ${course.price}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/admin/course/${course._id}`)}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors cursor-pointer"
        >
          View
        </button>
        <button
          onClick={() => navigate(`/admin/course/update/${course._id}`)}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(course._id)}
          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default AdminCourseCard; 