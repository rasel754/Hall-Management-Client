import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://hall-management-server-three.vercel.app";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

    } else {
      console.warn(`⚠️ Making request to ${config.url} WITHOUT token`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only auto-logout for auth endpoints, not for data fetching endpoints
    // This prevents logout when accessing protected resources that might have permission issues
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // Intercept error and extract user friendly message
    const friendlyMessage = extractErrorMessage(error);
    if (!error.response) {
      error.response = {
        data: {
          message: friendlyMessage,
        },
      };
    } else {
      if (!error.response.data) {
        error.response.data = {};
      }
      error.response.data.message = friendlyMessage;
    }
    error.message = friendlyMessage;

    return Promise.reject(error);
  }
);

export function extractErrorMessage(error: any): string {
  if (!error) return "An unexpected error occurred.";

  const response = error.response;
  if (!response) {
    if (error.request) {
      return "Network error: Unable to connect to the server. Please check your internet connection and verify the server is running.";
    }
    return error.message || "An unexpected error occurred.";
  }

  const status = response.status;
  const data = response.data;

  // Handle Rate Limiting (Too Many Requests - HTTP 429)
  if (status === 429) {
    return data?.message || "Too many attempts. Please try again after 15 minutes.";
  }

  // Handle Validation Errors (HTTP 400)
  if (status === 400) {
    // 1. Zod validation error format: { message: "Validation Error", errors: { body: { field: { _errors: [...] } } } }
    if (data?.message === "Validation Error" && data?.errors) {
      const errorsObj = data.errors;
      const messages: string[] = [];

      // Check Zod format hierarchy: errors.body
      if (errorsObj.body && typeof errorsObj.body === "object") {
        const bodyErrors = errorsObj.body;
        for (const key in bodyErrors) {
          if (key !== "_errors" && bodyErrors[key]?._errors && Array.isArray(bodyErrors[key]._errors)) {
            const fieldLabel = key.charAt(0).toUpperCase() + key.slice(1);
            messages.push(`${fieldLabel}: ${bodyErrors[key]._errors.join(", ")}`);
          }
        }
      }

      // Check flat Zod/other format: errors.field._errors
      for (const key in errorsObj) {
        if (key !== "body" && key !== "_errors" && errorsObj[key]?._errors && Array.isArray(errorsObj[key]._errors)) {
          const fieldLabel = key.charAt(0).toUpperCase() + key.slice(1);
          messages.push(`${fieldLabel}: ${errorsObj[key]._errors.join(", ")}`);
        }
      }

      // 2. Mongoose Validation/Fallback format: { errors: { fieldName: "Error message" } }
      if (messages.length === 0 && typeof errorsObj === "object") {
        for (const key in errorsObj) {
          if (typeof errorsObj[key] === "string") {
            const fieldLabel = key.charAt(0).toUpperCase() + key.slice(1);
            messages.push(`${fieldLabel}: ${errorsObj[key]}`);
          }
        }
      }

      if (messages.length > 0) {
        return `Validation failed:\n- ${messages.join("\n- ")}`;
      }
    }
    
    return data?.message || "Invalid request parameters. Please verify input data.";
  }

  // Handle Conflict (HTTP 409) - e.g. Email / Student ID already registered
  if (status === 409) {
    return data?.message || "A record with this information already exists.";
  }

  // Handle Unauthorized (HTTP 401)
  if (status === 401) {
    return data?.message || "Authentication credentials invalid or expired.";
  }

  // Handle Forbidden (HTTP 403)
  if (status === 403) {
    return data?.message || "Access denied. You do not have permission to access this.";
  }

  // Handle Not Found (HTTP 404)
  if (status === 404) {
    return data?.message || "The requested resource could not be found.";
  }

  // Fallback for internal server error (HTTP 500) and other status codes
  return data?.message || `An error occurred on the server (Status code: ${status}). Please try again later.`;
}

