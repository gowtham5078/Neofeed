import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000';

export const loginUser = async (userId, password) => {
  return axios.post(`${BASE_URL}/api/login`, { userId, password });
};

export const fetchNeonateData = async (neonateId) => {
  return axios.get(`${BASE_URL}/api/data/${neonateId}`);
};
