import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// All apis
export const sendCode = (data: object) => api.post("/api/auth/send-otp", data);
export const verifyCode = (data: object) =>
  api.post("/api/auth/verify-otp", data);
export const activateProfile = (formData: object) =>
  api.post("/api/auth/activate", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const refresh = () => api.get("/api/auth/refresh");
export const logout = () => api.get("/api/auth/logout");
export const createROOM = (data:object) => api.post("/api/room",data);
export const getAllRoom = () => api.get("/api/room");
export const getRoom = (roomid:string) => api.get(`/api/room/${roomid}`);


api.interceptors.response.use(
  (config) => {
    // console.log("Config::", config);
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          { withCredentials: true },
        );
        console.log("Reponse::AXIOS::", response);
        return api.request(originalRequest);
      } catch (error) {
        if (error instanceof Error) console.log(error.message);
      }
    }

    throw error;
  },
);

export default api;
