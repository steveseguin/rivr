function rivr(json, stone, options = {}) {
    // Handle empty or invalid inputs
    if (!stone || typeof stone.className === "undefined") return stone;
    if (!json) {
        console.warn("rivr: No JSON data provided");
        return stone;
    }

    // Process options with defaults
    const config = {
        errorHandling: true,
        transformers: {},
        events: {},
        ...options
    };

    // Process class names
    const classes = stone.className.split(" ");
    
    // Main loop to process each class
    for (let y = 0; y < classes.length; y++) {
        if (classes[y].indexOf("_-") !== 0) continue; // Skip non-action classes
        
        const actions = classes[y].split("-");
        let currentJson = json;
        
        try {
            // Process actions
            for (let z = 1; z < actions.length; z++) {
                const action = actions[z];
                
                // Handle array looping with "_"
                if (action === "_") {
                    if (!Array.isArray(currentJson)) {
                        if (config.errorHandling) {
                            console.warn(`rivr: Expected array but got ${typeof currentJson}`);
                            return stone;
                        }
                        break;
                    }
                    
                    const gemstone = stone.cloneNode(true);
                    gemstone.innerHTML = "";
                    
                    // Allow filtering if provided
                    const dataToProcess = config.filter ? 
                        currentJson.filter(config.filter) : currentJson;
                    
                    // Process each item in the array
                    for (let k = 0; k < dataToProcess.length; k++) {
                        const keystone = stone.cloneNode(true);
                        
                        // Apply event handlers if specified
                        if (config.events.item) {
                            Object.entries(config.events.item).forEach(([event, handler]) => {
                                keystone.addEventListener(event, () => handler(dataToProcess[k], k));
                            });
                        }
                        
                        // Process child nodes recursively
                        for (let i = 0; i < keystone.childNodes.length; i++) {
                            keystone.childNodes[i] = rivr(dataToProcess[k], keystone.childNodes[i], config);
                        }
                        
                        // Remove loop class from clones to prevent re-processing
                        if (k > 0) {
                            keystone.className = keystone.className.replace(classes[y], "");
                        }
                        
                        // Add data attributes for reference
                        if (config.addDataAttributes) {
                            keystone.dataset.rivrIndex = k;
                            if (dataToProcess[k].id) keystone.dataset.rivrId = dataToProcess[k].id;
                        }
                        
                        gemstone.appendChild(keystone);
                    }
                    
                    stone.outerHTML = gemstone.innerHTML;
                    break; // No more actions after a loop
                }
                // Handle final action
                else if (z + 1 === actions.length) {
                    // If blank, process children with current JSON context
                    if (action === "") {
                        for (let i = 0; i < stone.childNodes.length; i++) {
                            stone.childNodes[i] = rivr(currentJson, stone.childNodes[i], config);
                        }
                    } 
                    // Otherwise apply value to appropriate attribute based on element type
                    else {
                        const value = currentJson[action];
                        
                        // Skip if value is undefined and strictMode is enabled
                        if (value === undefined && config.strictMode) {
                            console.warn(`rivr: Property "${action}" not found in JSON`);
                            continue;
                        }
                        
                        // Apply transformers if configured
                        const transformedValue = config.transformers[action] ? 
                            config.transformers[action](value, currentJson) : value;
                        
                        // Handle different element types
                        switch (stone.tagName) {
                            case "IMG":
                                stone.src = transformedValue || "";
                                if (currentJson.alt) stone.alt = currentJson.alt;
                                break;
                            case "SOURCE":
                                stone.src = transformedValue || "";
                                break;
                            case "VIDEO":
                                stone.id = transformedValue || "";
                                break;
                            case "AUDIO":
                                stone.src = transformedValue || "";
                                break;
                            case "A":
                                stone.href = transformedValue || "#";
                                if (config.externalLinks && stone.href.startsWith("http")) {
                                    stone.target = "_blank";
                                    stone.rel = "noopener noreferrer";
                                }
                                break;
                            case "IFRAME":
                                stone.setAttribute("src", transformedValue || "");
                                break;
                            case "INPUT":
                                stone.value = transformedValue || "";
                                break;
                            case "SELECT":
                                if (Array.isArray(transformedValue)) {
                                    transformedValue.forEach(option => {
                                        const opt = document.createElement("option");
                                        opt.value = option.value || option;
                                        opt.textContent = option.label || option;
                                        stone.appendChild(opt);
                                    });
                                } else {
                                    stone.value = transformedValue || "";
                                }
                                break;
                            default:
                                // For other elements, update innerHTML
                                stone.innerHTML = transformedValue !== undefined ? 
                                    transformedValue : "";
                        }
                        
                        // Apply attributes if specified in config
                        if (config.attributeMap && config.attributeMap[action]) {
                            const attributesToSet = config.attributeMap[action];
                            Object.entries(attributesToSet).forEach(([attr, jsonField]) => {
                                if (currentJson[jsonField] !== undefined) {
                                    stone.setAttribute(attr, currentJson[jsonField]);
                                }
                            });
                        }
                    }
                    break;
                } 
                // Navigate deeper into JSON structure
                else {
                    currentJson = currentJson[action];
                    
                    // Handle undefined JSON paths
                    if (currentJson === undefined) {
                        if (config.errorHandling) {
                            console.warn(`rivr: Path "${action}" not found in JSON`);
                            return stone;
                        }
                        break;
                    }
                }
            }
        } catch (error) {
            if (config.errorHandling) {
                console.error("rivr: Error processing template", error);
            }
            // Return original element on error if error handling is enabled
            return config.errorHandling ? stone : null;
        }
    }
    
    return stone;
}

// Helper function to load JSON from URL
rivr.loadJSON = function(url, callback) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (callback && typeof callback === 'function') {
                callback(data);
            }
            return data;
        })
        .catch(error => {
            console.error("rivr: Error loading JSON:", error);
            throw error;
        });
};

// Utility for rendering multiple templates simultaneously
rivr.renderAll = function(json, selector, options) {
    const elements = document.querySelectorAll(selector);
    Array.from(elements).forEach(el => rivr(json, el, options));
};

// Add conditional rendering capability
rivr.if = function(condition, stone, json, options) {
    if (!condition) {
        stone.style.display = 'none';
        return stone;
    }
    return rivr(json, stone, options);
};
