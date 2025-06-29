import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, CREATE_COURSE_URL, CREATE_COURSE_DETAILS_URL } from "../../utils/constants";
import toast from "react-hot-toast";

function CourseCreate() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
  });
  const [contentSections, setContentSections] = useState([
    { heading: "", content: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin"));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...contentSections];
    updatedSections[index][field] = value;
    setContentSections(updatedSections);
  };

  const addSection = () => {
    setContentSections([...contentSections, { heading: "", content: "" }]);
  };

  const removeSection = (index) => {
    if (contentSections.length > 1) {
      const updatedSections = contentSections.filter((_, i) => i !== index);
      setContentSections(updatedSections);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!admin?.token) {
      toast.error("Please login to create a course");
      return;
    }

    // Validate content sections
    const validSections = contentSections.filter(section => 
      section.heading.trim() && section.content.trim()
    );

    try {
      setLoading(true);
      
      // First create the course
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const courseResponse = await axios.post(`${BASE_URL}${CREATE_COURSE_URL}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      const courseId = courseResponse.data.course._id;

      // Then create course details with content sections (only if sections exist)
      if (validSections.length > 0) {
        await axios.post(`${BASE_URL}${CREATE_COURSE_DETAILS_URL}${courseId}`, {
          contentSections: validSections
        }, {
          headers: {
            Authorization: `Bearer ${admin.token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
      }

      toast.success("Course created successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 text-white">
      <div className="mx-auto container">
        <div className="px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Create New Course
              </h1>
              <p className="text-gray-400">
                Add a new course to your portfolio
              </p>
            </div>
            <button
              onClick={() => navigate("/admin")}
              className="bg-transparent text-white py-2 px-4 border-white border rounded cursor-pointer hover:text-white hover:bg-orange-500 hover:border-none duration-300"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Form */}
          <div className="bg-gray-900 rounded-lg p-6 max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Course Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 text-white"
                    placeholder="Enter course title"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 text-white"
                  placeholder="Enter course description"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Course Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 text-white"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-20 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Content Sections (Optional) */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Content Sections (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={addSection}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm"
                  >
                    + Add Section
                  </button>
                </div>
                
                <div className="space-y-4">
                  {contentSections.map((section, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-white font-medium">Section {index + 1}</h4>
                        {contentSections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSection(index)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={section.heading}
                          onChange={(e) => handleSectionChange(index, "heading", e.target.value)}
                          placeholder="Section Title"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 text-white"
                        />
                        <textarea
                          value={section.content}
                          onChange={(e) => handleSectionChange(index, "content", e.target.value)}
                          placeholder="Section content"
                          rows="4"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Content sections are not required at this stage. They can be added later.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Course"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin")}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCreate; 