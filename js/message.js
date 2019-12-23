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
        url = localStorage.getItem("url");
        localStorage.setItem("notifyPage","1");
        // alert(url);
        getBasicNotifyFromStorage();
        getMyNotification();
    }
});


getBasicNotifyFromStorage =function(){
    var html = localStorage.getItem("NotifyContent");
    var Unread = localStorage.getItem("UnreadNotifyNum");
    console.log(Unread);
    $("#Unread").html(Unread);
    $("#notification").html(html);
}

getMyNotification = function(){
    var url = localStorage.getItem("url");
    var numPerPage = 9;
    var notifyPage = localStorage.getItem("notifyPage");

    var thistoken = localStorage.getItem("token");
    $.ajax({
        type:"GET", 
        url:url+"/Notify/"+notifyPage+"/"+numPerPage,
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        headers:{
            'token':thistoken
        },
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            renderNotification(data);
        }
    });
}

renderNotification = function(Data){
    var data = Data.data;
    var html = "";
    var now = new Date().getTime();
    for(var i = 0; i < data.length; i++){
        if(data[i].isRead === false){
            html +="<div class=\"message-card\"  onclick=\"setRead("+data[i].id+")\">";
            html +="    <div class=\"message-left red-point\" id=\"messageIcon"+data[i].id+"\">";
        }
        else{
            html +="<div class=\"message-card\"\">";
            html +="    <div class=\"message-left\">";
        }
        html +="        <img class=\"message-avatar\" src=\"./testIcon.jpg\"/>";
        html +="    </div>";
        html +="    <div class=\"message-right\" style=\"display:flex; flex-direction:column;\">";
        html +="        <div style=\"display: flex; align-items: center; color: #6a737d; background-color: #FFF;\">";
        html +="            <div class=\"timeline-username\">"+data[i].name+"</div>";
        html +="            <div style=\"margin-left: 5px\">"+data[i].type+"了你的帖子</div>"
        html +="        </div>";
        html +="        <div style=\"color:#333; margin-left:5px;\">"+data[i].title+"</div>";
        html +="        <div style=\"color: #6a737d; margin-left:5px;\">"+timeTrans(data[i].createTime, now)+"</div>";
        html +="    </div>";
        html +="</div>";
    }
    $("#notificationContent").html(html);
}

setAllRead = function(){
    var thistoken = localStorage.getItem("token");
    $.ajax({
        type:"PUT", 
        url:url+"/Notify/Allread",
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        headers:{
            'token':thistoken
        },
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            if(data.success === true){
                getBasicNotify();
                getMyNotification();
                alert("已标记为已读");
            }
            else{
                // alert("失败")
            }
        }
    });
}

setRead=function(id){
    var thistoken = localStorage.getItem("token");
    $.ajax({
        type:"PUT", 
        url:url+"/Notify/Read/"+id,
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        headers:{
            'token':thistoken
        },
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            if(data.success === true){
                readToggle(id);
                alert("已标记为已读");
            }
            else{
                // alert("失败")
            }
        }
    });
}

readToggle = function(id){
    var Unread = localStorage.getItem("UnreadNotifyNum");
    localStorage.setItem("UnreadNotifyNum", eval(Unread) - 1);
    $("#messageIcon"+id).removeClass("red-point");
}

getBasicNotify = function(){
    // var page = $("#currentPage").val();
    // 获取信息
    var thistoken = localStorage.getItem("token");
    // tokentouse = thistoken;
    // console.log("token",tokentouse);
    $.ajax({
        type:"GET", 
        url:url+"/Notify/1/5",
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        headers:{
            'token':thistoken
        },
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            renderBasicNotify(data);
        }
    });
}

renderBasicNotify = function(Data){
    $("#UnreadNum").html(Data.Unread);
    var data = Data.data;
    var html = "";
    for(var i = 0; i < data.length; i++){
        html +="<a href=\"#\" class=\"list-group-item\">";
        html +="<h4 class=\"list-group-item-heading text-overflow\">";
        html +="    <i class=\"fa fa-fw fa-envelope\"></i>"+data[i].name+data[i].type+"了你的帖子";
        html +="</h4>";
        html +="<p class=\"list-group-item-text text-overflow\">"+data[i].title+"</p>"
        html +="</a>";
    }
    $("#notification").html(html);
    localStorage.setItem("NotifyContent",html);
    localStorage.setItem("UnreadNotifyNum",Data.Unread);
}

timeTrans=function(time, now){
    var dateTimeStamp = Date.parse(time.slice(0,time.indexOf(".")).replace("T"," ").replace(/-/g, "/"));
    // var dateTimeStamp = Date.parse(time.slice(0,time.indexOf(".")).replace("T"," "));
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
