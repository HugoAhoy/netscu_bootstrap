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
        getFan();
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

getFan = function(){
    var thistoken = localStorage.getItem("token");

    $.ajax({ 
        type:"GET", 
        url:url+"/User/MyFan/"+uid,
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        headers:{
            'token':thistoken
        },
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            console.log("token",data.token);
            // alert(data.token);
            renderFan(data);
        }
    }); 
}

renderFan=function(Data){
    var thisUid = Data.uid;
    var data = Data.data;
    var html = "";
    for(var i = 0; i < data.length; i++){
        html +="<div style=\"border-bottom: 1px solid #eee; display: flex; align-items: center; justify-content: space-between; background-color: #fff;\">";
        html +="    <div class=\"user-info-card\" onclick=\"gotoUser("+data[i].id+")\">";
        html +="        <div class=\"media-left\">";
        html +="            <img src=\"./testIcon.jpg\" class=\"media-object\" style=\"width:60px; height: 60px; border-radius: 30px;\">";
        html +="        </div>";
        html +="        <div id=\"UserInfo\" class=\"media-body\" >";
        html +="            <h4 style=\"margin-top: 5px; margin-bottom: 5px;\">"+data[i].name+"</h4>";
        html +="            <p>"+data[i].description+"</p>";
        html +="        </div>";
        html +="    </div>";
        html +="    <div id=\"followBtnArea"+data[i].id+"\">";
        if(eval(data[i].id) !== eval(thisUid)){
            if(data[i].asFan !== undefined && data[i].asFan !== null){
                // console.log(data[i].asFan);
                html +="        <div class=\"btn btn-default\" style=\"background:#eee; margin-right:35px;  border-radius: 15px;\" onclick=\"unfollow("+data[i].id+")\">已关注</div>";
            }
            else{
                html +="        <div class=\"btn btn-primary\" style=\"margin-right:35px; border-radius: 15px;\" onclick=\"follow("+data[i].id+")\">关注</div>";
            }    
        }
        else{
            ;
        }
        // html +="        <div class=\"btn btn-default\" style=\"background:#eee; margin-right:35px  border-radius: 15px;\">互相关注</div>"
        html +="    </div>";
        html +="</div>";
    }
    $("#userList").html(html);
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
                $("#followBtnArea"+id).html(html);            
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
                $("#followBtnArea"+id).html(html);
            }
            else{
                // alert("失败")
            }
        }
    });
}

gotoUser = function(id){
    self.location.href="mine.html?uid="+id;
}