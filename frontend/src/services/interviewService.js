import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const registerCandidate = async (data) => {
  const res = await axios.post(`${API_BASE}/candidate/register`, data);
  return res.data;
};

export const startInterview = async (data) => {
  const res = await axios.post(`${API_BASE}/interview/start`, data);
  return res.data;
};

export const evaluateAnswer = async (data) => {
  const res = await axios.post(`${API_BASE}/interview/evaluate`, data);
  return res.data;
};

export const finalizeInterview = async (sessionId) => {
  const res = await axios.post(`${API_BASE}/interview/finalize`, { sessionId });
  return res.data;
};

export const getSystemWorkflow = async () => {
  const res = await axios.get(`${API_BASE}/interview/system/workflow`);
  return res.data;
};
