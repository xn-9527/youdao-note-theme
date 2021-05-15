function ChangeReadPswd()
{
    SendMessageToClient("ChangeReadPswd");
}

function ChangeLockPswd()
{
    SendMessageToClient("ChangeLockPswd");
}

function ReGetDevices()
{
    SendMessageToClient("ReGetDevices");
}
function HandleDevices(param1)
{
    if(param1.length == 0)
    {
        return;
    }
    var params = param1.split(";;");
    var len = params.length;
    for(var i=0; i<len; i++)
    {
        var subnode = document.createElement("div");
        subnode.style.width = 500;
        subnode.style.height = 32;
        subnode.style.marginTop = 16;
  
        var singledev = params[i].split("??");
        var status = singledev[3];
        var node=document.createElement("div");
        var node2 = document.createElement("div");
        var node3=document.createElement("button");
        var node4=document.createElement("button");
		node.className = 'userattr deviceShow';
        node2.className = 'userattr';
		node3.className = 'whitebutton deviceBtn';
		node4.className = 'whitebutton deviceBtn';
        subnode.id = singledev[0] + "div";
        node3.id = singledev[0] + "off";
        node4.id = singledev[0];

        if(status == '4' || status == '3')
        {
            node3.disabled = 'disabled';
        }

        var nodename = singledev[1];
        var version = "(" + singledev[2] + "版)";
        node3.name = nodename;
        node4.name = nodename;
        
        node3.addEventListener('click',function(){OnClickLogOut(this.id)});
        node4.addEventListener('click',function(){OnClickDelete(this.id)});
		var textnode=document.createTextNode(nodename);
        node.appendChild(textnode);
        var textnode2 = document.createTextNode(version);
        node2.appendChild(textnode2);
        
        var textnode3=document.createTextNode("注销");
        node3.appendChild(textnode3);
        var textnode4=document.createTextNode("删除数据"); 
        node4.appendChild(textnode4);
	
        node.style.position = "relative"; 
		node.style.cssFloat = "left";
        node.style.width = "130px";
        node.style.marginTop = 9;
        node.style.display = "inline-block";
        
        node2.style.position = "relative"; 
		node2.style.cssFloat = "left";
        node2.style.width = "70px";
        node2.style.marginTop = 9;
        node2.style.display = "inline-block";
        
        node4.style.position = "relative";
		node4.style.cssFloat = "right";
        node4.style.marginRight = "76px";
        node4.style.display = "inline-block";
        
        node3.style.position = "relative";
		node3.style.cssFloat = "right";
        node3.style.marginRight = "15px";
        node3.style.display = "inline-block";
        subnode.appendChild(node);
        subnode.appendChild(node2);
        subnode.appendChild(node4);
        subnode.appendChild(node3);
        subnode.style.display = "inline-block";
        document.getElementById("devices").appendChild(subnode);
        
    }
}

function OnClickLogOut(id)
{
    var nodename;
    var deviceid;
    var len = id.length;
    if(len > 3)
    {
        deviceid = id.substring(0,len-3);
    }
    var obj = document.getElementById(id);
    nodename = obj.name;
    SendMessageToClient("HandleDevice",deviceid, "offline", nodename);
}
	
function OnClickDelete(id)
{
    var nodename;
    var obj = document.getElementById(id);
    nodename = obj.name;
    SendMessageToClient("HandleDevice",id, "delete" ,nodename);
}

function OptDevice(opt, id)
{
    var tip = document.getElementById("deviceTip");
    if(opt == "error")
    {
        tip.style.color = "#ff9494";
        tip.innerHTML = "请求失败，请稍候重试。"; 
        setTimeout(function(){
            tip.innerHTML = "";
        }, 5000); 
    }
    else if(opt == "delete")
    {
        tip.style.color = "#5576BD";
        tip.innerHTML = "已成功发送\"删除数据\"请求。";
        var id2 = id + "off";
        var subnodeid = id + "div";
        var obj = document.getElementById(id);
        var obj2 = document.getElementById(id2);
        var subnode = document.getElementById(subnodeid);
        obj.disabled = "disabled";
        obj2.disabled = "disabled";
        setTimeout(function(){
            document.getElementById("devices").removeChild(subnode);
            tip.innerHTML = "";
        }, 5000);
    }
    else if(opt == "offline")
    {
        var id2 = id + "off";
        tip.style.color = "#5576BD";
        tip.innerHTML = "成功发送\"注销\"请求";
        var obj = document.getElementById(id2);
        obj.disabled = 'disabled';
        setTimeout(function(){
            tip.innerHTML = "";
        }, 5000);        
    }
}

function OpenChangePswd()
{
    SendMessageToClient("OpenLink", "https://reg.163.com/naq/findPassword");
}
 
function HandleLoginTip(id)
{
    var obj = document.getElementById(id);
    var bCheck = $(obj).parent().hasClass("checked");
    if(bCheck == true)
    {
        $(obj).parent().removeClass("checked");    
    }
    else
    {
        $(obj).parent().addClass("checked");      
    }
    
    CheckBindOption();  
}

