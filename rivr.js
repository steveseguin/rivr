function rivr(json, stone, config) {
  // Base case for recursion
  if (!stone || typeof stone.className === "undefined") return stone;
  
  // Initialize config object if not provided
  config = config || {
    dataPrefix: '_-',
    loopIndicator: '_',
    defaultAttr: 'innerHTML',
    attributeMap: {
      'IMG': 'src',
      'SOURCE': 'src',
      'VIDEO': 'id',
      'A': 'href',
      'IFRAME': 'data-src',
      'INPUT': 'value'
    },
    transformers: {},
    events: {}
  };
  
  // Process classes
  const classes = stone.className.split(" ");
  let hasActionClass = false;
  let processedChildren = false;
  
  for (let y = 0; y < classes.length; y++) {
    const currentClass = classes[y];
    // Skip if not action class
    if (currentClass.indexOf(config.dataPrefix) !== 0) continue;
    
    hasActionClass = true;
    const actions = currentClass.split("-");
    let currentJson = json;
    
    // Process multi-action class
    for (let z = 1; z < actions.length; z++) {
      const action = actions[z];
      
      // Handle loop action
      if (action === config.loopIndicator) {
        processedChildren = true;
        
        // Handle non-array data by navigating to a nested property if it exists
        if (!Array.isArray(currentJson)) {
          // Check if we're at the top level and trying to loop through products
          if (stone.classList.contains('products') && currentJson.examples && Array.isArray(currentJson.examples.products)) {
            currentJson = currentJson.examples.products;
          } else {
            console.warn('rivr: Expected array for loop but got:', typeof currentJson);
            return stone;
          }
        }
        
        const fragment = document.createDocumentFragment();
        
        // Loop through JSON array
        for (let k = 0; k < currentJson.length; k++) {
          const clone = stone.cloneNode(true);
          
          // Process children with current JSON item
          for (let i = 0; i < clone.childNodes.length; i++) {
            const processed = rivr(currentJson[k], clone.childNodes[i], config);
            if (processed && processed !== clone.childNodes[i]) {
              clone.replaceChild(processed, clone.childNodes[i]);
            }
          }
          
          // Remove loop class from duplicates
          if (k > 0) {
            clone.className = clone.className.replace(currentClass, "").trim();
          }
          
          // Add event handlers if defined
          if (config.events && typeof config.events === 'object') {
            for (const eventName in config.events) {
              if (currentJson[k].id) { // Add event only if item has ID for reference
                clone.setAttribute('data-item-id', currentJson[k].id);
                clone.addEventListener(eventName, function(e) {
                  config.events[eventName](currentJson[k], e, this);
                });
              }
            }
          }
          
          fragment.appendChild(clone);
        }
        
        const wrapper = document.createElement('div');
        wrapper.appendChild(fragment);
        stone.outerHTML = wrapper.innerHTML;
        return null; // Signal that this node has been processed
      } 
      // Handle final action
      else if (z + 1 === actions.length) {
        // If empty action, process children
        if (action === "") {
          processedChildren = true;
          for (let i = 0; i < stone.childNodes.length; i++) {
            const processed = rivr(currentJson, stone.childNodes[i], config);
            if (processed && processed !== stone.childNodes[i]) {
              stone.replaceChild(processed, stone.childNodes[i]);
            }
          }
        } else {
          // Process data field mapping
          const key = action;
          const value = currentJson[key];
          
          // Skip if value is undefined
          if (value === undefined) {
            console.warn(`rivr: Key '${key}' not found in JSON`, currentJson);
            continue;
          }
          
          // Apply transformers if defined
          let transformedValue = value;
          if (config.transformers && config.transformers[key]) {
            transformedValue = config.transformers[key](value, currentJson);
          }
          
          // Apply to appropriate attribute
          const tagName = stone.tagName;
          let attribute = config.attributeMap[tagName] || config.defaultAttr;
          
          if (attribute === 'innerHTML') {
            stone.innerHTML = transformedValue;
          } else {
            stone.setAttribute(attribute, transformedValue);
          }
        }
        
        break;
      } 
      // Navigate deeper into JSON
      else {
        currentJson = currentJson[action];
        if (currentJson === undefined) {
          console.warn(`rivr: Path segment '${action}' not found`, json);
          return stone;
        }
      }
    }
    
    // Only process first action class
    break;
  }
  
  // Handle children if not already processed and has no action class
  if (!processedChildren && !hasActionClass) {
    for (let i = 0; i < stone.childNodes.length; i++) {
      const processed = rivr(json, stone.childNodes[i], config);
      if (processed && processed !== stone.childNodes[i]) {
        stone.replaceChild(processed, stone.childNodes[i]);
      }
    }
  }
  
  return stone;
}

// Helper function to initialize rivr with configuration
function initRivr(selector, jsonData, options) {
  const container = document.querySelector(selector);
  if (!container) {
    console.error(`rivr: Container not found: ${selector}`);
    return;
  }
  
  const config = Object.assign({
    dataPrefix: '_-',
    loopIndicator: '_',
    defaultAttr: 'innerHTML',
    attributeMap: {
      'IMG': 'src',
      'SOURCE': 'src',
      'VIDEO': 'id',
      'A': 'href',
      'IFRAME': 'data-src',
      'INPUT': 'value'
    },
    transformers: {},
    events: {},
    onRender: null
  }, options || {});
  
  // Clone the container to preserve the template
  const template = container.cloneNode(true);
  
  // Process the template with JSON data
  rivr(jsonData, template, config);
  
  // Show the container (it might have been hidden)
  template.style.display = 'block';
  
  // Replace original container
  container.parentNode.replaceChild(template, container);
    
  // Call onRender callback if provided
  if (typeof config.onRender === 'function') {
    config.onRender(template, jsonData);
  }
  
  return template;
}

// Add utility for AJAX loading
function rivrLoad(selector, url, options) {
  const container = document.querySelector(selector);
  if (!container) {
    console.error(`rivr: Container not found: ${selector}`);
    return Promise.reject('Container not found');
  }
  
  // Show loading state
  if (options && options.loadingTemplate) {
    container.innerHTML = options.loadingTemplate;
  } else {
    container.innerHTML = '<div class="rivr-loading">Loading...</div>';
  }
  
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      return initRivr(selector, data, options);
    })
    .catch(error => {
      console.error('rivr: Error loading data', error);
      if (options && options.errorTemplate) {
        container.innerHTML = options.errorTemplate;
      } else {
        container.innerHTML = '<div class="rivr-error">Error loading data</div>';
      }
      return Promise.reject(error);
    });
}
