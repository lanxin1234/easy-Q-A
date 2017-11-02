var formidable = require("formidable");
var User = require("../models/User.js");
var crypto = require("crypto");

exports.showRegist = function(req,res){
	res.render("regist" , {
		"locate" : "regist" , 
		"title" : "注册",
		"login" : req.session.login
	});
}

exports.showLogin = function(req,res){
	res.render("login" , {
		"locate" : "login" , 
		"title" : "登录",
		"login" : req.session.login
	});
}

//检查用户名是否存在
exports.checkUser = function(req,res){
	//首先应该得到用户传入的数据。这里使用formidable这个库。
	var form = new formidable.IncomingForm();
	//注意这里的回调的嵌套，先用formidable识别用户的数据，然后持久化。
	form.parse(req , function(err , fields , files){
		User.find({"email" : fields.email} , function(err , results){
			res.json({"result" : results.length != 0});
		});
	});
}

//执行注册
exports.doRegist = function(req,res){
	//首先应该得到用户传入的数据。这里使用formidable这个库。
	var form = new formidable.IncomingForm();
	//注意这里的回调的嵌套，先用formidable识别用户的数据，然后持久化。
	form.parse(req , function(err , fields , files){
		//这里再次检查用户名是否被占用！
		User.find({"email" : fields.email} , function(err , results){
			if(err){
				res.json({"result" : -1});
				return;
			}
			if(results.length == 0){
				//如果用户名没有被占用，此时才能存入数据库：
				//持久化
				var u = new User({
					"email" : fields.email , 
					//下面要将加密之后的用户密码存储到数据库中：
					"password" : crypto.createHash('sha256').update(fields.password).digest("hex")
				});
				u.save(function(err){
					if(err){
						res.json({"result" : -1});
						return;
					}
					//这是一个新的语法，res.json()表示显示json数据。
					res.json({"result" : 1})
				});
			}else{
				res.json({"result" : -2})
			}
		});
		
	});
}


//登录
exports.doLogin = function(req,res){
	var form = new formidable.IncomingForm();
	form.parse(req , function(err , fields , files){
		//加密密码
		var password = crypto.createHash('sha256').update(fields.password).digest("hex");
		//在数据库中寻找
		User.find({"email" : fields.email , "password" : password} , function(err,results){
			if(results.length != 0){
				//当用户登录成功之后，要发给用户一个session奖励一下！
				//注意设置session必须设置给req对象，不能给res对象设置。
				//必须在res.json()函数之前设置session。
				req.session.login = true;		//记录这个用户已经登录了！！
				req.session.email = fields.email;
				res.json({"result" : 1});
			}else{
				res.json({"result" : -1});
			}
		});
	});
}