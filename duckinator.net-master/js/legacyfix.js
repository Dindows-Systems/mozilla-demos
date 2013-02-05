function _legacy_moz_fix_tag(tag) {
	tags = document.getElementsByTagName(tag);
	if(tags[0] && (tags[0].getAttribute('_moz-userdefined') != null)) {
		for(var i in tags) {
			if(tags[i].style)
				tags[i].style.display='none';
		}
	}	
}

function legacyfix() {
	moz_tags = ['header', 'article'];
	for(var i in moz_tags) {
		_legacy_moz_fix_tag(moz_tags[i]);
	}
}