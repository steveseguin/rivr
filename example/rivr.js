/**
 * rivr.js v0.4.0
 * A micro framework for data-driven websites
 * License: GPLv3.0
 */
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
  
  // Create a clone for safe manipulation
  const stoneClone = stone.cloneNode(false);
  const classes = stone.className.split(" ");
  
  let processedChildren = false;
  let skipElement = false;
  
  // Process classes
  for (let y = 0; y < classes.length; y++) {
    const currentClass = classes[y];
    // Skip if not action class
    if (currentClass.indexOf(config.dataPrefix) !== 0) continue;
    
    const actions = currentClass.split("-");
    let currentJson = json;
    
    // Process multi-action class
    for (let z = 1; z < actions.length; z++) {
      const action = actions[z];
      
      // Handle loop action
      if (action === config.loopIndicator) {
        processedChildren = true;
        
        // Skip if JSON is not an array
        if (!Array.isArray(currentJson)) {
          console.warn('rivr: Expected array for loop but got:', typeof currentJson);
          skipElement = true;
          break;
        }
        
        const gemstone = document.createDocumentFragment();
        
        // Loop through JSON array
        for (let k = 0; k < currentJson.length; k++) {
          const keystone = stone.cloneNode(true);
          
          // Process children with current JSON item
          for (let i = 0; i < keystone.childNodes.length; i++) {
            keystone.childNodes[i] = rivr(currentJson[k], keystone.childNodes[i], config);
          }
          
          // Remove loop class from duplicates
          if (k > 0) {
            keystone.className = keystone.className.replace(currentClass, "").trim();
          }
          
          // Add event handlers if defined
          if (config.events && typeof config.events === 'object') {
            for (const eventName in config.events) {
              if (currentJson[k].id) { // Add event only if item has ID for reference
                keystone.setAttribute('data-item-id', currentJson[k].id);
                keystone.addEventListener(eventName, function(e) {
                  config.events[eventName](currentJson[k], e, this);
                });
              }
            }
          }
          
          gemstone.appendChild(keystone);
        }
        
        // Replace original element with fragment
        while (stoneClone.firstChild) {
          stoneClone.removeChild(stoneClone.firstChild);
        }
        stoneClone.appendChild(gemstone);
        return stoneClone;
      } 
      // Handle final action
      else if (z + 1 === actions.length) {
        // If empty action, process children
        if (action === "") {
          processedChildren = true;
          for (let i = 0; i < stone.childNodes.length; i++) {
            const processed = rivr(currentJson, stone.childNodes[i], config);
            if (processed) {
              stoneClone.appendChild(processed.cloneNode(true));
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
            stoneClone.innerHTML = transformedValue;
          } else {
            stoneClone.setAttribute(attribute, transformedValue);
          }
        }
        
        break;
      } 
      // Navigate deeper into JSON
      else {
        currentJson = currentJson[action];
        if (currentJson === undefined) {
          console.warn(`rivr: Path segment '${action}' not found`, json);
          skipElement = true;
          break;
        }
      }
    }
    
    // Only process first action class
    break;
  }
  
  // Handle children if not already processed
  if (!processedChildren && !skipElement) {
    for (let i = 0; i < stone.childNodes.length; i++) {
      const childNode = stone.childNodes[i];
      const processed = rivr(json, childNode, config);
      if (processed) {
        stoneClone.appendChild(processed.cloneNode(true));
      }
    }
  }
  
  return skipElement ? null : stoneClone;
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
  
  // Process the container with JSON data
  const rendered = rivr(jsonData, container, config);
  
  // Replace original container
  if (rendered) {
    container.parentNode.replaceChild(rendered, container);
    
    // Call onRender callback if provided
    if (typeof config.onRender === 'function') {
      config.onRender(container, jsonData);
    }
  }
  
  return container;
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
