import apiClient from "./apiClient/axios";

export const signUp = async (formData) => {
    return await apiClient.post("/user/register", {
        formData,
    });
};
