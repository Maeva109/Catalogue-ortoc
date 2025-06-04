// cart.js

// Function to render the cart items on the page (Initial Cart View)
function renderCartItems() {
    const cartItemsBody = document.getElementById('cart-items-body');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartTotalAmountElement = document.getElementById('cart-total-amount');
    
    if (!cartItemsBody || !cartSubtotalElement || !cartTotalAmountElement) return; // Added null checks

    const cart = getCart();
    let itemsHtml = '';
    let subtotal = 0;
    
    if (Object.keys(cart).length === 0) {
        itemsHtml = '<tr><td colspan="5">Votre panier est vide.</td></tr>'; // colspan 5 to span all columns
        cartSubtotalElement.textContent = '';
        cartTotalAmountElement.textContent = '';
    } else {
        for (const productId in cart) {
            const item = cart[productId];
            // Find the full product details from data.js to get the latest price, image, etc.
            const product = findProductById(productId);

            if (product) {
                 const itemSubtotal = product.price * item.quantity;
                 subtotal += itemSubtotal;

                itemsHtml += `
                    <tr class="cart-item" data-product-id="${item.id}">
                        <td>
                            <button class="remove-item-button">&times;</button> <!-- Red cross button -->
                        </td>
                        <td>
                            <div class="cart-item-info">
                                <img src="${product.images[0]}" alt="${item.name}" class="cart-item-image">
                                <div>
                                    <h3>${item.name}</h3>
                                    <p>${product.description.substring(0, 50)}...</p> <!-- Display a short description -->
                                </div>
                            </div>
                        </td>
                        <td>${formatPrice(product.price)}</td>
                        <td>
                            <input type="number" class="quantity-selector" value="${item.quantity}" min="1" data-product-id="${item.id}">
                        </td>
                        <td>${formatPrice(itemSubtotal)}</td>
                    </tr>
                `;
            } else {
                 // Handle case where product data is missing (e.g., product removed from catalog)
                 itemsHtml += `
                    <tr class="cart-item" data-product-id="${item.id}">
                        <td>
                            <button class="remove-item-button">&times;</button>
                        </td>
                        <td colspan="4">
                            <div class="cart-item-info">
                                <h3>Produit inconnu (ID: ${item.id})</h3>
                                <p>Ce produit n'est plus disponible.</p>
                            </div>
                        </td>
                    </tr>
                 `;
            }
        }
        cartSubtotalElement.textContent = formatPrice(subtotal);
        // For now, Total is the same as Subtotal (delivery will be added later)
        cartTotalAmountElement.textContent = formatPrice(subtotal);
    }

    cartItemsBody.innerHTML = itemsHtml;

    // Add event listeners for quantity change and remove buttons AFTER rendering
    cartItemsBody.querySelectorAll('.quantity-selector').forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.getAttribute('data-product-id');
            const newQuantity = parseInt(this.value);
            if (!isNaN(newQuantity) && newQuantity > 0) {
                updateQuantity(productId, newQuantity);
                renderCartItems(); // Re-render the cart after update
                 updateOrderSummaryRecap(); // Also update the recap if in checkout view
            } else {
                // If quantity is invalid (e.g., 0 or less), revert to previous quantity or remove item
                // For now, let's re-render to show the previous valid quantity or empty cart state
                renderCartItems();
                 updateOrderSummaryRecap(); // Also update the recap
            }
        });
    });

    cartItemsBody.querySelectorAll('.remove-item-button').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.closest('.cart-item').getAttribute('data-product-id');
            removeFromCart(productId);
            renderCartItems(); // Re-render the cart after removal
            updateOrderSummaryRecap(); // Also update the recap
        });
    });
}

// Function to render delivery options in the checkout view
function renderDeliveryOptions() {
    const deliveryOptionsContainer = document.getElementById('checkout-delivery-options');
     if (!deliveryOptionsContainer) return; // Added null check

    // Example delivery options
    const options = [
        { id: 'home-delivery', name: 'Livraison par le magasin', cost: 1000, description: 'Ajouter 1000 FCFA au total' },
        { id: 'pickup-store', name: 'Retrait en boutique', cost: 0, description: 'Nom du magasin: Rotorcraft, Adresse: [Sample Address Here]' } // TODO: Add sample address
    ];

    deliveryOptionsContainer.innerHTML = options.map(option => `
        <div class="delivery-option" data-delivery-id="${option.id}">
            <input type="radio" id="${option.id}" name="delivery" value="${option.id}" ${option.cost === 0 ? 'checked' : ''}>
            <label for="${option.id}">
                 ${option.name} - ${option.cost === 0 ? 'Gratuit' : formatPrice(option.cost)}
            </label>
             <p class="delivery-description">${option.description}</p>
        </div>
    `).join('');

     // Add event listeners to delivery option radio buttons
    deliveryOptionsContainer.querySelectorAll('input[name="delivery"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Update the total when delivery option changes
            updateCartTotalWithDelivery();
        });
    });
}

