// Menu data - will be loaded from API
let menuItems = [];
let allMenuItems = []; // Store all items for filtering

// Cart functionality
let cart = [];
let cartCount = 0;

// DOM elements
const menuGrid = document.getElementById('menuGrid');
const categoryBtns = document.querySelectorAll('.category-btn');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCountElement = document.getElementById('cartCount');
const closeModal = document.querySelector('.close');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkout');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    await loadMenuItems();
    setupEventListeners();
    setupSmoothScrolling();
    setupFormValidation();
    setMinDate();
});

// Load menu items from API
async function loadMenuItems() {
    try {
        showLoadingState();
        
        // Try to get from cache first
        const cachedItems = CacheManager.get('menu_items');
        if (cachedItems && NetworkManager.isOnline) {
            allMenuItems = cachedItems;
            menuItems = [...allMenuItems];
            displayMenuItems(menuItems);
        }
        
        // Fetch fresh data from API
        if (NetworkManager.isOnline) {
            const freshItems = await api.getMenuItems();
            allMenuItems = freshItems;
            menuItems = [...allMenuItems];
            
            // Cache the fresh data
            CacheManager.set('menu_items', freshItems, 60); // Cache for 1 hour
            
            displayMenuItems(menuItems);
        } else if (!cachedItems) {
            // Show offline message if no cached data
            showOfflineMessage();
        }
        
    } catch (error) {
        console.error('Failed to load menu items:', error);
        handleAPIError(error);
        
        // Try to load from cache as fallback
        const cachedItems = CacheManager.get('menu_items');
        if (cachedItems) {
            allMenuItems = cachedItems;
            menuItems = [...allMenuItems];
            displayMenuItems(menuItems);
            showNotification('Loaded menu from cache due to connection issues.', 'warning');
        } else {
            showErrorState();
        }
    } finally {
        hideLoadingState();
    }
}

// Format price to VND currency
function formatVND(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Admin Panel Functions
// Show admin panel (press Ctrl+Shift+B)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'B') {
        const adminSection = document.getElementById('admin');
        if (adminSection) {
            adminSection.style.display = adminSection.style.display === 'none' ? 'block' : 'none';
            if (adminSection.style.display === 'block') {
                adminSection.scrollIntoView({ behavior: 'smooth' });
                showNotification('Admin panel activated! 🔧', 'success');
            } else {
                showNotification('Admin panel hidden! 👋', 'info');
            }
        }
    }
});

