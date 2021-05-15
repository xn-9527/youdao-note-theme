var topMargin = 16;
var rulerHeigt = 19; //标尺图片的高度
var fontSize = 12;  //字体大小
var txtDiveGap = 20;
var recordList = [];
var timerPlay = null;
var curIndex = 0; //当前播放的段数
var curPosition = 0.0; //当前播放段数中的具体时间位置
var curMoveInterval = 1; //当前移动的距离
var curTimerInterval = 100; //默认定时器时间间隔
var curSpeed = 1;//默认的播放速度
var cursorBottom = 0;
var curSorLeft = 0;
var isReadOnly = false;

var resizeElement = document.getElementById('textContainer');
var resizeCallback = function() {
    refreshUI();
};   
   
function handleMessageFromClient(msgType, param1, param2, param3) {
    if(msgType == "updateRecordInfo") {   
        var newRecordInfo = JSON.parse(param1);
        var isNewNote = param2;
        updateVoiceRecordInfo(newRecordInfo.recordList, isNewNote); 
    }
    else if(msgType == "updatePlayPosition") {
        updateRecordPosition(param1, param2);
    }
    else if(msgType == "play") {
        play();
    }
    else if(msgType == "pause") {
        pause();
    }
    else if(msgType == "preItem") {
        jumpItem(-1);
    }
    else if(msgType == "nextItem") {
        jumpItem(1);
    }
    else if(msgType == "normalSpeed") {
        moveBySpeed(1);
    }
    else if(msgType == "fastSpeed") {
        moveBySpeed(2);
    }
    else if(msgType == "clear") {
        clear();
    }
    else if(msgType == "clearSelection") {
        clearSelection();
    }
    else if(msgType == "readOnly") {
        isReadOnly = param1;
    }
    else if(msgType == "playOver") {
        playOver();
    }
}

function updateVoiceRecordInfo(newRecordList, isNewNote) {
    if(recordList.length > 0) {
        removeResizeListener(resizeElement, resizeCallback);
        removeContentChangeListener();
    }
    else {
        var progress = document.getElementById('progress');
        progress.style.display = "";
    }
    recordList = newRecordList;
    resetParams(isNewNote);  
    var textContainerDiv = document.getElementById('textContainer');
    textContainerDiv.innerHTML = "";
    
    var rulerContainerDiv = document.getElementById('rulerContainer');
    rulerContainerDiv.innerHTML = "";
    
    for (var i = 0; i < recordList.length; ++i) {
        var textInnerDiv = document.createElement('div');
        textInnerDiv.setAttribute('class', 'textDiv');
        textInnerDiv.setAttribute('recordId', recordList[i].recordID);
        textInnerDiv.setAttribute('duration', recordList[i].recordDuration);
        textInnerDiv.setAttribute('id', 'textDiv'+i);
        textInnerDiv.setAttribute('index', i);
        textInnerDiv.setAttribute('onclick', 'handleTextClick()');
        textInnerDiv.setAttribute('onblur', 'handleTextBlur()');
        textInnerDiv.setAttribute('onkeydown', 'handleTextKeyDown()');
        textInnerDiv.innerText = recordList[i].recordTextContent;
        if(recordList[i].recordTextContent == "") {
            textInnerDiv.setAttribute('contenteditable', 'plaintext-only');
        }
        textContainerDiv.appendChild(textInnerDiv);
        
        var height = textInnerDiv.offsetHeight;
        var rulerDiv = document.createElement('div');
        rulerDiv.setAttribute('class', 'rulerDiv');
        rulerDiv.setAttribute('id', 'rulerDiv' + i);
        rulerDiv.setAttribute('onclick', 'handleClickRulerDiv()');
        rulerDiv.style.height= height + txtDiveGap + 'px';
        rulerContainerDiv.appendChild(rulerDiv);
          var imgLine = document.createElement('img');
          imgLine.setAttribute('class', 'ruler');
          imgLine.setAttribute('src', 'ruler1.png');
          imgLine.setAttribute('id', 'ruler' + i);
          imgLine.style.height = rulerDiv.style.height;
          imgLine.style.width = '2px';
          rulerDiv.appendChild(imgLine);
          
          var imgPoint = document.createElement('img');
          imgPoint.setAttribute('id', 'point'+i);
          imgPoint.setAttribute('class', 'point');
          imgPoint.setAttribute('src', 'ruler2.png');
          imgPoint.style.top = rulerDiv.offsetTop; 
          rulerDiv.appendChild(imgPoint);
    }
    
    
        
    var durationContainerDiv = document.getElementById('durationContainer');
    durationContainerDiv.innerHTML = "";
    var iDuration = 0;
    for (var i = 0; i < recordList.length; ++i) {
        var durationInner = document.createElement('div');
        durationInner.setAttribute('id', 'durationDiv'+i);
        durationInner.setAttribute('class', 'duration');
        durationInner.innerHTML = getDurationString(iDuration);
        durationContainerDiv.appendChild(durationInner);
        
        var divInner = document.getElementById('textDiv'+i);
        //durationInner.style.top = divInner.offsetTop + 'px';
        
        iDuration += parseFloat(recordList[i].recordDuration);
    }
    
    updateRecordPosition(curIndex, curPosition);
    
    //add istener
    addResizeListener(resizeElement, resizeCallback);
    addContentChangeListener();
}

