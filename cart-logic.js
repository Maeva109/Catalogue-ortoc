// cart-logic.js

// Fonction pour formater le prix en FCFA
function formatPrice(price) {
    return `${price.toLocaleString()} FCFA`;
}

// Function to find a product by its ID
function findProductById(productId) {
    for (const category of productsData.categories) {
        if (category.subcategories) {
            for (const subcategory of category.subcategories) {
                const product = subcategory.products.find(prod => prod.id === productId);
                if (product) {
                    return product;
                }
            }
        }
    }
    return null;
}

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : {};
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Add a product to the cart
function addToCart(productId, quantity = 1) {
    const cart = getCart();
    if (cart[productId]) {
        cart[productId].quantity += quantity;
    } else {
        // We need product details to add to cart, fetch from productsData
        const product = findProductById(productId);
        if (product) {
            cart[productId] = {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity: quantity
            };
        } else {
            console.error('Product not found in data.js:', productId);
            return;
        }
    }
    saveCart(cart);
    console.log('Product added to cart:', productId, 'New cart:', cart);
    
    // Add visual feedback
    const floatingCart = document.querySelector('.floating-cart');
    if (floatingCart) {
        // Add bounce animation class
        floatingCart.classList.add('bounce');
        // Remove the class after animation completes
        setTimeout(() => {
            floatingCart.classList.remove('bounce');
        }, 500);
    }
    
    // Trigger event to update floating cart display
    window.dispatchEvent(new CustomEvent('cartUpdated'));
}

// Remove a product from the cart
function removeFromCart(productId) {
    const cart = getCart();
    if (cart[productId]) {
        delete cart[productId];
        saveCart(cart);
        console.log('Product removed from cart:', productId, 'New cart:', cart);
        // Optional: Trigger an event to update floating cart display
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
}

// Update quantity of a product
function updateQuantity(productId, quantity) {
    const cart = getCart();
    if (cart[productId]) {
        cart[productId].quantity = quantity;
        if (cart[productId].quantity <= 0) {
            removeFromCart(productId); // Remove if quantity is zero or less
        } else {
             saveCart(cart);
             console.log('Quantity updated for product:', productId, 'New quantity:', quantity, 'New cart:', cart);
             // Optional: Trigger an event to update floating cart display
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        }
    }
}

// Get total number of items in the cart
function getCartTotalItems() {
    const cart = getCart();
    let totalItems = 0;
    for (const productId in cart) {
        totalItems += cart[productId].quantity;
    }
    return totalItems;
}

// Get total amount of the cart
function getCartTotalAmount() {
     const cart = getCart();
    let totalAmount = 0;
    for (const productId in cart) {
        // Ensure price is a number before multiplication
        const price = typeof cart[productId].price === 'number' ? cart[productId].price : parseFloat(cart[productId].price);
        if (!isNaN(price)) {
            totalAmount += price * cart[productId].quantity;
        }
    }
    return totalAmount;
}

// Clear the entire cart
function clearCart() {
    localStorage.removeItem('shoppingCart');
     console.log('Cart cleared.');
     // Optional: Trigger an event to update floating cart display
    window.dispatchEvent(new CustomEvent('cartUpdated'));
}

// Note: findProductById is needed in this script. 
// It is currently defined in product-detail.js. 
// We might need to move it to a common utility file or ensure data.js is loaded before this script.
// For now, assuming data.js is loaded first and findProductById is accessible. 