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
        // alert(url);
        getBasicNotifyFromStorage();
        setBasic();
    }
});



getBasicNotifyFromStorage =function(){
    var html = localStorage.getItem("NotifyContent");
    var Unread = localStorage.getItem("UnreadNotifyNum");
    console.log(Unread);
    $("#Unread").html(Unread);
    $("#notification").html(html);

}

gotoChannel=function(id){
    localStorage.setItem("channelId", id);
    localStorage.setItem("channelPage","1");
    self.location.href="channelDetail.html";
}

setBasic=function(){
    var username = localStorage.getItem("username");
    var user = "<a style=\"cursor:default;\"><strong>"+username+"</strong></a>";
    console.log(username);
    console.log(user);
    $("li#userinfo").html(user);
}
