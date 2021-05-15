var zoomData = 100;
var minZoom = 100;
var maxZoom = 300;
var deltaZoom = 25;
var currentSelectedBkElement = null;

function handleMessageFromClient(msgType, param1, param2, param3) {
    if(msgType == 'InitView') {
        var infos = JSON.parse(param1);
        InitInfos(infos);
    }
}

function InitInfos( infos ){
    //viewMode
    var iViewMode = infos.viewMode;
    UpdateViewMode(iViewMode);
    
    //zoom value
    setZoomValue(infos.zoomValue);
    
    //back images
    if(infos.hideBgList){
        HideBgInfo();
    }
    else{
        updateBgInfo(infos.BgList);
    }
    
 }
 
 function updateViewModeSelect(element, selected){
    if(selected){
	    element.className = "divView divViewSelect";
	}
	else{
	   element.className = "divView";
	}
    
 }

function UpdateViewMode(currentMode){
    updateViewModeSelect(document.getElementById('viewModeNormal'), currentMode==0);
	updateViewModeSelect(document.getElementById('viewModeReading'), currentMode==1);
	updateViewModeSelect(document.getElementById('viewModePage'), currentMode==2);
}

function EnableZoomBtn(btnElement, enable){
   if(enable){
	    btnElement.className= 'btnZoom btnZoomEnable';
	}
	else{
	    btnElement.className= 'btnZoom btnZoomDisable';
	}
}

function setZoomValue( newZoomValue){
    zoomData = newZoomValue;
    var zoomSpan = document.getElementById('zoomValue');
    zoomSpan.innerText = zoomData + '%';
	var btnZoomout = document.getElementById('btnZoomout');
	EnableZoomBtn(document.getElementById('btnZoomout'), zoomData > minZoom);
	EnableZoomBtn(document.getElementById('btnZoomin'), zoomData < maxZoom);
}

function CreateBgElement(url, parentElement){
    url = encodeURI(url);
    url = url.replace(/'/g, "\\\'");
    var bgDiv = document.createElement('div');
    bgDiv.className = 'bgButton';
    bgDiv.setAttribute('onclick', 'handleBgClick()');
    bgDiv.style.backgroundImage = 'url(' + url + ')';
    parentElement.appendChild(bgDiv);
    var bgDivMask = document.createElement('div');
    bgDivMask.className = 'bgImageMask'; 
    bgDiv.appendChild(bgDivMask);
    return bgDiv;
}

function SelectBgElement(ele){
    if(currentSelectedBkElement != ele){
        if(currentSelectedBkElement != null){
            currentSelectedBkElement.className = 'bgButton';
        }
        
        currentSelectedBkElement = ele;
        currentSelectedBkElement.className = 'bgButton bgButtonSelect';
    }
}

function updateBgInfo(bgList) {
    var freeBgDiv = document.getElementById('freeBg');
    freeBgDiv.innerHTML = "";
    var noBgEle = CreateBgElement('blank.jpg', freeBgDiv);
    
    var vipBgDiv = document.getElementById('VipBg');
    vipBgDiv.innerHTML = "";
    var freeBgCount = 1;
    for(var i = 0; i < bgList.length; ++i) {
        var newEle = null;
        if(bgList[i].isForVIP == true) {
            newEle = CreateBgElement(bgList[i].URI, vipBgDiv);
        }
        else {
            newEle = CreateBgElement(bgList[i].URI, freeBgDiv);
			++freeBgCount;
        }
        
        if(bgList[i].isSelect == true){
            SelectBgElement(newEle);
        }
    }
    
    if(currentSelectedBkElement == null){
        SelectBgElement(noBgEle);
    }
	var freeBgInner = document.getElementById('freeBgInner');
	freeBgInner.style.height= 28 + (Math.ceil(freeBgCount/3))*72 + 'px';
}

function HideBgInfo(){
    var noteBgDiv = document.getElementById('noteBgDiv');
    noteBgDiv.style.display = "none";
}


function getImageFromBkDiv(ele){
    var url = ele.style.backgroundImage;
	var filePath = url.substring(5,url.length-2);
	return filePath;
}

function handleBgClick() {
    var bgDiv = window.event.target.parentElement;
    var filePath = getImageFromBkDiv(bgDiv);
    
    if( window.YNote){
        var filePathTmp = filePath;
        if(filePathTmp == 'blank.jpg') {
            filePathTmp = 'NoBackground';
        }
        window.YNote.setBg(filePathTmp);
    }
	updateSelectBg(filePath);
}

function findBgImageDiv(parentEle, bgImage){
    var i = 0;
	for(i = 0; i < parentEle.children.length; ++i){
	    var tmp = getImageFromBkDiv(parentEle.children[i]);
		if( tmp === bgImage){
			return parentEle.children[i];
		}
	}
	return null;
}

function updateSelectBg(bgImage){
    var freeBgImageEle = findBgImageDiv(document.getElementById('freeBg'), bgImage);
	if(freeBgImageEle==null){
	    freeBgImageEle = findBgImageDiv(document.getElementById('VipBg'), bgImage);
	}
	SelectBgElement(freeBgImageEle);
}

function handleNormalViewClick() {   
    SetViewMode(0);
}

function handleReadViewClick() {
   SetViewMode(1);
}

function handlePageViewClick() {
   SetViewMode(2);
}

function SetViewMode(mode){
    UpdateViewMode(mode);
	if( window.YNote ){
        window.YNote.setEditMode(mode);
    }
}

function SetZoom(zoomValue){
    setZoomValue(zoomValue);
    if( window.YNote ){
       window.YNote.setZoomData(zoomValue);
    }
}

function handleZoomInc() {
    if(zoomData < maxZoom) {
        SetZoom( zoomData + deltaZoom);
    }
}

function handleZoomDec() {
    if(zoomData > minZoom){
        SetZoom( zoomData - deltaZoom);
    }
}