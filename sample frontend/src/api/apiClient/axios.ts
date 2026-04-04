import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { safeGetItem, safeRemoveItem, safeSetItem } from "@/lib/safeStorage";

// const baseURL = import.meta.env.VITE_API_URL || "http://13.239.33.61:4000";
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  // Mobile networks + image upload can take longer; prevent premature timeouts.
  timeout: 120000,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const adminToken = safeGetItem("authToken");
    const userToken = safeGetItem("userToken") || safeGetItem("accessToken");

    const isAdminRoute = config.url?.includes("/api/admin");

    const token = isAdminRoute ? adminToken : userToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** One in-flight refresh per realm so parallel 401s do not revoke each other. */
let adminRefreshPromise: Promise<string> | null = null;
let userRefreshPromise: Promise<string> | null = null;

async function performTokenRefresh(isAdminRoute: boolean): Promise<string> {
  const refreshToken = safeGetItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token");
  }
  const url = isAdminRoute
    ? `${baseURL}/api/admin/auth/refreshToken`
    : `${baseURL}/api/user/refreshToken`;
  const { data } = await axios.post(url, { refreshToken });
  const accessToken = data?.accessToken;
  if (!accessToken || typeof accessToken !== "string") {
    throw new Error("Invalid refresh response");
  }
  if (isAdminRoute) {
    safeSetItem("authToken", accessToken);
  } else {
    safeSetItem("userToken", accessToken);
    safeSetItem("accessToken", accessToken);
  }
  if (data.refreshToken) {
    safeSetItem("refreshToken", data.refreshToken);
  }
  return accessToken;
}

function refreshAdminAccess(): Promise<string> {
  if (!adminRefreshPromise) {
    adminRefreshPromise = performTokenRefresh(true).finally(() => {
      adminRefreshPromise = null;
    });
  }
  return adminRefreshPromise;
}

function refreshUserAccess(): Promise<string> {
  if (!userRefreshPromise) {
    userRefreshPromise = performTokenRefresh(false).finally(() => {
      userRefreshPromise = null;
    });
  }
  return userRefreshPromise;
}

function clearAdminSession() {
  safeRemoveItem("authToken");
  safeRemoveItem("adminUser");
  safeRemoveItem("refreshToken");
}

function clearUserSession() {
  safeRemoveItem("userToken");
  safeRemoveItem("refreshToken");
  safeRemoveItem("accessToken");
  safeRemoveItem("userData");
  safeRemoveItem("userInfo");
}

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    const isAdminRoute = Boolean(originalRequest.url?.includes("/api/admin"));
    const refreshToken = safeGetItem("refreshToken");

    const isPublicRoute =
      originalRequest.url?.includes("/api/admin/products") ||
      originalRequest.url?.includes("/api/admin/categories") ||
      originalRequest.url?.includes("/api/admin/auth/login") ||
      originalRequest.url?.includes("/api/user/login") ||
      originalRequest.url?.includes("/api/user/register") ||
      originalRequest.url?.includes("/api/user/verifyOtp") ||
      originalRequest.url?.includes("/api/admin/auth/refreshToken") ||
      originalRequest.url?.includes("/api/user/refreshToken");

    const isAuthLoginRequest =
      originalRequest.url?.includes("/api/admin/auth/login") ||
      originalRequest.url?.includes("/api/user/login");

    if (isAuthLoginRequest) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/logout")) {
      return Promise.reject(error);
    }

    if (isPublicRoute && !refreshToken) {
      return Promise.reject(error);
    }

    if (!refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshFn = isAdminRoute ? refreshAdminAccess : refreshUserAccess;

    try {
      const accessToken = await refreshFn();
      const h = originalRequest.headers;
      if (h && typeof (h as { set?: (k: string, v: string) => void }).set === "function") {
        (h as { set: (k: string, v: string) => void }).set("Authorization", `Bearer ${accessToken}`);
      } else {
        (originalRequest.headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;
      }
      return apiClient(originalRequest);
    } catch (refreshError) {
      if (isPublicRoute) {
        return Promise.reject(refreshError);
      }
      if (isAdminRoute) {
        clearAdminSession();
      } else {
        clearUserSession();
      }
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
