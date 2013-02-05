var x =$(document);
x.ready(main);

//Declaracion de variables globales
var numNotas=0;
var numTableros=0;
var numTachuelas=0;
var numImagenes=0;
function main (){


		var objSerialized1 = localStorage.getItem("colorFondo");
		if(objSerialized1!=null){
			var color = JSON.parse(objSerialized1);
			$("#bod").css("backgroundColor",'#' +color);
			$('#colorSelector div').css('backgroundColor', '#' + color);
		}


		$('#colorSelector').ColorPicker({
			color: '#0C5871',
			
			onShow: function (colpkr) {
				$(colpkr).fadeIn(500);
				$(".imagen").css("zIndex","0");
				$(".note").css("zIndex","0");
			    $(".tablero").css("zIndex","-1");
				$("#menu").css("zIndex","2");
				return false;
				
			},
			onHide: function (colpkr) {
				$(colpkr).fadeOut(500);
				organizarCapas();
				return false;
				
			},
			onChange: function (hsb, hex, rgb) {
				$('#colorSelector div').css('backgroundColor', '#' + hex);
			    $('#bod').css('backgroundColor', '#' + hex);
				
				// Web Storage - JSON
				var objSerialized = JSON.stringify(hex);
				localStorage.setItem("colorFondo", objSerialized);
		
			}



	
		});


	setProperties();
	loadNotes();
	//localStorage.clear();

	var objSerialized = localStorage.getItem("numN");
	if(objSerialized!=null){
		var obj = JSON.parse(objSerialized);
		numNotas=obj;
	}

	var objSerialized2 = localStorage.getItem("numT");
	if(objSerialized2!=null){
		var obj = JSON.parse(objSerialized2);
		numTableros=obj;
	}

	var objSerialized3 = localStorage.getItem("numTach");
	if(objSerialized3!=null){
		var obj = JSON.parse(objSerialized3);
		numTachuelas=obj;
	}

	var objSerialized4 = localStorage.getItem("numI");
	if(objSerialized4!=null){
		var obj = JSON.parse(objSerialized4);
		numImagenes=obj;
	}

	$(".btnX").css("display","none");
	$(".color").css("display","none");
	$(".btnImg").css("display","none");
	$(".btnXimg").css("display","none");
	$("#menu").css("background-image","url(img/cor2.jpg)");


}
function organizarCapas(){
	var x=$(".note").css("zIndex","100");
    $(".imagen").css("zIndex","101");
	$(".tachuela").css("zIndex","200");
	$(".tablero").css("zIndex","10");
	$("#menu").css("zIndex","6000");


}

function addTablero(){
	numTableros++;
	var objSerialized = JSON.stringify(numTableros);
	localStorage.setItem("numT", objSerialized);

	var x = $("#contenido");
	x.append("	<div class='tablero' id=tab"+numTableros+"> <p class='btnXtab' id='bxt"+numTableros+"' >x</p></div>");

	x=$("#tab"+numTableros);
		 var o=$("#bxt"+numTableros);
		 o.click(deleteTablero);
	x.draggable();
	x.resizable();
	x.css("background-image","url('img/cor.jpg')"); 
		
	x.css("position","absolute");
	x.css("left","1%");
	x.css("top","8%");

	x.mousedown(downTablero);

	x=$("#tab"+numTableros);
	var pos=x.position();
	var id=x.attr("id");
	var obj = new Object();
	obj.left=pos.left;
	obj.top=pos.top;
	obj.width=x.innerWidth()-42;;
	obj.height=x.innerHeight()-42;;
		
		// Web Storage - JSON
	var objSerialized2 = JSON.stringify(obj);
	localStorage.setItem(id, objSerialized2);


	
}
function downTablero(){
	$(this).css("zIndex","100");
	$(".note").css("zIndex","1000");
	$(".tachuela").css("zIndex","2000");
}

