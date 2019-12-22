var postId;
var url;
// var url = "http://localhost:8080";
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
        url = localStorage.getItem("url");
        // alert(url);
        postId = getPostId();
        localStorage.setItem("supportPage","1");
        console.log(postId);
        getDetailInfo();
        $("#detailToggle").click();
        getSupport();
        setBasic();
        getBasicNotifyFromStorage();
    }
})

getAllComment=function(supportId){
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
            renderAllComment(data);
        }
    }); 

}
timeTrans=function(time, now){
    var dateTimeStamp = Date.parse(time.slice(0,time.indexOf(".")).replace("T"," ").replace(/-/g, "/"));
    // alert(time);
    // alert(time.slice(0,time.indexOf(".")).replace("T"," ").replace(/-/g, "/"));
    // console.log(dateTimeStamp);
    // alert(now);
    // alert(dateTimeStamp);
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
    var html = "<h1>"+data.title+"</h1>";
    // html += "<form id=\"cm-search\" action=\"index.html\" method=\"get\">";
    // html += "<input type=\"search\" name=\"q\" autocomplete=\"off\" placeholder=\"Search...\">";
    // html += "</form>";
    
    $("#postTitle").prepend(html);
    
    // 渲染内容    
    var content = "<div class=\"panel panel-default\">";
    content += "<div class=\"panel-body\">";
    content += data.content;
    content += "<br><span style=\"color: rgb(200,200,200)\">发布于"+getNormalTime(data.createTime)+"</span>"
    content += "</div>";
    content += "<div class=\"panel-footer\">";
    content +="     <div class=\"row\">";

    if(data.isOwner === true){
        content +="         <div class=\"col-xs-1 col-xs-offset-3 col-sm-1 col-sm-offset-3 col-md-1 col-md-offset-3 col-lg-1 col-lg-offset-3\">";
        content +="             <a href=\"javascript:editPost("+postId+");\">";
        content +="                 <span class=\"fa fa-fw fa-edit\" style=\"color: rgb(246, 141, 0);\"></span>";
        content += "            </a>";
        content +="         </div>";    

        content +="         <div class=\"col-xs-1 col-xs-offset-4 col-sm-1 col-sm-offset-4 col-md-1 col-md-offset-4 col-lg-1 col-lg-offset-4\">";
        content +="             <a href=\"javascript:deletePost("+postId+");\">";
        content +="                 <span class=\"fa fa-fw fa-trash-o\" style=\"color: rgb(246, 141, 0);\"></span>";
        content += "            </a>";
        content +="         </div>";    
    }
    else{
        content +="         <div id=\"likes"+postId+"\" class=\"col-xs-2 col-sm-2 col-md-2 col-md-offset-1 col-lg-2 col-lg-offset-1\">";
        content +="             <a href=\"javascript:likePost("+postId+");\">";
        if(data.isLiked === true){
            content +="                 <span class=\"fa fa-fw fa-heart\" style=\"color: rgb(255, 60, 60);\">"+data.likeNum+"</span>";
        }
        else{
            content +="                 <span class=\"fa fa-fw fa-heart-o\" style=\"color: rgb(255, 60, 60);\">"+data.likeNum+"</span>";
        }
        content += "            </a>";
        content +="         </div>";
    
        content +="         <div id=\"collects"+postId+"\" class=\"col-xs-2 col-xs-offset-3 col-sm-2 col-sm-offset-3 col-md-2 col-md-offset-3 col-lg-2 col-lg-offset-3\">";
        content +="             <a href=\"javascript:collectPost("+postId+")\">";

        if(data.isCollected === true){
            content +="                 <span class=\"fa fa-fw fa-bookmark\" style=\"color: rgb(60, 79, 213);\">"+data.collectionNum+"</span>";
        }
        else{
            content +="                 <span class=\"fa fa-fw fa-bookmark-o\" style=\"color: rgb(60, 79, 213);\">"+data.collectionNum+"</span>";
        }
        content += "            </a>";
        content +="         </div>";
    
        content +="         <div class=\"col-xs-1 col-xs-offset-4 col-sm-1 col-sm-offset-4 col-md-1 col-md-offset-3 col-lg-1 col-lg-offset-3\">";
        content +="             <a data-toggle=\"modal\" href=\"#myModal\">";
        content +="                 <span class=\"fa fa-fw fa-reply\" style=\"color: rgb(246, 141, 0);\"></span>";
        content += "            </a>";
        content +="         </div>";    
    }

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
    var now = new Date().getTime();
    console.log("render support")
    var myid = data.uid;
    var trueData = data.data;
    var content = "";
    var commentNum;
    for(var i = 0; i < trueData.length; i++){
        content += "<div class=\"panel panel-default\">";
        content += "    <div class=\"panel-heading\">";
        content += trueData[i].name;
        content += "    </div>";
        content += "        <div class=\"panel-body\" onclick=\"showComment("+trueData[i].id+")\">";
        content += trueData[i].content;
        content +="<br><br><span style=\"color: rgb(200,200,200)\">回帖于"+timeTrans(trueData[i].createTime, now)+"</span>";
        content += "        </div>";

        content += "<div class=\"panel-footer\">";
        content +="     <div class=\"row\">";

        content +="         <div class=\"col-xs-3  col-sm-3 col-md-3 col-lg-3\">";
        content +="             <a>";
        if(trueData[i].count === undefined || trueData[i].count === null){
            commentNum = "0";
        }
        else{
            commentNum = trueData[i].count;
        }
        content +="                 <span class=\"fa fa-fw fa-comment-o\" style=\"color: rgb(246, 141, 0);\">"+ eval(commentNum) +"</span>";
        content += "            </a>";
        content +="         </div>";    
    
        if(eval(myid) === eval(trueData[i].uid)){
            content +="         <div class=\"col-xs-1 col-xs-offset-8 col-sm-1 col-sm-offset-8 col-md-1 col-md-offset-8 col-lg-1 col-lg-offset-8\">";
            content +="             <a href=\"javascript:deleteSupport("+trueData[i].id+");\">";
            content +="                 <span class=\"fa fa-fw fa-trash-o\" style=\"color: rgb(246, 141, 0);\"></span>";
            content += "            </a>";
            content +="         </div>";    
        }
		content += "    </div>";
        content += "</div>";
    

        content += "    <div id=\"collapse"+trueData[i].id+"\" class=\"panel-collapse collapse\">";
		// content += "	    <div class=\"panel-body\">";
		// content += "		    hahha";
		// content += "	    </div>";
		content += "    </div>";
        content += "</div>";
    }
    console.log(content);
    $("#Support").html(content);
}

