# Restaurant Management Website

A modern, responsive restaurant website with online ordering and table reservation features, designed to integrate with a Spring Boot backend.

## Features

### Frontend Features
- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Online Menu**: Dynamic menu display with category filtering
- **Shopping Cart**: Add/remove items, quantity management, persistent storage
- **Table Reservations**: Date/time selection with availability checking
- **Contact Form**: Customer inquiries and feedback
- **Offline Support**: Works offline with data synchronization when online
- **Mobile Responsive**: Optimized for all device sizes

### Backend Integration Features
- **RESTful API Integration**: Complete API client for Spring Boot backend
- **Real-time Data**: Menu items, availability, and pricing from backend
- **Order Management**: Submit orders with customer information
- **Reservation System**: Check availability and create reservations
- **Offline Sync**: Queue operations when offline, sync when online
- **Error Handling**: Comprehensive error handling and user feedback

## Project Structure

```
webquanlynhahang/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # Frontend logic and UI interactions
├── api.js              # Backend API integration
└── README.md           # Project documentation
```

## File Descriptions

### `index.html`
- Main HTML structure
- Navigation, hero section, menu display
- Reservation and contact forms
- Cart modal for checkout

### `styles.css`
- Modern CSS with gradients and animations
- Responsive design for mobile/tablet/desktop
- Modal styles and form styling
- Loading states and transitions

### `script.js`
- Menu display and filtering
- Cart management (add, remove, update, persist)
- Form validation and submission
- UI interactions and animations
- Offline support and data caching

### `api.js`
- RESTful API client for Spring Boot backend
- HTTP methods (GET, POST, PUT, DELETE)
- Error handling and retry logic
- Network status monitoring
- Data transformation utilities

## Backend API Endpoints Expected

The frontend expects the following Spring Boot REST API endpoints:

### Menu Management
```
GET /api/menu/items              # Get all menu items
GET /api/menu/items/{id}         # Get specific menu item
GET /api/menu/categories         # Get menu categories
GET /api/menu/filter?category=   # Filter items by category
```

### Order Management
```
POST /api/orders                 # Create new order
GET /api/orders/{id}             # Get order details
PUT /api/orders/{id}/status      # Update order status
```

### Reservation Management
```
POST /api/reservations           # Create reservation
GET /api/reservations/availability # Check table availability
GET /api/reservations/{id}       # Get reservation details
```

### Customer Management
```
POST /api/customers              # Create/update customer
GET /api/customers/{id}          # Get customer details
```

### Contact Management
```
POST /api/contact                # Send contact message
```

## Data Models

### Menu Item
```json
{
  "id": 1,
  "name": "Margherita Pizza",
  "description": "Fresh tomatoes, mozzarella, basil",
  "price": 12.99,
  "category": "PIZZA",
  "imageUrl": "/images/margherita.jpg",
  "available": true,
  "preparationTime": 15
}
```

### Order
```json
{
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "orderType": "TAKEOUT",
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2,
      "specialInstructions": "Extra cheese"
    }
  ],
  "deliveryAddress": "123 Main St",
  "totalAmount": 25.98
}
```

### Reservation
```json
{
  "customerName": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "date": "2024-01-15",
  "time": "19:00",
  "guests": 4,
  "specialRequests": "Window seat preferred"
}
```

## Setup Instructions

### Frontend Setup
1. Clone or download the project files
2. Open `index.html` in a web browser, or
3. Serve using a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

### Backend Integration
1. Update the `BASE_URL` in `api.js` to match your Spring Boot server:
   ```javascript
   const BASE_URL = 'http://localhost:8080'; // Change to your backend URL
   ```

2. Ensure your Spring Boot application has CORS configured:
   ```java
   @CrossOrigin(origins = "http://localhost:8000")
   ```

3. Implement the required REST endpoints in your Spring Boot application

### Environment Configuration
- **Development**: Use `http://localhost:8080` for local Spring Boot server
- **Production**: Update `BASE_URL` to your production server URL
- **HTTPS**: Ensure SSL certificates are properly configured for production

## Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Features in Detail

### Offline Support
- Menu items cached in localStorage
- Orders queued when offline
- Automatic sync when connection restored
- Visual indicators for offline status

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions
- Optimized images and fonts

### Performance
- Lazy loading for images
- Efficient DOM manipulation
- Minimal HTTP requests
- Local storage for caching

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is open source and available under the MIT License.