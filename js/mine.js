var url;
var uid;
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
        uid = getUid();
        localStorage.setItem("timelinePage", "1");
        localStorage.setItem("postPage", "1");
        localStorage.setItem("collectionPage", "1");
        url = localStorage.getItem("url");
        // alert(url);
        getOperation();
        getPost();
        getCollection();
        getUserInfo();
        getBasicNotifyFromStorage();
        setBasic();
    }
});


getQueryVariable=function(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    console.log(vars);
    for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            console.log(pair[0]," ", pair[1]);
            if(pair[0] === variable){
                return pair[1];
            }
    }
    return(false);
}

getUid = function(){
    let temp = getQueryVariable("uid");
    if(temp === false){
        return "";
    }
    else{
        return temp;
    }
}

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
        url:url+"/Operation/"+timelinePage+"/"+numPerPage+"/"+uid,
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

getPost=function(){
    var thistoken = localStorage.getItem("token");
    var postPage = localStorage.getItem("postPage");
    var numPerPage = 9;
    $.ajax({
        type:"GET",
        url:url+"/Post/UserPost/"+postPage+"/"+numPerPage+"/"+uid,
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        headers:{
            'token':thistoken
        },
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            localStorage.setItem("token", thistoken);
            renderPost(data);
        }
    });
}

getCollection = function(){
    var thistoken = localStorage.getItem("token");
    var collectionPage = localStorage.getItem("collectionPage");
    var numPerPage = 9;
    $.ajax({
        type:"GET",
        url:url+"/Post/Collection/"+collectionPage+"/"+numPerPage,
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        headers:{
            'token':thistoken
        },
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            localStorage.setItem("token", thistoken);
            renderCollection(data);
        }
    });
}

getUserInfo = function(){
    var thistoken = localStorage.getItem("token");
    $.ajax({
        type:"GET",
        url:url+"/User/Info/"+uid,
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        headers:{
            'token':thistoken
        },
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            localStorage.setItem("token", thistoken);
            renderUserInfo(data);
        }
    });
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

renderOperation=function(Data){
    var now = new Date().getTime();
    // console.log(now);
    var html = "";
    var data = Data.data;
    for(var i = 0; i < data.length; i++){
        html +="<div class=\"timeline-card\" onclick=\"gotoDetail("+data[i].id+")\">";
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
        html +="                    <span id=\"collects\" class=\"fa fa-fw fa-bookmark\" style=\"color: rgb(60, 79, 213);\">"+data[i].collectionNum+"</span>";
        html +="                </a>";
        html +="            </div>";
        html +="            <div class=\"col-xs-2 col-xs-offset-3 col-sm-2 col-sm-offset-3 col-md-2 col-md-offset-3 col-lg-2 col-lg-offset-3\">"
        html +="                <a>";
        html +="                    <span id=\"likes\" class=\"fa fa-fw fa-heart\" style=\"color: rgb(255, 60, 60);\">"+data[i].likeNum+"</span>";
        html +="                </a>";
        html +="            </div>";
        html +="        </div>";
        html +="    </div>";
        html +="</div>";
        html +="</div>";
    }
    if(data.length !== 0){
        $("#my-timeline").html(html);
    }
}

renderPost=function(Data){
    var now = new Date().getTime();
    // console.log(now);
    var html = "";
    var data = Data.data;
    for(var i = 0; i < data.length; i++){
        html +="<div class=\"timeline-card\" onclick=\"gotoDetail("+data[i].id+")\">";
        html +="    <div class=\"timeline-header\">";
        html +="        <img class=\"timeline-avatar\" src=\"./testIcon.jpg\"/>";
        html +="    <div class=\"timeline-username\">"+data[i].name+"</div>";
        html +="    <div>"+timeTrans(data[i].createTime, now)+"</div>";
        html +="    <div style=\"margin-left: 5px\">发布了</div>";
        html +="</div>";
        html +="<div class=\"timeline-content\">";
        html +="    <div class=\"post-title\">"+resizeTitle(data[i].title)+"</div>";
        html +="    <div class=\"post-content\">"+data[i].summary+"</div>";
        html +="    <div class=\"content-item\">";
        html +="        <div class=\"row\">";
        html +="            <div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">";
        html +="                <a>";
        html +="                    <span id=\"collects\" class=\"fa fa-fw fa-bookmark\" style=\"color: rgb(60, 79, 213);\">"+data[i].collectionNum+"</span>";
        html +="                </a>";
        html +="            </div>";
        html +="            <div class=\"col-xs-2 col-xs-offset-3 col-sm-2 col-sm-offset-3 col-md-2 col-md-offset-3 col-lg-2 col-lg-offset-3\">"
        html +="                <a>";
        html +="                    <span id=\"likes\" class=\"fa fa-fw fa-heart\"style=\" color: rgb(255, 60, 60);\">"+data[i].likeNum+"</span>";
        html +="                </a>";
        html +="            </div>";
        html +="        </div>";
        html +="    </div>";
        html +="</div>";
        html +="</div>";
    }
    if(data.length !== 0){
        $("#my-publish").html(html);
    }
}

