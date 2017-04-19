/////////// VERSION 0.3 ///////////////////
function rivr(json,stone,flow){
	if (typeof(stone.className)==="undefined"){return stone;}
	var classes = stone.className.split(" ");
	for (var y=0;y<classes.length;y++){ // GO THRU CLASSES
		if (classes[y].indexOf("_-")===0){ // IF CLASS IS AN ACTION, CONTINUE
			for (var z=1;z<classes[y].split("-").length;z++){ // GO THRU EACH ACTION IF ITS A MULTI-ACTION CLASS
				if (classes[y].split("-")[z]==="_"){  // UNDERSCORE IMPLIES NUMERICAL LOOPING ACTION
					var gemstone = stone.cloneNode(true);
					gemstone.innerHTML = ""; // gemstones are destroyed if no json 
					for (var k=0;k<json.length;k++){ // JSON DATA SHOULD BE AT A NUMERICAL LOOPING POINT; problems otherwise...
						var keystone = stone.cloneNode(true);
						for (var i=0;i<keystone.childNodes.length;i++){keystone.childNodes[i] = rivr(json[k],keystone.childNodes[i]);}
						if (k>0){keystone.className = keystone.className.replace(classes[y],"");} // Keeps only first gemstone; duplicates go sterile
						gemstone.appendChild(keystone);
					}
					stone.outerHTML = gemstone.innerHTML; break; // THERE SHOULDNT BE MORE ACTIONS AFTER A LOOP
				} else if (z+1==classes[y].split("-").length){ // IF FINAL ACTION	
					if (classes[y].split("-")[z]===""){for (var i=0;i<stone.childNodes.length;i++){stone.childNodes[i] = rivr(json,stone.childNodes[i]);}}
					else {// If object does not have an inner, apply to the obvious data attribute.
						if (stone.tagName === "IMG"){stone.src = json[classes[y].split("-")[z]];} // images
						else if (stone.tagName === "SOURCE"){stone.src = json[classes[y].split("-")[z]];} 
						else if (stone.tagName === "VIDEO"){stone.id = json[classes[y].split("-")[z]];} 
						else if (stone.tagName === "A"){stone.href = json[classes[y].split("-")[z]];} 
						else if (stone.tagName === "IFRAME"){stone.setAttribute("network", json[classes[y].split("-")[z]]); }
						//else if (stone.tagName === "SCRIPT"){setTimeout(function(){videojs(document.getElementById(json[classes[y].split("-")[z]]));},100);} 
						else {stone.innerHTML = json[classes[y].split("-")[z]];} // others
					} break;
				} else {json = json[classes[y].split("-")[z]];} // dig into the json, but not the element
			} //break;  //  TAKE ACTION SET OF FIRST ACTION CLASS ONLY, IGNORE ACTIONS OF OTHER ACTION CLASSES IN THE ELEMENT
		}
	} return stone;
}


//////////// VERSION 0.1 /////////////////
// function rivr(json,stone,flow){
	// if (typeof(stone.className)==="undefined"){return stone;}
	// var classes = stone.className.split(" ");
	// for (var y=0;y<classes.length;y++){ // GO THRU CLASSES
		// if (classes[y].indexOf("_-")===0){ // IF CLASS IS AN ACTION, CONTINUE
			// for (var z=1;z<classes[y].split("-").length;z++){ // GO THRU EACH ACTION IF ITS A MULTI-ACTION CLASS
				// if (classes[y].split("-")[z]==="_"){  // UNDERSCORE IMPLIES NUMERICAL LOOPING ACTION
					// var gemstone = stone.cloneNode(true);
					// gemstone.innerHTML = ""; // gemstones are destroyed if no json 
					// for (var k=0;k<json.length;k++){ // JSON DATA SHOULD BE AT A NUMERICAL LOOPING POINT; problems otherwise...
						// var keystone = stone.cloneNode(true);
						// for (var i=0;i<keystone.childNodes.length;i++){keystone.childNodes[i] = rivr(json[k],keystone.childNodes[i]);}
						// // flow = typeof flow !== 'undefined' ? flow : json.length-1; // default flow to append; or flow = 0 to delete
						// if (k>0){keystone.className = keystone.className.replace(classes[y],"");} // Keeps only first gemstone; duplicates go sterile
						// gemstone.appendChild(keystone);
					// }
					// stone.outerHTML = gemstone.innerHTML; break; // THERE SHOULDNT BE MORE ACTIONS AFTER A LOOP
				// } else if (z+1==classes[y].split("-").length){ // IF FINAL ACTION	
					// if (classes[y].split("-")[z]===""){for (var i=0;i<stone.childNodes.length;i++){stone.childNodes[i] = rivr(json,stone.childNodes[i]);}}
					// else {// If object does not have an inner, apply to the obvious data attribute.
						// if (stone.tagName === "IMG"){stone.src = json[classes[y].split("-")[z]];} // images
						// else if (stone.tagName === "A"){stone.href = json[classes[y].split("-")[z]];} // images
						// else {stone.innerHTML = json[classes[y].split("-")[z]];} // others
					// } 
				// } else {json = json[classes[y].split("-")[z]];} // dig into the json, but not the element
			// } break;  //  TAKE ACTION SET OF FIRST ACTION CLASS ONLY, IGNORE ACTIONS OF OTHER ACTION CLASSES IN THE ELEMENT
		// }
	// } return stone;
// }

