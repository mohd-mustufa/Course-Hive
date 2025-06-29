import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL, GET_COURSE_URL } from "../../utils/constants";
import toast from "react-hot-toast";
import Accordion from "../common/Accordion";

function AdminCourseDetail() {
  const [course, setCourse] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { courseId } = useParams();

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}${GET_COURSE_URL}${courseId}`, {
        withCredentials: true,
      });
      setCourse(response.data.course);
      setCourseDetails(response.data.courseDetails);
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to fetch course details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Course not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 text-white">
      <div className="mx-auto container">
        <div className="px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Course Details
              </h1>
              <p className="text-gray-400">
                View your course information and content
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/admin/course/update/${courseId}`)}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Edit Course
              </button>
              <button
                onClick={() => navigate("/admin")}
                className="bg-transparent text-white py-2 px-4 border-white border rounded cursor-pointer hover:text-white hover:bg-orange-500 hover:border-none duration-300"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Course Content */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-8">
              {/* Course Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
                <p className="text-gray-300 text-lg leading-relaxed">{course.description}</p>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Course Info & Image */}
                <div className="lg:col-span-1">
                  {/* Course Image */}
                  <div className="aspect-video bg-gray-700 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                    {course.image?.url ? (
                      <img
                        src={course.image.url}
                        alt={course.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-gray-500 text-6xl">📚</div>
                    )}
                  </div>

                  {/* Course Price Card */}
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">${course.price}</div>
                      <div className="text-orange-100 text-sm">Course Price</div>
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-300 mb-4">Course Overview</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Content Sections:</span>
                        <span className="text-white font-semibold">
                          {courseDetails?.contentSections?.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Course Price:</span>
                        <span className="text-white font-semibold">${course.price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Course Content */}
                <div className="lg:col-span-2">
                  {/* Course Content Sections */}
                  {courseDetails && courseDetails.contentSections && courseDetails.contentSections.length > 0 ? (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Content Sections</h2>
                        <span className="text-gray-400 text-sm">
                          {courseDetails.contentSections.length} section{courseDetails.contentSections.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <Accordion 
                        sections={courseDetails.contentSections} 
                        title="Course Content"
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="text-gray-400 text-xl mb-4">📝 No Content Sections Added</div>
                      <p className="text-gray-500 mb-6">
                        This course doesn't have any content sections yet. Add some to make it more valuable for students.
                      </p>
                      <button
                        onClick={() => navigate(`/admin/course/update/${courseId}`)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        Add Content Sections
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Course Statistics */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    {courseDetails?.contentSections?.length || 0}
                  </div>
                  <div className="text-gray-400">Content Sections</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">${course.price}</div>
                  <div className="text-gray-400">Course Price</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    {courseDetails?.contentSections?.length > 0 ? 'Active' : 'Draft'}
                  </div>
                  <div className="text-gray-400">Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCourseDetail; 