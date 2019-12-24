var postId;
var url;
// var url = "http://localhost:8080";

$(function(){
    var token = localStorage.getItem("token");
    console.log("pretoken",token);
    localStorage.setItem("token", token);
    if(token === null || token === undefined){
        self.location.href="login.html";
        alert("请先登录！");
    }
    else{
        url = localStorage.getItem("url");
        $('#summernote').summernote({
            height: ($(window).height() - 300),
            toolbar: [
                ['style', ['style']],
                    ['font', ['bold', 'italic', 'underline']],
                    ['para', ['ul', 'ol']],
                    // ['insert', ['link', 'picture', 'hr']],
                    ['insert', ['link', 'hr']],
                    ['view', ['fullscreen']]
                ]
        
        });
        postId = getPostId();
        getDetailInfo();
        setBasic();

        getBasicNotifyFromStorage();
    }

    
});

function getQueryVariable(variable)
{
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

getPostId = function(){
    return getQueryVariable("postid");
}

getDetailInfo = function(){
    var thistoken = localStorage.getItem("token");
    
    $.ajax({
        type:"GET",
        url:url+"/Post/Info/"+postId,
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        headers:{
            'token':thistoken
        },
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            localStorage.setItem("token", thistoken);
            putDetail(data);
        }
    }); 
}


putDetail=function(data){
    $("#postTitle").val(data.title);
    $("#summernote").code(data.content);
    $("#CateSel").val(data.cateId);

}

submitPost=function (){
    var title = $("#postTitle").val();
    if(title === "" || title === null || title === undefined){
        alert("标题不能为空");
        return;
    }
    var content = $("#summernote").code();
    // var code=$("#summernote").summernote("code");
    var puretext = $('<div>'+content+'</div>').text();
    var cateId = $('#CateSel').val();
    console.log("code\n",content);
    console.log("text\n", puretext);
    console.log("cateId\n",cateId);
    const postdata ={
        "id":postId,
        "title":title,
        "content":content,
        "summary":puretext,
        "cateId":cateId
    }

    var thistoken = localStorage.getItem("token");

    $.ajax({
        type:"PUT",
        url:url+"/Post/Modify",
        contentType:"application/json",  //发送信息至服务器时内容编码类型。
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        headers:{
            'token':thistoken
        },
        data:JSON.stringify(postdata),
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            localStorage.setItem("token", thistoken);
            if(data.success === true){
                self.location.href="PostDetail.html?postid="+data.id;
            }
            else{
                alert("发布帖子失败");
            }
        }
    });
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