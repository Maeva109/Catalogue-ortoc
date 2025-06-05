// Helper function to format price (assuming it's not globally available)
function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
}

// Fonction pour générer le HTML d'une carte produit (original, for non-carousel use if any)
function createProductCard(product) {
    return `
        <li class="product-card" data-product-id="${product.id}">
            <img src="${product.images[0]}" alt="${product.name}">
            <div class="product-card-content">
                <h3>${product.name}</h3>
                <div class="product-card-actions">
                    <div class="product-price"><span>${formatPrice(product.price)}</span></div>
                    <button class="button add-to-cart-button" data-product-id="${product.id}">Ajouter au panier</button>
                    <a href="product-detail.html?id=${product.id}" class="view-more-link">Voir plus</a>
                </div>
            </div>
        </li>
    `;
}

// Function to create product card HTML for carousel
function createProductCardForCarousel(product) {
    return `
        <div class="product-card carousel-item" data-product-id="${product.id}">
          <div class="img-container">
            <img src="${product.images[0]}" alt="${product.name}">
            <button class="button add-to-cart-btn-carousel" data-product-id="${product.id}">+ Panier</button>
          </div>
          <div class="product-card-content">
            <h3>${product.name}</h3>
            <p><strong>${formatPrice(product.price)}</strong></p>
            <button class="button view-btn-carousel" data-product-id="${product.id}">Voir</button>
          </div>
        </div>
    `;
}

// Fonction pour afficher les produits (conditionally carousel or grid)
function displayProducts(products, subcategoryName = null) { // Added default null for subcategoryName
    const productsSection = document.querySelector('.products-section');
    if (!productsSection) return;

    productsSection.innerHTML = ''; // Clear previous content

    if (subcategoryName) { // Render Carousel
        const titleElement = document.createElement('h2');
        titleElement.className = 'subcategory-title';
        titleElement.textContent = subcategoryName;
        productsSection.appendChild(titleElement);

        if (!products || products.length === 0) {
            const noProductsMessage = document.createElement('p');
            noProductsMessage.textContent = 'Aucun produit trouvé dans cette catégorie.';
            productsSection.appendChild(noProductsMessage);
            return;
        }

        const carouselContainerHTML = `
            <div class="product-carousel-container">
                <button class="carousel-nav-btn prev-btn" aria-label="Previous products">&lt;</button>
                <div class="product-carousel">
                    <div class="carousel-track">
                        ${products.map(product => createProductCardForCarousel(product)).join('')}
                    </div>
                </div>
                <button class="carousel-nav-btn next-btn" aria-label="Next products">&gt;</button>
            </div>
        `;
        productsSection.insertAdjacentHTML('beforeend', carouselContainerHTML);

        // Carousel Navigation Logic
        const track = productsSection.querySelector('.carousel-track');
        const prevBtn = productsSection.querySelector('.prev-btn');
        const nextBtn = productsSection.querySelector('.next-btn');

        if (track && prevBtn && nextBtn) { // Ensure elements exist
            const cardWidth = 250 + 15; // card width + gap
            let currentScroll = 0;

            function updateNavButtons() {
                if (!track.parentElement) return; // Parent might not exist if section cleared rapidly
                prevBtn.disabled = currentScroll <= 0;
                nextBtn.disabled = currentScroll + track.parentElement.clientWidth >= track.scrollWidth;
            }

            prevBtn.addEventListener('click', () => {
                currentScroll = Math.max(0, currentScroll - cardWidth);
                track.style.transform = `translateX(-${currentScroll}px)`;
                updateNavButtons();
            });

            nextBtn.addEventListener('click', () => {
                 if (!track.parentElement) return;
                currentScroll = Math.min(currentScroll + cardWidth, track.scrollWidth - track.parentElement.clientWidth);
                track.style.transform = `translateX(-${currentScroll}px)`;
                updateNavButtons();
            });

            updateNavButtons(); // Initial button states
        }

        // Event listeners for new carousel buttons
        productsSection.querySelectorAll('.add-to-cart-btn-carousel').forEach(button => {
            button.addEventListener('click', function(event) {
                event.stopPropagation();
                const productId = this.getAttribute('data-product-id');
                addToCart(productId);
            });
        });

        productsSection.querySelectorAll('.view-btn-carousel').forEach(button => {
            button.addEventListener('click', function(event) {
                event.stopPropagation();
                const productId = this.getAttribute('data-product-id');
                window.location.href = `product-detail.html?id=${productId}`;
            });
        });

        productsSection.querySelectorAll('.product-card.carousel-item').forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('button')) {
                     const productId = this.getAttribute('data-product-id');
                     window.location.href = `product-detail.html?id=${productId}`;
                }
            });
        });

    } else { // Render Grid
        if (!products || products.length === 0) {
            productsSection.innerHTML = '<p>Aucun produit à afficher.</p>'; // Generic message for grid
            return;
        }
        const productList = document.createElement('ul');
        productList.className = 'product-list';

        // For grid, display all products passed (or a slice if defined elsewhere)
        products.forEach(product => {
            productList.innerHTML += createProductCard(product); // Use original card function
        });
        productsSection.appendChild(productList);

        // Add event listeners for original grid buttons
        productsSection.querySelectorAll('.add-to-cart-button').forEach(button => {
            button.addEventListener('click', function(event) {
                event.stopPropagation();
                const productId = this.getAttribute('data-product-id');
                addToCart(productId);
            });
        });

        productsSection.querySelectorAll('.product-card:not(.carousel-item)').forEach(card => {
             card.addEventListener('click', function(e) {
                 if (!e.target.closest('button') && !e.target.closest('.view-more-link')) {
                    const productId = this.getAttribute('data-product-id');
                    window.location.href = `product-detail.html?id=${productId}`;
                 }
            });
        });
         // Note: view-more-link is an <a> tag, its default behavior should work.
    }
}

