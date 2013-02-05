$(document).ready(main);
var nCat=1;
function main(){

	var dr=$("#dropp");
	dr.css("background","url(img/plato.png)");
	dr.css("background-repeat","no-repeat");
	dr.css("background-position","center");
	var ct=$("#cuenta");
	ct.css("background","url(img/ct.png)");
	ct.css("background-repeat","no-repeat");
	ct.css("background-position","center");
	establecerPropiedades();

	
	dr.droppable({drop:droppPlato });
	dr.droppable({accept:".imagen" });
	//dr.droppable({accept:".tachuela"});
	//dr.droppable({out:outTachuela});
	
	var carta=$("#carta");
	carta.css("background","url(img/fondo.jpg)");
	//carta.css("background-repeat","no-repeat");
	var m=$(".moneda").draggable();
	m.mousedown(downMoneda);
	m.mouseup(upMoneda);
	propinasMesero();
	
	$("body").css("background","url(img/fondoRes.jpg)");
	//$("body").css("background-repeat","no-repeat");
}

function downMoneda(){
	var moneda =$(this);
	$("#mesero").css("border","1px dashed white");
	moneda.css("z-index","300");
}

function upMoneda(){
	$("#mesero").css("border","none");
}

function propinasMesero(){
	var mesero = $("#mesero");
	mesero.droppable({drop:dropMesero});
	mesero.droppable({accept:".moneda"});
}
var idMoneda;
var rutaMoneda;
var valMoneda;
function dropMesero(event,ui){
	moneda = ui.draggable;
	idMoneda= moneda.attr("id");
	rutaMoneda=moneda.attr("src");
	valMoneda = moneda.attr("value");
	moneda.fadeOut("slow",cBackMondeda);
	
	

}
function cBackMondeda(){
	var mon = $("#"+idMoneda);
	mon.remove();
	drawMoneda();
}
function drawMoneda(){
	$("#carta").append("<img src='"+rutaMoneda+"' id='"+idMoneda+"' class='moneda' value='"+valMoneda+"' style='display:none'>");
	var mon = $("#"+idMoneda);
	mon.fadeIn("slow");
	var m=$(".moneda").draggable();
	m.mousedown(downMoneda);
	m.mouseup(upMoneda);

	$("#cuenta").append("Tip"+"<p>$"+valMoneda+"</p>");
	total = total+parseInt(valMoneda);
	$("#total").html("Total: $"+total);

}
function establecerPropiedades(){
	var img=$(".plato img");
	img.draggable();
	img.draggable({stop:stopDragg});
	img.mousedown(downImg);
	img.mouseup(upImg);
	

}
function stopDragg(){
	var img=$(this);
	img.css("position","relative");
	img.css ("left","0em");
	img.css ("top","0em");
	
}



function downImg(){
	var img=$(this);

	$(".plato img").css("z-index","100");
	img.css("z-index","2000");

	$("#dropp").css("opacity","0.8");
	$("#dropp").css("border","1px dashed white");

	$("#dropp2").show(1000);
	$("#dropp2").html("D<br/>e<br/>s<br/>c<br/>r<br/>i<br/>p<br/>t<br/>i<br/>o<br/>n<br/><img src='img/down.gif'>");
	}

function upImg(){
	$("#dropp").css("opacity","1");	
	$("#dropp").css("border","none");
	var desc=$("#dropp2");
	desc.hide(1000);
	desc.droppable({drop:dropBarra});
}

function dropBarra(event , ui){
	var plt = ui.draggable;
	var ruta = plt.attr("src");
	var des=$("#descripcion");
	des.css("z-index","3000");
	des.show("drop",1000);
	var texto = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
	des.html("<p>"+texto+" </p><img src='"+ruta+"' class='imgDes'/> <img src='img/izq.png' class='back'/>");
	$(".back").mousedown(clickBack);
}

var total=0;
function droppPlato(event, ui){
	var plato = ui.draggable;
	$(".plato img").draggable({stop:function(){}});
	plato.fadeOut("slow",callBack);
	var id = plato.attr("id");
	var ruta = plato.attr("src");
	$("#platosDropp").append("<img src='"+ruta+"' id='"+id+"'  class='peq'/>");
	var num = plato.attr("id").substring(3);
	var precio=$("#pre"+num).text();
	var nombre = $("#nom"+num).text();
	var pre = parseInt(precio.substring(1));
	total = total+pre;
	var cuenta=$("#cuenta").append(nombre+"<p>"+precio+"</p>");
	$("#total").html("Total: $"+total);

}	
function callBack(){
	var img=$(this);
	img.fadeIn("fast");
	img.css("position","relative");
	img.css("left","0em");
	img.css("top","0em");
	establecerPropiedades();
}

function clickDerecha(){
	$(".plato").fadeOut("slow",cbFlechas);	
	$("#carta h2").fadeOut("slow",cbFlechas);
	nCat++;	
	if(nCat>4){
		nCat=1;
	}	
}

function clickIzquierda(){
	$(".plato").fadeOut("slow",cbFlechas);	
	$("#carta h2").fadeOut("slow",cbFlechas);
	nCat--;	
	if(nCat<1){
		nCat=4;
	}	
}

function cbFlechas(){
	$(".plato").fadeIn("slow");	
	$("#carta h2").fadeIn("slow");
	cambiarCategoria(nCat);
}

function cambiarCategoria(numCat){

	if(numCat==1){
		cambiarNombres("Entrees","Shrimp cocktail and seafood","Chicken Crepes with Mushrooms","Mushrooms stuffed with ham and cheese","Pork ribs in barbecue sauce","$15","$17","$16","$18");
		$("#img1").attr("src","img/entrada1.png");
		$("#img2").attr("src","img/entrada2.png");
		$("#img3").attr("src","img/entrada3.png");
		$("#img4").attr("src","img/entrada4.png");
	}				
	if(numCat==2){
		cambiarNombres("Main courses","Filete lomo stroganoff","Filet mignon","Pollo grille","Pechuga ala plancha","$23","$22","$20","$22");
		$("#img1").attr("src","img/carne1.png");
		$("#img2").attr("src","img/carne2.png");
		$("#img3").attr("src","img/carne3.png");
		$("#img4").attr("src","img/carne4.png");
	}
	if(numCat==3){
		cambiarNombres("Desserts","Waffle with ice cream","Sweet desert","Ice cream","Strawberry cake","$7","$9","$5","$7");
		$("#img1").attr("src","img/postre1.png");
		$("#img2").attr("src","img/postre2.png");
		$("#img3").attr("src","img/postre3.png");
		$("#img4").attr("src","img/postre4.png");
	}
	if(numCat==4){
		cambiarNombres("Beverages","Juice","Soda","Beer","Coffe","$5","$4","$7","$4");
		$("#img1").attr("src","img/bebida1.png");
		$("#img2").attr("src","img/bebida2.png");
		$("#img3").attr("src","img/bebida3.png");
		$("#img4").attr("src","img/bebida4.png");
	}
}

function cambiarNombres(cat, nom1, nom2, nom3, nom4, pre1, pre2, pre3, pre4){
		$("#carta h2").html(cat);
		$("#nom1").html(nom1);
		$("#nom2").html(nom2);
		$("#nom3").html(nom3);
		$("#nom4").html(nom4);	

		$("#pre1").html(pre1);
		$("#pre2").html(pre2);
		$("#pre3").html(pre3);
		$("#pre4").html(pre4);	
}



function clickBack(){
	var des=$("#descripcion");
	des.effect("drop",1000);
	des.css("z-index","0");
}