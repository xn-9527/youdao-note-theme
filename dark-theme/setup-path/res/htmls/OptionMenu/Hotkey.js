//快捷键相关
var listenKey = '0';
var hotkeyValue = new Array(7);
    hotkeyValue[0] = '857';
    hotkeyValue[1] = '812';
    hotkeyValue[2] = '116';
    hotkeyValue[3] = '590';
    hotkeyValue[4] = '1061';
    hotkeyValue[5] = '1063';
    hotkeyValue[6] = '1348';
var iValue = 0;
var keyboard = { '48':'0','49':'1','50':'2','51':'3','52':'4','53':'5','54':'6','55':'7','56':'8','57':'9',
'65': 'A', '66': 'B','67': 'C','68': 'D','69': 'E','70': 'F','71': 'G','72': 'H','73': 'I','74': 'J','75': 'K','76': 'L','77': 'M','78': 'N',
'79': 'O','80': 'P','81': 'Q','82': 'R','83': 'S','84': 'T','85': 'U','86': 'V','87': 'W','88': 'X','89': 'Y','90': 'Z', 
'96':'Num 0','97':'Num 1','98':'Num 2','99':'Num 3','100':'Num 4','101':'Num 5','102':'Num 6','103':'Num 7','104':'Num 8','105':'Num 9',
'106':'Num *','107':'Num +','109':'Num -','110':'Num Del','111':'Num /','112':'F1','113':'F2','114':'F3','115':'F4','116':'F5','117':'F6',
'118':'F7','119':'F8','120':'F9','121':'F10','122':'F11','123':'F12','144':'Num Lock','145':'Scroll Lock',
'20':'Caps Lock','33':'Page Up','34':'Page Down','35':'End','36':'Home','37':'Left','38':'Up','39':'Right','40':'Down','44':'Sys Req','45':'Insert',
'186':';','187':'=','188':',','189':'-','190':'.','191':'/','192':'`','219':'[','220':'\\','221':']','222':'\''
};
var hotkeyPair = {'0':'Active','1':'PrintScreen','2':'Sync','3':'NewNote','4':'OnlyShowEditor','5':'ShowAll','6':'InsertTime'};
var hotkeyRes = {'Active' : 0,'PrintScreen' : 1,'Sync' : 2,'NewNote' : 3,'OnlyShowEditor' : 4,'ShowAll' : 5,'InsertTime' : 6};
function resetHotkey()
{
    hotkeyValue[0] = '857';
    hotkeyValue[1] = '812';
    hotkeyValue[2] = '116';
    hotkeyValue[3] = '590';
    hotkeyValue[4] = '1061';
    hotkeyValue[5] = '1063';
    hotkeyValue[6] = '1348';
    ClearHotkeyTip();
    ShowHotkey();
    SendMessageToClient("SetHotkey","reset","");
}

function ClearHotkeyTip()
{
    for(var i=0;i<7;i++)
    {
        var tip = hotkeyPair[i] + "Tip";
        var tipobj = document.getElementById(tip);
        tipobj.innerHTML = "";
    } 
}

function InitHotkey(csHotkey)
{
    var hotkey = csHotkey.split(';');
    var len = hotkey.length;
    for(var i=0; i<len; i++)
    {
        hotkeyValue[i] = hotkey[i];
    }
    ShowHotkey();
}

function ShowHotkey()
{
    for(var i=0;i<7;i++)
    {
        var value = null;
        var index;
        if(hotkeyValue[i] > 2048)      //处理含有hotkeyf_ext的情况
        {
            hotkeyValue[i]= hotkeyValue[i] - 2048;
        }

        if(hotkeyValue[i] > 1536)
        {
            index= hotkeyValue[i] - 1536;
            value = "Ctrl + Alt + " + keyboard[index];			
        }		
        else if(hotkeyValue[i] > 1280)
        {
            index= hotkeyValue[i] - 1280;
            value = "Shift + Alt + " + keyboard[index];
        }
        else if(hotkeyValue[i] > 1024)
        {
            index= hotkeyValue[i] - 1024;
            value = "Alt + " + keyboard[index];
        }
        else if(hotkeyValue[i] > 768)
        {
            index= hotkeyValue[i] - 768;
            value = "Ctrl + Shift + " + keyboard[index];
        }
        else if(hotkeyValue[i] > 512)
        {
            index = hotkeyValue[i] - 512;
            value = "Ctrl + " + keyboard[index];
        }
        else if(hotkeyValue[i] > 256)
        {
            index = hotkeyValue[i] - 256;
            value = "Shift + " + keyboard[index];
        }
        else if(hotkeyValue[i] == 0)
        {
            var tip = hotkeyPair[i] + "Tip";
            var tipobj = document.getElementById(tip);
            tipobj.innerHTML = "快捷键为空，单击进行设置";
        }
        else
        {
            index = hotkeyValue[i];
            value = keyboard[index];
        }
        
        if(typeof(value)=="undefined")
        {
            value = '';
        }
        var id = hotkeyPair[i];
        document.getElementById(id).value = value;

    }
}
// ctrl + 512   shift + 256   alt + 1024; 
// 小键盘区域除了 numlock  剩下特殊处理，不受csa三个键的干扰；
// tab printscreen pause/break esc w-home 特殊处理
//enter 108 ignore ;  8 backspace删除 9  tab无效  esc27 退出  space 32 无效   delete 46无效
//小键盘区域的 分两种情况 num lock 有效和无效
function onClickHotkey(id) {
    listenKey = '1';
    selKey = id;
    var obj = document.getElementById(id);
    var index = hotkeyRes[id];
    iValue = hotkeyValue[index];
    if(iValue == '0')
    {
        var tip = id + "Tip";
        var tipobj = document.getElementById(tip);
        tipobj.innerHTML = "直接按键盘进行设置";
    }
    document.onkeydown = keydown;
    document.onkeyup = keyup;
}