// Fonction pour afficher les catégories et sous-catégories dans la sidebar
function initializeSidebar() {
    const categoryList = document.getElementById('category-list');
    if (!categoryList) return;

    categoryList.innerHTML = productsData.categories.map(category => {
        let subcategoriesHtml = '';
        let toggleIconHtml = '';
        if (category.subcategories && category.subcategories.length > 0) {
            toggleIconHtml = '<span class="toggle-icon">▶</span>';
            subcategoriesHtml = `<ul>${category.subcategories.map(sub => 
                `<li><a href="#" data-subcategory="${sub.id}">${sub.name}</a></li>`
            ).join('')}</ul>`;
        }
        return `
            <li>
                <a href="#" data-category="${category.id}" class="category-link">${toggleIconHtml}${category.name}</a>
                ${subcategoriesHtml}
            </li>
        `;
    }).join('');

    // Add event listeners to category links
    categoryList.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const categoryId = this.getAttribute('data-category');
            const parentLi = this.closest('li');
            const subList = parentLi.querySelector('ul');
            const toggleIcon = this.querySelector('.toggle-icon');

            // Toggle active class for category link visual feedback
            categoryList.querySelectorAll('.category-link').forEach(catLink => catLink.classList.remove('active'));
            this.classList.add('active');

            if (categoryId === 'all') {
                // Collapse all other categories
                categoryList.querySelectorAll('li.expanded').forEach(li => {
                    if (li !== parentLi) { // Check if it's not the 'Tous' li itself, though 'Tous' usually won't have subcategories to expand
                        li.classList.remove('expanded');
                        const icon = li.querySelector('.toggle-icon');
                        if (icon) icon.textContent = '▶';
                    }
                });

                const firstCategoryWithSubs = productsData.categories.find(cat => cat.subcategories && cat.subcategories.length > 0);
                if (firstCategoryWithSubs && firstCategoryWithSubs.subcategories && firstCategoryWithSubs.subcategories.length > 0) {
                    const productsToShow = firstCategoryWithSubs.subcategories[0].products.slice(0, 6); // Get some products
                    displayProducts(productsToShow, null); // Pass null for subcategoryName to trigger grid display
                } else {
                    // Fallback if no categories with subcategories exist, or display all products
                    const allProducts = productsData.categories.reduce((acc, category) => {
                        category.subcategories.forEach(sub => acc.push(...sub.products));
                        return acc;
                    }, []).slice(0,6); // Example: display first 6 of all products
                    displayProducts(allProducts, null);
                }
            } else { // For specific categories (not "Tous")
                const isCurrentlyExpanded = parentLi.classList.contains('expanded');

                // Collapse all other categories before toggling the current one
                categoryList.querySelectorAll('li.expanded').forEach(li => {
                    if (li !== parentLi) {
                        li.classList.remove('expanded');
                        const icon = li.querySelector('.toggle-icon');
                        if (icon) icon.textContent = '▶';
                    }
                });

                if (subList) { // If there are subcategories
                    if (isCurrentlyExpanded) {
                        parentLi.classList.remove('expanded');
                        if (toggleIcon) toggleIcon.textContent = '▶';
                    } else {
                        parentLi.classList.add('expanded');
                        if (toggleIcon) toggleIcon.textContent = '▼';
                        // Automatically click the first subcategory link
                        const firstSubcategoryLink = subList.querySelector('a');
                        if (firstSubcategoryLink) {
                            firstSubcategoryLink.click(); // This will trigger displayProducts with subcategoryName
                        } else {
                            // Category with an empty sublist, show its name as title but no products
                            displayProducts([], this.textContent.replace(/[▶▼]/g, '').trim());
                        }
                    }
                } else {
                    // Category without subcategories, display its products (if any) as a grid
                    // This case needs to be defined: what products to show?
                    // For now, let's assume categories without sublists don't directly show products on main page,
                    // or if they do, they need a product array associated directly with them.
                    // Displaying empty grid for now if no subList.
                    displayProducts([], null);
                }
            }
        });
    });

    // Add event listeners to subcategory links
    categoryList.querySelectorAll('li ul a').forEach(subLink => { // Changed variable name to avoid conflict
        subLink.addEventListener('click', function(event) { // Changed variable name to avoid conflict
            event.preventDefault();
            event.stopPropagation(); // Prevent category link click event from firing again
            const subcategoryId = this.getAttribute('data-subcategory');

            // Visual feedback for active subcategory
            categoryList.querySelectorAll('li ul a').forEach(sLink => sLink.classList.remove('active')); // Changed variable name
            this.classList.add('active');
            
            // Ensure parent category link also gets/keeps 'active' class
            const parentCategoryLink = this.closest('ul').closest('li').querySelector('.category-link');
            if (parentCategoryLink) {
                 categoryList.querySelectorAll('.category-link').forEach(catLink => catLink.classList.remove('active'));
                 parentCategoryLink.classList.add('active');
            }

            // Find the selected subcategory and display its products
            const category = productsData.categories.find(cat => cat.subcategories.some(sub => sub.id === subcategoryId));
            const subcategory = category ? category.subcategories.find(sub => sub.id === subcategoryId) : null;
            
            if (subcategory) {
                const subcategoryName = this.textContent; // Get subcategory name
                displayProducts(subcategory.products, subcategoryName); // Pass name to displayProducts
            } else {
                 displayProducts([], "Inconnue");
            }
        });
    });

    // Initially click on the "Tous" category to load default content
    const allCategoryLink = categoryList.querySelector('.category-link[data-category="all"]');
    if (allCategoryLink) {
        allCategoryLink.click();
    }
    // Subcategories are collapsed by default due to CSS (max-height: 0)

    // Update floating cart item count on page load and when cart changes
    updateFloatingCartIcon();
     window.addEventListener('cartUpdated', updateFloatingCartIcon);
}

