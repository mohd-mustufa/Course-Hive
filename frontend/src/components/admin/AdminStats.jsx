import React from "react";

function AdminStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="text-2xl font-bold text-orange-500">{stats.totalCourses}</div>
        <div className="text-gray-400">Total Courses</div>
      </div>
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="text-2xl font-bold text-green-500">
          {stats.totalCoursesSold}
        </div>
        <div className="text-gray-400">Courses Sold</div>
      </div>
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="text-2xl font-bold text-blue-500">
          {stats.uniqueStudents}
        </div>
        <div className="text-gray-400">Unique Learners</div>
      </div>
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="text-2xl font-bold text-purple-500">
          ${stats.totalRevenue.toFixed(2)}
        </div>
        <div className="text-gray-400">Total Revenue</div>
      </div>
    </div>
  );
}

export default AdminStats; 