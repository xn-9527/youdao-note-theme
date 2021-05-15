/**
 * Created by cqh on 2014/11/24.
 */

/**
 * Created by cqh on 2014/11/24.
 */

function DateToFormatString( date, sep){
    if( !sep )
    {
        sep = "-";
    }
    var mm = date.getMonth() + 1;
    if( mm < 10 ){
        mm = "0" + mm;
    }
    var dd = date.getDate();
    if(dd < 10){
        dd = "0" + dd;
    }
    return date.getFullYear() + sep + mm + sep + dd;
}
