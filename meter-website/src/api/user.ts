import apiClient from "./apiClient/axios";

export interface SignUpData {
    name: string;
    email: string;
    password: string;
    phone?: string; // if phone is optional
  }


export const signUp = async (formData:SignUpData) => {
    return await apiClient.post("/user/register", {
        ...formData,
    });
};
