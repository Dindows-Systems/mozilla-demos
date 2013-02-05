$(document).ready(main);

var numCorrectas=0;
var numIncorrectas=0;
function main(){
  	establecerPropiedades();
	var bod=$("body").css("background-image","url('img/fondo.jpg')");
		bod.css("background-repeat","no-repeat");
	bod.css("background-position","center");
}

function establecerPropiedades(){
	var res =$(".respuesta");
	res.draggable();
	res.mousedown(downRespuesta);
	$(".preg, .pregMonumento").droppable({drop:dropPregunta});
	

}

function dropPregunta(event,ui){
	var contPregunta =$(this);
	var respuesta = ui.draggable;

	var correcta = contPregunta.text().toLowerCase();
	correcta = correcta.trim();
	var pos = contPregunta.position();
	contPregunta.css("background","#BBB");
	contPregunta.css("box-shadow",".2px .2px .2em #000");
	contPregunta.css("border","1px dashed #333")
	respuesta.css("cursor","default");

	if(correcta==respuesta.attr("alt")){
		contPregunta.addClass("resCorrecta");
		contPregunta.append("<img src='img/correcta.png' class='ok' />" +"<img src='"+respuesta.attr("src")+"' class='rDrop' />" );
		numCorrectas++;
	//	respuesta.remove();

	}else{
		contPregunta.addClass("resIncorrecta");
		contPregunta.append("<img src='img/inCorrecta.png' class='inco' />"+"<img src='"+respuesta.attr("src")+"' class='rDrop' />");
		numIncorrectas++;
	}
	respuesta.draggable("destroy");
	contPregunta.droppable("destroy");
	comprobarFinal();
	respuesta.remove();
}

function comprobarResultados(){
	$(".ok,.inco").fadeIn("slow");
	$("#resultados").html("Correct answers:     "+numCorrectas+"<br />"+"Incorrect answers:    "+numIncorrectas);

}

function comprobarFinal(){
	resul = numCorrectas+numIncorrectas;
	if(resul ==12){
		
		comprobarResultados();
	}
}

function downRespuesta(){
	$(".respuesta").css("z-index","0");
	$(this).css("z-index","100");
}


