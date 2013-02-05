var x =$(document);
x.ready(main);
var globalColor;
var globalLetra;

var num = 0;

function main(){
//localStorage.clear();
	



	var l = $("#letraContenedor");
	l.hide("fast");


	var o = $("#contenedorLera");
	o.css("display","none");

	var vol=$("#volver");
	vol.hide("fast");
	var letra;
	for (var i=1;i<=26;i++){
		letra = $("#"+i);
		letra.click(clickLetra);
	}
	var xx = $("#volver");
	xx.click(clickVolver);
	xx.mouseover(overVolver);
	xx.mouseout(overOut);
	
	var numSerialized = localStorage.getItem("num");
    num = JSON.parse(numSerialized);
	
	

	

		
}
function overVolver(){
	var x =$(this);
	x.attr("src","img/cerrarOver.png");
}
function overOut(){
	var x =$(this);
	x.attr("src","img/cerrar.png");
}
function clickVolver(){
	var x; 
	x= $("#contenedorLera");
	x.effect("fade","slow",aparecerLetras);	

	x=$("#volver");
	x.fadeOut("slow");


	var l = $("#letraContenedor");
	l.effect("explode");
	l = $("#contactos");
	l.fadeOut("slow");
}
function aparecerLetras(){


	var x= $("#letras");
	x.effect("slide");
	x.fadeIn("slow");

	x=$("#bod");
	x.css("background-color","#FFF");
}
function clickLetra(){
	//Efectos visuales
	var x; 
	x= $("#letras");
	//x.effect("blind");
	x.effect("drop", aparecerContenedor);	
	//
	var letra = $(this).text();
	
	globalLetra= letra;
	var color =$(this).css("background-color");
	globalColor=color;

	var letraCont=$("#letraContenedor");
	letraCont.html(letra);

	var contenedor=$("#contenedorLera");
	contenedor.css("background-color",color);
	loadContacts(letra);



}

function aparecerContenedor(){
	var o;
	o = $("#letraContenedor");
	o.effect("slide");
	o = $("#contactos");
	o.effect("slide");
	o = $("#contenedorLera");
	o.slideDown("slow",colorFondo);
	var vol=$("#volver");
	vol.slideDown("slow");
	
	var cont = $(".contacto");
	cont.hover(overContacto,outContacto);
	$(".btnEliminar").hide();
	var btnElim=$(".btnEliminar");
	btnElim.click(clickEliminar);
}
function colorFondo(){
	var b =$("#bod");
	b.css("background-color",globalColor);


}

function saveContact(){
	var nom = $("#txtNombre").attr("value");
	var tel = $("#txtTelefono").attr("value");
	
	var cor = $("#txtCorreo").attr("value");
	var dir = $("#txtDireccion").attr("value");

	var primeraL=nom.charAt(0).toUpperCase();
	
	if(primeraL==globalLetra){
	num++;

	var numSerialized = JSON.stringify(num);
 	localStorage.setItem("num", numSerialized);
	

	var str="<div id='contact" +num+"' class='contacto'><p class='btnEliminar' id='elim" +num+"'>x</p><span class='pre'>Name:</span>" +nom+"  <span class='pre'>Phone:</span>  "+tel+  "  <span class=pre>E-mail: </span>"+cor+" <span class=pre>Address: </span>"+dir+"  <hr /> <br /></div> ";
	var doc = $("#subCont").append(str);
	
	

	
	var cont = $(".contacto");
	cont.hover(overContacto,outContacto);
	var btnElim=$(".btnEliminar");
	btnElim.click(clickEliminar);
	var obj = new Object();
	obj.nombre=nom;
	obj.telefono=tel;
	obj.correo=cor;
	obj.direccion=dir;
		
	//arrNomAlbum.push(nomAl);	
	// Web Storage - JSON
	var objSerialized = JSON.stringify(obj);
 	localStorage.setItem("contact"+num, objSerialized);

	
	var cajas = $(".caja");
	cajas.attr("value","");
	
	}
	else{
	
	alert("Error, the name you entered does not begin with the letter " + globalLetra);
	}
}

function clickEliminar(){
var num = $(this).attr("id").substring(4);
var cont = $("#contact"+num);
cont.fadeOut("slow");
localStorage.removeItem("contact"+num);
}
function overContacto(){
var id=$(this).attr("id");
$("#"+id+" .btnEliminar").show();
}
function outContacto(){
var id=$(this).attr("id");
$("#"+id+" .btnEliminar").hide();
}

function loadContacts(letra){
var numSerialized = localStorage.getItem("num");
num = JSON.parse(numSerialized);
var primera;
var str="";
for (var i=1; i<num+1;i++){

var objSerialized = localStorage.getItem("contact"+i);
if(objSerialized!=null){
var obj = JSON.parse(objSerialized);
primera=obj.nombre.charAt(0).toUpperCase();

if(primera==letra){
str=str+"<div id='contact" +i+"' class='contacto'> <p class='btnEliminar' id='elim" +i+"'>x</p> <span class='pre'>Name:</span>" +obj.nombre+ " <span class=pre>Phone: </span> "  +obj.telefono+" <span class=pre>E-mail: </span>"+obj.correo+" <span class=pre>Address: </span>"+obj.direccion+" <hr />  <br /></div> ";
	var cont = $("#contact"+num);
	cont.hover(overContacto,outContacto);
}
}

}
$("#subCont").html(str);
}


