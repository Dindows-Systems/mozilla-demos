/* eDiary.js for eDiary 2013 */
//-----[track editor]
var editTracker = function () {
    var self = this;
    self.prevContentId = '';
    self.toggleEditor = false;
    self.hideEditor = function(){
        if(self.prevContentId !== '')
            saveClick(null, self.prevContentId);
    };
};
//-----[month selection]
var MonthDays = function()
{   var self = this;    
    self.months = [ {name:'',days:0},{name:"January",days:31},{name:"February",days:28},{name:"March",days:31},{name:"April",days:30},
                    {name:"May",days:31},{name:"June",days:30},{name:"July",days:31},{name:"August",days:31},
                    {name:"September",days:30},{name:"October",days:31},{name:"November",days:30},{name:"December",days:31} ];
    self.addMonths = function($sel)
    {
        $.each(self.months, function(idx, obj) { $sel.append($("<option></option>").attr("value",obj.days).text(obj.name)); });
    };
    self.addDays = function($sel,days)
    {
        $sel.empty();
        for(var i=1;i<=days;i++)
        { 
            if(i===1)
                $sel.append($("<option></option>").attr("value",'').text('')); 
            $sel.append($("<option></option>").attr("value",i).text(i)); 
        }
    };
    self.getDaysCount = function(month,days){
        var count=0;
        if(days !== ''){
            $.each(self.months, function(idx, obj) {
                if(idx===0){ return (month===obj.name) ? false : true; }
                if(month===obj.name) { count += parseInt(days); return false; }
                else count += obj.days;
            });
        }
        return count;
    };
    self.reset = function(){
        var $selMon = $('#selMonth');
        if($selMon.val()!==0)
        { $selMon.val(0); $('#selDay').empty(); }
    };
    self.getShortDate = function(dayNum){    
        var date1 = new Date(const_YEAR, 0);
        date1.setDate(dayNum);
        var arr = date1.toString().split(' ');
        return [arr[1]+ ' '+arr[2]+ ' '+arr[3], arr[0]];
    };
};
//------[init booklet]
function createBooklet() {      
    var str ='', book = $('#mybook'); 
    for(var i=2;i<=366;i+=2) //366
    {        
        if(i===366){  
           str += "<div class='pageFit'><div class='foldLeft'></div></div>";
           str +="<div class='b-page-cover'></div>";
        }
        else{
           str += "<div class='pageFit'></div>";
           str += "<div class='pageFit'></div>";
        }
    }
    $(".pageFit:first").after(str);    
    book.booklet({ covers: true, autoCenter: true, closed: true, width: '84%', height: '88%', pagePadding: 0, pageNumbers: false });
    book.bind("bookletstart", function(event, data) {  
        editTrace.hideEditor(); 
        mdObj.reset(); 
        if(data.index < (366+4) && data.index>2)
        {
            if(data.pages[0].innerHTML==='')
            {
                data.pages[0].innerHTML = addLeftContent(data.index-4);
                data.pages[1].innerHTML = addRightContent(data.index-3);
            }
            //Call indexeddb to fill page data
            if(data.index>3)
            {                
                if(data.index>4)
                    getContentByDate(data.index-4); //left
                getContentByDate(data.index-3); //right
            }
        }
    });
}
function addLeftContent(idx){
    var date = mdObj.getShortDate(idx);
    return '<div class="foldLeft">    </div>    <div class="contentLeft"> <div class="pageTopHead">'
+'<h5 class="left">'+ date[0] +'</h5>   <h5 class="right">'+ date[1] +'</h5> </div>'
+'<div class="clearFix">hidden clear fix</div> <div style="text-align: right;"> <img class="editHolder" onclick=\'return showHideEditor(this,"userContent'+ idx +'")\''
+' title="show/hide editor; click Save in editor to store locally" alt="write/edit" src="resource/images/drawpad_icon.png" />  </div>'
+'<div class="editorContainerLeft">    <form onsubmit=\'return saveClick(this,"userContent'+ idx +'")\'>    <div id="userContent'+ idx +'">'
+'</div>   </form>    </div>   </div>'; 
}
function addRightContent(idx){
    var date = mdObj.getShortDate(idx);
    return '<div class="foldRight">  </div>    <div class="contentRight">   <div class="pageTopHead">'
+'<h5 class="left left_r">'+ date[0] +'</h5>  <h5 class="right right_r">'+ date[1] +'</h5> </div>'
+'<div class="clearFix">hidden clear fix</div>  <div>  <img class="editHolder" alt="write/edit" src="resource/images/drawpad_icon.png"'
+' onclick=\'return showHideEditor(this,"userContent'+ idx +'")\' title="show/hide editor; click Save in editor to store locally"/> '      
+'</div> <div class="editorContainerRight">  <form onsubmit=\'return saveClick(this,"userContent'+ idx +'")\'>'
+'<div id="userContent'+ idx +'"></div>  </form>  </div>  </div>';
}
//------[init tinymce]
tinyMCE.init({
    width: "90%",
    height: "450",
    mode: "none",
    theme: "advanced",
    plugins: "save,paste",
    theme_advanced_buttons1: "save,newdocument,|,bold,italic,underline,separator,strikethrough,justifyleft,justifycenter,justifyright, justifyfull,bullist,numlist,undo,redo,link,unlink",
    theme_advanced_buttons2: "forecolor,backcolor,|,formatselect,fontselect,fontsizeselect",
    theme_advanced_buttons3: "",
    theme_advanced_toolbar_location: "top",
    theme_advanced_toolbar_align: "center",
    theme_advanced_statusbar_location: "bottom"
});
function saveClick(me,id) {
    var editor = tinyMCE.get(id);
    updateContentToDB(id, editor.getContent());
    editor.hide();
    showHideEditor(me, id); 
    return false;
}
function showHideEditor(me,id) {
    if(!editTrace.toggleEditor)
        {
            tinyMCE.execCommand("mceAddControl", true, id);
            editTrace.toggleEditor = !editTrace.toggleEditor;
            editTrace.prevContentId = id;
            setTimeout(function(){ updateEditorSize(); },100);
        }
    else
        {
            if(editTrace.prevContentId === id)
            {
                setTimeout(function(){ tinyMCE.execCommand("mceRemoveControl", false, id); editTrace.prevContentId = ''; },100);
                editTrace.toggleEditor = !editTrace.toggleEditor;
            }
            else
            {
                if(editTrace.prevContentId !== '')
                    {
                        editTrace.toggleEditor = !editTrace.toggleEditor;
                        tinyMCE.execCommand("mceRemoveControl", false, editTrace.prevContentId); 
                        editTrace.prevContentId = '';
                        showHideEditor(null,id);
                    }
            }                
        }
    return false;
}
//------[calendar]
function day_title(day_name){ return "<th align='center'>"+day_name+"</th>"; }
function fillTable(month,month_length){ 
  var day=1, str = "";
  str = "<TABLE style='border-collapse:collapse;border:1px solid black;' CELLSPACING=0 CELLPADDING=1><thead><TR class='title'>";
  str += "<th COLSPAN=7 ALIGN=center><B>"+month+"   "+const_YEAR+"</B></th></tr><TR  class='headings'>";
  str += day_title("Sun")+ day_title("Mon")+ day_title("Tue")+ day_title("Wed")+ day_title("Thu")+ day_title("Fri")+ day_title("Sat");
  // pad cells before first day of month
  str +="</TR></thead><tbody><TR>";
  for (var i=1;i<start_day;i++)
    str +="<TD></TD>";
  // fill the first week of days
  for (var i=start_day;i<8;i++,day++)
    str +="<TD ALIGN=center>"+day+"</TD>";
 str +="</tr><TR>";
  // fill the remaining weeks
  while (day <= month_length) {
     for (var i=1;i<=7 && day<=month_length;i++,day++){
         str +="<TD ALIGN=center>"+day+"</TD>";         
     }
     if(day <= month_length)
        str +="</TR><TR>";
     start_day=i;
  }
  str +="</TR></tbody></TABLE>";
  return str;
}
function loadCalendar(){
    var content = "";
    content += "<table border=0><tr>"; 
    for(var i=1;i<mdObj.months.length;i++){
        content += "<td valign=top>"+fillTable(mdObj.months[i].name, mdObj.months[i].days)+"</td>";
        if(i%3===0 && i < mdObj.months.length-1)
            content += "</tr><tr>";
    }
    content += "</tr></table>"; 
    document.querySelector(".coverCal").innerHTML = "<br/> <h2>Calendar 2013</h2>"+content;
}
//------[IndexedDB]
function initDB(){
    var dbName = "eDiary", dbVersion = 1;
    db.enableErrorLog = false;
    db.openDB(dbName,dbVersion,storeName,null,function(e){ setStatus("IndexedDB not supported or try refreshing",true); });
}
function getContentByDate(dayNum){ 
    var view = $("#userContent"+dayNum); 
    var date = new Date(const_YEAR, 0);
    date.setDate(dayNum); 
    if(view.html()===''){
        setStatus(null,true);
        db.getSingleRecord(storeName, date, function(data){
            if(data) view.html(data.content);
            setStatus(null,false);
        },function(e){ setStatus("Fetch failed",true); });
    }
}
function updateContentToDB(id,content){
    var dayNum = parseInt(id.replace("userContent",''),10);
    var date = new Date(const_YEAR, 0); date.setDate(dayNum);
    setStatus("Saving...",true);
    try{
        db.getSingleRecord(storeName, date, function(data){
            if(data){
                if(content){
                    //update if exists and has content
                    var oldRec = {"date":date,"content":content};
                    db.updateRecord(storeName, oldRec, function(e){ setStatus(null,false); },function(e){ setStatus("Save failed",true); });
                }
                else{
                    //delete if exists and has no content                
                    db.removeRecord(storeName, date, function(e){ setStatus(null,false); },function(e){ setStatus("Save failed",true); });
                }
            }
            else{
                if(content){
                    //insert if not exists and has content
                    var newRec = {"date":date,"content":content};
                    db.addSingleRecord(storeName, newRec, function(e){ setStatus(null,false); },function(e){ setStatus("Save failed",true); });
                }
                else setStatus(null,false);
            }
        },function(e){ setStatus("Save failed",true); });    
    }catch(e){ setStatus("Save failed",true); }
}
function setStatus(text,show){
    $stat = $("#status");    
    if(show){
        if(text) $stat.text(text); else $stat.text("Loading...");
        $stat.show(); 
    }
    else $stat.hide();
}
//------[Main]
var mdObj = new MonthDays(), editTrace = new editTracker(), const_YEAR = '2013'
    , start_day = (new Date("January 1, "+const_YEAR)).getDay() + 1, db = window.psGlobal, storeName = "Diary_2013";
