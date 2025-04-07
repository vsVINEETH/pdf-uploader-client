import axiosInstance from "@/utils/axiosConfig";

export const userAuthService = {
    login: async (email: string, password: string) => {
        const response = await axiosInstance.post("/user/login", {
          email,
          password,
        });
        return response.data;
      },

      signup: async (name: string, email: string, password: string) => {
        const response = await axiosInstance.post("/user/signup",{
            name,
            email,
            password
        });
        return response.data;
      },

      logout: async () => {
        const response = await axiosInstance.delete("/user/logout");
        return response.data;
      },
}