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

// Updated main.js for the example
document.addEventListener('DOMContentLoaded', () => {
    rivr.load('products.json')
        .then(data => {
            const options = {
                errorHandling: true,
                addDataAttributes: true,
                externalLinks: true,
                transformers: {
                    price: (v, item) => v || item.listPrice ? `$${v || item.listPrice}` : 'N/A',
                    name: v => v.length > 40 ? v.substring(0, 37) + '...' : v
                },
                events: {
                    item: {
                        click: (item, idx) => {
                            document.querySelectorAll('.product').forEach(p => p.classList.remove('selected'));
                            event.currentTarget.classList.add('selected');
                        }
                    }
                }
            };

            rivr(data, document.querySelector('.products'), options);
            
            // Setup search
            const search = document.getElementById('product-search');
            if (search) {
                search.addEventListener('input', e => {
                    const term = e.target.value.toLowerCase();
                    const filtered = term ? data.filter(item => 
                        item.name.toLowerCase().includes(term) || 
                        item.description.toLowerCase().includes(term)) : data;
                    
                    const container = document.querySelector('.products');
                    const template = container.cloneNode(true);
                    rivr(filtered, template, options);
                    container.innerHTML = template.innerHTML;
                });
            }
            
            // Setup sorting
            const sort = document.getElementById('product-sort');
            if (sort) {
                sort.addEventListener('change', e => {
                    let sorted = [...data];
                    switch(e.target.value) {
                        case 'price-asc': 
                            sorted.sort((a, b) => parseFloat(a.listPrice || 0) - parseFloat(b.listPrice || 0));
                            break;
                        case 'price-desc': 
                            sorted.sort((a, b) => parseFloat(b.listPrice || 0) - parseFloat(a.listPrice || 0));
                            break;
                        case 'name': 
                            sorted.sort((a, b) => a.name.localeCompare(b.name));
                            break;
                    }
                    
                    const container = document.querySelector('.products');
                    const template = container.cloneNode(true);
                    rivr(sorted, template, options);
                    container.innerHTML = template.innerHTML;
                });
            }
            
            document.querySelector('.products').style.display = 'grid';
        })
        .catch(err => {
            console.error('Failed to load products:', err);
            document.querySelector('.error-message').textContent = 'Unable to load products.';
        });
});
