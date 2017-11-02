var mongoose = require("mongoose");

//schema的意思：模式；计划；图解；概要
var userSchema = new mongoose.Schema({
	"email" : String, 
	"password" : String
});

//通过schema来创建model。mongoose.model()这个方法会返回一个类。
var User = mongoose.model("User",userSchema);

//暴露
module.exports = User;