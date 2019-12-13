# API
## 注意
<!-- - 前端每次操作都要更新Token，建议封装fetch操作 -->
- URL省略域名
- 每个访问操作header都带上"token"

## 用户相关
用户包含id, name, password, email, mobile, gender, birthday, province, city, description, status, createTime
### 用户登录
- URL:/User/Login
- METHOD:POST
- DATA:
```json
{
    "name":"aaa",
    "password":"password",
}
```
- password前端加密

- Response:
```json
{
    "token":"xxxxxx",
    "status":1,
    "success":true
}
```

### 用户注册
- URL:/User/Regitration
- METHOD:POST
- DATA:
```json
{
    "name":"aaa",
    "password":"password",
    "mobile":"12345678910",
    "email":"aaa@bbb.com",
    "……":"……",
}
```
- Response:
```json
{
    "token":"xxxxxx",
}
```

### 获取账户信息
- URL:/User/Info
- METHOD:GET
- Response:
```json
{
    "name":"aaa",
    "postNum": 1,
    "collectNum": 1,
    "fansNum": 100,
    "followNum": 10,
}
```

### 获取其他用户信息
- URL:/User/Info/{id}
- METHOD:GET
- Response:
```json
{
    "name":"aaa",
    "postNum": 1,
    "collectNum": 1,
    "fansNum": 100,
    "followNum": 10,
    "followed":true,
}
```

### 修改账户信息
- URL:/User/Modify
- METHOD:PUT
- DATA:
```json
{
    "name":"aaa",
    "email":"123@aaa.com",
    "mobile":"12233355555",
    "gender":"female",
    "birthday":"1990-1-30",
    "province":"北京",
    "city":"北京",
    "description":"hhha"
}
```
- Response:
```json
{
    "success":true
}
```

### 关注用户
- URL:/User/Follow
- METHOD:POST
- DATA:
```json
{
    "id": 2
}
```
- Response:
```json
{
    "success":true
}
```

### 取消关注用户
- URL:/User/Unfollow
- METHOD:POST
- DATA:
```json
{
    "id": 2
}
```
- Response:
```json
{
    "success":true
}
```

## 回帖评论相关
### 增加评论
- URL:/Comment/Add
- METHOD:POST
- DATA:
```json
{
    "fatherId":1,//可以不写，表示直接评论回帖
    "content":"xswl",
    "supportId":2,//回帖的id
}
```
- Response:
```json
{
    "success":true
}
```

### 查询评论
- URL:/Comment/{supportId}
- METHOD:Get
- Response:
```json
{
    "data":
    [
        {
            "uid":3,
            "fatherId":1,
            "content":"xswl",
            "createTime":"2019-12-08 21:19:54"
        },
        "..."
    ]
}
```

### 删除评论
- URL:/Comment/{id}
- METHOD:DELETE
- DATA:
```json
{
    "fatherId":1,//可以不写，表示直接评论回帖
    "content":"xswl",
    "supportId":2,//回帖的id
}
```
- Response:
```json
{
    "success":true
}
```

## 板块相关

### 获取所有板块名字和id
- URL:/Cate/BasicInfo
- METHOD:GET
- Response:
```json
{
    "data":
    [
        {
            "id":1,
            "name":"生活",
            "icon":"./life.jpg"
        },
        "..."
    ]
}
```

### 获得板块详细信息
- URL:/Cate/Info/{id}
- METHOD:GET
- Response:
```json
{
    "id":1,
    "name":"生活",
    "icon":"./life.jpg",
    "description":"生活版主要是发布一些学校生活相关的帖子..."
}
```

## 主题帖相关

### 增加主题帖

- URL:/Post/Add
- METHOD:POST
- DATA:

```json
{
    "title":"四川大学第五届网球比赛开始啦!",
    "cateId":3,
    "summary":"Tenis Prince\nCom' on",
    "content":"<h1>Tenis Prince</h1><p>Com' on</p><img src=\"a.jpg\" />"
}
```

- Response:

```json
{
    "success":true,
    "id":233
}
```

### 更新主题帖

- URL:/Post/Modify
- METHOD:PUT
- DATA:

