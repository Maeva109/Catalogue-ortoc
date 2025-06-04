// Fonction pour formater le prix en FCFA
function formatPrice(price) {
    return `${price.toLocaleString()} FCFA`;
}

// Fonction pour trouver un produit par son ID dans les données
function findProductById(productId) {
    for (const category of productsData.categories) {
        if (category.subcategories) { // Added null check for subcategories
            for (const subcategory of category.subcategories) {
                const product = subcategory.products.find(prod => prod.id === productId);
                if (product) {
                    return product;
                }
            }
        }
    }
    return null; // Product not found
}

// Fonction pour afficher les détails du produit
function displayProductDetails(product) {
    const detailContainer = document.getElementById('product-detail-container');
    if (!detailContainer) return;

    detailContainer.innerHTML = `
        <div class="product-images">
            <div class="product-main-image">
                <img src="${product.images[0]}" alt="${product.name}">
            </div>
            <div class="product-thumbnails">
                ${product.images.map((imgSrc, index) => 
                    `<img src="${imgSrc}" alt="${product.name} thumbnail ${index + 1}" data-index="${index}">`
                ).join('')}
            </div>
        </div>
        <div class="product-info-details">
            <h2>${product.name}</h2>
            <p class="price">${formatPrice(product.price)}</p>
            <p class="description">${product.description}</p>
            
            <div class="product-varieties-details">
                <h3>Variétés disponibles:</h3>
                ${product.varieties.map(variety => `
                    <div class="variety-item-detail">
                        <p>${variety.name} - ${formatPrice(variety.price)}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="product-actions-details">
                <button class="button add-to-cart-button" data-product-id="${product.id}">Ajouter au panier</button>
                <button class="button order-button" data-product-id="${product.id}">Commander</button>
            </div>
        </div>
    `;

    // Add event listeners to thumbnails (basic image switching)
    const mainImage = detailContainer.querySelector('.product-main-image img');
    detailContainer.querySelectorAll('.product-thumbnails img').forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            mainImage.src = this.src;
        });
    });

    // Add event listener to the "Ajouter au panier" button
    const addToCartButton = detailContainer.querySelector('.add-to-cart-button');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            addToCart(productId);
            
            // Visual feedback on the button itself
            this.classList.add('added');
            setTimeout(() => {
                this.classList.remove('added');
            }, 1000);
        });
    }

     // Add event listener to the "Commander" button (placeholder action)
    const orderButton = detailContainer.querySelector('.order-button');
    if (orderButton) {
        orderButton.addEventListener('click', function() {
             const productId = this.getAttribute('data-product-id');
             orderProduct(productId); // Call orderProduct (placeholder)
        });
    }
}

// Fonction pour afficher les produits similaires (Placeholder : affiche les 4 premiers produits d'une autre sous-catégorie)
function displaySimilarProducts(currentProductId) {
    const similarProductsContainer = document.querySelector('.similar-products-list');
    if (!similarProductsContainer) return;

    // Find a subcategory different from the current product's subcategory
    let similarSubcategory = null;
    outerLoop: for (const category of productsData.categories) {
         if (category.subcategories) { // Added null check
            for (const subcategory of category.subcategories) {
                if (!subcategory.products.some(prod => prod.id === currentProductId)) {
                     similarSubcategory = subcategory;
                     break outerLoop;
                }
            }
         }
    }

    if (similarSubcategory) {
        // Reuse createProductCard logic or generate similar card HTML
         similarProductsContainer.innerHTML = similarSubcategory.products.slice(0, 4).map(product => 
             // Using the same card structure as index.html for consistency
             `<div class="product-card">
                <img src="${product.images[0]}" alt="${product.name}">
                 <div class="product-card-content">
                     <h3>${product.name}</h3>
                     <div class="product-card-actions">
                         <div class="product-price"><span>${formatPrice(product.price)}</span></div>
                         <a href="product-detail.html?id=${product.id}" class="view-more-link">Voir plus</a>
                     </div>
                 </div>
             </div>`
         ).join('');

        // Add event listeners to the "Voir plus" links on similar products cards
         similarProductsContainer.querySelectorAll('.view-more-link').forEach(link => {
             link.addEventListener('click', function(event) {
                 event.preventDefault(); // Prevent default link behavior
                 window.location.href = this.href; // Navigate programmatically
             });
         });
    } else {
        similarProductsContainer.innerHTML = '<p>Aucun produit similaire trouvé.</p>';
    }

}

// Fonction pour ajouter au panier - REMOVED PLACEHOLDER, using the one from cart-logic.js
// function addToCart(productId) { ... }

// Fonction pour commander (Placeholder)
function orderProduct(productId) {
     alert('Fonctionnalité Commander le produit ' + productId + ' à implémenter.');
    // TODO: Add logic for placing an order (e.g., redirect to checkout or form with pre-filled data)
}

// Function to update the floating cart icon (number of items) - Copied from script.js for consistency
function updateFloatingCartIcon() {
    const floatingCart = document.querySelector('.floating-cart');
    if (floatingCart) {
        const itemCount = getCartTotalItems(); // getCartTotalItems is from cart-logic.js
        floatingCart.setAttribute('data-items', itemCount); // Use a data attribute for the count
        
        // Optional: Add a visual indicator if items are present
        if (itemCount > 0) {
             floatingCart.classList.add('has-items');
        } else {
             floatingCart.classList.remove('has-items');
        }
    }
}

// Function to navigate to the cart page - Copied from script.js for consistency
function navigateToCart() {
    window.location.href = 'cart.html';
}

// Initialisation de la page de détails
document.addEventListener('DOMContentLoaded', () => {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        const product = findProductById(productId);
        if (product) {
            displayProductDetails(product);
            displaySimilarProducts(productId); // Display similar products
        } else {
            // Display a message if product is not found
            const detailContainer = document.getElementById('product-detail-container');
            if(detailContainer) {
                 detailContainer.innerHTML = '<p>Produit non trouvé.</p>';
            }
             const similarProductsSectionTitle = document.querySelector('.similar-products-section h2');
             if(similarProductsSectionTitle) similarProductsSectionTitle.style.display = 'none'; // Hide similar products section
        }
    } else {
        // Display a message if no product ID is in the URL
         const detailContainer = document.getElementById('product-detail-container');
        if(detailContainer) {
             detailContainer.innerHTML = '<p>Aucun produit spécifié.</p>';
        }
         const similarProductsSectionTitle = document.querySelector('.similar-products-section h2');
         if(similarProductsSectionTitle) similarProductsSectionTitle.style.display = 'none'; // Hide similar products section
    }

     // Initialize floating cart click listener
    const floatingCart = document.querySelector('.floating-cart');
    if(floatingCart) {
        floatingCart.addEventListener('click', navigateToCart);
        // Update floating cart item count on page load and when cart changes
        updateFloatingCartIcon();
        window.addEventListener('cartUpdated', updateFloatingCartIcon);
    }
});

// Note: formatPrice and findProductById are defined here. 
// In a larger project, consider moving shared functions to a separate utility file 
// to avoid duplication and ensure consistency across scripts. 
// cart-logic.js also uses findProductById and expects it to be available. 