// Handle delete all menu items except Pho Bo
document.addEventListener('DOMContentLoaded', function() {
    const deleteAllExceptPhoBoBtn = document.getElementById('deleteAllExceptPhoBo');
    if (deleteAllExceptPhoBoBtn) {
        deleteAllExceptPhoBoBtn.addEventListener('click', async function() {
            // Show confirmation dialog
            const confirmed = confirm(
                '⚠️ BẠN CÓ CHẮC CHẮN MUỐN XÓA TẤT CẢ MÓN ĂN ?\n\n' +
                'Thao tác này KHÔNG THỂ HOÀN TÁC!\n\n' +
                'Nhấn OK để xác nhận xóa, Cancel để hủy bỏ.'
            );
            
            if (!confirmed) {
                return;
            }
            
            try {
                showLoading(this);
                
                await api.deleteAllMenuItemsExceptPhoBo();
                showNotification('✅ Đã xóa thành công tất cả món ăn', 'success');
                
                // Reload menu to show updated list
                await loadMenuItems();
                
            } catch (error) {
                console.error('Error deleting menu items:', error);
                showNotification('❌ Lỗi khi xóa món ăn! Vui lòng thử lại.', 'error');
            } finally {
                hideLoading(this);
            }
        });
    }
    
    // Handle delete individual menu item
    const deleteMenuItemBtn = document.getElementById('deleteMenuItemBtn');
    if (deleteMenuItemBtn) {
        deleteMenuItemBtn.addEventListener('click', async function() {
            const menuItemId = document.getElementById('deleteMenuItemId').value;
            
            if (!menuItemId) {
                showNotification('⚠️ Vui lòng nhập ID món ăn cần xóa!', 'warning');
                return;
            }
            
            const confirmed = confirm(
                `⚠️ BẠN CÓ CHẮC CHẮN MUỐN XÓA MÓN ĂN ID: ${menuItemId}?\n\n` +
                'Thao tác này KHÔNG THỂ HOÀN TÁC!\n\n' +
                'Nhấn OK để xác nhận xóa, Cancel để hủy bỏ.'
            );
            
            if (!confirmed) {
                return;
            }
            
            try {
                showLoading(this);
                
                await api.deleteMenuItem(menuItemId);
                showNotification(`✅ Đã xóa thành công món ăn ID: ${menuItemId}`, 'success');
                
                // Clear input and reload menu
                document.getElementById('deleteMenuItemId').value = '';
                await loadMenuItems();
                await loadMenuList(); // Reload the menu list display
                
            } catch (error) {
                console.error('Error deleting menu item:', error);
                showNotification(`❌ Lỗi khi xóa món ăn ID: ${menuItemId}! Có thể ID không tồn tại.`, 'error');
            } finally {
                hideLoading(this);
            }
        });
    }
    
    // Handle load menu list
    const loadMenuListBtn = document.getElementById('loadMenuListBtn');
    if (loadMenuListBtn) {
        loadMenuListBtn.addEventListener('click', loadMenuList);
    }
    
    // Auto-load menu list when admin panel is opened
    setTimeout(loadMenuList, 1000);
});

