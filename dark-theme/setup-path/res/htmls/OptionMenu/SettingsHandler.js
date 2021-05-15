function changedir(){
    SendMessageToClient("ChangeDir");
}
function opendir(){
	window.YNote.OpenDir();
}

function selectdir()
{
    SendMessageToClient("SelectDir");
}

function testproxy() {
    var addr = document.getElementById("ProxyAddr");
    var port = document.getElementById("ProxyPort");
    var name = document.getElementById("ProxyName");
    var pswd = document.getElementById("ProxyPswd");
	if(addr.value.length == 0)
	{
        document.getElementById("ProxyTip").innerHTML = "请输入代理服务器地址";
		return;
	}
    
    document.getElementById("buttonproxy").disabled = true;
    var fulladdr = addr.value + '/' + port.value;
    SendMessageToClient("testproxy",fulladdr,name.value,pswd.value);
}

function saveproxy()
{
    var obj = document.getElementById("UseProxy");
    var bCheck = $(obj).parent().hasClass("checked");
    if(bCheck == true)
    {
        SendMessageToClient('setCheckbox',"UseProxy",'1');
    }
    else
    {
        SendMessageToClient('setCheckbox',"UseProxy",'0');
    }
        
    var addr = document.getElementById("ProxyAddr");
    var port = document.getElementById("ProxyPort");
    var name = document.getElementById("ProxyName");
    var pswd = document.getElementById("ProxyPswd");
    var fulladdr = addr.value + '/' + port.value;
    SendMessageToClient("saveproxy",fulladdr,name.value,pswd.value);
    document.getElementById("ProxyTip").innerHTML = '保存成功';
}

function SetProxyOptions(buse)
{
    document.getElementById("ProxyAddr").disabled = buse;
    document.getElementById("ProxyPort").disabled = buse;
    document.getElementById("ProxyName").disabled = buse;
    document.getElementById("ProxyPswd").disabled = buse;
    document.getElementById("buttonproxy").disabled = buse;
    if(buse == true)
    {
        document.getElementById("ProxyTip").innerHTML = "";
    }
    
}

function InitFontSelectView()
{
    var Font = GetFont();
    var FontSize = GetFontSize();
    var objFont = document.getElementById('font');
	objFont.disabled = false;
	var innerHtml = "";
	for(var i=0;i<Font.length;i++)
	{
        var str = "<option>" + Font[i] + "</option>";
        innerHtml += str;
    }
    objFont.innerHTML = innerHtml;

    var objFontsize = document.getElementById('fontsize');
	objFontsize.disabled = false;
	var innerHtmlSize = "";
	for(var i=0;i<FontSize.length;i++)
	{
        var str = "<option>" + FontSize[i] + "</option>";
        innerHtmlSize += str;
    }
    objFontsize.innerHTML = innerHtmlSize;
}

function GetFont()
{
    return ["宋体","新宋体","仿宋","楷体","黑体","微软雅黑","Arial","Arial Black","Times New Roman","Courier New","Tahoma","Verdana"];
}

function GetFontSize()
{
    return ['9px','12px','14px','16px','18px','22px','26px','30px','36px','42px'];
}