rerenderComment = function(id){
    var thistoken = localStorage.getItem("token");
    var numPerPage = 5;
    
    $.ajax({
        type:"GET",
        url:url+"/Comment/"+id+"/1/"+numPerPage,
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        headers:{
            'token':thistoken
        },
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            localStorage.setItem("token", thistoken);
            renderComment(data, id);
        }
    });
}

showComment = function(id){
    // console.log($('#collapse'+id).html());
    var thistoken = localStorage.getItem("token");
    var numPerPage = 5;
    
    $.ajax({
        type:"GET",
        url:url+"/Comment/"+id+"/1/"+numPerPage,
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        headers:{
            'token':thistoken
        },
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            localStorage.setItem("token", thistoken);
            renderComment(data, id);
        }
    });
    $('#collapse'+id).collapse('toggle');
}

renderComment = function(Data, id){
    // var html = "	    <div class=\"panel-body\">";
    // html += "<ul class=\"list-group\">";
    var html ="";
    var data = Data.data;
    for(var i = 0; i < data.length; i++){
        html +="<li class=\"list-group-item\" style=\"background-color:#E6E6E6\">";
        html +="<strong>"+data[i].name+"</strong><br>"+data[i].content;
        html +="</li>";
    }
    if(data.length === 0){
        html +="<li class=\"list-group-item\" style=\"background-color:#E6E6E6\">";
        html += "暂无评论";
        html +="</li>";
    }
    if(Data.Finish !== true){
        html +="<li class=\"list-group-item\" style=\"background-color:#E6E6E6;text-align:center\">";
        html +="<a href=\"javascript:showAllComment("+id+");\" >显示全部</a> "
        html +="</li>";
    }
    html +="<li class=\"list-group-item\" style=\"background-color:#E6E6E6\">";
    html +="    <textarea autofocus cols=\"10\" id=\"commentContent"+id+"\" class=\"form-control\" id=\"deblock_udid\" name=\"deblock_udid\" rows=\"2\" placeholder=\"评论几句...\"></textarea>";
    html +="    <br><button class =\"btn btn-primary\" onclick=\"addCommentNormal("+id+")\">评论</button>"
    html +="</li>";
    // html +="</ul>"
    // html += "	    </div>";
    $('#collapse'+id).html(html);
}