function refreshUI() {
    for (var i = 0; i < recordList.length; ++i) {
        var textInnerDiv = document.getElementById('textDiv'+i);
        var rulerDiv = document.getElementById('rulerDiv'+i);
        rulerDiv.style.height = textInnerDiv.offsetHeight + txtDiveGap + 'px';
        var imgRuler = document.getElementById('ruler' + i);
        imgRuler.style.height = rulerDiv.style.height;
        var imgPoint = document.getElementById('point' + i);
        imgPoint.style.top = rulerDiv.offsetTop; 
        
        var divDuration = document.getElementById('durationDiv' + i);
        divDuration.style.height = rulerDiv.style.height;
    }
    updateRecordPosition(curIndex, curPosition);
}

function getDurationString(iDuration) {
        var hour = Math.floor ( iDuration/ 3600);
        var other = iDuration % 3600;
        var minute = Math.floor(other/60);
        var second = Math.floor(other%60);
        if(minute <10)
        {
            minute = '0' + minute;
        }
        if(second < 10)
        {
            second = '0' + second;
        }
        return minute + ':' + second;
}

function InitInterval() {
    curTimerInterval = 50;
}

function moveAnimation(){
    if( curPosition < recordList[curIndex].recordDuration){
        curPosition += (curTimerInterval/1000)*curSpeed;
        UpdateProgressImgPos();
    }
}

function play() {
    InitInterval();
    timerPlay = setInterval(moveAnimation, curTimerInterval);
}

function pause() {
    clearTimer();
}

function playOver() {
    clearTimer();    
}

function clearTimer() {
    if(timerPlay != null) {
        clearInterval(timerPlay);
        timerPlay = null;
    }
}