function addImagen(){
	 numImagenes++;
	 var objSerialized = JSON.stringify(numImagenes);
	 localStorage.setItem("numI", objSerialized);

	 var x = $("#contenido");
	 var str= prompt("Paste the url of the image");
	 if(str==false||str==""||str==null){
	 
	 }
	 else{
	 x.append("	<div class='imagen' id=img"+numImagenes+"> <p class='btnImg'  id='change"+numImagenes+"'>change</p><p class='btnXimg' id='xImg"+numImagenes+"'>x</p><img src="+str+" width='90px' class='im'/> </div>");
	 x = $(".imagen");
	 x.draggable();
	 x.resizable();
	 x.mousedown(downImagen);
	$(".im").error(imgError);
	$(".btnImg").css("display","none");
	$(".btnXimg").css("display","none");
	x.hover(overImagen,outImagen);
	x=$("#img"+numImagenes);
	x.css("position","absolute");
	x.css("left","1%");
	x.css("top","8%");
	var pos=x.position();
	var id=x.attr("id");
	var obj = new Object();
	obj.left=pos.left;
	obj.top=pos.top;
	obj.width=x.innerWidth()-42;;
	obj.height=x.innerHeight()-42;
	x=$("#img"+numImagenes+" img");
	obj.ruta=x.attr("src");
	// Web Storage - JSON
	var objSerialized2 = JSON.stringify(obj);
	localStorage.setItem(id, objSerialized2);
	
	$("#img"+numImagenes+" .btnXimg").click(deleteImg);
	$("#img"+numImagenes+" .btnImg").click(changeImg);
}
}

function deleteImg(){
	var x =$(this).attr("id").substring(4);
	var img = $("#img"+x);
	localStorage.removeItem("img"+x);
	//img.fadeOut("slow");
	img.effect("explode");

}

function changeImg(){
	var x =$(this).attr("id").substring(6);
	var img =$("#img"+x+" img");
	var ruta = prompt("Paste the url of the image");
	
		 if(ruta==false||ruta==""||ruta==null){
	 
	 }
	 else{
	img.attr("src",ruta);
	

	var pos=img.position();
	var id=img.attr("id");
	var obj = new Object();
	obj.left=pos.left;
	obj.top=pos.top;
	obj.width=img.innerWidth()-42;;
	obj.height=img.innerHeight()-42;
	var x2=$("#img"+x+" img");
	obj.ruta=x2.attr("src");
	// Web Storage - JSON
	var objSerialized2 = JSON.stringify(obj);
	localStorage.setItem(id, objSerialized2);
	

}}

function downImagen(){
organizarCapas();
var x=$(this);
x.css("zIndex","3000");

}
function addNota(){
	 numNotas++;
	 
	var objSerialized = JSON.stringify(numNotas);
	localStorage.setItem("numN", objSerialized);
	 
	 
	 var x = $("#contenido");
	 x.append("	<div class='note' id="+numNotas+"> <img class='color' src='img/color.png' width='15px' height='15px'/> <div class='colores'><div class='purple'></div>  <div class='green'></div> <div class='blue'></div>  <div class='red'></div> <div class='white'></div> <div class='yellow'></div> </div> <p class='btnX' id='bx"+numNotas+"' >x</p>	<textarea class='textArea' id='t"+numNotas+"' placeholder='Escribe tu nota...  '></textarea></div>");
	 setProperties();
	var o=$("#bx"+numNotas);

	o=$("#"+numNotas);
	o.css("position","absolute");
	o.css("left","1%");
	o.css("top","8%");

	x=$("#"+numNotas);

	var pos=x.position();
	var numero=x.attr("id");
	var caja=$("#t"+numero);
	var obj = new Object();
	obj.contenido=caja.val();
	obj.left=pos.left;
	obj.top=pos.top;
	obj.width=x.innerWidth()-32;
	obj.height=x.innerHeight()-32;
	obj.drop=false;


	// Web Storage - JSON
	var objSerialized = JSON.stringify(obj);
	localStorage.setItem(numero, objSerialized);

	$(".btnX").css("display","none");
	$(".color").css("display","none");

}

function setProperties(){
	var x = $(".note");

	x.hover(overNote,outNote);
	x.mousedown(clickNote);

	x.droppable({drop:dropTachuela });
	x.droppable({accept:".tachuela"});
	x.droppable({out:outTachuela});

	x.draggable();
	x.resizable();

	x= $(".tablero");
	x.draggable();
	x.resizable();
	
	
	 var o=$(".btnX");
	 o.click(deleteNote);
	 
	 o=$(".btnXtab");
	  o.click(deleteTablero);
	 

	$("#menu").css("zIndex","300");
	$(".note").css("zIndex","200");
    $(".tablero").css("zIndex","100");

	x=$(".tachuela");
	x.draggable();

	x=$(".imagen");
	
	x.draggable();
	x.resizable();
	x.mousedown(downImagen);
	x.hover(overImagen,outImagen);
	x=$(".btnXimg");
	x.click(deleteImg);
	x=$(".btnImg");
	x.click(changeImg);
}


