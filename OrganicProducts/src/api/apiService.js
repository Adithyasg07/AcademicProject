// Centralized API Service for HTTP Requests
const API_BASE_URL = "http://localhost:5249/api";

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
};

const handleResponse = async (response) => {
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login") {
            window.location.href = "/login";
        }
        throw new Error("Session expired. Please log in again.");
    }
    
    if (!response.ok) {
        let errorMessage = "API request failed";
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.detail || errorMessage;
        } catch {
            errorMessage = await response.text() || errorMessage;
        }
        throw new Error(errorMessage);
    }
    
    return response.json();
};

export const apiService = {
    get: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "GET",
            headers: getHeaders()
        });
        return handleResponse(response);
    },

    post: async (endpoint, data) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    put: async (endpoint, data) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    delete: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        return handleResponse(response);
    },
    
    // specifically for file uploads (FormData)
    postFormData: async (endpoint, formData) => {
        const token = localStorage.getItem("token");
        const headers = token ? { "Authorization": `Bearer ${token}` } : {};
        // Do NOT set Content-Type header for FormData, browser automatically sets multipart boundary
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers,
            body: formData
        });
        return handleResponse(response);
    },
    
    putFormData: async (endpoint, formData) => {
        const token = localStorage.getItem("token");
        const headers = token ? { "Authorization": `Bearer ${token}` } : {};
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "PUT",
            headers,
            body: formData
        });
        return handleResponse(response);
    }
};
