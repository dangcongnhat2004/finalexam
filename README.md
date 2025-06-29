# Restaurant Management System

A full-stack restaurant management system with Spring Boot backend and vanilla JavaScript frontend.

## Project Structure

```
project java cuoi ky/
├── backend/                 # Spring Boot REST API
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   ├── pom.xml            # Maven dependencies
│   └── mvnw, mvnw.cmd     # Maven wrapper
└── frontend/               # Static web files
    ├── index.html         # Main HTML file
    ├── script.js          # JavaScript functionality
    ├── api.js             # API communication
    ├── styles.css         # CSS styling
    ├── server.js          # Node.js server (optional)
    └── start-frontend.bat # Windows batch file to start frontend
```

## Features

### Backend (Spring Boot)
- **Menu Management**: CRUD operations for menu items
- **Order Management**: Create and manage customer orders
- **Booking/Reservation System**: Table reservations with availability checking
- **Contact Messages**: Handle customer inquiries
- **Restaurant & Table Management**: Manage restaurant information and tables
- **User Management**: User registration and management
- **H2 Database**: In-memory database for development
- **CORS Support**: Cross-origin requests enabled
- **Data Initialization**: Sample data loaded on startup

### Frontend (Vanilla JavaScript)
- **Responsive Design**: Mobile-friendly interface
- **Menu Display**: Browse menu items by category
- **Shopping Cart**: Add items to cart and manage orders
- **Table Reservation**: Book tables with date/time selection
- **Contact Form**: Send messages to restaurant
- **Offline Support**: Basic caching for offline functionality
- **Modern UI**: Clean, professional design with animations

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven (included via wrapper)
- Modern web browser
- (Optional) Node.js for frontend server

### Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd "backend"
   ```

2. Run the Spring Boot application:
   ```bash
   # On Windows
   .\mvnw spring-boot:run
   
   # On macOS/Linux
   ./mvnw spring-boot:run
   ```

3. The backend will start on `http://localhost:8080`

4. Access the H2 database console at `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:testdb`
   - Username: `sa`
   - Password: `password`

### Running the Frontend

#### Option 1: Direct Browser Access (Recommended)
1. Navigate to the frontend directory
2. Double-click `start-frontend.bat` (Windows)
3. Or simply open `index.html` in your web browser

#### Option 2: Using Node.js Server
1. Navigate to the frontend directory:
   ```bash
   cd "frontend"
   ```

2. Start the Node.js server:
   ```bash
   node server.js
   ```

3. Open `http://localhost:3000` in your browser

## API Endpoints

### Menu Items
- `GET /api/menu/items` - Get all menu items
- `GET /api/menu/items/{id}` - Get menu item by ID
- `POST /api/menu/items` - Create new menu item
- `PUT /api/menu/items/{id}` - Update menu item
- `DELETE /api/menu/items/{id}` - Delete menu item

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}` - Update order
- `DELETE /api/orders/{id}` - Delete order

### Bookings/Reservations
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/{id}` - Get booking by ID
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Cancel booking

### Contact Messages
- `GET /api/contact/messages` - Get all contact messages
- `POST /api/contact/messages` - Send new contact message

## Database Schema

The application uses H2 in-memory database with the following main entities:
- **MenuItem**: Restaurant menu items with categories and pricing
- **Order**: Customer orders with items and status
- **Booking**: Table reservations with customer information
- **ContactMessage**: Customer inquiries and messages
- **Restaurant**: Restaurant information
- **RestaurantTable**: Table management
- **User**: User accounts and authentication

## Configuration

### Backend Configuration
Edit `backend/src/main/resources/application.properties`:
```properties
# Database configuration
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.datasource.password=password

# JPA configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Frontend Configuration
Edit `frontend/api.js` to change the API base URL:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## Development

### Adding New Features
1. **Backend**: Add new controllers, services, and models in the appropriate packages
2. **Frontend**: Update `api.js` for new endpoints and `script.js` for new functionality
3. **Database**: Modify entity classes and let Hibernate handle schema updates

### Testing
- Backend: Use Maven for running tests: `./mvnw test`
- Frontend: Open browser developer tools to check for JavaScript errors
- API: Use tools like Postman or curl to test endpoints

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend is running on port 8080
2. **Database Issues**: Check H2 console for data and schema
3. **Frontend Not Loading**: Try opening `index.html` directly in browser
4. **API Errors**: Check browser network tab for failed requests

### Port Conflicts
- Backend default: 8080 (change in `application.properties`)
- Frontend default: 3000 (change in `server.js`)

## Production Deployment

### Backend
1. Build the JAR file: `./mvnw clean package`
2. Run with: `java -jar target/restaurant-management-0.0.1-SNAPSHOT.jar`
3. Configure production database (MySQL, PostgreSQL, etc.)

### Frontend
1. Serve static files using a web server (Nginx, Apache)
2. Update API_BASE_URL to production backend URL
3. Enable HTTPS for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes.#   f i n a l e x a m  
 