```json
{
    "id":1, 
    "title":"四川大学第五届网球比赛开始啦!",
    "cateId":3,
    "content":"<h1>Tenis Prince</h1><p>Com' on</p><img src=\"a.jpg\" />"
}
```
- Response:
```json
{
    "success":true,
}
```


### 主题帖基本信息 X
- URL:/Post/BasicInfo/{PageCount}/{PageNum}
- METHOD:GET
- Response:
```json
{
    "Finish":false,//表示是否把所有的最新主贴全部访问完了
    "data":
    [
        {
            "id":1,
            "uid":2,
            "title":"hhh",
            "summary":"ss",
            "createTime":"2019-11-12 11:23:11",
            "updateTime":"2019-11-13 22:46:22",
            "collectionNum":"12",
            "viewNum":"12",
            "collected":true,
            "liked":true
        },
        "..."
    ]
}
```

### 主题帖详细信息 X
- URL:/Post/Info/{id}
- METHOD:GET
- Response:
```json
{
    "id":1,
    "uid":1,
    "cateId":2,
    "title":"hhh",
    "summary":"ss",
    "content":"<h1>TestExample</h1><p>fss</p>",
    "createTime":"2019-11-12 11:23:11",
    "updateTime":"2019-11-13 11:23:11",
    "collectionNum":"12",
    "commentNum":"11",
    "isOwner":true,
    "collected":true,
    "liked":true
}
```

### 删除主题帖
- URL:/Post/Delete/{id}
- METHOD:PUT
- Response:
```json
{
    "success":true
}
```

### 收藏主贴 X
- URL:/Post/Collect/{id}
- METHOD:POST
- Response:
```json
{
    "success":true
}
```

### 取消收藏主贴 X
- URL:/Post/Uncollect/{id}
- METHOD:POST
- Response:
```json
{
    "success":true
}
```


### 取消点赞主贴 X
- URL:/Post/Unlike/{id}
- METHOD:POST
- Response:
```json
{
    "success":true
}
```

### 查看收藏列表 X
- URL:/Post/MyCollection
- METHOD:GET
- Response:
```json
{
    "data":
    [
        {
            "id":1,
            "uid":1,
            "title":"hhh",
            "summary":"ss",
            "createTime":"2019-11-12 11:23:11",
            "updateTime":"2019-11-13 22:46:22",
            "collectionNum":"12",
            "viewNum":"12"
        },
        "..."
    ]
}
```


## 回帖模块

### 查看回帖 X
- URL:/Support/PostId/{id}/{pageCount}/{pageNum}
- METHOD:GET
- Response:
```json
{
    "Finish":true,
    "uid":5, // 此处为用户本人id,与data中的uid不同
    "data":
    [
        {
            "id":1,
            "uid":1,
            "content":"lalla",
            "commentNum":5,
            "createTime":"2019:10-10 11:19:12",
            "createTime":"2019:10-10 11:20:00",
        },
        "..."
    ]
}
```

### 增加回帖 X
- URL:/Support/Add
- METHOD:POST
- DATA:
```json
{
    "postId": 1,
    "content":"no good"
}
```
- Response:
```json
{
    "success":true
}
```
### 删除回帖 X
- URL:/Support/DELETE
- METHOD:PUT
- DATA:
```json
{
    "supportId": 1
}
```
- Response:
```json
{
    "success":true
}
```
### 修改回帖 X
- URL:/Support/Add
- METHOD:PUT
- DATA:
```json
{
    "supportId":1,
    "content":"no good",
}
```
- Response:
```json
{
    "success":true
}
```

## 通知模块

### 查看通知 X
- URL:/Notify/Mine
- METHOD:GET
- Response:
```json
{
    "data":
    [
        {
            "id":1,
            "uid":2,
            "type":"点赞",
            "postId":2,
            "title":"lala",
            "isRead":1,//1表示已读,0表示未读
            "createTime":"2019-10-10 11:11:11"
        },
        "..."
    ]
}
```

### 通知已读 X
- URL:/Notify/Read/{id}
- METHOD:PUT
- Response:
```json
{
    "success":true
}
```