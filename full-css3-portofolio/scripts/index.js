$(document).ready(function() {
    var fatBoun = {
        css3: function() {
            var css3El = document.body.style;
            var webkit = typeof (css3El.webkitTransition) == "undefined" ? false : true;
            var moz = typeof (css3El.mozTransition) == "undefined" ? false : true;
            var ie = typeof (css3El.msTransition) == "undefined" ? false : true;
            var opera = typeof (css3El.OTransition) == "undefined" ? false : true;
            var autres = typeof (css3El.transition) == "undefined" ? false : true;
            return {
                webkit: webkit,
                moz: moz,
                ie: ie,
                opera: opera,
                autres: autres,
                navigateur: function() {
                    if (webkit)
                        return "WebKit";
                    else if (moz)
                        return "Mozilla";
                    else if (ie)
                        return "Internet Explorer";
                    else if (opera)
                        return "Opéra";
                    else if (autres)
                        return "Navigateur compatible CSS3";
                    else
                        return "Navigateur non compatible CSS3";
                }(),
                support: (webkit || moz || ie || opera || autres)
            }
        }()
    }
	if(fatBoun.css3.support) {
		if(location.hash.substr(1) == "") {
			location.hash = "#"+$('#image>div:first').attr('id');
		}
	}
    var width = "width: 150px;";
    if (fatBoun.css3.ie || fatBoun.css3.opera) { //on règle le problème des largeurs non-animés sous Opéra ou IE
        var derLargeur = $('#nav' ).width();
        $('#nav').hover(function() { //on garde la dernière largeur car la propriétée width est en auto...
            $(this).animate({width: '150px'}, 500);
        }, function() {
            $(this).animate({width: derLargeur + 'px'}, 500);
        });
        width = "";
    }
	if(fatBoun.css3.ie || !fatBoun.css3.support) {
		$('#image>div>.titre>a').each(function() {
			var texte = $(this).text();
			$(this).before("<span>"+texte+"</span><br/><span>Lire plus / Read More</span>");
			$(this).remove();
			$('.titre').hover(function() {
				$($(this).children('span')[1]).fadeTo(500,0.0001);
			},function() {
				$($(this).children('span')[1]).fadeTo(500,1);
			});
		});
	}
    
    if (!fatBoun.css3.support) { //si les transitions CSS3 ne sont pas disponibles ont utilise notre amour de jQuery
        //si je me casse la tête à caller des animations CSS3 et JavaScript selon le navigateur
        //c'est car celle en CSS3 sont native sont de meilleur qualité qu'avec les timers JavaScript
        //(en particulier sur Internet Explorer 10+ qui à un excellent rendu grâce au GPU)
		var derHash = '#';
		$.ajax({
			type: "GET",
			url: "scripts/hashchange.jquery.js",
			dataType: "script"
		}).success(function() {
			if(location.hash.substr(1) == '' || typeof($(location.hash)[0]) == "undefined") location.hash = '#'+$('#image>div:first').attr('id');
			else derHash = location.hash;//$('body').attr('data-hash',location.hash);
			$(window).hashchange(function() {
				if(location.hash.substr(1) == '' || typeof($(location.hash)[0]) == "undefined") location.hash = derHash;//$('body').attr('data-hash');
				else derHash = location.hash;//$('body').attr('data-hash',location.hash);
				$('#image>div').each(function() {
					if(!parseInt($(this).css('left'))) {
						$(this).animate({left:'100%'}, 500);
					}
				});
				$(location.hash).animate({left:'0'},500);
			});
			$(window).hashchange();
		}).error(function() {
			alert('Erreur lors du telechargement d\'un script!');
		});
		$.fx.step.bulleNav = function(fx) {
			$(fx.elem).css({"border-radius": Math.floor(fx.now) + 'px' + Math.floor(fx.now) + 'px' + '0'});
		}
        $('.titre').hover(function() {
			$(this).children('.article').animate({opacity:1,height:'500px'},500);
            $(this).children('span').css('color', 'blue');
        }, function() {
			$(this).children('.article').animate({opacity:0,height:'0px'},500);
            $(this).children('span').css('color', 'black');
        });
        var derLargeur; //voir ligne 41
        $('#nav').hover(function() {
            derLargeur = $(this).width();
            $(this).animate({
                bulleNav: 150,
                width: '150px',
                height: '250px'
            }, 500);
            $(this).css('color', 'blue');
        }, function() {
            $(this).animate({
                bulleNav: 100,
                width: derLargeur + 'px',
                height: '100px'
            }, 500);
            $(this).css('color', 'black');
        });
        $('body').hover(function() {
            $('#filtre').animate({height:'0'},500);
        }, function() {
            $('#filtre').animate({height:'100%'},500);
        });
    } 
    else {
	
		$('<style>').appendTo('head').html("#nav:hover {color: blue;" + width + "height: 250px}");
        $('<link>', {
            href: 'styles/css3.css',
            media: 'screen',
            rel: 'stylesheet',
            type: 'text/css'
        }).appendTo('head');
    }
});
