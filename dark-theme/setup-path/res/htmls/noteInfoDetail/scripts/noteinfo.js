var Tags = {
    availableTags: [],
    $tagInput: $('#tagInput'),
    $addTag: $('#addTag')
}

var readOnly = false;
var noteType = true;

function ShowElement(elementObject, bShow) {
    if (bShow) {
        elementObject.style.display = "";
    }
    else {
        elementObject.style.display = "none";
    }
}
//
function OnSourceTipClick() {
    var sourceTip = document.getElementById("sourceTip");
    sourceTip.style.display = "none";
    var sourceEdit = document.getElementById("sourceEdit");
    sourceEdit.style.display = "";
    sourceEdit.focus();
}

function OnNoteSourceClick() {

  var noteSource = document.getElementById("noteSource");
  YNote.OpenLink(noteSource.innerText);

}
function OnNoteSourceClickEdit() {
    var noteSourceOuter = document.getElementById("noteSourceOuter");
    noteSourceOuter.style.display = "none";
    var noteSource = document.getElementById("noteSource");
    var sourceEdit = document.getElementById("sourceEdit");
    sourceEdit.style.display = "";
    sourceEdit.value = noteSource.innerText;
    sourceEdit.focus();
}

function OnSourceEditKeydown() {
    if (event.keyCode == 13) {
        EndSourceEditInput();
    }
}

function OnSourceEditBlur() {
    EndSourceEditInput();
}

function EndSourceEditInput() {
    var sourceEdit = document.getElementById("sourceEdit");
    //对input的内容进行html encode
    var sourceEditValue = $('<div/>').text(sourceEdit.value).html();
    SetNoteSource(sourceEditValue);
    sourceEdit.style.display = "none";
    YNote.SaveSource(sourceEditValue);
}

function SetNoteSource(sourceValue) {
    var noteSourceOuter = document.getElementById("noteSourceOuter");
    var noteSource = document.getElementById("noteSource");
    var sourceTip = document.getElementById("sourceTip");
	var sourceTipButton = document.getElementById("editsourceButton"); 
    if (sourceValue.length > 0) {
        sourceTip.style.display = "none"
        noteSourceOuter.style.display = "inline-block";
        noteSource.innerHTML = sourceValue;
    }
    else {
        sourceTip.style.display = "";
        noteSourceOuter.style.display = "none";
    }
	
    if( readOnly )
	{
	    sourceTip.className = "disable1";
		sourceTip.onclick = null;
		sourceTipButton.style.display="none";
	}
}

//

var authorTipElementId = "authorTip";
var authorElmentId = "noteAuthor";
var authorEditorId = "authorEdit";
function OnAuthorTipClick() {
    var authorTip = document.getElementById(authorTipElementId);
    ShowElement(authorTip, false);
    var authorEdit = document.getElementById(authorEditorId);
    ShowElement(authorEdit, true);
    authorEdit.focus();
}

function OnNoteAuthorClick() {
    var author = document.getElementById(authorElmentId);
    ShowElement(author, false);
    var authorEdit = document.getElementById(authorEditorId);
    ShowElement(authorEdit, true);
    authorEdit.value = author.innerText;
    authorEdit.focus();
}

function OnAuthorEditKeydown() {
    if (event.keyCode == 13) {
        EndAuthorEditInput();
    }
}

function OnAuthorEditBlur() {
    EndAuthorEditInput()
}

function EndAuthorEditInput() {
    var authorEdit = document.getElementById(authorEditorId);
    //对input的内容进行html encode
    var authorEditValue = $('<div/>').text(authorEdit.value).html();
    SetNoteAuthor(authorEditValue);
    ShowElement(authorEdit, false);
    console.log(authorEditValue);
    YNote.SaveAuthor(authorEditValue);
}

function SetNoteAuthor(authorValue) {
    var author = document.getElementById(authorElmentId);
    var authorTip = document.getElementById(authorTipElementId);
    if (authorValue.length > 0) {
        author.style.display = "inline-block";
        ShowElement(authorTip, false);
        author.innerHTML = authorValue;
    }
    else {
        ShowElement(author, false);
        ShowElement(authorTip, true);
    }
	
	if( readOnly )
	{
	    authorTip.className = "disable1";
		authorTip.onclick = null;
		author.onclick = null;
	}
}

function OnViewModeSelectChange(object) {
    YNote.ChangeEditorMode(object.value);
}

function OnScaleSelectChange(object) {
    YNote.ChangeEditorScale(object.value);
}

function OnNoteHistoryClick() {
    YNote.ShowNoteHistory();
}

function OnNoteCharNumClick() {
    YNote.ShowNoteCharNum();
}

function OnClickDeleteTag(object) {
    var tagObject = object;
    YNote.DeleteTag(tagObject.getAttribute("data-tag-id"));
}