function onSelectHotkey(id)
{
    listenKey = '1';
    selKey = id;
    var obj = document.getElementById(id);
    var index = hotkeyRes[id];
    iValue = hotkeyValue[index];  
}

var selKey;
var ctrlSel = '0';
var shiftSel = '0';
var altSel = '0';
function keydown()
{
    var tip = selKey + "Tip";
    var tipobj = document.getElementById(tip);
    tipobj.innerHTML = "";
    var key = keydown.arguments[0].keyCode;
    //tab return;
    if(key == 9)
    {
        return;
    }
    var value = "";
    if(listenKey == '1')
    {
        if( key == 16)
        {
            shiftSel = '1';
        }
        else if( key == 17)
        {
            ctrlSel = '1';
        }
        else if( key == 18 )
        {
            altSel = '1';
        }
        
        if(ctrlSel == '1')
        {
            value = "Ctrl + ";
        }
        if(shiftSel == '1')
        {
            value = value + "Shift + ";
        }
        if(altSel == '1')
        {
            value = value + "Alt + ";
        }
        if(value.length == 0)
        {
            value = "Ctrl + ";
        }
    }
	document.getElementById(selKey).value = value;
}

function keyup()
{
    var key = keyup.arguments[0].keyCode;
    //tab; return
    if(key == 9)
    {
        return;
    }
    if( listenKey == '1')
    {
        if( key == 16)
        {
            //jira 4489  防止shift alt稍微先抬起之后，就失效了
            setTimeout(function(){
                shiftSel = '0';
            }, 1000);
            return;
        }
        else if( key == 17)
        {
            ctrlSel = '0';
            return;
        }
        else if( key == 18 )
        {
            setTimeout(function(){
                altSel = '0';
            }, 1000);
            return;
        }
        var getvalue = keyboard[key];
        if(typeof(getvalue)=="undefined")
        {
            getvalue = '';
        }

        var value = '';
        iValue = key;
        var isSpec = isSpecialKey(key);
        
        //空格、回车、backspace 显示“无”
        if(key == 32 || key == 13 || key == 8)
        {
            document.getElementById(selKey).value = "无";
            iValue = 0;
            return;           
        }
        
        if( (ctrlSel == '1' || (shiftSel == '0' && altSel == '0')) && !isSpec)
        {
            value = "Ctrl + ";
			iValue = iValue + 512;
        }

        if(shiftSel == '1')
        {
            value = value + 'Shift + ';
			iValue = iValue + 256;
        }

        if(altSel == '1')
        {
            value = value + 'Alt + ';
			iValue = iValue + 1024;
        }

        value = value + getvalue;
        var idx = hotkeyRes[selKey];
        var check = checkHotkey(idx,iValue);
        if(check == false)
        {
            document.getElementById(selKey).value = "无";
            iValue = 0;
            return;
        }
        document.getElementById(selKey).value = value;
	}
}

function isSpecialKey(key)
{
    if(key > 111 && key < 124)
    {
        return true;
    }
    return false;
}

function checkHotkey(index, value)
{
    var len = hotkeyValue.length;
    for(var i=0; i<len; i++)
    {
        var othervalue = hotkeyValue[i];
        if(othervalue == value && i != index)
        {
            return false;
        }
    }
    return true;
}

function QuitListen(id)
{
    if(iValue == 0)
    {
        var tip = id + "Tip";
        var tipobj = document.getElementById(tip);
        document.getElementById(id).value = "";
        tipobj.innerHTML = "快捷键为空，单击进行设置";      
    }
    var idx = hotkeyRes[id];
    hotkeyValue[idx] = iValue;
    
	var svalue = iValue.toString();
    listenKey = '0';
}

function clearHotkey(id)
{
    var tip = id + "Tip";
    var obj = document.getElementById(id);
    var objtip = document.getElementById(tip);
    objtip.innerHTML = "直接按键盘进行设置";
    var index = hotkeyRes[id];
    hotkeyValue[index] = 0;
    obj.value = '';
    obj.focus();
    onClickHotkey(id);
}

function ClickHotkeyText(id)
{
    var obj = document.getElementById(id); 
    obj.focus();
    onClickHotkey(id);    
}
