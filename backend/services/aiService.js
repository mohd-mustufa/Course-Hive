import axios from "axios";
import { GEMINI_API_URL } from "../utils/constants.js";

export const generateContent = async (prompt) => {
    const geminiApiUrl = GEMINI_API_URL;
    const geminiApiKey = process.env.GEMINI_API_KEY;
  try {
    if (!geminiApiKey) {
      throw new Error("Gemini API key not configured");
    }

    const response = await axios.post(
      `${geminiApiUrl}?key=${geminiApiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.candidates && response.data.candidates.length > 0) {
      return {
        success: true,
        content: response.data.candidates[0].content.parts[0].text,
        usage: response.data.usageMetadata
      };
    } else {
      throw new Error("No content generated");
    }
  } catch (error) {
    console.error("AI Content Generation Error:", error);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message || "Failed to generate content"
    };
  }
};

export const generateCourseContent = async (sectionHeading, courseTitle = "", courseContext = "") => {
  const prompt = `You are an expert educational content writer. Generate detailed and structured course content for the section titled "${sectionHeading}" from the course "${courseTitle}". 
    ${courseContext ? `Course Context: ${courseContext}` : ""}
    The content should:
    - Clearly explain the topic in an engaging, student-friendly tone
    - Be suitable for online learners at a beginner to intermediate level
    - Include relevant real-world examples or use cases where appropriate
    - Be logically structured with subheadings or bullet points if needed
    - Focus only on the section topic, without extra instructions or teaching suggestions
    - Avoid offering meta-commentary or advice to the instructor
    The output should read like actual course material written directly for students.`;

  return await generateContent(prompt);
}; 