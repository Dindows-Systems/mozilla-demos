function _rot_js_entity_decode(data) {
	var matches = data.match(/&#\d+;?/g);

	if(matches == null)
		return data;
	
	for(var i = 0; i < matches.length; i++) {
		var replacement = String.fromCharCode((matches[i]).replace(/\D/g,""));

		data = data.replace(/&#\d+;?/,replacement);
	}
	return data;
}

// rot47() takes a string of any valid ASCII character
function rot47(text) {
	newtext = "";
	for (i = 0; i < text.length; i++) {
		code = text.charCodeAt(i);
		if (code >= 33 && code <= 126) {
			code = code + 47;
			if (code > 126)
				code = code-94;
		}
		newtext = newtext + String.fromCharCode(code)
	}

	return newtext;
}

// rot13() takes a string of letters only
function rot13(text) {
	newtext = "";
	for (i = 0; i < text.length; i++) {
		code = text.charCodeAt(i);
		if (code >= 65 && code <= 90) {
			/* Uppercase */
			code = code + 13;
			if (code > 90)
				code = code-26;
		} else if (code >= 97 && code <= 122) {
			/* Lowercase */
			code = code + 13;
			if (code > 122)
				code = code-26;
		}
		newtext = newtext + String.fromCharCode(code)
	}

	return newtext;
}

// rot5() takes numbers represented as strings
function rot5(text) {
	newtext = "";
	for (i = 0; i < text.length; i++) {
		code = text.charCodeAt(i);
		if (code >= 48 && code <= 57) {
			code = code + 5;
			if (code > 57)
				code = code-10;
		}
		newtext = newtext + String.fromCharCode(code)
	}

	return newtext;
}

function rot_fn(fn) {
	var spans = document.getElementsByClassName(fn);
	if(!(fn in window))
		return false;
	
	for(var i =0; i < spans.length; i++) {
		var span = spans[i];
		var old = _rot_js_entity_decode(span.getAttribute("data-rot"));
		var text = window[fn](old);
		span.innerHTML = text;
	}
}

function rot_all() {
	if(!('getElementsByClassName' in document))
		return false;

	var types = ['rot5', 'rot13', 'rot47'];
	for(var i = 0; i < types.length; i++) {
		rot_fn(types[i]);
	}
}