// Function to update the floating cart icon (number of items)
function updateFloatingCartIcon() {
    const floatingCart = document.querySelector('.floating-cart');
    if (floatingCart) {
        const itemCount = getCartTotalItems();
        floatingCart.setAttribute('data-items', itemCount); // Use a data attribute for the count
        
        // Optional: Add a visual indicator if items are present
        if (itemCount > 0) {
             floatingCart.classList.add('has-items');
        } else {
             floatingCart.classList.remove('has-items');
        }
    }
}

// Function to navigate to the cart page
function navigateToCart() {
    window.location.href = 'cart.html';
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    // Initialize floating cart click listener
    const floatingCart = document.querySelector('.floating-cart');
    if(floatingCart) {
        floatingCart.addEventListener('click', navigateToCart);
    }

});

// Make findProductById globally accessible if it's in product-detail.js
// In a real project, this would be in a shared utility file.
// Assuming data.js is loaded before script.js and product-detail.js
// The findProductById function is needed by cart-logic.js
// Let's define a simple placeholder or ensure it's available.

// Placeholder findProductById - REPLACE with actual implementation or ensure data.js is loaded and it's available
// function findProductById(productId) {
//     for (const category of productsData.categories) {
//         if (category.subcategories) {
//             for (const subcategory of category.subcategories) {
//                 const foundProduct = subcategory.products.find(p => p.id === productId);
//                 if (foundProduct) {
//                     return foundProduct;
//                 }
//             }
//         }
//     }
//     return null;
// } 