renderAllComment = function(Data){
    var html ="";
    var data = Data.data;
    for(var i = 0; i < data.length; i++){
        html +="<li class=\"list-group-item\">";
        html +=data[i].name+"<br>"+data[i].content;
        html +="</li>";
    }
    // html +="</ul>"
    // html += "	    </div>";
    $("#allCommentBody").html(html);

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
        contentType:"application/json",  //发送信息至服务器时内容编码类型。             
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        headers:{
            'token':thistoken
        },
        data:JSON.stringify(postData),
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            $("#supportCancel").click();
            $("#supportContent").val("");
            localStorage.setItem("token", thistoken);
            localStorage.setItem("supportPage","1");
            getSupport();
            $("#supportToggle").click();
        }
    });
}

likePost = function(postId){
    var thistoken = localStorage.getItem("token");
    if($("#likes"+postId+" a span").attr("class") === "fa fa-fw fa-heart-o"){
        $.ajax({
            type:"POST",
            url:url+"/Post/Like/"+postId,
            dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
            headers:{
                'token':thistoken
            },
            success:function(data, status){ 
                console.log("data= ",data, "status=", status);
                localStorage.setItem("token", thistoken);
                if(data.success === true){
                    $("#likes"+postId+" a span").attr("class","fa fa-fw fa-heart");
                    var likeNum = $("#likes"+postId+" a span").html();
                    $("#likes"+postId+" a span").html(eval(likeNum)+1);
                }
                else{
                    alert("操作失败");
                }
            }
        });
    }
    else {
        // $("#likes"+postId+" a span").attr("class","fa fa-fw fa-heart-o");
        $.ajax({
            type:"PUT",
            url:url+"/Post/Unlike/"+postId,
            dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
            headers:{
                'token':thistoken
            },
            success:function(data, status){ 
                console.log("data= ",data, "status=", status);
                localStorage.setItem("token", thistoken);
                if(data.success === true){
                    $("#likes"+postId+" a span").attr("class","fa fa-fw fa-heart-o");
                    var likeNum = $("#likes"+postId+" a span").html();
                    $("#likes"+postId+" a span").html(eval(likeNum)-1);
                }
                else{
                    alert("操作失败");
                }
            }
        });
    }
}

