// Sample Product Data
const products = [
    {
        id: 1,
        name: "Classic White Shirt",
        category: "men",
        price: 1299,
        image: "👕",
        sizes: ["S", "M", "L", "XL"],
        badge: "Trending",
        description: "Premium cotton shirt with modern fit"
    },
    {
        id: 2,
        name: "Denim Jacket",
        category: "men",
        price: 2499,
        image: "🧥",
        sizes: ["M", "L", "XL"],
        badge: "New",
        description: "Stylish denim jacket for casual wear"
    },
    {
        id: 3,
        name: "Floral Summer Dress",
        category: "women",
        price: 1899,
        image: "👗",
        sizes: ["S", "M", "L"],
        badge: "Trending",
        description: "Elegant floral dress perfect for summer"
    },
    {
        id: 4,
        name: "Silk Saree",
        category: "women",
        price: 3999,
        image: "🥻",
        sizes: ["One Size"],
        badge: "Premium",
        description: "Traditional silk saree with modern touch"
    },
    {
        id: 5,
        name: "Leather Handbag",
        category: "accessories",
        price: 2199,
        image: "👜",
        sizes: ["One Size"],
        badge: "New",
        description: "Premium leather handbag with multiple compartments"
    },
    {
        id: 6,
        name: "Designer Sunglasses",
        category: "accessories",
        price: 899,
        image: "🕶️",
        sizes: ["One Size"],
        badge: "Hot",
        description: "UV protection designer sunglasses"
    },
    {
        id: 7,
        name: "Casual Jeans",
        category: "men",
        price: 1599,
        image: "👖",
        sizes: ["30", "32", "34", "36"],
        badge: "Trending",
        description: "Comfortable stretch denim jeans"
    },
    {
        id: 8,
        name: "Party Gown",
        category: "women",
        price: 4499,
        image: "👗",
        sizes: ["S", "M", "L"],
        badge: "Premium",
        description: "Elegant evening gown for special occasions"
    },
    {
        id: 9,
        name: "Sneakers",
        category: "accessories",
        price: 2799,
        image: "👟",
        sizes: ["7", "8", "9", "10"],
        badge: "New",
        description: "Comfortable and stylish sneakers"
    },
    {
        id: 10,
        name: "Formal Blazer",
        category: "men",
        price: 3499,
        image: "🥋",
        sizes: ["M", "L", "XL"],
        badge: "Premium",
        description: "Professional blazer for formal occasions"
    },
    {
        id: 11,
        name: "Casual Top",
        category: "women",
        price: 999,
        image: "👚",
        sizes: ["S", "M", "L", "XL"],
        badge: "Trending",
        description: "Comfortable casual top for everyday wear"
    },
    {
        id: 12,
        name: "Watch",
        category: "accessories",
        price: 1899,
        image: "⌚",
        sizes: ["One Size"],
        badge: "Hot",
        description: "Stylish watch with leather strap"
    }
];

// Cart state
let cart = JSON.parse(localStorage.getItem('instaFashionCart')) || [];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderProducts(products);
    updateCartUI();
    initializeEventListeners();
});

// Render products to the grid
function renderProducts(productsToRender) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);
    
    card.innerHTML = `
        <div class="product-image">
            <span style="font-size: 5rem;">${product.image}</span>
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        </div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h4 class="product-name">${product.name}</h4>
            <div class="product-price">₹${product.price}</div>
            <div class="product-actions">
                <button class="btn-add-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;

    // Add click event to open modal (except on button)
    card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('btn-add-cart')) {
            openProductModal(product);
        }
    });

    return card;
}

// Add product to cart
function addToCart(productId, selectedSize = null) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // If product has multiple sizes and no size selected, show modal
    if (product.sizes.length > 1 && !selectedSize) {
        openProductModal(product);
        return;
    }

    const size = selectedSize || product.sizes[0];
    
    // Check if product with same size already exists in cart
    const existingItem = cart.find(item => item.id === productId && item.size === size);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            size: size,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showNotification('Added to cart!');
}

// Remove product from cart
function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    saveCart();
    updateCartUI();
}

// Update cart quantity
function updateCartQuantity(productId, size, change) {
    const item = cart.find(item => item.id === productId && item.size === size);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId, size);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('instaFashionCart', JSON.stringify(cart));
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty 🛍️</p>
                <p class="empty-cart-subtitle">Start shopping to add items!</p>
            </div>
        `;
        cartTotal.textContent = '₹0';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <span style="font-size: 2.5rem;">${item.image}</span>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price} • Size: ${item.size}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, '${item.size}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, '${item.size}', 1)">+</button>
                        <button class="quantity-btn" onclick="removeFromCart(${item.id}, '${item.size}')" style="margin-left: auto; color: var(--accent-color);">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `₹${total}`;
    }
}

// Open product modal
function openProductModal(product) {
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image">
                <span style="font-size: 10rem;">${product.image}</span>
            </div>
            <div class="product-detail-info">
                <div class="product-category">${product.category.toUpperCase()}</div>
                <h2>${product.name}</h2>
                <div class="product-detail-price">₹${product.price}</div>
                <p>${product.description}</p>
                
                <div class="size-selector">
                    <h4>Select Size</h4>
                    <div class="size-options" id="sizeOptions">
                        ${product.sizes.map(size => `
                            <button class="size-option" data-size="${size}">${size}</button>
                        `).join('')}
                    </div>
                </div>

                <div class="delivery-info">
                    <p>⚡ <strong>30-minute delivery</strong> in Raipur</p>
                    <p>🔒 Secure payment options</p>
                    <p>↩️ Easy returns within 7 days</p>
                </div>

                <button class="btn btn-primary btn-block" id="modalAddToCart">
                    Add to Cart
                </button>
            </div>
        </div>
    `;

    modal.classList.add('active');

    // Size selection
    let selectedSize = product.sizes[0];
    const sizeOptions = modalBody.querySelectorAll('.size-option');
    sizeOptions[0].classList.add('active');

    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            selectedSize = this.getAttribute('data-size');
        });
    });

    // Add to cart from modal
    modalBody.querySelector('#modalAddToCart').addEventListener('click', function() {
        addToCart(product.id, selectedSize);
        closeModal();
    });
}

// Close modal
function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
}

// Filter products
function filterProducts(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    renderProducts(filteredProducts);

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === category) {
            btn.classList.add('active');
        }
    });
}

// Scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize event listeners
function initializeEventListeners() {
    // Cart button
    document.getElementById('cartBtn').addEventListener('click', function() {
        document.getElementById('cartDrawer').classList.add('active');
    });

    // Close cart
    document.getElementById('closeCart').addEventListener('click', function() {
        document.getElementById('cartDrawer').classList.remove('active');
    });

    // Close modal
    document.getElementById('closeModal').addEventListener('click', closeModal);

    // Close modal on background click
    document.getElementById('productModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterProducts(filter);
        });
    });

    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            scrollToSection('catalog');
            setTimeout(() => filterProducts(category), 500);
        });
    });

    // Checkout button
    document.getElementById('checkoutBtn').addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        showNotification('Checkout feature coming soon! 🚀');
    });

    // Mobile menu toggle
    document.getElementById('mobileMenuBtn').addEventListener('click', function() {
        const navMenu = document.getElementById('navMenu');
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });

    // Search button
    document.getElementById('searchBtn').addEventListener('click', function() {
        showNotification('Search feature coming soon! 🔍');
    });

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                const sectionId = href.substring(1);
                scrollToSection(sectionId);
            }

            // Update active link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
