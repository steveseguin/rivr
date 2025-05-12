function rivr(json, stone, options = {}) {
    if (!stone || !stone.className) return stone;
    if (!json) {console.warn("rivr: No data"); return stone;}
    
    const config = {errorHandling:true, transformers:{}, events:{}, ...options};
    const classes = stone.className.split(" ");
    
    for (let y = 0; y < classes.length; y++) {
        if (classes[y].indexOf("_-") !== 0) continue;
        
        const actions = classes[y].split("-");
        let currentJson = json;
        
        try {
            for (let z = 1; z < actions.length; z++) {
                const action = actions[z];
                
                if (action === "_") {
                    if (!Array.isArray(currentJson)) {
                        if (config.errorHandling) console.warn("rivr: Expected array");
                        return stone;
                    }
                    
                    const gemstone = stone.cloneNode(true);
                    gemstone.innerHTML = "";
                    
                    const dataToProcess = config.filter ? currentJson.filter(config.filter) : currentJson;
                    
                    for (let k = 0; k < dataToProcess.length; k++) {
                        const keystone = stone.cloneNode(true);
                        
                        if (config.events.item) {
                            Object.entries(config.events.item).forEach(([event, handler]) => {
                                keystone.addEventListener(event, () => handler(dataToProcess[k], k));
                            });
                        }
                        
                        for (let i = 0; i < keystone.childNodes.length; i++) {
                            keystone.childNodes[i] = rivr(dataToProcess[k], keystone.childNodes[i], config);
                        }
                        
                        if (k > 0) keystone.className = keystone.className.replace(classes[y], "");
                        if (config.addDataAttributes) {
                            keystone.dataset.rivrIndex = k;
                            if (dataToProcess[k].id) keystone.dataset.rivrId = dataToProcess[k].id;
                        }
                        
                        gemstone.appendChild(keystone);
                    }
                    
                    stone.outerHTML = gemstone.innerHTML;
                    break;
                }
                else if (z + 1 === actions.length) {
                    if (action === "") {
                        for (let i = 0; i < stone.childNodes.length; i++) {
                            stone.childNodes[i] = rivr(currentJson, stone.childNodes[i], config);
                        }
                    } 
                    else {
                        const value = currentJson[action];
                        if (value === undefined && config.strictMode) continue;
                        
                        const transformedValue = config.transformers[action] ? 
                            config.transformers[action](value, currentJson) : value;
                        
                        const el = stone.tagName;
                        if (el === "IMG" || el === "SOURCE" || el === "AUDIO") stone.src = transformedValue || "";
                        else if (el === "VIDEO") stone.id = transformedValue || "";
                        else if (el === "A") {
                            stone.href = transformedValue || "#";
                            if (config.externalLinks && stone.href.startsWith("http")) {
                                stone.target = "_blank";
                                stone.rel = "noopener";
                            }
                        }
                        else if (el === "IFRAME") stone.setAttribute("src", transformedValue || "");
                        else if (el === "INPUT") stone.value = transformedValue || "";
                        else if (el === "SELECT") {
                            if (Array.isArray(transformedValue)) {
                                transformedValue.forEach(opt => {
                                    const o = document.createElement("option");
                                    o.value = opt.value || opt;
                                    o.textContent = opt.label || opt;
                                    stone.appendChild(o);
                                });
                            } else stone.value = transformedValue || "";
                        }
                        else stone.innerHTML = transformedValue !== undefined ? transformedValue : "";
                        
                        if (config.attributeMap && config.attributeMap[action]) {
                            Object.entries(config.attributeMap[action]).forEach(([attr, field]) => {
                                if (currentJson[field] !== undefined) stone.setAttribute(attr, currentJson[field]);
                            });
                        }
                    }
                    break;
                } 
                else {
                    currentJson = currentJson[action];
                    if (currentJson === undefined) {
                        if (config.errorHandling) console.warn(`rivr: Path "${action}" not found`);
                        return stone;
                    }
                }
            }
        } catch (error) {
            if (config.errorHandling) console.error("rivr: Error", error);
            return config.errorHandling ? stone : null;
        }
    }
    return stone;
}

rivr.load = (url, callback) => fetch(url)
    .then(r => r.ok ? r.json() : Promise.reject(`HTTP error: ${r.status}`))
    .then(data => callback ? callback(data) : data)
    .catch(err => { console.error("rivr load:", err); throw err; });

rivr.all = (json, selector, options) => 
    Array.from(document.querySelectorAll(selector)).forEach(el => rivr(json, el, options));


