
$(function () {
	var dragIcon = document.createElement('img');
	dragIcon.src = 'img/record.gif';
	dragIcon.width  = 100;
	dragIcon.height = 100;

	// Create help popovers
	$(".help").each(function(){
		var hlp = $(this);
		var dta = hlp.data("for");
		dta = $("#"+dta);
		hlp.popover({
			title: "Help",
			html: true,
			content: dta.html(),
			trigger: "hover"
		});
		dta.remove();
	});

	// Create the music player
	var player = new Player();

	// Create albums
	var albums = [];
	for( var i=0; i<gAlbums.length; ++i ) {
		albums[i] = new Album({ model:gAlbums[i], dragIcon: dragIcon });
		albums[i].player = player;
		$("#music-catalog").append( albums[i].render().el );
	}
});

// ===========================================================================
var Album = Backbone.View.extend({
	albumTemplate: $("#album-template").html(),
	className: "album",
	tagName: "a",
	
	events: {
		"dd-drop.player": "onClear"
	},

	initialize: function() {
		this.$el
			.draggable({
				id:				"music",
				data: 			this.model,
				dragImage: 		this.options.dragIcon,
				dragImagePos:	{x:50, y:50}
			})
			.droppable({
				accepts: ".playing-album"
			});
	},

	render: function() {
		var html = Mustache.render(this.albumTemplate, this.model);
		this.$el.html( html );
		return this;
	},

	onClear: function(event, dta, srcElem) {
		this.$el.before( this.player.albumElem );
		this.player.albumElem.show();
		this.player.clear();
	}
});

// ===========================================================================
var Player = Backbone.View.extend({
	playerTemplate: 	$("#play-template").html(),
	controlsTemplate: 	$("#controls-template").html(),
	audioTemplate:  	$("#audio-template").html(),

	el: "#music-player",

	events: {
		"dd-drop.music .drop-zone": 	 	"onAlbumPlay",
		"dd-drop.music .playing-album":  	"onAlbumReplace",
		"click .back":						"prevTrack",
		"click .play":						"onPlayTrack",
		"click .stop":						"onStopTrack",
		"click .frwd":						"nextTrack",
	},

	initialize: function() {
		this.dragIcon = document.createElement('img');
		this.dragIcon.width  = 100;
		this.dragIcon.height = 100;
	
		this.$(".drop-zone")
			.droppable({
				accepts: ".album"
			});
		this.$(".playing-album")
			.draggable({
				id: "player",
				dragImage: 		this.dragIcon,
				dragImagePos:	{x:50, y:50}
			})
			.droppable({
				accepts: ".album"
			});

		this.trackIndex = 0;
		this.playlist = new Playlist({ el: "#music-playlist" });
		this.playlist.player = this;
	},

	render: function() {
		var dta = _.clone(this.model);
		dta.tracks = dta.tracks[ this.trackIndex ];
		var html = Mustache.render(this.playerTemplate, dta);
		this.$(".playing-album").html( html );

		this.playlist.setTracks( this.model.tracks, this.trackIndex );
		this.play();
		this.renderControls();
		this.playlist.render();

		this.$(".drop-zone").hide();
		this.$(".playing-album")
			.draggable("data", this.albumElem)
			.show();
		this.dragIcon.src = this.model.img;		
	},

	onAlbumPlay: function(event, dta, srcElem) {
		this.model = dta;
		this.albumElem = $(srcElem).hide();
		this.render();
	},
	
	onAlbumReplace: function(event, dta, srcElem) {
		this.model = dta; 
		this.albumElem.show();
		this.albumElem = $(srcElem).hide();
		this.render();
	},

	onAudioError: function() {
		$('<div class="alert alert-error">'+
          '  <button type="button" class="close" data-dismiss="alert">&times</button>'+
          '  <strong>Sorry dude!</strong> Your brouwser does not support OGG audio.'+
          '</div>').appendTo("#alerts-container");
	},

	onAudioReady: function() {
		this.renderControls();
		this.$(".time").show();
		this.$(".loading").hide();
		this.updateTime();
		this.interval = setInterval( $.proxy(this,"updateTime"), 1000);
	},

	onPlayTrack: function() {
		var audio = this.$("audio").get(0);
		if( audio.paused ) {
			audio.play();
		}
		else {
			audio.pause();
		}
		this.renderControls();
	},
	
	onStopTrack: function() {
		var audio = this.$("audio").get(0);
		audio.pause();
		audio.currentTime = 0;
		this.renderControls();
	},

	clearAudio: function() {
		this.$("audio").off("ended, progress, error, canplaythrough").remove();
		if( this.interval ) {
			clearInterval(this.interval);
			this.interval = null;
		}
	},

	clear: function() {
		this.clearAudio();
		this.$(".playing-album").empty();
		this.$(".drop-zone").show();
		this.playlist.clear();
		this.trackIndex = 0;
	},

	formatTime: function( timesegs ) {
		var mins = Math.floor( timesegs/60 );
		var segs = Math.ceil( timesegs%60 );
		if( mins<10 ) { 
			mins = "0"+mins; 
		}
		if( segs<10 ) { 
			segs = "0"+segs; 
		}
		return mins+":"+segs;
	},
	
	updateTime: function() {
		var audio = this.$("audio").get(0);
		this.$(".duration").text( this.formatTime( audio.duration) );
		this.$(".currentTime").text( this.formatTime( audio.currentTime) );
	},

	prevTrack: function() {
		var idx = this.playlist.getPrevTrackIdx();
		if( idx != -1 ) {
			this.trackIndex = idx;
			this.render();
		}
	},

	nextTrack: function() {
		var idx = this.playlist.getNextTrackIdx();
		if( idx != -1 ) {
			this.trackIndex = idx;
			this.render();
		}
	},
	
	play : function() {
		this.clearAudio();
		html = Mustache.render(this.audioTemplate, this.model.tracks[ this.trackIndex ]);
		this.$el.append( html );

		this.$("audio")
				.on("ended", 			$.proxy(this,"nextTrack"))
				.on("error", 			$.proxy(this,"onAudioError"))
				.on("canplaythrough", 	$.proxy(this,"onAudioReady"));
	},
	
	renderControls: function() {
		var dta = {
			paused:	this.$("audio").get(0).paused,
			next: 	this.playlist.getNextTrackIdx()!=-1,
			prev: 	this.playlist.getPrevTrackIdx()!=-1
		};
		html = Mustache.render(this.controlsTemplate, dta);
		this.$(".controls").html( html );
	}
});

