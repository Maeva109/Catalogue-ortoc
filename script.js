// Fonction pour générer le HTML d'une carte produit
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

// Fonction pour afficher les produits d'une sous-catégorie
function displayProducts(products) {
    const productsSection = document.querySelector('.products-section');
    if (!productsSection) return; // Added null check

    const productList = document.createElement('ul');
    productList.className = 'product-list';
    
    // Limit to 6 products for display on the main page, if more exist
    const productsToDisplay = products.slice(0, 6);

    if (productsToDisplay.length === 0) {
        productsSection.innerHTML = '<p>Aucun produit trouvé dans cette catégorie.</p>';
    } else {
         productsToDisplay.forEach(product => {
            productList.innerHTML += createProductCard(product);
        });
        productsSection.innerHTML = ''; // Clear previous products
        productsSection.appendChild(productList);
    }

    // Add event listeners to the new "Ajouter au panier" buttons
    productsSection.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', function(event) {
            console.log('Add to cart button clicked'); // Added console log
            event.stopPropagation(); // Prevent click on card from firing
            const productId = this.getAttribute('data-product-id');
            addToCart(productId); // Call addToCart from cart-logic.js
        });
    });

    // Add event listener to product cards for "Voir plus" redirection
    productsSection.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
             const productId = this.getAttribute('data-product-id');
             window.location.href = `product-detail.html?id=${productId}`;
        });
    });
}

// Fonction pour afficher les catégories et sous-catégories dans la sidebar
function initializeSidebar() {
    const categoryList = document.getElementById('category-list');
    if (!categoryList) return; // Added null check

    categoryList.innerHTML = productsData.categories.map(category => {
        let subcategoriesHtml = '';
        if (category.subcategories && category.subcategories.length > 0) {
            subcategoriesHtml = `<ul>${category.subcategories.map(sub => 
                `<li><a href="#" data-subcategory="${sub.id}">${sub.name}</a></li>`
            ).join('')}</ul>`;
        }
        return `
            <li>
                <a href="#" data-category="${category.id}" class="category-link">${category.name}</a>
                ${subcategoriesHtml}
            </li>
        `;
    }).join('');

    // Add event listeners to category links
    categoryList.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const categoryId = this.getAttribute('data-category');

            // Toggle active class for visual feedback
            categoryList.querySelectorAll('.category-link').forEach(catLink => catLink.classList.remove('active'));
            this.classList.add('active');

            // For "Tous" category, display products from the first subcategory of the first category with subcategories
            if(categoryId === 'all') {
                 const firstCategoryWithSubs = productsData.categories.find(cat => cat.subcategories && cat.subcategories.length > 0);
                 if (firstCategoryWithSubs && firstCategoryWithSubs.subcategories.length > 0) {
                      // Find the first subcategory link and trigger its click
                      const firstSubcategoryLink = categoryList.querySelector(`[data-subcategory="${firstCategoryWithSubs.subcategories[0].id}"]`);
                      if(firstSubcategoryLink) {
                           firstSubcategoryLink.click();
                      }
                 } else {
                      displayProducts([]); // No products if no categories with subcategories
                 }
                 // Hide all subcategory lists except for the active category (if any)
                 categoryList.querySelectorAll('li ul').forEach(ul => ul.style.display = 'none'); // Select nested ULs specifically
                  const activeCategoryLi = this.closest('li');
                  if(activeCategoryLi) {
                      const subList = activeCategoryLi.querySelector('ul');
                      if(subList) subList.style.display = 'block';
                  }

            } else {
                 // Find the selected category
                const selectedCategory = productsData.categories.find(cat => cat.id === categoryId);

                // Hide all subcategory lists
                categoryList.querySelectorAll('li ul').forEach(ul => ul.style.display = 'none'); // Select nested ULs specifically

                // Show the subcategory list for the clicked category
                if (selectedCategory && selectedCategory.subcategories && selectedCategory.subcategories.length > 0) {
                    const subList = this.nextElementSibling; // The ul element after the a link
                    if (subList && subList.tagName === 'UL') {
                        subList.style.display = 'block';

                        // Automatically click the first subcategory link to display its products
                        const firstSubcategoryLink = subList.querySelector('a');
                        if (firstSubcategoryLink) {
                            firstSubcategoryLink.click();
                        } else {
                            displayProducts([]); // Clear products if category has no subcategories
                        }
                    }
                } else {
                    displayProducts([]); // Clear products if category has no subcategories
                }
            }
        });
    });

    // Add event listeners to subcategory links
    categoryList.querySelectorAll('li ul a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const subcategoryId = this.getAttribute('data-subcategory');

            // Toggle active class for visual feedback on subcategories
            categoryList.querySelectorAll('li ul a').forEach(subLink => subLink.classList.remove('active'));
            this.classList.add('active');
            
            // Find the selected subcategory and display its products
            const category = productsData.categories.find(cat => cat.subcategories.some(sub => sub.id === subcategoryId));
            const subcategory = category ? category.subcategories.find(sub => sub.id === subcategoryId) : null;
            
            if (subcategory) {
                displayProducts(subcategory.products);
            } else {
                 displayProducts([]); // Clear products if subcategory not found
            }
        });
    });

    // Initially click on the first category ("Tous") to load content
    const firstCategoryLink = categoryList.querySelector('.category-link[data-category="all"]');
     if(firstCategoryLink) {
         firstCategoryLink.click();
     }

     // Hide all subcategory lists initially
     categoryList.querySelectorAll('li ul').forEach(ul => ul.style.display = 'none'); // Select nested ULs specifically

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