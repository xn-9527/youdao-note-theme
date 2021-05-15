function onLoad() {
    var info;
    var prevText = "<<上一个";
    var nextText = "下一个>>";
    var index = window.external.PageIndex + 1;
    var count = window.external.PageCount;

    if (index == 1) {
        prevText = "";
    }

    if (index == count) {
        nextText = "开始使用>>";
    }
    info = "&nbsp" + (window.external.PageIndex + 1) + "/" + window.external.PageCount + "&nbsp" + "&nbsp";
    document.getElementById("pageIndex").innerHTML = info;
    document.getElementById("ButtonPrev").innerHTML = prevText;
    document.getElementById("ButtonNext").innerHTML = nextText;
}