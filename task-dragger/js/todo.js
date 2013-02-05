var shownList = "listCurrent";
// Stores all finished/done elements
var listFinished = [];
// Stores all starred elements
var listStarred = [];
// Stores all current tasks (starred and not starred) elements
var listCurrent = [];
// Stores all deleted elements
var listDeleted = [];
// Html of the element that is being transported
var taskContents = "";

function loadLists() {
	// Set the names
	listFinished.name = "listFinished";
	listStarred.name = "listStarred";
	listCurrent.name = "listCurrent";
	listDeleted.name = "listDeleted";
	updateListDeletedImg();
	// Show the main list
	showList("listCurrent");
}

function updateListDeletedImg() {
	var elementsFromListThis = [];
	var currentElementsOnThisList = getElementsFromList(listDeleted.name);
	if (!!currentElementsOnThisList && !!currentElementsOnThisList.length) {
		jQuery.merge(elementsFromListThis, currentElementsOnThisList);
		// Change the icon
		jQuery("#bin").attr("src", "images/bin_full.png");
	}
}
// Spits the code to be appended
function spitCode(str, listName){
	// TODO: How to remove the star?? (remove from the starred list)
	var myCode = '<li class="' + listName + '">' + str + '</li>';
	return myCode
}

// Retrieves the requested list
function getElementsFromList(listName) {
	// Retrieve the object from storage
	var retrievedObject = localStorage.getItem(listName);
	return JSON.parse(retrievedObject);
}

function showList(listName) {
	updateListDeletedImg();
	var arrList = getElementsFromList(listName);
	jQuery(".listNameToShow").hide();
	jQuery("#" + shownList).show();
	if (!!arrList && !!arrList.length) {
		var fullHtml = "";
		for (var i = 0, max = arrList.length; i<max; i++ ) {
			fullHtml += spitCode(arrList[i], listName);
		}
		jQuery("#tasks ul").html(fullHtml);
	} else {
		jQuery("#tasks ul").html("");
	}
	prepareDragables();
	jQuery(document).scrollTop(0);
}

// Stores the element
function storeElementInList(el, list) {

	// Refresh contents
	var elementsFromListThis = [];
	var currentElementsOnThisList = getElementsFromList(list.name);
	if (!!currentElementsOnThisList && !!currentElementsOnThisList.length) {
		jQuery.merge(elementsFromListThis, getElementsFromList(list.name));
	}
	// Check whether the element is on the list
	var position = jQuery.inArray(el, currentElementsOnThisList);
	// If the element has NOT been found
	if (position == -1) {
		// Add the new element to the list
		elementsFromListThis.push(el);
		// Put the list on local Storage
		localStorage.setItem(list.name, JSON.stringify(elementsFromListThis));
	}
}

function removeTaskFromList(el, list) {
	// Refresh contents
	var elementsFromListThis = [];
	var currentElementsOnThisList = getElementsFromList(list.name);
	if (!!currentElementsOnThisList && !!currentElementsOnThisList.length) {
		jQuery.merge(elementsFromListThis, getElementsFromList(list.name));
	}
	// Check whether the element is on the list
	var position = jQuery.inArray(el, currentElementsOnThisList);
	// If it is already exists
	if (position != -1) {
		// Add the new element to the list
		elementsFromListThis.splice(position,1);
		// Put the list on local Storage
		localStorage.setItem(list.name, JSON.stringify(elementsFromListThis));
	}
}

// Bind actions to click events
jQuery("#star").click(function() {
	shownList = "listStarred";
	showList(shownList);
});
jQuery("#bin").click(function() {
	shownList = "listDeleted";
	showList(shownList);
});
jQuery("#done").click(function() {
	shownList = "listFinished";
	showList(shownList);
});
jQuery("#new").click(function() {
	shownList = "listCurrent";
	showList(shownList);
});

// Bind actions to DOUBLE click events
jQuery("#star").dblclick(function() {
  showList("listStarred");
});
jQuery("#bin").dblclick(function() {
  if(confirm('Do you want to empty the bin?')) {
	  localStorage.removeItem("listDeleted");
	  shownList = "listDeleted";
	  showList(shownList);
	  jQuery("#bin").attr("src", "images/bin.png");
  }
});
jQuery("#done").dblclick(function() {
  if(confirm('Do you want to remove all empty tasks from the list?')) {
	  localStorage.removeItem("listFinished");
	  shownList = "listFinished";
	  showList(shownList);
  }
});
jQuery("#new").dblclick(function() {
  var taskName = prompt('Enter the name of the new task that you want to add','Buy some coffee');
  if (!!taskName) {
  		newTask = true;
	  	storeElementInList(taskName, listCurrent);
	  	showList(shownList);
  }
});


// Prepare the dragable elements (every time they change)
function prepareDragables() {
	$( ".cards li" ).draggable({ 
    	revert: 'invalid',
    	start: function(event, ui) {
    		taskContents = jQuery(this).html();
    	}   	
    });
}

function storeTaskOnList(newListName) {
	var oldList = getShownListArr(shownList);
	var newList = getShownListArr(newListName);
	// Store on the new list
	storeElementInList(taskContents, newList);
	// Remove from the old list
	removeTaskFromList(taskContents, oldList)
	// Refresh shown list
	showList(shownList);
}

function getShownListArr(listName) {
	var listArr;
	switch (listName) {
		case "listFinished":
			listArr = listFinished;
			break
		case "listStarred":
			listArr = listStarred;
			break
		case "listCurrent":
			listArr = listCurrent;
			break
		case "listDeleted":
			listArr = listDeleted;
			break
	}
	return listArr;
}

// Initializing function
$(function() {
    // Prepare the dropable elements (it's just done once)
    $( ".myButton" ).droppable({
		drop: function( event, ui ) {
			var newList = jQuery(this).find("img").attr("data-list");
			storeTaskOnList(newList);
		},
		hoverClass: "ui-state-hover"
    });
    loadLists();
});