// Function to load and display menu list
async function loadMenuList() {
    const menuListDisplay = document.getElementById('menuListDisplay');
    if (!menuListDisplay) return;
    
    try {
        const menuItems = await api.getMenuItems();
        
        if (!menuItems || menuItems.length === 0) {
            menuListDisplay.innerHTML = '<p style="color: #666; font-style: italic;">Không có món ăn nào trong menu.</p>';
            return;
        }
        
        const menuListHTML = menuItems.map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; border-bottom: 1px solid #eee; font-size: 0.9rem;">
                <div>
                    <strong>ID: ${item.id}</strong> - ${item.name}
                    <br><span style="color: #666;">${item.category} | ${formatVND(item.price)}</span>
                </div>
                <button onclick="quickDeleteMenuItem(${item.id}, '${item.name}')" style="padding: 0.25rem 0.5rem; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 0.8rem;">🗑️</button>
            </div>
        `).join('');
        
        menuListDisplay.innerHTML = menuListHTML;
        
    } catch (error) {
        console.error('Error loading menu list:', error);
        menuListDisplay.innerHTML = '<p style="color: #dc3545;">❌ Lỗi khi tải danh sách menu!</p>';
    }
}

// Quick delete function for menu items
async function quickDeleteMenuItem(id, name) {
    const confirmed = confirm(
        `⚠️ XÓA MÓN ĂN: "${name}" (ID: ${id})?\n\n` +
        'Thao tác này KHÔNG THỂ HOÀN TÁC!\n\n' +
        'Nhấn OK để xác nhận xóa, Cancel để hủy bỏ.'
    );
    
    if (!confirmed) return;
    
    try {
        await api.deleteMenuItem(id);
        showNotification(`✅ Đã xóa thành công món ăn: "${name}"`, 'success');
        
        // Reload menu and menu list
        await loadMenuItems();
        await loadMenuList();
        
    } catch (error) {
        console.error('Error deleting menu item:', error);
        showNotification(`❌ Lỗi khi xóa món ăn: "${name}"!`, 'error');
    }
}
    
    // Handle add menu item form
    const addMenuItemForm = document.getElementById('addMenuItemForm');
    if (addMenuItemForm) {
        addMenuItemForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Convert price to number
            data.price = parseFloat(data.price);
            
            // Set default values if empty
            if (!data.imageUrl) {
                data.imageUrl = null;
            }
            if (!data.icon) {
                data.icon = getCategoryIcon(data.category);
            }
            
            try {
                const submitBtn = this.querySelector('button[type="submit"]');
                showLoading(submitBtn);
                
                await api.post('/menu/items', data);
                showNotification(`✅ Món "${data.name}" đã được thêm thành công!`, 'success');
                this.reset();
                
                // Reload menu to show new item
                await loadMenuItems();
                
            } catch (error) {
                console.error('Error adding menu item:', error);
                showNotification('❌ Lỗi khi thêm món ăn! Vui lòng thử lại.', 'error');
            } finally {
                hideLoading(this.querySelector('button[type="submit"]'));
            }
        });
    }

// Display menu items
function displayMenuItems(items) {
    menuGrid.innerHTML = '';
    
    if (!items || items.length === 0) {
        menuGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem; color: #666;">No menu items available.</p>';
        return;
    }
    
    items.forEach((item, index) => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item loading';
        
        // Get icon from item or use default based on category
        const icon = item.icon || getCategoryIcon(item.category);
        
        menuItem.innerHTML = `
            <div class="menu-item-image">
                ${item.imageUrl ? 
                    `<img src="${item.imageUrl}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">` :
                    `<span style="font-size: 4rem;">${icon}</span>`
                }
            </div>
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="menu-item-footer">
                    <span class="price">${formatVND(item.price)}</span>
                    <button class="add-to-cart" onclick="addToCart(${item.id})" ${!item.available ? 'disabled' : ''}>
                        <i class="fas fa-plus"></i> ${item.available ? 'Add to Cart' : 'Unavailable'}
                    </button>
                </div>
            </div>
        `;
        
        menuGrid.appendChild(menuItem);
        
        // Animate item appearance
        setTimeout(() => {
            menuItem.classList.remove('loading');
            menuItem.classList.add('loaded');
        }, index * 100);
    });
}

// Get default icon based on category
function getCategoryIcon(category) {
    const icons = {
        'appetizers': '🥗',
        'mains': '🍽️',
        'desserts': '🍰',
        'beverages': '🥤'
    };
    return icons[category] || '🍽️';
}

// Filter menu items by category
async function filterMenu(category) {
    try {
        if (category === 'all') {
            menuItems = [...allMenuItems];
        } else {
            // Try to get filtered items from API if online
            if (NetworkManager.isOnline) {
                menuItems = await api.getMenuItemsByCategory(category);
            } else {
                // Filter locally if offline
                menuItems = allMenuItems.filter(item => item.category === category);
            }
        }
        displayMenuItems(menuItems);
    } catch (error) {
        console.error('Failed to filter menu:', error);
        // Fallback to local filtering
        menuItems = category === 'all' ? [...allMenuItems] : allMenuItems.filter(item => item.category === category);
        displayMenuItems(menuItems);
    }
}

// Add item to cart
function addToCart(itemId) {
    const item = allMenuItems.find(item => item.id === itemId) || menuItems.find(item => item.id === itemId);
    
    if (!item) {
        showNotification('Item not found!', 'error');
        return;
    }
    
    if (!item.available) {
        showNotification('This item is currently unavailable.', 'error');
        return;
    }
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCartUI();
    saveCartToStorage();
    showNotification(`${item.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartUI();
}

// Update item quantity
function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartUI();
        }
    }
}

// Update cart UI
function updateCartUI() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = cartCount;
    
    // Update cart items display
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${formatVND(item.price)} mỗi món</p>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <span class="item-total">${formatVND(item.price * item.quantity)}</span>
            </div>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    
    cartTotal.textContent = formatVND(total);
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
    }
}

// Clear cart
function clearCart() {
    cart = [];
    updateCartUI();
    showNotification('Cart cleared!');
}

// Checkout
async function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Show customer info modal for checkout
    showCustomerInfoModal();
}

