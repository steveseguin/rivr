# rivr.js

## What
rivr is a micro framework for data-driven websites. It leverages the structure of incoming JSON data to perform simple website data-ingestion tasks, such as updating data-fields and performing data-loops of unknown length. Despite its simple function, adding custom rules and actions enable developers to build powerful and customized designs without complexity.

## Why
rivr was built as an alternative to Angular, React, Vue, etc., when you just want something super simple. No build process, no dependencies, no complex state management - just inject your data into your HTML.

## How
The main concept is that you create a hidden HTML template for your data, and then identify to rivr the HTML element that is the primary node (stone). From there, rivr looks at the classnames of elements and child elements for directions on what to do: skip, loop through JSON, dig into JSON, or update elements with specific JSON key values.

## Installation

```html
<script src="rivr.js"></script>
```

That's it! No dependencies, no package managers, no build process.

## Basic Usage

### 1. Create an HTML template with rivr classnames

```html
<div class="products _-">
    <div class="product _-_">
        <div class="_-name"></div>
        <div class="_-description"></div>
        <div class="_-price"></div>
        <div class="_-">
            <a class="_-link"><button>Buy</button></a>
        </div>
        <div class="_-images-">
            <img class="_-thumb" />
        </div>
    </div>
</div>
```

### 2. Get your JSON data and render with rivr

```javascript
// Load or define your JSON data
const data = [
    {
        "name": "Product 1",
        "description": "This is the first product",
        "price": "$19.99",
        "link": "https://example.com/product1",
        "images": {
            "thumb": "product1-thumb.jpg"
        }
    },
    {
        "name": "Product 2",
        "description": "This is the second product",
        "price": "$29.99",
        "link": "https://example.com/product2",
        "images": {
            "thumb": "product2-thumb.jpg"
        }
    }
];

// Apply data to your template
rivr(data, document.querySelector('.products'));

// Make the container visible if it was hidden
document.querySelector('.products').style.display = 'block';
```

## Class Naming Conventions

rivr uses a simple class naming convention to bind data to HTML:

- `_-` : Process children with current JSON context
- `_-_` : Loop through an array of objects
- `_-propertyName` : Insert the value of a property into this element
- `_-nestedObject-propertyName` : Navigate to a nested object, then insert a property

## Advanced Usage

### Loading JSON from URL

```javascript
rivr.load('data.json')
    .then(data => {
        rivr(data, document.querySelector('.template'));
    })
    .catch(error => {
        console.error('Failed to load data:', error);
    });
```

### Using Transformers and Options

```javascript
const options = {
    errorHandling: true,
    addDataAttributes: true,
    externalLinks: true,
    transformers: {
        price: (value, item) => `$${value || 'N/A'}`,
        name: value => value.length > 40 ? value.substring(0, 37) + '...' : value
    },
    events: {
        item: {
            click: (item, index) => {
                console.log('Clicked:', item.name);
            }
        }
    },
    attributeMap: {
        name: {
            'data-brand': 'brandName',
            'title': 'name'
        }
    }
};

rivr(data, document.querySelector('.template'), options);
```

### Filtering and Sorting

```javascript
// Filter products under $50
const filteredData = data.filter(item => parseFloat(item.price) < 50);
rivr(filteredData, document.querySelector('.template'));

// Sort by price (ascending)
const sortedData = [...data].sort((a, b) => 
    parseFloat(a.price) - parseFloat(b.price)
);
rivr(sortedData, document.querySelector('.template'));
```

## API Reference

### Main Function

```javascript
rivr(jsonData, element, options)
```

- `jsonData`: The JSON data to be rendered
- `element`: The DOM element containing the template
- `options`: Configuration options (optional)

### Helper Functions

```javascript
rivr.load(url, callback)
```
Loads JSON from a URL and returns a Promise

```javascript
rivr.all(jsonData, selector, options)
```
Renders multiple templates with the same data

### Options

| Option | Type | Description |
|--------|------|-------------|
| `errorHandling` | Boolean | Enable/disable error logging (default: true) |
| `strictMode` | Boolean | Fail on missing properties (default: false) |
| `addDataAttributes` | Boolean | Add data-rivr-* attributes to elements (default: false) |
| `externalLinks` | Boolean | Add target="_blank" to external links (default: false) |
| `transformers` | Object | Functions to transform property values before rendering |
| `events` | Object | Event handlers to attach to rendered elements |
| `attributeMap` | Object | Maps JSON properties to element attributes |
| `filter` | Function | Filter function for array data |

## Examples

### Blog Posts

```html
<div class="blog-posts _-">
    <article class="post _-_">
        <h2 class="_-title"></h2>
        <div class="meta">
            <span class="_-author"></span>
            <time class="_-date"></time>
        </div>
        <div class="_-content"></div>
    </article>
</div>
```

### Image Gallery

```html
<div class="gallery _-">
    <div class="image-item _-_">
        <img class="_-url" />
        <div class="caption _-caption"></div>
    </div>
</div>
```

### Nested Data

```html
<div class="users _-">
    <div class="user _-_">
        <div class="_-name"></div>
        <div class="_-address-street"></div>
        <div class="_-address-city"></div>
        <div class="posts _-posts-">
            <div class="post _-_">
                <div class="_-title"></div>
                <div class="_-body"></div>
            </div>
        </div>
    </div>
</div>
```

## Best Practices

1. **Start Simple**: Begin with basic templates and add complexity incrementally
2. **Use Transformers**: Format and sanitize data using transformer functions
3. **Handle Errors**: Enable errorHandling for easier debugging
4. **Optimize Loops**: Keep templates minimal for better performance with large datasets
5. **Use Semantic HTML**: Use appropriate HTML elements for better accessibility
6. **Hide Templates**: Use CSS to hide your templates until data is loaded

## Contributing

rivr.js is open to improvements and suggestions! The core philosophy is to maintain simplicity while adding useful features.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

GPLv3.0 - As rivr is a young and ever-developing micro framework, it is very important that improvements to the framework be shared with the community.
