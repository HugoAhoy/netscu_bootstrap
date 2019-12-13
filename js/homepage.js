var url = "http://localhost:8080";
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
        getBasicInfo();
    }
});
$(window).scroll(function () {
    var scrollTop = $(this).scrollTop();
    var scrollHeight = $(document).height();
    var windowHeight = $(this).height();
    if (scrollTop + windowHeight == scrollHeight) {
   　　 //此处是滚动条到底部时候触发的事件，在这里写要加载的数据，或者是拉动滚动条的操作
    　　//shlar page = Number($("#redgiftNextPage").attr('currentpage')) + 1;
    　　//redgiftList(page);
  　　 //$("#redgiftNextPage").attr('currentpage', page + 1);

　　　　console.log("到底了,发起请求")
　　}
});

gotoDetail=function(id){
    self.location.href="PostDetail.html?postid="+id;
}

renderPostBasic = function(data){
    let content = $("#PostBasicContents").html();
    // console.log(content);
    // console.log("here1");
    for(var i = 0; i < data.length; i++){
        content +="<div class=\"col-sm-4\">";
        content +="    <div class=\"panel panel-default\">";
        content +="        <div class=\"panel-heading\">";
        content +=data[i].title;
        content +="        </div>";
        content +="        <div class=\"panel-body\">";
        content +="            <p>"+data[i].summary +"</p>";
        content +="        </div>";
        content +="        <div class=\"panel-footer\">";
        content +="            <button type=\"button\" onclick=\"gotoDetail("+data[i].id+")\" class=\"btn btn-primary\">详情</button>";
        content +="        </div>";
        content +="    </div>";
        content +="</div>";
    }
    // console.log(content);
    $("#PostBasicContents").html(content);
}

getBasicInfo = function(){
    console.log("exe");
    var numPerPage = 10;
    var page = $("#currentPage").val();
    // 获取信息
    var thistoken = localStorage.getItem("token");
    // tokentouse = thistoken;
    // console.log("token",tokentouse);
    $.ajax({ 
        type:"GET", 
        url:url+"/Post/BasicInfo/"+page+"/"+numPerPage,
        dataType:"json",  // 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如XML MIME类型就被识别为XML。
        headers:{
            'token':thistoken
        },
        success:function(data, status){ 
            console.log("data= ",data, "status=", status);
            // localStorage.setItem("token", thistoken);
            renderPostBasic(data.data);
            // localStorage.removeItem("token");
            // localStorage.setItem("token", thistoken);
            // var newtoken = localStorage.getItem("token");
            // console.log(newtoken);
            // self.location.href="home.html"
        }
    });
    $("#currentPage").val(eval(page)+1);    
}