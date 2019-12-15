var postId;
var url = "http://localhost:8080";
// var page = 1;

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
        setBasic();
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
    content += "<br><span style=\"color: rgb(200,200,200)\">发布于"+getNormalTime(data.createTime)+"</span>"
    content += "</div>";
    content += "<div class=\"panel-footer\">";
    content +="     <div class=\"row\">";
    content +="         <div class=\"col-xs-2 col-sm-2 col-md-2 col-md-offset-1 col-lg-2 col-lg-offset-1\">";
    content +="             <a href=\"javascript:likePost("+postId+");\">";
    content +="                 <span id=\"likes\" class=\"fa fa-fw fa-heart-o\" style=\"color: rgb(255, 60, 60);\">"+data.likeNum+"</span>";
    content += "            </a>";
    content +="         </div>";

    content +="         <div class=\"col-xs-2 col-xs-offset-3 col-sm-2 col-sm-offset-3 col-md-2 col-md-offset-3 col-lg-2 col-lg-offset-3\">";
    content +="             <a href=\"javascript:collectPost("+postId+")\">";
    content +="                 <span id=\"collects\" class=\"fa fa-fw fa-bookmark\" style=\"color: rgb(60, 79, 213);\">"+data.collectionNum+"</span>";
    content += "            </a>";
    // content +="             <i class=\"fa fa-fw fa-bookmark\"></i>"+data.collectionNum;
    content +="         </div>";

    content +="         <div class=\"col-xs-1 col-xs-offset-4 col-sm-1 col-sm-offset-4 col-md-1 col-md-offset-3 col-lg-1 col-lg-offset-3\">";
    if(data.isOwner === true){
        content +="             <a href=\"deletePost("+postId+");\">";
        content +="                 <span id=\"collects\" class=\"fa fa-fw fa-trash-o\" style=\"color: rgb(246, 141, 0);\"></span>";
    }
    else{
        content +="             <a data-toggle=\"modal\" href=\"#myModal\">";
        content +="                 <span id=\"collects\" class=\"fa fa-fw fa-reply\" style=\"color: rgb(246, 141, 0);\"></span>";
    }
    content += "            </a>";
    content +="         </div>";

    content +="     </div>";

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
    
    var page = localStorage.getItem("supportPage");
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

setBasic=function(){
    var username = localStorage.getItem("username");
    var user = "<a style=\"cursor:default;\"><strong>"+username+"</strong></a>";
    console.log(username);
    console.log(user);
    $("li#userinfo").html(user);
}

getNormalTime= function(timestamp){
    var list = timestamp.split("T");
    var date = list[0];
    var time = list[1].split(".")[0];
    return date + " " + time;
}

addSupport=function(){
    var supportContent = $("#supportContent").val();
    console.log("textarea内容",supportContent);

    var postData = {
        "postId":postId,
        "content":supportContent
    }

    var thistoken = localStorage.getItem("token");
    
    $.ajax({
        type:"POST",
        url:url+"/Support/Add",
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        headers:{
            'token':thistoken
        },
        data:JSON.stringify(postData),
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            localStorage.setItem("token", thistoken);
        }
    }); 
   

}