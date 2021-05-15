var attredit = ["setnickname"];
var attrshow = ["nickname"];
var errorTip;
function ChangeUserInfo(type)
{
	if(type == '1')
	{
        document.getElementById("InfoTip").innerHTML = "";
	    CopyShowToEdit();
	}
	else if(type == '2')
	{
		CopyEditToShow();
	}
	
    var arr = ["InfoShow","BtnChangeInfo","InfoChange","BtnSaveInfo"];
	for(var i=0; i<arr.length;i++)
    {
        var obj = document.getElementById(arr[i]);
        if(obj.style.display == 'block')
        {
            obj.style.display = 'none';
        }
        else
        {
            obj.style.display = 'block';
        }
    }
}

function SaveUserInfo()
{
    var obj = document.getElementById("InfoTip");
    var errorNn = checkNickName('setnickname', '昵称');
    if(errorNn.length != 0)
    {
        obj.innerHTML = errorNn;
        return;
    }
    /*
    var errorSig = checkSignature();
    if(errorSig.length != 0)
    {
        obj.innerHTML = errorSig;
        return;
    }
    */

    obj.innerHTML = "";
    SetAllUserInfo();
    SendMessageToClient("SetUserInfo");

}

function onClickUploadNewPortrait() 
{
	SendMessageToClient("CropPortrait");
}

function hideblind()
{
	var obj = document.getElementById('blind');
	obj.style.display = "none";
}

function showblind()
{
	var obj = document.getElementById('blind');
	obj.style.display = "block";
}

function checkNickName(id, title) 
{   
    var str = document.getElementById(id).value;
    var error = "";
    if (str == "") {
		error = title + "不能为空。";
        return error;
    }

    var reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]*$/;
    var str2 = str;
    if (str2.replace(/[^\x00-\xff]/g, "**").length > 32) {
        error = title + "不能超过32个字符,一个汉字对应两个字符。";
        return error;
    }

    if (!reg.test(str)) {
        error = title + '仅支持中文、英文、数字、下划线。';
        return error;
    }
    return error;
}

function checkSignature() 
{
    var str = document.getElementById("setsigature").value;
    var error = "";
    if (str.replace(/[^\x00-\xff]/g, "**").length > 60) {
        error = "签名不能超过60个字符,一个汉字对应两个字符。";
    }
    return error;
}

function SetAllUserInfo() 
{
    for(var i=0; i<attredit.length;i++)
    {
        var obj = document.getElementById(attredit[i]);
        SendMessageToClient("setValue", attredit[i], obj.value);
    }
	
    var obj1 = document.getElementById("district");
    var obj2 = document.getElementById("city");
    SendMessageToClient("setValue", "setDistrict", obj1.value + " " + obj2.value);

    var gender1 = document.getElementById("genderMale");
    var gender2 = document.getElementById("genderFemale");
    var gender3 = document.getElementById("genderUnknown");
	
	var bcheck1 = $(gender1).parent().hasClass("checked");
	var bcheck2 = $(gender2).parent().hasClass("checked");
	var bcheck3 = $(gender3).parent().hasClass("checked");
    if (bcheck1 == true) {
        SendMessageToClient("setValue", "setGender", "0");
    }
    else if (bcheck2 == true) {
        SendMessageToClient("setValue", "setGender", "1");
    }
    else if (bcheck3 == true) {
        SendMessageToClient("setValue", "setGender", "2");
    }
}

var districtData = getDistrictData();
function updateOption(objectId, optionList) {
    var selectObject = document.getElementById(objectId);
    selectObject.disabled = false;
    var innerHtml = "";
    for (var i in optionList) {
        var str = "<option>" + optionList[i] + "</option>";
        innerHtml += str;
    }
    selectObject.innerHTML = innerHtml;
}
function onSelectChange(object) {
    for (var i = 0; i < districtData.length; ++i) {
        if (districtData[i].name == object.value) {
            updateOption("city", districtData[i].cities);
        }
    }
}

function initDistrictView(districtSelect) {
    var districtArr = [];
    if (districtSelect == undefined) {
        districtSelect = "";
    }

    for (var i = 0; i < districtData.length; ++i) {
        districtArr.push(districtData[i].name);
    }
    updateOption("district", districtArr);
    var districtElem = document.getElementById("district");
    districtElem.value = districtSelect;
    onSelectChange(districtElem)
}

function CopyShowToEdit()
{
    for(var i=0; i<attrshow.length;i++)
    {
        var objShow = document.getElementById(attrshow[i]);
		var objEdit = document.getElementById(attredit[i]);
		objEdit.value = objShow.innerHTML;
    }
}

function CopyEditToShow()
{
    for(var i=0; i<attredit.length;i++)
    {
        var objEdit = document.getElementById(attredit[i]);
        document.getElementById(attrshow[i]).innerHTML = objEdit.value;
    }
	var obj = document.getElementById("genderMale");
	var obj2 = document.getElementById("genderFemale");
    var bcheck1 = $(obj).parent().hasClass("checked");
    var bcheck2 = $(obj2).parent().hasClass("checked");
    
	if( bcheck1 == true )
	{
		document.getElementById('userGender').innerHTML = '男';
	}
	else if( bcheck2 == true )
	{
        document.getElementById('userGender').innerHTML = '女';
	}
	else
	{
		document.getElementById('userGender').innerHTML = '保密';
	}
	
	var obj3 = document.getElementById("district");
    var obj4 = document.getElementById("city");
	var areaValue = obj3.value + ' ' + obj4.value;
	document.getElementById("userArea").innerHTML = areaValue;
}

function OnUpdateUserInfo(param1)
{
    var obj = document.getElementById("InfoTip");
    if(param1 == '200')
    {
        obj.innerHTML = "";
        ChangeUserInfo('2');
    }
    else if(param1 == "10003")
    {
        obj.innerHTML = "昵称冲突, 请选择另外一个昵称";
    }
    else
    {
        obj.innerHTML = "修改信息失败，请链接网络后重试";
    }
}

function CheckIn()
{
    document.getElementById("btnCheckin").disabled = true;
    SendMessageToClient("CheckIn");
}

function setCheckInSpace(param1, param2)
{
    var obj = document.getElementById("btnCheckin");
    if(param1 == 'false')
    {
        obj.disabled = false;
    }
    else
    {
        obj.value = "已签到";
        var checkintip = document.getElementById("checkinTip");
        checkinTip.style.display = "none";
        //show 3 seconds, then disappear
        var obj2 = document.getElementById("SpaceCheckIn");
        document.getElementById("redcircle").style.display = "none"; 
        obj2.innerHTML = param2;
        setTimeout(function(){
            obj2.innerHTML = "";
            }, 2000);
    }
}