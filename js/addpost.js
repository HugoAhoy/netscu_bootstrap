// var url = "http://localhost:8080";
var url;

$(function(){

    url = localStorage.getItem("url");
    getBasicNotifyFromStorage();

    $('#summernote').summernote({
	height: ($(window).height() - 500),
	toolbar: [
	    ['style', ['style']],
            ['font', ['bold', 'italic', 'underline']],
            ['para', ['ul', 'ol']],
            // ['insert', ['link', 'picture', 'hr']],
            ['insert', ['link', 'hr']],
            ['view', ['fullscreen']]
        ]

    });    
    
});

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
        "title":title,
        "content":content,
        "summary":puretext,
        "cateId":cateId
    }

    var thistoken = localStorage.getItem("token");

    $.ajax({
        type:"POST",
        url:url+"/Post/Add",
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

getBasicNotifyFromStorage =function(){
    var html = localStorage.getItem("NotifyContent");
    var Unread = localStorage.getItem("UnreadNotifyNum");
    console.log(Unread);
    $("#Unread").html(Unread);
    $("#notification").html(html);
}