import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const generateQuestions = async (config) => {
  const response = await axios.post(`${API_BASE_URL}/interview/start`, {
    candidateId: "demo-user", // Fallback for demo
    role: config.role,
    experience: config.exp,
    companyType: config.company,
    type: config.type,
    count: config.count,
    topic: config.topic
  });
  return response.data.questions;
};

export const evaluateFeedback = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/interview/evaluate`, data);
  return response.data;
};
