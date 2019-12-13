$(function () {
    window.localStorage.removeItem("token");
});

$("#loginbtn").click(function(){
    var url = "http://localhost:8080";
    var username = $("#Username").val();
    var password = $("#Password").val();
    console.log(username+password);
    const postdata ={
        "name":username,
        "password":password
    }

    // $.post(url+"/User/Login",postdata,function(data,status){
    //     alert(data+status);
    // });

    $.ajax({ 
        type:"POST", 
        url:url+"/User/Login",
        contentType:"application/json",  //发送信息至服务器时内容编码类型。             
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        data:JSON.stringify(postdata),
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            console.log("token",data.token);
            localStorage.setItem("token", data.token);
            var token = window.localStorage.getItem("token");
            console.log("token",token);
            self.location.href="home.html"
        }
    }); 
});