function jumpItem(iGap) {
    var tmpIndex = curIndex + iGap;
    if((tmpIndex < 0) || (tmpIndex > recordList.length - 1)) {
        return;
    }
    
    var isPlay = false;
    if(timerPlay != null) {
        clearTimer();
        isPlay = true;
    }
    
    curIndex += iGap;
    curPosition = 0.0;
    updateRecordPosition(curIndex, curPosition);
    if(isPlay) {
        play();
    }
}
 
 function resetParams(isNewNote) {
    clearTimer();
    if(isNewNote) {
        curSpeed = 1;
        curIndex = 0;
        curPosition = 0.0;
        var progress = document.getElementById('progress');
        updateRecordPosition(curIndex, curPosition);
    }
 }
 
 function moveBySpeed(iSpeed) {
    var isPlay = false;
    if(timerPlay != null) {
        clearTimer();
        isPlay = true;
    }
    curSpeed = iSpeed;
    if(isPlay) {
        play();
    }
 }
 
 function addContentChangeListener() {
     $("#textContainer").bind('DOMSubtreeModified', function(e) { 
        window.YNote.ContentChange();
    }); 
 }
 
 function removeContentChangeListener() {
     $("#textContainer").unbind('DOMSubtreeModified');
 }
 
 function updateRecordPosition(recordIndex, recordPosition) {
     curIndex = recordIndex;
     curPosition = recordPosition;
     UpdateProgressImgPos();
 }
 
 function UpdateProgressImgPos(){
    if(curIndex < recordList.length) {
         var rulerDiv = document.getElementById('rulerDiv'+ curIndex); 
         if( rulerDiv ){
            var distance = rulerDiv.offsetHeight;
            var begin = (distance/recordList[curIndex].recordDuration)*curPosition + rulerDiv.offsetTop;
            var progress = document.getElementById('progress');
            progress.style.top = begin + topMargin - progress.offsetHeight / 2 + 'px';
            //adjustScrollPos();
         }
    }
 }
 
 function handleClickRulerDiv(){
    console.error("handleClickRulerDiv");
    var oEvent = window.event;
    if((oEvent.type=="click") && (!isReadOnly))
    {
        var isPlay = false;
        if(timerPlay != null) {
            clearTimer();
            isPlay = true;
        }
        
        var iClientY = oEvent.clientY + document.body.scrollTop;
        iClientY -= topMargin; //margin of rulerContainer
 
        //调整curIndex和curPosition
        for (var i = 0; i < recordList.length; ++i) {
            var divInner = document.getElementById('rulerDiv'+i);
            var realPoint = divInner.offsetTop;
            var height = divInner.offsetHeight;
            if( iClientY >= realPoint && iClientY < realPoint + height){
                curIndex = i;
                var percent = (iClientY - realPoint)/height;
                curPosition = recordList[curIndex].recordDuration * percent;
                break;
            }    
        }
        
        updateRecordPosition(curIndex, curPosition);
        if( window.YNote ){
            window.YNote.ChangePlayPosition(curIndex, window.JSON.stringify(curPosition));
        }
 
        if(isPlay) {
            play();
        }
    }
 }
 
 /*
 function handleClick() {
    var oEvent = window.event;
    if((oEvent.type=="click") && (!isReadOnly))
    {
        var isPlay = false;
        if(timerPlay != null) {
            clearTimer();
            isPlay = true;
        }
        var iClientY = oEvent.clientY + document.body.scrollTop;
        var progress = document.getElementById('progress');
        progress.style.top = (iClientY - 6) + 'px';
        adjustScrollPos();
        
        //调整curIndex和curPosition
        for (var i = 0; i < recordList.length; ++i) {
            var divInner = document.getElementById('textDiv'+i);
            var realPoint = divInner.offsetTop + 50;
            if(iClientY < realPoint) {
                if(i != 0) {
                    curIndex = i-1;
                    var divLast = document.getElementById('textDiv'+curIndex);
                    var percent = (iClientY - 50 - divLast.offsetTop)/( divInner.offsetTop - divLast.offsetTop);
                    curPosition = recordList[curIndex].recordDuration * percent;
                }
                else {
                    progress.style.top = divInner.offsetTop + 44 + 'px'; 
                    adjustScrollPos();
                    curIndex = 0;
                    curPosition = 0.0;
                }
                break;
            }
            else if(iClientY == realPoint) {
                curIndex = i;
                curPosition = 0.0;
                break;
            }
            else {
                if(i == recordList.length - 1) {
                    var textContainerDiv = document.getElementById('textContainer');
                    var endPoint = textContainerDiv.offsetHeight;
                    var percent = (iClientY -50 - divInner.offsetTop) / (endPoint - divInner.offsetTop);
                    curIndex = i;
                    curPosition = recordList[curIndex].recordDuration * percent;
                    break;
                }
            }         
        }
        if( window.YNote ){
            window.YNote.ChangePlayPosition(curIndex, window.JSON.stringify(curPosition));
        }
        
        if(isPlay) {
            play();
        }
    }
}
*/
 
 listApis["getContent"] = function() {
    var resMap = {};
    for (var i = 0; i < recordList.length; ++i) {
        var divInner = document.getElementById('textDiv'+i);
        resMap[recordList[i].recordID] = divInner.innerText;
    }
    return resMap;
 }
 
function handleTextClick() {
    if(isReadOnly) {
        return;
    }
    var oEvent = window.event;
    var name = oEvent.target.className;
    if(name == "textDiv") {
        oEvent.target.setAttribute('contenteditable', 'plaintext-only');
        oEvent.target.focus();
        cursorBottom = oEvent.clientY + document.body.scrollTop;
        cursorLeft = oEvent.clientX;
    }
} 

function handleTextBlur() {
    var oEvent = window.event;
    var name = oEvent.target.className;
    
    if(name == "textDiv") {
        if(oEvent.target.innerHTML != "") {
            var innerText = oEvent.target.innerText;
            oEvent.target.setAttribute('contenteditable', 'false');
            oEvent.target.innerText = innerText;
        }
    }
} 

function handleTextKeyDown() {
    var oEvent = window.event;
    if(oEvent.keyCode == 38) {
        MoveCursor(false);
    }
    else if(oEvent.keyCode == 40) {
        MoveCursor(true);
    }
    else if(oEvent.keyCode == 13) {
         var range = window.getSelection().getRangeAt(0);
         var rectList = range.getClientRects();
         if(rectList.length > 0) {
            cursorBottom = rectList[0].bottom + document.body.scrollTop;
            cursorLeft = rectList[0].left; 
         }
         else {
            cursorBottom += fontSize; 
         }
    }
}

