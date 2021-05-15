/**
 * Created by cqh on 2014/4/23.
 */

function SendMessageToClient( ){
    return window.YNote.AcceptCefMessage.apply( window, arguments );
}
// 通过这个函数接收C++发送过来的消息.用法和上一个函数类似
function AcceptMessageFromClient(MsgType, MsgParam1, MsgParam2, MsgParam3, MsgParam4)
{
	// if there is other arguments. use argument[] to find the variable.
    if(typeof(handleMessageFromClient) == "function")
    {
    	handleMessageFromClient(MsgType, MsgParam1, MsgParam2, MsgParam3, MsgParam4);
    }
    else
    {
        throw Error("The script file order is not correct");
    }
}

function CppMessagebox(message, description)
{
    SendMessageToClient("MessageBox", message, description);
}