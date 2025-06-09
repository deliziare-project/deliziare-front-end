import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  console.log("processQueue called with error:", error, "token:", token);
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use((config) => {
  console.log("Request interceptor triggered for:", config.url);
  config.withCredentials = true;
  return config;
});

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       originalRequest.url !== "/users/refreshtoken" // prevent refresh loop
//     ) {
//       // Optionally check if refresh token exists before trying to refresh:
//       const hasRefreshToken = document.cookie.includes("refreshToken"); // example if using cookies

//       if (!hasRefreshToken) {
//         // No refresh token, redirect to login or reject immediately
//         if (typeof window !== "undefined") {
//           window.location.href = "/login";
//         }
//         return Promise.reject(error);
//       }

//       originalRequest._retry = true;

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then(() => axiosInstance(originalRequest))
//           .catch((err) => Promise.reject(err));
//       }

//       isRefreshing = true;

//       try {
//         await axiosInstance.post("/users/refreshtoken", {}, { withCredentials: true });
//         processQueue(null);
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError, null);
//         if (typeof window !== "undefined") {
//           window.location.href = "/login";
//         }
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/users/refreshtoken"
    ) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post("/users/refreshtoken", {}, { withCredentials: true });
        // 👇 Now retry original request (accessToken will be set via cookie)
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);



export default axiosInstance;
