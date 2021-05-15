$(function() {
    var root = window;

    var lbTemplate =
        '<div class="container">' +
            '<ul class="clearfix img_list"></ul>' +
            '<div class="slide_buttomNav">' +
                '<a href="javascript:;" class="left slide_buttom_left"></a>' +
                '<a href="javascript:;" class="right slide_buttom_right"></a>' +
            '</div>' +
            '<div class="page_num">' +
            '</div>' +
            '<div class="close_btm">' +
                '<a href="javascript:;" class="right close_lightbox">' + 
                 '</a>' +
             '</div>' +
        '</div>';

    var liTemplate =
        '<li class="left">' +
            '<img hidefocus="true" width="100%" height="100%" src="{src}">' +
        '</li>';

    var width = 720;
    var index = 1;
    var imgLength = 0;
    var intervalTime = 6000;
    var nIntervid = undefined;

    var body = document.body;
    var $lightbox = $(lbTemplate);
    var $imgList = $lightbox.find('.img_list');
    var $pre = $lightbox.find('.slide_buttom_left');
    var $next = $lightbox.find('.slide_buttom_right');
    var $pageNum = $lightbox.find('.page_num');
    var $closeBtn = $lightbox.find('.close_lightbox');

    $lightbox.appendTo(body);

    var nextfunc = function () {
        index += 1;
        if(index > imgLength) {
            index = 1;
            $imgList.css({
                'margin-left': -width * (imgLength - 1)
            });
        }
        go(index);

        //清除interval
        window.clearInterval(nIntervid);

        //disable button a short period time
        $next.unbind("click");
        setTimeout(function() { $next.click(nextfunc); }, 400);
    };

    var prefunc = function () {
        index -= 1;
        if(index < 1) {
            index = imgLength;
            $imgList.css({
                'margin-left': -width * (imgLength * 2)
            });
        }
        go(index);

        //清除interval
        window.clearInterval(nIntervid);

        //disable button a short period time
        $pre.unbind("click");
        setTimeout(function() { $pre.click(prefunc); }, 400);
    };

    $next.click(nextfunc);

    $pre.click(prefunc);

    var autonext = function (){
        index += 1;
        if(index > imgLength) {
            index = 1;
            $imgList.css({
                'margin-left': -width * (imgLength - 1)
            });
        }
        go(index);
    };

    var go = function (idx) {
        $imgList.animate({
            'margin-left': (idx - 1) * -width + -width * imgLength
        }, 'normal');
        check();

        //设定intervaltime自动翻页
        //nIntervid = window.setInterval(autonext, intervalTime);
    };

    var check = function () {
        //设置dot
        for(var i = 0; i < imgLength; i++)
        {
            $lightbox.find('.dot' + (i + 1)).css({ 'background': "#b8def0"});
        }
        $lightbox.find('.dot' + index).css({ 'background': "#16a4ea"});
    };
    

    var setDots = function() {
        var dots = [];
        //计算dot的坐标
        for(var i = 0; i < imgLength; i++) {
            dots.push("<a class='dot" + (i + 1) + " dot' style='left:" + (i * 20 + 360 - imgLength * 5 - 10)+"px'>");
        }
        $pageNum.html(dots.join(''));
        $lightbox.find('.dot' + 1).css({ 'background': "#16a4ea"});
    };

    var showLightBox = function(imgs) {
        index = 1;
        imgLength = imgs.length;
        check();
        var slides = [], item;
        for(var j=0; j < 3; j++)
        {
            for(var i = 0; i < imgLength; i++) {
                item = imgs[i].split(/\|/g);
                slides.push(liTemplate.replace(/\{src\}/g, item[0]));
            }
        }
        $imgList.css({
            'width': width * imgLength * 3,
            'margin-left': -width * imgLength
        });

        $imgList.html(slides.join(''));
        setDots();
    };

    var slides = $('.pList').data("slides").split(',');
    showLightBox(slides);

    //设定intervalTime自动翻页
    nIntervid = window.setInterval(autonext, intervalTime);


    //关闭按钮 接口
    $closeBtn.click(function () {
        if (window.YNote && window.YNote.CloseNewFeatureGuidForm) {
            window.YNote.CloseNewFeatureGuidForm();
        }
        return false;
    });
});
