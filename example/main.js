// Example usage
document.addEventListener('DOMContentLoaded', function() {
  // Basic usage with fetch
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      // Initialize with configuration
      initRivr('.products', data, {
        // Define transformers to format data
        transformers: {
          'price': function(value, item) {
            return value ? '$' + value : '$' + item.listPrice;
          },
          'description': function(value) {
            // Limit description to 100 characters
            return value.length > 100 ? value.substring(0, 97) + '...' : value;
          }
        },
        // Define event handlers
        events: {
          'click': function(item, event, element) {
            console.log('Clicked item:', item);
            // Add to cart or other functionality
            if (event.target.tagName === 'BUTTON') {
              addToCart(item.id);
            }
          }
        },
        // Callback after rendering
        onRender: function(container) {
          console.log('Products rendered successfully');
        }
      });
    })
    .catch(error => console.error('Error loading data:', error));
  
  // Alternative simplified loading method
  rivrLoad('.news-feed', 'news.json', {
    loadingTemplate: '<div class="spinner">Please wait...</div>',
    errorTemplate: '<div class="error">Failed to load news</div>',
    transformers: {
      'date': function(value) {
        return new Date(value).toLocaleDateString();
      }
    }
  });
  
  // Helper function for event example
  function addToCart(id) {
    console.log('Adding item to cart:', id);
    // Cart functionality would go here
  }
});
