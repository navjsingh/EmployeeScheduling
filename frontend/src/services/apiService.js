// The base URL of Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';


const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('accessToken');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'An unknown error occurred.');
    }

    // If the response has no content, return null
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
    }
    
    return response.json();
};

// --- Authentication Service ---
export const login = (credentials) => {
    return apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
};

export const register = (userData) => {
    return apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

export const getCurrentUser = () => {
    return apiRequest('/auth/me');
};


// --- Admin Service ---
export const getAllUsers = () => {
    return apiRequest('/admin/users');
};

export const createUser = (userData) => {
    return apiRequest('/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

export const updateUserById = (id, userData) => {
    return apiRequest(`/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    });
};

export const deleteUserById = (id) => {
    return apiRequest(`/admin/users/${id}`, {
        method: 'DELETE',
    });
};

export const getManagerTeam = () => {
    return apiRequest('/manager/team');
};

export const setEmployeeHours = (id, hours) => {
    return apiRequest(`/manager/employees/${id}/hours`, {
        method: 'PUT',
        body: JSON.stringify({ totalVacationHours: hours }),
    });
};

export const getAvailability = (year, month) => {
    return apiRequest(`/manager/availability?year=${year}&month=${month}`);
};

export const setAvailability = (availabilityData) => {
    return apiRequest('/manager/availability', {
        method: 'POST',
        body: JSON.stringify(availabilityData),
    });
};


// --- Vacation Request Service ---
export const getRequests = () => {
    return apiRequest('/requests');
};

export const createRequest = (requestData) => {
    return apiRequest('/requests', {
        method: 'POST',
        body: JSON.stringify(requestData),
    });
};

export const updateRequestStatus = (id, statusData) => {
    return apiRequest(`/requests/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(statusData),
    });
};

export const deleteRequest = (id) => {
    return apiRequest(`/requests/${id}`, {
        method: 'DELETE',
    });
};
