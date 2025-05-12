
  const data = {
  "metadata": {
    "title": "Rivr.js Capabilities Demo",
    "version": "1.0.0",
    "description": "A comprehensive demonstration of rivr.js features and capabilities",
    "lastUpdated": "2025-05-12T12:00:00Z"
  },
  "showcase": [
    {
      "id": "data-binding",
      "title": "Simple Data Binding",
      "description": "Demonstrates basic text and attribute binding capabilities",
      "code": "class=\"_-title\"",
      "image": "binding.svg",
      "tags": ["basic", "binding", "text"]
    },
    {
      "id": "array-iteration",
      "title": "Array Iteration",
      "description": "Shows how to loop through arrays of data with the _-_ directive",
      "code": "class=\"items _-_\"",
      "image": "array.svg",
      "tags": ["arrays", "loops", "iteration"]
    },
    {
      "id": "nested-data",
      "title": "Nested Data Access",
      "description": "Accessing deeply nested JSON properties with path notation",
      "code": "class=\"_-user-profile-avatar\"",
      "image": "nested.svg",
      "tags": ["nested", "objects", "dot-notation"]
    },
    {
      "id": "transformers",
      "title": "Data Transformers",
      "description": "Format data using transformer functions before rendering",
      "code": "transformers: { 'price': value => '$' + value }",
      "image": "transform.svg",
      "tags": ["formatting", "functions", "processing"]
    }
  ],
  "examples": {
    "products": [
      {
        "id": "prod-001",
        "name": "Premium Bluetooth Headphones",
        "description": "Immersive sound with active noise cancellation for the ultimate listening experience",
        "price": 249.99,
        "discountedPrice": 199.99,
        "currency": "USD",
        "rating": 4.8,
        "reviewCount": 1243,
        "inStock": true,
        "categories": ["electronics", "audio", "wireless"],
        "images": {
          "thumbnail": "headphones-thumb.jpg",
          "gallery": ["headphones-1.jpg", "headphones-2.jpg", "headphones-3.jpg"],
          "featured": "headphones-featured.jpg"
        },
        "specs": {
          "brand": "SoundWave",
          "model": "ProAudio X1",
          "connectivity": "Bluetooth 5.2",
          "batteryLife": "30 hours",
          "color": "Midnight Black"
        },
        "variants": [
          { "id": "var-001", "color": "Midnight Black", "inStock": true },
          { "id": "var-002", "color": "Arctic White", "inStock": true },
          { "id": "var-003", "color": "Navy Blue", "inStock": false }
        ]
      },
      {
        "id": "prod-002",
        "name": "Smart Fitness Tracker",
        "description": "Track your health metrics and workouts with this advanced wearable device",
        "price": 179.95,
        "discountedPrice": 149.95,
        "currency": "USD",
        "rating": 4.6,
        "reviewCount": 856,
        "inStock": true,
        "categories": ["electronics", "fitness", "wearables"],
        "images": {
          "thumbnail": "tracker-thumb.jpg",
          "gallery": ["tracker-1.jpg", "tracker-2.jpg", "tracker-3.jpg"],
          "featured": "tracker-featured.jpg"
        },
        "specs": {
          "brand": "FitTech",
          "model": "Pulse Pro",
          "connectivity": "Bluetooth 5.0",
          "batteryLife": "7 days",
          "color": "Graphite"
        },
        "variants": [
          { "id": "var-004", "color": "Graphite", "inStock": true },
          { "id": "var-005", "color": "Rose Gold", "inStock": true },
          { "id": "var-006", "color": "Silver", "inStock": true }
        ]
      },
      {
        "id": "prod-003",
        "name": "Ultra-Thin Laptop",
        "description": "Powerful performance in an incredibly lightweight and portable design",
        "price": 1299.00,
        "discountedPrice": 1199.00,
        "currency": "USD",
        "rating": 4.9,
        "reviewCount": 2105,
        "inStock": false,
        "categories": ["electronics", "computers", "laptops"],
        "images": {
          "thumbnail": "laptop-thumb.jpg",
          "gallery": ["laptop-1.jpg", "laptop-2.jpg", "laptop-3.jpg"],
          "featured": "laptop-featured.jpg"
        },
        "specs": {
          "brand": "TechEdge",
          "model": "Slim X Pro",
          "processor": "Intel Core i7-1260P",
          "memory": "16GB",
          "storage": "512GB SSD",
          "display": "14-inch 4K OLED"
        },
        "variants": [
          { "id": "var-007", "memory": "16GB", "storage": "512GB", "inStock": false },
          { "id": "var-008", "memory": "16GB", "storage": "1TB", "inStock": false },
          { "id": "var-009", "memory": "32GB", "storage": "1TB", "inStock": false }
        ]
      }
    ],
    "users": [
      {
        "id": "user-001",
        "username": "techguru",
        "firstName": "Alex",
        "lastName": "Martinez",
        "email": "alex.martinez@example.com",
        "joined": "2023-06-15T10:30:00Z",
        "profile": {
          "avatar": "alex-avatar.jpg",
          "bio": "Tech enthusiast and gadget reviewer",
          "location": "San Francisco, CA",
          "social": {
            "twitter": "@techguru",
            "instagram": "@alexmartinez",
            "youtube": "TechWithAlex"
          }
        },
        "preferences": {
          "theme": "dark",
          "notifications": true,
          "newsletter": true
        },
        "recentActivity": [
          {
            "type": "review",
            "productId": "prod-001",
            "rating": 5,
            "comment": "The best headphones I've ever owned!",
            "date": "2025-04-28T14:20:00Z"
          },
          {
            "type": "purchase",
            "productId": "prod-002",
            "date": "2025-04-15T09:45:00Z"
          }
        ]
      },
      {
        "id": "user-002",
        "username": "fitnessfan",
        "firstName": "Sarah",
        "lastName": "Johnson",
        "email": "sarah.j@example.com",
        "joined": "2024-01-10T15:45:00Z",
        "profile": {
          "avatar": "sarah-avatar.jpg",
          "bio": "Fitness coach and wellness advocate",
          "location": "Denver, CO",
          "social": {
            "twitter": "@fitnesswithsarah",
            "instagram": "@sarahjfitness",
            "youtube": "FitWithSarah"
          }
        },
        "preferences": {
          "theme": "light",
          "notifications": true,
          "newsletter": true
        },
        "recentActivity": [
          {
            "type": "review",
            "productId": "prod-002",
            "rating": 4,
            "comment": "Great fitness tracker, very accurate!",
            "date": "2025-05-05T11:15:00Z"
          }
        ]
      }
    ],
    "blogPosts": [
      {
        "id": "post-001",
        "title": "Getting Started with Rivr.js",
        "slug": "getting-started-with-rivr-js",
        "author": "user-001",
        "publishDate": "2025-04-10T08:00:00Z",
        "lastUpdated": "2025-04-15T14:30:00Z",
        "excerpt": "Learn how to use the rivr.js framework to create dynamic data-driven websites with minimal code.",
        "content": "Rivr.js is a lightweight JavaScript framework that makes it easy to bind JSON data to your HTML elements. With a simple class-based syntax...",
        "categories": ["tutorials", "javascript", "frontend"],
        "tags": ["rivr.js", "data-binding", "tutorial", "beginner"],
        "featured": true,
        "featuredImage": "rivr-tutorial.jpg",
        "comments": [
          {
            "id": "comment-001",
            "userId": "user-002",
            "text": "This tutorial was incredibly helpful! I was able to implement rivr.js in my project right away.",
            "date": "2025-04-12T10:15:00Z"
          }
        ]
      },
      {
        "id": "post-002",
        "title": "Advanced Data Transformation with Rivr.js",
        "slug": "advanced-data-transformation-with-rivr-js",
        "author": "user-001",
        "publishDate": "2025-04-25T09:30:00Z",
        "lastUpdated": "2025-04-28T11:45:00Z",
        "excerpt": "Take your rivr.js skills to the next level with custom data transformers and event handling.",
        "content": "Once you've mastered the basics of rivr.js, you can leverage its powerful transformation capabilities to format and modify your data before rendering...",
        "categories": ["tutorials", "javascript", "frontend"],
        "tags": ["rivr.js", "advanced", "transformers", "events"],
        "featured": false,
        "featuredImage": "rivr-advanced.jpg",
        "comments": []
      }
    ],
    "stats": {
      "userCount": 15873,
      "activeUsers": 9452,
      "totalProducts": 1245,
      "totalOrders": 38721,
      "revenue": {
        "total": 2456789.50,
        "lastMonth": 185432.75,
        "lastWeek": 42567.30,
        "growth": {
          "monthly": 8.5,
          "yearly": 24.3
        }
      },
      "topCategories": [
        { "name": "Electronics", "count": 423, "percentage": 34 },
        { "name": "Clothing", "count": 287, "percentage": 23 },
        { "name": "Home & Kitchen", "count": 178, "percentage": 14 },
        { "name": "Books", "count": 156, "percentage": 13 },
        { "name": "Beauty", "count": 97, "percentage": 8 }
      ],
      "userActivity": {
        "daily": [120, 145, 132, 168, 172, 190, 178],
        "weekly": [950, 1020, 980, 1150, 1220],
        "monthly": [3850, 4120, 4350, 4560, 4780, 5120]
      }
    }
  },
  "ui": {
    "theme": {
      "primary": "#3a86ff",
      "secondary": "#ff006e",
      "success": "#38b000",
      "warning": "#ffbe0b",
      "danger": "#d90429",
      "light": "#f8f9fa",
      "dark": "#212529",
      "borderRadius": "8px"
    },
    "layouts": [
      { "id": "grid", "name": "Grid Layout", "class": "rivr-grid" },
      { "id": "list", "name": "List Layout", "class": "rivr-list" },
      { "id": "card", "name": "Card Layout", "class": "rivr-card" },
      { "id": "table", "name": "Table Layout", "class": "rivr-table" }
    ],
    "components": [
      { "id": "button", "name": "Button", "class": "rivr-btn" },
      { "id": "badge", "name": "Badge", "class": "rivr-badge" },
      { "id": "tag", "name": "Tag", "class": "rivr-tag" },
      { "id": "card", "name": "Card", "class": "rivr-card" }
    ]
  },
  "settings": {
    "apiEndpoint": "https://api.example.com/v1",
    "refreshInterval": 60000,
    "cacheExpiration": 3600,
    "defaultLayout": "grid",
    "itemsPerPage": 12,
    "debug": false,
    "features": {
      "darkMode": true,
      "responsiveDesign": true,
      "lazyLoading": true,
      "animations": true
    }
  }
};


document.addEventListener('DOMContentLoaded', function() {
  // Modify this to pass the products array directly
  rivr('.products', data.examples.products, {
    transformers: {
      'price': function(value, item) {
        return value ? '$' + value : '$' + item.listPrice;
      },
      'description': function(value) {
        return value.length > 100 ? value.substring(0, 97) + '...' : value;
      }
    },
    events: {
      'click': function(item, event, element) {
        if (event.target.classList.contains('rivr-btn')) {
          console.log('Added to cart:', item.name);
          event.preventDefault();
        }
      }
    }
  });
});