// Function to render payment options (for checkout view - currently not detailed in user request)
function renderPaymentOptions() {
    const paymentOptionsContainer = document.getElementById('checkout-payment-options');
    if (!paymentOptionsContainer) return; // Added null check

    // Example payment options (Placeholder)
    const options = [
        { id: 'mobile-money', name: 'Mobile Money', instruction: 'Details will be provided later.' },
        { id: 'Orange-money', name: 'Orange Money', instruction: 'Details will be provided later.' },
        

        
        // Add other payment options as needed
    ];

    paymentOptionsContainer.innerHTML = options.map(option => `
        <div class="payment-option" data-payment-id="${option.id}">
            <input type="radio" id="${option.id}" name="payment" value="${option.id}" ${option.id === 'mobile-money' ? 'checked' : ''}>
            <label for="${option.id}">${option.name}</label>
             <p class="payment-instruction">${option.instruction}</p>
        </div>
    `).join('');

     // No event listeners needed for payment selection unless it affects the total or form fields
}

// Function to update the cart total including delivery cost
function updateCartTotalWithDelivery() {
    const cartSubtotal = getCartTotalAmount();
    const selectedDeliveryRadio = document.querySelector('input[name="delivery"]:checked');
    let deliveryCost = 0;

    if (selectedDeliveryRadio) {
        const selectedOptionId = selectedDeliveryRadio.value;
        // Find the cost of the selected delivery option
        const deliveryOptions = [
             { id: 'home-delivery', cost: 1000 },
             { id: 'pickup-store', cost: 0 }
        ]; // Keep this list updated with renderDeliveryOptions
        const selectedOption = deliveryOptions.find(option => option.id === selectedOptionId);
        if (selectedOption) {
            deliveryCost = selectedOption.cost;
        }
    }

    const totalAmount = cartSubtotal + deliveryCost;
    const cartTotalAmountElement = document.getElementById('cart-total-amount');
    if (cartTotalAmountElement) {
        // Update the total in the initial cart view (if visible)
        cartTotalAmountElement.textContent = formatPrice(totalAmount);
    }
     // Also update the total in the order summary recap if visible
     const orderSummaryTotalElement = document.querySelector('.order-summary-totals .cart-total-amount span:last-child');
      if(orderSummaryTotalElement) {
          orderSummaryTotalElement.textContent = formatPrice(totalAmount);
      }

     // Update the delivery cost display in the initial cart view
     const cartDeliveryInfoElement = document.querySelector('.cart-delivery-info');
      if(cartDeliveryInfoElement) {
          cartDeliveryInfoElement.innerHTML = `<span>Livraison</span><span>${formatPrice(deliveryCost)}</span>`;
      }

     // Update the delivery info in the order summary recap
     const orderSummaryDeliveryInfoElement = document.querySelector('.order-summary-totals .cart-delivery-info');
      if(orderSummaryDeliveryInfoElement) {
           const selectedOption = [
                { id: 'home-delivery', name: 'Livraison par le magasin', cost: 1000, description: 'Ajouter 1000 FCFA au total' },
                { id: 'pickup-store', name: 'Retrait en boutique', cost: 0, description: 'Nom du magasin: Rotorcraft, Adresse: [Sample Address Here]' } // TODO: Add sample address
           ].find(option => option.id === selectedOptionId);

           if(selectedOption) {
                orderSummaryDeliveryInfoElement.innerHTML = `
                     <span>Livraison (${selectedOption.name})</span>
                     <span>${formatPrice(deliveryCost)}</span>
                `;
                // You might also want to display the description here if needed in the recap
           } else {
               orderSummaryDeliveryInfoElement.innerHTML = '<span>Livraison</span><span>N/A</span>';
           }
      }
}

