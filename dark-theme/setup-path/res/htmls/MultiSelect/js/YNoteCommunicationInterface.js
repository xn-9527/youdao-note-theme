/**
 * Created by cqh on 2014/4/23.
 * Edited by shihongzhi
 */

/*
* 多线笔记 C++ 和 JS 通信协议
* 
* JS 中使用的函数
*   // 通过这个函数向C++客户端发送消息. 消息共有三个参数.
*   // 一般 MsgType 指消息的类型, MsgParam1和MsgParam2指消息的两个参数. 它们根据消息类型具有不同的意义.
*   //三个参数皆为字符串
*   function SendMessageToClient( MsgType, MsgParam1, MsgParam2){
*       return window.YNote.AcceptCefMessage(MsgType, MsgParam1,MsgParam2 );
*   }
* 
*   // 通过这个函数接收C++发送过来的消息.用法和上一个函数类似
*   function AcceptMessageFromClient(MsgType, MsgParam1, MsgParam2)
*   {
*       // Do work here
*       //alert("Accept message from client\n" + MsgType + "\n" + MsgParam1 + "\n" + MsgParam2);
*   }
* 
* 消息约定格式, Js向C++发送.
* 
* 消息类型MsgType  "DeleteNote"
*   功能 删除客户端中选中的笔记. 参数无意义,传空字符串即可.
* 
* 消息类型MsgType  "MergeNote"
*   功能 合并客户端中选中的笔记.参数无意义,传空字符串即可.
*  参数 MsgParam1 表示是否合并标题, 字符串 "true" 或者 "false"

* 消息类型MsgType  "AddTag"
*   功能 增加tag到客户端中. tag 用逗号分隔. 比如说 "tag1, tag2"
*   参数 MsgParam1 的意义:  用逗号分隔的tag字符串名称.
*   参数 MsgParam2 的意义: 无意义

* 消息类型MsgType  "DelTag"
*   功能 删除tag
*   参数 MsgParam1 的意义:  要删除的标签名.
*   参数 MsgParam2 的意义: 无意义

* 
* 消息类型MsgType  "MoveToNotebook"
*   功能 将客户端中选中笔记移动到笔记本中
*   参数 MsgParam1 的意义: 笔记本的ID
*   参数 MsgParam2 的意义: 笔记本的名称
* 
* 消息类型MsgType  "SaveFile"
*   功能 将选中笔记的附件保存, 参数无意义,传空字符串即可.
* 
* 消息类型MsgType  "SavePic"
*   功能 将选中笔记的图片保存, 参数无意义,传空字符串即可.
* 
* 消息类型MsgType  "GetTagList" 
*   功能  得到笔记的tagList, 用来给用户输入tag时进行提示.
*   返回值 是一个Json 串
*       格式如下
*           [
*              {
*                 "TagID" : "8ABA619F261F4938AABD9635CBF36A28",
*                 "TagName" : "1"
*              },
*              {
*                 "TagID" : "DEF53238EB004AC7B33B1DF7B5288A2C",
*                 "TagName" : "2"
*              }
*           ]       
*

* C++ 向JS发送

* 消息类型MsgType  "Clear"
*    功能 客户端取消的多选, JS清空已存在的笔记信息.

* 消息类型MsgType  "NoteCount"
*    功能 通知JS 客户端中选中了多少篇笔记.
*   参数 MsgParam1 笔记的个数, 字符串表示

* 消息类型MsgType  "DeleteNotes"
*    功能 通知JS 通知js客户端取消选中的笔记.
*   参数  MsgParam 的格式
*   [{"NoteId" : "E57029EBC84F483CB79A406F0D7C8101"}]
    
* 消息类型MsgType  "AddNotes"
*    功能 通知JS 通知js客户端取消选中的笔记.
*   参数MsgParam 的格式
*   [   {
*      "NoteId" : "E57029EBC84F483CB79A406F0D7C8101",
*      "NoteThumbnailBase64" : "iVBORw0KGgoAAAANSUhEUgAAA.........MAAAAAElFTkSuQmCC",
*      "NoteTitle" : "",
       "NoteContent" : "这是笔记的摘要" }]

* 消息类型MsgType  "ReplacedNotes"
*    功能 通知JS 通知js客户端哪些笔记被替换.
*    参数MsgParam 的格式同 AddNotes

* 消息类型MsgType  "ReplaceNotes"
*    功能 通知JS 通知js客户端替换进来的笔记.
*    参数MsgParam 的格式同 AddNotes

下面为替换时的消息顺序(先后消息中的笔记数一定一样)：
1. 增加时   ReplacedNotes ---> AddNotes
2. 删除时   DeleteNotes ---> ReplaceNotes
*/

function SendMessageToClient( MsgType, MsgParam1, MsgParam2){
    return window.YNote.AcceptCefMessage(MsgType, MsgParam1, MsgParam2 );
}
// 通过这个函数接收C++发送过来的消息.用法和上一个函数类似
function AcceptMessageFromClient(MsgType, MsgParam1, MsgParam2)
{
    // Do work here
    //alert("Accept message from client\n" + MsgType + "\n" + MsgParam1 + "\n" + MsgParam2);
    var type = MsgType;

    console.log(type);
    //console.log(MsgParam1);
    switch(type) {
        case 'AddNotes':
            //MsgParam1:
            //  NoteId
            //  NoteThumbnailBase64
            //  NoteTitle
            Notes.addNotes(JSON.parse(MsgParam1));
            break;
        case 'DeleteNotes':
            //MsgParam1:
            //  NoteId
            Notes.deleteNotes(JSON.parse(MsgParam1));
            //console.log(type);
            break;
        case 'ReplaceNotes':
            Notes.replaceNotes(JSON.parse(MsgParam1));
            break;
        case 'ReplacedNotes':
            Notes.delReplacedNotes(JSON.parse(MsgParam1));
            break;
        case 'Clear':
            Notes.clearNotes();
            break;
        case 'NoteCount':
            setNotesCount(MsgParam1);
            break;
        case 'SetNoteType':
            setNoteType(MsgParam1, MsgParam2=="1");
            break;
        default:
            //alert(type);
    }
}

