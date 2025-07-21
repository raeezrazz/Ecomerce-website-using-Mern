import apiClient from "./apiClient/axios";

export interface SignUpData {
    name: string;
    email: string;
    password: string;
    phone?: string; 
    otp?: string;
  }


export const signUp = async (formData:SignUpData) => {
    return await apiClient.post("/user/register", {
        ...formData,
    });
};

export  const verifyOtp =async (formData: SignUpData)=>{
    return await apiClient.post('/user/verifyOtp',{
        ...formData
    });
};
export const resendOtp = async (email: string) => {
    return await apiClient.post("/user/resendOtp", { email });
  };
  