// Function to render the order summary recap in the checkout view
function renderOrderSummaryRecap() {
    const orderSummaryItemsElement = document.getElementById('order-summary-items');
    const orderSummaryTotalsElement = document.querySelector('.order-summary-totals');

     if (!orderSummaryItemsElement || !orderSummaryTotalsElement) return; // Added null checks

    const cart = getCart();
    let itemsHtml = '<h3>Récapitulatif de la commande</h3><ul>';
    let subtotal = 0;

    if (Object.keys(cart).length === 0) {
        itemsHtml += '<li>Votre panier est vide.</li>';
    } else {
        for (const productId in cart) {
            const item = cart[productId];
            const product = findProductById(productId);

            if (product) {
                 const itemSubtotal = product.price * item.quantity;
                 subtotal += itemSubtotal;
                itemsHtml += `
                    <li class="recap-item">
                        <div class="recap-item-info">
                            <img src="${product.images[0]}" alt="${item.name}" class="recap-item-image">
                            <span>${item.name} (x${item.quantity})</span>
                        </div>
                        <span>${formatPrice(itemSubtotal)}</span>
                    </li>
                `;
            } else {
                itemsHtml += `
                    <li class="recap-item">
                         <div class="recap-item-info">
                             <span>Produit inconnu (ID: ${item.id})</span>
                         </div>
                         <span>N/A</span>
                    </li>
                `;
            }
        }
    }
    itemsHtml += '</ul>';
    orderSummaryItemsElement.innerHTML = itemsHtml;

     // Render the totals recap (Subtotal, Delivery, Total)
     orderSummaryTotalsElement.innerHTML = `
         <div class="cart-subtotal">
             <span>Sous-total</span>
             <span>${formatPrice(subtotal)}</span>
         </div>
         <div class="cart-delivery-info">
             <!-- Delivery info will be updated by updateCartTotalWithDelivery -->
             <span>Livraison</span><span>N/A</span>
         </div>
         <div class="cart-total-amount">
             <span>Total</span>
             <span>${formatPrice(subtotal)}</span> <!-- Initial total is subtotal -->
         </div>
     `;

     // Ensure total and delivery info are updated based on selected delivery option
     updateCartTotalWithDelivery();
}

// Function to handle checkout button click
function handleCheckoutClick() {
    const cart = getCart();
    if (Object.keys(cart).length === 0) {
        alert('Votre panier est vide. Veuillez ajouter des produits avant de commander.');
        return;
    }

    // Hide initial cart view and show checkout view
    document.getElementById('initial-cart-view').style.display = 'none';
    document.getElementById('checkout-view').style.display = 'flex'; // Use flex to enable column layout

    // Render content for the checkout view
    renderDeliveryOptions();
    renderPaymentOptions(); // If you want to display payment options
    renderOrderSummaryRecap();

    // Optional: Scroll to the top of the checkout view
    document.getElementById('checkout-view').scrollIntoView({ behavior: 'smooth' });
}

// Function to handle form submission (Simulated order placement) - This now handles the final confirmation
function handleConfirmOrderSubmit(event) {
    event.preventDefault(); // Prevent actual form submission

    const form = document.getElementById('client-info-form'); // Get the client info form specifically
    const formData = new FormData(form);
    const clientInfo = Object.fromEntries(formData.entries());

    const cart = getCart();
    const totalAmount = parseFloat(document.querySelector('.order-summary-totals .cart-total-amount span:last-child').textContent.replace(/[^\d.,]/g, '').replace(',', '.')); // Get the final calculated total

     const selectedDeliveryRadio = document.querySelector('input[name="delivery"]:checked');
     let selectedDeliveryMethod = null;
     if(selectedDeliveryRadio) {
         selectedDeliveryMethod = selectedDeliveryRadio.value;
     }

    // --- Simulate Order Details ---
    const orderDetails = {
        clientInfo: clientInfo,
        cartItems: cart,
        totalAmount: totalAmount,
        deliveryMethod: selectedDeliveryMethod
    };

    console.log('--- Simulated Order Details (Confirmed) ---');
    console.log(orderDetails);

    // In a real application, you would send this data to a backend server
    // for processing (e.g., saving to database, sending email, payment gateway).

    // After simulated order placement, you might want to clear the cart
    // and show a thank you message.
    // clearCart(); // Uncomment to clear cart after simulated order
    // alert('Commande simulée avec succès! Détails dans la console.'); // Uncomment for user feedback

    // For this simulation, we'll just log and stay on the page.
     alert('Order confirmed! Details logged to console. (Simulated submission)');
    // Optionally, reset the form: form.reset();
    // Optionally, redirect to a thank you page: window.location.href = 'thank-you.html';
}

// Initialisation de la page du panier
document.addEventListener('DOMContentLoaded', () => {
    // Initial rendering of the cart view
    renderCartItems();

    // Add checkout button listener
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckoutClick);
    }

    // Add final confirm order button listener
    const confirmOrderButton = document.getElementById('confirm-order-button');
     if (confirmOrderButton) {
         // Note: We attach the listener to the button itself, not the form submission event here.
         // The form submission will be triggered by clicking this button if it's type='submit'
         // or we can explicitly call form.submit() in the handler if needed.
          confirmOrderButton.addEventListener('click', handleConfirmOrderSubmit); // Corrected listener
     }

     // Initialize floating cart (placeholder - on cart page, it might link back to itself or be hidden)
     // For simplicity, let's just add the click listener for navigation.
     const floatingCart = document.querySelector('.floating-cart');
     if(floatingCart) {
         floatingCart.addEventListener('click', () => {
             // Navigate back to index.html when clicked on cart page
             window.location.href = 'index.html';
         });
          // Optional: Update floating cart item count (requires getting data from cart-logic)
          // This would be better handled with an event listener on 'cartUpdated' custom event.
     }
});

// Optional: Add event listener for the custom 'cartUpdated' event to re-render cart on this page
window.addEventListener('cartUpdated', renderCartItems); 