collectPost = function(postId){
    var thistoken = localStorage.getItem("token");
    if($("#collects"+postId+" a span").attr("class") === "fa fa-fw fa-bookmark-o"){
        $.ajax({
            type:"POST",
            url:url+"/Post/Collect/"+postId,
            dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
            headers:{
                'token':thistoken
            },
            success:function(data, status){ 
                console.log("data= ",data, "status=", status);
                localStorage.setItem("token", thistoken);
                if(data.success === true){
                    $("#collects"+postId+" a span").attr("class","fa fa-fw fa-bookmark");
                    var collectionNum = $("#collects"+postId+" a span").html();
                    $("#collects"+postId+" a span").html(eval(collectionNum)+1);
                }
                else{
                    alert("操作失败");
                }
            }
        });
    }
    else {
        $.ajax({
            type:"PUT",
            url:url+"/Post/Uncollect/"+postId,
            dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
            headers:{
                'token':thistoken
            },
            success:function(data, status){ 
                console.log("data= ",data, "status=", status);
                localStorage.setItem("token", thistoken);
                if(data.success === true){
                    $("#collects"+postId+" a span").attr("class","fa fa-fw fa-bookmark-o");
                    var collectionNum = $("#collects"+postId+" a span").html();
                    $("#collects"+postId+" a span").html(eval(collectionNum)-1);
                }
                else{
                    alert("操作失败");
                }
            }
        });
    }

}

editPost = function(postId){
    self.location.href="editnotepad.html?postid="+postId;
}

getBasicNotifyFromStorage =function(){
    var html = localStorage.getItem("NotifyContent");
    var Unread = localStorage.getItem("UnreadNotifyNum");
    console.log(Unread);
    $("#Unread").html(Unread);
    $("#notification").html(html);
}

deletePost = function(id){
    var isOk = confirm("确定要删除这个帖子吗?");
    if(isOk){
        var thistoken = localStorage.getItem("token");
        $.ajax({
            type:"PUT",
            url:url+"/Post/Delete/"+postId,
            dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
            headers:{
                'token':thistoken
            },
            success:function(data, status){ 
                console.log("data= ",data, "status=", status);
                localStorage.setItem("token", thistoken);
                alert("删除成功");
                self.location.href="home.html";
            }
        });    
    }
    else {
        ;
    }
}

showAllComment=function(id){
    getAllComment(id);
    localStorage.setItem("supportIdNow",id);
    $("#allComment").modal("show");
}

addCommentModal=function(){
    var supportIdNow = localStorage.getItem("supportIdNow");
    var commentContent = $("#commentContent").val();
    // alert(commentContent + supportIdNow);
    var CommentData={
        "content": commentContent,
        "supportId": supportIdNow
    }

    var thistoken = localStorage.getItem("token");
    $.ajax({
        type:"POST",
        url:url+"/Comment/Add",
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        contentType:"application/json",  //发送信息至服务器时内容编码类型。             
        data:JSON.stringify(CommentData),
        headers:{
            'token':thistoken
        },
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            localStorage.setItem("token", thistoken);
            alert("评论成功");
            $("#allComment").modal("hide");
            $("#commentContent").val("");
            rerenderComment(supportIdNow);
            // getSupport();
        }
    });

}



addCommentNormal = function(id){
    var commentContent = $("#commentContent"+id).val();
    var CommentData={
        "content": commentContent,
        "supportId": id
    }

    var thistoken = localStorage.getItem("token");
    $.ajax({
        type:"POST",
        url:url+"/Comment/Add",
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        contentType:"application/json",  //发送信息至服务器时内容编码类型。             
        data:JSON.stringify(CommentData),
        headers:{
            'token':thistoken
        },
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            localStorage.setItem("token", thistoken);
            alert("评论成功");
            rerenderComment(id);
            // getSupport();
        }
    });
    // alert(commentContent);
}

deleteSupport = function(id){
    var putData={
        "id":id
    }
    var isOk = confirm("确定要删除您的回帖吗?");
    if(isOk){
        var thistoken = localStorage.getItem("token");
        $.ajax({
            type:"PUT",
            url:url+"/Support/Delete/",
            dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
            contentType:"application/json",  //发送信息至服务器时内容编码类型。             
            data:JSON.stringify(putData),
            headers:{
                'token':thistoken
            },
            success:function(data, status){ 
                console.log("data= ",data, "status=", status);
                localStorage.setItem("token", thistoken);
                alert("删除成功");
                getSupport();
            }
        });
    }
    else {
        ;
    }
}