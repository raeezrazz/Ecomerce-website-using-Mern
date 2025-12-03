// -------- USER AUTH -------

import apiClient from "./apiClient/axios";

export const userRegister = async (name: string, email: string, phone: string, password: string) => {
  const res = await apiClient.post("/api/user/register", {
    name,
    email,
    phone,
    password,
  });
  return res.data;
};

export const verifyOtp = async (name: string, email: string, phone: string, password: string, otp: string) => {
  const res = await apiClient.post("/api/user/verifyOtp", {
    name,
    email,
    phone,
    password,
    otp,
  });
  return res.data;
};

export const resendOtp = async (email: string) => {
  const res = await apiClient.post("/api/user/resendOtp", { email });
  return res.data;
};
  
export const userLogin = async (email: string, password: string) => {
  const res = await apiClient.post("/api/user/login", { email, password });
  return res.data; // { accessToken, refreshToken, data }
};

export const getUserProfile = async () => {
  const token = localStorage.getItem('userToken') || localStorage.getItem('accessToken');
  const res = await apiClient.get("/api/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateUserProfile = async (profileData: {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}) => {
  const token = localStorage.getItem('userToken') || localStorage.getItem('accessToken');
  const res = await apiClient.put("/api/user/profile", profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const googleLogin = async (token: string) => {
  const res = await apiClient.post("/api/user/google-auth", { token });
  return res.data;
};
  