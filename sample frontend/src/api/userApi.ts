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
  return res.data; // { token, user }
};
  