function ChangePhone()
{
    document.getElementById("phoneinput").style.display = 'inline-block';
    document.getElementById("phoneresult").style.display = 'none';
    CheckBindOption();
}

function BindLoginPhone()
{
    SendMessageToClient("bindLoginPhone");
}

function ChangeLoginPhone()
{
    SendMessageToClient("ChangeLoginPhone");
}

function CheckBindOption()
{
    var tip1 = document.getElementById("loginTip1");
    var tip2 = document.getElementById("loginTip2");
    var bRes1 = $(tip1).parent().hasClass("checked");
    var bRes2 = $(tip2).parent().hasClass("checked"); 
    if(bRes1 == true || bRes2 == true)
    {
        document.getElementById("phonenum1").disabled = false; 
        document.getElementById("phonenum2").disabled = false;
        document.getElementById("phonenum3").disabled = false;
        document.getElementById("btnCaptcha").disabled = false; 
        document.getElementById("loginTipBtn").disabled = false;
    }
    else        
    {
        document.getElementById("phonenum1").disabled = true; 
        document.getElementById("phonenum2").disabled = true; 
        document.getElementById("phonenum3").disabled = true;
        document.getElementById("btnCaptcha").disabled = true;
        if($('#phoneinput').css('display') != 'none')
        {      
            document.getElementById("loginTipBtn").disabled = true; 
        }       
    } 
}

function SetCaptchaRes(param1)
{
    ShowMsgTipError(param1);   
}

function GetCaptcha()
{
    var errorTip = checkPhone();
    if( errorTip.length == 0)
    {
        var value = document.getElementById("phonenum1").value;
        SendMessageToClient("GetCaptcha", value);
        showCaptcha();
	}
    ShowMsgTipError(errorTip);
}

var countdown = 60;
var timer1;
function showCaptcha()
{
    timer1 = window.setTimeout( "showCaptcha()", 1000);
    var obj = document.getElementById("btnCaptcha");
    if(countdown == 0) { 
        obj.removeAttribute("disabled");    
        obj.innerHTML="获取验证码"; 
        countdown = 60;
        window.clearTimeout(timer1);
    }else{ 
        obj.setAttribute("disabled", true); 
        obj.innerHTML="重新发送(" + countdown + ")"; 
        countdown--; 
    }   
}

var num;
var csWn;
var csDn;
function SavePhoneTip()
{
    var obj1 = document.getElementById("loginTip1");
    var obj2 = document.getElementById("loginTip2");    
    var bRes1 = $(obj1).parent().hasClass("checked");
    var bRes2 = $(obj2).parent().hasClass("checked");
    csWn = bRes2.toString();
    csDn = bRes1.toString();
    
    if($('#phoneinput').css('display') == 'none')
    {      
        SendMessageToClient("ChangeBindOpt",bRes2.toString(),bRes1.toString());
        return;
    }

    var error = checkPhone();
    if(error.length != 0)
    {
        ShowMsgTipError(error);
        return;
    }

    var obj = document.getElementById("phonenum3");
    var code = obj.value;   
    if(code.length == 0)
    {
        ShowMsgTipError("请输入验证码");
        return;
    }
    
    
    if(bRes1==true && bRes2==true)
    {
        value = "3";
    }else if(bRes1 == true)
    {
        value = "1";
    }else if(bRes2 == true)
    {
        value = "2";
    }

    obj = document.getElementById("phonenum1");
    num = obj.value;
    SendMessageToClient("bindPhone",num,code,value);
}

function SetBindRes(param1)
{
    if(param1 == "绑定成功")
    {
        SetBindStatus(num,csDn,csWn);
        ShowMsgTipError("");
    }
    else
    {
        ShowMsgTipError(param1);        
    }
}

function ShowMsgTipError(tip)
{
    var obj = document.getElementById("msgtip");
    obj.innerHTML = tip;
    if(tip.length == 0)
    {
        return;
    }
    
    setTimeout(function(){
        obj.innerHTML = "";
    }, 5000);
}

function checkPhone()
{
    var value1 = document.getElementById("phonenum1").value;
    var value2 = document.getElementById("phonenum2").value;
    var errorTip = "";
    if(value1.length == 0 && value2.length == 0)
    {
        errorTip = "输入手机号为空，请重新输入";
    }
    else if(value1.length == 0 || value2.length == 0)
    {
        errorTip = "手机号码没有全部输入，请重新输入";
    }
    else if( value1.length != 11 || value2.length != 11)
    {
        errorTip = "请输入有效手机号";
    }
    else if(value1 != value2)
    {
        errorTip = "两次输入手机号不一致，请重新输入";
    }
    return errorTip;
}

function ReGetBindStatus()
{
    SendMessageToClient("ReGetBindStatus");  
}