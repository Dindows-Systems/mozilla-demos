/*
  IndexDB.js
  Version: 2.1
  Date: 28-Nov-2012
  Updated: 6-Dec-2012 (bug fixes)    //Modified for date Key
  Author: Raju Dasa (rajudasa.blogspot.com)
  As per today, 2 browser are (following standards) supporting IndexedDB: FF16.02 & Chrome23 
*/
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var psGlobal = function(){
	var self = this, yetToPopulate = false, db = null;

	//singleton impl
	if ( arguments.callee._singletonInstance )
    	return arguments.callee._singletonInstance;
  	arguments.callee._singletonInstance = self;

	function onerror(e,path) {
		//possibilities: User denied permission or version used is less than existing in browser(VER_ERR)
		if(self.enableErrorLog)	
	 		console.log("IndexDB Error: " + e.target.errorCode + " in call: " + path);
	}

	self.enableErrorLog = true;

	self.openDB = function(name,ver,storeName,successCallback,failCallback) {
	  yetToPopulate = false; //bug fix: here on 6-Dec-2012
	  var req = window.indexedDB.open(name,ver);
	  req.onsuccess = function(e) {
	    db = e.target.result;
	    if(successCallback)
		    successCallback({status:"success", fillRecords: yetToPopulate});
	    //else self.readRecords();
	  };
	  req.onupgradeneeded = function(e) { //event called when version changes
	    db = e.target.result;
	    if (db.objectStoreNames.contains(storeName))
	      db.deleteObjectStore(storeName);
	    //Key can be: string,float,Array,Date (non-autoIncrement); int (autoIncrement)
	    //ex: { keyPath: "date", autoIncrement:false }  
	    //and use 'unique Date' values for this 'date' property in ur json while insertion.	
	    db.createObjectStore(storeName,{ keyPath: "date", autoIncrement:false }); 
	    yetToPopulate = true;
	  };
	  req.onerror = function(e){ onerror(e,"openDB"); if(failCallback) failCallback(e); };
	  //use db.onerror for centralized error handling
	};

	self.addRecords = function(storeName,jsonData,successCallback,failCallback) {	    
	  var tran = db.transaction([storeName], "readwrite");  //IDBTransaction.READ_WRITE ->support dropped
	  tran.oncomplete = function(e) {
	  	if(successCallback)
	  		successCallback({status:"Transaction success"}); //called last
	  }; 
	  tran.onerror = function(e) { //bug fix: here on 6-Dec-2012
	    onerror(e,"addRecords (Transaction failed, rollbacked).");
	    if(failCallback) failCallback(e); 
	  };
	  var store = tran.objectStore(storeName);  
	  jsonData.forEach( function(obj) { 
	    var req = store.add(obj); 
	    //req.onsuccess = function(e) { console.log("data added!"); }; //called first	    
	  	req.onerror = function(e){ if(self.enableErrorLog) console.log("one record add failed: ", e); }; //ignorable for handling
	  });
	};	

	self.addSingleRecord = function(storeName,object,successCallback,failCallback) {	    
	  var tran = db.transaction([storeName], "readwrite");
	  var req = tran.objectStore(storeName).add(object);  
	  req.onsuccess = function(e) { 
	  	var result = e.target.result;  //or req.result
	  	if(successCallback) successCallback(result); //result -> key 
	  };
	  req.onerror = function(e){ 
	  	onerror(e,"addSingleRecord");
	    if(failCallback) failCallback(e);
	  };
	};

	self.updateRecord = function(storeName,object,successCallback,failCallback) {	    
	  var tran = db.transaction([storeName], "readwrite");
	  var req = tran.objectStore(storeName).put(object);  
	  req.onsuccess = function(e) { 
	  	var result = e.target.result;  //or req.result
	  	if(successCallback) successCallback(result); //result -> key 
	  };
	  req.onerror = function(e){ 
	  	onerror(e,"updateRecord");
	    if(failCallback) failCallback(e);
	  };
	};

	self.getAllRecords = function(storeName,successCallback,failCallback) {
	  var trans = db.transaction([storeName]); //"readonly" -> Default	  
	  var records = [];
	  trans.oncomplete = function(e) {
	  	if(successCallback)
	  		successCallback(records); //called last
	  }; 
	  trans.onerror = function(e) { //bug fix: here on 6-Dec-2012
	    onerror(e,"getAllRecords (Transaction failed).");
	    if(failCallback) failCallback(e); 
	  };
	  var req = trans.objectStore(storeName).openCursor(); 
	  req.onsuccess = function(e) {
	    var cursor = e.target.result;  	     
	    if(cursor) {	    
		    //console.log(cursor.key);
		    records.push(cursor.value); //cursor.value.name
		    cursor.continue(); //iterates success
	    }
	  };
	  req.onerror = function(e){ if(self.enableErrorLog) console.log("one record fetch failed: ", e); }; //ignorable for handling
	};

	self.getSingleRecord = function(storeName,key,successCallback,failCallback) {
	  var trans = db.transaction([storeName],"readonly");
	  var req = trans.objectStore(storeName).get(key); 
	  req.onsuccess = function(e) {
	    var result = e.target.result;  //or req.result
    	if(successCallback) successCallback(result);
	  };
	  req.onerror = function(e){ 
	  	onerror(e,"getSingleRecord");
	    if(failCallback) failCallback(e);  
	  };
	};

	self.removeRecord = function(storeName,key,successCallback,failCallback) {
	  var trans = db.transaction([storeName],"readwrite"); 
	  var req = trans.objectStore(storeName).delete(key); 
	  req.onsuccess = function(e) {	    
    	if(successCallback) successCallback(key);
	  };
	  req.onerror = function(e){ 
	  	onerror(e,"removeRecord");
	    if(failCallback) failCallback(e);  
	  };
	};

	self.getCount = function(storeName,successCallback,failCallback) {
	  var trans = db.transaction([storeName]); 
	  var req = trans.objectStore(storeName).count(); //key can be passed 
	  req.onsuccess = function(e) {	
    	if(successCallback) successCallback(e.target.result); //returns count
	  };
	  req.onerror = function(e){ 
	  	onerror(e,"count");
	    if(failCallback) failCallback(e);  
	  };
	};

	self.clearRecords = function(storeName,successCallback,failCallback) {
	  var trans = db.transaction([storeName],"readwrite"); 
	  var req = trans.objectStore(storeName).clear();
	  req.onsuccess = function(e) {	
    	if(successCallback) successCallback({status:"success"}); //e.target.result -> returns undefined
	  };
	  req.onerror = function(e){ 
	  	onerror(e,"clearRecords");
	    if(failCallback) failCallback(e);  
	  };
	};

};
//overshadow psGlobal as obj insteadof class
window.psGlobal = new psGlobal();
