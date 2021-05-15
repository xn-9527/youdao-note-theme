(function(){

var root = this;
var SyncInfo = {};
root.SyncInfo = SyncInfo;
 
SyncInfo.dispatch = function (funcName, args) {
    var func = SyncInfo[funcName];
    if(func) {
        func.apply(this, args);
    }
    else{
        YNote.log(YNote.FATAL_LEVEL, "Try to call an unsupported api : " + funcName);
    }
}

/**
 * 设置同步信息
 * @param {String}  JSON格式
 * {
 *  "items": [{
 *  "id": "/BFC564A2F7B74A379CE9CAC962DBCA43/2028E8ED9A8E4CE59BC57E8D73D0A234",
 *  "noteTitle": "",
 *  "totalSize": "0",
 *  "actualSizeToTransfer" : "0",
 *  "completedSize" : "987878"
 *  "remainingTime": 2147483647,
 *  "syncOK": true,
 *  "state" : 0                 //2 NTS_START已启动; 3 NTS_Transmiting 当前在传输
 *  }],
 *  "syncValidNum": 5
 * }
 */
SyncInfo.setSyncInfo = function (info) {
    var infoObj = JSON.parse(info);
    //先删除所有以前的
    var items = document.querySelector(".item-container").querySelectorAll(".note-item");
    for(var i = 0; items && (i < items.length); ++i) {
        items[i].parentNode.removeChild(items[i]);
    }
    
    //没有需要同步的内容
    if (infoObj.items.length === 0) {
        //显示“准备数据"
        document.querySelector(".start-sync-state").style.display = "block";
        document.querySelector(".item-container").style.display = "none";
        document.querySelector(".blank-state").style.display = "none";        
    } else{
        //有需要同步的笔记
        //添加进去
        for( var i = 0; infoObj.items && (i < infoObj.items.length); ++i) {
            addOneItemHelper(infoObj.items[i].id, 
                           getNoteTitle(infoObj.items[i].noteTitle), 
                           getSyncInfoString(Number(infoObj.items[i].totalSize), 
                                             Number(infoObj.items[i].actualSizeToTransfer), 
                                             infoObj.items[i].remainingTime, 
                                             infoObj.items[i].state),
                           infoObj.items[i].syncOK, 
                           getProgress(Number(infoObj.items[i].totalSize), Number(infoObj.items[i].completedSize)));
        }
        this.setTransferTotalNum(infoObj.syncValidNum);
    }
    
    YNote.setWindowHeight(document.body.offsetHeight);
}

function getIdSelector(id) {
    return "[data-id=\"" + id + "\"]";
}

function getNoteTitle(title) {
    if(title.length === 0) {
        return "无标题笔记";
    }else {
        return title;
    }
}
function formatFileSize(fileSize, state) {
    
    if (state === 2 && fileSize === 0) {
        return "--";
    }
    
    var resultStr = "";
    var size = 0;
    var K = 1024;
    var M = 1024 * 1024;
    var G = M * 1024;

    if (Math.floor(size = fileSize / G) > 0) {
        size = Math.floor(size * 100) / 100;
        resultStr = size.toFixed(1) + "G";
    } else if (Math.floor(size = fileSize / M) > 0) {
        size = Math.floor(size * 100) / 100;
        resultStr = size.toFixed(1) + "M";
    } else if (Math.floor(size = fileSize / K) > 0) {
        size = Math.floor(size * 100) / 100;
        resultStr = size.toFixed(1) + "K";
    } else {
        resultStr = fileSize + "B";
    }

    return resultStr;
}

function formatTime(timeInSecond, state) {

    //启动但还未传输的时候
    if (state === 2) {
        return "--分钟";
    }
    
    if (timeInSecond === 0) {
        return "1秒";
    }
    
    var resultStr = "";
    var time = 0;
    var Min = 60;
    var Hour = Min * 60;

    if (Math.floor(time = timeInSecond / Hour) > 0) {
        time = Math.floor(time * 100) / 100;
        if (time > 24) {
            resultStr = "--小时";
        } else {
            resultStr = time.toFixed() + "小时";
        }
    } else if (Math.floor(time = timeInSecond / Min) > 0) {
        time = Math.floor(time * 100) / 100;
        resultStr = time.toFixed() + "分钟";
    } else {
        resultStr = timeInSecond + "秒";
    }

    return resultStr;
}

function getProgress(totalSize, completedSize) {
    if(totalSize === 0) {
        return "0";
    }else {
        var ratio = completedSize / totalSize * 100;
        if(ratio > 100){
            ratio = 100;
            YNote.log(YNote.WARN_LEVEL, "Try to get progress greater than 100");
        }
        return String(Math.floor( ratio ));
    }
}

function getSyncInfoString(totalSize, actualSizeToTransfer, remainingTime, state) {
    return "共" + formatFileSize(totalSize, state) + "，需更新" + formatFileSize(actualSizeToTransfer, state) + "，剩余" + formatTime(remainingTime, state);
}

/**
 * 没有的条目，调用addOneItem;对于已有的条目，调用updateOneItem
 * @param {String}  id 笔记id
 * @param {String}  noteTitle 笔记标题
 * @param {Number}  totalSize 全部笔记大小
 * @param {Number}  actualSizeToTransfer 实际需要传输的笔记大小
 * @param {Number}  completedSize 实际已经传输的大小
 * @param {Number}  remainingTime 估计传输还需要多少时间(秒)
 * @param {Boolean} syncOK 同步是否正常
 * @param {Number}  state   同步情况    //2 NTS_START已启动; 3 NTS_Transmiting 当前在传输
 */
SyncInfo.determinNext = function (id, noteTitle, totalSize, actualSizeToTransfer, completedSize, remainingTime, syncOK, state) {
    if ( document.querySelector(".item-container").querySelector(getIdSelector(id)) ) {
        this.updateOneItem( id, 
                       getNoteTitle(noteTitle), 
                       getSyncInfoString(totalSize, actualSizeToTransfer, remainingTime, state),
                       syncOK, 
                       getProgress(actualSizeToTransfer, completedSize));
    }else{
        this.addOneItem(id, 
                        getNoteTitle(noteTitle), 
                        getSyncInfoString(totalSize, actualSizeToTransfer, remainingTime, state),
                        syncOK, 
                        getProgress(actualSizeToTransfer, completedSize));    
        YNote.setWindowHeight(document.body.offsetHeight);
    }
}

/**
 * 当没有笔记需要同步的时候，同步按钮转圈结束
 */
SyncInfo.syncAnimationOver = function () {
    //只有在无同步笔记才处理
    if (document.querySelector(".start-sync-state").style.display !== "none" ) {
        document.querySelector(".item-container").style.display = "none";
        document.querySelector(".start-sync-state").style.display = "none";
        document.querySelector(".blank-state").style.display = "block";
        YNote.setWindowHeight(document.body.offsetHeight);
    }
}

/**
 * 增加一个条目
 * @param {String}  id 笔记id
 * @param {String}  noteTitle 笔记标题
 * @param {String}  syncInfo 上传、下载的信息
 * @param {Boolean} syncOK 同步是否正常
 * @param {Number}  progress 当前同步的进度 一个数值 如果是 50%, 则传递50
 */
SyncInfo.addOneItem = function (id, noteTitle, syncInfo, syncOK, progress) {
    
    if(!id) {
        YNote.log(YNote.WARN_LEVEL, "Try to add a blank item.");
    }

    if (document.querySelector(".item-container").style.display === "none") {
        //窗口刚显示的时候没有数据，但是显示过程中有同步
        //重新加载全部笔记
        YNote.reloadSyncInfo();
        return;
    }
    
    addOneItemHelper(id, noteTitle, syncInfo, syncOK, progress);
}


function addOneItemHelper(id, noteTitle, syncInfo, syncOK, progress) {

    if(!id) {
        YNote.log(YNote.WARN_LEVEL, "Try to add a blank item.");
    }
    
    //如果已经存在了，则不插入
    if ( document.querySelector(".item-container").querySelector(getIdSelector(id)) ) {
        YNote.log(YNote.WARN_LEVEL, "Try to add an item which is already there");
        return;
    }

    var nit = document.querySelector("#note-item-template");
    var syncClassName = syncOK ? "sync-ok" : "sync-error";
    var itemHTML = _.template(nit.text, {DataId: id, NoteTitle: noteTitle, SyncInfo : syncInfo, SyncState : syncOK ? "sync-ok" : "sync-error"});
    
    //插入最前面
    document.querySelector(".item-container").insertAdjacentHTML("afterbegin", itemHTML);
    //设置百分比
    var selector = getIdSelector(id) + " > .sync-progress > ." + syncClassName;
    document.querySelector(selector).style.width = progress + "%";
}

/**
 * 删除一个条目
 * @param {String}  id 笔记id
 */
SyncInfo.removeOneItem = function (id) {

    if (document.querySelector(".item-container").style.display === "none") {
        //窗口刚显示的时候没有数据，但是显示过程中有同步
        //重新加载全部笔记
        YNote.reloadSyncInfo();
        return;
    }
    
    var el = document.querySelector(getIdSelector(id));
    if (el) {
        el.parentNode.removeChild(el);

        if( document.querySelector(".item-container").querySelector(".note-item") ) {
            YNote.setWindowHeight(document.body.offsetHeight);
        }
    }
    else {
        YNote.log(YNote.WARN_LEVEL, "Try to remove a non exist item.");
    }
    
    if( !document.querySelector(".item-container").querySelector(".note-item") ) {
        //如果是删除了最后一个
        this.setTransferTotalNum(0);
    }
}
/**
 * 更新一个条目
 * @param {String}  id 笔记id
 * @param {String}  noteTitle 笔记标题
 * @param {String}  syncInfo 上传、下载的信息
 * @param {Boolean} syncOK 同步是否正常
 * @param {Number}  progress 当前同步的进度 一个数值 如果是 50%, 则传递50
 */
SyncInfo.updateOneItem = function(id, noteTitle, syncInfo, syncOK, progress) {
    var el = document.querySelector(getIdSelector(id));
    if (el) {
        el.querySelector(".title").textContent = noteTitle;
        el.querySelector(".sync-info-text").textContent = syncInfo;
        
        var syncStateClassName = syncOK ? "sync-ok" : "sync-error";
        
        var classes = el.querySelectorAll(syncOK ? ".sync-error" : ".sync-ok" /*这里我们取相反的class name*/);
        if(classes && classes.length){
            (function(){
                for(var i = 0; i < classes.length; ++i) {
                    classes[i].className = syncStateClassName;
                }
            })()
        }
        
        var selector = getIdSelector(id) + " > .sync-progress > ." + syncStateClassName;
        document.querySelector(selector).style.width = progress + "%";
    }
    else {
        YNote.log(YNote.WARN_LEVEL, "Try to update a non exist item.");
    }
}

/**
 * 设置总共有多少笔记在传输
 * @param {Number}  num 当前共有多少笔记正在同步
 */
SyncInfo.setTransferTotalNum = function(num) {

    if( num !== 0 && !document.querySelector(".item-container").querySelector(".note-item")) {
        return;
    }

    if(num !== 0) {
        document.querySelector(".total-num").textContent = num.toString();
    }
    
    //无论如何“准备数据”这个都应该要隐藏掉
    document.querySelector(".start-sync-state").style.display = "none";

    document.querySelector(".item-container").style.display = (num === 0 ? "none" : "block");
    document.querySelector(".blank-state").style.display = ( num === 0 ? "" : "none");
    YNote.setWindowHeight(document.body.offsetHeight);
}

}).call(this);