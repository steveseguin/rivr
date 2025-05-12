# 🌊 rivr.js

<div align="center">
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Version](https://img.shields.io/badge/version-0.4.0-brightgreen.svg)](https://github.com/yourusername/rivr)
[![Size](https://img.shields.io/badge/size-5.2%20kB%20minified-blue.svg)](https://github.com/yourusername/rivr)

**A streamlined micro-framework for data-driven web applications**

[Demo](https://github.com/yourusername/rivr) • [Documentation](https://github.com/yourusername/rivr) • [Examples](https://github.com/yourusername/rivr)

</div>

---

## 🔍 What is rivr.js?

Rivr is a lightweight, dependency-free JavaScript framework for transforming JSON data into dynamic HTML content. It allows you to create data-driven websites without the complexity of larger frameworks, using intuitive class-based directives that map your data directly to your DOM elements.

```javascript
// Turn this JSON...
[
  { "name": "Product One", "price": "$49.99", "inStock": true },
  { "name": "Product Two", "price": "$39.99", "inStock": false }
]

// Into this HTML using just CSS classes!
<div class="products _-">
  <div class="product _-_">  <!-- Loop through each item -->
    <h2 class="_-name"></h2>  <!-- Insert name value -->
    <div class="_-price"></div>  <!-- Insert price value -->
  </div>
</div>
```

## ✨ Features

- **Zero Dependencies** - Pure JavaScript, no external libraries required
- **Tiny Footprint** - Just 5.2kB minified, perfect for performance-critical applications
- **Intuitive Syntax** - Simple class-based directives that are easy to read and write
- **Data Transformers** - Format and modify your data before rendering
- **Event Handling** - Attach event listeners directly to your data elements
- **Flexible Config** - Customizable settings for advanced use cases
- **Dark Mode Compatible** - Built with modern design principles
- **Mobile-Friendly** - Responsive by default

## 🚀 Quick Start

### 1. Include rivr.js in your project

```html
<link rel="stylesheet" href="rivr.css">
<script src="rivr.min.js"></script>
```

### 2. Create your HTML template with rivr directives

```html
<div class="rivr-grid products _-">
  <div class="rivr-card product _-_">
    <div class="rivr-card-header">
      <img class="_-images-thumb" alt="Product thumbnail">
    </div>
    <div class="rivr-card-content">
      <h3 class="rivr-card-title _-name"></h3>
      <p class="rivr-card-description _-description"></p>
      <div class="rivr-card-footer">
        <span class="rivr-price _-price"></span>
        <a class="rivr-btn _-link">Buy Now</a>
      </div>
    </div>
  </div>
</div>
```

### 3. Initialize rivr with your JSON data

```javascript
// Basic initialization
document.addEventListener('DOMContentLoaded', function() {
  fetch('products.json')
    .then(response => response.json())
    .then(data => {
      initRivr('.products', data);
    });
});

// Or use the simplified loading helper
rivrLoad('.products', 'products.json', {
  loadingTemplate: '<div class="rivr-loading">Loading products...</div>'
});
```

## 🧩 Class Directives

Rivr uses simple, underscore-prefixed class names to bind data to elements:

| Class Pattern | Description |
|---------------|-------------|
| `_-` | Marks an element for processing |
| `_-_` | Loop through an array of objects |
| `_-property` | Insert value of the "property" field |
| `_-nested-property` | Access nested JSON property |
| `_-property-` | Navigate to the "property" object |

## 🛠️ Configuration Options

Rivr can be customized with an options object:

```javascript
initRivr('.products', data, {
  // Class naming conventions
  dataPrefix: '_-',
  loopIndicator: '_',
  
  // Default attribute mapping by tag
  attributeMap: {
    'IMG': 'src',
    'A': 'href',
    'INPUT': 'value'
  },
  
  // Data transformers
  transformers: {
    'price': function(value) {
      return '$' + parseFloat(value).toFixed(2);
    },
    'description': function(value) {
      return value.substring(0, 100) + '...';
    }
  },
  
  // Event handlers
  events: {
    'click': function(item, event, element) {
      console.log('Clicked:', item);
    }
  },
  
  // Callback after rendering
  onRender: function(container, data) {
    console.log('Rendered successfully!');
  }
});
```

## 📚 Advanced Usage

### Loading Data from an API

```javascript
rivrLoad('.news-feed', 'https://api.example.com/news', {
  loadingTemplate: '<div class="rivr-loading">Fetching the latest news...</div>',
  errorTemplate: '<div class="rivr-error">Could not load news feed</div>',
  transformers: {
    'published': function(value) {
      return new Date(value).toLocaleDateString();
    }
  }
});
```

### Creating Interactive Elements

```javascript
initRivr('.products', data, {
  events: {
    'click': function(item, event, element) {
      if (event.target.classList.contains('add-to-cart')) {
        cart.add(item);
        event.target.textContent = 'Added!';
        setTimeout(() => {
          event.target.textContent = 'Add to Cart';
        }, 2000);
      }
    }
  }
});
```

### Custom Data Transformations

```javascript
initRivr('.weather', weatherData, {
  transformers: {
    'temperature': function(value) {
      return value + '°C';
    },
    'conditions': function(value, item) {
      const iconMap = {
        'sunny': '☀️',
        'cloudy': '☁️',
        'rainy': '🌧️',
        'snowy': '❄️'
      };
      return `${iconMap[value] || ''} ${value}`;
    }
  }
});
```

## 🔄 API Reference

### Core Functions

- **`rivr(json, element, config)`** - Core rendering function
- **`initRivr(selector, data, options)`** - Initialize with options
- **`rivrLoad(selector, url, options)`** - Load data via AJAX

### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `dataPrefix` | String | Prefix for rivr class directives (default: `'_-'`) |
| `loopIndicator` | String | Character that indicates array looping (default: `'_'`) |
| `defaultAttr` | String | Default attribute when none is specified (default: `'innerHTML'`) |
| `attributeMap` | Object | Map of tag names to attributes |
| `transformers` | Object | Functions to transform data values |
| `events` | Object | Event handlers for elements |
| `onRender` | Function | Callback after rendering completes |
| `loadingTemplate` | String | HTML to show while loading |
| `errorTemplate` | String | HTML to show on error |

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

Distributed under the GPL-3.0 License. See `LICENSE` for more information.

## 🙏 Acknowledgments

- Original concept by Steve Seguin
- Inspired by lightweight data templating needs
- Built for developers who need simple, effective solutions

---

<div align="center">
  <p>Made with ❤️ by the rivr.js team</p>
  <p>
    <a href="https://github.com/yourusername">GitHub</a> •
    <a href="https://twitter.com/yourusername">Twitter</a> •
    <a href="mailto:hello@example.com">Contact</a>
  </p>
</div>
