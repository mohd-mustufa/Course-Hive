import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL, GET_COURSE_URL } from "../../utils/constants";
import toast from "react-hot-toast";
import Header from "../layout/Header";

function CourseDetail() {
  const [course, setCourse] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(false);
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
          <Header />

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
                        <span className="text-gray-400">Format:</span>
                        <span className="text-white font-semibold">Text-based</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Access:</span>
                        <span className="text-white font-semibold">Lifetime</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Course Content */}
                <div className="lg:col-span-2">
                  {/* Course Content Sections */}
                  {courseDetails && courseDetails.contentSections && courseDetails.contentSections.length > 0 ? (
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-6">What You'll Learn</h2>
                      <div className="space-y-4">
                        {courseDetails.contentSections.map((section, index) => (
                          <div key={section._id || index} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-orange-500 transition-colors">
                            <div className="flex items-start">
                              <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold text-orange-400 mb-3">
                                  {section.heading}
                                </h3>
                                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                  {section.content}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="text-gray-400 text-xl mb-4">📝 Course Content Coming Soon</div>
                      <p className="text-gray-500">
                        This course is being prepared with comprehensive content sections. Enroll now to get access when it's ready!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail; 