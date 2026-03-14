import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/pet';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const petApi = {
  // Get current pet state
  getPetState: async () => {
    const response = await api.get('/state');
    return response.data;
  },

  // Get hunger time
  getHungerTime: async () => {
    const response = await api.get('/hunger-time');
    return response.data;
  },

  // Get remaining focus time
  getRemainingFocusTime: async () => {
    const response = await api.get('/remaining-focus');
    return response.data;
  },

  // Feed the pet
  feedPet: async () => {
    const response = await api.post('/feed');
    return response.data;
  },

  // Complete focus session
  completeFocusSession: async (minutes) => {
    const response = await api.post('/complete-focus', { minutes });
    return response.data;
  },

  // Update settings
  updateSettings: async (settings) => {
    const response = await api.put('/settings', settings);
    return response.data;
  },
};

export default api;
