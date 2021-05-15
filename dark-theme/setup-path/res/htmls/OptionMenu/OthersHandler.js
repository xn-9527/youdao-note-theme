function OpenVipLink()
{
    var obj = document.getElementById("setUserId");
    var url = "https://note.youdao.com/charge/setMeal.html?username=" + obj.innerHTML;
    
    var btn = document.getElementById("vipText");
    if(btn.value == "试用会员")
    {
        url = "https://note.youdao.com/charge/setMeal.html?username=" + obj.innerHTML;
    }
    SendMessageToClient("OpenLink", url);
}

//导入导出
function importynote() {
    SendMessageToClient("import","ynote");
}
function importevernote() {
    SendMessageToClient("import","evernote");
}
function importothers() {		
    SendMessageToClient("import","others");
}
function exportynote() {
    SendMessageToClient("export","ynote");
}
function exportall() {
    SendMessageToClient("export","all");
}

//关于升级
function CheckUpdate()
{
    SendMessageToClient("CheckUpdate");
}

function viewLog() {
    SendMessageToClient("OpenLink", "https://note.youdao.com/changelog.html?auto=1");		
}

function viewLicense() {
    SendMessageToClient("OpenLink", "https://note.youdao.com/license.html");         
}

function viewLicenseMinors() {
    SendMessageToClient("OpenLink", "https://note.youdao.com/juvenile.html");         
}

function viewLicenseSecrecy(){
    SendMessageToClient("OpenLink", "https://note.youdao.com/license-secrecy.html");            
}

//msg from client handle functions
function InitTab(param1)
{
    var id = 'tab' + param1 + 'show';
    var idLeft = 'tab' + param1;
    var objLeft = document.getElementById(idLeft);
    document.getElementById(id).style.display = 'block';
    objLeft.style.backgroundColor = '#E8F0FF';
    objLeft.className = objLeft.className.replace( 'leftline' , 'leftlinesel' );
}

function SetDevices(param1, param2)
{
    if(param1 == "NetError")
    {
        document.getElementById("neterror").style.display = 'block';
        document.getElementById("devices").style.display = 'none';
    }
    else
    {
        document.getElementById("devicename").innerHTML = param2;
        document.getElementById("devices").style.display = 'block';
        document.getElementById("neterror").style.display = 'none';
        HandleDevices(param1);			
    }	
}

function HandleUserInfo(sig,nickname)
{
    if(nickname.length == 0)
    {
        nickname = '-';
    }
    document.getElementById("sigature").innerHTML = sig;
    document.getElementById("setsigature").value = sig;
    document.getElementById("nickname").innerHTML = nickname;
    document.getElementById("nicknamebig").innerHTML = nickname;
    document.getElementById("setnickname").value = nickname;
}

function SetDistrict(param1)
{
	if(param1.length != 0)
	{
        var districtArray = param1.split(' ');
        if (districtArray[0] == "中国") {
            districtArray.shift();
        }
        var obj = document.getElementById("district");
        obj.value = districtArray[0];
        onSelectChange(obj);
        obj = document.getElementById("city");
        obj.value = districtArray[1];
        if (districtArray[0].length == 0) {
            obj.disabled = true;
        }
			
		var fullarea = districtArray[0] + '  ' + districtArray[1];
		document.getElementById("userArea").innerHTML = fullarea;			
	}	
	
}

function SetGender(param1)
{
    var gender = parseInt(param1);
	var objtext = document.getElementById('userGender');
    var objectId = "genderUnknown";
    if (gender == 0) {
        objectId = "genderMale";
		objtext.innerHTML = '男';
    }
    else if (gender == 1) {
        objectId = "genderFemale";
		objtext.innerHTML = '女';
    }
    else if (gender == 2) {
		objtext.innerHTML = '保密';
    }
    var obj = document.getElementById(objectId);
	$(obj).parent().addClass("checked");		
}