// ===========================================================================
var Playlist = Backbone.View.extend({
	tracksTemplate: $("#tracks-template").html(),
	
	events: {
		"dd-drop.track .track": "onMoveTrack",
		"click .play":			"onPlayTrack"
	},

	setTracks: function(tracks, current) {
		this.model = _.map(tracks, function(value, key, list) {
			return _.extend({
				index: key,
				current: (key==current)
			},value);
		});
	},

	render: function() {
		this.$el.empty();

		html = Mustache.render(this.tracksTemplate, this.model);
		this.$el.html( html );

		this.$(".track").not("last").draggable({
			id: 	"track",
		});
		this.$(".track").droppable({
			id: 		"track",
			accepts:	".track"
		});
		this.$(".track").eq( this.player.trackIndex ).addClass("current");
	},

	clear: function() {
		this.$el.empty();
	},

	onMoveTrack: function(event, dta, srcElem) {
		$(event.currentTarget).before(srcElem);
		this.player.renderControls();
	},

	onPlayTrack: function(event) {
		event.preventDefault();

		var index = $(event.currentTarget).parentsUntil(this.el, ".track").data("index");

		this.$(".current").removeClass("current");
		this.$(".track").eq(index).addClass("current");
		this.player.trackIndex = index;
		this.player.render();
	},

	getTrackIdx: function() {
		return this.$(".track.current").data("index") || -1;
	},
	
	getNextTrackIdx: function() {
		var idx = this.$(".track.current").next().data("index");
		return  _.isNumber(idx)? idx : -1;
	},

	getPrevTrackIdx: function() {
		var idx = this.$(".track.current").prev().data("index");
		return  _.isNumber(idx)? idx : -1;
	}
});