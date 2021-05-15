// 这个文件放在前面是因为其他js需要用到listApis.

// 下面这些是和cef通信的函数. 请勿修改.
var listApis = {
    //Accept Message from client. Three parameters 1 Message Type, 2 The item affected 3 item status.
    AcceptClientMessage: function (MsgType, MsgParam1, MsgParam2, MsgParam3, MsgParam4) {
        AcceptMessageFromClient( MsgType, MsgParam1,MsgParam2, MsgParam3, MsgParam4);
    }
};

function callListApi(apiName, args) {
    var fn = listApis[apiName],
        ret = null;
    if (!fn) {
        return;
    }
    try {
        ret = fn.apply(null, args);
    } catch (e) {
        throw e;
    }
    if (ret) {
        try {
            ret = JSON.stringify(ret);
        } catch (ex) {
            //do nothing
        }
    }
    return ret;
};

function ready(callback) {
    if( window.YNote){
        window.YNote.Ready(callback, document);
        console.log("After ready send");
    }
    else
    {
        console.log("Cannot find window.YNote");
    }
}

