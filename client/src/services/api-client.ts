// ===========================================
// API Client Configuration
// ===========================================

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: string[]
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Get authorization headers
 */
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An unexpected error occurred",
    }));

    throw new ApiError(
      response.status,
      Array.isArray(error.message) ? error.message[0] : error.message,
      Array.isArray(error.message) ? error.message : undefined
    );
  }

  // Handle empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

/**
 * API Client with typed methods
 */
export const apiClient = {
  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    return handleResponse<T>(response);
  },

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  },

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  },

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    return handleResponse<T>(response);
  },

  /**
   * Upload file(s)
   */
  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData,
    });

    return handleResponse<T>(response);
  },
};

export default apiClient;