// Process order with customer information
async function processOrder(customerInfo) {
    try {
        const checkoutBtn = document.getElementById('checkout');
        showLoading(checkoutBtn);
        
        const orderData = transformOrderForAPI(cart, customerInfo);
        
        if (NetworkManager.isOnline) {
            const response = await api.createOrder(orderData);
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            showNotification(`Order placed successfully! Order ID: ${response.id}\nTotal: ${formatVND(total)}`, 'success');
            
            // Clear cart after successful order
            cart = [];
            updateCartUI();
            clearCartFromStorage();
            cartModal.style.display = 'none';
            
        } else {
            // Store order offline for later sync
            const offlineOrders = JSON.parse(localStorage.getItem('offline_orders') || '[]');
            offlineOrders.push({
                ...orderData,
                timestamp: Date.now(),
                status: 'PENDING_SYNC'
            });
            localStorage.setItem('offline_orders', JSON.stringify(offlineOrders));
            
            showNotification('Order saved offline. It will be processed when connection is restored.', 'warning');
            cart = [];
            updateCartUI();
            clearCartFromStorage();
            cartModal.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Checkout failed:', error);
        handleAPIError(error);
    } finally {
        const checkoutBtn = document.getElementById('checkout');
        hideLoading(checkoutBtn, 'Checkout');
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        white-space: pre-line;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    // Category buttons
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterMenu(btn.dataset.category);
        });
    });
    
    // Cart modal
    cartBtn.addEventListener('click', () => {
        cartModal.style.display = 'block';
    });
    
    closeModal.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    clearCartBtn.addEventListener('click', clearCart);
    checkoutBtn.addEventListener('click', checkout);
    
    // Mobile menu
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Setup smooth scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Setup form validation
function setupFormValidation() {
    const reservationForm = document.getElementById('reservationForm');
    const contactForm = document.getElementById('contactForm');
    
    reservationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.email || !data.phone || !data.date || !data.time || !data.guests) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Date validation (must be today or future)
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showNotification('Please select a date from today onwards.', 'error');
            return;
        }
        
        // Process reservation
        await processReservation(data, this);
    });
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        if (!data.name || !data.email || !data.message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Process contact message
         await processContactMessage(data, this);
     });
}

// Process reservation with API
async function processReservation(data, form) {
    try {
        const submitBtn = form.querySelector('button[type="submit"]');
        showLoading(submitBtn);
        
        // Check availability first
        if (NetworkManager.isOnline) {
            const availability = await api.checkAvailability(data.date, data.time, data.guests);
            if (!availability.available) {
                showNotification('Sorry, no tables available for the selected date and time. Please choose a different time.', 'error');
                return;
            }
        }
        
        const reservationData = transformReservationForAPI(data);
        
        if (NetworkManager.isOnline) {
            const response = await api.createReservation(reservationData);
            showNotification(`Reservation confirmed! Confirmation ID: ${response.id}\nDate: ${data.date} at ${data.time} for ${data.guests} guests.`, 'success');
            form.reset();
        } else {
            // Store reservation offline
            const offlineReservations = JSON.parse(localStorage.getItem('offline_reservations') || '[]');
            offlineReservations.push({
                ...reservationData,
                timestamp: Date.now(),
                status: 'PENDING_SYNC'
            });
            localStorage.setItem('offline_reservations', JSON.stringify(offlineReservations));
            
            showNotification('Reservation saved offline. It will be processed when connection is restored.', 'warning');
            form.reset();
        }
        
    } catch (error) {
        console.error('Reservation failed:', error);
        handleAPIError(error);
    } finally {
        const submitBtn = form.querySelector('button[type="submit"]');
        hideLoading(submitBtn, 'Reserve Table');
    }
}

