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
    events: {},
    debug: false
  };
  
  // Helper function to safely navigate nested properties
  function getNestedValue(obj, path) {
    if (!path) return obj;
    const parts = path.split('-');
    let current = obj;
    
    for (let i = 0; i < parts.length; i++) {
      if (current === null || current === undefined) return undefined;
      
      // Handle array index notation [n]
      const indexMatch = parts[i].match(/^(.+)\[(\d+)\]$/);
      if (indexMatch) {
        const propName = indexMatch[1];
        const index = parseInt(indexMatch[2], 10);
        current = current[propName];
        if (Array.isArray(current) && index < current.length) {
          current = current[index];
        } else {
          return undefined;
        }
      } else if (parts[i] === "") {
        continue; // Skip empty segments
      } else {
        current = current[parts[i]];
      }
    }
    
    return current;
  }
  
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
        
        // Handle non-array data by finding first array in the object
        if (!Array.isArray(currentJson)) {
          // Try to find a suitable array to loop through
          let foundArray = null;
          
          // First check if we're at the top level and trying to loop through products
          if (stone.classList.contains('products') && currentJson.examples && Array.isArray(currentJson.examples.products)) {
            foundArray = currentJson.examples.products;
          } 
          // Look for any array property that might be relevant
          else if (typeof currentJson === 'object' && currentJson !== null) {
            for (const key in currentJson) {
              if (Array.isArray(currentJson[key])) {
                const keyLower = key.toLowerCase();
                const classListStr = Array.from(stone.classList).join(' ').toLowerCase();
                // Try to match the array name with the element class
                if (classListStr.includes(keyLower) || keyLower.includes(classListStr.replace(/s$/, ''))) {
                  foundArray = currentJson[key];
                  break;
                }
              }
            }
            
            // If still no match, use the first array found
            if (!foundArray) {
              for (const key in currentJson) {
                if (Array.isArray(currentJson[key])) {
                  foundArray = currentJson[key];
                  break;
                }
              }
            }
          }
          
          if (foundArray) {
            currentJson = foundArray;
          } else {
            if (config.debug) {
              console.warn('rivr: Expected array for loop but got:', typeof currentJson);
            }
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
              const itemId = currentJson[k].id || k;
              clone.setAttribute('data-item-id', itemId);
              clone.addEventListener(eventName, function(e) {
                config.events[eventName](currentJson[k], e, this);
              });
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
          const pathRemainder = actions.slice(z).join("-");
          const value = getNestedValue(currentJson, pathRemainder);
          
          // Skip if value is undefined
          if (value === undefined) {
            // Check for aliased/alternative properties
            const aliases = {
              'brandName': ['brand', 'specs.brand', 'manufacturer'],
              'thumb': ['thumbnail', 'images.thumbnail', 'image', 'src', 'avatar'],
              'link': ['url', 'href'],
              'listPrice': ['originalPrice', 'msrp', 'fullPrice']
            };
            
            const key = pathRemainder;
            let foundValue = undefined;
            
            // Try aliases if they exist for this key
            if (aliases[key]) {
              for (const alias of aliases[key]) {
                foundValue = getNestedValue(currentJson, alias);
                if (foundValue !== undefined) break;
              }
            }
            
            // Still no value, log warning and continue
            if (foundValue === undefined) {
              if (config.debug) {
                console.warn(`rivr: Key '${key}' not found in JSON`, currentJson);
              }
              continue;
            } else {
              // Use the alias value
              value = foundValue;
            }
          }
          
          // Apply transformers if defined
          let transformedValue = value;
          
          // Get last part of the path to use as key for transformer
          const key = pathRemainder.split('-').pop();
          
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
        // Handle multiple segments in one go using getNestedValue
        if (z === 1) { // Only on first action segment
          const pathSegment = actions.slice(1, z + 1).join('-');
          currentJson = getNestedValue(json, pathSegment);
          if (currentJson === undefined) {
            if (config.debug) {
              console.warn(`rivr: Path segment '${pathSegment}' not found`, json);
            }
            return stone;
          }
        } else {
          currentJson = currentJson[action];
          if (currentJson === undefined) {
            if (config.debug) {
              console.warn(`rivr: Path segment '${action}' not found`, json);
            }
            return stone;
          }
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
    debug: false,
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
