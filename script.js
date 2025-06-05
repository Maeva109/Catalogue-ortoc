// Helper function to format price
function formatPrice(price) {
    // return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price); // Old
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(price); // New
}

// Fonction pour générer le HTML d'une carte produit (original, for grid use if any)
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

// Helper function to generate HTML for a single product cell (td)
function createProductTableCell(product) {
    const description = product.description ? product.description.substring(0, 50) + '...' : 'Description non disponible.';
    return `
        <td class="product-table-cell">
            <div class="product-name"><strong>${product.name}</strong></div>
            <div class="short-desc"><em>${description}</em></div>
            <div class="product-price-display">
                <strong>${formatPrice(product.price)}</strong>
                <span class="heart-icon">♡</span>
            </div>
            <div class="rating-container">
                <span class="star-rating">★★★★☆</span>
                <span class="review-count">(25 avis)</span>
            </div>
        </td>
    `;
}

// Function to generate HTML for the product table grid
function createProductTableGrid(categoriesData) {
    let gridHtml = '<div class="product-grid">';

    categoriesData.forEach(category => {
        if (category.subcategories && category.subcategories.length > 0) {
            category.subcategories.forEach(subcategory => {
                if (subcategory.products && subcategory.products.length > 0) {
                    gridHtml += `<h3>${subcategory.name}</h3>`;
                    gridHtml += '<table><tbody>';

                    for (let i = 0; i < subcategory.products.length; i += 4) {
                        gridHtml += '<tr>';
                        for (let j = 0; j < 4; j++) {
                            if (i + j < subcategory.products.length) {
                                gridHtml += createProductTableCell(subcategory.products[i + j]);
                            } else {
                                // gridHtml += '<td></td>'; // Empty cell if fewer than 4 products in the last row chunk
                            }
                        }
                        gridHtml += '</tr>';
                    }
                    gridHtml += '</tbody></table>';
                }
            });
        }
    });

    gridHtml += '</div>';
    return gridHtml;
}


// Fonction pour afficher les produits (conditionally carousel or grid)
function displayProducts(products, subcategoryName = null) {
    const productsSection = document.querySelector('.products-section');
    if (!productsSection) return;

    productsSection.innerHTML = ''; // Clear previous content

    if (subcategoryName) { // Render Carousel for a specific subcategory
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

        // Carousel Navigation Logic (Ensure elements exist before adding listeners)
        const track = productsSection.querySelector('.carousel-track');
        const prevBtn = productsSection.querySelector('.prev-btn');
        const nextBtn = productsSection.querySelector('.next-btn');

        if (track && prevBtn && nextBtn) {
            const cardWidth = 250 + 15; // card width + gap
            let currentScroll = 0;

            function updateNavButtons() {
                if (!track.parentElement) return;
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

    } else { // Render Table Grid (for "Tous" or general view without specific subcategory)
        // The 'products' argument is ignored here; we use global productsData for the full grid.
        productsSection.innerHTML = createProductTableGrid(productsData.categories);
        applyGridCellHoverEffects(); // Call the function here
        // TODO: Add event listeners for elements within the table grid if needed (e.g., heart icons)
    }
}

function applyGridCellHoverEffects() {
    const gridCells = document.querySelectorAll('.product-grid td');
    gridCells.forEach(cell => {
        cell.addEventListener('mouseover', () => {
            cell.style.transition = 'transform 0.2s ease-out, box-shadow 0.2s ease-out';
            cell.style.transform = 'scale(1.02)';
            cell.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            cell.style.zIndex = '10';
            cell.style.position = 'relative';
        });
        cell.addEventListener('mouseout', () => {
            cell.style.transform = '';
            cell.style.boxShadow = '';
            cell.style.zIndex = '';
            // cell.style.position = ''; // Only remove if it wasn't relative before, or set to initial
        });
    });
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

                // Collapse all other categories
                categoryList.querySelectorAll('li.expanded').forEach(li => {
                    // Do not collapse 'Tous' if it were expandable, but it's not in this design.
                    // For now, 'Tous' click means collapsing all actual categories.
                    li.classList.remove('expanded');
                    const icon = li.querySelector('.toggle-icon');
                    if (icon) icon.textContent = '▶';
                });
                displayProducts(null, null); // Signal to display the full table grid for "Tous"
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