var postId;
var url = "http://localhost:8080";
var page = 1;

$(function(){
    var token = localStorage.getItem("token");
    console.log("pretoken",token);
    localStorage.setItem("token", token);
    if(token === null || token === undefined){
        self.location.href="login.html";
        alert("请先登录！");
    }
    else{
        postId = getPostId();
        console.log(postId);
        getDetailInfo();
        $("#detailToggle").click();
        getSupport();
    }
})

getComment=function(supportId){
    var thistoken = localStorage.getItem("token");
    
    $.ajax({
        type:"GET",
        url:url+"/Comment/"+supportId,
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        headers:{
            'token':thistoken
        },
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            localStorage.setItem("token", thistoken);
            renderComment(data);

        }
    }); 

}

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

renderDetail = function(data){
    // 渲染标题
    $("#postTitle").html("<h1>"+data.title+"</h1>");

    // 渲染内容
    var content = "<div class=\"panel panel-default\">";
    content += "<div class=\"panel-body\">";
    content += data.content;
    content += "</div>";
    content += "</div>";
    $("#Detail").html(content);
    
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
            renderDetail(data);
        }
    }); 

}

getSupport=function(){
    var thistoken = localStorage.getItem("token");
    var numPerPage = 9;
    
    $.ajax({
        type:"GET",
        url:url+"/Support/PostId/"+postId+"/"+page+"/"+numPerPage,
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        headers:{
            'token':thistoken
        },
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            localStorage.setItem("token", thistoken);
            renderSupport(data);
        }
    }); 
    
}

renderSupport=function(data){
    console.log("render support")
    var trueData = data.data;
    var content = "";
    for(var i = 0; i < trueData.length; i++){
        content += "<div class=\"panel panel-default\">";
        content += "    <div class=\"panel-heading\">";
        content += trueData[i].name;
        content += "    </div>";
        content += "        <div class=\"panel-body\">";
        content += trueData[i].content;
        content += "        </div>";
        content += "</div>";
    }
    console.log(content);
    $("#Support").html(content);
}

