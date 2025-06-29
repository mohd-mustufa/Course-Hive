import React from "react";

function ShimmerLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 text-white">
      <div className="mx-auto container">
        <div className="px-4 py-8">
          {/* Header Shimmer */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="h-8 bg-gray-700 rounded-lg w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-48 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-700 rounded-lg w-20 animate-pulse"></div>
          </div>

          {/* Stats Shimmer */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-gray-900 rounded-lg p-6">
                <div className="h-8 bg-gray-700 rounded w-16 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Courses Section Shimmer */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="h-6 bg-gray-700 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-700 rounded-lg w-24 animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-gray-800 rounded-lg p-6">
                  <div className="aspect-video bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
                  <div className="h-5 bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2 mb-4 animate-pulse"></div>
                  <div className="h-8 bg-gray-700 rounded w-16 mb-4 animate-pulse"></div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-8 bg-gray-700 rounded animate-pulse"></div>
                    <div className="flex-1 h-8 bg-gray-700 rounded animate-pulse"></div>
                    <div className="flex-1 h-8 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShimmerLoading; 