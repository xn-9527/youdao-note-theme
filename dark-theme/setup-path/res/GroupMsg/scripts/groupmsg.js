(function(){

var root = this;
var GroupMsg = {};
root.GroupMsg = GroupMsg;
  
GroupMsg.dispatch = function (funcName, args) {
    var func = GroupMsg[funcName];
    if(func) {
        func.apply(this, args);
    }
    else{
        YNote.log(YNote.FATAL_LEVEL, "Try to call an unsupported api : " + funcName);
    }
}

/**
 * 设置群组消息数据
 * @param {String}  JSON格式
 * {
 *  "items": [{
 *  "name": "群组名称",
 *  "id": "群组id",
 *  "number": "12"
 *  }],
 *  "hasNotifyMsg": 0/1
 * }
 */
GroupMsg.setGroupMsgInfo = function (info) {

    var infoObj = JSON.parse(info);

    //先删除所有以前的
    var items = document.querySelector(".item-container").querySelectorAll(".group-item");
    for(var i = 0; items && (i < items.length); ++i) {
        items[i].parentNode.removeChild(items[i]);
    }

    if (!infoObj.items && !infoObj.hasNotifyMsg) {
        YNote.log(YNote.FATAL_LEVEL, "Try to call setGroupMsg with invalid data : " + info);
    }
    
    //添加条目
    for( var i = 0; infoObj.items && (i < infoObj.items.length); ++i) {
        this.addOneItem(infoObj.items[i].name, infoObj.items[i].id, infoObj.items[i].number);
    }

    //更新"通知"
    var notifyMsg = document.querySelector(".notify-item");
    if(infoObj.hasNotifyMsg) {
        notifyMsg.style.display = "block";
    } else {
        notifyMsg.style.display = "none";
    }
    
    YNote.setWindowHeight(document.documentElement.offsetHeight);
}

/**
 * 增加一个群组条目
 * @param {String}  groupName 群组名称
 * @param {String}  groupID        群组ID
 * @param {Number}  msgNumber 当前群组未读消息数
 */
GroupMsg.addOneItem = function (groupName, groupID, msgNumber) {

    if(msgNumber <= 0) {
        YNote.log(YNote.WARN_LEVEL, "Try to add an item which has no message : " + groupName);
        return;
    }

    if(msgNumber >=100) {
        msgNumber = "99+";
    }
    
    //如果已经存在了，则更新数目
    var groupItem = document.querySelector(".item-container > " +  '[data-id="' + groupID + '"]');
    if ( groupItem ) {
        var number = groupItem.querySelector(".msg-number");
        if(number) {
            number.textContent = String(msgNumber);
        }
        YNote.log(YNote.WARN_LEVEL, "Try to add an item which is already there");
        return;
    }

    var tmpl = document.querySelector("#group-item-template");
    
    //插入最前面
    var itemCon = document.querySelector(".item-container");
    itemCon.insertAdjacentHTML("afterbegin", tmpl.innerHTML);

    //变更data-id
    var newItem = itemCon.querySelector('[data-id="{F1534EF0-4D8B-41EE-9390-EB354194C93A}"]');
    
    if (!newItem) {
        YNote.log(YNote.FATAL_LEVEL, "Add group item failed : " + groupName);
    }
    newItem.dataset.id = groupID;
    
    //数字
    newItem.querySelector(".msg-number").textContent = String(msgNumber);
    
    //文本
    newItem.querySelector(".item-text").textContent =  groupName;
    
    //事件处理
    newItem.addEventListener("click", function(event){
        YNote.groupMsgItemClick(event.currentTarget.dataset.id);
    });
}

}).call(this);