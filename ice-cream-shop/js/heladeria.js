$(document).ready(main);


function main(){
  
	var hel=$(".helado").draggable();
	hel.mousedown(downHelado);
	hel.mouseup(upHelado);

	$("#contCono").droppable({drop:dropCono});
	$("#contBanana").droppable({drop:dropBanana});
	var bod=$("body");
	bod.css("background","url(img/fondo.jpg)");
	bod.css("background-repeat","no-repeat");
	bod.css("background-attachment","fixed");
	bod.css("background-position","center");

	
	var sabores =$("#sabores").css("display","none");

	$("#conito").hover(overConito,outConito);
	$("#conos").css("display","none");

	$("#banana").hover(overBanana,outBanana);
	$("#banana").click(clickBanana);
	$(".helado").hover(overSabor);
}

function overConito(){
	$(this).attr("src","img/conito.png");
}

function outConito(){
	$(this).attr("src","img/conito1.png");
}
function overBanana(){
	$(this).attr("src","img/banana.png");
}

function outBanana(){
	$(this).attr("src","img/banana1.png");
}


function downHelado(){
	$(".helado").css("z-index","10");
	$(this).css("z-index","100");
	$("#contCono h2").fadeIn("slow");
	$("#contBanana h2").fadeIn("slow");
	$("#contCono").css("border","2px dashed red");
	$("#contBanana").css("border","2px dashed red");
}
function upHelado(){
	$("#contBanana h2").fadeOut("fast");
	$("#contCono h2").fadeOut("fast");
	$("#contCono").css("border","2px solid white");
	$("#contBanana").css("border","2px solid white");
}

var pos = 15;
var capa= 1000;
var numBolas=0;
var total;
var arrSabores = new Array();
function dropCono(event , ui){

	var bola=ui.draggable;
	

	bola.unbind("mousedown");
	bola.removeClass("helado");
	bola.css("position","absolute");
	bola.css("left","38.8em");
	bola.css("top",pos+"em");
	bola.css("z-index",capa);
	capa++;
	bola.addClass("heladoPedido");
	pos = pos -5;
	bola.draggable("destroy");
	$("#sabores").prepend("<img src='"+bola.attr('src')+"' id='"+bola.attr('id')+"'class='helado' />");
	var h= $(".helado");
	h.draggable();
	h.hover(overSabor);
	h.mousedown(downHelado);
	h.mouseup(upHelado);
	numBolas--;
	arrSabores.push(bola.attr("id"));
	if(numBolas==0){
		$("body").prepend("<img src=img/cereza.png id='cereza'>");
		var cer=$("#cereza");
		cer.css("position","absolute");
		cer.css("left","42.3em");
		cer.css("top",pos+2.8+"em");
		cer.css("z-index","3000");
		cer.css("display","none");
		cbCereza();
		$(".helado").draggable("destroy");
		
		var cuenta =$("#cuenta");
		cuenta.append("<h2>Bill</h2><h3>Flavors:</h3>");
		for(var i=0;i<arrSabores.length;i++){
			cuenta.append(arrSabores[i]+"<br />");
			total = 3*[i+1];

		}
		cuenta.append("<p id='totalCuenta'>Total: $"+total+" </p>   <button id='home'>another ice cream</button><br/>.");
		cuenta.show("blind","slow");
		$("#home").click(clickHome);

	}
	
		
	
	
}
function clickHome(){
	location.reload();
}

function cbCereza(){
var cer=$("#cereza");
cer.fadeIn("slow");
}

function clickConito(){
	$("#conos").effect("slide");
	

}

function clickBtnConos(){
	var num = $("#cmbConos").val();
	numBolas=num;
	$("#inicio").effect("blind","slow",cbClickConos);
	

}

function cbClickConos(){
	$("#contCono").fadeIn("slow");
	cambiarFondo();

	$("#sabores").effect("slide", { direction: "horizontal" }, 1000);
	//$("#sabores").show("clip",1000);
	$("#infoSabor").effect("slide", { direction: "horizontal" }, 1000);
}

function clickBanana(){
	
	$("#inicio").effect("blind","slow",cbClickBanana);

}

function cbClickBanana(){
	$("#contBanana").fadeIn("slow");
	cambiarFondo();

	$("#sabores").show("clip",1000);
	$("#infoSabor").effect("slide", { direction: "horizontal" }, 1000);
}

function cambiarFondo(){
	var bod=$("body");
	bod.css("background","url(img/prub.jpg)");
	bod.css("background-repeat","no-repeat");
	bod.css("background-attachment","fixed");
	bod.css("background-position","center");
}

function overSabor(){
	var sabor = $(this);
    var infoSabor = $("#infoSabor");
    var id = sabor.attr("id");
    infoSabor.html("<h2>"+id+"</h2>");
    if(id=="chocolate"){
      infoSabor.append("<img src='img/icoChocolate.png'/>");	
    }
    if(id=="strawberry"){
    	 infoSabor.append("<img src='img/icoFresa.png'/>");
    }
        if(id=="bubblegum"){
    	 infoSabor.append("<img src='img/icoChicle.png'/>");
    }
    if(id=="vainilla"){
    	 infoSabor.append("<img src='img/icoVainilla.png'/>");
    }
    if(id=="arequipe"){
    	 infoSabor.append("<img src='img/icoArequipe.png'/>");
    }
    if(id=="grape"){
    	 infoSabor.append("<img src='img/icoUva.png'/>");
    }    
}

var pos2=30;
var nBolas=0;
function dropBanana(event ,ui){

	var bola=ui.draggable;

	bola.unbind("mousedown");
	bola.removeClass("helado");
	bola.css("position","absolute");
	bola.css("left",pos2+"em");
	bola.css("top","12em");
	bola.css("z-index",capa);
	capa++;
	bola.addClass("heladoPedido");
	pos2 = pos2 +9;
	bola.draggable("destroy");
	$("#sabores").prepend("<img src='"+bola.attr('src')+"' id='"+bola.attr('id')+"'class='helado' />");
	var h= $(".helado");
	h.draggable();
	h.hover(overSabor);
	h.mousedown(downHelado);
	h.mouseup(upHelado);
	nBolas++;
	arrSabores.push(bola.attr("id"));
	
		if(nBolas==3){
		$("body").prepend("<img src=img/cereza.png id='cereza'>");
		var cer=$("#cereza");
		cer.css("position","absolute");
		cer.css("left","42.3em");
		cer.css("top","11em");
		cer.css("z-index","3000");
		cer.css("display","none");
		cbCereza();
		$(".helado").draggable("destroy");
		
		var cuenta =$("#cuenta");
		cuenta.append("<h2>Bill</h2><h3>Flavors Banana:</h3>");
		for(var i=0;i<arrSabores.length;i++){
			cuenta.append(arrSabores[i]+"<br />");
			total = 5*[i+1];

		}
		cuenta.append("<p id='totalCuenta'>Total: $"+total+" </p>   <button id='home'>another ice cream</button><br/>.");
		cuenta.show("blind","slow");
		$("#home").click(clickHome);

	}		
	
	
}