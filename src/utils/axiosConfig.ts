import axios, { AxiosResponse } from "axios";

const axiosInstance = axios.create({
  baseURL:"https://pdf-uploader-server-s9iw.onrender.com/api",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Handle specific status codes for successful responses
    if (response.status === 200) {
    }
    return response;
  },
  (error) => {
    // Handle error responses based on status codes
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          alert(data.message);
          break;
        case 401:
          alert(data.message);
          window.location.href = "/login";
          break;
        case 403:
          alert(data.message);
          break;
        case 404:
          alert(data.message);
          break;
        case 500:
          alert(data.message);
          break;
        default:
          alert("An unexpected error occurred.");
      }
    } 
    return Promise.reject(error);
  }
);

export default axiosInstance;