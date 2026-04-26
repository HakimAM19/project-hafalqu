import axios from "axios";

const BASE_URL = "/setoran-dev/v1";
const URL_API = "https://api.tif.uin-suska.ac.id";
const KC_URL = "https://id.tif.uin-suska.ac.id";

// AXIOS INSTANCE
const api = axios.create({
  baseURL: `${URL_API}${BASE_URL}`,
});

// INTERCEPTOR TOKEN
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 🔐 LOGIN
export const loginAPI = async (username, password) => {
  const params = new URLSearchParams();
  params.append("client_id", "setoran-mobile-dev");
  params.append("client_secret", "aqJp3xnXKudgC7RMOshEQP7ZoVKWzoSl");
  params.append("grant_type", "password");
  params.append("username", username);
  params.append("password", password);
  params.append("scope", "openid profile email");

  return axios.post(
    `${KC_URL}/realms/dev/protocol/openid-connect/token`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

// 📡 GET MAHASISWA PA
export const getPAMahasiswa = () => api.get("/dosen/pa-saya");

// 📡 DETAIL SETORAN
export const getDetailSetoran = (nim) =>
  api.get(`/mahasiswa/setoran/${nim}`);

// 📡 SIMPAN SETORAN
export const simpanSetoran = (nim, data) =>
  api.post(`/mahasiswa/setoran/${nim}`, data);

export default api;