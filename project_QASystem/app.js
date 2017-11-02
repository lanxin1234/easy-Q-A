var express = require("express");
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');

//自己的模块
var mainctrl = require("./controllers/mainctrl.js");
var registandloginctrl = require("./controllers/registandloginctrl.js");

//链接数据库，如果QASystem数据库不存在会被自动创建
mongoose.connect('mongodb://localhost/QASystem');

//设置session，只有写了这些语句，程序中才允许使用session。
app.set('trust proxy', 1) // trust first proxy 
app.use(session({
	secret: '爱前端',
	resave: false,
	saveUninitialized: true
}));
//设置模板引擎
app.set("view engine" , "ejs");
//静态化
app.use(express.static("www"));

//路由表（这里未来会有30个路由）
app.get("/",mainctrl.showIndex);
app.get("/regist",registandloginctrl.showRegist);
app.checkout("/user",registandloginctrl.checkUser);
app.post("/user",registandloginctrl.doRegist);
app.get("/login",registandloginctrl.showLogin);
app.post("/login",registandloginctrl.doLogin);

//开机
app.listen(4000 , function(){
	console.log("已经运行在了4000端口");
});