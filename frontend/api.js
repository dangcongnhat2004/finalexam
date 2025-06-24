// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// API Service Class
class RestaurantAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Generic HTTP request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // GET request
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Menu API endpoints
    async getMenuItems() {
        return this.get('/menu/items');
    }

    async getMenuItemsByCategory(category) {
        return this.get(`/menu/items?category=${category}`);
    }

    async getMenuItem(id) {
        return this.get(`/menu/items/${id}`);
    }
    
    async deleteMenuItem(id) {
        return this.delete(`/menu/items/${id}`);
    }
    
    async deleteAllMenuItemsExceptPhoBo() {
        return this.delete('/menu/delete-all-except-pho-bo');
    }

    // Order API endpoints
    async createOrder(orderData) {
        return this.post('/orders', orderData);
    }

    async getOrder(orderId) {
        return this.get(`/orders/${orderId}`);
    }

    async updateOrderStatus(orderId, status) {
        return this.put(`/orders/${orderId}/status`, { status });
    }

    // Booking/Reservation API endpoints
    async createReservation(reservationData) {
        return this.post('/bookings', reservationData);
    }

    async getReservation(reservationId) {
        return this.get(`/bookings/${reservationId}`);
    }

    async updateReservation(reservationId, reservationData) {
        return this.put(`/bookings/${reservationId}`, reservationData);
    }

    async cancelReservation(reservationId) {
        return this.delete(`/bookings/${reservationId}`);
    }

    async checkAvailability(date, time, guests) {
        // Sử dụng endpoint có sẵn với restaurantId mặc định
        const restaurantId = 1; // Restaurant mặc định
        const bookingTime = `${date}T${time}:00`; // Chuyển đổi sang ISO format
        return this.get(`/bookings/availability/restaurant/${restaurantId}?bookingTime=${bookingTime}&numberOfGuests=${guests}`);
    }

    // Contact API endpoints
    async sendContactMessage(messageData) {
        return this.post('/contact/messages', messageData);
    }

    // Customer API endpoints
    async createCustomer(customerData) {
        return this.post('/customers', customerData);
    }

    async getCustomer(customerId) {
        return this.get(`/customers/${customerId}`);
    }

    async updateCustomer(customerId, customerData) {
        return this.put(`/customers/${customerId}`, customerData);
    }
}

// Create global API instance
const api = new RestaurantAPI();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RestaurantAPI, api };
}

// Error handling utility
class APIError extends Error {
    constructor(message, status, response) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.response = response;
    }
}

// Response interceptor for common error handling
const handleAPIError = (error) => {
    if (error instanceof APIError) {
        switch (error.status) {
            case 400:
                showNotification('Invalid request. Please check your input.', 'error');
                break;
            case 401:
                showNotification('Authentication required.', 'error');
                break;
            case 403:
                showNotification('Access denied.', 'error');
                break;
            case 404:
                showNotification('Resource not found.', 'error');
                break;
            case 500:
                showNotification('Server error. Please try again later.', 'error');
                break;
            default:
                showNotification('An unexpected error occurred.', 'error');
        }
    } else {
        showNotification('Network error. Please check your connection.', 'error');
    }
};

// Utility functions for data transformation
const transformMenuItemForAPI = (item) => {
    return {
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        available: true,
        imageUrl: item.imageUrl || null
    };
};

const transformOrderForAPI = (cart, customerInfo) => {
    return {
        customerInfo: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone
        },
        items: cart.map(item => ({
            menuItemId: item.id,
            quantity: item.quantity,
            price: item.price,
            specialInstructions: item.specialInstructions || null
        })),
        totalAmount: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
        orderType: 'TAKEOUT', // or 'DELIVERY', 'DINE_IN'
        status: 'PENDING'
    };
};

const transformReservationForAPI = (formData) => {
    return {
        customerInfo: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone
        },
        reservationDate: formData.date,
        reservationTime: formData.time,
        numberOfGuests: parseInt(formData.guests),
        specialOccasion: formData.occasion || null,
        specialRequests: formData.requests || null,
        status: 'PENDING'
    };
};

// Loading state management
const showLoading = (element) => {
    if (element) {
        element.disabled = true;
        element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    }
};

const hideLoading = (element, originalText) => {
    if (element) {
        element.disabled = false;
        element.innerHTML = originalText;
    }
};

// Local storage utilities for offline support
const CacheManager = {
    set(key, data, expirationMinutes = 30) {
        const item = {
            data: data,
            timestamp: Date.now(),
            expiration: expirationMinutes * 60 * 1000
        };
        localStorage.setItem(`restaurant_${key}`, JSON.stringify(item));
    },

    get(key) {
        const item = localStorage.getItem(`restaurant_${key}`);
        if (!item) return null;

        const parsed = JSON.parse(item);
        const now = Date.now();

        if (now - parsed.timestamp > parsed.expiration) {
            localStorage.removeItem(`restaurant_${key}`);
            return null;
        }

        return parsed.data;
    },

    remove(key) {
        localStorage.removeItem(`restaurant_${key}`);
    },

    clear() {
        Object.keys(localStorage)
            .filter(key => key.startsWith('restaurant_'))
            .forEach(key => localStorage.removeItem(key));
    }
};

// Network status detection
const NetworkManager = {
    isOnline: navigator.onLine,
    
    init() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            showNotification('Connection restored!', 'success');
            this.syncOfflineData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            showNotification('You are offline. Some features may be limited.', 'error');
        });
    },
    
    async syncOfflineData() {
        // Implement offline data synchronization logic here
        console.log('Syncing offline data...');
    }
};

// Initialize network manager
NetworkManager.init();