// Process contact message with API
async function processContactMessage(data, form) {
    try {
        const submitBtn = form.querySelector('button[type="submit"]');
        showLoading(submitBtn);
        
        if (NetworkManager.isOnline) {
            await api.sendContactMessage(data);
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            form.reset();
        } else {
            // Store message offline
            const offlineMessages = JSON.parse(localStorage.getItem('offline_messages') || '[]');
            offlineMessages.push({
                ...data,
                timestamp: Date.now(),
                status: 'PENDING_SYNC'
            });
            localStorage.setItem('offline_messages', JSON.stringify(offlineMessages));
            
            showNotification('Message saved offline. It will be sent when connection is restored.', 'warning');
            form.reset();
        }
        
    } catch (error) {
        console.error('Contact message failed:', error);
        handleAPIError(error);
    } finally {
        const submitBtn = form.querySelector('button[type="submit"]');
        hideLoading(submitBtn, 'Send Message');
    }
}

// Cart storage utilities
function saveCartToStorage() {
    localStorage.setItem('restaurant_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('restaurant_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

function clearCartFromStorage() {
    localStorage.removeItem('restaurant_cart');
}

// Customer info modal for checkout
function showCustomerInfoModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'customerInfoModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Customer Information</h3>
                <span class="close" onclick="closeCustomerInfoModal()">&times;</span>
            </div>
            <div class="modal-body">
                <form id="customerInfoForm">
                    <div class="form-group">
                        <label for="customerName">Full Name *</label>
                        <input type="text" id="customerName" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="customerEmail">Email *</label>
                        <input type="email" id="customerEmail" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="customerPhone">Phone Number *</label>
                        <input type="tel" id="customerPhone" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label for="orderType">Order Type</label>
                        <select id="orderType" name="orderType">
                            <option value="TAKEOUT">Takeout</option>
                            <option value="DELIVERY">Delivery</option>
                            <option value="DINE_IN">Dine In</option>
                        </select>
                    </div>
                    <div class="form-group" id="addressGroup" style="display: none;">
                        <label for="deliveryAddress">Delivery Address</label>
                        <textarea id="deliveryAddress" name="address" rows="3"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeCustomerInfoModal()">Cancel</button>
                <button class="btn btn-primary" onclick="submitCustomerInfo()">Place Order</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Show/hide address field based on order type
    document.getElementById('orderType').addEventListener('change', function() {
        const addressGroup = document.getElementById('addressGroup');
        if (this.value === 'DELIVERY') {
            addressGroup.style.display = 'block';
            document.getElementById('deliveryAddress').required = true;
        } else {
            addressGroup.style.display = 'none';
            document.getElementById('deliveryAddress').required = false;
        }
    });
}

function closeCustomerInfoModal() {
    const modal = document.getElementById('customerInfoModal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

function submitCustomerInfo() {
    const form = document.getElementById('customerInfoForm');
    const formData = new FormData(form);
    const customerInfo = Object.fromEntries(formData);
    
    // Validate required fields
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Validate delivery address if needed
    if (customerInfo.orderType === 'DELIVERY' && !customerInfo.address) {
        showNotification('Please provide a delivery address.', 'error');
        return;
    }
    
    closeCustomerInfoModal();
    processOrder(customerInfo);
}

// Loading and error state functions
function showLoadingState() {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = '<div style="text-align: center; grid-column: 1/-1; padding: 3rem;"><i class="fas fa-spinner fa-spin fa-2x"></i><p>Loading menu...</p></div>';
}

function hideLoadingState() {
    // Loading will be hidden when displayMenuItems is called
}

function showOfflineMessage() {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = '<div style="text-align: center; grid-column: 1/-1; padding: 3rem; color: #666;"><i class="fas fa-wifi fa-2x" style="opacity: 0.5;"></i><p>You are offline. Please check your connection.</p></div>';
}

function showErrorState() {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = '<div style="text-align: center; grid-column: 1/-1; padding: 3rem; color: #e74c3c;"><i class="fas fa-exclamation-triangle fa-2x"></i><p>Failed to load menu. Please try again later.</p></div>';
}

// Initialize cart from storage on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
});

// Set minimum date for reservation
function setMinDate() {
    const dateInput = document.getElementById('date');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    
    dateInput.min = `${year}-${month}-${day}`;
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.menu-item, .reservation-form, .contact-form');
    animateElements.forEach(el => observer.observe(el));
});