function overImagen(){
	var x=$(this);
	var num = x.attr("id");
	$("#"+num+" .btnImg").show();
	$("#"+num+" .btnXimg").show();

}

function outImagen(){
	var x=$(this);
	var num = x.attr("id");
	$("#"+num+" .btnImg").hide();
	$("#"+num+" .btnXimg").hide();
}
function clickNote(){
	var x;
	
	organizarCapas();
	x=$(this);
	x.css("zIndex","1000");
	$(".tachuela").css("zIndex","2000");


	}
	var numAux;
	function overNote(){
	var x=$(this);
	var num = x.attr("id");
	numAux=num;
	//x.css("background-color","rgba(255,224,110,0.9)");
	//var y=$("#t"+x.attr("id"));
	//y.css("background-color","rgba(255,224,110,0.1)");

	$("#"+num+" .btnX").show();
	$("#"+num+" .color").show();
	$("#"+num+" .purple").click(clickPurple);
	$("#"+num+" .green").click(clickGreen);
	$("#"+num+" .blue").click(clickBlue);
	$("#"+num+" .red").click(clickRed);
	$("#"+num+" .white").click(clickWhite);
	$("#"+num+" .yellow").click(clickYellow);
	 
	var o=$("#"+num+" .color");
	o.click(overColores);

}

function clickPurple(){
	var color=$(this).css("background-color");
	var x=$("#"+numAux).css("background-color",color);
	$(".colores").slideUp("fast");
}

function clickGreen(){
	var color=$(this).css("background-color");
	var x=$("#"+numAux).css("background-color",color);
	$(".colores").slideUp("fast");
}

function clickBlue(){
	var color=$(this).css("background-color");
	var x=$("#"+numAux).css("background-color",color);
	$(".colores").slideUp("fast");
}

function clickRed(){
	var color=$(this).css("background-color");
	var x=$("#"+numAux).css("background-color",color);
	$(".colores").slideUp("fast");
}

function clickWhite(){
	var color=$(this).css("background-color");
	var x=$("#"+numAux).css("background-color",color);
	$(".colores").slideUp("fast");
}

function clickYellow(){
	var color=$(this).css("background-color");
	var x=$("#"+numAux).css("background-color",color);
	$(".colores").slideUp("fast");
}

function overColores(){

	$("#"+numAux+" .colores").slideDown("slow");
	$("#"+numAux+" .colores").css("zIndex","500");
}


function outNote(){
	var x=$(this);
	var num = x.attr("id");
	$("#"+num+" .btnX").css("display","none");
	$("#"+num+" .color").css("display","none");
	$("#"+num+" .colores").slideUp("slow");
}


function loadNotes(){
	var objSerialized1 = localStorage.getItem("numN");
	if(objSerialized1!=null){
		var obj1 = JSON.parse(objSerialized1);
		numNotas=obj1;
	}

	var str="";
	//alert(numNotas);
	for(var i=0;i<numNotas+1;i++){
		var objSerialized = localStorage.getItem(i);
		if(objSerialized!=null){
			var obj = JSON.parse(objSerialized);
			var x=$("#contenido");
			x.append("	<div class='note' id="+i+"><img class='color' src='img/color.png' width='15px' height='15px'/> <div class='colores'><div class='purple'></div>  <div class='green'></div> <div class='blue'></div>  <div class='red'></div> <div class='white'></div> <div class='yellow'></div> </div> <p class='btnX' id='bx"+i+"' '>x</p>	<textarea class='textArea' id='t"+i+"' placeholder='Escribe tu nota...  '>"+obj.contenido+"</textarea></div>");
			x=$("#"+i);
			x.css("position","absolute");
			x.css("left",obj.left);
			x.css("top",obj.top);
			x.css("width",obj.width);
			x.css("height",obj.height);
			x.css("background-color",obj.color);
		}



	}

	var objSerialized2 = localStorage.getItem("numT");
	if(objSerialized2!=null){
		var obj2= JSON.parse(objSerialized2);
		numTableros=obj2;
	}

	for(var i=0;i<numTableros+1;i++){
		var objSerialized = localStorage.getItem("tab"+i);
		if(objSerialized!=null){
			var obj = JSON.parse(objSerialized);
			var x=$("#contenido");
			x.append("<div class='tablero' id=tab"+i+"> <p class='btnXtab' id='bxt"+numTableros+"' >x</p> </div>	");
			x=$("#tab"+i);
			x.css("background-image","url('img/cor.jpg')"); 
			x.css("position","absolute");
			x.css("left",obj.left);
			x.css("top",obj.top);
			x.css("width",obj.width);
			x.css("height",obj.height);


		}

	}


	var objSerialized3 = localStorage.getItem("numTach");
	if(objSerialized3!=null){
		var obj2= JSON.parse(objSerialized3);
		numTachuelas=obj2;
	}

	for(var i=0;i<numTachuelas+1;i++){
		var objSerialized = localStorage.getItem("tach"+i);
		if(objSerialized!=null){
			var obj = JSON.parse(objSerialized);
			var x=$("#contenido");
			x.append("	<img src='img/ta.png' class='tachuela' id='tach"+i+"'/>");
			x=$("#tach"+i);

			x.css("position","absolute");
			x.css("left",obj.left);
			x.css("top",obj.top);

		}



	}


	var objSerialized4 = localStorage.getItem("numI");
	if(objSerialized4!=null){
		var obj2= JSON.parse(objSerialized4);
		numImagenes=obj2;
	}
	for(var i=0;i<numImagenes+1;i++){
		var objSerialized = localStorage.getItem("img"+i);
		if(objSerialized!=null){
			var obj = JSON.parse(objSerialized);
			var x=$("#contenido");
			var str=obj.ruta;
			x.append("<div class='imagen' id=img"+i+"> <p class='btnImg' id='change"+i+"' >change</p><p class='btnXimg' id='xImg"+i+"' >x</p><img src="+str+" width='90px' class='im'/> </div>");
			x=$("#img"+i);

			x.css("position","absolute");
			x.css("left",obj.left);
			x.css("top",obj.top);
			x.css("width",obj.width);
			x.css("height",obj.height);
			$(".im").error(imgError);
		}



	}

	organizarCapas();
	setProperties();
}


