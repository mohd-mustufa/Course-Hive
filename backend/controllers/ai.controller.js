import { generateContent, generateCourseContent } from "../services/aiService.js";

export const generateAIContent = async (req, res) => {
  const { prompt, sectionHeading, courseTitle, courseContext } = req.body;
  const adminId = req.adminId;

  try {
    if (!adminId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!prompt && !sectionHeading) {
      return res.status(400).json({ error: "Either prompt or sectionHeading is required" });
    }

    let result;
    if (sectionHeading) {
      // Generate course-specific content
      result = await generateCourseContent(sectionHeading, courseTitle, courseContext);
    } else {
      // Generate content from custom prompt
      result = await generateContent(prompt);
    }

    if (result.success) {
      res.status(200).json({
        success: true,
        content: result.content,
        usage: result.usage
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
}; 