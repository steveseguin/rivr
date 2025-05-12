// main.js - replace with this updated version
document.addEventListener('DOMContentLoaded', function() {
    // Load JSON data from URL or use embedded data
    rivr.loadJSON('products.json')
        .then(data => {
            // Define transformers for data formatting
            const options = {
                errorHandling: true,
                addDataAttributes: true,
                externalLinks: true,
                transformers: {
                    price: (value, item) => {
                        // Format price or use listPrice if price is empty
                        const priceToUse = value || item.listPrice;
                        return priceToUse ? `$${priceToUse}` : 'Price not available';
                    },
                    name: (value) => {
                        // Truncate long names
                        return value.length > 40 ? value.substring(0, 37) + '...' : value;
                    }
                },
                // Add event handlers
                events: {
                    item: {
                        click: (item) => {
                            console.log('Selected product:', item.name);
                            // Highlight selected product
                            document.querySelectorAll('.product').forEach(p => 
                                p.classList.remove('selected'));
                            event.currentTarget.classList.add('selected');
                        }
                    }
                },
                // Map additional attributes
                attributeMap: {
                    name: {
                        'data-brand': 'brandName',
                        'title': 'name'
                    }
                }
            };

            // Filter products if needed
            // options.filter = item => parseFloat(item.listPrice) < 80;

            // Render the products
            rivr(data, document.querySelector('.products'), options);
            
            // Setup search functionality
            const searchInput = document.getElementById('product-search');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const filteredData = searchTerm ? 
                        data.filter(item => 
                            item.name.toLowerCase().includes(searchTerm) || 
                            item.description.toLowerCase().includes(searchTerm)
                        ) : data;
                    
                    // Re-render with filtered data
                    const productsContainer = document.querySelector('.products');
                    const template = productsContainer.cloneNode(true);
                    rivr(filteredData, template, options);
                    productsContainer.innerHTML = template.innerHTML;
                });
            }
            
            // Setup sorting
            const sortSelect = document.getElementById('product-sort');
            if (sortSelect) {
                sortSelect.addEventListener('change', (e) => {
                    const sortBy = e.target.value;
                    let sortedData = [...data];
                    
                    switch(sortBy) {
                        case 'price-asc':
                            sortedData.sort((a, b) => 
                                parseFloat(a.listPrice || 0) - parseFloat(b.listPrice || 0));
                            break;
                        case 'price-desc':
                            sortedData.sort((a, b) => 
                                parseFloat(b.listPrice || 0) - parseFloat(a.listPrice || 0));
                            break;
                        case 'name':
                            sortedData.sort((a, b) => a.name.localeCompare(b.name));
                            break;
                    }
                    
                    // Re-render with sorted data
                    const productsContainer = document.querySelector('.products');
                    const template = productsContainer.cloneNode(true);
                    rivr(sortedData, template, options);
                    productsContainer.innerHTML = template.innerHTML;
                });
            }
            
            // Make products visible
            document.querySelector('.products').style.display = 'grid';
        })
        .catch(error => {
            console.error('Failed to load products:', error);
            document.querySelector('.error-message').textContent = 
                'Unable to load products. Please try again later.';
        });
});