function deleteNote(){
	var x =$(this);
	var num= x.attr("id").substring(2);
	localStorage.removeItem(num);
	$("#"+num).fadeOut("slow");
}

function deleteTablero(){
	var x =$(this);
	var num= x.attr("id").substring(3);
	localStorage.removeItem("tab"+num);
	$("#tab"+num).fadeOut("slow");
}

function addTachuela(){

	numTachuelas++;
	var objSerialized = JSON.stringify(numTachuelas);
	localStorage.setItem("numTach", objSerialized);

	 var x = $("#contenido");
	 x.append("	<img src='img/ta.png' class='nueva tachuela' id='tach"+numTachuelas+"'/>");
	x=$(".nueva");
	x.css("position","absolute");
	x.css("left","50%");
	x.css("top","1%");
	x.removeClass("nueva");
	x=$("#tach"+numTachuelas);

	var id = x.attr("id");
	x.draggable();
	x.mousedown(downTachuela);
	x.mouseup(upTachuela);

	var pos=x.position();
	var obj = new Object();
	obj.left=pos.left;
	obj.top=pos.top;

	
	// Web Storage - JSON
	var objSerialized2 = JSON.stringify(obj);
	localStorage.setItem(id, objSerialized2);




}



function upTachuela(){


}

function downTachuela(){
	$(this).css("z-index","1000");
	$(".note").css("z-index","100");
	$(".tablero").css("z-index","10");

}


function dropTachuela( event, ui ){
	var x=$(this);
	var num=x.attr("id");


	var ta=ui.draggable;
	ta.addClass("drop"+num);
	//alert(ui.draggable.data("soltado"));

	 
	x.draggable("disable");
	x.resizable("disable");
	x.css("box-shadow","2px 2px 2px #444");
	//x.css("border-radius",".5em");
	//x.css("-moz-transform","rotate(10deg)");

	x.droppable({accept:".drop"+num});

		
		var color=x.css("background-color");
		var pos=x.position();
		var numero=x.attr("id");
		var caja=$("#t"+numero);
		obj = new Object();
		obj.contenido=caja.val();
		obj.left=pos.left;
		obj.top=pos.top;
		obj.width=x.innerWidth()-32;
		obj.height=x.innerHeight()-32;
		obj.color=color;
		obj.drop=true;
		
		// Web Storage - JSON
		 objSerialized = JSON.stringify(obj);
		localStorage.setItem(numero, objSerialized);

}