function SetVip(param1,param2)
{
	var spacetip = document.getElementById("spacetip");
	var spacetipVip = document.getElementById("spacetipVip");
    var vipIcon = document.getElementById("vipIcon");
    var novipIcon = document.getElementById("novipIcon");
    if( param1 == "1")
	{
		document.getElementById("vipText").value = "查看会员";
        if(param2 == "获取失败")
        {
            document.getElementById("expiretime").innerHTML = param2;   
        }
        else if(parseInt(param2) != 0) {
            var endDate = new Date(parseInt(param2));
            document.getElementById("expiretime").innerHTML = DateToFormatString(endDate);
        }
		vipIcon.style.display = "inline-block";
        novipIcon.style.display = "none";
		spacetip.style.display = "none";
		spacetipVip.style.display = "block";			
	}
}

function SetSpace(param1, param2)
{
	var obj = document.getElementById("SetSpaceUsed");
	var obj2 = document.getElementById("storageused");
	var obj3 = document.getElementById("storagetext");
	var obj4 = document.getElementById("storageimage");
	obj.innerHTML = param1;
	obj3.innerHTML = param2;
	obj2.style.width = param2;
	var leftvalue = obj2.getBoundingClientRect().right;
	obj3.style.left = leftvalue - 122;
	obj4.style.left = leftvalue - 134;
    
    if(param2 == "100%")
    {
        obj2.style.borderRadius = "100px 100px 100px 100px";
    }
    if(param2 == "100%" || param2 == "99%" || param2 == "98%")
    {
        obj3.style.left = leftvalue - 132;
        obj4.style.left = leftvalue - 144;
    }
}

function SetProxyAccount(param1, param2)
{
	document.getElementById("ProxyName").value = param1;
	document.getElementById("ProxyPswd").value = param2;
}

function SetProxy(param1,param2,param3)
{
    if(param1 == "1")
    {
        addClass("UseProxy");
        SetProxyOptions(false);
    }
    else
    {
        SetProxyOptions(true);
    }

	document.getElementById("ProxyAddr").value = param2;
	document.getElementById("ProxyPort").value = param3;
}

function SetBindStatus(param1,param2,param3)
{
    var obj1 = document.getElementById("safetab3show1");
    var obj2 = document.getElementById("safetab3show2");
    var obj3 = document.getElementById("safetab3show3");
    obj1.style.display = "none";
    obj2.style.display = "inline-block";
    obj3.style.display = "none";

    if(param1 == "empty")
    {
        return;
    }
    else if(param1 == "notvip")
    {
        obj1.style.display = "inline-block";
        obj2.style.display = "none";
        obj3.style.display = "none";       
    }
    else if(param1 == "neterror")
    {
        obj1.style.display = "none";
        obj2.style.display = "none";
        obj3.style.display = "inline-block";       
    }
    else
    {
        document.getElementById("phoneinput").style.display = 'none';
        document.getElementById("phoneresult").style.display = 'inline-block';
    }
    
    var number = param1.substring(0,3) + "****" + param1.substring(7);
    var obj;
    var bindnum = document.getElementById("BindNumber");
    bindnum.innerHTML = number;
    if(param2 == 'true')
    {
        obj = document.getElementById("loginTip1");
        $(obj).parent().addClass("checked");
    }
    if(param3 == 'true')
    {
        obj = document.getElementById("loginTip2");
        $(obj).parent().addClass("checked");
    }
    CheckBindOption();
}

function SetKeyDisable(param1)
{
    var bDisable = false;;
    if(param1 == "true")
    {
        bDisable = true;
    }
    document.getElementById("SetTimeLock").disabled = bDisable;
    document.getElementById("SetMinLock").disabled = bDisable;
    document.getElementById("SetIntevals").disabled = bDisable;
    document.getElementById("SetSwitchLock").disabled = bDisable;
}

function SetReadKeyDisable(param1)
{
    var bDisable = false;;
    if(param1 == "true")
    {
        bDisable = true;
    }
    document.getElementById("SetMinReadLock").disabled = bDisable;
    document.getElementById("SetTimeReadLock").disabled = bDisable;
    document.getElementById("SetReadIntevals").disabled = bDisable;
    document.getElementById("SetSwitchReadLock").disabled = bDisable;    
}