function MoveCursor(bDown) {
    var oEvent = window.event;
    var textDiv = oEvent.target;
    var sel = window.getSelection();
    var range = sel.getRangeAt(0);
    var rectList = range.getClientRects();
    if(rectList.length > 0) {
        cursorBottom = rectList[0].bottom + document.body.scrollTop;
        cursorLeft = rectList[0].left;
    }
    else {
        if(bDown) {
            cursorBottom += fontSize;
        }
        else {
            cursorBottom -= fontSize;
        }
    }
        
    if(bDown) {
        var divBottom = textDiv.offsetHeight + textDiv.offsetTop + topMargin;
        var gap = divBottom - cursorBottom;
        if(gap < fontSize) {
            var oEvent = window.event;
            oEvent.preventDefault();
            var id = textDiv.id;
            var order = textDiv.getAttribute("index");
            var iOrder = parseInt(order) + 1;
            if(iOrder < recordList.length) {
                var textDivNext = document.getElementById('textDiv'+iOrder);
                textDivNext.setAttribute('contenteditable', 'plaintext-only');
                textDivNext.focus();
                cursorBottom = textDivNext.offsetTop + topMargin;
                var rangeNew = document.caretRangeFromPoint(cursorLeft, cursorBottom - document.body.scrollTop);
                if(rangeNew != null) {
                    sel.removeAllRanges();
                    sel.addRange(rangeNew);
                }
            }
        }
    }
    else {
        var divTop = textDiv.offsetTop + topMargin;
        var gap = cursorBottom- fontSize - divTop;
        if(gap < fontSize) {
            var oEvent = window.event;
            oEvent.preventDefault();
            var id = textDiv.id;
            var order = textDiv.getAttribute("index");
            var iOrder = parseInt(order) - 1;
            if(iOrder >= 0) {
                var textDivNext = document.getElementById('textDiv'+iOrder);
                textDivNext.setAttribute('contenteditable', 'plaintext-only');
                textDivNext.focus();
                cursorBottom = textDivNext.offsetHeight + textDivNext.offsetTop + topMargin - fontSize;
                var rangeNew = document.caretRangeFromPoint(cursorLeft, cursorBottom - document.body.scrollTop);
                if(rangeNew != null) {
                    sel.removeAllRanges();
                    sel.addRange(rangeNew); 
                }
            }
        }
    }
}

function clear() {
    if(recordList.length > 0) {
        removeResizeListener(resizeElement, resizeCallback);
        removeContentChangeListener();
    }
    recordList = [];
    var textContainerDiv = document.getElementById('textContainer');
    textContainerDiv.innerHTML = "";
    var rulerContainerDiv = document.getElementById('rulerContainer');
    rulerContainerDiv.innerHTML = "";
    var durationContainerDiv = document.getElementById('durationContainer');
    durationContainerDiv.innerHTML = "";
    var progress = document.getElementById('progress');
    progress.style.display = "none"; 
}

function handleKeydown() {
    var oEvent = window.event;
    if (oEvent.ctrlKey) {
        if (oEvent.keyCode == 65 || oEvent.keyCode == 97) {
            oEvent.preventDefault();             
            if ( window.getSelection ) {
                window.getSelection().removeAllRanges();
                var start = recordList.length;
                for (var i = 0; i < recordList.length; ++i) {
                    var divInner = document.getElementById('textDiv'+i);
                    if(divInner.innerHTML != "") {
                        start = i;
                        break;
                    }
                }
                var max = recordList.length-1;
                if(start == max) {
                    var divInner = document.getElementById('textDiv'+start);
                    var range = document.createRange();
                    range.selectNodeContents( divInner );
                    window.getSelection().addRange( range );
                }
                else if(start < max){
                    var divStart = document.getElementById('textDiv'+start);
                    var divEnd = document.getElementById('textDiv'+ max);
                    var range = document.createRange();
                    range.setStartBefore(divStart);
                    range.setEndAfter(divEnd);
                    window.getSelection().addRange( range );
                }    
            }
         
        }
    }
}

function clearSelection() {
    window.getSelection().removeAllRanges();
}

function adjustScrollPos() {
    var clientHeight = document.body.clientHeight;
    var scrollHeight = document.body.scrollHeight;
    if( scrollHeight > clientHeight ) {
        var progress = document.getElementById('progress');
        var progressPos = progress.offsetTop + 10; //10作为一个容错值，为了美观
        var curClientHeight = clientHeight + document.body.scrollTop;
        if(curClientHeight < progressPos) {
            var scrollValue = 0;
            var restHeight = scrollHeight - progressPos;
            if(restHeight > clientHeight/2) {
                scrollValue = progressPos - clientHeight/2;
            }
            else {
                scrollValue = scrollHeight - clientHeight;
            }
            document.body.scrollTop = scrollValue;
        }
        else {
            if(progressPos <= document.body.scrollTop) {
                if(progressPos < clientHeight) {
                    document.body.scrollTop = 0;
                }
                else {
                    var scrollValue = progressPos - clientHeight/2;
                    document.body.scrollTop = scrollValue;
                }
            }
        }
    }
}

$(document).on('copy', function (event) {
       var s = window.getSelection();
       var r = s.getRangeAt(0);
       var divTemp = document.createElement('div');
       divTemp.appendChild(r.cloneContents());
       var clipboardData = event.originalEvent.clipboardData;
       if(clipboardData) {
            event.preventDefault(); 
            clipboardData.setData('text/plain', divTemp.innerText);
            clipboardData.setData('text/html', divTemp.innerHTML); 
       }   
});
