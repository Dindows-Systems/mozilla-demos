/* Insert into iFrame functions */
$('#smallscreenr').toggle();
(function() {
	$('.grid').height( $(window).height() );	
})();
$('#run').click(function() {
    var    contents = $('iframe').contents(),
		    body = contents.find('body'),
            html = $('textarea#html').val();
        localStorage.setItem('html',html);
		var $this = $(this);
		if ( $this.attr('id') === 'html') {
			body.html( $this.val() );
		} 

		else {
		}
        window.location.reload();
	});


$(document).ready(function() {
	var contents = $('iframe').contents(),	
	body = contents.find('body'),
    html = localStorage.getItem('html');
$('textarea#html').val(html);
			var html = localStorage.getItem('html');
			body.html(html);
});

/* The Modal Functions */
function showStore(){
  $('#libs').modal('show');

}
function showHelp(){
  $('#help').modal('show');
}


function shareURL(){var html = $('#html').val();
var linkTo = "data:text/html,<html><head><title>powered by Fiddly</title></head><body>" + html + "</body></html>";
    prompt("Copy This URL",linkTo);
};

/* The Fullscreen Functions */
function fullScreen(){
    if (screenfull.enabled) {
    screenfull.request();
    }
    $('#fullscreenr').toggle();
    $('#smallscreenr').toggle();
    $('.contains').toggle();
    $('#framer').css( "height","94%" );
}
function exit(){
    if (screenfull.enabled) {
    screenfull.exit();
    }
    $('#fullscreenr').toggle();
    $('.contains').toggle();
    $('#smallscreenr').toggle();
    $('iframe').css( "height","40%" );
}
/* END FULLSCREEN */
