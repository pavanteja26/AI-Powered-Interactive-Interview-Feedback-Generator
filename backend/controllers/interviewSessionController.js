const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// @desc    Generate a single interview question
// @route   POST /api/interview/generate-question
exports.generateQuestion = async (req, res) => {
  try {
    const { job_role, experience_level, type } = req.body;

    const prompt = `You are an AI interviewer.

Generate ONE professional interview question.

Constraints:
- Role: ${job_role}
- Experience: ${experience_level}
- Type: ${type}

Rules:
- No repetition
- Real-world question
- Keep it concise (1–2 lines)

Return only the question.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    res.status(200).json({ question: text });
  } catch (error) {
    console.error('Error generating question:', error);
    res.status(500).json({ message: 'Error generating question' });
  }
};

// @desc    Evaluate answer based on transcript
// @route   POST /api/interview/evaluate-answer
exports.evaluateAnswer = async (req, res) => {
  try {
    const { answer } = req.body;

    const prompt = `Evaluate the candidate response strictly based on the transcript.

Transcript:
${answer}

Return structured output:

1. Overall Competence:
2. Problem-Solving and Analytical Skills:
3. Communication and Confidence:
4. Behavioral and Team Skills:
5. Strengths:
6. Areas for Improvement:
7. Final Recommendation (Hire/Consider/Reject):
8. Overall Score (out of 10):

Rules:
- No assumptions beyond transcript
- Penalize vague answers
- Be realistic like a recruiter
- Keep response under 200 words`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Since the user asked for structured output but didn't specify JSON format for THIS prompt,
    // I will try to parse it or just return the text if it's meant to be displayed.
    // However, for a production system, JSON is better. I'll add a rule to return JSON if I can,
    // but the user's prompt was specific. I'll stick to their prompt and if it returns text,
    // I'll send it as a string.

    res.status(200).json({ evaluation: text });
  } catch (error) {
    console.error('Error evaluating answer:', error);
    res.status(500).json({ message: 'Error evaluating answer' });
  }
};
