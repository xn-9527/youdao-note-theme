/**
 * Created by cqh on 2014/10/9.
 */

function FormatString(){
    var agrs = arguments;
    return arguments[0].replace(/\{(\d+)\}/g, function (s, i) {
        return agrs[Number(i)+1];
    });
}