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
        getBasicInfo();
        setBasic();
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

transNum = function(num){
    if(eval(num) < 999){
        return num;
    }
    else{
        if(eval(num)/1000 < 10){
            return eval(num)/1000+"k";
        }
        else{
            return "10k+";
        }
    }
}

renderPostBasic = function(data, Finish){
    let content = $("#PostBasicContents").html();
    // console.log(content);
    // console.log("here1");
    for(var i = 0; i < data.length; i++){
        content +="<div class=\"col-sm-4\" onclick=\"gotoDetail("+data[i].id+")\" >";
        content +="    <div class=\"panel panel-default\">";
        content +="        <div class=\"panel-heading\">";
        content +=data[i].title;
        content +="        </div>";
        content +="        <div class=\"panel-body\">";
        content +="            <p>"+data[i].summary +"</p>";
        content +="        </div>";
        content +="        <div class=\"panel-footer\">";
        content +="            <div class=\"row\">";
        content +="                <div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">";
        content +="                    <a>";
        content +="                        <span class=\"fa fa-fw fa-align-justify\" style=\"color: rgb(246, 141, 0);\"></span>";
        content += "                   </a>";
        content +="                </div>";

        content +="                <div class=\"col-xs-3 col-xs-offset-4 col-sm-3 col-sm-offset-4 col-md-3 col-md-offset-4 col-lg-3 col-lg-offset-4\">";
        content +="                    <i class=\"fa fa-fw fa-eye\"></i>"+data[i].viewNum;
        content +="                </div>";

        // content +="                <div class=\"col-xs-2 col-xs-offset-1 col-sm-2 col-sm-offset-1 col-md-2 col-md-offset-1 col-lg-2 col-lg-offset-1\">";
        content +="                <div class=\"col-xs-3 col-sm-3 col-md-3 col-lg-3\">";
        content +="                    <i class=\"fa fa-fw fa-bookmark\"></i>"+data[i].collectionNum;
        content +="                </div>";

        content +="            </div>";
        // content +="            <button type=\"button\" onclick=\"gotoDetail("+data[i].id+")\" class=\"btn btn-primary\">详情</button>";
        content +="        </div>";
        content +="    </div>";
        content +="</div>";
    }
    content +="<ul class=\"pager\">";
    var currenPage = localStorage.getItem("page");
    if(currenPage === "1"){
        content +="<li><a href=\"javascript:changePage(1);\">&raquo;</a></li>";
    }
    if(Finish === true){
        content +="<li><a href=\"javascript:changePage(-1);\">&laquo;</a></li>";
    }
    content +="</ul>";
    // console.log(content);
    $("#PostBasicContents").html(content);
}

getBasicInfo = function(){
    console.log("exe");
    var numPerPage = 9;
    var page = localStorage.getItem("page");
    // var page = $("#currentPage").val();
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
            renderPostBasic(data.data, data.Finish);
            // localStorage.removeItem("token");
            // localStorage.setItem("token", thistoken);
            // var newtoken = localStorage.getItem("token");
            // console.log(newtoken);
            // self.location.href="home.html"
        }
    });
    $("#currentPage").val(eval(page)+1);    
}

changePage=function(direction){
    if(direction === -1){
        var page = localStorage.getItem("page");
        page = eval(page) - 1;
        localStorage.setItem("page", page);
    }
    else{
        var page = localStorage.getItem("page");
        page = eval(page) + 1;
        localStorage.setItem("page", page);
    }
    self.location.href="home.html";
}

setBasic=function(){
    var username = localStorage.getItem("username");
    var user = "<a style=\"cursor:default;\"><strong>"+username+"</strong></a>";
    console.log(username);
    console.log(user);
    $("li#userinfo").html(user);
}