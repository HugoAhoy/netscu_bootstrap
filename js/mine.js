var url;
// var url = "http://localhost:8080";
// var tokentouse;
$(function()
{
    var token = localStorage.getItem("token");
    console.log("pretoken",token);
    localStorage.setItem("token", token);
    if(token === null || token === undefined){
        self.location.href="login.html";
        alert("请先登录！");
    }
    else{
        localStorage.setItem("timelinePage", "1");
        url = localStorage.getItem("url");
        // alert(url);
        getOperation();
        getMyPost();
        getMyCollection();
        getBasicNotifyFromStorage();
        setBasic();
    }
});

setBasic=function(){
    var username = localStorage.getItem("username");
    var user = "<a style=\"cursor:default;\"><strong>"+username+"</strong></a>";
    console.log(username);
    console.log(user);
    $("li#userinfo").html(user);
}


getBasicNotifyFromStorage =function(){
    var html = localStorage.getItem("NotifyContent");
    var Unread = localStorage.getItem("UnreadNotifyNum");
    console.log(Unread);
    $("#Unread").html(Unread);
    $("#notification").html(html);
}

getOperation = function(){
    var thistoken = localStorage.getItem("token");
    var timelinePage = localStorage.getItem("timelinePage");
    var numPerPage = 9;
    $.ajax({
        type:"GET",
        url:url+"/Operation/"+timelinePage+"/"+numPerPage,
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        headers:{
            'token':thistoken
        },
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            localStorage.setItem("token", thistoken);
            renderOperation(data);

        }
    });
}

getMyPost=function(){
    ;
}

getMyCollection = function(){
    ;
}

resizeTitle = function(title){
    var resizeLength = 15;
    console.log(title," ", title.length);
    if(title.length > resizeLength){
        return title.slice(0,resizeLength-3)+"...";
    }
    else{
        return title;
    }
}

timeTrans=function(time, now){
    var dateTimeStamp = Date.parse(time.slice(0,time.indexOf(".")).replace("T"," "));
    // console.log(dateTimeStamp);
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var halfamonth = day * 15;
	var month = day * 30;
	var diffValue = now - dateTimeStamp;
	if(diffValue < 0){return;}
	var monthC =diffValue/month;
	var weekC =diffValue/(7*day);
	var dayC =diffValue/day;
	var hourC =diffValue/hour;
	var minC =diffValue/minute;
	if(monthC>=1){
		result="" + parseInt(monthC) + "月前";
	}
	else if(weekC>=1){
		result="" + parseInt(weekC) + "周前";
	}
	else if(dayC>=1){
		result=""+ parseInt(dayC) +"天前";
	}
	else if(hourC>=1){
		result=""+ parseInt(hourC) +"小时前";
	}
	else if(minC>=1){
		result=""+ parseInt(minC) +"分钟前";
	}else{
        result="刚刚";
    }
	return result;
}

renderOperation=function(Data){
    var now = new Date().getTime();
    // console.log(now);
    var html = "";
    var data = Data.data;
    for(var i = 0; i < data.length; i++){
        html +="<div class=\"timeline-card\">";
        html +="    <div class=\"timeline-header\">";
        html +="        <img class=\"timeline-avatar\" src=\"./testIcon.jpg\"/>";
        html +="    <div class=\"timeline-username\"></div>";
        html +="    <div>"+timeTrans(data[i].createTime, now)+"</div>";
        html +="    <div style=\"margin-left: 5px\">"+data[i].type+"了</div>";
        html +="</div>";
        html +="<div class=\"timeline-content\">";
        html +="    <div class=\"post-title\">"+resizeTitle(data[i].title)+"</div>";
        html +="    <div class=\"post-content\">"+data[i].summary+"</div>";
        html +="    <div class=\"content-item\">";
        html +="        <div class=\"row\">";
        html +="            <div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">";
        html +="                <a>";
        html +="                    <span id=\"collects\" class=\"fa fa-fw fa-bookmark\" style=\"color: rgb(60, 79, 213);\">5</span>";
        html +="                </a>";
        html +="            </div>";
        html +="            <div class=\"col-xs-2 col-xs-offset-3 col-sm-2 col-sm-offset-3 col-md-2 col-md-offset-3 col-lg-2 col-lg-offset-3\">"
        html +="                <a>";
        html +="                    <span id=\"collects\" class=\"fa fa-fw fa-heart\" style=\"color: rgb(60, 79, 213);\">5</span>";
        html +="                </a>";
        html +="            </div>";
        html +="        </div>";
        html +="    </div>";
        html +="</div>";
        html +="</div>";
    }
    $("#my-timeline").html(html);
}

renderMyPost=function(){
    ;
}