renderCollection=function(Data){
    var now = new Date().getTime();
    // console.log(now);
    var html = "";
    var data = Data.data;
    for(var i = 0; i < data.length; i++){
        html +="<div class=\"timeline-card\" onclick=\"gotoDetail("+data[i].id+")\">";
        html +="    <div class=\"timeline-header\">";
        html +="        <img class=\"timeline-avatar\" src=\"./testIcon.jpg\"/>";
        html +="    <div class=\"timeline-username\"></div>";
        html +="    <div>"+timeTrans(data[i].createTime, now)+"</div>";
        html +="    <div style=\"margin-left: 5px\">收藏了</div>";
        html +="</div>";
        html +="<div class=\"timeline-content\">";
        html +="    <div class=\"post-title\">"+resizeTitle(data[i].title)+"</div>";
        html +="    <div class=\"post-content\">"+data[i].summary+"</div>";
        html +="    <div class=\"content-item\">";
        html +="        <div class=\"row\">";
        html +="            <div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">";
        html +="                <a>";
        html +="                    <span id=\"collects\" class=\"fa fa-fw fa-bookmark\" style=\"color: rgb(60, 79, 213);\">"+data[i].collectionNum+"</span>";
        html +="                </a>";
        html +="            </div>";
        html +="            <div class=\"col-xs-2 col-xs-offset-3 col-sm-2 col-sm-offset-3 col-md-2 col-md-offset-3 col-lg-2 col-lg-offset-3\">"
        html +="                <a>";
        html +="                    <span id=\"likes\" class=\"fa fa-fw fa-heart\" style=\"color: rgb(255, 60, 60);\">"+data[i].likeNum+"</span>";
        html +="                </a>";
        html +="            </div>";
        html +="        </div>";
        html +="    </div>";
        html +="</div>";
        html +="</div>";
    }
    if(data.length !== 0){
        $("#my-star").html(html);
    }
}

renderUserInfo=function(data){
    var html = "";
    html += "<h4 class=\"media-heading\">"+data.name+"</h4>"
    html += "<p>"+data.description+"</p>";
    $("#UserInfo").html(html);
    $("#myFollow").html(data.followNum);
    $("#FollowMe").html(data.fansNum);
    if(data.me){
        $("#followBtnArea").html("");
    }
    else{
        if(data.followed){
            var html ="<div class=\"btn btn-default\" style=\"background:#eee; margin-right:35px;  border-radius: 15px;\" onclick=\"unfollow("+data.id+")\">已关注</div>";
            $("#followBtnArea").html(html);
        }
        else{
            var html ="<div class=\"btn btn-primary\" style=\"margin-right:35px; border-radius: 15px;\" onclick=\"follow("+data.id+")\">关注</div>";
            $("#followBtnArea").html(html);
        }
    }
}

gotoDetail=function(id){
    self.location.href="PostDetail.html?postid="+id;
}

gotoFollow=function(){
    var gotoUrl = "followuserList.html";
    if(uid !== ""){
        gotoUrl += "?uid="+uid;
    }
    self.location.href= gotoUrl;
}

gotoFan = function(){
    var gotoUrl = "fanuserList.html";
    if(uid !== ""){
        gotoUrl += "?uid="+uid;
    }
    self.location.href= gotoUrl;

}

unfollow = function(id){
    var thistoken = localStorage.getItem("token");
    var postData = {
        "id":id
    }

    $.ajax({
        type:"POST", 
        url:url+"/User/Unfollow",
        contentType:"application/json",  //发送信息至服务器时内容编码类型。                     
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        data:JSON.stringify(postData),
        headers:{
            'token':thistoken
        },
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            if(data.success === true){
                var html = "<div class=\"btn btn-primary\" style=\"margin-right:35px; border-radius: 15px;\" onclick=\"follow("+id+")\">关注</div>";
                $("#followBtnArea").html(html);            
            }
            else{
                // alert("失败")
            }
        }
    });
}

follow = function(id){
    var thistoken = localStorage.getItem("token");
    var postData = {
        "id":id
    }

    $.ajax({
        type:"POST", 
        url:url+"/User/Follow",
        contentType:"application/json",  //发送信息至服务器时内容编码类型。                     
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        data:JSON.stringify(postData),
        headers:{
            'token':thistoken
        },
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            if(data.success === true){
                var html = "<div class=\"btn btn-default\" style=\"background:#eee; margin-right:35px;  border-radius: 15px;\" onclick=\"unfollow("+id+")\">已关注</div>";
                $("#followBtnArea").html(html);
            }
            else{
                // alert("失败")
            }
        }
    });
}
