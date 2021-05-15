  function clickOk() {
        SendMessageToClient("quitOK");
    }
    function clickCancel() {
        SendMessageToClient("quitCancel");
    }
    function defaultHandlerForMsgFromClient(msgType, param1, param2, param3) {
        if (msgType == "setHtmlElementInnerHtml") {
            var obj = document.getElementById(param1);
            obj.innerHTML = param2;
            return true;
        }else if (msgType == "setHtmlElementDisplay") {
            var obj = document.getElementById(param1);
            if (param2 == "1") {
                obj.style.display = "";
            } else {
                obj.style.display = "none";
            }
            return true;
        }else if (msgType == "setCheckboxStatus") {
            document.getElementById(param1).checked = (param2 == "1");
            return true;
        }else if( msgType == "setElementDisabled"){
            document.getElementById(param1).disabled = (param2 == "1");
            return true;
        }else{
            return false;
        }
    }
    function handleMessageFromClient(msgType, param1, param2, param3) {
        if (defaultHandlerForMsgFromClient(msgType, param1, param2, param3)) {
            console.log(FormatString("Default message handle from client. MsgType:{0}, param:{1}, parma:{2}, param:{3}", msgType, param1,param2,param3));
            return;
        } else {
            userDefinedHandlerForMsgFromClient(msgType, param1, param2, param3);
        }
    }