function OnClickAddTag(object) {
    ShowElement(object, false);
    var objectTagInput = document.getElementById("tagInput");

    Tags.$tagInput.autocomplete({
        source: Tags.availableTags
    });

    Tags.$tagInput.val('');
    Tags.$tagInput.show();
    Tags.$tagInput.focus();
}

function OnTagInputKeydown(object) {
    if (event.keyCode == 13) {
        object.blur();
    }
}

function OnTagInputBlur(object) {
    EndTagInput(object);
}

function EndTagInput(object) {
    Tags.$tagInput.hide();
    $('.ui-autocomplete').hide();
    if (object.value != undefined && object.value != null) {
        YNote.AddTags(object.value);
        console.log("end tag input");
    }
    ShowElement(object, false);
    document.getElementById("addTag").style.display = "inline-block";
}

//
function SetElementInnerTextById(strElementId, strInnerText) {
    var element = document.getElementById(strElementId);
    if (element) {
        element.innerText = strInnerText;
    }
}

function SetElementValueById(strElementId, value) {
    var element = document.getElementById(strElementId);
    if (element) {
        element.value = value;
    }
}

function SetCreateTime(strCreateTime) {
    SetElementInnerTextById("createTime", strCreateTime);
}

function SetUpdateTime(strUpdateTime) {
    SetElementInnerTextById("updateTime", strUpdateTime);
}

function SetReadModeSelect(selValue) {
    SetElementValueById("viewModeSelect", selValue);
}

function SetZoomScaleSelect(selValue) {
    SetElementValueById("scaleSelect", selValue);
}

function SetTags(tags) {

    if( readOnly )
	{
	    var addTag = document.getElementById("addTag");
		addTag.onclick = null;
		var addTagTip = document.getElementById("addTagTip");
		addTagTip.className = "disable1";
		return;
	}
    var i;
    var tagsHtml = "";

    for (i = 0; i < tags.length; ++i) {
        var tagSpan = '<span onclick="OnClickDeleteTag(this)" class="tag limitShow" data-tag-id="' + tags[i].tagId + '">' + tags[i].tagName + ' </span>'
        tagsHtml += tagSpan;
    }

    var tagsObject = document.getElementById("tags");
    if (tagsObject) {
        tagsObject.innerHTML = tagsHtml;
    }
}
function setNotebookIdAndName(notebookId, notebookName) {
    var notebookNameobj = document.getElementById('notebookName');
    notebookNameobj.setAttribute('notebookId', notebookId);
    notebookNameobj.innerText = notebookName;
}

function setSize(size){
   
   var sizeText ='';
   var K = 1024;
   var M = K * 1024;
   var G = M * 1024;
   if(size < K){
       //B
       sizeText = size + ' B';
   }
   else if(size < M){
      //K
      sizeText = (size/K).toFixed(1) + ' K';
   }
   else if(size < G){
      //M
      sizeText = (size/M).toFixed(1) + ' M';
   }
   else{
       //G
       sizeText = (size/G).toFixed(1) + ' G';
   }
   
   var sizeObj = document.getElementById('fileSize');
   sizeObj.innerText = sizeText;
}

function onChangeNotebook() {
 /*    obj = document.getElementById("notebookName");
    var id = obj.getAttribute("notebookId");
    obj = document.getElementById("iconChangeNotebook");
    var rect = obj.getBoundingClientRect();
    YNote.SelectNotebook(id, rect.left + 3, rect.bottom); */
}
function UpdateNoteHistory()
{
    if( !noteType )
    {
        var hitoryObj = document.getElementById("history");
        hitoryObj.style.display="none";
    }
    else
    {
        if( readOnly )
        {
            var hitoryObj = document.getElementById("showHistory");
            hitoryObj.onclick = null;
            hitoryObj.className = "disable1";
        }
    }
}
listApis["SetUserInfoData"] = function (datas) {
    var vJson = JSON.parse(datas);

	readOnly = vJson.readOnly;
    noteType = vJson.noteType;
	
    SetNoteSource(vJson.source);

    SetNoteAuthor(vJson.author);

    SetCreateTime(vJson.createTime);

    SetUpdateTime(vJson.updateTime);

    //SetReadModeSelect(vJson.editorMode);

    //SetZoomScaleSelect(vJson.zoomScale);
    
    setSize(vJson.size);

    setNotebookIdAndName(vJson.notebookId, vJson.notebookName);

    //SetTags(vJson.tags);

    Tags.availableTags = vJson.allTags;
	
	//UpdateNoteHistory();

    //YNote.ResetWindowHeight(document.body.clientHeight);
    //console.log("reset window height in html");
};

listApis["setNotebook"] = function (notebookId, notebookName) {
    setNotebookIdAndName(notebookId, notebookName);
}















