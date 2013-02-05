function mailfix() {
	if(!('getElementsByClassName' in document))
		return false;
    
	var spans = document.getElementsByClassName('mail');
	
	for(var i =0; i < spans.length; i++) {
		var span = spans[i];
		var anchor = document.createElement('a');
		anchor.innerHTML = span.innerHTML;
		anchor.href = "mailto:" + span.innerHTML;
		span.removeChild(span.childNodes[0]);
		span.appendChild(anchor);
	}
}