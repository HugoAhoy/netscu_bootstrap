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
    }
});


getBasicNotifyFromStorage =function(){
    var html = localStorage.getItem("NotifyContent");
    var Unread = localStorage.getItem("UnreadNotifyNum");
    console.log(Unread);
    $("#Unread").html(Unread);
    $("#notification").html(html);
}