$(document).ready(function(){
    $(".clsOver").css( { height: $(document).height(), width:$(document).width() } );
    var $selMon = $('#selMonth'), $selDay = $('#selDay'); 
    mdObj.addMonths($selMon);
    $selMon.change(function(){ mdObj.addDays($selDay, $(this).val()); });
    $selDay.change(function(){ 
        var daysCount = mdObj.getDaysCount( $(">option:selected:first",$selMon).text(), $(this).val() );
        $('#mybook').booklet("gotopage", daysCount+4);        
    });
    setTimeout(function(){ createBooklet(); loadCalendar(); initDB(); $(".clsOver").hide();  },0);
}); 
//---[fix sizes]
$(window).bind("resize load", function(){  
    if(this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function(){ $(this).trigger('resizeEnd'); }, 90); }).bind('resizeEnd', updateSize);
function updateSize(){
    var parent = $(".bookCover:first").parent();
    $(".bookCover, .coverEnd").css({"height":parent.height()-70, "width":parent.width()-70});  
    updateEditorSize();      
}
function updateEditorSize()
{
    if(editTrace.prevContentId !== ''){
        var ed = tinyMCE.get(editTrace.prevContentId); 
        if(ed){
            var height = $('#'+editTrace.prevContentId).parent().height(); 
            ed.theme.resizeTo('90%', height-60);
        }
    }
}
