/*global $, window, document, prettyPrint, localStorageDB*/
var db, active_project, num_projects, num_tickets, num_snippets, active_projects = [], tickets;

function getCountSnippets() {
	return db.rowCount('snippets');
}

function comparePublishedDate(obj1, obj2) {
	var priority_levels = ['low','normal','high'], p1 = obj1.priority, p2 = obj2.priority;
	if(p1!==p2) {
		return priority_levels.indexOf(p2) - priority_levels.indexOf(p1);
	} else {
		return obj2.date - obj1.date;
	}
}

$(document).ready(function() {
	var url;
	if(!db) {
		db = new localStorageDB("pmt");
	}
	if(!db.tableExists('projects')) {
		db.createTable('projects', ['title','active']);

		//insert initial data
		db.insert('projects', {title: 'Around the World', active: 1});
		db.insert('projects', {title: 'Tutorials website', active: 0});
		db.insert('projects', {title: 'Javascript library', active: 0});
	}
	if(!db.tableExists('snippets')) {
		db.createTable('snippets', ['title','code']);

		//insert initial data
		db.insert('snippets', {title: 'Random float in php', code: 'function random_float($min,$max) {\n'+
		'return ($min+lcg_value()*(abs($max-$min)));\n'+
		'}'
		});
	}
	if(!db.tableExists('tickets')) {
		db.createTable('tickets', ['title','date','priority','status','projectid']);

		//insert initial data
		db.insert('tickets', {title: 'Create database', date: new Date().getTime(), priority: 'high', status: 'open', projectid: 1});
		db.insert('tickets', {title: 'Insert test data to database', date: new Date().getTime(), priority: 'normal', status: 'open', projectid: 1});
		db.insert('tickets', {title: 'Create config files', date: new Date().getTime(), priority: 'low', status: 'open', projectid: 1});
		db.insert('tickets', {title: 'Create js files', date: new Date().getTime(), priority: 'low', status: 'open', projectid: 3});
	}
	db.commit();

	active_project = db.query('projects',{active: 1});
	if(active_project) {
		var i, len, active_project_str = '';
		for(i = 0, len = active_project.length; i < len; i+=1) {
			active_projects.push(active_project[i].ID);
			active_project_str += '<div class="project" data-id="'+active_project[i].ID+'"><span>'+active_project[i].title+'</span></div>';
		}
		$('#active_project').html(active_project_str);
	}

	num_projects = db.rowCount('projects');
	//num_tickets = db.rowCount('tickets');
	num_snippets = getCountSnippets();//db.rowCount('snippets');
	tickets = db.query('tickets',
	function(row) {
		/*var ret;
		if(active_projects.indexOf(row.projectid) !== -1) {
			ret = true;
		} else {
			ret = false;
		}*/
		var ind = $.inArray(row.projectid, active_projects);
		if(ind <= -1 || row.status === 'closed') {
			return false;
		} else {
			return true;
		}
		//return ret;
	}).sort(comparePublishedDate);
	num_tickets = tickets.length;
	$('.links a.ico1 span.num').text(num_projects);
	$('.links a.ico2 span.num').text(num_tickets);
	$('.links a.ico3 span.num').text(num_snippets);

	$('ul.tabset a').on('click',function() {
		$('ul.tabset li').removeClass('active');
		$(this).parent().addClass('active');
	});

	url = window.location.href.split('/').pop();
	switch(url)
	{
	case 'projects.html':
		$('ul.tabset li').removeClass('active');
		$('ul.tabset li a.ico3').parent().addClass('active');
	break;
	case 'snippets.html':
		$('ul.tabset li').removeClass('active');
		$('ul.tabset li a.ico4').parent().addClass('active');
	break;
	case 'archive.html':
		$('ul.tabset li').removeClass('active');
		$('ul.tabset li a.ico5').parent().addClass('active');
	break;
	case 'tickets.html':
		$('ul.tabset li').removeClass('active');
		$('ul.tabset li a.ico2').parent().addClass('active');
	break;
	default:
		$('ul.tabset li').removeClass('active');
		$('ul.tabset li a.ico1').parent().addClass('active');
	}
});


function getActiveProjects() {
	var i, len, projects = [];
	active_project = db.query('projects',{active: 1});
	if(active_project) {
		for(i = 0, len = active_project.length; i < len; i+=1) {
			projects.push(active_project[i].ID);
		}
	}
	return projects;
}
function getActiveProjectsWithNames() {
	return db.query('projects',{active: 1});
}

function getCountTickets(active_projects) {
	tickets = db.query('tickets',
	function(row) {
		var ret;
		if(active_projects.indexOf(row.projectid) !== -1 && row.status === 'open') {
			ret = true;
		} else {
			ret = false;
		}
		return ret;
	});
	return tickets.length;
}
function getTickets(active_projects, status, limit) {
	tickets = db.query('tickets',
	function(row) {
		var ret;
		if(active_projects.indexOf(row.projectid) !== -1 && row.status === status) {
			ret = true;
		} else {
			ret = false;
		}
		return ret;
	}, limit).sort(comparePublishedDate);
	return tickets;
}

function deleteTicket(id) {
	db.deleteRows('tickets', {ID: id});
	db.commit();
}

function editTicket(id, title, priority, status) {
	db.update("tickets", {ID: id}, function(row) {
		row.title = title;
		row.priority = priority;
		row.status = status;
		return row;
	});
	db.commit();
}

function addTicket(title, priority, pid) {
	var lastid = db.insert("tickets", {title: title, date: new Date().getTime(), priority: priority, status: 'open', projectid: pid });
	db.commit();
	return lastid;
}

function deleteProject(id) {
	db.deleteRows('projects', {ID: id});
	db.commit();
}

function addProject(title) {
	var lastid = db.insert("projects", {title: title, active: 0});
	db.commit();
	return lastid;
}

function setActiveProject(id) {
	db.update('projects', {ID: id}, function(row) {
		row.active = 1;
		return row;
	});
	db.commit();
}

function setUnActiveProject(id) {
	db.update('projects', {ID: id}, function(row) {
		row.active = 0;
		return row;
	});
	db.commit();
}

function addSnippet(title, code) {
	var lastid = db.insert("snippets", {title: title, code: code});
	db.commit();
	return lastid;
}

function deleteSnippet(id) {
	db.deleteRows('snippets', {ID: id});
	db.commit();
}

function htmlEntities(str) {
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}