function outTachuela(event, ui ){

	var x=$(this);
	var num=x.attr("id");
	x.draggable("enable");
	x.resizable("enable");
	x.droppable({accept:".tachuela"});
	x.css("box-shadow","3px 3px 5px #222");
	var ta=ui.draggable;
	ta.removeClass("drop"+num);
	//x.css("border-radius","0");
	//x.css("-moz-transform","rotate(0deg)");

		var color=x.css("background-color");
		var pos=x.position();
		var numero=x.attr("id");
		var caja=$("#t"+numero);
		obj = new Object();
		obj.contenido=caja.val();
		obj.left=pos.left;
		obj.top=pos.top;
		obj.width=x.innerWidth()-32;
		obj.height=x.innerHeight()-32;
		obj.color=color;
		obj.drop=false;
		
		// Web Storage - JSON
		 objSerialized = JSON.stringify(obj);
		localStorage.setItem(numero, objSerialized);
}


  
	window.onbeforeunload = confirmaSalida;  
    function confirmaSalida()   {
		
		
		var nota;
		var objSerialized = localStorage.getItem("numN");
		if(objSerialized!=null){
			var obj = JSON.parse(objSerialized);
			numNotas=obj;
			
			for(var i=1;i<numNotas+1;i++){
				nota = $("#"+i);
				var obAux = localStorage.getItem(i);
				if(obAux!=null){
					var obAux2 = JSON.parse(obAux);
					var num=nota.attr("id");
					
						
					
					var x=$("#"+i);
					var color=x.css("background-color");
					var pos=x.position();
					var numero=x.attr("id");
					var caja=$("#t"+numero);
					obj = new Object();
					obj.contenido=caja.val();
					obj.left=pos.left;
					obj.top=pos.top;
					obj.width=x.innerWidth()-32;
					obj.height=x.innerHeight()-32;
					obj.color=color;
					obj.drop=obAux2.drop;
					
					// Web Storage - JSON
					 objSerialized = JSON.stringify(obj);
					localStorage.setItem(numero, objSerialized);

			

				}
			}
		}
		
		

		var tablero;
		var objSerialized2 = localStorage.getItem("numT");
		if(objSerialized2!=null){
			var obj = JSON.parse(objSerialized2);
			numTableros=obj;
			
			for(var i=1;i<numTableros+1;i++){
				tablero = $("#tab"+i);
				var obAux = localStorage.getItem("tab"+i);
				if(obAux!=null){

					var num=tablero.attr("id");
					
						
					
					var x2=$("#tab"+i);
					x2.css("background-image","url('img/cor.jpg')"); 
					var pos=x2.position();
					var numero=x2.attr("id");
				
					obj = new Object();

					obj.left=pos.left;
					obj.top=pos.top;
					obj.width=x2.innerWidth()-32;
					obj.height=x2.innerHeight()-32;
					
					// Web Storage - JSON
					 objSerialized = JSON.stringify(obj);
					localStorage.setItem(numero, objSerialized);

			

				}
			}
		}
		
		
		
		
		var objSerialized3 = localStorage.getItem("numTach");
		if(objSerialized3!=null){
			var obj = JSON.parse(objSerialized3);
			numTachuelas=obj;
		
		for(var i=1;i<numTachuelas+1;i++){
	
			var obAux = localStorage.getItem("tach"+i);
			if(obAux!=null){
		
				var x2=$("#tach"+i);
				var pos=x2.position();
				var numero=x2.attr("id");
			
				obj = new Object();

				obj.left=pos.left;
				obj.top=pos.top;

				
				// Web Storage - JSON
				 objSerialized = JSON.stringify(obj);
				localStorage.setItem(numero, objSerialized);

			

				}
			}
		}
		
		

		var objSerialized4 = localStorage.getItem("numI");
		if(objSerialized4!=null){
			var obj = JSON.parse(objSerialized4);
			numImagenes=obj;
			
			for(var i=1;i<numImagenes+1;i++){
		
				var obAux = localStorage.getItem("img"+i);
				if(obAux!=null){
						
								
					var x2=$("#img"+i);
					var pos=x2.position();
					var id=x2.attr("id");
				
					obj = new Object();

					obj.left=pos.left;
					obj.top=pos.top;
					obj.width=x2.innerWidth();
					obj.height=x2.innerHeight();
					x2=$("#img"+i+" img");
					obj.ruta=x2.attr("src");
					// Web Storage - JSON
					 objSerialized = JSON.stringify(obj);
					localStorage.setItem(id, objSerialized);


				

				}
			}
		}
		
	
	
    
	
          // return "Vas a abandonar esta pagina. ";  

    }

	function imgError(){

	 this.src = 'img/error.png';
	
	}

	function clearLocalStorage(){

	localStorage.clear();
	location.reload();
	}
